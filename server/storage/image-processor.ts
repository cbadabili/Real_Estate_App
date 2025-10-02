
import sharp from 'sharp';
import { createHash } from 'crypto';

export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
  processedUrl?: string;
  metadata?: {
    width: number;
    height: number;
    format: string;
    size: number;
    hash?: string;
  };
}

export class ImageProcessor {
  private static readonly MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
  private static readonly MAX_DIMENSION = 4096;
  private static readonly ALLOWED_FORMATS = ['jpeg', 'png', 'webp'];

  static async validateAndProcess(imageData: string | null | undefined): Promise<ImageValidationResult> {
    try {
      if (!imageData) {
        return { isValid: false, error: 'No image data provided' };
      }
      // Extract data URL info
      const matches = imageData.match(/^data:image\/([^;]+);base64,(.+)$/);
      if (!matches) {
        return { isValid: false, error: 'Invalid image format' };
      }

      const mimeType = matches[1]?.toLowerCase();
      const base64Data = matches[2];

      if (!mimeType || !base64Data) {
        return { isValid: false, error: 'Invalid image payload' };
      }

      if (!this.ALLOWED_FORMATS.includes(mimeType)) {
        return { isValid: false, error: 'Unsupported image format' };
      }

      // Convert base64 to buffer
      const buffer = Buffer.from(base64Data, 'base64');
      
      if (buffer.length > this.MAX_SIZE_BYTES) {
        return { isValid: false, error: 'Image too large' };
      }

      // Process with Sharp
      const image = sharp(buffer);
      const metadata = await image.metadata();

      if (!metadata.width || !metadata.height) {
        return { isValid: false, error: 'Invalid image metadata' };
      }

      if (metadata.width > this.MAX_DIMENSION || metadata.height > this.MAX_DIMENSION) {
        return { isValid: false, error: 'Image dimensions too large' };
      }

      // Strip EXIF and optimize
      const processedBuffer = await image
        .rotate() // Auto-rotate based on EXIF
        .jpeg({ quality: 85, progressive: true })
        .toBuffer();

      // Generate hash for deduplication
      const hash = createHash('sha256').update(processedBuffer).digest('hex');
      const processedUrl = `data:image/jpeg;base64,${processedBuffer.toString('base64')}`;

      return {
        isValid: true,
        processedUrl,
        metadata: {
          width: metadata.width,
          height: metadata.height,
          format: 'jpeg',
          size: processedBuffer.length,
          hash,
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Image processing failed';
      return { isValid: false, error: message };
    }
  }

  static async processImageArray(images: string[]): Promise<{
    validImages: string[];
    errors: string[];
  }> {
    const validImages: string[] = [];
    const errors: string[] = [];

    for (const image of images) {
      const result = await this.validateAndProcess(image);
      if (result.isValid && result.processedUrl) {
        validImages.push(result.processedUrl);
      } else {
        errors.push(result.error || 'Unknown processing error');
      }
    }

    return { validImages, errors };
  }
}

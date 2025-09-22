import sharp from 'sharp';
import { createHash } from 'crypto';
export class ImageProcessor {
    static async validateAndProcess(imageData) {
        try {
            // Extract data URL info
            const matches = imageData.match(/^data:image\/([^;]+);base64,(.+)$/);
            if (!matches) {
                return { isValid: false, error: 'Invalid image format' };
            }
            const [, mimeType, base64Data] = matches;
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
                .removeMetadata()
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
                },
            };
        }
        catch (error) {
            return { isValid: false, error: 'Image processing failed' };
        }
    }
    static async processImageArray(images) {
        const validImages = [];
        const errors = [];
        for (const image of images) {
            const result = await this.validateAndProcess(image);
            if (result.isValid && result.processedUrl) {
                validImages.push(result.processedUrl);
            }
            else {
                errors.push(result.error || 'Unknown processing error');
            }
        }
        return { validImages, errors };
    }
}
ImageProcessor.MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
ImageProcessor.MAX_DIMENSION = 4096;
ImageProcessor.ALLOWED_FORMATS = ['jpeg', 'png', 'webp'];

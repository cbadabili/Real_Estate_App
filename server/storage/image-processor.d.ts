export interface ImageValidationResult {
    isValid: boolean;
    error?: string;
    processedUrl?: string;
    metadata?: {
        width: number;
        height: number;
        format: string;
        size: number;
    };
}
export declare class ImageProcessor {
    private static readonly MAX_SIZE_BYTES;
    private static readonly MAX_DIMENSION;
    private static readonly ALLOWED_FORMATS;
    static validateAndProcess(imageData: string): Promise<ImageValidationResult>;
    static processImageArray(images: string[]): Promise<{
        validImages: string[];
        errors: string[];
    }>;
}

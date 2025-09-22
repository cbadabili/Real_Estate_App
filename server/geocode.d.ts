export type GeocodeResult = {
    longitude: number;
    latitude: number;
} | null;
export declare function geocodeAddress(address: string): Promise<GeocodeResult>;

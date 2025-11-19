import fetch from "node-fetch";

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY ?? process.env.VITE_GOOGLE_MAPS_API_KEY;

export type GeocodeResult = { longitude: number; latitude: number } | null;

export async function geocodeAddress(address: string): Promise<GeocodeResult> {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('No Google Maps API key available for geocoding');
    return null;
  }

  try {
    // Bias to Gaborone & restrict to Botswana (BW)
    const q = encodeURIComponent(`${address}, Gaborone, Botswana`);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${q}&region=bw&key=${GOOGLE_MAPS_API_KEY}`;

    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`Geocoding API error: ${res.status}`);
      return null;
    }

    const data = await res.json() as any;

    const result = data?.results?.[0];
    const location = result?.geometry?.location;
    if (!location) {
      console.warn(`No geocoding results for: ${address}`);
      return null;
    }

    const { lat, lng } = location;
    // Botswana bounds sanity check
    if (lng < 20 || lng > 29 || lat < -27 || lat > -17) {
      console.warn(`Geocoding result outside Botswana bounds: ${lng}, ${lat}`);
      return null;
    }

    console.log(`Geocoded "${address}" to ${lat}, ${lng}`);
    return { longitude: lng, latitude: lat };
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}
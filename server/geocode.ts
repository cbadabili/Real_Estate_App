import fetch from "node-fetch";

const MAPBOX_TOKEN = process.env.VITE_MAPBOX_ACCESS_TOKEN;

export type GeocodeResult = { longitude: number; latitude: number } | null;

export async function geocodeAddress(address: string): Promise<GeocodeResult> {
  if (!MAPBOX_TOKEN) {
    console.warn('No Mapbox token available for geocoding');
    return null;
  }

  try {
    // Bias to Gaborone & restrict to Botswana (BW)
    const q = encodeURIComponent(address + ", Gaborone, Botswana");
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${q}.json?access_token=${MAPBOX_TOKEN}&country=bw&limit=1&proximity=25.92,-24.65`; // ~Gaborone

    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`Geocoding API error: ${res.status}`);
      return null;
    }
    
    const data = await res.json();

    const f = data?.features?.[0];
    if (!f?.center?.length) {
      console.warn(`No geocoding results for: ${address}`);
      return null;
    }

    const [lng, lat] = f.center;
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
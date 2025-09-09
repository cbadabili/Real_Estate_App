import { db } from "../server/db";
import { properties } from "../shared/schema";
import { eq } from "drizzle-orm";
import { geocodeAddress } from "../server/geocode";

const IN_BW = (lng: number, lat: number) => lng >= 20 && lng <= 29 && lat >= -27 && lat <= -17;

async function run() {
  console.log('🔄 Starting coordinate backfill...');
  
  const rows = await db.select().from(properties);
  console.log(`Found ${rows.length} properties to check`);
  
  for (const p of rows) {
    const hasValidCoords = p.latitude != null && p.longitude != null && IN_BW(p.longitude, p.latitude);
    
    if (hasValidCoords) {
      console.log(`✅ ${p.id}: ${p.address} already has valid coordinates`);
      continue;
    }

    if (!p.address) {
      console.log(`⚠️  ${p.id}: No address available for geocoding`);
      continue;
    }
    
    console.log(`🔍 Geocoding: ${p.id} - ${p.address}`);
    const geo = await geocodeAddress(p.address);
    
    if (geo) {
      await db.update(properties)
        .set({ latitude: geo.latitude, longitude: geo.longitude })
        .where(eq(properties.id, p.id));
      console.log(`✅ Updated ${p.id}: ${p.address} -> ${geo.latitude}, ${geo.longitude}`);
    } else {
      console.warn(`❌ Failed geocode: ${p.id} :: ${p.address}`);
    }
    
    // Small delay to be nice to the API
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('🎉 Geocoding backfill complete!');
  process.exit(0);
}

run().catch(e => { 
  console.error('💥 Error during backfill:', e); 
  process.exit(1); 
});
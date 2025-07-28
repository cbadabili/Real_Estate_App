
import { db } from '../server/db.js';
import { properties } from '../shared/schema.js';
import { eq, or, isNull } from 'drizzle-orm';

// Botswana city coordinates
const botswanaCities = {
  'Gaborone': { lat: -24.6282, lng: 25.9231 },
  'Francistown': { lat: -21.1670, lng: 27.5084 },
  'Kasane': { lat: -17.8145, lng: 25.1503 },
  'Maun': { lat: -20.0028, lng: 23.4162 },
  'Palapye': { lat: -22.5500, lng: 26.8167 },
  'Serowe': { lat: -22.3833, lng: 26.7167 },
  'Lobatse': { lat: -25.2167, lng: 25.6833 },
  'Molepolole': { lat: -24.4167, lng: 25.5000 }
};

function getRandomOffset() {
  return (Math.random() - 0.5) * 0.02; // ~1km radius
}

function getCityCoordinates(address: string | null, city: string | null): { lat: number, lng: number } {
  const locationText = (address || city || '').toLowerCase();
  
  for (const [cityName, coords] of Object.entries(botswanaCities)) {
    if (locationText.includes(cityName.toLowerCase())) {
      return {
        lat: coords.lat + getRandomOffset(),
        lng: coords.lng + getRandomOffset()
      };
    }
  }
  
  // Default to Gaborone with random offset
  return {
    lat: botswanaCities.Gaborone.lat + getRandomOffset(),
    lng: botswanaCities.Gaborone.lng + getRandomOffset()
  };
}

async function fixPropertyCoordinates() {
  try {
    console.log('🔍 Finding properties with missing coordinates...');
    
    const propertiesWithoutCoords = await db
      .select()
      .from(properties)
      .where(
        or(
          isNull(properties.latitude),
          isNull(properties.longitude),
          eq(properties.latitude, 0),
          eq(properties.longitude, 0)
        )
      );

    console.log(`📍 Found ${propertiesWithoutCoords.length} properties needing coordinate fixes`);

    for (const property of propertiesWithoutCoords) {
      const coords = getCityCoordinates(property.address, property.city);
      
      await db
        .update(properties)
        .set({
          latitude: coords.lat,
          longitude: coords.lng
        })
        .where(eq(properties.id, property.id));

      console.log(`✅ Updated property ${property.id} (${property.title}): ${coords.lat}, ${coords.lng}`);
    }

    console.log('🎉 All property coordinates fixed!');
  } catch (error) {
    console.error('❌ Error fixing coordinates:', error);
  }
}

// Run the fix
fixPropertyCoordinates();

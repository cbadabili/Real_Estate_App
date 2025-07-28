
import { db } from '../server/db';

async function fixMapCoordinates() {
  console.log('🗺️ Fixing map coordinates for all properties...');

  try {
    // Get all properties that need coordinate fixes
    const propertiesNeedingFix = await db.all(`
      SELECT id, title, city, latitude, longitude 
      FROM properties 
      WHERE 
        latitude IS NULL OR latitude = 0 OR latitude = '' OR 
        longitude IS NULL OR longitude = 0 OR longitude = '' OR
        latitude < -90 OR latitude > 90 OR 
        longitude < -180 OR longitude > 180
    `);

    console.log(`Found ${propertiesNeedingFix.length} properties needing coordinate fixes`);

    if (propertiesNeedingFix.length === 0) {
      console.log('✅ All properties already have valid coordinates');
      return;
    }

    // Botswana approximate bounds
    const botswanaBounds = {
      north: -17.78,
      south: -26.87,
      east: 29.43,
      west: 19.99
    };

    // City coordinates for Botswana
    const cityCoordinates: { [key: string]: [number, number] } = {
      'gaborone': [25.9231, -24.6282],
      'francistown': [27.5084, -21.1670],
      'molepolole': [25.4923, -24.4071],
      'kanye': [25.3311, -24.9766],
      'serowe': [26.7172, -22.3928],
      'mahalapye': [26.8442, -23.1080],
      'lobatse': [25.6844, -25.2267],
      'selibe phikwe': [27.8247, -22.0058],
      'maun': [23.4162, -20.0028],
      'kasane': [25.1534, -17.8154]
    };

    let updatedCount = 0;

    for (const property of propertiesNeedingFix) {
      let lat: number, lng: number;
      
      // Try to match city to known coordinates
      const cityName = property.city?.toLowerCase() || '';
      if (cityCoordinates[cityName]) {
        [lng, lat] = cityCoordinates[cityName];
        // Add small random offset to avoid exact duplicates
        lat += (Math.random() - 0.5) * 0.01;
        lng += (Math.random() - 0.5) * 0.01;
      } else {
        // Generate random coordinates within Botswana bounds
        lat = botswanaBounds.south + Math.random() * (botswanaBounds.north - botswanaBounds.south);
        lng = botswanaBounds.west + Math.random() * (botswanaBounds.east - botswanaBounds.west);
      }

      // Update the property
      await db.run(
        `UPDATE properties SET latitude = ?, longitude = ? WHERE id = ?`,
        [lat, lng, property.id]
      );

      console.log(`✅ Updated property ${property.id} "${property.title}" with coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      updatedCount++;
    }

    console.log(`🎉 Successfully updated ${updatedCount} properties with valid coordinates`);

    // Verify the fixes
    const remaining = await db.all(`
      SELECT COUNT(*) as count 
      FROM properties 
      WHERE 
        latitude IS NULL OR latitude = 0 OR latitude = '' OR 
        longitude IS NULL OR longitude = 0 OR longitude = '' OR
        latitude < -90 OR latitude > 90 OR 
        longitude < -180 OR longitude > 180
    `);

    if (remaining[0].count === 0) {
      console.log('✅ All properties now have valid coordinates!');
    } else {
      console.log(`⚠️ ${remaining[0].count} properties still need coordinate fixes`);
    }

  } catch (error) {
    console.error('❌ Error fixing coordinates:', error);
  }
}

// Run the fix
fixMapCoordinates().catch(console.error);


import { db } from '../server/db';

async function diagnoseMapProperties() {
  console.log('🔍 Diagnosing map property display issues...\n');

  try {
    // Check total properties
    const allProperties = await db.all('SELECT * FROM properties WHERE status = "active"');
    console.log(`📊 Total active properties: ${allProperties.length}`);

    // Check properties with coordinates
    const propertiesWithCoords = allProperties.filter(p => 
      p.latitude != null && p.longitude != null && 
      p.latitude !== 0 && p.longitude !== 0 &&
      !isNaN(parseFloat(p.latitude)) && !isNaN(parseFloat(p.longitude))
    );
    console.log(`📍 Properties with valid coordinates: ${propertiesWithCoords.length}`);

    // Check coordinate validity for Botswana
    const botswanaProperties = propertiesWithCoords.filter(p => {
      const lat = parseFloat(p.latitude);
      const lng = parseFloat(p.longitude);
      return lat >= -26.9 && lat <= -17.8 && lng >= 20.0 && lng <= 29.4;
    });
    console.log(`🇧🇼 Properties with Botswana coordinates: ${botswanaProperties.length}`);

    // Show sample properties
    console.log('\n📋 Sample properties:');
    allProperties.slice(0, 5).forEach(p => {
      console.log(`  ID: ${p.id}, Title: "${p.title}", Lat: ${p.latitude}, Lng: ${p.longitude}`);
    });

    // Check for coordinate issues
    const missingCoords = allProperties.filter(p => 
      p.latitude == null || p.longitude == null || 
      p.latitude === 0 || p.longitude === 0
    );
    
    if (missingCoords.length > 0) {
      console.log(`\n⚠️  ${missingCoords.length} properties missing coordinates:`);
      missingCoords.forEach(p => {
        console.log(`  - ID: ${p.id}, "${p.title}" (${p.latitude}, ${p.longitude})`);
      });
    }

    return {
      total: allProperties.length,
      withCoords: propertiesWithCoords.length,
      inBotswana: botswanaProperties.length,
      missing: missingCoords.length
    };

  } catch (error) {
    console.error('❌ Error diagnosing properties:', error);
    return null;
  }
}

async function fixMissingCoordinates() {
  console.log('🔧 Fixing missing coordinates...\n');
  
  try {
    // Gaborone area coordinates with slight variations
    const gaboroneBaseCoords = { lat: -24.6282, lng: 25.9231 };
    
    // Update properties missing coordinates
    const result = await db.run(`
      UPDATE properties 
      SET 
        latitude = ? + (RANDOM() % 100 - 50) * 0.001,
        longitude = ? + (RANDOM() % 100 - 50) * 0.001
      WHERE 
        (latitude IS NULL OR latitude = 0 OR longitude IS NULL OR longitude = 0)
        AND status = 'active'
    `, [gaboroneBaseCoords.lat, gaboroneBaseCoords.lng]);

    console.log(`✅ Updated ${result.changes} properties with Gaborone area coordinates`);
    
    // Add some test properties if none exist
    const propertiesCount = await db.get('SELECT COUNT(*) as count FROM properties WHERE status = "active"');
    
    if (propertiesCount.count < 3) {
      console.log('➕ Adding test properties...');
      
      const testProperties = [
        {
          title: 'Modern Family Home - Gaborone West',
          price: 1250000,
          latitude: -24.6200,
          longitude: 25.9100,
          propertyType: 'house',
          bedrooms: 4,
          bathrooms: 3,
          address: 'Gaborone West',
          city: 'Gaborone',
          district: 'South East',
          description: 'Beautiful family home with garden and modern amenities'
        },
        {
          title: 'Executive Apartment - CBD',
          price: 850000,
          latitude: -24.6350,
          longitude: 25.9250,
          propertyType: 'apartment',
          bedrooms: 2,
          bathrooms: 2,
          address: 'Gaborone CBD',
          city: 'Gaborone',
          district: 'South East',
          description: 'Modern apartment in the heart of the city'
        },
        {
          title: 'Residential Plot - Mogoditshane',
          price: 350000,
          latitude: -24.6833,
          longitude: 25.8667,
          propertyType: 'Land/Plot',
          bedrooms: 0,
          bathrooms: 0,
          address: 'Mogoditshane',
          city: 'Mogoditshane',
          district: 'South East',
          description: 'Prime residential plot ready for development'
        }
      ];

      for (const property of testProperties) {
        await db.run(`
          INSERT INTO properties (
            title, price, latitude, longitude, property_type, bedrooms, bathrooms,
            address, city, district, description, status, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', datetime('now'), datetime('now'))
        `, [
          property.title, property.price, property.latitude, property.longitude,
          property.propertyType, property.bedrooms, property.bathrooms,
          property.address, property.city, property.district, property.description
        ]);
      }
      
      console.log(`✅ Added ${testProperties.length} test properties`);
    }

  } catch (error) {
    console.error('❌ Error fixing coordinates:', error);
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('fix')) {
    await fixMissingCoordinates();
    console.log('\n🔄 Re-running diagnosis after fix...\n');
  }
  
  const diagnosis = await diagnoseMapProperties();
  
  if (diagnosis) {
    console.log('\n📈 Summary:');
    console.log(`  Total properties: ${diagnosis.total}`);
    console.log(`  With coordinates: ${diagnosis.withCoords}`);
    console.log(`  In Botswana: ${diagnosis.inBotswana}`);
    console.log(`  Missing coords: ${diagnosis.missing}`);
    
    if (diagnosis.missing > 0 && !args.includes('fix')) {
      console.log('\n💡 Run with "fix" argument to add coordinates:');
      console.log('   npx tsx scripts/debug-map-properties.ts fix');
    }
  }
}

main().catch(console.error);

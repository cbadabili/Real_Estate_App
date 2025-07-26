import { db } from '../server/db';

async function diagnoseMapProperties() {
  console.log('🔍 Diagnosing map property display issues...');

  try {
    // Check total properties and their coordinates
    const allProperties = await db.all(`
      SELECT 
        id, title, city, state, latitude, longitude, status
      FROM properties 
      WHERE status = 'active'
    `);

    console.log(`\n📊 Found ${allProperties.length} active properties:`);

    let validCoords = 0;
    let missingCoords = 0;

    allProperties.forEach(prop => {
      const hasCoords = prop.latitude && prop.longitude && 
                       prop.latitude !== '0' && prop.longitude !== '0' &&
                       !isNaN(parseFloat(prop.latitude)) && !isNaN(parseFloat(prop.longitude));

      if (hasCoords) {
        validCoords++;
        console.log(`✅ ${prop.title} (${prop.city}, ${prop.state}): ${prop.latitude}, ${prop.longitude}`);
      } else {
        missingCoords++;
        console.log(`❌ ${prop.title} (${prop.city}, ${prop.state}): Missing coordinates`);
      }
    });

    console.log(`\n📈 Summary:`);
    console.log(`   • Properties with valid coordinates: ${validCoords}`);
    console.log(`   • Properties missing coordinates: ${missingCoords}`);
    console.log(`   • Total active properties: ${allProperties.length}`);

    if (missingCoords > 0) {
      console.log('\n🚨 Issue: Some properties are missing coordinates');
      console.log('💡 Solution: Run "npx tsx scripts/debug-map-properties.ts fix" to add coordinates');
    }

    if (allProperties.length === 0) {
      console.log('\n🚨 Issue: No active properties found');
      console.log('💡 Solution: Check your database seeding or property status');
    }

  } catch (error) {
    console.error('❌ Error diagnosing properties:', error);
  }
}

async function fixMissingCoordinates() {
  console.log('🔧 Fixing missing coordinates...');

  try {
    const gaboroneLat = -24.6282;
    const gaboroneLng = 25.9231;

    // First, get properties that need coordinate fixes
    const propertiesNeedingFix = await db.all(`
      SELECT id, city FROM properties 
      WHERE 
        (latitude IS NULL OR latitude = 0 OR latitude = '' OR longitude IS NULL OR longitude = 0 OR longitude = '')
        AND status = 'active'
    `);

    console.log(`Found ${propertiesNeedingFix.length} properties needing coordinate fixes`);

    // Update each property individually with random coordinates around Gaborone
    for (const prop of propertiesNeedingFix) {
      const randomLat = gaboroneLat + (Math.random() - 0.5) * 0.02;
      const randomLng = gaboroneLng + (Math.random() - 0.5) * 0.02;

      await db.run(`
        UPDATE properties 
        SET latitude = ?, longitude = ?
        WHERE id = ?
      `, [randomLat.toString(), randomLng.toString(), prop.id]);
    }

    console.log(`✅ Updated ${propertiesNeedingFix.length} properties with coordinates`);

    // Add some test properties if we have very few
    const count = await db.get(`SELECT COUNT(*) as count FROM properties WHERE status = 'active'`);

    if (count.count < 3) {
      console.log('🏠 Adding test properties...');

      const testProperties = [
        {
          title: 'Modern Family Home',
          description: 'Beautiful 3-bedroom house in Gaborone',
          price: '850000',
          address: '123 Independence Ave',
          city: 'Gaborone',
          state: 'South East',
          zipCode: '0000',
          latitude: (-24.6282 + Math.random() * 0.01).toString(),
          longitude: (25.9231 + Math.random() * 0.01).toString(),
          propertyType: 'house',
          listingType: 'owner',
          bedrooms: 3,
          bathrooms: '2',
          status: 'active',
          ownerId: 1
        },
        {
          title: 'City Center Apartment',
          description: 'Modern 2-bedroom apartment with city views',
          price: '450000',
          address: '456 Main Mall',
          city: 'Gaborone',
          state: 'South East',
          zipCode: '0000',
          latitude: (-24.6282 + Math.random() * 0.01).toString(),
          longitude: (25.9231 + Math.random() * 0.01).toString(),
          propertyType: 'apartment',
          listingType: 'agent',
          bedrooms: 2,
          bathrooms: '1',
          status: 'active',
          ownerId: 1
        },
        {
          title: 'Investment Plot',
          description: 'Prime residential plot ready for development',
          price: '250000',
          address: '789 Plot Road',
          city: 'Gaborone',
          state: 'South East',
          zipCode: '0000',
          latitude: (-24.6282 + Math.random() * 0.01).toString(),
          longitude: (25.9231 + Math.random() * 0.01).toString(),
          propertyType: 'land_plot',
          listingType: 'owner',
          bedrooms: 0,
          bathrooms: '0',
          status: 'active',
          ownerId: 1
        }
      ];

      for (const prop of testProperties) {
        await db.run(`
          INSERT INTO properties (
            title, description, price, address, city, state, zip_code,
            latitude, longitude, property_type, listing_type, 
            bedrooms, bathrooms, status, owner_id
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          prop.title, prop.description, prop.price, prop.address,
          prop.city, prop.state, prop.zipCode, prop.latitude, prop.longitude,
          prop.propertyType, prop.listingType, prop.bedrooms, prop.bathrooms,
          prop.status, prop.ownerId
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
    console.log(`  Total properties: ${allProperties.length}`);
    console.log(`  With coordinates: ${validCoords}`);
    console.log(`  Missing coordinates: ${missingCoords}`);

    if (missingCoords > 0 && !args.includes('fix')) {
      console.log('\n💡 Run with "fix" argument to add coordinates:');
      console.log('   npx tsx scripts/debug-map-properties.ts fix');
    }
  }
}

main().catch(console.error);
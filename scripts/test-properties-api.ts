
async function testPropertiesAPI() {
  console.log('🧪 Testing Properties API...\n');
  
  try {
    const response = await fetch('http://localhost:5000/api/properties?status=active');
    
    if (!response.ok) {
      console.error(`❌ API returned status: ${response.status}`);
      return;
    }
    
    const properties = await response.json();
    console.log(`📡 API returned ${properties.length} properties`);
    
    // Check coordinate data
    let validCount = 0;
    let invalidCount = 0;
    
    properties.forEach((property: any, index: number) => {
      const lat = typeof property.latitude === 'string' ? parseFloat(property.latitude) : property.latitude;
      const lng = typeof property.longitude === 'string' ? parseFloat(property.longitude) : property.longitude;
      
      const hasValidCoords = lat != null && lng != null && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
      
      if (hasValidCoords) {
        validCount++;
        console.log(`✅ Property ${index + 1}: "${property.title}" [${lat}, ${lng}]`);
      } else {
        invalidCount++;
        console.log(`❌ Property ${index + 1}: "${property.title}" [${property.latitude}, ${property.longitude}] - INVALID`);
      }
    });
    
    console.log(`\n📊 Summary:`);
    console.log(`  Valid coordinates: ${validCount}`);
    console.log(`  Invalid coordinates: ${invalidCount}`);
    
    if (invalidCount > 0) {
      console.log('\n💡 Properties with invalid coordinates will not show on the map');
      console.log('Run: npx tsx scripts/debug-map-properties.ts fix');
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error);
    console.log('💡 Make sure the server is running on port 5000');
  }
}

testPropertiesAPI();

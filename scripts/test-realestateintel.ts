
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const REALINTEL_URL = process.env.REALESTATEINTEL_URL || 'https://api.realestateintel.ai/search';
const REALINTEL_KEY = process.env.REALESTATEINTEL_API_KEY;

async function testRealEstateIntelAPI() {
  if (!REALINTEL_KEY) {
    console.error('❌ REALESTATEINTEL_API_KEY not found in environment variables');
    console.log('Please add your API key to the .env file');
    return;
  }

  console.log('🔍 Testing RealEstateIntel AI API...');
  console.log('URL:', REALINTEL_URL);
  console.log('API Key:', REALINTEL_KEY.substring(0, 10) + '...');

  const testQueries = [
    {
      name: 'Basic search',
      payload: {
        query: 'three bedroom house in Gaborone',
        locationBias: 'Botswana',
        maxResults: 5
      }
    },
    {
      name: 'Price range search',
      payload: {
        query: 'apartment',
        locationBias: 'Gaborone, Botswana',
        minPrice: 500000,
        maxPrice: 2000000,
        maxResults: 3
      }
    },
    {
      name: 'Property type search',
      payload: {
        query: 'commercial property',
        propertyType: 'commercial',
        locationBias: 'Botswana',
        maxResults: 2
      }
    }
  ];

  for (const test of testQueries) {
    console.log(`\n🧪 Testing: ${test.name}`);
    console.log('Payload:', JSON.stringify(test.payload, null, 2));
    
    try {
      const response = await fetch(REALINTEL_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${REALINTEL_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(test.payload)
      });

      console.log(`Status: ${response.status} ${response.statusText}`);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Success!');
        console.log(`Results: ${data.results?.length || 0} properties`);
        
        if (data.results && data.results.length > 0) {
          const firstResult = data.results[0];
          console.log('Sample result:', {
            title: firstResult.title,
            price: firstResult.price,
            location: `${firstResult.city}, ${firstResult.country}`,
            beds: firstResult.beds,
            source: firstResult.source
          });
        }
      } else {
        const errorText = await response.text();
        console.log('❌ Error response:', errorText);
      }
    } catch (error) {
      console.error('❌ Request failed:', error);
    }
  }
}

async function testLocalSearchAggregator() {
  console.log('\n🏠 Testing local search aggregator...');
  
  const testUrl = 'http://localhost:5000/api/search';
  const queries = [
    'three bedroom house',
    'apartment in gaborone',
    'plot for sale'
  ];

  for (const query of queries) {
    console.log(`\n🔍 Testing query: "${query}"`);
    
    try {
      const response = await fetch(`${testUrl}?q=${encodeURIComponent(query)}&limit=5`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Local aggregator working!');
        console.log('Stats:', data.stats);
        console.log(`Total results: ${data.results?.length || 0}`);
      } else {
        console.log('❌ Local aggregator error:', response.status);
      }
    } catch (error) {
      console.error('❌ Local request failed:', error);
    }
  }
}

// Run tests
async function runAllTests() {
  await testRealEstateIntelAPI();
  await testLocalSearchAggregator();
  
  console.log('\n✨ Testing complete!');
  console.log('Next steps:');
  console.log('1. Ensure your .env file has the correct REALESTATEINTEL_API_KEY');
  console.log('2. Test the /api/search endpoint in your browser');
  console.log('3. Check the server logs for integration status');
}

runAllTests().catch(console.error);

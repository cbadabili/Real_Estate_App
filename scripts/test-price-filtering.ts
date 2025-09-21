
import { storage } from '../server/storage';

async function testPriceFiltering() {
  console.log('Testing price filtering...');
  
  try {
    // Test 1: Properties under 950k should exclude 1.2M properties
    console.log('\nTest 1: Properties under 950,000');
    const underResults = await storage.getProperties({
      maxPrice: 950000,
      status: 'active'
    });
    
    console.log(`Found ${underResults.length} properties under BWP 950,000`);
    const overBudget = underResults.filter(p => parseFloat(p.price) > 950000);
    console.log(`Properties over budget: ${overBudget.length} (should be 0)`);
    
    // Test 2: Properties over 500k should include expensive properties
    console.log('\nTest 2: Properties over 500,000');
    const overResults = await storage.getProperties({
      minPrice: 500000,
      status: 'active'
    });
    
    console.log(`Found ${overResults.length} properties over BWP 500,000`);
    const underBudget = overResults.filter(p => parseFloat(p.price) < 500000);
    console.log(`Properties under budget: ${underBudget.length} (should be 0)`);
    
    // Test 3: Range filtering
    console.log('\nTest 3: Properties between 300k and 800k');
    const rangeResults = await storage.getProperties({
      minPrice: 300000,
      maxPrice: 800000,
      status: 'active'
    });
    
    console.log(`Found ${rangeResults.length} properties in range`);
    const outsideRange = rangeResults.filter(p => {
      const price = parseFloat(p.price);
      return price < 300000 || price > 800000;
    });
    console.log(`Properties outside range: ${outsideRange.length} (should be 0)`);
    
    console.log('\nPrice filtering test completed!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testPriceFiltering();

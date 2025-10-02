
import fetch from 'node-fetch';
import { db } from '../server/db';
import { storage } from '../server/storage';
import { users } from '../shared/schema';

async function healthCheck() {
  console.log('🏥 Running System Health Check...\n');

  const checks: Record<'database' | 'storage' | 'api' | 'ai', boolean> = {
    database: false,
    storage: false,
    api: false,
    ai: false,
  };

  try {
    // 1. Database Connection
    console.log('1. Testing database connection...');
    await db.select({ id: users.id }).from(users).limit(1);
    checks.database = true;
    console.log('✅ Database connection successful\n');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log('❌ Database connection failed:', message, '\n');
  }

  try {
    // 2. Storage Layer
    console.log('2. Testing storage layer...');
    await storage.getProperties({ limit: 1 });
    checks.storage = true;
    console.log('✅ Storage layer working\n');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log('❌ Storage layer failed:', message, '\n');
  }

  try {
    // 3. API Health
    console.log('3. Testing API health endpoint...');
    const response = await fetch('http://0.0.0.0:5000/api/health');
    if (response.ok) {
      checks.api = true;
      console.log('✅ API health endpoint responding\n');
    } else {
      console.log('❌ API health endpoint returned:', response.status, '\n');
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log('❌ API health check failed:', message, '\n');
  }

  try {
    // 4. AI Search
    console.log('4. Testing AI search endpoint...');
    const response = await fetch('http://0.0.0.0:5000/api/search/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'test house in Gaborone' })
    });
    
    if (response.ok) {
      checks.ai = true;
      console.log('✅ AI search endpoint responding\n');
    } else {
      console.log('❌ AI search endpoint returned:', response.status, '\n');
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log('❌ AI search check failed:', message, '\n');
  }

  // Summary
  console.log('📊 Health Check Summary:');
  console.log(`Database: ${checks.database ? '✅' : '❌'}`);
  console.log(`Storage: ${checks.storage ? '✅' : '❌'}`);
  console.log(`API: ${checks.api ? '✅' : '❌'}`);
  console.log(`AI Search: ${checks.ai ? '✅' : '❌'}`);

  const overallHealth = Object.values(checks).every(check => check);
  console.log(`\nOverall System Health: ${overallHealth ? '✅ HEALTHY' : '❌ ISSUES DETECTED'}`);

  return overallHealth;
}

if (require.main === module) {
  healthCheck().catch(console.error);
}

export { healthCheck };

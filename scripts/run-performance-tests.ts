
#!/usr/bin/env npx tsx

import { execSync, spawn } from 'child_process';
import { existsSync } from 'fs';

async function runPerformanceTests() {
  console.log('🚀 Starting Performance Test Suite\n');

  // Step 1: Build the project for production-like testing
  console.log('📦 Building project for performance testing...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully\n');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }

  // Step 2: Check if server is running
  console.log('🔍 Checking server status...');
  try {
    const response = await fetch('http://0.0.0.0:5000/api/health');
    if (!response.ok) {
      throw new Error('Server not responding properly');
    }
    console.log('✅ Server is running and responsive\n');
  } catch (error) {
    console.log('⚠️  Server may not be running. Starting server...');
    
    // Start server in background
    const serverProcess = spawn('npm', ['start'], {
      stdio: 'inherit',
      detached: true
    });
    
    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    try {
      const response = await fetch('http://0.0.0.0:5000/api/health');
      if (!response.ok) throw new Error('Server still not responding');
      console.log('✅ Server started successfully\n');
    } catch (serverError) {
      console.error('❌ Failed to start server:', serverError);
      process.exit(1);
    }
  }

  // Step 3: Run performance tests
  console.log('🧪 Running performance test categories...\n');

  const testCategories = [
    {
      name: 'Environment & Database Performance',
      pattern: 'tests/performance/database.test.ts'
    },
    {
      name: 'Memory & Resource Usage',
      pattern: 'tests/performance/memory.test.ts'
    },
    {
      name: 'Load Testing',
      pattern: 'tests/performance/load.test.ts'
    },
    {
      name: 'Bundle Analysis',
      pattern: 'tests/performance/bundle-analysis.test.ts'
    }
  ];

  let allPassed = true;

  for (const category of testCategories) {
    console.log(`\n🔬 Running: ${category.name}`);
    console.log('=' + '='.repeat(category.name.length + 10));
    
    try {
      execSync(`npx vitest run ${category.pattern}`, { stdio: 'inherit' });
      console.log(`✅ ${category.name} - PASSED`);
    } catch (error) {
      console.error(`❌ ${category.name} - FAILED`);
      allPassed = false;
    }
  }

  // Step 4: Run Lighthouse tests if available
  if (existsSync('tests/performance/lighthouse.test.ts')) {
    console.log('\n🔬 Running: Lighthouse Performance Tests');
    console.log('=' + '='.repeat(35));
    
    try {
      execSync('npx vitest run tests/performance/lighthouse.test.ts', { stdio: 'inherit' });
      console.log('✅ Lighthouse Performance Tests - PASSED');
    } catch (error) {
      console.error('❌ Lighthouse Performance Tests - FAILED');
      allPassed = false;
    }
  }

  // Step 5: Generate performance report
  console.log('\n📊 Performance Test Summary');
  console.log('=' + '='.repeat(28));
  
  if (allPassed) {
    console.log('🎉 All performance tests PASSED!');
    console.log('\n📋 Key Metrics Validated:');
    console.log('  • API Response Times < 500ms average');
    console.log('  • Database Queries < 300ms');
    console.log('  • Bundle Size < 3MB');
    console.log('  • Memory Usage Stable');
    console.log('  • Load Test Throughput > 50 req/s');
    console.log('  • Lighthouse Performance > 70');
  } else {
    console.log('❌ Some performance tests FAILED!');
    console.log('\n🔧 Recommended Actions:');
    console.log('  • Review failed test output above');
    console.log('  • Check database query optimization');
    console.log('  • Analyze bundle size and dependencies');
    console.log('  • Monitor memory leaks');
    console.log('  • Optimize heavy API endpoints');
    
    process.exit(1);
  }

  console.log('\n✨ Performance testing complete!');
}

// Run the performance test suite
if (require.main === module) {
  runPerformanceTests().catch(error => {
    console.error('Performance test runner failed:', error);
    process.exit(1);
  });
}

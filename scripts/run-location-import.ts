#!/usr/bin/env tsx

import { importLocationData } from '../server/location-data-import';

async function main() {
  try {
    console.log('🌍 Starting comprehensive Botswana location data import...');
    await importLocationData();
    console.log('✅ Location data import completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Location data import failed:', error);
    process.exit(1);
  }
}

main();
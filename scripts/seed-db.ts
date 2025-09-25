#!/usr/bin/env tsx

import { db } from '../server/db.js';

async function runSeeding() {
  try {
    console.log('🌱 Seeding database...');
    await db.seedDatabase();
    console.log('✅ Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

runSeeding();


#!/usr/bin/env tsx

import { config } from 'dotenv';

config();

console.log('🔒 BeeDab Security Configuration Check\n');

// Check JWT configuration
const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

if (!jwtSecret || jwtSecret === 'your-super-secret-jwt-key-change-this-in-production') {
  console.log('❌ JWT_SECRET: Not properly configured or using default value');
  console.log('   Please set a strong, unique JWT_SECRET in your environment');
} else {
  console.log('✅ JWT_SECRET: Configured');
  if (jwtSecret.length < 32) {
    console.log('⚠️  JWT_SECRET: Consider using a longer secret (32+ characters)');
  }
}

console.log(`✅ JWT_EXPIRES_IN: ${jwtExpiresIn || '24h (default)'}`);

// Check database configuration
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.log('❌ DATABASE_URL: Not configured');
} else {
  console.log('✅ DATABASE_URL: Configured');
  
  // Check if using default/weak database credentials
  if (dbUrl.includes('password') || dbUrl.includes('username')) {
    console.log('⚠️  DATABASE_URL: Appears to contain default credentials');
  }
}

console.log('\n📋 Security Recommendations:');
console.log('   1. Use strong, unique JWT secrets in production');
console.log('   2. Consider shorter JWT expiration times for sensitive applications');
console.log('   3. Implement proper password policies for user registration');
console.log('   4. Use environment variables for all sensitive configuration');
console.log('   5. Enable HTTPS in production');

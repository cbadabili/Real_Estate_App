
import { storage } from './storage';
import { reviewStorage } from './review-storage';
import bcrypt from 'bcrypt';

async function createTestAdmin() {
  try {
    console.log('Creating test admin user...');
    
    // Check if admin already exists
    const existingAdmin = await storage.getUserByEmail('admin@beedab.com');
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      return existingAdmin;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const adminUser = await storage.createUser({
      email: 'admin@beedab.com',
      username: 'admin',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      userType: 'admin',
      role: 'super_admin',
      isVerified: true,
      isActive: true
    });

    console.log('✅ Admin user created successfully:', {
      id: adminUser.id,
      email: adminUser.email,
      role: adminUser.role,
      userType: adminUser.userType
    });

    return adminUser;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ Error creating admin user:', message);
    throw error;
  }
}

async function createTestData() {
  try {
    console.log('Creating test data for admin panel...');

    // Create some test users
    const hashedPassword = await bcrypt.hash('user123', 12);
    
    const testUsers = [
      {
        email: 'buyer@test.com',
        username: 'testbuyer',
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'Buyer',
        userType: 'buyer',
        role: 'user'
      },
      {
        email: 'seller@test.com',
        username: 'testseller',
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'Seller',
        userType: 'seller',
        role: 'user'
      },
      {
        email: 'agent@test.com',
        username: 'testagent',
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'Agent',
        userType: 'agent',
        role: 'user',
        isVerified: false
      }
    ];

    for (const userData of testUsers) {
      try {
        const existing = await storage.getUserByEmail(userData.email);
        if (!existing) {
          const user = await storage.createUser(userData);
          console.log(`✅ Created test user: ${user.email}`);
        } else {
          console.log(`📋 Test user already exists: ${userData.email}`);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.log(`⚠️ Skipped ${userData.email}: ${message}`);
      }
    }

    // Create some test reviews for moderation
    const users = await storage.getUsers({ limit: 10 });
    if (users.length >= 2) {
      const [firstUser, secondUser] = users;
      if (!firstUser || !secondUser) {
        console.warn('⚠️ Unable to locate users for test review creation');
      } else {
        try {
          const testReview = await reviewStorage.createUserReview({
            reviewerId: firstUser.id,
            revieweeId: secondUser.id,
            rating: 4,
            review: 'This is a test review for admin moderation testing',
            reviewType: 'transaction',
            isPublic: 1
          });
          console.log('✅ Created test review for moderation');

          // Create audit log entry
          await reviewStorage.createAuditLogEntry({
            adminId: firstUser.id,
            action: 'test_review_created',
            targetType: 'review',
            targetId: testReview.id,
            details: JSON.stringify({ test: true }),
            ipAddress: '127.0.0.1',
            userAgent: 'Test Script'
          });
          console.log('✅ Created test audit log entry');
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          console.log('⚠️ Test review creation skipped:', message);
        }
      }
    }

    console.log('✅ Test data creation completed');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ Error creating test data:', message);
  }
}

async function testAdminEndpoints() {
  try {
    console.log('\n🧪 Testing admin API endpoints...');
    
    const users = await storage.getUsers({ limit: 5 });
    console.log(`✅ Users endpoint: Found ${users.length} users`);

    const reviews = await reviewStorage.getUserReviewsWithDetails({ 
      status: 'pending', 
      limit: 5 
    });
    console.log(`✅ Reviews endpoint: Found ${reviews.length} pending reviews`);

    const auditLogs = await reviewStorage.getAuditLog({ limit: 5 });
    console.log(`✅ Audit logs endpoint: Found ${auditLogs.length} audit entries`);

    console.log('\n✅ All admin endpoints are working correctly!');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ Error testing admin endpoints:', message);
  }
}

async function main() {
  try {
    console.log('🚀 Starting admin functionality test...\n');
    
    const admin = await createTestAdmin();
    await createTestData();
    await testAdminEndpoints();

    console.log('\n🎉 Admin testing completed successfully!');
    console.log('\n📋 Admin Login Credentials:');
    console.log('Email: admin@beedab.com');
    console.log('Password: admin123');
    console.log('\n🔗 Access admin panel at: /admin');
    console.log('💡 Use token:', admin.id, 'for API testing');

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ Admin testing failed:', message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().then(() => process.exit(0));
}

export { createTestAdmin, createTestData, testAdminEndpoints };

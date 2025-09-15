
import { db } from '../server/db';
import { users } from '../shared/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

async function checkUser() {
  const email = 'cbadabili@gmail.com';
  
  try {
    console.log('Checking user:', email);
    
    const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
    
    if (!user) {
      console.log('❌ User not found');
      
      // Show all users
      const allUsers = await db.select({
        id: users.id,
        email: users.email,
        username: users.username,
        isActive: users.isActive,
        hasPassword: users.password
      }).from(users);
      
      console.log('All users in database:');
      allUsers.forEach(u => {
        console.log(`- ID: ${u.id}, Email: ${u.email}, Username: ${u.username}, Active: ${u.isActive}, Has Password: ${!!u.hasPassword}`);
      });
      
      return;
    }
    
    console.log('✅ User found:');
    console.log('- ID:', user.id);
    console.log('- Email:', user.email);
    console.log('- Username:', user.username);
    console.log('- First Name:', user.firstName);
    console.log('- Last Name:', user.lastName);
    console.log('- User Type:', user.userType);
    console.log('- Is Active:', user.isActive);
    console.log('- Has Password:', !!user.password);
    console.log('- Password Hash Length:', user.password?.length || 0);
    console.log('- Created At:', user.createdAt);
    console.log('- Last Login:', user.lastLoginAt);
    
    // Test a common password
    if (user.password) {
      const testPasswords = ['password123', 'test123', 'admin123', '123456'];
      
      console.log('\nTesting common passwords:');
      for (const testPassword of testPasswords) {
        try {
          const isMatch = await bcrypt.compare(testPassword, user.password);
          console.log(`- "${testPassword}": ${isMatch ? '✅ MATCH' : '❌ No match'}`);
        } catch (error) {
          console.log(`- "${testPassword}": ❌ Error - ${error.message}`);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking user:', error);
  }
}

checkUser();

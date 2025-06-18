import { db } from './db';
import { users, properties } from '@shared/schema';

async function seed() {
  console.log('🌱 Starting database seed...');

  try {
    // Create sample users
    const sampleUsers = [
      {
        username: 'john_buyer',
        email: 'john@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Smith',
        phone: '555-0101',
        userType: 'buyer' as const,
        bio: 'Looking for my first home in Austin',
      },
      {
        username: 'sarah_agent',
        email: 'sarah@realestate.com',
        password: 'password123',
        firstName: 'Sarah',
        lastName: 'Johnson',
        phone: '555-0102',
        userType: 'agent' as const,
        bio: 'Licensed real estate agent with 10+ years experience',
        reacNumber: 'REAC-2024-001234',
        isVerified: true,
      },
      {
        username: 'mike_fsbo',
        email: 'mike@example.com',
        password: 'password123',
        firstName: 'Mike',
        lastName: 'Chen',
        phone: '555-0103',
        userType: 'fsbo' as const,
        bio: 'Selling my family home by owner',
      },
    ];

    console.log('👥 Creating users...');
    const createdUsers = await db.insert(users).values(sampleUsers).returning();
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create sample properties
    const sampleProperties = [
      {
        title: 'Modern Family Home in Suburbia',
        description: 'Beautiful 4-bedroom home with updated kitchen, hardwood floors, and large backyard. Perfect for families.',
        price: '650000.00',
        address: '123 Oak Street',
        city: 'Austin',
        state: 'TX',
        zipCode: '78701',
        latitude: '30.2672',
        longitude: '-97.7431',
        propertyType: 'house',
        listingType: 'fsbo',
        bedrooms: 4,
        bathrooms: '2.5',
        squareFeet: 2400,
        lotSize: '0.25',
        yearBuilt: 2010,
        status: 'active',
        images: [
          'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        features: ['Hardwood Floors', 'Updated Kitchen', 'Large Backyard', 'Two-Car Garage'],
        propertyTaxes: '8500.00',
        hoaFees: '0.00',
        ownerId: createdUsers[2].id, // Mike (FSBO seller)
      },
      {
        title: 'Luxury Downtown Condo',
        description: 'Stunning high-rise condo with city views, modern amenities, and walking distance to everything downtown.',
        price: '850000.00',
        address: '456 Congress Avenue',
        city: 'Austin',
        state: 'TX',
        zipCode: '78701',
        latitude: '30.2682',
        longitude: '-97.7431',
        propertyType: 'condo',
        listingType: 'agent',
        bedrooms: 2,
        bathrooms: '2.0',
        squareFeet: 1200,
        yearBuilt: 2020,
        status: 'active',
        images: [
          'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        features: ['City Views', 'Concierge', 'Rooftop Pool', 'Fitness Center'],
        propertyTaxes: '12000.00',
        hoaFees: '450.00',
        agentId: createdUsers[1].id, // Sarah (Agent)
      },
      {
        title: 'Cozy Suburban Townhouse',
        description: 'Well-maintained townhouse in family-friendly neighborhood with great schools and parks nearby.',
        price: '425000.00',
        address: '789 Pine Lane',
        city: 'Cedar Park',
        state: 'TX',
        zipCode: '78613',
        latitude: '30.5052',
        longitude: '-97.8203',
        propertyType: 'townhouse',
        listingType: 'mls',
        bedrooms: 3,
        bathrooms: '2.5',
        squareFeet: 1800,
        lotSize: '0.1',
        yearBuilt: 2015,
        status: 'active',
        images: [
          'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        features: ['Attached Garage', 'Patio', 'Master Suite', 'Open Floor Plan'],
        propertyTaxes: '6200.00',
        hoaFees: '180.00',
        agentId: createdUsers[1].id, // Sarah (Agent)
      },
      {
        title: 'Spacious Ranch Home',
        description: 'Single-story ranch home with open floor plan, large master suite, and beautiful landscaping.',
        price: '495000.00',
        address: '321 Elm Drive',
        city: 'Round Rock',
        state: 'TX',
        zipCode: '78665',
        latitude: '30.5083',
        longitude: '-97.6789',
        propertyType: 'house',
        listingType: 'fsbo',
        bedrooms: 3,
        bathrooms: '2.0',
        squareFeet: 2100,
        lotSize: '0.3',
        yearBuilt: 2005,
        status: 'active',
        images: [
          'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        features: ['Open Floor Plan', 'Master Suite', 'Landscaping', 'Energy Efficient'],
        propertyTaxes: '7200.00',
        hoaFees: '0.00',
        ownerId: createdUsers[0].id, // John (buyer who became seller)
      },
      {
        title: 'Contemporary Loft',
        description: 'Industrial-style loft in converted warehouse with exposed brick, high ceilings, and modern finishes.',
        price: '675000.00',
        address: '555 Industrial Blvd',
        city: 'Austin',
        state: 'TX',
        zipCode: '78702',
        latitude: '30.2515',
        longitude: '-97.7134',
        propertyType: 'condo',
        listingType: 'agent',
        bedrooms: 1,
        bathrooms: '1.0',
        squareFeet: 1100,
        yearBuilt: 2018,
        status: 'active',
        images: [
          'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        features: ['Exposed Brick', 'High Ceilings', 'Modern Finishes', 'Urban Location'],
        propertyTaxes: '9800.00',
        hoaFees: '275.00',
        agentId: createdUsers[1].id, // Sarah (Agent)
      }
    ];

    console.log('🏠 Creating properties...');
    const createdProperties = await db.insert(properties).values(sampleProperties).returning();
    console.log(`✅ Created ${createdProperties.length} properties`);

    console.log('🎉 Database seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   👥 Users: ${createdUsers.length}`);
    console.log(`   🏠 Properties: ${createdProperties.length}`);
    console.log('\n🚀 Ready to explore the platform!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seed if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seed().catch(console.error);
}

export { seed };
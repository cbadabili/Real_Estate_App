import { db } from './db';
import { rental_listings } from '../shared/schema';
import { rental_listings as rental_listings_alias } from '@shared/schema';
import { eq } from 'drizzle-orm';

export async function seedRentalData() {
  try {
    // Check if rental data already exists
    const existingRentals = await db.select().from(rental_listings).limit(1);

    if (existingRentals.length > 0) {
      console.log("✅ Rental data already exists, skipping seeding...");
      return;
    }

    // Create sample rental listings
    const sampleRentals = [
      {
        id: 1,
        title: 'Modern 2BR Apartment in CBD',
        description: 'Stylish apartment with city views',
        price: 8500,
        bedrooms: 2,
        bathrooms: 2,
        property_type: 'apartment',
        area_sqm: 85,
        address: '123 Independence Ave',
        city: 'Gaborone',
        district: 'South East',
        available_from: '2024-02-01',
        lease_term: 12,
        deposit_required: 17000,
        utilities_included: false,
        furnished: true,
        parking_spaces: 2,
        pet_friendly: true,
        features: JSON.stringify(["Air conditioning","Balcony","Security"]),
        images: JSON.stringify([]),
        landlord_id: 1,
        status: 'available',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Family Home in Extension 10',
        description: 'Spacious 3-bedroom house perfect for families',
        price: 12000,
        bedrooms: 3,
        bathrooms: 2,
        property_type: 'house',
        area_sqm: 120,
        address: '456 Segoditshane Way',
        city: 'Gaborone',
        district: 'South East',
        available_from: '2024-02-15',
        lease_term: 24,
        deposit_required: 24000,
        utilities_included: true,
        furnished: false,
        parking_spaces: 3,
        pet_friendly: true,
        features: JSON.stringify(["Garden","Garage","Security system"]),
        images: JSON.stringify([]),
        landlord_id: 2,
        status: 'available',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    await db.insert(rental_listings).values(sampleRentals);

    console.log('✅ Sample rental data seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding rental data:', error);
  }
}
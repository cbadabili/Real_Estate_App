import { db } from "./db";
import { rental_listings } from '@shared/schema';
import { eq } from 'drizzle-orm';

export async function seedRentalData() {
  try {
    // Check if rental data already exists
    const existingRentals = await db.select().from(rental_listings).limit(1);

    if (existingRentals.length > 0) {
      console.log('✅ Rental data already exists, skipping seeding...');
      return;
    }

    // Insert sample rental listings using drizzle insert
    await db.insert(rental_listings).values([
      {
        id: 1,
        landlord_id: 1,
        title: 'Modern 2-Bedroom Apartment in Gaborone CBD',
        description: 'Beautiful modern apartment with stunning city views, fully furnished and ready to move in.',
        address: '123 Main Mall',
        city: 'Gaborone',
        district: 'Central',
        property_type: 'apartment',
        bedrooms: 2,
        bathrooms: 2,
        square_meters: 85,
        monthly_rent: 8500,
        deposit_amount: 17000,
        lease_duration: 12,
        available_from: '2024-02-01',
        furnished: true,
        pets_allowed: false,
        parking_spaces: 1,
        photos: ['https://via.placeholder.com/400x300', 'https://via.placeholder.com/400x300'],
        amenities: ['Air Conditioning', 'WiFi', 'Security', 'Swimming Pool'],
        utilities_included: ['Water', 'Electricity', 'WiFi']
      },
      {
        id: 2,
        landlord_id: 1,
        title: 'Spacious Family House in Mogoditshane',
        description: 'Large 3-bedroom house perfect for families, with a big yard and garage.',
        address: '456 Residential Road',
        city: 'Mogoditshane',
        district: 'Kweneng West',
        property_type: 'house',
        bedrooms: 3,
        bathrooms: 2,
        square_meters: 120,
        monthly_rent: 6500,
        deposit_amount: 13000,
        lease_duration: 12,
        available_from: '2024-01-15',
        furnished: false,
        pets_allowed: true,
        parking_spaces: 2,
        photos: ['https://via.placeholder.com/400x300', 'https://via.placeholder.com/400x300'],
        amenities: ['Garden', 'Garage', 'Security', 'Backup Water'],
        utilities_included: ['Water']
      },
      {
        id: 3,
        landlord_id: 2,
        title: 'Luxury Townhouse in Phakalane',
        description: 'Upmarket townhouse in secure estate with golf course access.',
        address: '789 Golf Estate',
        city: 'Gaborone',
        district: 'North',
        property_type: 'townhouse',
        bedrooms: 3,
        bathrooms: 3,
        square_meters: 150,
        monthly_rent: 12000,
        deposit_amount: 24000,
        lease_duration: 24,
        available_from: '2024-03-01',
        furnished: true,
        pets_allowed: false,
        parking_spaces: 2,
        photos: ['https://via.placeholder.com/400x300', 'https://via.placeholder.com/400x300'],
        amenities: ['Golf Course Access', 'Swimming Pool', 'Gym', 'Security', 'Garden'],
        utilities_included: ['Water', 'Electricity', 'Security', 'Garden Maintenance']
      },
      {
        id: 4,
        landlord_id: 2,
        title: 'Cozy Studio in Broadhurst',
        description: 'Perfect for young professionals, close to shopping and transport.',
        address: '321 Broadhurst Street',
        city: 'Gaborone',
        district: 'Broadhurst',
        property_type: 'studio',
        bedrooms: 0,
        bathrooms: 1,
        square_meters: 35,
        monthly_rent: 3500,
        deposit_amount: 7000,
        lease_duration: 6,
        available_from: '2024-01-20',
        furnished: true,
        pets_allowed: false,
        parking_spaces: 1,
        photos: ['https://via.placeholder.com/400x300'],
        amenities: ['WiFi', 'Security', 'Kitchenette'],
        utilities_included: ['Water', 'Electricity', 'WiFi']
      },
      {
        id: 5,
        landlord_id: 3,
        title: '4-Bedroom House in Extension 9',
        description: 'Large family home with plenty of space and modern amenities.',
        address: '654 Extension Road',
        city: 'Gaborone',
        district: 'Extension 9',
        property_type: 'house',
        bedrooms: 4,
        bathrooms: 3,
        square_meters: 180,
        monthly_rent: 9500,
        deposit_amount: 19000,
        lease_duration: 12,
        available_from: '2024-02-15',
        furnished: false,
        pets_allowed: true,
        parking_spaces: 3,
        photos: ['https://via.placeholder.com/400x300', 'https://via.placeholder.com/400x300'],
        amenities: ['Large Yard', 'Double Garage', 'Solar Panels', 'Borehole'],
        utilities_included: ['Water']
      }
    ]);

    console.log('✅ Sample rental data seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding rental data:', error);
  }
}
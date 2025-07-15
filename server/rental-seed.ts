
import { db } from './db';

export async function rentalSeed() {
  try {
    console.log('🌱 Seeding rental data...');
    
    // Check if rental data already exists
    const existingRentals = db.prepare('SELECT COUNT(*) as count FROM rentals').get() as { count: number };
    
    if (existingRentals.count > 0) {
      console.log('✅ Rental data already exists, skipping...');
      return;
    }

    // Insert sample rental properties
    const insertRental = db.prepare(`
      INSERT INTO rentals (
        title, description, address, city, district, ward, property_type,
        bedrooms, bathrooms, square_meters, monthly_rent, deposit_amount,
        lease_duration, available_from, furnished, pets_allowed, parking_spaces,
        photos, amenities, utilities_included, status, landlord_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const sampleRentals = [
      {
        title: 'Modern 2BR Apartment in Gaborone CBD',
        description: 'Beautiful modern apartment with city views, perfect for professionals',
        address: 'Plot 1234, Independence Avenue',
        city: 'Gaborone',
        district: 'South East',
        ward: 'Gaborone Central',
        property_type: 'apartment',
        bedrooms: 2,
        bathrooms: 2,
        square_meters: 85,
        monthly_rent: 8500,
        deposit_amount: 8500,
        lease_duration: 12,
        available_from: '2024-02-01',
        furnished: 1,
        pets_allowed: 0,
        parking_spaces: 1,
        photos: JSON.stringify(['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']),
        amenities: JSON.stringify(['WiFi', 'Air Conditioning', 'Security', 'Gym']),
        utilities_included: JSON.stringify(['Water', 'Electricity']),
        status: 'active',
        landlord_id: 1
      },
      {
        title: 'Spacious Family House in Gaborone West',
        description: 'Large family home with garden, perfect for families',
        address: 'Plot 5678, Segoditshane Way',
        city: 'Gaborone',
        district: 'South East',
        ward: 'Gaborone West',
        property_type: 'house',
        bedrooms: 4,
        bathrooms: 3,
        square_meters: 180,
        monthly_rent: 15000,
        deposit_amount: 15000,
        lease_duration: 12,
        available_from: '2024-01-15',
        furnished: 0,
        pets_allowed: 1,
        parking_spaces: 2,
        photos: JSON.stringify(['https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']),
        amenities: JSON.stringify(['Garden', 'Garage', 'Security', 'Pool']),
        utilities_included: JSON.stringify(['Water']),
        status: 'active',
        landlord_id: 1
      },
      {
        title: 'Cozy Studio in Francistown',
        description: 'Perfect studio apartment for students or young professionals',
        address: 'Plot 999, Blue Jacket Street',
        city: 'Francistown',
        district: 'North East',
        ward: 'Francistown Central',
        property_type: 'studio',
        bedrooms: 0,
        bathrooms: 1,
        square_meters: 35,
        monthly_rent: 4500,
        deposit_amount: 4500,
        lease_duration: 6,
        available_from: '2024-01-01',
        furnished: 1,
        pets_allowed: 0,
        parking_spaces: 0,
        photos: JSON.stringify(['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']),
        amenities: JSON.stringify(['WiFi', 'Kitchen']),
        utilities_included: JSON.stringify(['Water', 'Electricity', 'Internet']),
        status: 'active',
        landlord_id: 1
      }
    ];

    for (const rental of sampleRentals) {
      insertRental.run(
        rental.title, rental.description, rental.address, rental.city,
        rental.district, rental.ward, rental.property_type, rental.bedrooms,
        rental.bathrooms, rental.square_meters, rental.monthly_rent,
        rental.deposit_amount, rental.lease_duration, rental.available_from,
        rental.furnished, rental.pets_allowed, rental.parking_spaces,
        rental.photos, rental.amenities, rental.utilities_included,
        rental.status, rental.landlord_id
      );
    }

    console.log('✅ Rental data seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding rental data:', error);
  }
}

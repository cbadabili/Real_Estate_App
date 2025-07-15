
import { Database } from 'better-sqlite3';
import { getAllTowns } from '../client/src/data/botswanaGeography';

export const seedRentals = (db: Database) => {
  console.log('Seeding rentals...');
  
  const towns = getAllTowns();
  
  const sampleRentals = [
    {
      title: 'Modern 2-Bedroom Apartment',
      description: 'Beautiful modern apartment in the heart of Gaborone with all amenities',
      price: 8500,
      location: 'Gaborone CBD',
      city: 'Gaborone',
      district: 'South East',
      bedrooms: 2,
      bathrooms: 2,
      property_type: 'apartment',
      furnished: true,
      pet_friendly: false,
      parking: true,
      garden: false,
      security: true,
      air_conditioning: true,
      internet: true,
      available_date: '2024-02-01',
      lease_duration: 12,
      deposit_amount: 17000,
      utilities_included: false,
      contact_phone: '+267 72 123 456',
      contact_email: 'landlord1@example.com',
      property_size: 85,
      floor_level: 3,
      building_amenities: 'Gym, Swimming Pool, Security',
      latitude: -24.6282,
      longitude: 25.9231,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        'https://images.unsplash.com/photo-1560448075-bb485b067938?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
      ]),
      status: 'available'
    },
    {
      title: 'Spacious Family House',
      description: 'Large family house with garden in quiet neighborhood',
      price: 12000,
      location: 'Gaborone West',
      city: 'Gaborone',
      district: 'South East',
      bedrooms: 4,
      bathrooms: 3,
      property_type: 'house',
      furnished: false,
      pet_friendly: true,
      parking: true,
      garden: true,
      security: true,
      air_conditioning: false,
      internet: false,
      available_date: '2024-02-15',
      lease_duration: 24,
      deposit_amount: 24000,
      utilities_included: false,
      contact_phone: '+267 72 234 567',
      contact_email: 'landlord2@example.com',
      property_size: 180,
      floor_level: 1,
      building_amenities: 'Garden, Garage, Security',
      latitude: -24.6400,
      longitude: 25.9100,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        'https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
      ]),
      status: 'available'
    },
    {
      title: 'Luxury Executive Apartment',
      description: 'High-end apartment with premium finishes and city views',
      price: 15000,
      location: 'Francistown CBD',
      city: 'Francistown',
      district: 'North East',
      bedrooms: 3,
      bathrooms: 2,
      property_type: 'apartment',
      furnished: true,
      pet_friendly: false,
      parking: true,
      garden: false,
      security: true,
      air_conditioning: true,
      internet: true,
      available_date: '2024-03-01',
      lease_duration: 12,
      deposit_amount: 30000,
      utilities_included: true,
      contact_phone: '+267 72 345 678',
      contact_email: 'landlord3@example.com',
      property_size: 120,
      floor_level: 8,
      building_amenities: 'Gym, Pool, Concierge, Security',
      latitude: -21.1699,
      longitude: 27.5084,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
      ]),
      status: 'available'
    },
    {
      title: 'Cozy Studio Apartment',
      description: 'Perfect for students or young professionals',
      price: 4500,
      location: 'Molepolole',
      city: 'Molepolole',
      district: 'South East',
      bedrooms: 1,
      bathrooms: 1,
      property_type: 'apartment',
      furnished: true,
      pet_friendly: false,
      parking: false,
      garden: false,
      security: false,
      air_conditioning: false,
      internet: true,
      available_date: '2024-02-10',
      lease_duration: 6,
      deposit_amount: 9000,
      utilities_included: true,
      contact_phone: '+267 72 456 789',
      contact_email: 'landlord4@example.com',
      property_size: 35,
      floor_level: 2,
      building_amenities: 'Laundry, Wi-Fi',
      latitude: -24.4031,
      longitude: 25.4914,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
      ]),
      status: 'available'
    },
    {
      title: 'Safari Lodge Style Home',
      description: 'Unique property with safari theme and amazing views',
      price: 18000,
      location: 'Maun',
      city: 'Maun',
      district: 'North West',
      bedrooms: 3,
      bathrooms: 2,
      property_type: 'house',
      furnished: true,
      pet_friendly: true,
      parking: true,
      garden: true,
      security: true,
      air_conditioning: true,
      internet: true,
      available_date: '2024-04-01',
      lease_duration: 12,
      deposit_amount: 36000,
      utilities_included: false,
      contact_phone: '+267 72 567 890',
      contact_email: 'landlord5@example.com',
      property_size: 200,
      floor_level: 1,
      building_amenities: 'Pool, Garden, Game Room',
      latitude: -19.9837,
      longitude: 23.4167,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
      ]),
      status: 'available'
    }
  ];

  const insertRental = db.prepare(`
    INSERT INTO rentals (
      title, description, price, location, city, district, bedrooms, bathrooms,
      property_type, furnished, pet_friendly, parking, garden, security,
      air_conditioning, internet, available_date, lease_duration, deposit_amount,
      utilities_included, contact_phone, contact_email, property_size, floor_level,
      building_amenities, latitude, longitude, images, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const checkRental = db.prepare('SELECT COUNT(*) as count FROM rentals');
  const existingCount = checkRental.get()?.count || 0;

  if (existingCount === 0) {
    console.log('Adding sample rentals...');
    
    sampleRentals.forEach(rental => {
      insertRental.run(
        rental.title,
        rental.description,
        rental.price,
        rental.location,
        rental.city,
        rental.district,
        rental.bedrooms,
        rental.bathrooms,
        rental.property_type,
        rental.furnished,
        rental.pet_friendly,
        rental.parking,
        rental.garden,
        rental.security,
        rental.air_conditioning,
        rental.internet,
        rental.available_date,
        rental.lease_duration,
        rental.deposit_amount,
        rental.utilities_included,
        rental.contact_phone,
        rental.contact_email,
        rental.property_size,
        rental.floor_level,
        rental.building_amenities,
        rental.latitude,
        rental.longitude,
        rental.images,
        rental.status
      );
    });
    
    console.log(`✅ Added ${sampleRentals.length} sample rentals`);
  } else {
    console.log(`✅ Rentals already exist (${existingCount}), skipping...`);
  }
};

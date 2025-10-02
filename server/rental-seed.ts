
import { db } from "./db";
import { rental_listings, users } from "../shared/schema";
// Note: Location data is now provided via API, not static imports
// We'll use predefined coordinates for seeding since this is a one-time operation
import { inArray, asc } from 'drizzle-orm';

export async function seedRentals() {
  console.log("Seeding rental listings...");

  // Check if rental listings already exist
  try {
    const existingRentals = await db.query.rental_listings?.findFirst();

    if (existingRentals) {
      console.log("✅ Rental listings already exist, skipping seeding...");
      return;
    }
  } catch (error) {
    console.log("No existing rental listings found, proceeding with seeding...");
  }

  // Get existing users for landlord IDs
  type LandlordUser = { id: number };

  const landlords: LandlordUser[] = await db.select({ id: users.id })
    .from(users)
    .where(inArray(users.userType, ['agent', 'fsbo', 'seller']))
    .orderBy(asc(users.id));
    
  if (landlords.length === 0) {
    console.log("❌ No eligible landlord users found. Need users with type 'agent', 'fsbo', or 'seller'");
    return;
  }
  
  console.log(`Found ${landlords.length} eligible landlords with IDs: ${landlords.map((landlord: LandlordUser) => landlord.id).join(', ')}`);
  
  const getLandlordId = (i: number) => landlords[i % landlords.length]!.id;

  const baseRentals = [
    {
      title: 'Modern 2-Bedroom Apartment',
      description: 'Beautiful modern apartment in the heart of Gaborone with all amenities',
      address: 'Gaborone CBD, Plot 123',
      city: 'Gaborone',
      district: 'South East',
      ward: 'Ward 1',
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
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        'https://images.unsplash.com/photo-1560448075-bb485b067938?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
      ]),
      amenities: JSON.stringify(['gym', 'swimming_pool', 'security', 'air_conditioning']),
      utilities_included: JSON.stringify(['water', 'internet']),
      status: 'active'
    },
    {
      title: 'Spacious Family House',
      description: 'Large family house with garden in quiet neighborhood',
      address: 'Gaborone West, Plot 456',
      city: 'Gaborone',
      district: 'South East',
      ward: 'Ward 3',
      property_type: 'house',
      bedrooms: 4,
      bathrooms: 3,
      square_meters: 180,
      monthly_rent: 12000,
      deposit_amount: 24000,
      lease_duration: 24,
      available_from: '2024-02-15',
      furnished: false,
      pets_allowed: true,
      parking_spaces: 2,
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
      ]),
      amenities: JSON.stringify(['garden', 'garage', 'security']),
      utilities_included: JSON.stringify([]),
      status: 'active'
    },
    {
      title: 'Luxury Executive Apartment',
      description: 'High-end apartment with premium finishes and city views',
      address: 'Francistown CBD, Plot 789',
      city: 'Francistown',
      district: 'North East',
      ward: 'Ward 5',
      property_type: 'apartment',
      bedrooms: 3,
      bathrooms: 2,
      square_meters: 120,
      monthly_rent: 15000,
      deposit_amount: 30000,
      lease_duration: 12,
      available_from: '2024-03-01',
      furnished: true,
      pets_allowed: false,
      parking_spaces: 1,
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
      ]),
      amenities: JSON.stringify(['gym', 'pool', 'concierge', 'security', 'air_conditioning']),
      utilities_included: JSON.stringify(['water', 'electricity', 'internet']),
      status: 'active'
    },
    {
      title: 'Cozy Studio Apartment',
      description: 'Perfect for students or young professionals',
      address: 'Molepolole, Plot 321',
      city: 'Molepolole',
      district: 'South East',
      ward: 'Ward 2',
      property_type: 'apartment',
      bedrooms: 1,
      bathrooms: 1,
      square_meters: 35,
      monthly_rent: 4500,
      deposit_amount: 9000,
      lease_duration: 6,
      available_from: '2024-02-10',
      furnished: true,
      pets_allowed: false,
      parking_spaces: 0,
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
      ]),
      amenities: JSON.stringify(['laundry', 'wifi']),
      utilities_included: JSON.stringify(['water', 'electricity', 'internet']),
      status: 'active'
    },
    {
      title: 'Safari Lodge Style Home',
      description: 'Unique property with safari theme and amazing views',
      address: 'Maun, Plot 654',
      city: 'Maun',
      district: 'North West',
      ward: 'Ward 7',
      property_type: 'house',
      bedrooms: 3,
      bathrooms: 2,
      square_meters: 200,
      monthly_rent: 18000,
      deposit_amount: 36000,
      lease_duration: 12,
      available_from: '2024-04-01',
      furnished: true,
      pets_allowed: true,
      parking_spaces: 2,
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
      ]),
      amenities: JSON.stringify(['pool', 'garden', 'game_room', 'air_conditioning']),
      utilities_included: JSON.stringify([]),
      status: 'active'
    }
  ];

  // Map base rentals to actual landlord IDs
  const sampleRentals = baseRentals.map((rental, i) => ({
    ...rental,
    landlord_id: getLandlordId(i)
  }));

  try {
    console.log(`Adding ${sampleRentals.length} rental listings...`);

    const insertedRentals = await db.insert(rental_listings).values(sampleRentals).returning();
    console.log(`✅ Successfully inserted ${insertedRentals.length} rental listings`);

  } catch (error) {
    console.error("❌ Rental listings seeding failed:", error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedRentals()
    .then(() => {
      console.log("Rental listings seeding completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Rental listings seeding failed:", error);
      process.exit(1);
    });
}

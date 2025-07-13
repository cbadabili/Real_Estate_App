
import { db } from './db';

export async function seedRentalData() {
  try {
    // Check if rental data already exists
    const existingRentals = await db.exec('SELECT COUNT(*) as count FROM rental_listings');
    
    // Insert sample rental listings
    await db.exec(`
      INSERT OR IGNORE INTO rental_listings (
        id, landlord_id, title, description, address, city, district, property_type,
        bedrooms, bathrooms, square_meters, monthly_rent, deposit_amount, lease_duration,
        available_from, furnished, pets_allowed, parking_spaces, photos, amenities, utilities_included
      ) VALUES 
      (1, 1, 'Modern 2-Bedroom Apartment in Gaborone CBD', 
       'Beautiful modern apartment with stunning city views, fully furnished and ready to move in.', 
       '123 Main Mall', 'Gaborone', 'Central', 'apartment', 2, 2, 85, 8500, 17000, 12,
       '2024-02-01', 1, 0, 1, 
       '["https://via.placeholder.com/400x300", "https://via.placeholder.com/400x300"]',
       '["Air Conditioning", "WiFi", "Security", "Swimming Pool"]',
       '["Water", "Electricity", "WiFi"]'),
       
      (2, 1, 'Spacious Family House in Mogoditshane', 
       'Large 3-bedroom house perfect for families, with a big yard and garage.', 
       '456 Residential Road', 'Mogoditshane', 'Kweneng West', 'house', 3, 2, 120, 6500, 13000, 12,
       '2024-01-15', 0, 1, 2, 
       '["https://via.placeholder.com/400x300", "https://via.placeholder.com/400x300"]',
       '["Garden", "Garage", "Security", "Backup Water"]',
       '["Water"]'),
       
      (3, 2, 'Luxury Townhouse in Phakalane', 
       'Upmarket townhouse in secure estate with golf course access.', 
       '789 Golf Estate', 'Gaborone', 'North', 'townhouse', 3, 3, 150, 12000, 24000, 24,
       '2024-03-01', 1, 0, 2, 
       '["https://via.placeholder.com/400x300", "https://via.placeholder.com/400x300"]',
       '["Golf Course Access", "Swimming Pool", "Gym", "Security", "Garden"]',
       '["Water", "Electricity", "Security", "Garden Maintenance"]'),
       
      (4, 2, 'Cozy Studio in Broadhurst', 
       'Perfect for young professionals, close to shopping and transport.', 
       '321 Broadhurst Street', 'Gaborone', 'Broadhurst', 'studio', 0, 1, 35, 3500, 7000, 6,
       '2024-01-20', 1, 0, 1, 
       '["https://via.placeholder.com/400x300"]',
       '["WiFi", "Security", "Kitchenette"]',
       '["Water", "Electricity", "WiFi"]'),
       
      (5, 3, '4-Bedroom House in Extension 9', 
       'Large family home with plenty of space and modern amenities.', 
       '654 Extension Road', 'Gaborone', 'Extension 9', 'house', 4, 3, 180, 9500, 19000, 12,
       '2024-02-15', 0, 1, 3, 
       '["https://via.placeholder.com/400x300", "https://via.placeholder.com/400x300"]',
       '["Large Yard", "Double Garage", "Solar Panels", "Borehole"]',
       '["Water"])
    `);

    console.log('✅ Sample rental data seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding rental data:', error);
  }
}

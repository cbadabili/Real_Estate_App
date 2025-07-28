import Database from 'better-sqlite3';
import { join } from 'path';

const dbPath = join(process.cwd(), 'beedab.db');
console.log('Using SQLite database at:', dbPath);

const db = new Database(dbPath);

async function fixCoordinates() {
  console.log('🧹 Cleaning and fixing coordinates...');

  try {
    // Set accurate Botswana coordinates for all properties
    const updates = [
      { id: 1, lat: -24.6282, lng: 25.9231, location: 'Central Gaborone' },
      { id: 2, lat: -24.6400, lng: 25.9100, location: 'West Gaborone' },
      { id: 3, lat: -24.6200, lng: 25.8900, location: 'South Gaborone' },
      { id: 4, lat: -21.1670, lng: 27.5084, location: 'Francistown' },
      { id: 5, lat: -19.9956, lng: 23.4053, location: 'Maun' },
      { id: 6, lat: -17.8278, lng: 25.1567, location: 'Kasane' }
    ];

    for (const update of updates) {
      const result = db.prepare(`
        UPDATE properties 
        SET latitude = ?, longitude = ? 
        WHERE id = ?
      `).run(update.lat, update.lng, update.id);

      if (result.changes > 0) {
        console.log(`✅ Updated property ${update.id} coordinates for ${update.location}`);
      }
    }

    // Verify the updates
    console.log('\n📊 Current property coordinates:');
    const properties = db.prepare(`
      SELECT id, title, latitude, longitude, city, property_type 
      FROM properties 
      ORDER BY id
    `).all();

    properties.forEach((prop: any) => {
      console.log(`🏠 ${prop.title} (${prop.city}): ${prop.latitude}, ${prop.longitude}`);
    });

    console.log(`\n✅ Fixed coordinates for ${updates.length} properties`);

  } catch (error) {
    console.error('❌ Error fixing coordinates:', error);
  } finally {
    db.close();
  }
}

fixCoordinates();
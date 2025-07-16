
import { Database } from 'better-sqlite3';
import { getAllTowns, findNearbyTowns } from '../client/src/data/botswanaGeography';

export interface Rental {
  id: number;
  title: string;
  description?: string;
  price: number;
  location: string;
  city: string;
  district?: string;
  bedrooms: number;
  bathrooms: number;
  property_type: string;
  furnished: boolean;
  pet_friendly: boolean;
  parking: boolean;
  garden: boolean;
  security: boolean;
  air_conditioning: boolean;
  internet: boolean;
  available_date?: string;
  lease_duration?: number;
  deposit_amount?: number;
  utilities_included: boolean;
  contact_phone?: string;
  contact_email?: string;
  landlord_id?: number;
  agent_id?: number;
  property_size?: number;
  floor_level?: number;
  building_amenities?: string;
  latitude?: number;
  longitude?: number;
  images?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface RentalApplication {
  id: number;
  rental_id: number;
  applicant_id: number;
  application_date: string;
  status: string;
  move_in_date?: string;
  employment_status?: string;
  monthly_income?: number;
  references?: string;
  additional_notes?: string;
  documents?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RentalFilters {
  location?: string;
  city?: string;
  district?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  property_type?: string;
  furnished?: boolean;
  pet_friendly?: boolean;
  parking?: boolean;
  garden?: boolean;
  security?: boolean;
  air_conditioning?: boolean;
  internet?: boolean;
  utilities_included?: boolean;
  available_date?: string;
  status?: string;
}

export class RentalStorage {
  constructor(private db: Database) {}

  // Get all rentals
  getAllRentals(): Rental[] {
    const stmt = this.db.prepare(`
      SELECT * FROM rentals 
      WHERE status = 'available' 
      ORDER BY created_at DESC
    `);
    return stmt.all() as Rental[];
  }

  // Get rental by ID
  getRentalById(id: number): Rental | undefined {
    const stmt = this.db.prepare('SELECT * FROM rentals WHERE id = ?');
    return stmt.get(id) as Rental | undefined;
  }

  // Search rentals with filters
  searchRentals(filters: RentalFilters = {}): Rental[] {
    let query = `
      SELECT * FROM rentals 
      WHERE status = 'available'
    `;
    const params: any[] = [];

    if (filters.location) {
      query += ` AND location LIKE ?`;
      params.push(`%${filters.location}%`);
    }

    if (filters.city) {
      query += ` AND city LIKE ?`;
      params.push(`%${filters.city}%`);
    }

    if (filters.district) {
      query += ` AND district LIKE ?`;
      params.push(`%${filters.district}%`);
    }

    if (filters.minPrice !== undefined) {
      query += ` AND price >= ?`;
      params.push(filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      query += ` AND price <= ?`;
      params.push(filters.maxPrice);
    }

    if (filters.bedrooms !== undefined) {
      query += ` AND bedrooms >= ?`;
      params.push(filters.bedrooms);
    }

    if (filters.bathrooms !== undefined) {
      query += ` AND bathrooms >= ?`;
      params.push(filters.bathrooms);
    }

    if (filters.property_type) {
      query += ` AND property_type = ?`;
      params.push(filters.property_type);
    }

    if (filters.furnished !== undefined) {
      query += ` AND furnished = ?`;
      params.push(filters.furnished);
    }

    if (filters.pet_friendly !== undefined) {
      query += ` AND pet_friendly = ?`;
      params.push(filters.pet_friendly);
    }

    if (filters.parking !== undefined) {
      query += ` AND parking = ?`;
      params.push(filters.parking);
    }

    if (filters.garden !== undefined) {
      query += ` AND garden = ?`;
      params.push(filters.garden);
    }

    if (filters.security !== undefined) {
      query += ` AND security = ?`;
      params.push(filters.security);
    }

    if (filters.air_conditioning !== undefined) {
      query += ` AND air_conditioning = ?`;
      params.push(filters.air_conditioning);
    }

    if (filters.internet !== undefined) {
      query += ` AND internet = ?`;
      params.push(filters.internet);
    }

    if (filters.utilities_included !== undefined) {
      query += ` AND utilities_included = ?`;
      params.push(filters.utilities_included);
    }

    if (filters.available_date) {
      query += ` AND available_date <= ?`;
      params.push(filters.available_date);
    }

    query += ` ORDER BY created_at DESC`;

    const stmt = this.db.prepare(query);
    return stmt.all(...params) as Rental[];
  }

  // Create new rental
  createRental(rental: Omit<Rental, 'id' | 'created_at' | 'updated_at'>): Rental {
    const stmt = this.db.prepare(`
      INSERT INTO rentals (
        title, description, price, location, city, district, bedrooms, bathrooms,
        property_type, furnished, pet_friendly, parking, garden, security,
        air_conditioning, internet, available_date, lease_duration, deposit_amount,
        utilities_included, contact_phone, contact_email, landlord_id, agent_id,
        property_size, floor_level, building_amenities, latitude, longitude,
        images, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      rental.title,
      rental.description || null,
      rental.price,
      rental.location,
      rental.city,
      rental.district || null,
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
      rental.available_date || null,
      rental.lease_duration || null,
      rental.deposit_amount || null,
      rental.utilities_included,
      rental.contact_phone || null,
      rental.contact_email || null,
      rental.landlord_id || null,
      rental.agent_id || null,
      rental.property_size || null,
      rental.floor_level || null,
      rental.building_amenities || null,
      rental.latitude || null,
      rental.longitude || null,
      rental.images || null,
      rental.status || 'available'
    );

    return this.getRentalById(result.lastInsertRowid as number)!;
  }

  // Update rental
  updateRental(id: number, updates: Partial<Rental>): boolean {
    const fields = Object.keys(updates).filter(key => key !== 'id' && key !== 'created_at');
    if (fields.length === 0) return false;

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => (updates as any)[field]);

    const stmt = this.db.prepare(`
      UPDATE rentals 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);

    const result = stmt.run(...values, id);
    return result.changes > 0;
  }

  // Delete rental
  deleteRental(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM rentals WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  // Get rental applications
  getRentalApplications(rentalId?: number): RentalApplication[] {
    let query = 'SELECT * FROM rental_applications';
    const params: any[] = [];

    if (rentalId) {
      query += ' WHERE rental_id = ?';
      params.push(rentalId);
    }

    query += ' ORDER BY application_date DESC';

    const stmt = this.db.prepare(query);
    return stmt.all(...params) as RentalApplication[];
  }

  // Create rental application
  createRentalApplication(application: Omit<RentalApplication, 'id' | 'created_at' | 'updated_at'>): RentalApplication {
    const stmt = this.db.prepare(`
      INSERT INTO rental_applications (
        rental_id, applicant_id, application_date, status, move_in_date,
        employment_status, monthly_income, references, additional_notes, documents
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      application.rental_id,
      application.applicant_id,
      application.application_date,
      application.status,
      application.move_in_date || null,
      application.employment_status || null,
      application.monthly_income || null,
      application.references || null,
      application.additional_notes || null,
      application.documents || null
    );

    const getStmt = this.db.prepare('SELECT * FROM rental_applications WHERE id = ?');
    return getStmt.get(result.lastInsertRowid as number) as RentalApplication;
  }

  // Update rental application status
  updateRentalApplicationStatus(id: number, status: string): boolean {
    const stmt = this.db.prepare(`
      UPDATE rental_applications 
      SET status = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    const result = stmt.run(status, id);
    return result.changes > 0;
  }

  // Get rentals by user
  getRentalsByUser(userId: number, role: 'landlord' | 'agent' = 'landlord'): Rental[] {
    const column = role === 'landlord' ? 'landlord_id' : 'agent_id';
    const stmt = this.db.prepare(`SELECT * FROM rentals WHERE ${column} = ? ORDER BY created_at DESC`);
    return stmt.all(userId) as Rental[];
  }

  // Get rental statistics
  async getRentalStats(): Promise<any> {
    const { db } = await import('./db');
    const { rental_listings } = await import('../shared/schema');
    const { count, avg, eq } = await import('drizzle-orm');

    try {
      const [totalResult] = await db.select({ total: count() }).from(rental_listings);
      const [availableResult] = await db.select({ available: count() }).from(rental_listings).where(eq(rental_listings.status, 'active'));
      const [rentedResult] = await db.select({ rented: count() }).from(rental_listings).where(eq(rental_listings.status, 'rented'));
      const [avgPriceResult] = await db.select({ avg_price: avg(rental_listings.monthly_rent) }).from(rental_listings).where(eq(rental_listings.status, 'active'));

      return {
        total: totalResult?.total || 0,
        available: availableResult?.available || 0,
        rented: rentedResult?.rented || 0,
        avgPrice: avgPriceResult?.avg_price || 0
      };
    } catch (error) {
      console.error('Error getting rental stats:', error);
      return {
        total: 0,
        available: 0,
        rented: 0,
        avgPrice: 0
      };
    }
  }
}

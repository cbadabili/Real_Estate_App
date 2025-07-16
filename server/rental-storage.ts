import { db } from './db';
import { rental_listings } from '../shared/schema';
import { eq, and, gte, lte, like, or, desc, count, avg } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';

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

export interface RentalApplication {
  id?: number;
  rental_id: number;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  application_date: string;
  status: 'pending' | 'approved' | 'rejected';
  monthly_income?: number;
  employment_status?: string;
  references?: string;
  notes?: string;
}

export class RentalStorage {
  private db: any;

  constructor(database?: any) {
    // Use the imported db instance directly for consistency
    this.db = db;
    
    if (!this.db) {
      throw new Error('Database connection not initialized in RentalStorage');
    }
  }

  // Get all rentals
  getAllRentals() {
    try {
      return this.db.select().from(rental_listings).orderBy(desc(rental_listings.created_at)).all();
    } catch (error) {
      console.error('Error getting all rentals:', error);
      return [];
    }
  }

  // Get rental by ID
  getRentalById(id: number) {
    try {
      const result = this.db.select().from(rental_listings).where(eq(rental_listings.id, id)).get();
      return result || null;
    } catch (error) {
      console.error('Error getting rental by ID:', error);
      return null;
    }
  }

  // Search rentals with filters
  searchRentals(filters: RentalFilters) {
    try {
      if (!this.db) {
        throw new Error('Database connection not initialized in RentalStorage');
      }
      
      let query = this.db.select().from(rental_listings);
      const conditions = [];

      // Build filter conditions
      if (filters.location) {
        conditions.push(like(rental_listings.location, `%${filters.location}%`));
      }

      if (filters.city) {
        conditions.push(like(rental_listings.city, `%${filters.city}%`));
      }

      if (filters.district) {
        conditions.push(like(rental_listings.district, `%${filters.district}%`));
      }

      if (filters.minPrice !== undefined) {
        conditions.push(gte(rental_listings.monthly_rent, filters.minPrice));
      }

      if (filters.maxPrice !== undefined) {
        conditions.push(lte(rental_listings.monthly_rent, filters.maxPrice));
      }

      if (filters.bedrooms !== undefined) {
        conditions.push(eq(rental_listings.bedrooms, filters.bedrooms));
      }

      if (filters.bathrooms !== undefined) {
        conditions.push(eq(rental_listings.bathrooms, filters.bathrooms));
      }

      if (filters.property_type) {
        conditions.push(eq(rental_listings.property_type, filters.property_type));
      }

      if (filters.furnished !== undefined) {
        conditions.push(eq(rental_listings.furnished, filters.furnished));
      }

      if (filters.pet_friendly !== undefined) {
        conditions.push(eq(rental_listings.pet_friendly, filters.pet_friendly));
      }

      if (filters.parking !== undefined) {
        conditions.push(eq(rental_listings.parking, filters.parking));
      }

      if (filters.garden !== undefined) {
        conditions.push(eq(rental_listings.garden, filters.garden));
      }

      if (filters.security !== undefined) {
        conditions.push(eq(rental_listings.security, filters.security));
      }

      if (filters.air_conditioning !== undefined) {
        conditions.push(eq(rental_listings.air_conditioning, filters.air_conditioning));
      }

      if (filters.internet !== undefined) {
        conditions.push(eq(rental_listings.internet, filters.internet));
      }

      if (filters.utilities_included !== undefined) {
        conditions.push(eq(rental_listings.utilities_included, filters.utilities_included));
      }

      if (filters.status) {
        conditions.push(eq(rental_listings.status, filters.status));
      }

      if (filters.available_date) {
        conditions.push(lte(rental_listings.available_date, filters.available_date));
      }

      // Apply conditions if any exist
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      return query.orderBy(desc(rental_listings.created_at)).all();
    } catch (error) {
      console.error('Error searching rentals:', error);
      return [];
    }
  }

  // Create new rental
  createRental(rentalData: any) {
    try {
      const newRental = {
        title: rentalData.title,
        description: rentalData.description || null,
        monthly_rent: rentalData.price || rentalData.monthly_rent,
        location: rentalData.location,
        city: rentalData.city,
        district: rentalData.district || null,
        bedrooms: rentalData.bedrooms || 1,
        bathrooms: rentalData.bathrooms || 1,
        property_type: rentalData.property_type || 'apartment',
        furnished: rentalData.furnished || false,
        pet_friendly: rentalData.pet_friendly || false,
        parking: rentalData.parking || false,
        garden: rentalData.garden || false,
        security: rentalData.security || false,
        air_conditioning: rentalData.air_conditioning || false,
        internet: rentalData.internet || false,
        utilities_included: rentalData.utilities_included || false,
        available_date: rentalData.available_date || new Date().toISOString().split('T')[0],
        lease_duration: rentalData.lease_duration || 12,
        deposit_amount: rentalData.deposit_amount || 0,
        property_size: rentalData.property_size || null,
        images: rentalData.images || null,
        landlord_id: rentalData.landlord_id || null,
        status: rentalData.status || 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const result = this.db.insert(rental_listings).values(newRental).returning().get();
      return result;
    } catch (error) {
      console.error('Error creating rental:', error);
      throw error;
    }
  }

  // Update rental
  updateRental(id: number, updates: any) {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      const result = this.db.update(rental_listings)
        .set(updateData)
        .where(eq(rental_listings.id, id))
        .run();

      return result.changes > 0;
    } catch (error) {
      console.error('Error updating rental:', error);
      return false;
    }
  }

  // Delete rental
  deleteRental(id: number) {
    try {
      const result = this.db.delete(rental_listings)
        .where(eq(rental_listings.id, id))
        .run();

      return result.changes > 0;
    } catch (error) {
      console.error('Error deleting rental:', error);
      return false;
    }
  }

  // Get rental applications (placeholder - would need applications table)
  getRentalApplications(rentalId: number): RentalApplication[] {
    try {
      // This would require a rental_applications table
      // For now, return empty array
      console.log(`Getting applications for rental ${rentalId}`);
      return [];
    } catch (error) {
      console.error('Error getting rental applications:', error);
      return [];
    }
  }

  // Create rental application (placeholder)
  createRentalApplication(applicationData: RentalApplication) {
    try {
      // This would require a rental_applications table
      console.log('Creating rental application:', applicationData);
      return { id: Date.now(), ...applicationData };
    } catch (error) {
      console.error('Error creating rental application:', error);
      throw error;
    }
  }

  // Update rental application status (placeholder)
  updateRentalApplicationStatus(id: number, status: string) {
    try {
      // This would require a rental_applications table
      console.log(`Updating application ${id} status to ${status}`);
      return true;
    } catch (error) {
      console.error('Error updating application status:', error);
      return false;
    }
  }

  // Get rental statistics
  async getRentalStats(): Promise<any> {
    try {
      const [totalResult] = await this.db.select({ total: count() }).from(rental_listings);
      const [availableResult] = await this.db.select({ available: count() }).from(rental_listings).where(eq(rental_listings.status, 'active'));
      const [rentedResult] = await this.db.select({ rented: count() }).from(rental_listings).where(eq(rental_listings.status, 'rented'));
      const [avgPriceResult] = await this.db.select({ avg_price: avg(rental_listings.monthly_rent) }).from(rental_listings).where(eq(rental_listings.status, 'active'));

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
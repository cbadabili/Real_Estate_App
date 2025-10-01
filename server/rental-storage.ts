
import { db } from './db';
import { rental_listings, rental_applications } from '../shared/schema';
import { eq, and, gte, lte, like, desc, count, avg, type SQL } from 'drizzle-orm';

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
  pets_allowed?: boolean;
  parking_spaces?: number;
  status?: string;
  available_from?: string;
}

export interface RentalApplication {
  id?: number;
  rental_id: number;
  renter_id: number;
  application_data: any;
  status: 'pending' | 'approved' | 'rejected';
  background_check_status?: string;
  credit_report_status?: string;
  created_at?: string;
  updated_at?: string;
}

export class RentalStorage {
  // Get all rentals
  async getAllRentals() {
    try {
      return await db.select().from(rental_listings).orderBy(desc(rental_listings.created_at));
    } catch (error) {
      console.error('Error getting all rentals:', error);
      return [];
    }
  }

  // Get rental by ID
  async getRentalById(id: number) {
    try {
      const result = await db.select().from(rental_listings).where(eq(rental_listings.id, id));
      return result[0] || null;
    } catch (error) {
      console.error('Error getting rental by ID:', error);
      return null;
    }
  }

  // Search rentals with filters
  async searchRentals(filters: RentalFilters) {
    try {
      const baseQuery = db.select().from(rental_listings);
      const conditions: (SQL<unknown> | undefined)[] = [];

      // Build filter conditions using Drizzle query builder
      if (filters.location) {
        conditions.push(like(rental_listings.address, `%${filters.location}%`));
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

      if (filters.pets_allowed !== undefined) {
        conditions.push(eq(rental_listings.pets_allowed, filters.pets_allowed));
      }

      if (filters.parking_spaces !== undefined) {
        conditions.push(gte(rental_listings.parking_spaces, filters.parking_spaces));
      }

      if (filters.status) {
        conditions.push(eq(rental_listings.status, filters.status));
      } else {
        // Default to active listings only
        conditions.push(eq(rental_listings.status, 'active'));
      }

      if (filters.available_from) {
        conditions.push(lte(rental_listings.available_from, filters.available_from));
      }

      // Apply conditions if any exist
      const activeConditions = conditions.filter((condition): condition is SQL<unknown> => Boolean(condition));
      const whereClause = activeConditions.length > 0 ? and(...activeConditions) : undefined;
      const filteredQuery = whereClause ? baseQuery.where(whereClause) : baseQuery;

      console.log('Searching rentals with filters:', filters);
      const results = await filteredQuery.orderBy(desc(rental_listings.created_at));
      console.log('Found rentals:', results.length);
      
      return results;
    } catch (error) {
      console.error('Error searching rentals:', error);
      return [];
    }
  }

  // Create new rental
  async createRental(rentalData: any) {
    try {
      const newRental = {
        landlord_id: rentalData.landlord_id || null,
        title: rentalData.title,
        description: rentalData.description || '',
        address: rentalData.location || rentalData.address,
        city: rentalData.city,
        district: rentalData.district || '',
        ward: rentalData.ward || null,
        property_type: rentalData.property_type || 'apartment',
        bedrooms: rentalData.bedrooms || 1,
        bathrooms: rentalData.bathrooms || 1,
        square_meters: rentalData.square_meters || rentalData.property_size || 50,
        monthly_rent: rentalData.price || rentalData.monthly_rent,
        deposit_amount: rentalData.deposit_amount || 0,
        lease_duration: rentalData.lease_duration || 12,
        available_from: rentalData.available_date || rentalData.available_from || new Date().toISOString().split('T')[0],
        furnished: rentalData.furnished || false,
        pets_allowed: rentalData.pet_friendly || rentalData.pets_allowed || false,
        parking_spaces: rentalData.parking || rentalData.parking_spaces || 0,
        photos: rentalData.images || '[]',
        amenities: rentalData.amenities || '[]',
        utilities_included: rentalData.utilities_included || '[]',
        status: rentalData.status || 'active'
      };

      const result = await db.insert(rental_listings).values(newRental).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating rental:', error);
      throw error;
    }
  }

  // Update rental
  async updateRental(id: number, updates: any) {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date()
      };

      const result = await db.update(rental_listings)
        .set(updateData)
        .where(eq(rental_listings.id, id))
        .returning();

      return result.length > 0;
    } catch (error) {
      console.error('Error updating rental:', error);
      return false;
    }
  }

  // Delete rental
  async deleteRental(id: number) {
    try {
      const result = await db.delete(rental_listings)
        .where(eq(rental_listings.id, id))
        .returning();

      return result.length > 0;
    } catch (error) {
      console.error('Error deleting rental:', error);
      return false;
    }
  }

  // Get rental applications
  async getRentalApplications(rentalId: number): Promise<RentalApplication[]> {
    try {
      const applications = await db.select()
        .from(rental_applications)
        .where(eq(rental_applications.rental_id, rentalId))
        .orderBy(desc(rental_applications.created_at));

      return applications.map((app) => {
        const mapped: RentalApplication = {
          id: app.id,
          rental_id: app.rental_id ?? 0,
          renter_id: app.renter_id ?? 0,
          application_data: app.application_data,
          status: (app.status as RentalApplication['status']) ?? 'pending',
          background_check_status: app.background_check_status ?? 'pending',
          credit_report_status: app.credit_report_status ?? 'pending',
        };

        if (app.created_at instanceof Date) {
          mapped.created_at = app.created_at.toISOString();
        }

        if (app.updated_at instanceof Date) {
          mapped.updated_at = app.updated_at.toISOString();
        }

        return mapped;
      });
    } catch (error) {
      console.error('Error getting rental applications:', error);
      return [];
    }
  }

  // Create rental application
  async createRentalApplication(applicationData: Omit<RentalApplication, 'id'>) {
    try {
      const newApplication = {
        rental_id: applicationData.rental_id,
        renter_id: applicationData.renter_id,
        application_data: applicationData.application_data,
        status: applicationData.status || 'pending',
        background_check_status: applicationData.background_check_status || 'pending',
        credit_report_status: applicationData.credit_report_status || 'pending'
      };

      const result = await db.insert(rental_applications).values(newApplication).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating rental application:', error);
      throw error;
    }
  }

  // Update rental application status
  async updateRentalApplicationStatus(id: number, status: string) {
    try {
      const result = await db.update(rental_applications)
        .set({
          status,
          updated_at: new Date()
        })
        .where(eq(rental_applications.id, id))
        .returning();

      return result.length > 0;
    } catch (error) {
      console.error('Error updating application status:', error);
      return false;
    }
  }

  // Get rental statistics
  async getRentalStats() {
    try {
      const totalResult = await db.select({ total: count() }).from(rental_listings);
      const availableResult = await db.select({ available: count() })
        .from(rental_listings)
        .where(eq(rental_listings.status, 'active'));
      const rentedResult = await db.select({ rented: count() })
        .from(rental_listings)
        .where(eq(rental_listings.status, 'rented'));
      const avgPriceResult = await db.select({ avg_price: avg(rental_listings.monthly_rent) })
        .from(rental_listings)
        .where(eq(rental_listings.status, 'active'));

      return {
        total: totalResult[0]?.total || 0,
        available: availableResult[0]?.available || 0,
        rented: rentedResult[0]?.rented || 0,
        avgPrice: avgPriceResult[0]?.avg_price || 0
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

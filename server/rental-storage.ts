
import { db } from './db';
import { 
  rental_listings, 
  rental_applications, 
  lease_agreements,
  users,
  service_providers 
} from '../shared/schema';
import { eq, and, gte, lte, like, desc, asc } from 'drizzle-orm';

export interface RentalListing {
  id?: number;
  landlord_id: number;
  title: string;
  description: string;
  address: string;
  city: string;
  district: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  square_meters: number;
  monthly_rent: number;
  deposit_amount: number;
  lease_duration: number;
  available_from: string;
  furnished: boolean;
  pets_allowed: boolean;
  parking_spaces: number;
  photos: string[];
  amenities: string[];
  utilities_included: string[];
  status: 'active' | 'rented' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export interface RentalApplication {
  id?: number;
  rental_id: number;
  renter_id: number;
  application_data: any;
  status: 'pending' | 'approved' | 'rejected';
  background_check_status?: 'pending' | 'in_progress' | 'complete';
  credit_report_status?: 'pending' | 'in_progress' | 'complete';
  created_at?: string;
  updated_at?: string;
}

export interface LeaseAgreement {
  id?: number;
  application_id: number;
  rental_id: number;
  landlord_id: number;
  renter_id: number;
  lease_start_date: string;
  lease_end_date: string;
  monthly_rent: number;
  deposit_amount: number;
  lease_terms: any;
  landlord_signature_status: 'pending' | 'signed';
  renter_signature_status: 'pending' | 'signed';
  e_signature_status: 'pending' | 'partially_signed' | 'fully_signed';
  created_at?: string;
  updated_at?: string;
}

export class RentalStorage {
  // Rental Listing Management
  async createRental(rental: RentalListing): Promise<RentalListing> {
    const [newRental] = await db.insert(rental_listings).values({
      ...rental,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }).returning();
    
    return newRental;
  }

  async updateRental(rentalId: number, rental: Partial<RentalListing>, landlordId: number): Promise<RentalListing | null> {
    const [updatedRental] = await db
      .update(rental_listings)
      .set({
        ...rental,
        updated_at: new Date().toISOString()
      })
      .where(and(
        eq(rental_listings.id, rentalId),
        eq(rental_listings.landlord_id, landlordId)
      ))
      .returning();
    
    return updatedRental || null;
  }

  async getLandlordRentals(landlordId: number): Promise<RentalListing[]> {
    return await db
      .select()
      .from(rental_listings)
      .where(eq(rental_listings.landlord_id, landlordId))
      .orderBy(desc(rental_listings.created_at));
  }

  async getRentalById(rentalId: number): Promise<RentalListing | null> {
    const [rental] = await db
      .select()
      .from(rental_listings)
      .where(eq(rental_listings.id, rentalId));
    
    return rental || null;
  }

  async searchRentals(filters: {
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    propertyType?: string;
    page?: number;
    limit?: number;
  }): Promise<RentalListing[]> {
    let query = db.select().from(rental_listings);
    
    const conditions = [eq(rental_listings.status, 'active')];
    
    if (filters.location) {
      conditions.push(
        like(rental_listings.city, `%${filters.location}%`)
      );
    }
    
    if (filters.minPrice) {
      conditions.push(gte(rental_listings.monthly_rent, filters.minPrice));
    }
    
    if (filters.maxPrice) {
      conditions.push(lte(rental_listings.monthly_rent, filters.maxPrice));
    }
    
    if (filters.bedrooms) {
      conditions.push(gte(rental_listings.bedrooms, filters.bedrooms));
    }
    
    if (filters.propertyType) {
      conditions.push(eq(rental_listings.property_type, filters.propertyType));
    }
    
    const rentals = await query
      .where(and(...conditions))
      .orderBy(desc(rental_listings.created_at))
      .limit(filters.limit || 20)
      .offset((filters.page || 0) * (filters.limit || 20));
    
    return rentals;
  }

  // Rental Applications
  async createApplication(application: RentalApplication): Promise<RentalApplication> {
    const [newApplication] = await db.insert(rental_applications).values({
      ...application,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }).returning();
    
    return newApplication;
  }

  async getLandlordApplications(landlordId: number): Promise<any[]> {
    return await db
      .select({
        application: rental_applications,
        rental: rental_listings,
        renter: {
          id: users.id,
          name: users.name,
          email: users.email
        }
      })
      .from(rental_applications)
      .innerJoin(rental_listings, eq(rental_applications.rental_id, rental_listings.id))
      .innerJoin(users, eq(rental_applications.renter_id, users.id))
      .where(eq(rental_listings.landlord_id, landlordId))
      .orderBy(desc(rental_applications.created_at));
  }

  async updateApplicationStatus(
    applicationId: number, 
    status: 'pending' | 'approved' | 'rejected',
    landlordId: number
  ): Promise<RentalApplication | null> {
    const [updatedApplication] = await db
      .update(rental_applications)
      .set({
        status,
        updated_at: new Date().toISOString()
      })
      .where(and(
        eq(rental_applications.id, applicationId),
        eq(rental_listings.landlord_id, landlordId)
      ))
      .from(rental_listings)
      .returning();
    
    return updatedApplication || null;
  }

  async getRenterApplications(renterId: number): Promise<any[]> {
    return await db
      .select({
        application: rental_applications,
        rental: rental_listings
      })
      .from(rental_applications)
      .innerJoin(rental_listings, eq(rental_applications.rental_id, rental_listings.id))
      .where(eq(rental_applications.renter_id, renterId))
      .orderBy(desc(rental_applications.created_at));
  }

  // Lease Management
  async createLease(lease: LeaseAgreement): Promise<LeaseAgreement> {
    const [newLease] = await db.insert(lease_agreements).values({
      ...lease,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }).returning();
    
    return newLease;
  }

  async updateLeaseSignature(
    leaseId: number, 
    userRole: 'landlord' | 'renter',
    userId: number
  ): Promise<LeaseAgreement | null> {
    const lease = await db
      .select()
      .from(lease_agreements)
      .where(eq(lease_agreements.id, leaseId))
      .then(results => results[0]);
    
    if (!lease) return null;
    
    const updates: any = {
      updated_at: new Date().toISOString()
    };
    
    if (userRole === 'landlord' && lease.landlord_id === userId) {
      updates.landlord_signature_status = 'signed';
    } else if (userRole === 'renter' && lease.renter_id === userId) {
      updates.renter_signature_status = 'signed';
    }
    
    // Update e_signature_status based on both signatures
    if (updates.landlord_signature_status === 'signed' || lease.landlord_signature_status === 'signed') {
      if (updates.renter_signature_status === 'signed' || lease.renter_signature_status === 'signed') {
        updates.e_signature_status = 'fully_signed';
      } else {
        updates.e_signature_status = 'partially_signed';
      }
    }
    
    const [updatedLease] = await db
      .update(lease_agreements)
      .set(updates)
      .where(eq(lease_agreements.id, leaseId))
      .returning();
    
    return updatedLease || null;
  }

  async getLeaseById(leaseId: number): Promise<LeaseAgreement | null> {
    const [lease] = await db
      .select()
      .from(lease_agreements)
      .where(eq(lease_agreements.id, leaseId));
    
    return lease || null;
  }

  // Screen tenant (simulate API call)
  async screenTenant(applicationId: number): Promise<RentalApplication | null> {
    // Simulate delay for screening process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const [updatedApplication] = await db
      .update(rental_applications)
      .set({
        background_check_status: 'complete',
        credit_report_status: 'complete',
        updated_at: new Date().toISOString()
      })
      .where(eq(rental_applications.id, applicationId))
      .returning();
    
    return updatedApplication || null;
  }
}

export const rentalStorage = new RentalStorage();

import { db } from './db';

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
    const stmt = db.prepare(`
      INSERT INTO rental_listings (
        landlord_id, title, description, address, city, district, property_type,
        bedrooms, bathrooms, square_meters, monthly_rent, deposit_amount, lease_duration,
        available_from, furnished, pets_allowed, parking_spaces, photos, amenities, utilities_included
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      rental.landlord_id, rental.title, rental.description, rental.address,
      rental.city, rental.district, rental.property_type, rental.bedrooms,
      rental.bathrooms, rental.square_meters, rental.monthly_rent, rental.deposit_amount,
      rental.lease_duration, rental.available_from, rental.furnished ? 1 : 0,
      rental.pets_allowed ? 1 : 0, rental.parking_spaces, 
      JSON.stringify(rental.photos || []), JSON.stringify(rental.amenities || []),
      JSON.stringify(rental.utilities_included || [])
    );

    const newRental = db.prepare('SELECT * FROM rental_listings WHERE id = ?').get(result.lastInsertRowid);
    return this.formatRental(newRental);
  }

  async updateRental(rentalId: number, rental: Partial<RentalListing>, landlordId: number): Promise<RentalListing | null> {
    const updates = [];
    const values = [];

    Object.entries(rental).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id') {
        updates.push(`${key} = ?`);
        if (key === 'photos' || key === 'amenities' || key === 'utilities_included') {
          values.push(JSON.stringify(value));
        } else if (key === 'furnished' || key === 'pets_allowed') {
          values.push(value ? 1 : 0);
        } else {
          values.push(value);
        }
      }
    });

    if (updates.length === 0) return null;

    updates.push('updated_at = datetime("now")');
    values.push(rentalId, landlordId);

    const stmt = db.prepare(`
      UPDATE rental_listings SET ${updates.join(', ')} 
      WHERE id = ? AND landlord_id = ?
    `);

    stmt.run(...values);

    const updatedRental = db.prepare('SELECT * FROM rental_listings WHERE id = ? AND landlord_id = ?').get(rentalId, landlordId);
    return updatedRental ? this.formatRental(updatedRental) : null;
  }

  async getLandlordRentals(landlordId: number): Promise<RentalListing[]> {
    const rentals = db.prepare('SELECT * FROM rental_listings WHERE landlord_id = ? ORDER BY created_at DESC').all(landlordId);
    return rentals.map(rental => this.formatRental(rental));
  }

  async getRentalById(rentalId: number): Promise<RentalListing | null> {
    const rental = db.prepare('SELECT * FROM rental_listings WHERE id = ?').get(rentalId);
    return rental ? this.formatRental(rental) : null;
  }

  async searchRentals(filters: any): Promise<any[]> {
    try {
      let query = `
        SELECT r.*, u.name as landlord_name, u.email as landlord_email 
        FROM rentals r 
        LEFT JOIN users u ON r.landlord_id = u.id 
        WHERE 1=1
      `;

      const params: any[] = [];

      if (filters.city) {
        query += ` AND r.city LIKE ?`;
        params.push(`%${filters.city}%`);
      }

      if (filters.minPrice) {
        query += ` AND r.monthly_rent >= ?`;
        params.push(filters.minPrice);
      }

      if (filters.maxPrice) {
        query += ` AND r.monthly_rent <= ?`;
        params.push(filters.maxPrice);
      }

      if (filters.bedrooms) {
        query += ` AND r.bedrooms >= ?`;
        params.push(filters.bedrooms);
      }

      if (filters.propertyType) {
        query += ` AND r.property_type = ?`;
        params.push(filters.propertyType);
      }

      query += ` ORDER BY r.created_at DESC LIMIT 50`;

      const stmt = this.db.prepare(query);
      return stmt.all(...params);
    } catch (error) {
      console.error('Error searching rentals:', error);
      throw error;
    }
  }

  // Helper method to format rental data
  private formatRental(rental: any): RentalListing {
    return {
      ...rental,
      furnished: Boolean(rental.furnished),
      pets_allowed: Boolean(rental.pets_allowed),
      photos: JSON.parse(rental.photos || '[]'),
      amenities: JSON.parse(rental.amenities || '[]'),
      utilities_included: JSON.parse(rental.utilities_included || '[]')
    };
  }

  // Rental Applications
  async createApplication(application: RentalApplication): Promise<RentalApplication> {
    const stmt = db.prepare(`
      INSERT INTO rental_applications (rental_id, renter_id, application_data, status)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(
      application.rental_id,
      application.renter_id,
      JSON.stringify(application.application_data),
      application.status || 'pending'
    );

    const newApplication = db.prepare('SELECT * FROM rental_applications WHERE id = ?').get(result.lastInsertRowid);
    return this.formatApplication(newApplication);
  }

  async getLandlordApplications(landlordId: number): Promise<any[]> {
    const applications = db.prepare(`
      SELECT 
        ra.*,
        rl.title as rental_title,
        rl.address as rental_address,
        u.firstName || ' ' || u.lastName as renter_name,
        u.email as renter_email
      FROM rental_applications ra
      INNER JOIN rental_listings rl ON ra.rental_id = rl.id
      INNER JOIN users u ON ra.renter_id = u.id
      WHERE rl.landlord_id = ?
      ORDER BY ra.created_at DESC
    `).all(landlordId);

    return applications.map(app => ({
      application: this.formatApplication(app),
      rental: { title: app.rental_title, address: app.rental_address },
      renter: { name: app.renter_name, email: app.renter_email }
    }));
  }

  async updateApplicationStatus(
    applicationId: number, 
    status: 'pending' | 'approved' | 'rejected',
    landlordId: number
  ): Promise<RentalApplication | null> {
    const stmt = db.prepare(`
      UPDATE rental_applications 
      SET status = ?, updated_at = datetime('now')
      WHERE id = ? AND rental_id IN (
        SELECT id FROM rental_listings WHERE landlord_id = ?
      )
    `);

    stmt.run(status, applicationId, landlordId);

    const updatedApplication = db.prepare('SELECT * FROM rental_applications WHERE id = ?').get(applicationId);
    return updatedApplication ? this.formatApplication(updatedApplication) : null;
  }

  private formatApplication(app: any): RentalApplication {
    return {
      ...app,
      application_data: JSON.parse(app.application_data || '{}')
    };
  }

  async getRenterApplications(renterId: number): Promise<any[]> {
    const applications = db.prepare(`
      SELECT 
        ra.*,
        rl.title as rental_title,
        rl.address as rental_address,
        rl.monthly_rent
      FROM rental_applications ra
      INNER JOIN rental_listings rl ON ra.rental_id = rl.id
      WHERE ra.renter_id = ?
      ORDER BY ra.created_at DESC
    `).all(renterId);

    return applications.map(app => ({
      application: this.formatApplication(app),
      rental: { 
        title: app.rental_title, 
        address: app.rental_address,
        monthly_rent: app.monthly_rent
      }
    }));
  }

  // Lease Management
  async createLease(lease: LeaseAgreement): Promise<LeaseAgreement> {
    const stmt = db.prepare(`
      INSERT INTO lease_agreements (
        application_id, rental_id, landlord_id, renter_id, lease_start_date,
        lease_end_date, monthly_rent, deposit_amount, lease_terms
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      lease.application_id, lease.rental_id, lease.landlord_id, lease.renter_id,
      lease.lease_start_date, lease.lease_end_date, lease.monthly_rent,
      lease.deposit_amount, JSON.stringify(lease.lease_terms || {})
    );

    const newLease = db.prepare('SELECT * FROM lease_agreements WHERE id = ?').get(result.lastInsertRowid);
    return this.formatLease(newLease);
  }

  async updateLeaseSignature(
    leaseId: number, 
    userRole: 'landlord' | 'renter',
    userId: number
  ): Promise<LeaseAgreement | null> {
    const lease = db.prepare('SELECT * FROM lease_agreements WHERE id = ?').get(leaseId);
    if (!lease) return null;

    let updateField = '';
    if (userRole === 'landlord' && lease.landlord_id === userId) {
      updateField = 'landlord_signature_status = "signed"';
    } else if (userRole === 'renter' && lease.renter_id === userId) {
      updateField = 'renter_signature_status = "signed"';
    } else {
      return null;
    }

    db.prepare(`UPDATE lease_agreements SET ${updateField}, updated_at = datetime('now') WHERE id = ?`).run(leaseId);

    // Update e_signature_status
    const updatedLease = db.prepare('SELECT * FROM lease_agreements WHERE id = ?').get(leaseId);
    let eSignatureStatus = 'pending';
    if (updatedLease.landlord_signature_status === 'signed' && updatedLease.renter_signature_status === 'signed') {
      eSignatureStatus = 'fully_signed';
    } else if (updatedLease.landlord_signature_status === 'signed' || updatedLease.renter_signature_status === 'signed') {
      eSignatureStatus = 'partially_signed';
    }

    db.prepare('UPDATE lease_agreements SET e_signature_status = ? WHERE id = ?').run(eSignatureStatus, leaseId);

    const finalLease = db.prepare('SELECT * FROM lease_agreements WHERE id = ?').get(leaseId);
    return this.formatLease(finalLease);
  }

  async getLeaseById(leaseId: number): Promise<LeaseAgreement | null> {
    const lease = db.prepare('SELECT * FROM lease_agreements WHERE id = ?').get(leaseId);
    return lease ? this.formatLease(lease) : null;
  }

  private formatLease(lease: any): LeaseAgreement {
    return {
      ...lease,
      lease_terms: JSON.parse(lease.lease_terms || '{}')
    };
  }

  // Screen tenant (simulate API call)
  async screenTenant(applicationId: number): Promise<RentalApplication | null> {
    // Simulate delay for screening process
    await new Promise(resolve => setTimeout(resolve, 2000));

    const stmt = db.prepare(`
      UPDATE rental_applications 
      SET background_check_status = 'complete', credit_report_status = 'complete', updated_at = datetime('now')
      WHERE id = ?
    `);

    stmt.run(applicationId);

    const updatedApplication = db.prepare('SELECT * FROM rental_applications WHERE id = ?').get(applicationId);
    return updatedApplication ? this.formatApplication(updatedApplication) : null;
  }
}

export const rentalStorage = new RentalStorage();
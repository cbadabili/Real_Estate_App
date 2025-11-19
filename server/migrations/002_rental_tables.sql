
-- Create rental_listings table
CREATE TABLE IF NOT EXISTS rental_listings (
    id SERIAL PRIMARY KEY,
    landlord_id INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    address TEXT,
    city TEXT,
    district TEXT,
    ward TEXT,
    property_type TEXT DEFAULT 'apartment',
    bedrooms INTEGER DEFAULT 1,
    bathrooms INTEGER DEFAULT 1,
    square_meters INTEGER,
    monthly_rent DECIMAL(10,2) NOT NULL,
    deposit_amount DECIMAL(10,2),
    lease_duration INTEGER, -- in months
    available_from TEXT,
    furnished BOOLEAN DEFAULT FALSE,
    pets_allowed BOOLEAN DEFAULT FALSE,
    parking_spaces INTEGER DEFAULT 0,
    photos TEXT, -- JSON array of image URLs
    amenities TEXT, -- JSON array of amenities
    utilities_included TEXT, -- JSON array of included utilities
    status TEXT DEFAULT 'active', -- active, rented, inactive
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create rental applications table
CREATE TABLE IF NOT EXISTS rental_applications (
    id SERIAL PRIMARY KEY,
    rental_id INTEGER NOT NULL,
    renter_id INTEGER NOT NULL,
    application_data JSONB NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create lease agreements table
CREATE TABLE IF NOT EXISTS lease_agreements (
    id SERIAL PRIMARY KEY,
    application_id INTEGER,
    rental_id INTEGER NOT NULL,
    landlord_id INTEGER NOT NULL,
    renter_id INTEGER NOT NULL,
    lease_start_date TEXT NOT NULL,
    lease_end_date TEXT NOT NULL,
    monthly_rent DECIMAL(10,2) NOT NULL,
    deposit_paid DECIMAL(10,2),
    lease_terms TEXT,
    signed_at TIMESTAMP,
    status TEXT DEFAULT 'active', -- active, expired, terminated
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create rental payments table
CREATE TABLE IF NOT EXISTS rental_payments (
    id SERIAL PRIMARY KEY,
    lease_id INTEGER NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method TEXT,
    status TEXT DEFAULT 'pending', -- pending, completed, failed
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create rental reviews table
CREATE TABLE IF NOT EXISTS rental_reviews (
    id SERIAL PRIMARY KEY,
    rental_id INTEGER NOT NULL,
    reviewer_id INTEGER NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create rental bookmarks table
CREATE TABLE IF NOT EXISTS rental_bookmarks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    rental_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, rental_id)
);

-- Add foreign key constraints after tables are created
ALTER TABLE rental_listings ADD CONSTRAINT fk_rental_listings_landlord FOREIGN KEY (landlord_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE rental_applications ADD CONSTRAINT fk_applications_rental FOREIGN KEY (rental_id) REFERENCES rental_listings(id) ON DELETE CASCADE;
ALTER TABLE rental_applications ADD CONSTRAINT fk_applications_renter FOREIGN KEY (renter_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE lease_agreements ADD CONSTRAINT fk_lease_application FOREIGN KEY (application_id) REFERENCES rental_applications(id) ON DELETE CASCADE;
ALTER TABLE lease_agreements ADD CONSTRAINT fk_lease_rental FOREIGN KEY (rental_id) REFERENCES rental_listings(id) ON DELETE CASCADE;
ALTER TABLE lease_agreements ADD CONSTRAINT fk_lease_landlord FOREIGN KEY (landlord_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE lease_agreements ADD CONSTRAINT fk_lease_renter FOREIGN KEY (renter_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE rental_payments ADD CONSTRAINT fk_payments_lease FOREIGN KEY (lease_id) REFERENCES lease_agreements(id);
ALTER TABLE rental_reviews ADD CONSTRAINT fk_reviews_rental FOREIGN KEY (rental_id) REFERENCES rental_listings(id);
ALTER TABLE rental_reviews ADD CONSTRAINT fk_reviews_reviewer FOREIGN KEY (reviewer_id) REFERENCES users(id);
ALTER TABLE rental_bookmarks ADD CONSTRAINT fk_bookmarks_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE rental_bookmarks ADD CONSTRAINT fk_bookmarks_rental FOREIGN KEY (rental_id) REFERENCES rental_listings(id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rental_listings_city ON rental_listings(city);
CREATE INDEX IF NOT EXISTS idx_rental_listings_district ON rental_listings(district);
CREATE INDEX IF NOT EXISTS idx_rental_listings_monthly_rent ON rental_listings(monthly_rent);
CREATE INDEX IF NOT EXISTS idx_rental_listings_bedrooms ON rental_listings(bedrooms);
CREATE INDEX IF NOT EXISTS idx_rental_listings_status ON rental_listings(status);
CREATE INDEX IF NOT EXISTS idx_rental_applications_status ON rental_applications(status);
CREATE INDEX IF NOT EXISTS idx_lease_agreements_status ON lease_agreements(status);

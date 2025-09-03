
-- Create rentals table
CREATE TABLE IF NOT EXISTS rentals (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    location TEXT NOT NULL,
    city TEXT NOT NULL,
    district TEXT,
    bedrooms INTEGER DEFAULT 1,
    bathrooms INTEGER DEFAULT 1,
    property_type TEXT DEFAULT 'apartment',
    furnished BOOLEAN DEFAULT FALSE,
    pet_friendly BOOLEAN DEFAULT FALSE,
    parking BOOLEAN DEFAULT FALSE,
    garden BOOLEAN DEFAULT FALSE,
    security BOOLEAN DEFAULT FALSE,
    air_conditioning BOOLEAN DEFAULT FALSE,
    internet BOOLEAN DEFAULT FALSE,
    available_date DATE,
    lease_duration INTEGER, -- in months
    deposit_amount DECIMAL(10,2),
    utilities_included BOOLEAN DEFAULT FALSE,
    contact_phone TEXT,
    contact_email TEXT,
    landlord_id INTEGER,
    agent_id INTEGER,
    property_size INTEGER, -- in square meters
    floor_level INTEGER,
    building_amenities TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    images TEXT, -- JSON array of image URLs
    status TEXT DEFAULT 'available', -- available, rented, pending
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create rental applications table
CREATE TABLE IF NOT EXISTS rental_applications (
    id SERIAL PRIMARY KEY,
    rental_id INTEGER NOT NULL,
    applicant_id INTEGER NOT NULL,
    application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    move_in_date DATE,
    employment_status TEXT,
    monthly_income DECIMAL(10,2),
    reference_contacts TEXT, -- JSON array of references
    additional_notes TEXT,
    documents TEXT, -- JSON array of document URLs
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create lease agreements table
CREATE TABLE IF NOT EXISTS lease_agreements (
    id SERIAL PRIMARY KEY,
    rental_id INTEGER NOT NULL,
    tenant_id INTEGER NOT NULL,
    landlord_id INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    monthly_rent DECIMAL(10,2) NOT NULL,
    deposit_amount DECIMAL(10,2) NOT NULL,
    terms TEXT,
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
ALTER TABLE rentals ADD CONSTRAINT fk_rentals_landlord FOREIGN KEY (landlord_id) REFERENCES users(id);
ALTER TABLE rentals ADD CONSTRAINT fk_rentals_agent FOREIGN KEY (agent_id) REFERENCES users(id);
ALTER TABLE rental_applications ADD CONSTRAINT fk_applications_rental FOREIGN KEY (rental_id) REFERENCES rentals(id);
ALTER TABLE rental_applications ADD CONSTRAINT fk_applications_applicant FOREIGN KEY (applicant_id) REFERENCES users(id);
ALTER TABLE lease_agreements ADD CONSTRAINT fk_lease_rental FOREIGN KEY (rental_id) REFERENCES rentals(id);
ALTER TABLE lease_agreements ADD CONSTRAINT fk_lease_tenant FOREIGN KEY (tenant_id) REFERENCES users(id);
ALTER TABLE lease_agreements ADD CONSTRAINT fk_lease_landlord FOREIGN KEY (landlord_id) REFERENCES users(id);
ALTER TABLE rental_payments ADD CONSTRAINT fk_payments_lease FOREIGN KEY (lease_id) REFERENCES lease_agreements(id);
ALTER TABLE rental_reviews ADD CONSTRAINT fk_reviews_rental FOREIGN KEY (rental_id) REFERENCES rentals(id);
ALTER TABLE rental_reviews ADD CONSTRAINT fk_reviews_reviewer FOREIGN KEY (reviewer_id) REFERENCES users(id);
ALTER TABLE rental_bookmarks ADD CONSTRAINT fk_bookmarks_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE rental_bookmarks ADD CONSTRAINT fk_bookmarks_rental FOREIGN KEY (rental_id) REFERENCES rentals(id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rentals_location ON rentals(location);
CREATE INDEX IF NOT EXISTS idx_rentals_city ON rentals(city);
CREATE INDEX IF NOT EXISTS idx_rentals_price ON rentals(price);
CREATE INDEX IF NOT EXISTS idx_rentals_bedrooms ON rentals(bedrooms);
CREATE INDEX IF NOT EXISTS idx_rentals_status ON rentals(status);
CREATE INDEX IF NOT EXISTS idx_rental_applications_status ON rental_applications(status);
CREATE INDEX IF NOT EXISTS idx_lease_agreements_status ON lease_agreements(status);

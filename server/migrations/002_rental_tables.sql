
-- Create rentals table
CREATE TABLE IF NOT EXISTS rentals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (landlord_id) REFERENCES users(id),
    FOREIGN KEY (agent_id) REFERENCES users(id)
);

-- Create rental applications table
CREATE TABLE IF NOT EXISTS rental_applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rental_id INTEGER NOT NULL,
    applicant_id INTEGER NOT NULL,
    application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    move_in_date DATE,
    employment_status TEXT,
    monthly_income DECIMAL(10,2),
    references TEXT, -- JSON array of references
    additional_notes TEXT,
    documents TEXT, -- JSON array of document URLs
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rental_id) REFERENCES rentals(id),
    FOREIGN KEY (applicant_id) REFERENCES users(id)
);

-- Create lease agreements table
CREATE TABLE IF NOT EXISTS lease_agreements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rental_id) REFERENCES rentals(id),
    FOREIGN KEY (tenant_id) REFERENCES users(id),
    FOREIGN KEY (landlord_id) REFERENCES users(id)
);

-- Create rental payments table
CREATE TABLE IF NOT EXISTS rental_payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lease_id INTEGER NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method TEXT,
    status TEXT DEFAULT 'pending', -- pending, completed, failed
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lease_id) REFERENCES lease_agreements(id)
);

-- Create rental reviews table
CREATE TABLE IF NOT EXISTS rental_reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rental_id INTEGER NOT NULL,
    reviewer_id INTEGER NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rental_id) REFERENCES rentals(id),
    FOREIGN KEY (reviewer_id) REFERENCES users(id)
);

-- Create rental bookmarks table
CREATE TABLE IF NOT EXISTS rental_bookmarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    rental_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (rental_id) REFERENCES rentals(id),
    UNIQUE(user_id, rental_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rentals_location ON rentals(location);
CREATE INDEX IF NOT EXISTS idx_rentals_city ON rentals(city);
CREATE INDEX IF NOT EXISTS idx_rentals_price ON rentals(price);
CREATE INDEX IF NOT EXISTS idx_rentals_bedrooms ON rentals(bedrooms);
CREATE INDEX IF NOT EXISTS idx_rentals_status ON rentals(status);
CREATE INDEX IF NOT EXISTS idx_rental_applications_status ON rental_applications(status);
CREATE INDEX IF NOT EXISTS idx_lease_agreements_status ON lease_agreements(status);

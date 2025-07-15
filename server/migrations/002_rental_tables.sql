
-- Rental Properties Table
CREATE TABLE IF NOT EXISTS rentals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    district TEXT NOT NULL,
    ward TEXT,
    property_type TEXT NOT NULL CHECK (property_type IN ('apartment', 'house', 'townhouse', 'studio', 'room')),
    bedrooms INTEGER NOT NULL DEFAULT 0,
    bathrooms INTEGER NOT NULL DEFAULT 0,
    square_meters INTEGER NOT NULL DEFAULT 0,
    monthly_rent INTEGER NOT NULL,
    deposit_amount INTEGER NOT NULL,
    lease_duration INTEGER NOT NULL DEFAULT 12,
    available_from TEXT NOT NULL,
    furnished BOOLEAN DEFAULT 0,
    pets_allowed BOOLEAN DEFAULT 0,
    parking_spaces INTEGER DEFAULT 0,
    photos TEXT DEFAULT '[]',
    amenities TEXT DEFAULT '[]',
    utilities_included TEXT DEFAULT '[]',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'rented')),
    landlord_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (landlord_id) REFERENCES users(id)
);

-- Rental Applications Table
CREATE TABLE IF NOT EXISTS rental_applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rental_id INTEGER NOT NULL,
    renter_id INTEGER NOT NULL,
    application_data TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    background_check_status TEXT DEFAULT 'pending',
    credit_report_status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rental_id) REFERENCES rentals(id) ON DELETE CASCADE,
    FOREIGN KEY (renter_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Rental Leases Table
CREATE TABLE IF NOT EXISTS rental_leases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    application_id INTEGER NOT NULL,
    rental_id INTEGER NOT NULL,
    landlord_id INTEGER NOT NULL,
    renter_id INTEGER NOT NULL,
    lease_start_date TEXT NOT NULL,
    lease_end_date TEXT NOT NULL,
    monthly_rent INTEGER NOT NULL,
    deposit_amount INTEGER NOT NULL,
    lease_terms TEXT,
    landlord_signature_status TEXT DEFAULT 'pending',
    renter_signature_status TEXT DEFAULT 'pending',
    e_signature_status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES rental_applications(id),
    FOREIGN KEY (rental_id) REFERENCES rentals(id),
    FOREIGN KEY (landlord_id) REFERENCES users(id),
    FOREIGN KEY (renter_id) REFERENCES users(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rentals_landlord ON rentals(landlord_id);
CREATE INDEX IF NOT EXISTS idx_rentals_city ON rentals(city);
CREATE INDEX IF NOT EXISTS idx_rentals_property_type ON rentals(property_type);
CREATE INDEX IF NOT EXISTS idx_rentals_status ON rentals(status);
CREATE INDEX IF NOT EXISTS idx_rental_applications_rental ON rental_applications(rental_id);
CREATE INDEX IF NOT EXISTS idx_rental_applications_renter ON rental_applications(renter_id);
CREATE INDEX IF NOT EXISTS idx_rental_leases_rental ON rental_leases(rental_id);

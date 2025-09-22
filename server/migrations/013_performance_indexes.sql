
-- First ensure core tables exist
CREATE TABLE IF NOT EXISTS inquiries (
  id SERIAL PRIMARY KEY,
  property_id INTEGER REFERENCES properties(id) NOT NULL,
  buyer_id INTEGER REFERENCES users(id) NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  property_id INTEGER REFERENCES properties(id) NOT NULL,
  buyer_id INTEGER REFERENCES users(id) NOT NULL,
  agent_id INTEGER REFERENCES users(id),
  appointment_date TIMESTAMP NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common property search queries
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(CAST(REPLACE(price, ',', '') AS DECIMAL));
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_bedrooms ON properties(bedrooms);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at);
CREATE INDEX IF NOT EXISTS idx_properties_views ON properties(views);

-- Composite indexes for common filter combinations
CREATE INDEX IF NOT EXISTS idx_properties_status_city ON properties(status, city);
CREATE INDEX IF NOT EXISTS idx_properties_status_type ON properties(status, property_type);
CREATE INDEX IF NOT EXISTS idx_properties_status_price ON properties(status, CAST(REPLACE(price, ',', '') AS DECIMAL));

-- Indexes for user-related queries
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login_at);

-- Indexes for inquiries and appointments (now that tables exist)
CREATE INDEX IF NOT EXISTS idx_inquiries_property_id ON inquiries(property_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_appointments_property_id ON appointments(property_id);
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON appointments(created_at);

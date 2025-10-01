
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

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'inquiries'
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_inquiries_property_id ON inquiries(property_id)';
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at)';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'appointments'
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_appointments_property_id ON appointments(property_id)';
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON appointments(created_at)';
  END IF;
END $$;


-- Standardize timestamp handling across all tables
-- Convert integer timestamps to proper timestamp columns where needed

-- Update users table to use consistent timestamp format
ALTER TABLE users 
  ADD COLUMN created_at_new TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN updated_at_new TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN last_login_at_new TIMESTAMP;

-- Copy data from integer timestamps to new timestamp columns
UPDATE users SET 
  created_at_new = datetime(created_at, 'unixepoch') WHERE created_at IS NOT NULL,
  updated_at_new = datetime(updated_at, 'unixepoch') WHERE updated_at IS NOT NULL,
  last_login_at_new = datetime(last_login_at, 'unixepoch') WHERE last_login_at IS NOT NULL;

-- For PostgreSQL compatibility, we'll keep the current schema as is
-- but add proper indexes on timestamp columns for performance
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_updated_at ON users(updated_at);
CREATE INDEX IF NOT EXISTS idx_users_last_login_at ON users(last_login_at);

-- Add indexes for other timestamp columns
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at);
CREATE INDEX IF NOT EXISTS idx_properties_updated_at ON properties(updated_at);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON appointments(created_at);
CREATE INDEX IF NOT EXISTS idx_saved_properties_created_at ON saved_properties(created_at);

-- Add triggers to automatically update updated_at timestamps
-- Note: This is PostgreSQL syntax - for SQLite, we'd use different syntax
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

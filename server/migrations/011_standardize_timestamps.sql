
-- Standardize timestamp handling across all tables
-- Convert integer timestamps to proper timestamp columns where needed

-- Update users table to use consistent timestamp format (only if columns don't exist)
DO $$ 
BEGIN
    -- Add new timestamp columns only if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='created_at_new') THEN
        ALTER TABLE users ADD COLUMN created_at_new TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='updated_at_new') THEN
        ALTER TABLE users ADD COLUMN updated_at_new TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='last_login_at_new') THEN
        ALTER TABLE users ADD COLUMN last_login_at_new TIMESTAMP;
    END IF;
END $$;

-- Copy data from integer timestamps to new timestamp columns (only if data exists)
DO $$
BEGIN
    -- Only update if the new columns exist and old columns have data
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='created_at_new') THEN
        -- For PostgreSQL, we need to handle the timestamp conversion differently
        UPDATE users SET 
            created_at_new = to_timestamp(created_at) 
        WHERE created_at IS NOT NULL AND created_at > 0 AND created_at_new IS NULL;
        
        UPDATE users SET 
            updated_at_new = to_timestamp(updated_at) 
        WHERE updated_at IS NOT NULL AND updated_at > 0 AND updated_at_new IS NULL;
        
        UPDATE users SET 
            last_login_at_new = to_timestamp(last_login_at) 
        WHERE last_login_at IS NOT NULL AND last_login_at > 0 AND last_login_at_new IS NULL;
    END IF;
END $$;

-- Add indexes for timestamp columns for performance (create only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_updated_at ON users(updated_at);
CREATE INDEX IF NOT EXISTS idx_users_last_login_at ON users(last_login_at);

-- Add indexes for other timestamp columns
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at);
CREATE INDEX IF NOT EXISTS idx_properties_updated_at ON properties(updated_at);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON appointments(created_at);
CREATE INDEX IF NOT EXISTS idx_saved_properties_created_at ON saved_properties(created_at);

-- Create or replace the update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = extract(epoch from CURRENT_TIMESTAMP);
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers to relevant tables (drop and recreate to avoid conflicts)
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_properties_updated_at ON properties;
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

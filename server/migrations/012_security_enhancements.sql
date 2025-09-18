
-- Add refresh tokens table
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id VARCHAR(36) PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- Add for_map column to properties table for geocode enforcement
ALTER TABLE properties ADD COLUMN IF NOT EXISTS for_map BOOLEAN DEFAULT true;

-- Add check constraint for geocode completeness
ALTER TABLE properties ADD CONSTRAINT check_geocode_completeness 
  CHECK (for_map = false OR (latitude IS NOT NULL AND longitude IS NOT NULL));

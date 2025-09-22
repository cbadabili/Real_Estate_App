
BEGIN;

-- Enable PostGIS extension for geometry support
CREATE EXTENSION IF NOT EXISTS postgis;

-- Fix service_categories table schema
-- First, check if we need to modify the table structure
DO $$
BEGIN
  -- Add updated_at column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'service_categories' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE service_categories 
      ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP;
  END IF;

  -- Convert created_at from bigint to timestamp if needed
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'service_categories' 
    AND column_name = 'created_at' 
    AND data_type = 'bigint'
  ) THEN
    -- Create temp column with proper timestamp
    ALTER TABLE service_categories 
      ADD COLUMN temp_created_at TIMESTAMP WITH TIME ZONE;
    
    -- Convert existing epoch values to timestamps
    UPDATE service_categories 
    SET temp_created_at = CASE 
      WHEN created_at > 1000000000000 THEN to_timestamp(created_at / 1000.0)  -- milliseconds
      ELSE to_timestamp(created_at)  -- seconds
    END;
    
    -- Drop old column and rename
    ALTER TABLE service_categories DROP COLUMN created_at;
    ALTER TABLE service_categories RENAME COLUMN temp_created_at TO created_at;
    ALTER TABLE service_categories ALTER COLUMN created_at SET NOT NULL;
    ALTER TABLE service_categories ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
  END IF;
END $$;

-- Add missing updated_at column to service_categories
ALTER TABLE service_categories
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

-- Create trigger for service_categories updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_service_categories_updated_at'
  ) THEN
    CREATE TRIGGER set_service_categories_updated_at
    BEFORE UPDATE ON service_categories
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END $$;

-- Add missing geom column to properties (PostGIS Point geometry)
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS geom geometry(Point, 4326);

-- Backfill geom from existing latitude/longitude data
UPDATE properties
SET geom = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
WHERE geom IS NULL AND longitude IS NOT NULL AND latitude IS NOT NULL;

-- Create spatial index for geom column
CREATE INDEX IF NOT EXISTS idx_properties_geom_gist ON properties USING GIST (geom);

-- Ensure full-text search index exists
CREATE INDEX IF NOT EXISTS idx_properties_fts_gin ON properties USING GIN (fts);

-- Create composite indexes for performance
CREATE INDEX IF NOT EXISTS idx_properties_location_price ON properties (city, state, price);
CREATE INDEX IF NOT EXISTS idx_properties_coords ON properties (latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Fix bathrooms column type from text to integer
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'properties' 
    AND column_name = 'bathrooms' 
    AND data_type = 'text'
  ) THEN
    -- Add temporary integer column
    ALTER TABLE properties ADD COLUMN temp_bathrooms INTEGER;
    
    -- Convert text values to integers, handling decimal values
    UPDATE properties 
    SET temp_bathrooms = CASE 
      WHEN bathrooms ~ '^[0-9]+\.5$' THEN CAST(REPLACE(bathrooms, '.5', '') AS INTEGER) + 1  -- Round up half-baths
      WHEN bathrooms ~ '^[0-9]+$' THEN CAST(bathrooms AS INTEGER)
      WHEN bathrooms ~ '^[0-9]+\.[0-9]+$' THEN CAST(ROUND(CAST(bathrooms AS NUMERIC)) AS INTEGER)
      ELSE 1  -- Default fallback
    END
    WHERE bathrooms IS NOT NULL AND bathrooms != '';
    
    -- Handle null/empty cases
    UPDATE properties 
    SET temp_bathrooms = 1 
    WHERE bathrooms IS NULL OR bathrooms = '';
    
    -- Drop old column and rename
    ALTER TABLE properties DROP COLUMN bathrooms;
    ALTER TABLE properties RENAME COLUMN temp_bathrooms TO bathrooms;
  END IF;
END $$;

COMMIT;

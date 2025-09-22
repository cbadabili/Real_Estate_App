
BEGIN;

-- Enable PostGIS extension for geometry support
CREATE EXTENSION IF NOT EXISTS postgis;

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

COMMIT;

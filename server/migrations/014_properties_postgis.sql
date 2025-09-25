BEGIN;

-- Enable PostGIS extension if not already installed
CREATE EXTENSION IF NOT EXISTS postgis;

-- Normalize price column to numeric(12,2)
ALTER TABLE properties
  ALTER COLUMN price TYPE numeric(12, 2)
    USING CASE
      WHEN price IS NULL OR NULLIF(trim(price::text), '') IS NULL THEN 0
      WHEN price::text ~ '^[0-9]+(\.[0-9]+)?$' THEN (price::text)::numeric(12, 2)
      ELSE COALESCE(NULLIF(regexp_replace(price::text, '[^0-9\.]', '', 'g'), ''), '0')::numeric(12, 2)
    END;

-- Ensure images column is jsonb with sensible defaults
ALTER TABLE properties
  ALTER COLUMN images TYPE jsonb
    USING CASE
      WHEN images IS NULL THEN '[]'::jsonb
      WHEN pg_typeof(images)::text = 'jsonb' THEN images
      WHEN NULLIF(trim(images::text), '') IS NULL THEN '[]'::jsonb
      WHEN images::text LIKE '[%' THEN images::jsonb
      WHEN images::text LIKE '{%' THEN jsonb_build_array(images::jsonb)
      ELSE jsonb_build_array(to_jsonb(images::text))
    END,
  ALTER COLUMN images SET DEFAULT '[]'::jsonb;

-- Ensure features column mirrors images handling
ALTER TABLE properties
  ALTER COLUMN features TYPE jsonb
    USING CASE
      WHEN features IS NULL THEN '[]'::jsonb
      WHEN pg_typeof(features)::text = 'jsonb' THEN features
      WHEN NULLIF(trim(features::text), '') IS NULL THEN '[]'::jsonb
      WHEN features::text LIKE '[%' THEN features::jsonb
      WHEN features::text LIKE '{%' THEN jsonb_build_array(features::jsonb)
      ELSE jsonb_build_array(to_jsonb(features::text))
    END,
  ALTER COLUMN features SET DEFAULT '[]'::jsonb;

-- Bathrooms stored as integer, rounding decimal inputs
ALTER TABLE properties
  ALTER COLUMN bathrooms TYPE integer
    USING CASE
      WHEN bathrooms IS NULL OR NULLIF(trim(bathrooms::text), '') IS NULL THEN NULL
      ELSE round(NULLIF(regexp_replace(bathrooms::text, '[^0-9\.+-]', '', 'g'), '')::numeric)::int
    END;

-- created_at normalization to timestamptz
ALTER TABLE properties
  ALTER COLUMN created_at TYPE timestamptz
    USING CASE
      WHEN pg_typeof(created_at)::text IN ('timestamp with time zone', 'timestamp without time zone') THEN created_at::timestamptz
      ELSE to_timestamp((created_at)::bigint / 1000)
    END;
UPDATE properties SET created_at = now() WHERE created_at IS NULL;
ALTER TABLE properties
  ALTER COLUMN created_at SET DEFAULT now(),
  ALTER COLUMN created_at SET NOT NULL;

-- updated_at normalization to timestamptz
ALTER TABLE properties
  ALTER COLUMN updated_at TYPE timestamptz
    USING CASE
      WHEN pg_typeof(updated_at)::text IN ('timestamp with time zone', 'timestamp without time zone') THEN updated_at::timestamptz
      ELSE to_timestamp((updated_at)::bigint / 1000)
    END;
UPDATE properties SET updated_at = now() WHERE updated_at IS NULL;
ALTER TABLE properties
  ALTER COLUMN updated_at SET DEFAULT now(),
  ALTER COLUMN updated_at SET NOT NULL;

-- Add geometry column and backfill from latitude/longitude when valid
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS geom geometry(Point, 4326);

UPDATE properties
SET geom = CASE
  WHEN latitude IS NULL OR longitude IS NULL THEN NULL
  WHEN (CASE WHEN pg_typeof(latitude)::text ~ '^(double precision|real|numeric)$' THEN latitude::double precision ELSE NULLIF(regexp_replace(latitude::text, '[^0-9\.-]+', '', 'g'), '')::double precision END) BETWEEN -90 AND 90
   AND (CASE WHEN pg_typeof(longitude)::text ~ '^(double precision|real|numeric)$' THEN longitude::double precision ELSE NULLIF(regexp_replace(longitude::text, '[^0-9\.-]+', '', 'g'), '')::double precision END) BETWEEN -180 AND 180
  THEN ST_SetSRID(ST_MakePoint(
    (CASE WHEN pg_typeof(longitude)::text ~ '^(double precision|real|numeric)$' THEN longitude::double precision ELSE NULLIF(regexp_replace(longitude::text, '[^0-9\.-]+', '', 'g'), '')::double precision END),
    (CASE WHEN pg_typeof(latitude)::text ~ '^(double precision|real|numeric)$' THEN latitude::double precision ELSE NULLIF(regexp_replace(latitude::text, '[^0-9\.-]+', '', 'g'), '')::double precision END)
  ), 4326)
  ELSE NULL
END;

-- Trigger to update updated_at automatically
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS properties_set_updated ON properties;
CREATE TRIGGER properties_set_updated
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Keep geom column synchronized with latitude/longitude changes
CREATE OR REPLACE FUNCTION properties_sync_geom() RETURNS trigger AS $$
DECLARE
  lat double precision;
  lng double precision;
BEGIN
  lat := CASE
    WHEN NEW.latitude IS NULL THEN NULL
    WHEN pg_typeof(NEW.latitude)::text ~ '^(double precision|real|numeric)$' THEN NEW.latitude::double precision
    ELSE NULLIF(regexp_replace(NEW.latitude::text, '[^0-9\.-]+', '', 'g'), '')::double precision
  END;
  lng := CASE
    WHEN NEW.longitude IS NULL THEN NULL
    WHEN pg_typeof(NEW.longitude)::text ~ '^(double precision|real|numeric)$' THEN NEW.longitude::double precision
    ELSE NULLIF(regexp_replace(NEW.longitude::text, '[^0-9\.-]+', '', 'g'), '')::double precision
  END;

  IF lat IS NOT NULL AND lng IS NOT NULL AND lat BETWEEN -90 AND 90 AND lng BETWEEN -180 AND 180 THEN
    NEW.geom := ST_SetSRID(ST_MakePoint(lng, lat), 4326);
  ELSE
    NEW.geom := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS properties_sync_geom_trg ON properties;
CREATE TRIGGER properties_sync_geom_trg
  BEFORE INSERT OR UPDATE OF latitude, longitude ON properties
  FOR EACH ROW EXECUTE FUNCTION properties_sync_geom();

-- Helpful indexes for search/spatial queries
CREATE INDEX IF NOT EXISTS properties_fts_gin_idx ON properties USING GIN (fts);
CREATE INDEX IF NOT EXISTS properties_geom_gix ON properties USING GIST (geom);

-- Ensure service_providers has review_count column to match application usage
ALTER TABLE service_providers
  ADD COLUMN IF NOT EXISTS review_count integer NOT NULL DEFAULT 0;

COMMIT;

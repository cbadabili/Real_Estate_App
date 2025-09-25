BEGIN;

-- Extensions used by PostGIS / FTS / trigram
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Normalize price column to numeric(12,2)
ALTER TABLE properties
  ALTER COLUMN price TYPE numeric(12, 2)
    USING CASE
      WHEN price IS NULL OR NULLIF(trim(price::text), '') IS NULL THEN 0
      WHEN price::text ~ '^[0-9]+(\.[0-9]+)?$' THEN (price::text)::numeric(12, 2)
      ELSE COALESCE(NULLIF(regexp_replace(price::text, '[^0-9\.]', '', 'g'), ''), '0')::numeric(12, 2)
    END;

ALTER TABLE properties
  ALTER COLUMN price SET DEFAULT 0,
  ALTER COLUMN price SET NOT NULL;

ALTER TABLE properties
  ADD CONSTRAINT properties_price_non_negative CHECK (price >= 0);

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
  ALTER COLUMN images SET DEFAULT '[]'::jsonb,
  ALTER COLUMN images SET NOT NULL;

-- Ensure features column is jsonb with sensible defaults
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
  ALTER COLUMN features SET DEFAULT '[]'::jsonb,
  ALTER COLUMN features SET NOT NULL;

-- Preserve fractional bathrooms (e.g., 1.5) with one-decimal precision
ALTER TABLE properties
  ALTER COLUMN bathrooms TYPE numeric(3, 1)
    USING CASE
      WHEN bathrooms IS NULL OR NULLIF(trim(bathrooms::text), '') IS NULL THEN NULL
      ELSE round(NULLIF(regexp_replace(bathrooms::text, '[^0-9\.\+-]', '', 'g'), '')::numeric, 1)
    END;

-- Latitude/longitude as doubles (resilient to existing numeric types)
ALTER TABLE properties
  ALTER COLUMN latitude TYPE double precision
    USING CASE
      WHEN latitude IS NULL THEN NULL
      WHEN pg_typeof(latitude)::text IN ('double precision', 'numeric', 'real', 'integer', 'bigint') THEN latitude::double precision
      WHEN NULLIF(trim(latitude::text), '') IS NULL THEN NULL
      ELSE NULLIF(regexp_replace(latitude::text, '[^0-9\.\-+]', '', 'g'), '')::double precision
    END;

ALTER TABLE properties
  ALTER COLUMN longitude TYPE double precision
    USING CASE
      WHEN longitude IS NULL THEN NULL
      WHEN pg_typeof(longitude)::text IN ('double precision', 'numeric', 'real', 'integer', 'bigint') THEN longitude::double precision
      WHEN NULLIF(trim(longitude::text), '') IS NULL THEN NULL
      ELSE NULLIF(regexp_replace(longitude::text, '[^0-9\.\-+]', '', 'g'), '')::double precision
    END;

-- Add currency (app & schema depend on it)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'currency'
  ) THEN
    ALTER TABLE properties ADD COLUMN currency text;
  END IF;
END$$;

ALTER TABLE properties
  ALTER COLUMN currency SET DEFAULT 'BWP';

UPDATE properties SET currency = 'BWP' WHERE currency IS NULL;

ALTER TABLE properties
  ALTER COLUMN currency SET NOT NULL;

-- Timestamps as timestamptz with safe backfill
ALTER TABLE properties
  ALTER COLUMN created_at TYPE timestamptz
    USING CASE
      WHEN pg_typeof(created_at)::text LIKE 'timestamp%' THEN created_at::timestamptz
      ELSE to_timestamp((created_at)::bigint / 1000)
    END;

UPDATE properties SET created_at = now() WHERE created_at IS NULL;

ALTER TABLE properties
  ALTER COLUMN created_at SET DEFAULT now(),
  ALTER COLUMN created_at SET NOT NULL;

ALTER TABLE properties
  ALTER COLUMN updated_at TYPE timestamptz
    USING CASE
      WHEN pg_typeof(updated_at)::text LIKE 'timestamp%' THEN updated_at::timestamptz
      ELSE to_timestamp((updated_at)::bigint / 1000)
    END;

UPDATE properties SET updated_at = now() WHERE updated_at IS NULL;

ALTER TABLE properties
  ALTER COLUMN updated_at SET DEFAULT now(),
  ALTER COLUMN updated_at SET NOT NULL;

-- Add generated FTS column (must exist before GIN index)
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS fts tsvector
    GENERATED ALWAYS AS (
      to_tsvector(
        'simple',
        coalesce(title, '') || ' ' ||
        coalesce(description, '') || ' ' ||
        coalesce(address, '')
      )
    ) STORED;

-- Backfill geom from lat/lng (only for valid ranges)
UPDATE properties
SET geom = CASE
  WHEN latitude IS NOT NULL AND longitude IS NOT NULL
       AND latitude BETWEEN -90 AND 90
       AND longitude BETWEEN -180 AND 180
  THEN ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
  ELSE NULL
END;

-- Keep geom in sync on writes
CREATE OR REPLACE FUNCTION properties_sync_geom() RETURNS trigger AS $$
BEGIN
  IF NEW.longitude IS NOT NULL AND NEW.latitude IS NOT NULL
     AND NEW.latitude BETWEEN -90 AND 90
     AND NEW.longitude BETWEEN -180 AND 180 THEN
    NEW.geom := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
  ELSE
    NEW.geom := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS properties_sync_geom_trg ON properties;
CREATE TRIGGER properties_sync_geom_trg
  BEFORE INSERT OR UPDATE OF latitude, longitude ON properties
  FOR EACH ROW
  EXECUTE FUNCTION properties_sync_geom();

-- Keep updated_at fresh
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS properties_set_updated ON properties;
CREATE TRIGGER properties_set_updated
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Helpful indexes for search/spatial queries
CREATE INDEX IF NOT EXISTS properties_fts_gin_idx ON properties USING GIN (fts);
CREATE INDEX IF NOT EXISTS properties_city_trgm_idx ON properties USING GIN (city gin_trgm_ops);
CREATE INDEX IF NOT EXISTS properties_address_trgm_idx ON properties USING GIN (address gin_trgm_ops);
CREATE INDEX IF NOT EXISTS properties_title_trgm_idx ON properties USING GIN (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS properties_description_trgm_idx ON properties USING GIN (description gin_trgm_ops);
CREATE INDEX IF NOT EXISTS properties_geom_gix ON properties USING GIST (geom);

COMMIT;

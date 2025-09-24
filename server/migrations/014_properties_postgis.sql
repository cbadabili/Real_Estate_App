BEGIN;

CREATE EXTENSION IF NOT EXISTS postgis;

ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'BWP';

ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS geom geometry(Point, 4326);

-- Promote price to numeric for proper comparisons
ALTER TABLE properties
  ALTER COLUMN price TYPE numeric(12, 2)
    USING CASE
      WHEN price IS NULL OR trim(price) = '' THEN 0
      WHEN price ~ '^[0-9]+(\.[0-9]+)?$' THEN price::numeric(12, 2)
      ELSE COALESCE(NULLIF(regexp_replace(price, '[^0-9\.]', '', 'g'), ''), '0')::numeric(12, 2)
    END;

ALTER TABLE properties
  ALTER COLUMN price SET DEFAULT 0,
  ALTER COLUMN price SET NOT NULL;

ALTER TABLE properties
  ADD CONSTRAINT properties_price_non_negative CHECK (price >= 0);

-- Promote image/feature blobs to jsonb arrays
ALTER TABLE properties
  ALTER COLUMN images TYPE jsonb
    USING CASE
      WHEN images IS NULL OR trim(images) = '' THEN '[]'::jsonb
      WHEN images LIKE '[%' THEN images::jsonb
      WHEN images LIKE '{%' THEN images::jsonb
      ELSE jsonb_build_array(images)
    END;

ALTER TABLE properties
  ALTER COLUMN features TYPE jsonb
    USING CASE
      WHEN features IS NULL OR trim(features) = '' THEN '[]'::jsonb
      WHEN features LIKE '[%' THEN features::jsonb
      WHEN features LIKE '{%' THEN features::jsonb
      ELSE jsonb_build_array(features)
    END;

ALTER TABLE properties
  ALTER COLUMN images SET DEFAULT '[]'::jsonb,
  ALTER COLUMN images SET NOT NULL,
  ALTER COLUMN features SET DEFAULT '[]'::jsonb,
  ALTER COLUMN features SET NOT NULL;

-- Latitude/longitude as doubles
ALTER TABLE properties
  ALTER COLUMN latitude TYPE double precision
    USING CASE
      WHEN latitude IS NULL OR trim(latitude) = '' THEN NULL
      ELSE NULLIF(regexp_replace(latitude, '[^0-9\.-]', '', 'g'), '')::double precision
    END;

ALTER TABLE properties
  ALTER COLUMN longitude TYPE double precision
    USING CASE
      WHEN longitude IS NULL OR trim(longitude) = '' THEN NULL
      ELSE NULLIF(regexp_replace(longitude, '[^0-9\.-]', '', 'g'), '')::double precision
    END;

-- Timestamptz audit columns
ALTER TABLE properties
  ALTER COLUMN created_at TYPE timestamptz
    USING CASE
      WHEN pg_typeof(created_at)::text IN ('timestamp with time zone', 'timestamp without time zone') THEN created_at::timestamptz
      ELSE to_timestamp((created_at)::bigint / 1000)
    END;

ALTER TABLE properties
  ALTER COLUMN created_at SET DEFAULT now(),
  ALTER COLUMN created_at SET NOT NULL;

ALTER TABLE properties
  ALTER COLUMN updated_at TYPE timestamptz
    USING CASE
      WHEN pg_typeof(updated_at)::text IN ('timestamp with time zone', 'timestamp without time zone') THEN updated_at::timestamptz
      ELSE to_timestamp((updated_at)::bigint / 1000)
    END;

ALTER TABLE properties
  ALTER COLUMN updated_at SET DEFAULT now(),
  ALTER COLUMN updated_at SET NOT NULL;

-- Updated_at trigger
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

-- Spatial backfill
UPDATE properties
SET geom = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
WHERE geom IS NULL
  AND longitude IS NOT NULL
  AND latitude IS NOT NULL;

-- Generated search vector
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS fts tsvector
    GENERATED ALWAYS AS (
      to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(address, ''))
    ) STORED;

-- Supporting indexes
CREATE INDEX IF NOT EXISTS properties_geom_gix ON properties USING GIST (geom);
CREATE INDEX IF NOT EXISTS properties_price_idx ON properties (price);
CREATE INDEX IF NOT EXISTS properties_status_listing_type_idx ON properties (status, listing_type);
CREATE INDEX IF NOT EXISTS properties_created_at_idx ON properties (created_at);
CREATE INDEX IF NOT EXISTS properties_fts_idx ON properties USING GIN (fts);

COMMIT;

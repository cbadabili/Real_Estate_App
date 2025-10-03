BEGIN;

ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS area_text text,
  ADD COLUMN IF NOT EXISTS place_name text,
  ADD COLUMN IF NOT EXISTS place_id text,
  ADD COLUMN IF NOT EXISTS location_source text DEFAULT 'geocode',
  ADD COLUMN IF NOT EXISTS for_map boolean DEFAULT true;

UPDATE properties
SET location_source = 'geocode'
WHERE location_source IS NULL;

UPDATE properties
SET for_map = COALESCE(for_map, true);

ALTER TABLE properties
  ALTER COLUMN location_source SET DEFAULT 'geocode',
  ALTER COLUMN for_map SET DEFAULT true;

COMMIT;

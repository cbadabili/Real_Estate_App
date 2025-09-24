ALTER TABLE service_providers
  ADD COLUMN IF NOT EXISTS review_count integer NOT NULL DEFAULT 0;

BEGIN;

ALTER TABLE service_providers
  ADD COLUMN IF NOT EXISTS review_count integer NOT NULL DEFAULT 0;

UPDATE service_providers sp
SET review_count = COALESCE(sub.cnt, 0)
FROM (
  SELECT provider_id, COUNT(*) AS cnt
  FROM service_reviews
  GROUP BY provider_id
) sub
WHERE sp.id = sub.provider_id;

COMMIT;

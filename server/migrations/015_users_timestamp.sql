-- Normalize user timestamp fields to timestamptz

-- ===== last_login_at normalization (cast-safe) =====
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at_tmp timestamptz;

UPDATE users
SET last_login_at_tmp = CASE
  WHEN last_login_at IS NULL OR NULLIF(trim(last_login_at::text), '') IS NULL THEN NULL
  WHEN last_login_at::text ~ '^[0-9]{13}$'
    THEN to_timestamp((last_login_at::text)::numeric / 1000.0)
  WHEN last_login_at::text ~ '^[0-9]{10}$'
    THEN to_timestamp((last_login_at::text)::numeric)
  WHEN last_login_at::text ~ '^[+-]?[0-9]+(\.[0-9]+)?$'
    THEN to_timestamp((last_login_at::text)::numeric)
  WHEN last_login_at::text ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}'
    THEN (last_login_at::text)::timestamptz
  ELSE NULL
END;

ALTER TABLE users
  ALTER COLUMN last_login_at DROP DEFAULT;

ALTER TABLE users
  ALTER COLUMN last_login_at TYPE timestamptz USING last_login_at_tmp;

ALTER TABLE users DROP COLUMN last_login_at_tmp;

-- ===== created_at normalization (cast-safe) =====
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at_tmp timestamptz;

UPDATE users
SET created_at_tmp = CASE
  WHEN created_at IS NULL OR NULLIF(trim(created_at::text), '') IS NULL THEN NULL
  WHEN created_at::text ~ '^[0-9]{13}$'
    THEN to_timestamp((created_at::text)::numeric / 1000.0)
  WHEN created_at::text ~ '^[0-9]{10}$'
    THEN to_timestamp((created_at::text)::numeric)
  WHEN created_at::text ~ '^[+-]?[0-9]+(\.[0-9]+)?$'
    THEN to_timestamp((created_at::text)::numeric)
  WHEN created_at::text ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}'
    THEN (created_at::text)::timestamptz
  ELSE NULL
END;

UPDATE users
SET created_at_tmp = now()
WHERE created_at_tmp IS NULL;

ALTER TABLE users
  ALTER COLUMN created_at DROP DEFAULT;

ALTER TABLE users
  ALTER COLUMN created_at TYPE timestamptz USING created_at_tmp;

ALTER TABLE users
  ALTER COLUMN created_at SET NOT NULL;

ALTER TABLE users
  ALTER COLUMN created_at SET DEFAULT now();

ALTER TABLE users DROP COLUMN created_at_tmp;

-- ===== updated_at normalization (cast-safe) =====
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at_tmp timestamptz;

UPDATE users
SET updated_at_tmp = CASE
  WHEN updated_at IS NULL OR NULLIF(trim(updated_at::text), '') IS NULL THEN NULL
  WHEN updated_at::text ~ '^[0-9]{13}$'
    THEN to_timestamp((updated_at::text)::numeric / 1000.0)
  WHEN updated_at::text ~ '^[0-9]{10}$'
    THEN to_timestamp((updated_at::text)::numeric)
  WHEN updated_at::text ~ '^[+-]?[0-9]+(\.[0-9]+)?$'
    THEN to_timestamp((updated_at::text)::numeric)
  WHEN updated_at::text ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}'
    THEN (updated_at::text)::timestamptz
  ELSE NULL
END;

UPDATE users
SET updated_at_tmp = now()
WHERE updated_at_tmp IS NULL;

ALTER TABLE users
  ALTER COLUMN updated_at DROP DEFAULT;

ALTER TABLE users
  ALTER COLUMN updated_at TYPE timestamptz USING updated_at_tmp;

ALTER TABLE users
  ALTER COLUMN updated_at SET NOT NULL;

ALTER TABLE users
  ALTER COLUMN updated_at SET DEFAULT now();

ALTER TABLE users DROP COLUMN updated_at_tmp;

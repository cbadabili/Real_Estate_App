-- 013_performance_indexes.sql
-- Property index maintenance lives here; table-specific indexes stay with their tables.

CREATE INDEX IF NOT EXISTS idx_properties_created_at
  ON public.properties(created_at);

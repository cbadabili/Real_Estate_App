-- 013_performance_indexes.sql

CREATE INDEX IF NOT EXISTS idx_inquiries_property_id
  ON public.inquiries(property_id);

CREATE INDEX IF NOT EXISTS idx_inquiries_created_at
  ON public.inquiries(created_at);

CREATE INDEX IF NOT EXISTS idx_appointments_property_id
  ON public.appointments(property_id);

CREATE INDEX IF NOT EXISTS idx_appointments_created_at
  ON public.appointments(created_at);

CREATE INDEX IF NOT EXISTS idx_properties_created_at
  ON public.properties(created_at);

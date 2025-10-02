-- 013_performance_indexes.sql
-- Guarded index creation so fresh databases without optional tables do not fail

DO $$
BEGIN
  IF to_regclass('public.inquiries') IS NOT NULL THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_inquiries_property_id ON public.inquiries(property_id)';
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries(created_at)';
  END IF;

  IF to_regclass('public.appointments') IS NOT NULL THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_appointments_property_id ON public.appointments(property_id)';
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON public.appointments(created_at)';
  END IF;

  IF to_regclass('public.properties') IS NOT NULL THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_properties_created_at ON public.properties(created_at)';
  END IF;
END
$$;

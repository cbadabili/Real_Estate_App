-- 013_performance_indexes.sql

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'inquiries'
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_inquiries_property_id ON public.inquiries(property_id)';
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries(created_at)';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'appointments'
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_appointments_property_id ON public.appointments(property_id)';
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON public.appointments(created_at)';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'properties'
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_properties_created_at ON public.properties(created_at)';
  END IF;
END
$$;

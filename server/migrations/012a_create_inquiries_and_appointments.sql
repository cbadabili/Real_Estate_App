-- 012a_create_inquiries_and_appointments.sql
-- Ensure the inquiries and appointments tables exist before performance indexes run

CREATE TABLE IF NOT EXISTS public.inquiries (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  buyer_id INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread',
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_inquiries_property_id
  ON public.inquiries(property_id);

CREATE INDEX IF NOT EXISTS idx_inquiries_created_at
  ON public.inquiries(created_at);

CREATE TABLE IF NOT EXISTS public.appointments (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  buyer_id INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  agent_id INTEGER REFERENCES public.users(id),
  appointment_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_appointments_property_id
  ON public.appointments(property_id);

CREATE INDEX IF NOT EXISTS idx_appointments_created_at
  ON public.appointments(created_at);

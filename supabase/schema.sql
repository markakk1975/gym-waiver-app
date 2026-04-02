-- ============================================================
-- Gym Waiver App - Database Schema
-- Run this SQL in your Supabase SQL Editor
-- Uses same Supabase project as guest-sati-app
-- ============================================================

-- TABLE: gym_waivers
CREATE TABLE public.gym_waivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name TEXT NOT NULL,
  room_number TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  arrival_date DATE NOT NULL,
  departure_date DATE NOT NULL,
  signature_data TEXT NOT NULL,
  language TEXT DEFAULT 'es',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_gym_waivers_created_at ON public.gym_waivers (created_at DESC);
CREATE INDEX idx_gym_waivers_room ON public.gym_waivers (room_number);

-- ROW LEVEL SECURITY
ALTER TABLE public.gym_waivers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert gym waivers"
  ON public.gym_waivers FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read gym waivers"
  ON public.gym_waivers FOR SELECT
  TO authenticated
  USING (true);

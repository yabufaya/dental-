-- Migration 002 — adds the staff-editable map embed URL.
-- Run this if you ALREADY ran schema.sql before (fresh runs already include it).

alter table public.clinic_settings
  add column if not exists map_embed_url text;

-- Default: coordinate-based embed (same behaviour as before).
-- Replace with the clinic's exact place pin later:
--   Google Maps → find the clinic → Share → "Embed a map" → copy ONLY the src="…" URL
update public.clinic_settings
set map_embed_url = 'https://maps.google.com/maps?q=8.9984,38.7882&hl=en&z=15&output=embed'
where id = 1 and map_embed_url is null;

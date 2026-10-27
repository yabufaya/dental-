-- ============================================================
-- Migration 005 — Slot engine foundation
-- 1) ONE booking per 30-min slot clinic-wide (unique index)
-- 2) Public-safe booked_slots view (date+slot only, zero patient data)
-- Run ONCE on your existing database. Safe to re-run.
-- ============================================================

-- 1) Hard guarantee against double-booking. Only *active* statuses
--    hold a slot; cancelled/done free it again automatically.
create unique index if not exists bookings_active_slot_unique
  on public.bookings (preferred_date, time_slot)
  where status in ('pending', 'confirmed');

-- 2) Public slot-availability view. Views execute as their OWNER and
--    therefore bypass RLS — which is exactly what we want here: the
--    world may see THAT a slot is taken, without ever seeing WHO took it.
--    (bookings itself stays admin-read-only.)
create or replace view public.booked_slots as
  select preferred_date, time_slot
  from public.bookings
  where status in ('pending', 'confirmed');

grant select on public.booked_slots to anon, authenticated;

-- Verify: one row per ACTIVE booking
select * from public.booked_slots order by preferred_date, time_slot;

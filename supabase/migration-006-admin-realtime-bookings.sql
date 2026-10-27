-- ============================================================
-- Migration 006 — Admin-only realtime for bookings
-- A new booking pushes INSTANTLY into the logged-in admin's screen.
--
-- Security design (Realtime Authorization):
-- • bookings joins the realtime publication …
-- • … but the ONLY allowed listener channel is the PRIVATE channel
--   'admin-bookings', and the realtime.messages policy below requires
--   an authenticated user whose email is in admin_emails.
-- Regular visitors cannot subscribe — patient data stays sealed.
--
-- Run ONCE on your existing database. Safe to re-run.
-- ============================================================

-- Announce booking changes
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'bookings'
  ) then
    alter publication supabase_realtime add table public.bookings;
    raise notice 'realtime ON: bookings';
  else
    raise notice 'realtime already on: bookings';
  end if;
end $$;

-- Only admins may listen on the private 'admin-bookings' channel.
drop policy if exists "admin can hear booking changes" on realtime.messages;
create policy "admin can hear booking changes"
  on realtime.messages
  for select
  to authenticated
  using (
    realtime.topic() = 'admin-bookings'
    and realtime.messages.extension = 'postgres_changes'
    and exists (
      select 1 from public.admin_emails
      where email = (select auth.jwt() ->> 'email')
    )
  );

-- ============================================================
-- Migration 004 — Realtime announcements for the public content
-- Registers the 5 public content tables with the built-in
-- `supabase_realtime` publication so every INSERT/UPDATE/DELETE
-- is broadcast to subscribed browsers (live site, no reload).
--
-- Run ONCE on your existing database (SQL Editor → paste → Run).
-- Fresh setups get this automatically from schema.sql.
-- Safe to re-run: tables already on the list are skipped.
-- Reversible:  alter publication supabase_realtime drop table public.services;
-- ============================================================

do $$
declare
  t text;
begin
  foreach t in array array[
    'services', 'doctors', 'testimonials', 'blog_posts', 'clinic_settings'
  ] loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
      raise notice 'realtime ON: %', t;
    else
      raise notice 'realtime already on: %', t;
    end if;
  end loop;
end $$;

-- Verify: expect the 5 tables listed here afterwards
select tablename from pg_publication_tables
where pubname = 'supabase_realtime' and schemaname = 'public'
order by tablename;

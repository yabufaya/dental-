-- ============================================================
-- Migration 003 — social media links on clinic_settings
-- Run this ONLY if your database already has the old schema
-- (schema.sql is idempotent for fresh runs and already includes
-- these columns — do not run both).
-- Safe to re-run: "if not exists" makes every step idempotent.
-- ============================================================

alter table public.clinic_settings
  add column if not exists facebook_url  text,
  add column if not exists instagram_url text,
  add column if not exists linkedin_url  text,
  add column if not exists tiktok_url    text,
  add column if not exists youtube_url   text,
  add column if not exists x_url         text;

-- Optional starter values for the two active platforms (fills only empty ones):
update public.clinic_settings
set facebook_url  = coalesce(facebook_url,  'https://facebook.com/dentoradental'),
    instagram_url = coalesce(instagram_url, 'https://instagram.com/dentoradental'),
    updated_at    = now()
where id = 1;

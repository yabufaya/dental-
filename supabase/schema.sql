-- ═══════════════════════════════════════════════════════════════════
-- DENTORA DENTAL CLINIC — Complete database schema + seed data
-- ═══════════════════════════════════════════════════════════════════
-- HOW TO RUN:
--   Supabase Dashboard → SQL Editor → New query → paste ALL → Run
--
-- ⚠️ BEFORE RUNNING, replace the admin email near the top of this file
--    with YOUR Google account email (the one you'll sign in with).
-- ═══════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────
-- OPTIONAL RESET — if you previously experimented with tables
-- (symptom: ERROR 42703 "column ... does not exist" = a leftover
-- table with the same name but different columns), run these
-- DROPs FIRST, then run the whole file. ⚠️ deletes old data.
-- ─────────────────────────────────────────────────────────
-- drop table if exists public.bookings cascade;
-- drop table if exists public.testimonials cascade;
-- drop table if exists public.blog_posts cascade;
-- drop table if exists public.clinic_settings cascade;
-- drop table if exists public.services cascade;
-- drop table if exists public.doctors cascade;
-- drop table if exists public.admin_emails cascade;
--
-- ☢️ NUCLEAR OPTION — the Postgres equivalent of MySQL "DROP DATABASE":
-- wipes EVERYTHING in the public schema, not just this project's tables.
-- (Auth users & storage files live in other schemas and survive.)
-- Do NOT run it together with the table drops above — pick ONE strategy.
-- drop schema public cascade;
-- create schema public;
-- grant usage on schema public to postgres, anon, authenticated, service_role;
-- grant create on schema public to postgres, anon, authenticated, service_role;
-- grant all privileges on all tables in schema public to postgres, anon, authenticated, service_role;
-- grant all privileges on all sequences in schema public to postgres, anon, authenticated, service_role;
-- grant all privileges on all functions in schema public to postgres, anon, authenticated, service_role;
-- alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;
-- alter default privileges in schema public grant all on sequences to postgres, anon, authenticated, service_role;
-- alter default privileges in schema public grant all on functions to postgres, anon, authenticated, service_role;


-- ─────────────────────────────────────────────────────────
-- 0 · ADMIN ALLOWLIST — who can manage the clinic data
-- ─────────────────────────────────────────────────────────
create table if not exists public.admin_emails (
  email text primary key
);

alter table public.admin_emails enable row level security;
-- No policies → nobody can read/write it via the API (SQL editor only).

-- ⛔ REPLACE THIS with your real Google account email:
insert into public.admin_emails (email) values ('you@example.com')
on conflict (email) do nothing;

-- Helper used by every policy below: "is the logged-in user an admin?"
create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_emails a
    where a.email = (auth.jwt() ->> 'email')
  )
$$;

grant execute on function public.is_admin() to anon, authenticated;


-- ─────────────────────────────────────────────────────────
-- 1 · SERVICES
-- ─────────────────────────────────────────────────────────
create table if not exists public.services (
  id                text primary key,          -- 'checkup-cleaning'
  slug              text not null unique,      -- 'checkup-and-cleaning' (URL)
  title             text not null,
  title_am          text,
  plain_desc        text,
  plain_desc_am     text,
  long_desc         text,
  long_desc_am      text,
  price_from_etb    integer not null default 0,
  duration_min      integer not null default 30,
  icon_name         text default 'Sparkles',
  image_url         text,
  is_featured       boolean not null default false,
  is_active         boolean not null default true,
  sort_order        integer not null default 0,
  procedure_steps    jsonb not null default '[]'::jsonb,   -- ["step1","step2"]
  procedure_steps_am jsonb,
  who_needs_it      text,
  who_needs_it_am   text,
  aftercare         jsonb not null default '[]'::jsonb,
  aftercare_am      jsonb,
  faqs              jsonb not null default '[]'::jsonb,     -- [{q,a,qAm,aAm}]
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);


-- ─────────────────────────────────────────────────────────
-- 2 · DOCTORS
-- ─────────────────────────────────────────────────────────
create table if not exists public.doctors (
  id             text primary key,             -- 'dr-daniel-carter'
  name           text not null,
  name_am        text,
  title          text,
  title_am       text,
  specialty      text,
  specialty_am   text,
  qualifications text,
  languages      jsonb not null default '[]'::jsonb,       -- ["English","Amharic"]
  years_exp      integer default 0,
  rating         numeric(3,2) default 5 check (rating between 0 and 5),
  review_count   integer default 0,
  avatar_url     text,
  bio            text,
  bio_am         text,
  is_active      boolean not null default true,
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);


-- ─────────────────────────────────────────────────────────
-- 3 · CLINIC SETTINGS — exactly ONE row (id = 1)
-- ─────────────────────────────────────────────────────────
create table if not exists public.clinic_settings (
  id                  integer primary key default 1 check (id = 1),
  name                text, name_am            text,
  slogan              text, slogan_am          text,
  slogan_sub          text, slogan_sub_am      text,
  phone               text, emergency_phone    text,
  whatsapp            text, telegram           text, email text,
  address             text, address_am         text,
  landmark            text, landmark_am        text,
  lat                 numeric, lng             numeric,
  hours               jsonb,          -- {mon:{open,close}, …, sun:null}
  payment_methods     jsonb,          -- ["Telebirr", …]
  accessibility       jsonb,
  registration_number text,
  -- Hero section (editable marketing block)
  hero_title          text, hero_title_am      text,
  hero_subtitle       text, hero_subtitle_am   text,
  hero_image_url      text,
  -- Full Google Maps "Share → Embed a map" src URL.
  -- Staff-pasteable; overrides the lat/lng-generated map.
  map_embed_url       text,
  -- Social media page URLs (empty/null = icon hidden in the footer).
  -- WhatsApp & Telegram links are derived from the whatsapp/telegram columns above.
  facebook_url        text, instagram_url      text,
  linkedin_url        text, tiktok_url         text,
  youtube_url         text, x_url              text,
  -- Trust numbers
  satisfaction_rate   integer, smiles_transformed integer,
  patient_rating      numeric(2,1),
  years_experience    integer, specialist_count   integer,
  updated_at          timestamptz not null default now()
);


-- ─────────────────────────────────────────────────────────
-- 4 · BOOKINGS  (public can insert, admin can manage)
-- ─────────────────────────────────────────────────────────
create table if not exists public.bookings (
  id             uuid primary key default gen_random_uuid(),
  booking_ref    text not null unique,     -- 'DEN-482031' (generated in app)
  patient_name   text not null,
  phone          text not null,
  service_id     text references public.services(id) on delete set null,
  doctor_id      text references public.doctors(id)  on delete set null,
  preferred_date date not null,
  time_slot      text not null,
  notes          text,
  status         text not null default 'pending'
                 check (status in ('pending','confirmed','cancelled','done')),
  created_at     timestamptz not null default now()
);

create index if not exists bookings_date_idx   on public.bookings (preferred_date);
create index if not exists bookings_status_idx on public.bookings (status);


-- ─────────────────────────────────────────────────────────
-- 5 · TESTIMONIALS
-- ─────────────────────────────────────────────────────────
create table if not exists public.testimonials (
  id              uuid primary key default gen_random_uuid(),
  patient_name    text not null,
  patient_name_am text,
  avatar_url      text,
  treatment       text,
  treatment_am    text,
  rating          integer default 5 check (rating between 1 and 5),
  quote           text not null,
  quote_am        text,
  date_label      text,                  -- 'March 2026'
  before_url      text,
  after_url       text,
  before_after_alt text,
  consent         boolean not null default false,
  is_published    boolean not null default true,
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now()
);


-- ─────────────────────────────────────────────────────────
-- 6 · BLOG POSTS
-- ─────────────────────────────────────────────────────────
create table if not exists public.blog_posts (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  title_am      text,
  excerpt       text,
  excerpt_am    text,
  content       text,
  content_am    text,
  category      text,
  cover_url     text,
  read_time     text,
  author_name   text,
  author_role   text,
  author_avatar text,
  published_at  date default current_date,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now()
);


-- ─────────────────────────────────────────────────────────
-- 7 · ROW LEVEL SECURITY
--     Public visitors: READ content, CREATE bookings — nothing else.
--     Admins (email in admin_emails): full manage.
-- ─────────────────────────────────────────────────────────
alter table public.services        enable row level security;
alter table public.doctors         enable row level security;
alter table public.clinic_settings enable row level security;
alter table public.bookings        enable row level security;
alter table public.testimonials    enable row level security;
alter table public.blog_posts      enable row level security;

-- ── Realtime ⚡ — public content tables broadcast their changes ──
-- Registers each table with the built-in `supabase_realtime` publication
-- so subscribed browsers receive INSERT/UPDATE/DELETE instantly (live
-- site, no reload). Idempotent: already-listed tables are skipped.
do $$
declare
  t text;
begin
  foreach t in array array[
    'services', 'doctors', 'testimonials', 'blog_posts', 'clinic_settings', 'bookings'
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

-- bookings realtime must reach ADMINS ONLY (it carries patient data):
-- Realtime Authorization — only an authenticated admin allowlisted in
-- admin_emails may subscribe to the private channel 'admin-bookings'.
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

-- (drop-guards first → this file is safe to re-run)

-- Content tables: world can read …
drop policy if exists "public read services"     on public.services;
drop policy if exists "admin manage services"    on public.services;
create policy "public read services"     on public.services        for select using (true);

drop policy if exists "public read doctors"      on public.doctors;
drop policy if exists "admin manage doctors"     on public.doctors;
create policy "public read doctors"      on public.doctors         for select using (true);

drop policy if exists "public read settings"     on public.clinic_settings;
drop policy if exists "admin manage settings"    on public.clinic_settings;
create policy "public read settings"     on public.clinic_settings for select using (true);

drop policy if exists "public read testimonials" on public.testimonials;
drop policy if exists "admin manage testimonials" on public.testimonials;
create policy "public read testimonials" on public.testimonials    for select using (true);

drop policy if exists "public read blog_posts"   on public.blog_posts;
drop policy if exists "admin manage blog_posts"  on public.blog_posts;
create policy "public read blog_posts"   on public.blog_posts      for select using (true);

-- … but only admins can change anything
create policy "admin manage services"     on public.services        for all
  using (public.is_admin()) with check (public.is_admin());
create policy "admin manage doctors"      on public.doctors         for all
  using (public.is_admin()) with check (public.is_admin());
create policy "admin manage settings"     on public.clinic_settings for all
  using (public.is_admin()) with check (public.is_admin());
create policy "admin manage testimonials" on public.testimonials    for all
  using (public.is_admin()) with check (public.is_admin());
create policy "admin manage blog_posts"   on public.blog_posts      for all
  using (public.is_admin()) with check (public.is_admin());

-- Bookings: anyone can SUBMIT one …
drop policy if exists "anyone can book"        on public.bookings;
drop policy if exists "admin read bookings"    on public.bookings;
drop policy if exists "admin update bookings"  on public.bookings;
drop policy if exists "admin delete bookings"  on public.bookings;
create policy "anyone can book" on public.bookings
  for insert with check (true);
-- … but reading/updating/deleting the list is admin-only
create policy "admin read bookings"   on public.bookings for select using (public.is_admin());
create policy "admin update bookings" on public.bookings for update
  using (public.is_admin()) with check (public.is_admin());
create policy "admin delete bookings" on public.bookings for delete using (public.is_admin());

-- ── Slot engine 🔒 — one booking per 30-min slot clinic-wide ──
-- Hard guarantee against double-booking (app error 23505 → friendly retry).
create unique index if not exists bookings_active_slot_unique
  on public.bookings (preferred_date, time_slot)
  where status in ('pending', 'confirmed');

-- Public-safe availability: the booking UI shows taken slots WITHOUT
-- ever exposing patient data. Views run as their owner → bypass RLS on
-- purpose; this view only exposes date + slot (no names/phones/notes).
create or replace view public.booked_slots as
  select preferred_date, time_slot
  from public.bookings
  where status in ('pending', 'confirmed');

grant select on public.booked_slots to anon, authenticated;


-- ─────────────────────────────────────────────────────────
-- 8 · STORAGE BUCKET — 'site-assets' (public images)
-- ─────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do nothing;

drop policy if exists "public read site assets"  on storage.objects;
drop policy if exists "admin manage site assets" on storage.objects;
create policy "public read site assets" on storage.objects
  for select using (bucket_id = 'site-assets');
create policy "admin manage site assets" on storage.objects
  for all using (bucket_id = 'site-assets' and public.is_admin())
  with check (bucket_id = 'site-assets' and public.is_admin());


-- ═════════════════════════════════════════════════════════
-- SEED DATA — your real clinic content from clinicData.ts
-- ═════════════════════════════════════════════════════════

-- ── clinic_settings (the single row) ─────────────────────
insert into public.clinic_settings (
  id, name, name_am, slogan, slogan_am, slogan_sub, slogan_sub_am,
  phone, emergency_phone, whatsapp, telegram, email,
  address, address_am, landmark, landmark_am, lat, lng,
  hours, payment_methods, accessibility, registration_number,
  hero_title, hero_title_am, hero_subtitle, hero_subtitle_am, hero_image_url,
  map_embed_url,
  facebook_url, instagram_url, linkedin_url, tiktok_url, youtube_url, x_url,
  satisfaction_rate, smiles_transformed, patient_rating, years_experience, specialist_count
) values (
  1,
  'Dentora Dental Clinic', $$ዴንቶራ የጥርስ ሕክምና ክሊኒክ$$,
  'Family-Friendly Dental Care', $$ለቤተሰብ ተስማሚ ዘመናዊ የጥርስ ሕክምና$$,
  'Permanent natural-looking solutions to replace missing teeth and restore confident, healthy smiles.',
  $$የጎደሉ ጥርሶችን በመተካት ተፈጥሯዊና ማራኪ ፈገግታን በዘመናዊ ቴክኖሎጂ የምንመልስበት ማዕከል።$$,
  '+251 91 123 4567', '+251 91 199 8877', '251911234567', 'dentora_clinic', 'care@dentora-dental.et',
  'Bole Medhanialem, Edna Mall Road, 2nd Floor, Suite 204',
  $$ቦሌ መድኃኔዓለም፣ ኤድና ሞል መንገድ፣ 2ኛ ፎቅ ቢሮ ቁጥር 204$$,
  'Right next to Morning Star Mall, opposite Edna Mall',
  $$ከሞርኒንግ ስታር ሞል ጎን፣ ከኤድና ሞል ፊት ለፊት$$,
  8.9984, 38.7882,
  $${"mon":{"open":"08:30","close":"17:30"},"tue":{"open":"08:30","close":"17:30"},"wed":{"open":"08:30","close":"17:30"},"thu":{"open":"08:30","close":"17:30"},"fri":{"open":"08:30","close":"17:30"},"sat":{"open":"09:00","close":"15:30"},"sun":null}$$::jsonb,
  $$["Cash (ብር)", "Telebirr (ቴሌብር)", "CBE Birr (ሲቢኢ ብር)", "Bank Transfer (Awash, CBE, Dashen)", "Private Insurance"]$$::jsonb,
  $$["Ground floor elevator / lift", "Wheelchair accessible operatory", "Free reserved clinic parking", "Child-friendly play area"]$$::jsonb,
  'MOH/AA/ETH-2024-8842',
  'Family-Friendly Dental Care', $$ለቤተሰብ ተስማሚ ዘመናዊ የጥርስ ሕክምና$$,
  'Permanent natural-looking solutions to replace missing teeth and restore confident, healthy smiles.',
  $$የጎደሉ ጥርሶችን በመተካት ተፈጥሯዊና ማራኪ ፈገግታን በዘመናዊ ቴክኖሎጂ የምንመልስበት ማዕከል።$$,
  '/images/hero.jpg',
  -- 🗺️ Replace with your clinic's real pin: Google Maps → Share → Embed a map → copy the src="…" part
  'https://maps.google.com/maps?q=8.9984,38.7882&hl=en&z=15&output=embed',
  -- Social links (edit these to your real pages; NULL = hidden on the site):
  'https://facebook.com/dentoradental', 'https://instagram.com/dentoradental',
  NULL, NULL, NULL, NULL,  -- linkedin / tiktok / youtube / x
  98, 2450, 4.9, 12, 6
)
on conflict (id) do nothing;


-- ── doctors ──────────────────────────────────────────────
insert into public.doctors
  (id, name, name_am, title, title_am, specialty, specialty_am, qualifications,
   languages, years_exp, rating, review_count, avatar_url, bio, bio_am, sort_order)
values
  ('dr-daniel-carter', 'Dr. Daniel Carter', $$ዶ/ር ዳንኤል ካርተር$$,
   'Lead Dental Specialist & Implantologist', $$ዋና የጥርስ ስፔሻሊስት እና ኢምፕላንቶሎጂስት$$,
   'Dental Implants, Smile Restoration & Oral Surgery', $$የጥርስ ተከላ፣ ፈገግታ ማስተካከል እና የቀዶ ጥገና ሕክምና$$,
   'DDS (Columbia University), MSc Oral Implantology',
   $$["English", "Amharic (ጥሩ አማርኛ)"]$$::jsonb, 14, 4.9, 145,
   'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
   'Dedicated to gentle and pain-minimized dentistry with over 14 years restoring complex smiles using computer-guided implant systems.',
   $$ከ14 ዓመታት በላይ በዘመናዊ የጥርስ ተከላና ሕክምና ዘርፍ የህሙማንን ጭንቀት በሚቀርፍ የዋህ አቀራረብ የሚታወቁ ባለሙያ።$$, 1),
  ('dr-selamawit-tadesse', 'Dr. Selamawit Tadesse', $$ዶ/ር ሰላማዊት ታደሰ$$,
   'Senior Aesthetic Dentist & Orthodontist', $$ከፍተኛ የውበት ጥርስ እና ኦርቶዶንቲክስ ሐኪም$$,
   'Clear Aligners, Braces & Veneers', $$የጥርስ ሽቦ፣ ግልፅ አላይነር እና የውበት ጥርስ ቅንብር$$,
   'BDS (Addis Ababa University), Dip. Aesthetic Dentistry (London)',
   $$["Amharic", "English", "Afaan Oromoo"]$$::jsonb, 10, 4.95, 180,
   'https://images.unsplash.com/photo-1594824813583-490333d02b54?auto=format&fit=crop&w=600&q=80',
   'Specializes in creating naturally aligned, dazzling smiles for both teens and adults with an empathetic, communicative approach.',
   $$በጥርስ ውበትና ማስተካከል ዘርፍ የተካኑ፣ ለህፃናትም ሆነ ለአዋቂዎች ምቹ የሆነ አሰራር የሚያቀርቡ ታማኝ ሐኪም።$$, 2),
  ('dr-dawit-abebe', 'Dr. Dawit Abebe', $$ዶ/ር ዳዊት አበበ$$,
   'Endodontist & Pediatric Specialist', $$የስር ቦይ (Root Canal) እና የህፃናት ጥርስ ስፔሻሊስት$$,
   'Root Canal Treatment & Children Dentistry', $$የስር ቦይ ህክምና (የተጎዳ ጥርስ ማዳን) እና የህፃናት ጥርስ$$,
   'DDS, Certificate in Advanced Endodontics',
   $$["Amharic", "English", "Tigrinya"]$$::jsonb, 9, 4.88, 96,
   'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80',
   'Master of gentle tooth-saving root canal procedures with micro-rotary instruments that eliminate pain and preserve natural teeth.',
   $$የተጎዱና ህመም የሚፈጥሩ ጥርሶችን ሳይነቀሉ በዘመናዊ መሳሪያዎች ታክመው ረጅም አመት እንዲቆዩ የሚያደርጉ ባለሙያ።$$, 3)
on conflict (id) do nothing;


-- ── services ─────────────────────────────────────────────
insert into public.services
  (id, slug, title, title_am, plain_desc, plain_desc_am, long_desc, long_desc_am,
   price_from_etb, duration_min, icon_name, image_url, is_featured, sort_order,
   procedure_steps, procedure_steps_am, who_needs_it, aftercare, faqs)
values
  ('checkup-cleaning','checkup-and-cleaning','Dental Checkup & Cleaning',$$የጥርስ ምርመራ እና ጽዳት$$,
   'Comprehensive examination, digital X-rays, and gentle ultrasonic scaling to protect gums and freshen breath.',
   $$ጥልቅ ምርመራ፣ የዲጂታል ኤክስሬይ እና በዘመናዊ መሳሪያ የቆሻሻና ካልሺየም ጽዳት።$$,
   'Our preventative checkup combines high-definition intraoral cameras and gentle ultrasonic scaling. We detect early cavity risks before they become painful, polish teeth surfaces, and provide fluoride enamel reinforcement.',
   $$አስቀድሞ ጥርስ እንዳይበላሽ ለመከላከል የሚረዳ፣ የድድ ጤንነትን የሚያረጋግጥ እና ጥርስን በማፅዳት ተፈጥሯዊ ንፅህናውን የሚመልስ መሰረታዊ አገልግሎት።$$,
   1200,40,'Sparkles','https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=700&q=80',true,1,
   $$["Visual examination & digital intraoral scan","Ultrasonic tartar and plaque removal","Gentle tooth surface polishing","Preventive enamel protection & care advice"]$$::jsonb, null,
   'Every adult and child every 6 months to prevent tooth decay and gum disease.',
   $$["Avoid intensely colored drinks for 2 hours","Brush twice daily with soft-bristle toothbrush","Maintain daily flossing routine"]$$::jsonb,
   $$[{"q":"Does dental cleaning hurt?","a":"No. Modern ultrasonic scaling uses gentle water vibrations. We can also apply a mild numbing gel if your gums are sensitive.","qAm":"የጥርስ ጽዳት ህመም አለው?","aAm":"በፍጹም ህመም የለውም። ዘመናዊው የውሃ ርጭት ቴክኖሎጂ ድድዎን ሳይጎዳ ቆሻሻን ብቻ ያስወግዳል።"}]$$::jsonb),

  ('tooth-filling','tooth-filling-restoration','Tooth Fillings & Restoration',$$የጥርስ ሙሌት (ፋይል)$$,
   'Tooth-colored composite fillings that seamlessly blend with your natural smile to seal cavities.',
   $$ከተፈጥሮ ጥርስዎ ቀለም ጋር አንድ አይነት የሆነ ጠንካራና ማራኪ የጥርስ ሙሌት።$$,
   'Say goodbye to unsightly dark amalgam fillings. We use medical-grade, shade-matched composite resins that bond directly to your enamel, restoring full chewing strength while looking 100% natural.',
   $$ጥቁር እና አስቀያሚ ሙሌቶች ሳይሆኑ፣ ከጥርስዎ ቀለም ጋር ተመሳሳይ በሆነ ጠንካራ ማቴሪያል ጥርስዎን እንሞላለን።$$,
   2400,45,'ShieldCheck','https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=700&q=80',true,2,
   $$["Gentle local anesthesia for complete comfort","Removal of decayed tissue with high-precision instruments","Layered bonding of biocompatible composite resin","Artistic sculpting, bite-adjustment and high-gloss polish"]$$::jsonb, null,
   'Anyone experiencing tooth sensitivity to sweets or cold, chipped edges, or visible dark spots.',
   $$["Wait for numbness to wear off completely before chewing solid foods","Mild sensitivity for 2-3 days is normal and subsides naturally"]$$::jsonb,
   $$[{"q":"How long do white composite fillings last?","a":"With good daily oral hygiene, modern composite restorations typically last 8 to 15 years."}]$$::jsonb),

  ('root-canal','root-canal-therapy','Root Canal (Saving a Painful Tooth)',$$የስር ቦይ ህክምና (የተጎዳ ጥርስ ማዳን)$$,
   'Gentle endodontic treatment that eliminates deep infection and saves your natural tooth from extraction.',
   $$የተጎዳና ከፍተኛ ህመም የሚፈጥር ጥርስን ሳይነቀል በውስጥ ቦይ ህክምና የማዳን ስራ።$$,
   'A severe toothache often means bacteria have reached the nerve inside the pulp chamber. Our microscopic root canal treatment clears the infection, disinfects the canals, and seals them safely, preserving your real tooth for life.',
   $$ጥርስን ከመንቀል ይልቅ በውስጡ ያለውን ኢንፌክሽን በማጽዳት ተፈጥሯዊ ጥርስዎ ሳይወልቅ በቦታው እንዲቆይ የሚያደርግ ቆራጥ ህክምና።$$,
   5500,60,'Activity','https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=700&q=80',true,3,
   $$["Digital diagnostic 3D canal mapping","Targeted pain-free anesthesia","Complete disinfection of infected root canals using rotary files","Hermetic sealing with biocompatible gutta-percha and temporary or permanent crown"]$$::jsonb, null,
   'Patients with lingering throbbing pain, nocturnal toothache, swelling, or pain upon biting.',
   $$["Avoid chewing hard foods on the treated side until the permanent restoration is placed","Take prescribed pain relief as directed for the first 24 hours"]$$::jsonb,
   $$[{"q":"Will root canal treatment hurt?","a":"Root canal treatment is designed to ELIMINATE pain, not cause it. With our modern anesthetics, the procedure feels no different than getting a standard filling."}]$$::jsonb),

  ('teeth-whitening','teeth-whitening-cosmetic','Professional Teeth Whitening',$$የጥርስ ማበጠርና ማፅዳት (Whitening)$$,
   'Safe, in-office laser cosmetic whitening brightening your smile up to 6–8 shades in a single comfortable visit.',
   $$በአንድ ሰዓት ውስጥ ጥርስዎን በ6-8 ደረጃዎች የሚያደምቅና ተፈጥሯዊ ፈገግታን የሚሰጥ ህክምና።$$,
   'Remove years of coffee, tea, and everyday stains with our enamel-safe laser whitening system. We protect your gums with an insulating barrier before activating our hydrogen peroxide gel for immediate, radiant results.',
   $$የሻይ፣ ቡናና ሌሎች ነጠብጣቦችን በማስወገድ ፈገግታዎን በከፍተኛ ደረጃ የሚያደምቅ የውበት አገልግሎት።$$,
   4800,50,'Sun','https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=700&q=80',true,4,
   $$["Smile shade assessment and record photo","Gingival barrier application to protect gums","Application of dental whitening active formula","Gentle cool-light LED laser activation cycles"]$$::jsonb, null,
   'Anyone preparing for a wedding, graduation, job interview, or seeking a brighter, more confident smile.',
   $$["Follow the \"white diet\" for 48 hours: avoid dark coffee, red wine, berbere, and cola","Use a sensitivity toothpaste if mild tingling occurs"]$$::jsonb,
   $$[{"q":"Is laser whitening safe for tooth enamel?","a":"Yes, 100%. Our dental-grade formula oxidizes organic pigment molecules inside the pores without stripping away or weakening the hard tooth enamel."}]$$::jsonb),

  ('dental-implants','dental-implants-crowns','Dental Implants & Crowns',$$የጥርስ ተከላ እና ክራውን (የጥርስ ቆብ)$$,
   'Permanent titanium tooth replacements anchored into the jawbone that look, feel, and function like natural teeth.',
   $$የወለቀን ጥርስ በቋሚነት የሚተካ፣ እንደ እውነተኛ ጥርስ የሚያገለግል ዘመናዊ ተከላ።$$,
   'Dental implants are the gold standard for missing teeth. Crafted from bio-compatible titanium and crowned with premium zirconia, they restore chewing capacity and prevent facial bone loss.',
   $$ከቲታኒየም የተሰሩ ዘላቂ የጥርስ ተከላዎች የምግብ ማኘክ አቅምዎን ሙሉ በሙሉ ይመልሳሉ።$$,
   18000,75,'Layers','https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=700&q=80',true,5,
   $$["3D CBCT digital bone density scan","Guided painless surgical implant post placement","Osseointegration healing period","Custom zirconia aesthetic crown placement"]$$::jsonb, null,
   'Individuals missing one or more teeth who want a permanent alternative to loose removable dentures.',
   $$["Soft food diet for 7 days post-surgery","Gentle warm saltwater rinses","Regular 6-month implant maintenance checkups"]$$::jsonb,
   $$[{"q":"Can dental implants last a lifetime?","a":"Yes! With standard oral hygiene and regular cleanings, titanium implants have a 95%+ success rate lasting 25+ years to a lifetime."}]$$::jsonb),

  ('orthodontics-braces','orthodontics-and-braces','Braces & Clear Aligners',$$የጥርስ ሽቦ እና ግልፅ አላይነር (Aligners)$$,
   'Straighten crooked, crowded, or spaced teeth for teenagers and adults using ceramic braces or invisible aligners.',
   $$የተዘበራረቁና የተራራቁ ጥርሶችን በውበት የሚያስተካክል ዘመናዊ ህክምና።$$,
   'Achieve the balanced, harmonious bite you have always wanted. We offer discreet ceramic brackets and clear removable aligner trays designed for comfortable day-to-day wearing.',
   $$ጥርሶችን ደረጃ በደረጃ በማስተካከል ማራኪና የተስተካከለ አሰላለፍ እንዲኖራቸው ያደርጋል።$$,
   16000,45,'Smile','https://images.unsplash.com/photo-1571772996211-2f02c9727629?auto=format&fit=crop&w=700&q=80',false,6,
   $$["Digital 3D smile scan & simulation of final alignment","Personalized treatment planning","Bonding of aesthetic brackets or custom aligner delivery","Routine monthly progress adjustments"]$$::jsonb, null,
   'Anyone with crowded teeth, crossbite, overbite, or gaps wishing to improve both aesthetics and chewing comfort.',
   $$["Wear removable aligners 20–22 hours daily","Use orthodontic wax if brackets cause minor friction"]$$::jsonb,
   $$[{"q":"Am I too old for orthodontic braces?","a":"Never! Nearly 40% of our orthodontic patients are working adults. Teeth move smoothly at any age with healthy gums."}]$$::jsonb),

  ('pediatric-dentistry','pediatric-children-dentistry','Pediatric Care (Children)',$$የህፃናት ጥርስ እንክብካቤ$$,
   'Fun, gentle, fear-free visits designed especially for infants, toddlers, and young teens.',
   $$ለህፃናት ፍርሃት አልባ፣ በጨዋታና በደግነት የታጀበ የጥርስ ህክምና።$$,
   'We turn dental appointments into an enjoyable adventure for little ones. Early visits foster strong dental habits, prevent childhood cavities with sealants, and monitor developing jaw alignment.',
   $$ልጆች ዶክተርን እንዳይፈሩ በሚያደርግ ምቹ ሁኔታ ጥርሳቸው እንዲጠበቅ እናደርጋለን።$$,
   1500,30,'Heart','https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=700&q=80',false,7,
   $$["Playful introduction to dental tools and chair","Gentle tooth count and cavity inspection","Protective fluoride varnish application","Fun oral hygiene reward certificate"]$$::jsonb, null,
   'Every child starting from their first tooth eruption or 1st birthday.',
   $$["Help children brush twice daily with age-appropriate fluoride toothpaste","Limit sugary sticky snacks between meals"]$$::jsonb,
   $$[{"q":"Why treat baby teeth if they will fall out anyway?","a":"Baby teeth guide the permanent teeth into proper alignment and enable healthy speech and chewing. Infected baby teeth can harm the underlying adult tooth buds."}]$$::jsonb),

  ('emergency-care','emergency-dental-care','Emergency Dental Relief',$$አስቸኳይ የጥርስ ህክምና (Emergency)$$,
   'Same-day urgent relief for acute toothache, broken crowns, knocked-out teeth, or facial swelling.',
   $$ለድንገተኛ ከባድ ህመም፣ ለተሰበረ ጥርስ ወይም ለእብጠት በአፋጣኝ የሚሰጥ የህክምና እርዳታ።$$,
   'Dental emergencies cannot wait. Our dedicated emergency phone line connects you directly to on-call specialists with prioritized same-day slots.',
   $$ድንገተኛ የጥርስ ህመም ሲያጋጥምዎት ቅድሚያ ተሰጥቶዎት ወዲያውኑ የሚታከሙበት ክፍል ነው።$$,
   2000,45,'AlertCircle','https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=700&q=80',false,8,
   $$["Immediate pain-relief triage and diagnosis","Targeted local anesthesia","Interim stabilization, nerve dressing, or fracture repair","Prescription antibiotics and recovery roadmap"]$$::jsonb, null,
   'Patients with unbearable pain, bleeding after dental trauma, or sudden swelling around the jaw.',
   $$["Apply a cold compress on the outer cheek for swelling","Never place aspirin directly on gum tissue"]$$::jsonb,
   $$[{"q":"What should I do if a permanent tooth is completely knocked out?","a":"Pick it up by the crown (never touch the root), gently rinse with clean water, and place it in a cup of fresh cold milk. Call our emergency line immediately (+251 91 199 8877) — re-implantation is most successful within 60 minutes!"}]$$::jsonb)
on conflict (id) do nothing;


-- ── testimonials ─────────────────────────────────────────
insert into public.testimonials
  (id, patient_name, patient_name_am, avatar_url, treatment, treatment_am, rating,
   quote, quote_am, date_label, before_url, after_url, before_after_alt,
   consent, is_published, sort_order)
values
  ('00000000-0000-4000-8000-000000000901',
   'Bethlehem T.', $$ቤተልሔም ተ.$$,
   'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
   'Laser Teeth Whitening & Composite Restorations', $$የጥርስ ማበጠር (Whitening) እና ሙሌት$$, 5,
   'I used to hide my smile during photos because of coffee stains and old chipped fillings. In just one 50-minute session at Dentora, my confidence was completely restored. Truly gentle and zero pain!',
   $$በቡና ነጠብጣብ ምክንያት ፈገግ ለማለት እሸማቀቅ ነበር። በዴንቶራ ክሊኒክ በአንድ ሰዓት ውስጥ ያገኘሁት ውጤት አስደናቂ ነው!$$,
   'March 2026', '/images/before.jpg', '/images/after.jpg',
   'Teeth whitening cosmetic transformation', true, true, 1),
  ('00000000-0000-4000-8000-000000000902',
   'Yonas M.', $$ዮናስ መ.$$,
   'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
   'Titanium Dental Implant & Zirconia Crown', $$የጥርስ ተከላ እና ክራውን$$, 5,
   'Dr. Daniel explained every step before touching my tooth. The implant surgery was surprisingly quick and painless. Today, I can chew steak and injera with total confidence!',
   $$ዶ/ር ዳንኤል በቅድሚያ ሁሉንም ነገር አስረድተውኝ በጥንቃቄ ተከሉልኝ። አሁን ልክ እንደ ተፈጥሮ ጥርሴ ያለምንም ችግር እመገባለሁ።$$,
   'February 2026', null, null, null, true, true, 2),
  ('00000000-0000-4000-8000-000000000903',
   'Hana K.', $$ሃና ከ.$$,
   'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
   'Gentle Root Canal & Porcelain Crown', $$የስር ቦይ ህክምና እና ክራውን$$, 5,
   'I was terrified of root canals because of childhood horror stories. Dr. Dawit was so calm, friendly, and patient. I literally fell asleep in the dental chair while he saved my molar!',
   $$የስር ቦይ ህክምና በጣም ያስፈራኝ ነበር። ዶክተሩ እጅግ የዋህ ከመሆናቸው የተነሳ ሳልጨነቅ ህክምናዬን ጨረስኩ።$$,
   'January 2026', null, null, null, true, true, 3),
  ('00000000-0000-4000-8000-000000000904',
   'Mekdelawit G.', $$መቅደላዊት ገ.$$,
   'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
   'Pediatric Visit for 6-year-old son', $$የ6 ዓመት ልጄ የጥርስ ምርመራ$$, 5,
   'My son Caleb actually asks when we are going back to Dentora! The staff gave him balloons and a certificate. The cleanest clinic I have seen in Addis Ababa.',
   $$ልጄ ኬሌብ ዶክተሩን አልፈራም፤ ይልቁንም ወደ ዴንቶራ መቼ እንደምንሄድ ይጠይቀኛል! እጅግ ንጹህና አስተማማኝ ክሊኒክ።$$,
   'April 2026', null, null, null, true, true, 4)
on conflict (id) do nothing;


-- ── blog_posts ───────────────────────────────────────────
insert into public.blog_posts
  (slug, title, title_am, excerpt, excerpt_am, content, content_am, category,
   read_time, author_name, author_role, author_avatar, published_at)
values
  ('professional-cleaning-vs-regular-brushing',
   'Professional Cleaning vs. Regular Brushing: What Toothbrushes Leave Behind',
   $$የጥርስ ሀኪም ጽዳት እና የቤት ውስጥ ብሩሽ ልዩነት$$,
   'Why even the most diligent daily brushers develop hardened calculus over 6 months, and how ultrasonic scaling prevents gum recession.',
   $$በየቀኑ ብሩሽ ቢያደርጉም በየ6 ወሩ የሀኪም ጽዳት ለምን እንደሚያስፈልግ እና ድድን ከበሽታ እንዴት እንደሚከላከል የሚገልጽ ጠቃሚ ትምህርት።$$,
   $$Even if you brush twice a day and floss regularly, saliva contains minerals that naturally bind with bacterial plaque to form calculus (tartar). Once tartar hardens, no manual or electric toothbrush can remove it — attempting to scrape it at home can permanently damage your gums.

In this guide, Dr. Daniel Carter explains how ultrasonic scaling uses micro-vibrations and sterile water to gently dissolve calculus deposits beneath the gumline, preventing chronic bleeding and gum recession before permanent bone loss begins.$$,
   null, 'Preventative Care', '4 min read',
   'Dr. Daniel Carter', 'Lead Dental Specialist',
   'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80',
   '2026-03-28'),
  ('5-signs-you-need-root-canal',
   '5 Warning Signs You Might Need a Root Canal (Before It Becomes an Emergency)',
   $$የስር ቦይ ህክምና እንደሚያስፈልግዎ የሚያሳዩ 5 ምልክቶች$$,
   'Persistent throbbing pain, sudden sensitivity to hot coffee, and tender gums are your tooth’s SOS signals. Learn how early treatment preserves your tooth.',
   $$የማያቋርጥ የጥርስ ቁርጠት እና ለሙቀት ስሜት መኖር ጥርስዎን ለማዳን ፈጣን ምርመራ እንደሚያስፈልግዎ የሚያሳዩ ምልክቶች ናቸው።$$,
   $$A toothache that wakes you up in the middle of the night is rarely just a simple cavity. When decay reaches the nerve-rich dental pulp, pressure builds inside the rigid enamel walls.

Learn how modern endodontic therapy safely removes inflamed tissue without discomfort, sealing the canals permanently and preventing deep jawbone abscesses.$$,
   null, 'Endodontics', '5 min read',
   'Dr. Dawit Abebe', 'Endodontist Specialist',
   'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=200&q=80',
   '2026-03-14'),
  ('teeth-whitening-myths-vs-facts',
   'Teeth Whitening: 4 Common Myths Debunked by Dental Science',
   $$ስለ ጥርስ ማበጠር (Whitening) ያሉ የተሳሳቱ አመለካከቶች እና እውነታዎች$$,
   'Does teeth whitening ruin your enamel? Are charcoal pastes safe? Dr. Selamawit breaks down clinical facts about brightening your smile safely.',
   $$የጥርስ ማበጠር ኢናመልን ያበላሻል? የከሰል ዱቄት መጠቀም ደህንነቱ የተጠበቀ ነው? በሳይንሳዊ መረጃዎች የተደገፈ ማብራሪያ።$$,
   $$Social media is flooded with DIY teeth whitening hacks — from lemon juice and baking soda to abrasive charcoal powders. Unfortunately, many of these acid-heavy or gritty concoctions permanently erode your enamel.

Discover why clinical hydrogen peroxide in controlled pH environments is the only safe method to dissolve internal stains without thinning your tooth structure.$$,
   null, 'Cosmetic Dentistry', '3 min read',
   'Dr. Selamawit Tadesse', 'Aesthetic Dentist',
   'https://images.unsplash.com/photo-1594824813583-490333d02b54?auto=format&fit=crop&w=200&q=80',
   '2026-02-26')
on conflict (slug) do nothing;


-- ── sample bookings (demo rows for the admin dashboard) ──
insert into public.bookings
  (booking_ref, patient_name, phone, service_id, doctor_id, preferred_date, time_slot, notes, status)
values
  ('DEN-102931', 'Sara Alemu', '+251911223344', 'teeth-whitening', 'dr-selamawit-tadesse',
   current_date, '10:15 AM', 'First visit, preparing for graduation', 'pending'),
  ('DEN-102932', 'Abel Tesfaye', '+251922334455', 'checkup-cleaning', null,
   current_date, '11:30 AM', null, 'confirmed'),
  ('DEN-102933', 'Hanna Girma', '+251933445566', 'root-canal', 'dr-dawit-abebe',
   current_date + 1, '02:00 PM', 'Strong pain on lower right molar', 'pending')
on conflict (booking_ref) do nothing;


-- ─────────────────────────────────────────────────────────
-- VERIFY: you should see counts for every table
-- ─────────────────────────────────────────────────────────
select 'services' as table_name, count(*) from public.services
union all select 'doctors', count(*) from public.doctors
union all select 'testimonials', count(*) from public.testimonials
union all select 'blog_posts', count(*) from public.blog_posts
union all select 'bookings', count(*) from public.bookings
union all select 'clinic_settings', count(*) from public.clinic_settings;

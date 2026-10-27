# 🦷 Dentora → Supabase Integration Plan

**Project verdict:** beautiful, well-structured React 19 + TS + Vite + Tailwind 4
site, fully bilingual (English/Amharic). **100% frontend — zero backend calls
anywhere.** Perfect candidate for Supabase integration.

---

## 🔍 Key findings

| # | Finding | Integration impact |
|---|---|---|
| 1 | `BookingModal.tsx → handleSubmit` is **FAKE** — a `setTimeout(600ms)` that invents a random `DEN-XXXXXX` ref. No data leaves the browser. | 🎯 **This is integration point #1.** Replace 8 lines with a real `supabase.from('bookings').insert()`. UX stays untouched. |
| 2 | All content lives in **one hardcoded file**: `src/data/clinicData.ts` (516 lines) — settings, stats, 4 doctors, services, testimonials, blog posts, FAQs | Maps 1:1 to Supabase tables later (staff can then edit content from the admin panel) |
| 3 | `types/clinic.ts` defines clean interfaces | These become our **table schemas** — ClinicSettings, Doctor, ServiceItem, Testimonial, BlogPost |
| 4 | `AVAILABLE_SLOTS` in the modal is a hardcoded array | Later: real availability = calendar busy-slots − opening hours |
| 5 | AI chat (`ChatPanel`) is **local rule-based** keyword matching — the `@google/genai` dep and "SERVER_SIDE_GEMINI" metadata are NOT actually wired | Optional later: n8n webhook → Gemini for a real AI assistant |
| 6 | No auth, no admin, no API layer at all | We add `/login` + ProtectedRoute + `/admin` — React Router v7 makes this trivial |
| 7 | `public/_redirects` present → SPA-hosting ready (Netlify/Cloudflare) | Deployment already solved |
| 8 | Repo leftovers: package name "react-example", unused `express`/`tsx` deps, bun.lock, AI-Studio `.env.example` | Harmless; clean when shipping |

## 🗺️ The phased integration (each phase works standalone)

### Phase 1 — Real bookings (the money phase) 💰
```
BookingModal.handleSubmit
  before: setTimeout → fake DEN-XXXXXX
  after:  supabase.from('bookings').insert({ patient_name, phone, service_id,
          doctor_id, preferred_date, time_slot, notes, status: 'pending' })
          → booking ref = real DB row (DEN-<serial>)
Public RLS: INSERT allowed for anon ✅ | SELECT/UPDATE denied ❌
            (+ CAPTCHA later if spam arrives)
```
**Data captured will be exactly what the modal collects today** — no UI changes.

### Phase 2 — Admin zone 🔒 (builds on our auth lessons!)
```
/login  → Google OAuth button (staff's Google account) — providers already live
/admin  → ProtectedRoute:
            1. getSession()        → none? → /login
            2. email in allowlist? → no?   → "Not authorized"
            3. both pass           → supabase.from('bookings').select('*')
                                     .order('preferred_date')
Dashboard: today's list · pending queue · confirm/cancel buttons (UPDATE row)
```
Supabase dashboard: keep public email signups **OFF** (staff-only app here).

### Phase 3 — Content tables (staff self-service) 🛠️
Move `clinicData.ts` → tables: `services`, `doctors`, `testimonials`,
`blog_posts`, `clinic_settings` (single-row), `faqs`.
RLS: SELECT public ✅ / ALL admin-only ✏️.
Admin panel gains "Edit price / description" forms → site updates live.
*(Clinic data is small — this phase is optional polish, not required for launch.)*

### Phase 4 — Your n8n stack ⚡ (booking → calendar + notifications)
```
Supabase booking INSERT
   → (n8n Supabase Trigger / webhook)
   → Google Calendar: create event on clinic calendar
   → SMS/WhatsApp to patient ("የቀጠሮ ማረጋገጫ…")
   → optional: notify clinic Telegram group

Admin clicks "confirm" in panel
   → UPDATE status in Supabase
   → n8n webhook → calendar event updated + patient notified
```
Single source of truth stays **Supabase**; calendar becomes a synced mirror.

### Phase 5 — Optional upgrades
- Real slot availability = `clinic_settings.hours` − busy events (from calendar via n8n or a `busy_slots` table)
- Real Gemini chat via n8n webhook (replaces the local keyword responder)
- Auth Hook for `role: admin` claim when staff grows past the allowlist
- Attack Protection CAPTCHA on the public booking form if spam appears

## ✅ FINAL DB SCOPE (decided 2026-10-24)

**6 tables + 1 storage bucket:**
`bookings` (core) · `services` · `doctors` · `clinic_settings` (1 row: contact,
hours, + hero_title/_am, hero_subtitle/_am, hero_image_url + 5 stats) ·
`testimonials` · `blog_posts` · bucket `site-assets` (public).

Rule adopted: **DB holds records & editable fields; sentences stay in code.**
Never in DB: steps strip, section headings, t() labels, FAQs, legal, icons, routes.

RLS: content tables = public SELECT / admin-only write; bookings = public INSERT /
admin read+update. Existing text ids kept as PKs ('checkup-cleaning',
'dr-daniel-carter') so components survive unchanged. Amharic = `*_am` twin columns.

## Environment variables we'll add
```env
VITE_SUPABASE_URL=https://yklyowfcsnpljiqgyofj.supabase.co
VITE_SUPABASE_ANON_KEY=…
```
(Vite exposes only `VITE_*` vars to the browser — exactly what we want.)

**Suggested first build: Phase 1 + 2** — bookings into a real table + an admin
dashboard to see them. Everything else builds on that.

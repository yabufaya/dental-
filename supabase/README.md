# 🦷 Dentora — Supabase Setup (run these once, in order)

## 1 · Create the database

Supabase Dashboard → **SQL Editor** → New query →
**paste all of `supabase/schema.sql`** → Run.

> ⚠️ **First**, find this line near the top of schema.sql and put your real
> Google account email in it (the one you'll sign into /admin with):
> ```sql
> insert into public.admin_emails (email) values ('you@example.com')
> ```

At the bottom of the script there's a verify query —
you should see **services 8 · doctors 3 · testimonials 4 · blog_posts 3 · bookings 3 · settings 1**.

> 🔄 **Already ran an older schema before?** Don't wipe your data — run the small
> patch files instead (each is safe to run more than once):
> - `migration-002-map-embed.sql` — adds the `map_embed_url` column
> - `migration-003-social-links.sql` — adds `facebook_url`, `instagram_url`,
>   `linkedin_url`, `tiktok_url`, `youtube_url`, `x_url` (+ seeds FB/IG if empty)
> - `migration-004-realtime.sql` — makes public content live-update (realtime)
> - `migration-005-slot-engine.sql` — no double-booking (unique index) + the
>   safe `booked_slots` view the website reads for free slots
> - `migration-006-admin-realtime-bookings.sql` — new bookings pop into the
>   admin instantly, listeners restricted to your admin email allowlist
>
> SQL Editor → New query → paste one file → Run. Repeat for each.

## 2 · App environment

`.env.local` (already created — fill in):

```env
VITE_SUPABASE_URL=https://yklyowfcsnpljiqgyofj.supabase.co   # ✅ already filled
VITE_SUPABASE_ANON_KEY=…         # Dashboard → Settings → API → anon public
VITE_ADMIN_EMAILS=you@example.com   # ⛔ same email as admin_emails table!
```

Dev servers must be restarted after editing .env.local.

## 3 · Allow the login redirect

Dashboard → **Authentication → URL Configuration** → add to Redirect URLs:

```
http://localhost:3000/login
http://localhost:3001/login
https://your-real-domain.et/login      ← when you deploy
```

(Google provider is already enabled from earlier work — nothing to change there.)

## 4 · Lock down signups (important for a staff-only panel)

Dashboard → **Authentication → Sign In / Providers → Email** →
turn **OFF** "Allow new users to sign up". Patients never need accounts —
only admins log in, and only allowlisted emails get through.

## 5 · Test the whole loop

1. Public site → Book a visit → submit → ✅ success screen with `DEN-…` ref
2. Visit `/login` → sign in with the allowlisted Google account
3. `/admin` → Dashboard shows today + your new booking → click **Confirm**
4. `/admin/settings` → change the hero title → Save
5. Sign in with a **different** Google account → should be blocked ("Not authorized")
6. Open Supabase table `bookings` → try reading it in an incognito browser
   via the API docs — public read must be **denied** (RLS working)

## Files added for the admin app

```
src/lib/supabase.ts                  client + allowlist helper
src/context/AuthContext.tsx          session / isAdmin / signInWithGoogle / signOut
src/components/admin/ProtectedRoute.tsx   the 3-check guard
src/pages/LoginPage.tsx              staff Google login (route: /login)
src/pages/admin/AdminLayout.tsx      sidebar + topbar shell (route tree: /admin)
src/pages/admin/DashboardPage.tsx    today's schedule + live counts
src/pages/admin/BookingsPage.tsx     full booking management (filter/search/status/delete)
src/admin/resources.ts               field configs driving the generic editor
src/pages/admin/ResourcePage.tsx     generic CRUD for services/doctors/testimonials/blog
src/pages/admin/SettingsPage.tsx     single-row clinic_settings editor
```

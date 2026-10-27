import { createClient } from '@supabase/supabase-js';

/**
 * The ONE shared Supabase client for the whole app.
 *
 * Credential strategy (important and deliberate):
 *  • Local dev  : .env.local overrides (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)
 *  • Production : publishable constants below are baked in at build time.
 *    The publishable (anon) key is PUBLIC BY DESIGN — it ships to every
 *    visitor's browser regardless; security comes from RLS + admin_emails,
 *    not from hiding this string. To switch Supabase projects later, just
 *    edit the two constants and redeploy — no dashboard plumbing needed.
 */
const DEFAULT_URL = 'https://yklyowfcsnpljiqgyofj.supabase.co';
const DEFAULT_ANON_KEY = 'sb_publishable_ETy66hfc3gH-sAQziJ7SnQ_6-nRepHt';
const DEFAULT_ADMIN_EMAILS = 'yeabsirawithfate@gmail.com';

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? DEFAULT_URL;
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ?? DEFAULT_ANON_KEY;

export const envReady =
  !!url && !!anonKey && !url.includes('YOUR_') && !anonKey.includes('PASTE_');

if (!envReady) {
  console.warn(
    '⚠️  Supabase env vars missing. Create .env.local with ' +
      'VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY (see supabase/README.md).'
  );
}

export const supabase = createClient(url, anonKey, {
  auth: {
    flowType: 'pkce', // secure OAuth return handling (?code= exchange)
    persistSession: true, // keep staff logged in across reloads
    detectSessionInUrl: true, // finish OAuth automatically on /login return
    autoRefreshToken: true, // refresh the 1-hour JWT silently
  },
});

/** Staff allowlist — mirrors the admin_emails table (UX guard only;
 *  the REAL enforcement is the RLS policies using admin_emails). */
export const ADMIN_EMAILS: string[] = (
  ((import.meta.env.VITE_ADMIN_EMAILS as string) || DEFAULT_ADMIN_EMAILS)
)
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isAdminEmail(email?: string | null): boolean {
  return !!email && ADMIN_EMAILS.includes(email.toLowerCase());
}

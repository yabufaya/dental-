import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { ServiceItem, Doctor, Testimonial, BlogPost } from '../types/clinic';
import {
  services as fallbackServices,
  doctors as fallbackDoctors,
  testimonials as fallbackTestimonials,
  allBlogPosts as fallbackBlogPosts,
} from '../data/clinicData';

/**
 * ── Phase 1: fetch-on-load ────────────────────────────────────────────
 * Loads the public record tables (services / doctors / testimonials /
 * blog_posts) from Supabase once when the site opens. Each table falls
 * back to the bundled clinicData copy if its fetch fails (DB paused,
 * no env vars, offline…) — the site never renders empty by accident.
 *
 * Phase 2 will add Realtime subscriptions on top of this so updates
 * arrive live without reload. Phase 3 swaps the components' imports to
 * the hooks below.
 * ───────────────────────────────────────────────────────────────────────
 */

type Row = Record<string, unknown>;

const asStr = (v: unknown, fb = ''): string => (typeof v === 'string' ? v : fb);
const asNum = (v: unknown, fb = 0): number =>
  typeof v === 'number' && !Number.isNaN(v) ? v : fb;
const asBool = (v: unknown, fb = false): boolean => (typeof v === 'boolean' ? v : fb);
const asArr = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];

/** DB row (snake_case) → app type (camelCase) */
const mapService = (r: Row): ServiceItem => ({
  id: asStr(r.id),
  slug: asStr(r.slug),
  title: asStr(r.title),
  titleAm: typeof r.title_am === 'string' ? r.title_am : undefined,
  plainDesc: asStr(r.plain_desc),
  plainDescAm: typeof r.plain_desc_am === 'string' ? r.plain_desc_am : undefined,
  longDesc: asStr(r.long_desc),
  longDescAm: typeof r.long_desc_am === 'string' ? r.long_desc_am : undefined,
  priceFromETB: asNum(r.price_from_etb),
  durationMin: asNum(r.duration_min, 30),
  iconName: asStr(r.icon_name, 'Sparkles'),
  imageUrl: typeof r.image_url === 'string' ? r.image_url : undefined,
  isFeatured: asBool(r.is_featured),
  procedureSteps: asArr(r.procedure_steps),
  procedureStepsAm: Array.isArray(r.procedure_steps_am) ? asArr(r.procedure_steps_am) : undefined,
  whoNeedsIt: asStr(r.who_needs_it),
  whoNeedsItAm: typeof r.who_needs_it_am === 'string' ? r.who_needs_it_am : undefined,
  aftercare: asArr(r.aftercare),
  aftercareAm: Array.isArray(r.aftercare_am) ? asArr(r.aftercare_am) : undefined,
  faqs: Array.isArray(r.faqs) ? (r.faqs as ServiceItem['faqs']) : [],
});

const mapDoctor = (r: Row): Doctor => ({
  id: asStr(r.id),
  name: asStr(r.name),
  nameAm: typeof r.name_am === 'string' ? r.name_am : undefined,
  title: asStr(r.title),
  titleAm: typeof r.title_am === 'string' ? r.title_am : undefined,
  specialty: asStr(r.specialty),
  specialtyAm: typeof r.specialty_am === 'string' ? r.specialty_am : undefined,
  qualifications: asStr(r.qualifications),
  languages: asArr(r.languages),
  yearsExp: asNum(r.years_exp),
  rating: asNum(r.rating, 5),
  reviewCount: asNum(r.review_count),
  avatarUrl: asStr(r.avatar_url),
  bio: asStr(r.bio),
  bioAm: typeof r.bio_am === 'string' ? r.bio_am : undefined,
});

const mapTestimonial = (r: Row): Testimonial => ({
  id: asStr(r.id),
  patientName: asStr(r.patient_name),
  patientNameAm: typeof r.patient_name_am === 'string' ? r.patient_name_am : undefined,
  avatarUrl: typeof r.avatar_url === 'string' ? r.avatar_url : undefined,
  treatment: asStr(r.treatment),
  treatmentAm: typeof r.treatment_am === 'string' ? r.treatment_am : undefined,
  rating: asNum(r.rating, 5),
  quote: asStr(r.quote),
  quoteAm: typeof r.quote_am === 'string' ? r.quote_am : undefined,
  date: asStr(r.date_label),
  beforeUrl: typeof r.before_url === 'string' ? r.before_url : undefined,
  afterUrl: typeof r.after_url === 'string' ? r.after_url : undefined,
  beforeAfterAlt: typeof r.before_after_alt === 'string' ? r.before_after_alt : undefined,
  consent: asBool(r.consent),
});

const mapBlogPost = (r: Row): BlogPost => ({
  id: asStr(r.id),
  slug: asStr(r.slug),
  title: asStr(r.title),
  titleAm: typeof r.title_am === 'string' ? r.title_am : undefined,
  excerpt: asStr(r.excerpt),
  excerptAm: typeof r.excerpt_am === 'string' ? r.excerpt_am : undefined,
  content: asStr(r.content),
  contentAm: typeof r.content_am === 'string' ? r.content_am : undefined,
  category: asStr(r.category),
  readTime: asStr(r.read_time, '4 min read'),
  publishedAt: asStr(r.published_at),
  author: {
    name: asStr(r.author_name),
    role: asStr(r.author_role),
    avatar: asStr(r.author_avatar),
  },
});

interface DataState {
  services: ServiceItem[];
  doctors: Doctor[];
  testimonials: Testimonial[];
  blogPosts: BlogPost[];
  /** true once at least one table was served live from Supabase */
  live: boolean;
}

const INITIAL: DataState = {
  services: fallbackServices,
  doctors: fallbackDoctors,
  testimonials: fallbackTestimonials,
  blogPosts: fallbackBlogPosts,
  live: false,
};

const DataContext = createContext<DataState>(INITIAL);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<DataState>(INITIAL);

  // One fetcher per table — called on first load AND by Realtime on any change.
  // Each is independent: one table's failure never blanks the others.
  const refetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services').select('*')
        .eq('is_active', true).order('sort_order', { ascending: true });
      if (!error && data) {
        setState((p) => ({ ...p, services: (data as Row[]).map(mapService), live: true }));
      }
    } catch { /* offline → keep fallback/current */ }
  };

  const refetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors').select('*')
        .eq('is_active', true).order('sort_order', { ascending: true });
      if (!error && data) {
        setState((p) => ({ ...p, doctors: (data as Row[]).map(mapDoctor), live: true }));
      }
    } catch { /* offline */ }
  };

  const refetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials').select('*')
        .eq('is_published', true).order('sort_order', { ascending: true });
      if (!error && data) {
        setState((p) => ({ ...p, testimonials: (data as Row[]).map(mapTestimonial), live: true }));
      }
    } catch { /* offline */ }
  };

  const refetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts').select('*')
        .eq('is_published', true).order('published_at', { ascending: false });
      if (!error && data) {
        setState((p) => ({ ...p, blogPosts: (data as Row[]).map(mapBlogPost), live: true }));
      }
    } catch { /* offline */ }
  };

  // ── Phase 1: initial fetch on load ─────────────────────────────
  useEffect(() => {
    refetchServices();
    refetchDoctors();
    refetchTestimonials();
    refetchBlogPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Phase 2: Realtime ⚡ — any change in Supabase re-paints live ──
  // Requires migration-004-realtime.sql (tables registered with the
  // supabase_realtime publication). If it hasn't run yet, subscriptions
  // connect but simply receive nothing — the site keeps working as
  // "correct after reload".
  useEffect(() => {
    const channel = supabase
      .channel('public-content-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, refetchServices)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'doctors' }, refetchDoctors)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'testimonials' }, refetchTestimonials)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blog_posts' }, refetchBlogPosts)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <DataContext.Provider value={state}>{children}</DataContext.Provider>;
};

/** Live services list (active only) — falls back to bundled samples. */
export const useServices = (): ServiceItem[] => useContext(DataContext).services;
/** Live doctors list (active only). */
export const useDoctors = (): Doctor[] => useContext(DataContext).doctors;
/** Live testimonials (published only). */
export const useTestimonials = (): Testimonial[] => useContext(DataContext).testimonials;
/** Live blog posts (published only, newest first). */
export const useBlogPosts = (): BlogPost[] => useContext(DataContext).blogPosts;
/** Full data state incl. the `live` flag (for debugging/indicators). */
export const useData = (): DataState => useContext(DataContext);

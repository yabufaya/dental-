/**
 * Resource definitions — the generic admin CRUD engine (ResourcePage)
 * renders a full editor for each table purely from this config.
 *
 * Field types:
 *   text | textarea | number | checkbox | date
 *   lines → newline-separated ⇄ jsonb array of strings
 *   json  → raw JSON textarea (for structured data like service FAQs)
 *   image → text URL + live thumbnail preview
 */
export type FieldType =
  | 'text' | 'textarea' | 'number' | 'checkbox' | 'date' | 'lines' | 'json' | 'image';

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  full?: boolean; // span both columns in the form grid
  hint?: string;
}

export interface ResourceDef {
  table: string;
  title: string;
  idKey: string;
  idEditableOnCreate: boolean; // services/doctors use human text ids
  orderBy: { column: string; ascending: boolean };
  listCols: { key: string; label: string }[];
  fields: FieldDef[];
  defaultNew: Record<string, unknown>;
}

export const resources: Record<string, ResourceDef> = {
  services: {
    table: 'services',
    title: 'Services & Pricing',
    idKey: 'id',
    idEditableOnCreate: true,
    orderBy: { column: 'sort_order', ascending: true },
    listCols: [
      { key: 'title', label: 'Service' },
      { key: 'price_from_etb', label: 'From (ETB)' },
      { key: 'duration_min', label: 'Min' },
      { key: 'is_featured', label: 'Featured' },
      { key: 'is_active', label: 'Active' },
    ],
    defaultNew: {
      title: '', is_featured: false, is_active: true, sort_order: 99,
      price_from_etb: 0, duration_min: 30, icon_name: 'Sparkles',
      procedure_steps: [], aftercare: [], faqs: [],
    },
    fields: [
      { key: 'id', label: 'ID (unique, no spaces)', type: 'text', required: true, hint: 'e.g. root-canal' },
      { key: 'slug', label: 'URL slug', type: 'text', required: true, hint: 'e.g. root-canal-therapy' },
      { key: 'title', label: 'Title (EN)', type: 'text', required: true },
      { key: 'title_am', label: 'Title (AM) 🇪🇹', type: 'text' },
      { key: 'price_from_etb', label: 'Starting price (ETB)', type: 'number', required: true },
      { key: 'duration_min', label: 'Duration (min)', type: 'number' },
      { key: 'icon_name', label: 'Icon name', type: 'text', hint: 'lucide: Sparkles, ShieldCheck, Activity, Sun, Layers, Smile, Heart, AlertCircle' },
      { key: 'sort_order', label: 'Sort order', type: 'number' },
      { key: 'is_featured', label: 'Featured (hero chips)', type: 'checkbox' },
      { key: 'is_active', label: 'Active (visible on site)', type: 'checkbox' },
      { key: 'image_url', label: 'Image URL', type: 'image', full: true },
      { key: 'plain_desc', label: 'Short description (EN)', type: 'textarea', full: true },
      { key: 'plain_desc_am', label: 'Short description (AM) 🇪🇹', type: 'textarea', full: true },
      { key: 'long_desc', label: 'Long description (EN)', type: 'textarea', full: true },
      { key: 'long_desc_am', label: 'Long description (AM) 🇪🇹', type: 'textarea', full: true },
      { key: 'who_needs_it', label: 'Who needs it (EN)', type: 'textarea', full: true },
      { key: 'who_needs_it_am', label: 'Who needs it (AM) 🇪🇹', type: 'textarea', full: true },
      { key: 'procedure_steps', label: 'Procedure steps (one per line)', type: 'lines', full: true },
      { key: 'procedure_steps_am', label: 'Procedure steps (AM, one per line) 🇪🇹', type: 'lines', full: true },
      { key: 'aftercare', label: 'Aftercare (one per line)', type: 'lines', full: true },
      { key: 'aftercare_am', label: 'Aftercare (AM, one per line) 🇪🇹', type: 'lines', full: true },
      { key: 'faqs', label: 'FAQs (JSON)', type: 'json', full: true, hint: '[{"q":"…","a":"…","qAm":"…","aAm":"…"}]' },
    ],
  },

  doctors: {
    table: 'doctors',
    title: 'Doctors',
    idKey: 'id',
    idEditableOnCreate: true,
    orderBy: { column: 'sort_order', ascending: true },
    listCols: [
      { key: 'name', label: 'Doctor' },
      { key: 'specialty', label: 'Specialty' },
      { key: 'years_exp', label: 'Yrs' },
      { key: 'rating', label: 'Rating' },
      { key: 'is_active', label: 'Active' },
    ],
    defaultNew: { name: '', languages: [], is_active: true, sort_order: 99, rating: 5, years_exp: 0, review_count: 0 },
    fields: [
      { key: 'id', label: 'ID (unique, no spaces)', type: 'text', required: true, hint: 'e.g. dr-hanna-kebede' },
      { key: 'name', label: 'Full name (EN)', type: 'text', required: true },
      { key: 'name_am', label: 'Full name (AM) 🇪🇹', type: 'text' },
      { key: 'title', label: 'Job title (EN)', type: 'text' },
      { key: 'title_am', label: 'Job title (AM) 🇪🇹', type: 'text' },
      { key: 'specialty', label: 'Specialty (EN)', type: 'text' },
      { key: 'specialty_am', label: 'Specialty (AM) 🇪🇹', type: 'text' },
      { key: 'qualifications', label: 'Qualifications', type: 'text', full: true },
      { key: 'languages', label: 'Languages (one per line)', type: 'lines', full: true },
      { key: 'years_exp', label: 'Years of experience', type: 'number' },
      { key: 'rating', label: 'Rating (0–5)', type: 'number' },
      { key: 'review_count', label: 'Review count', type: 'number' },
      { key: 'sort_order', label: 'Sort order', type: 'number' },
      { key: 'avatar_url', label: 'Avatar image URL', type: 'image', full: true },
      { key: 'bio', label: 'Bio (EN)', type: 'textarea', full: true },
      { key: 'bio_am', label: 'Bio (AM) 🇪🇹', type: 'textarea', full: true },
      { key: 'is_active', label: 'Active (visible on site)', type: 'checkbox' },
    ],
  },

  testimonials: {
    table: 'testimonials',
    title: 'Testimonials',
    idKey: 'id',
    idEditableOnCreate: false,
    orderBy: { column: 'sort_order', ascending: true },
    listCols: [
      { key: 'patient_name', label: 'Patient' },
      { key: 'treatment', label: 'Treatment' },
      { key: 'rating', label: '★' },
      { key: 'consent', label: 'Consent' },
      { key: 'is_published', label: 'Published' },
    ],
    defaultNew: { rating: 5, consent: false, is_published: true, sort_order: 99 },
    fields: [
      { key: 'patient_name', label: 'Patient name (EN)', type: 'text', required: true, hint: 'e.g. Bethlehem T.' },
      { key: 'patient_name_am', label: 'Patient name (AM) 🇪🇹', type: 'text' },
      { key: 'treatment', label: 'Treatment received (EN)', type: 'text' },
      { key: 'treatment_am', label: 'Treatment (AM) 🇪🇹', type: 'text' },
      { key: 'rating', label: 'Rating (1–5)', type: 'number' },
      { key: 'date_label', label: 'Date label', type: 'text', hint: 'e.g. May 2026' },
      { key: 'avatar_url', label: 'Avatar URL', type: 'image', full: true },
      { key: 'quote', label: 'Quote (EN)', type: 'textarea', required: true, full: true },
      { key: 'quote_am', label: 'Quote (AM) 🇪🇹', type: 'textarea', full: true },
      { key: 'before_url', label: 'Before photo URL', type: 'image' },
      { key: 'after_url', label: 'After photo URL', type: 'image' },
      { key: 'before_after_alt', label: 'Before/After alt text', type: 'text', full: true },
      { key: 'consent', label: 'Written patient consent obtained', type: 'checkbox' },
      { key: 'is_published', label: 'Published on website', type: 'checkbox' },
      { key: 'sort_order', label: 'Sort order', type: 'number' },
    ],
  },

  blog: {
    table: 'blog_posts',
    title: 'Blog Posts',
    idKey: 'id',
    idEditableOnCreate: false,
    orderBy: { column: 'published_at', ascending: false },
    listCols: [
      { key: 'title', label: 'Title' },
      { key: 'category', label: 'Category' },
      { key: 'published_at', label: 'Published' },
      { key: 'is_published', label: 'Live' },
    ],
    defaultNew: { is_published: true, read_time: '4 min read' },
    fields: [
      { key: 'slug', label: 'URL slug', type: 'text', required: true, hint: 'e.g. gum-care-guide' },
      { key: 'title', label: 'Title (EN)', type: 'text', required: true },
      { key: 'title_am', label: 'Title (AM) 🇪🇹', type: 'text' },
      { key: 'category', label: 'Category', type: 'text' },
      { key: 'read_time', label: 'Read time', type: 'text', hint: 'e.g. 4 min read' },
      { key: 'published_at', label: 'Publish date', type: 'date' },
      { key: 'is_published', label: 'Live on website', type: 'checkbox' },
      { key: 'cover_url', label: 'Cover image URL', type: 'image', full: true },
      { key: 'excerpt', label: 'Excerpt / teaser (EN)', type: 'textarea', full: true },
      { key: 'excerpt_am', label: 'Excerpt (AM) 🇪🇹', type: 'textarea', full: true },
      { key: 'content', label: 'Article body (EN)', type: 'textarea', required: true, full: true },
      { key: 'content_am', label: 'Article body (AM) 🇪🇹', type: 'textarea', full: true },
      { key: 'author_name', label: 'Author name', type: 'text' },
      { key: 'author_role', label: 'Author role', type: 'text' },
      { key: 'author_avatar', label: 'Author avatar URL', type: 'image', full: true },
    ],
  },
};

/** Site Settings page (singleton row id=1): branding, hero, trust numbers, about facts. */
export const coreSettingsFields: FieldDef[] = [
  { key: 'hero_title', label: '⭐ Hero title (EN)', type: 'text', full: true },
  { key: 'hero_title_am', label: '⭐ Hero title (AM) 🇪🇹', type: 'text', full: true },
  { key: 'hero_subtitle', label: '⭐ Hero subtitle (EN)', type: 'textarea', full: true },
  { key: 'hero_subtitle_am', label: '⭐ Hero subtitle (AM) 🇪🇹', type: 'textarea', full: true },
  { key: 'hero_image_url', label: '⭐ Hero image URL', type: 'image', full: true },
  { key: 'name', label: 'Clinic name (EN)', type: 'text' },
  { key: 'name_am', label: 'Clinic name (AM) 🇪🇹', type: 'text' },
  { key: 'slogan', label: 'Slogan (EN)', type: 'text', full: true },
  { key: 'slogan_am', label: 'Slogan (AM) 🇪🇹', type: 'text', full: true },
  { key: 'slogan_sub', label: 'Slogan sub-line (EN)', type: 'text', full: true },
  { key: 'slogan_sub_am', label: 'Slogan sub-line (AM) 🇪🇹', type: 'text', full: true },
  { key: 'registration_number', label: 'MOH registration no.', type: 'text' },
  { key: 'satisfaction_rate', label: 'Satisfaction rate %', type: 'number' },
  { key: 'smiles_transformed', label: 'Smiles transformed', type: 'number' },
  { key: 'patient_rating', label: 'Patient rating (0–5)', type: 'number' },
  { key: 'years_experience', label: 'Years experience', type: 'number' },
  { key: 'specialist_count', label: 'Specialist count', type: 'number' },
  { key: 'payment_methods', label: 'Payment methods (one per line)', type: 'lines', full: true },
  { key: 'accessibility', label: 'Accessibility features (one per line)', type: 'lines', full: true },
];

/** Contact Info page (same singleton row): phones, socials, address, hours, map. */
export const contactSettingsFields: FieldDef[] = [
  { key: 'phone', label: 'Main phone', type: 'text' },
  { key: 'emergency_phone', label: 'Emergency phone', type: 'text' },
  { key: 'whatsapp', label: 'WhatsApp number (digits only)', type: 'text', hint: 'e.g. 251911234567 — with country code, no +' },
  { key: 'telegram', label: 'Telegram username', type: 'text', hint: 'No @ sign' },
  { key: 'email', label: 'Email', type: 'text' },
  { key: 'address', label: 'Address (EN)', type: 'textarea', full: true },
  { key: 'address_am', label: 'Address (AM) 🇪🇹', type: 'textarea', full: true },
  { key: 'landmark', label: 'Landmark directions (EN)', type: 'textarea', full: true },
  { key: 'landmark_am', label: 'Landmark (AM) 🇪🇹', type: 'textarea', full: true },
  { key: 'map_embed_url', label: '🗺️ Map embed URL', type: 'text', full: true,
    hint: 'Google Maps → Share → Embed a map → paste ONLY the src="…" URL here.' },
  { key: 'facebook_url', label: 'Facebook page URL', type: 'text', full: true, hint: 'https://facebook.com/yourpage — leave empty to hide' },
  { key: 'instagram_url', label: 'Instagram profile URL', type: 'text', full: true, hint: 'https://instagram.com/yourpage' },
  { key: 'linkedin_url', label: 'LinkedIn page URL', type: 'text', full: true, hint: 'https://linkedin.com/company/yourpage' },
  { key: 'tiktok_url', label: 'TikTok profile URL', type: 'text', full: true, hint: 'https://tiktok.com/@yourpage' },
  { key: 'youtube_url', label: 'YouTube channel URL', type: 'text', full: true, hint: 'https://youtube.com/@yourchannel' },
  { key: 'x_url', label: 'X (Twitter) profile URL', type: 'text', full: true, hint: 'https://x.com/yourpage' },
];

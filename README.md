# Dentora Dental Clinic Website

A production-grade, patient-centered dental clinic web application designed around the **Dentora visual reference** and built strictly to the specifications of:
- **File 01**: Universal Business Website Laws
- **File 02**: Dental Clinic Structure and Fulfillment
- **File 03**: Interactive & "Soulful" Features (Advanced React Guide)

---

## 1. Overview & Psychological Flow
Within 5 seconds, a visitor knows: *"Yes, this is the right place for my teeth."* The homepage follows the exact sequence of questions in a nervous patient's mind:

1. **Hero**: *"You are in the right place."* — Inset rounded card, outcome-focused slogan, primary *Book a visit* CTA, secondary quiet WhatsApp action, glass trust badge (4.9★ rating), and 3 featured service chips.
2. **Steps Strip (How It Works)**: *"It is easy and gentle."* — 4 plain steps (*Smile Assessment, Care Planning, Treatment Process, Dental Maintenance*) with a smooth drawn connector line.
3. **Our Services**: *"We do what you need."* — Clear, plain-language descriptions without medical jargon, starting prices in ETB, estimated procedure times, and links to detailed procedure guides.
4. **About Us + Trust Numbers**: *"Many people trust us."* — Real clinic photography, doctor avatars, and **binary-to-decimal animated counters** that compute in binary (0–80%) and settle accurately on the final decimal value.
5. **Our Experts (Doctors)**: *"Real, qualified people will treat you."* — Verified credentials, languages (*English, Amharic, Afaan Oromoo*), specialties, and direct "Book with Dr. X" actions.
6. **Happy Smiles (Testimonials)**: *"People like you were happy. See the results."* — Real patient quotes with an interactive **Before/After draggable slider** (works on touch, mouse, and keyboard; with written patient consent and a "Results vary" line; manual carousel with no autoplay).
7. **From Our Blog**: *"We care and we teach."* — Homepage displays **only the latest article** with read time, author byline, and full article navigation.
8. **Ask Us Anything (AI Knowledge Assistant)**: *"Ask a question without feeling shy."* — Dark navy band with ambient water-ripple glow, quick-reply chips, instant knowledge answers regarding pricing, pain, and hours, with medical safety disclaimers.
9. **Visit Us (Contact & Map)**: *"Here is exactly where we are."* — Two-column layout featuring landmark directions in Bole (*next to Morning Star Mall, opposite Edna Mall*), phone, WhatsApp, Telegram, email, live Addis Ababa *"Open now"* status, emergency line, parking & elevator access, Ethiopian payment methods (*Telebirr, CBE Birr, Cash*), and a **Google-Maps-style card** with a place card and *Get directions* button that opens phone GPS navigation.
10. **Footer**: Clean, quiet navigation with MOH license registration, emergency hotline, and back-to-top control.

---

## 2. Key Interactive & "Soulful" Features

### A. Binary-to-Decimal Animated Counters (`CountUp.tsx`)
- Phase 1 (0 to 80%): Counts in binary string with accent color and tabular monospace numerals.
- Phase 2 (80 to 100%): Seamlessly eases into decimal representation.
- Respects `prefers-reduced-motion` (instant final value). Screen readers receive the clean final number via `.sr-only`.

### B. Before/After Interactive Comparison Slider (`BeforeAfter.tsx`)
- Transparent native range slider input overlay enabling keyboard arrow keys, mouse dragging, and touch swiping.
- `clip-path: inset(0 calc(100% - var(--pos)) 0 0)` revealing the "Before" photo over the "After" photo.
- Draggable handle badge, Before/After badges, and disclaimer note.

### C. Floating AI Chat Launcher with Water-Wave Pulse (`ChatLauncher.tsx` & `ChatPanel.tsx`)
- 3 expanding concentric water ripples (`wave-ripple`).
- Friendly speech bubble hint *"Talk to our AI assistant 👋"* appearing after 3.5 seconds.
- Knowledge base retrieval for Ethiopian prices in ETB, root canal comfort, hours, and emergency triage.
- Urgent keyword detection that immediately escalates to the 24/7 emergency hotline.

### D. Google-Maps-Style Card with Real-Time "Open Now" (`ContactMap.tsx` & `hours.ts`)
- Embedded interactive map with a tap-to-use overlay on mobile to prevent trapping page scroll.
- Floating place card on top-left displaying clinic name, landmark, live Addis Ababa open status (`Intl.DateTimeFormat` with `Africa/Addis_Ababa` timezone), and a single *Get directions* button opening Google Maps.

### E. Standardized Section Openers (`SectionOpener.tsx`)
- Each section opens with its distinct colored label pill (dark text for WCAG AA contrast), two-tone heading, one promise line, and an SVG wave divider.
- The primary action button remains the clinic's signature teal (`#2ba8c9`) across all sections.

### F. Bilingual Support (English & Amharic / አማርኛ)
- One-tap toggle in the header allowing immediate switching between English and Amharic for all headings, descriptions, and booking steps.

---

## 3. Technology Stack

- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS v4 + custom CSS custom properties (tokens)
- **Icons**: Lucide React
- **Routing**: React Router DOM v7 with custom `ScrollManager` (top on PUSH, restore on POP, scroll-margin for sticky header)
- **Accessibility**: WCAG AA compliant contrast, keyboard operable sliders and modals, screen reader text, and `prefers-reduced-motion` support.

---

## 4. Ethiopian Market Context

- **Payment Methods Supported**: Telebirr, CBE Birr, commercial bank transfers (CBE, Awash, Dashen), cash, and local private insurance.
- **Landmark-Based Directions**: Bole Medhanialem, Edna Mall Road, next to Morning Star Mall, 2nd floor, Suite 204.
- **Communication Channels**: Direct phone call, WhatsApp (`wa.me`), Telegram (`t.me`), and emergency hotline.
- **Performance Budget**: Lazy-loaded below-the-fold components (`LazySection`), fast asset delivery, and zero layout shift.

import React from 'react';
import { ArrowRight, Phone, Star, Sparkles, MessageCircle, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useBooking } from '../../context/BookingContext';
import { useSettings } from '../../context/SettingsContext';
import { useServices } from '../../context/DataContext';

export const Hero: React.FC = () => {
  const clinicSettings = useSettings();
  const services = useServices(); // featured chips
  const { language, t } = useLanguage();
  const { openBooking } = useBooking();

  // Featured chips (max 3 as requested in Dentora layout)
  const featuredChips = services.filter((s) => s.isFeatured).slice(0, 3);

  return (
    <section className="pt-24 pb-12 sm:pt-28 sm:pb-16 px-3 sm:px-6 max-w-7xl mx-auto">
      {/* Inset Rounded Card Container matching the Dentora visual reference */}
      <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden min-h-[580px] sm:min-h-[640px] flex flex-col justify-between p-6 sm:p-12 lg:p-16 shadow-2xl border border-slate-200/60 bg-slate-900 text-white">
        {/* Background Image with Dark Soft Gradient Overlay for pristine contrast */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero.jpg"
            alt="Family-Friendly Dental Care at Dentora"
            fetchPriority="high"
            className="w-full h-full object-cover object-center filter brightness-[0.78] contrast-[1.05]"
          />
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/30" />
        </div>

        {/* Top-Left Content: Headline, Slogan & Actions */}
        <div className="relative z-10 max-w-2xl mt-4 sm:mt-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide text-white mb-4 sm:mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#2ba8c9]" />
            <span>{t('Modern, Gentle & Painless Care', 'ዘመናዊ፣ የዋህ እና ህመም አልባ እንክብካቤ')}</span>
          </div>

          {/* Headline (second line slightly indented as in Dentora reference) */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15] sm:leading-[1.12]">
            <span>{t('Family-Friendly', 'ለቤተሰብ ተስማሚ')}</span>
            <span className="block sm:pl-4 text-[#2ba8c9] font-medium">
              {t('Dental Care', 'የጥርስ ሕክምና')}
            </span>
          </h1>

          {/* Subtext */}
          <p className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-slate-200/90 leading-relaxed max-w-xl font-normal">
            {t(
              clinicSettings.sloganSub,
              clinicSettings.sloganSubAm
            )}
          </p>

          {/* CTAs: Primary "Book a visit" + Secondary Call / WhatsApp (Quiet text link) */}
          <div className="mt-7 sm:mt-9 flex flex-wrap items-center gap-4">
            <button
              onClick={() => openBooking()}
              className="inline-flex items-center gap-3 px-6 sm:px-7 py-3.5 sm:py-4 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm sm:text-base shadow-xl transition-all hover:scale-105 active:scale-95 group focus-visible:outline-2 focus-visible:outline-white"
            >
              <span>{t('Book an Appointment', 'ቀጠሮ ይያዙ')}</span>
              <span className="w-7 h-7 rounded-full bg-[#2ba8c9] text-slate-950 flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>

            <a
              href={`https://wa.me/${clinicSettings.whatsapp}?text=Hello%20Dentora%20Clinic,%20I%20would%20like%20to%20inquire%20about%20dental%20care.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-white/90 hover:text-[#2ba8c9] py-2 px-3 rounded-full hover:bg-white/10 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>{t('Chat on WhatsApp', 'በዋትስአፕ ያናግሩን')}</span>
            </a>
          </div>
        </div>

        {/* Bottom Area: Left Glass Trust Card + Right Featured Chips */}
        <div className="relative z-10 pt-8 sm:pt-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          {/* Bottom-Left Glass Trust Card */}
          <div className="glass-panel text-slate-900 rounded-2xl p-3.5 sm:p-4 max-w-sm flex items-center gap-3.5 shadow-xl border border-white/60 animate-in fade-in slide-in-from-bottom-8 duration-900">
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80"
                alt="Dr. Daniel Carter"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 line-clamp-2 leading-tight">
                {t(
                  'Restore natural healthy confident dental growth.',
                  'ተፈጥሯዊና ማራኪ ፈገግታን በዘላቂነት ማግኘት።'
                )}
              </p>
              <div className="mt-1 flex items-center gap-2 text-[11px] font-bold text-slate-700">
                <span className="flex items-center gap-0.5 text-amber-500">
                  <Star className="w-3 h-3 fill-amber-500" />
                  <span>4.9</span>
                </span>
                <span className="text-slate-400 font-normal">[Rating]</span>
                <button
                  onClick={() => openBooking()}
                  className="ml-auto text-[#1c88a6] hover:underline flex items-center gap-0.5"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom-Right Featured Service Chips (Max 3) */}
          <div className="flex flex-wrap items-center gap-2 md:justify-end">
            {featuredChips.map((chip) => (
              <button
                key={chip.id}
                onClick={() => openBooking(chip.id)}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-105 active:scale-95"
              >
                {language === 'am' && chip.titleAm ? chip.titleAm : chip.title}
              </button>
            ))}
          </div>
        </div>

        {/* Microcopy footer inside hero */}
        <div className="relative z-10 pt-4 flex items-center justify-between text-[11px] text-slate-400 border-t border-white/10 mt-4">
          <span>{t('Your Teeth · Our Science', 'የጥርስዎ ጤና · የእኛ ሳይንስ')}</span>
          <span className="hidden sm:inline">{t('Scroll for More ↓', 'ለተጨማሪ ወደ ታች ይሸብልሉ ↓')}</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;

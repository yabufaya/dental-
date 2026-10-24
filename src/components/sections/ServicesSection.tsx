import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Sparkles, Shield, Activity, Sun, Layers, Smile, Heart, AlertCircle, CheckCircle2 } from 'lucide-react';
import SectionOpener from '../ui/SectionOpener';
import Reveal from '../motion/Reveal';
import { useLanguage } from '../../context/LanguageContext';
import { useBooking } from '../../context/BookingContext';
import { services } from '../../data/clinicData';

const ICONS_MAP: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-4 h-4 text-[#2ba8c9]" />,
  ShieldCheck: <Shield className="w-4 h-4 text-[#2ba8c9]" />,
  Activity: <Activity className="w-4 h-4 text-[#2ba8c9]" />,
  Sun: <Sun className="w-4 h-4 text-[#2ba8c9]" />,
  Layers: <Layers className="w-4 h-4 text-[#2ba8c9]" />,
  Smile: <Smile className="w-4 h-4 text-[#2ba8c9]" />,
  Heart: <Heart className="w-4 h-4 text-[#2ba8c9]" />,
  AlertCircle: <AlertCircle className="w-4 h-4 text-rose-500" />,
};

export const ServicesSection: React.FC = () => {
  const { language, t } = useLanguage();
  const { openBooking } = useBooking();

  return (
    <SectionOpener
      id="services"
      tone="services"
      from="#fff8ea"
      label={t('Our Services', 'አገልግሎቶቻችን')}
      title={t('Comprehensive Dental Care for', 'ለሁለንተናዊ የጥርስ ጤንነት የሚሆኑ')}
      titleSoft={t('Every Stage of Your Smile.', 'የተሟሉ ዘመናዊ ህክምናዎች።')}
      promise={t('From routine preventive cleanings to advanced dental implants, every treatment is visualized with transparent ETB pricing and estimated procedure times.', 'ከመደበኛ ምርመራ እስከ ውስብስብ የጥርስ ተከላ ድረስ ሁሉንም በግልጽ ምስል፣ ማብራሪያና በተመጣጣኝ ዋጋ እንሰጣለን።')}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {services.map((s, idx) => (
          <Reveal key={s.id} variant="up" delay={idx * 60}>
            {/* Modern Interactive Card with Hover Scale Up */}
            <div className="group h-full flex flex-col justify-between bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-2xl hover:scale-[1.025] hover:-translate-y-1.5 transition-all duration-300 ease-out cursor-pointer">
              {/* Visualized Treatment Photo with Subtle Zoom & Glass Badges */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={s.imageUrl || 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=700&q=80'}
                  alt={s.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                />
                {/* Soft gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/20 to-transparent" />

                {/* Floating duration badge top-right */}
                <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-[11px] font-semibold text-slate-800 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-xs border border-white/60">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>~{s.durationMin} mins</span>
                </span>

                {/* Icon Pill Badge top-left */}
                <span className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-xs border border-white/60">
                  {ICONS_MAP[s.iconName] || <Sparkles className="w-4 h-4 text-[#2ba8c9]" />}
                </span>

                {/* Price starting from over the photo */}
                <div className="absolute bottom-3 left-3 text-white">
                  <span className="text-[10px] uppercase font-bold text-slate-200 tracking-wider block">
                    {t('Starting from', 'መነሻ ክፍያ')}
                  </span>
                  <span className="text-base font-extrabold text-white tabular-nums drop-shadow-xs">
                    {s.priceFromETB.toLocaleString()} ETB
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-[#1c88a6] transition-colors mb-2 leading-snug">
                    <Link to={`/services/${s.slug}`}>
                      {language === 'am' && s.titleAm ? s.titleAm : s.title}
                    </Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2">
                    {language === 'am' && s.plainDescAm ? s.plainDescAm : s.plainDesc}
                  </p>

                  {/* Highlights preview */}
                  <div className="space-y-1.5 mb-5 text-xs text-slate-500">
                    {s.procedureSteps.slice(0, 2).map((step, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price & Action Row */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/services/${s.slug}`}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-950 py-1.5 px-2 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    {t('View Details →', 'ዝርዝር ይመልከቱ →')}
                  </Link>

                  <button
                    onClick={() => openBooking(s.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full bg-[#2ba8c9] hover:bg-[#1c88a6] text-slate-950 transition-all hover:scale-105 active:scale-95 shadow-sm"
                  >
                    <span>{t('Book a visit', 'ቀጠሮ ይያዙ')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Bottom Link to Full Services Catalog */}
      <div className="mt-10 text-center">
        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#1c88a6] hover:underline"
        >
          <span>{t('Explore full procedures & aftercare catalog →', 'ሁሉንም አገልግሎቶችና የድህረ-ህክምና መመሪያዎችን ይመልከቱ →')}</span>
        </Link>
      </div>
    </SectionOpener>
  );
};

export default ServicesSection;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import Reveal from '../components/motion/Reveal';
import { useLanguage } from '../context/LanguageContext';
import { useBooking } from '../context/BookingContext';
import { useServices } from '../context/DataContext';

export const ServicesPage: React.FC = () => {
  const services = useServices();
  const { language, t } = useLanguage();
  const { openBooking } = useBooking();
  const [filter, setFilter] = useState<'all' | 'featured' | 'restorative'>('all');

  const filteredServices = services.filter((s) => {
    if (filter === 'featured') return s.isFeatured;
    if (filter === 'restorative') return s.id === 'root-canal' || s.id === 'dental-implants' || s.id === 'tooth-filling';
    return true;
  });

  return (
    <main className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="max-w-3xl mb-12">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#e3f4f9] text-[#1c88a6] mb-3">
          {t('Dental Treatments Catalog', 'የጥርስ ህክምና ካታሎግ')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {t('Gentle, Evidence-Based Dental Care', 'የተሟሉና ዘመናዊ የጥርስ አገልግሎቶች')}
        </h1>
        <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          {t(
            'Explore our full spectrum of restorative, preventative, and cosmetic dental treatments with transparent ETB pricing and estimated procedure times.',
            'ስለ እያንዳንዱ የህክምና አይነት፣ ስለሚወስደው ጊዜና ስለ መነሻ ዋጋው የተሟላ መረጃ ያግኙ።'
          )}
        </p>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mt-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-[#2ba8c9] text-slate-950 shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t('All Treatments', 'ሁሉም')} ({services.length})
          </button>
          <button
            onClick={() => setFilter('featured')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              filter === 'featured'
                ? 'bg-[#2ba8c9] text-slate-950 shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t('Most Popular', 'ተወዳጅ')}
          </button>
          <button
            onClick={() => setFilter('restorative')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              filter === 'restorative'
                ? 'bg-[#2ba8c9] text-slate-950 shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t('Tooth-Saving & Restorations', 'የተጎዳ ጥርስ ማዳን')}
          </button>
        </div>
      </div>

      {/* Services Grid with Visual Imagery and Hover Scale */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredServices.map((s, idx) => (
          <Reveal key={s.id} variant="up" delay={idx * 60}>
            <div className="group h-full bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-2xl hover:scale-[1.025] hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col justify-between cursor-pointer">
              {/* Visualized Treatment Photo */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={s.imageUrl || 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=700&q=80'}
                  alt={s.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/20 to-transparent" />

                <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-[11px] font-semibold text-slate-800 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-xs border border-white/60">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>~{s.durationMin} mins</span>
                </span>

                <div className="absolute bottom-3 left-3 text-white">
                  <span className="text-[10px] uppercase font-bold text-slate-200 tracking-wider block">
                    {t('Starting from', 'መነሻ ክፍያ')}
                  </span>
                  <span className="text-base font-extrabold text-white tabular-nums drop-shadow-xs">
                    {s.priceFromETB.toLocaleString()} ETB
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="font-bold text-lg sm:text-xl text-slate-900 group-hover:text-[#1c88a6] transition-colors mb-2 leading-snug">
                    <Link to={`/services/${s.slug}`}>
                      {language === 'am' && s.titleAm ? s.titleAm : s.title}
                    </Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2">
                    {language === 'am' && s.plainDescAm ? s.plainDescAm : s.plainDesc}
                  </p>

                  <div className="space-y-1.5 mb-5 text-xs text-slate-500">
                    {s.procedureSteps.slice(0, 2).map((step, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/services/${s.slug}`}
                    className="text-xs font-semibold text-slate-700 hover:text-slate-950 py-1.5 px-3 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    {t('Details', 'ዝርዝር')}
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
    </main>
  );
};

export default ServicesPage;

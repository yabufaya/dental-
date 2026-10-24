import React from 'react';
import { ShieldCheck, Heart, Sparkles, Award, CheckCircle2 } from 'lucide-react';
import Reveal from '../components/motion/Reveal';
import { useLanguage } from '../context/LanguageContext';
import { useBooking } from '../context/BookingContext';
import { clinicStats, clinicSettings } from '../data/clinicData';

export const AboutPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { openBooking } = useBooking();

  return (
    <main className="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 space-y-16">
      {/* Intro Header */}
      <div className="max-w-3xl">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#e6f8f2] text-[#3cc8a0] mb-3">
          {t('Our Story & Philosophy', 'ታሪካችንና መርሆቻችን')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {t('A Dental Practice Built on Compassion and Science', 'በደግነት እና በዘመናዊ ሳይንስ የተገነባ የጥርስ ክሊኒክ')}
        </h1>
        <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
          {t(
            'Founded in Addis Ababa with a single mission: to eliminate dental fear and deliver world-standard, long-lasting oral healthcare to families across Ethiopia.',
            'የህሙማንን ፍርሃት በማስወገድ በአለም አቀፍ ደረጃ የተመሰከረለትን የጥርስ ህክምና ለቤተሰብ ተደራሽ ማድረግ የዴንቶራ ዋና ዓላማ ነው።'
          )}
        </p>
      </div>

      {/* Main Image Banner */}
      <div className="rounded-3xl overflow-hidden shadow-xl aspect-[16/9] relative">
        <img
          src="/src/assets/images/clinic.jpg"
          alt="Dentora operatory room"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-6 sm:p-10">
          <div className="text-white max-w-lg">
            <span className="text-xs uppercase font-bold text-emerald-400 tracking-wide">
              {t('World-Class Facility', 'ዘመናዊ የህክምና ማዕከል')}
            </span>
            <p className="text-sm sm:text-base font-medium mt-1">
              {t(
                'Equipped with low-radiation digital radiography, ultrasonic scalers, and European class-B vacuum autoclaves.',
                'በአነስተኛ ጨረር በሚሰሩ የኤክስሬይ መሳሪያዎችና አስተማማኝ የማምከኛ ቴክኖሎጂ የታገዘ።'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#2ba8c9] flex items-center justify-center mb-4">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 mb-2">
            {t('Gentle, Empathetic Approach', 'የዋህና ደጋፊ አቀራረብ')}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t(
              'We never rush. Every step is explained plainly before any tool touches your teeth, ensuring complete comfort.',
              'ህክምና ከመጀመሩ በፊት እያንዳንዱን ሂደት በግልጽ በማስረዳት የህሙማንን ጭንቀት እናስወግዳለን።'
            )}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 mb-2">
            {t('Rigorous Infection Control', 'ጥብቅ የንጽህና ቁጥጥር')}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t(
              'Hospital-grade sterilization with individual instrument pouches autoclaved under strict European biological indicators.',
              'እያንዳንዱ መሳሪያ በዘመናዊ አውቶክሌቭ ማሽን ታሽጎና ተመክኖ ለህሙማን ብቻ አገልግሎት ላይ ይውላል።'
            )}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 mb-2">
            {t('Preserving Real Teeth', 'ተፈጥሮ ጥርስን ማዳን')}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t(
              'We prioritize saving your natural teeth whenever medically feasible through micro-rotary root canals and conservative restorations.',
              'ጥርስን ከመንቀል ይልቅ በህክምና አድኖ ረጅም አመት እንዲቆይ ማድረግ ቀዳሚ አላማችን ነው።'
            )}
          </p>
        </div>
      </div>

      {/* Accreditation & Registration */}
      <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            {t('Official Medical License', 'የጤና ጥበቃ ፈቃድ')}
          </span>
          <div className="font-bold text-slate-900 text-sm mt-0.5">
            Ministry of Health Ethiopia: {clinicSettings.registrationNumber}
          </div>
        </div>

        <button
          onClick={() => openBooking()}
          className="px-6 py-3 rounded-full bg-[#2ba8c9] hover:bg-[#1c88a6] text-slate-950 font-bold text-xs shadow-md transition-transform active:scale-95"
        >
          {t('Book a visit with us', 'ቀጠሮ ይያዙ')}
        </button>
      </div>
    </main>
  );
};

export default AboutPage;

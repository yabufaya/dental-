import React from 'react';
import SectionOpener from '../ui/SectionOpener';
import Reveal from '../motion/Reveal';
import CountUp from '../motion/CountUp';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';
import { clinicStats as fallbackStats } from '../../data/clinicData';
import type { ClinicStats } from '../../types/clinic';

export const AboutTrust: React.FC = () => {
  const { language, t } = useLanguage();
  const s = useSettings();
  // Trust numbers: admin-edited settings row wins, bundled defaults fill gaps
  const clinicStats: ClinicStats = {
    satisfactionRate: s.satisfactionRate ?? fallbackStats.satisfactionRate,
    smilesTransformed: s.smilesTransformed ?? fallbackStats.smilesTransformed,
    patientRating: s.patientRating ?? fallbackStats.patientRating,
    yearsExperience: s.yearsExperience ?? fallbackStats.yearsExperience,
    specialistCount: s.specialistCount ?? fallbackStats.specialistCount,
  };

  return (
    <SectionOpener
      id="about"
      tone="about"
      from="#ffffff"
      label={t('About Us', 'ስለ ዴንቶራ')}
      title={t('We deliver personalized dental treatments with', 'ግላዊ የጥርስ ህክምናዎችን')}
      titleSoft={t('modern technology and gentle care ensuring healthy confident smiles for every patient.', 'በዘመናዊ ቴክኖሎጂና በታላቅ ጥንቃቄ ለሁሉም ህሙማን እናቀርባለን።')}
      promise={t('Founded in Addis Ababa, Dentora combines cutting-edge dental science with a warm, compassionate touch that calms dental anxiety.', 'በአዲስ አበባ የተመሰረተው ዴንቶራ ዘመናዊ የህክምና ሳይንስን እና የህሙማንን ጭንቀት የሚቀርፍ ደግ አቀራረብን አጣምሮ ይዟል።')}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Doctor portraits + Clinic Photo */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-emerald-100 aspect-[4/3]">
            <img
              src="/images/clinic.jpg"
              alt="Dentora Dental Clinic modern operatory room"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-xs uppercase font-semibold text-emerald-300 tracking-wider">
                {t('Ergonomic & Sterile Environment', 'ንፁህና ምቹ የህክምና ክፍል')}
              </span>
              <p className="text-sm font-medium mt-0.5">
                {t('Equipped with European-certified micro-rotary instruments & low-radiation digital scans', 'ዝቅተኛ ጨረር ባላቸው የዲጂታል መሳሪያዎች የታገዘ')}
              </p>
            </div>
          </div>

          {/* Two small portraits strip */}
          <div className="flex items-center gap-3 pt-1">
            <div className="flex -space-x-3 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=120&q=80"
                alt="Dr. Daniel Carter"
                className="inline-block h-12 w-12 rounded-full ring-2 ring-white object-cover shadow-sm"
              />
              <img
                src="https://images.unsplash.com/photo-1594824813583-490333d02b54?auto=format&fit=crop&w=120&q=80"
                alt="Dr. Selamawit Tadesse"
                className="inline-block h-12 w-12 rounded-full ring-2 ring-white object-cover shadow-sm"
              />
              <img
                src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=120&q=80"
                alt="Dr. Dawit Abebe"
                className="inline-block h-12 w-12 rounded-full ring-2 ring-white object-cover shadow-sm"
              />
            </div>
            <div className="text-xs text-slate-700">
              <strong className="block font-bold text-slate-900">
                {t('6 Certified Dental Specialists', '6 የተመሰከረላቸው የጥርስ ስፔሻሊስቶች')}
              </strong>
              <span>{t('Over 30 combined years of oral healthcare excellence', 'የበርካታ ዓመታት ጥምር የህክምና ልምድ')}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Binary-to-Decimal Trust Counters */}
        <div className="lg:col-span-6">
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {/* Stat 1: Satisfaction Rate */}
            <Reveal variant="up" delay={0}>
              <div className="p-5 rounded-2xl bg-white/90 border border-emerald-100 shadow-sm">
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  <CountUp to={clinicStats.satisfactionRate} suffix="%" duration={2000} delay={0} />
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-700 mt-2">
                  {t('Satisfaction Rate', 'የደንበኞች እርካታ')}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {t('Based on 450+ verified patient post-treatment surveys', 'ከተረጋገጡ የህሙማን ግብረ-መልስ')}
                </p>
              </div>
            </Reveal>

            {/* Stat 2: Smiles Transformed */}
            <Reveal variant="up" delay={120}>
              <div className="p-5 rounded-2xl bg-white/90 border border-emerald-100 shadow-sm">
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  <CountUp to={clinicStats.smilesTransformed} suffix="+" duration={2200} delay={120} />
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-700 mt-2">
                  {t('Smiles Transformed', 'የተስተካከሉ ፈገግታዎች')}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {t('Successful restorative & aesthetic procedures completed', 'ስኬታማ የጥርስና ውበት ህክምናዎች')}
                </p>
              </div>
            </Reveal>

            {/* Stat 3: Customer Rating */}
            <Reveal variant="up" delay={240}>
              <div className="p-5 rounded-2xl bg-white/90 border border-emerald-100 shadow-sm">
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  <CountUp to={clinicStats.patientRating} decimals={1} suffix="★" duration={2100} delay={240} />
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-700 mt-2">
                  {t('Patient Rating', 'አማካይ የደንበኞች ደረጃ')}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {t('Consistent 5-star clinic reviews across Google Maps', 'በጉግል ማፕስ ከፍተኛ አድናቆት ያገኘ')}
                </p>
              </div>
            </Reveal>

            {/* Stat 4: Years in Business */}
            <Reveal variant="up" delay={360}>
              <div className="p-5 rounded-2xl bg-white/90 border border-emerald-100 shadow-sm">
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  <CountUp to={clinicStats.yearsExperience} suffix="+" duration={2000} delay={360} />
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-700 mt-2">
                  {t('Years of Care', 'የዓመታት አስተማማኝ ልምድ')}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {t('Serving families in Addis Ababa since 2014', 'ከልብ የሚሰጥ የታማኝነት አገልግሎት')}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </SectionOpener>
  );
};

export default AboutTrust;

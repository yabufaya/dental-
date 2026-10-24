import React from 'react';
import Reveal from '../motion/Reveal';
import { useLanguage } from '../../context/LanguageContext';

export const StepsStrip: React.FC = () => {
  const { t } = useLanguage();

  const steps = [
    {
      step: '01',
      title: t('Smile Assessment', 'የፈገግታ ምርመራ'),
      desc: t('3D digital scan & gentle comfort review', 'ዲጂታል ቅኝትና የጤንነት ዳሰሳ'),
    },
    {
      step: '02',
      title: t('Care Planning', 'የህክምና ዕቅድ'),
      desc: t('Clear explanation with transparent ETB pricing', 'ግልጽ ማብራሪያና የታወቀ ዋጋ'),
    },
    {
      step: '03',
      title: t('Treatment Process', 'የህክምና ሂደት'),
      desc: t('Painless, state-of-the-art restorative care', 'ህመም የሌለው ዘመናዊ ህክምና'),
    },
    {
      step: '04',
      title: t('Dental Maintenance', 'ቀጣይ ክትትል'),
      desc: t('Dedicated aftercare & routine reminders', 'የድህረ-ህክምና እንክብካቤና ምክር'),
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#fff8ea] border-y border-amber-100/80 relative overflow-hidden" aria-label="How it works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Label */}
        <div className="text-center mb-10">
          <Reveal variant="drop">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#f6b93b] text-slate-900 tracking-wide mb-2">
              {t('How It Works', 'የምንሰራበት መንገድ')}
            </span>
          </Reveal>
          <Reveal variant="up" delay={80}>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {t('Gentle, 4-Step Patient Journey', 'ቀላል እና ምቹ የህክምና ጉዞ')}
            </h2>
          </Reveal>
        </div>

        {/* 4 Steps Row with Connecting Line */}
        <div className="relative">
          {/* Subtle connecting horizontal line on desktop */}
          <div className="hidden lg:block absolute top-7 left-12 right-12 h-0.5 bg-amber-200/80 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10">
            {steps.map((s, idx) => (
              <Reveal key={s.step} variant="up" delay={idx * 90}>
                <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/70 backdrop-blur-xs border border-amber-200/50 shadow-xs">
                  {/* Step Number Circle */}
                  <div className="w-12 h-12 rounded-full bg-[#f6b93b] text-slate-950 font-bold text-sm flex items-center justify-center shadow-sm mb-3">
                    {s.step}
                  </div>
                  <h3 className="font-bold text-base text-slate-900 mb-1">{s.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-[220px]">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StepsStrip;

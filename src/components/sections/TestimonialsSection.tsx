import React, { useState } from 'react';
import { Star, CheckCircle, ShieldCheck, Quote, Sparkles } from 'lucide-react';
import SectionOpener from '../ui/SectionOpener';
import Reveal from '../motion/Reveal';
import BeforeAfter from '../ui/BeforeAfter';
import { useLanguage } from '../../context/LanguageContext';
import { testimonials } from '../../data/clinicData';

export const TestimonialsSection: React.FC = () => {
  const { language, t } = useLanguage();

  // Testimonial 1 is the verified clinical before/after transformation
  const featuredTransformation = testimonials[0];
  // Other real patient reviews
  const reviewCards = testimonials.slice(1);

  return (
    <SectionOpener
      id="testimonials"
      tone="stories"
      from="#e8f0fe"
      label={t('Happy Smiles', 'ደስተኛ ደንበኞቻችን')}
      title={t('Real Results from Real Patients', 'ከተጨባጭ የህሙማን ተሞክሮ')}
      titleSoft={t('Who Rediscovered Their Smile.', 'የተገኙ እውነተኛ ውጤቶች።')}
      promise={t('Read authentic reviews and explore clinical before-and-after smile transformations shared with written consent.', 'በህሙማን ፈቃድ የቀረቡ አስተያየቶችና የጥርስ ውበት ውጤቶችን ይመልከቱ።')}
    >
      <div className="space-y-8">
        {/* 1. Featured Clinical Before & After Transformation Spotlight */}
        {featuredTransformation && featuredTransformation.beforeUrl && featuredTransformation.afterUrl && (
          <Reveal variant="up">
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-rose-100 shadow-md">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
                {/* Interactive Slider Column */}
                <div className="lg:col-span-7">
                  <div className="max-w-xl mx-auto">
                    <BeforeAfter
                      before={featuredTransformation.beforeUrl}
                      after={featuredTransformation.afterUrl}
                      alt={featuredTransformation.beforeAfterAlt || featuredTransformation.treatment}
                    />
                  </div>
                </div>

                {/* Patient Story Details Column (Concise, no dead space) */}
                <div className="lg:col-span-5 flex flex-col justify-center space-y-3.5">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100">
                      <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                      <span>{t('Verified Transformation', 'የተረጋገጠ የፈገግታ ውጤት')}</span>
                    </span>
                    <span className="text-xs text-slate-400">{featuredTransformation.date}</span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(featuredTransformation.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-1">5.0</span>
                  </div>

                  <blockquote className="text-sm sm:text-base text-slate-700 leading-relaxed italic border-l-3 border-[#2ba8c9] pl-3.5">
                    "{language === 'am' && featuredTransformation.quoteAm ? featuredTransformation.quoteAm : featuredTransformation.quote}"
                  </blockquote>

                  <div className="pt-2 flex items-center gap-3">
                    {featuredTransformation.avatarUrl && (
                      <img
                        src={featuredTransformation.avatarUrl}
                        alt={featuredTransformation.patientName}
                        className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                    )}
                    <div>
                      <strong className="block text-sm font-bold text-slate-900">
                        {language === 'am' && featuredTransformation.patientNameAm ? featuredTransformation.patientNameAm : featuredTransformation.patientName}
                      </strong>
                      <span className="text-xs font-semibold text-[#1c88a6]">
                        {language === 'am' && featuredTransformation.treatmentAm ? featuredTransformation.treatmentAm : featuredTransformation.treatment}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        )}

        {/* 2. Concise Patient Review Cards (Grid: no gaping voids, no overflow, snug fit on all screens) */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {reviewCards.map((item, idx) => (
              <Reveal key={item.id} variant="up" delay={idx * 80}>
                <div className="h-full bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                  <div>
                    {/* Header: Avatar, Name, Treatment Pill & Stars */}
                    <div className="flex items-center gap-3 mb-3">
                      {item.avatarUrl ? (
                        <img
                          src={item.avatarUrl}
                          alt={item.patientName}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#e3f4f9] text-[#1c88a6] font-bold flex items-center justify-center shrink-0 text-sm">
                          {item.patientName.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <strong className="text-sm font-bold text-slate-900 truncate block">
                            {language === 'am' && item.patientNameAm ? item.patientNameAm : item.patientName}
                          </strong>
                          <span className="text-[10px] text-slate-400 shrink-0">{item.date}</span>
                        </div>
                        <span className="text-[11px] font-medium text-[#1c88a6] block truncate">
                          {language === 'am' && item.treatmentAm ? item.treatmentAm : item.treatment}
                        </span>
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-1 mb-2 text-amber-500">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    {/* Concise Quote Text without excess blank space */}
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                      "{language === 'am' && item.quoteAm ? item.quoteAm : item.quote}"
                    </p>
                  </div>

                  {/* Verified Badge */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-500">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{t('Verified Clinic Patient', 'የተረጋገጠ የክሊኒክ ህመምተኛ')}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </SectionOpener>
  );
};

export default TestimonialsSection;

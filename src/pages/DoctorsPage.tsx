import React from 'react';
import { Star, Award, Globe, ArrowRight, ShieldCheck } from 'lucide-react';
import Reveal from '../components/motion/Reveal';
import { useLanguage } from '../context/LanguageContext';
import { useBooking } from '../context/BookingContext';
import { useDoctors } from '../context/DataContext';

export const DoctorsPage: React.FC = () => {
  const doctors = useDoctors();
  const { language, t } = useLanguage();
  const { openBooking } = useBooking();

  return (
    <main className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="max-w-3xl mb-12">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#e8f0fe] text-[#4c8df6] mb-3">
          {t('Medical Team', 'የህክምና ቡድናችን')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {t('Meet Our Certified Specialists', 'የተካኑና የተመሰከረላቸው ሐኪሞቻችን')}
        </h1>
        <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          {t(
            'Dentora brings together specialist endodontists, implantologists, and aesthetic dentists dedicated to gentle, pain-minimized dentistry.',
            'በኢትዮጵያ ጤና ጥበቃ ሚኒስቴር እውቅና የተሰጣቸውና የዘመናትን የህክምና ልምድ ያካበቱ የጥርስ ስፔሻሊስቶች።'
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {doctors.map((doc, idx) => (
          <Reveal key={doc.id} variant="up" delay={idx * 100}>
            <div className="h-full bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                <img
                  src={doc.avatarUrl}
                  alt={doc.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md shadow-sm flex items-center gap-1 text-xs font-bold text-slate-900">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>{doc.rating}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({doc.reviewCount})</span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="font-bold text-xl text-slate-900">
                    {language === 'am' && doc.nameAm ? doc.nameAm : doc.name}
                  </h2>
                  <div className="text-xs font-semibold text-[#1c88a6] mt-0.5">
                    {language === 'am' && doc.titleAm ? doc.titleAm : doc.title}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mt-3">
                    {language === 'am' && doc.bioAm ? doc.bioAm : doc.bio}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{doc.qualifications}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{doc.languages.join(' · ')}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => openBooking(undefined, doc.id)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#2ba8c9] hover:bg-[#1c88a6] text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-98"
                  >
                    <span>{t(`Book with ${doc.name.split(' ')[0]}`, `ከ${doc.nameAm?.split(' ')[0] || doc.name} ጋር ቀጠሮ ይያዙ`)}</span>
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

export default DoctorsPage;

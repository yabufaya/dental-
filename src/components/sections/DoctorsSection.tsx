import React from 'react';
import { Star, Award, Globe, ArrowRight } from 'lucide-react';
import SectionOpener from '../ui/SectionOpener';
import Reveal from '../motion/Reveal';
import { useLanguage } from '../../context/LanguageContext';
import { useBooking } from '../../context/BookingContext';
import { doctors } from '../../data/clinicData';

export const DoctorsSection: React.FC = () => {
  const { language, t } = useLanguage();
  const { openBooking } = useBooking();

  return (
    <SectionOpener
      id="doctors"
      tone="experts"
      from="#e3f4f9"
      label={t('Our Experts', 'ሐኪሞቻችን')}
      title={t('Treated by Passionate,', 'በተመሰከረላቸው ባለሙያዎች')}
      titleSoft={t('Certified Dental Specialists.', 'የሚሰጥ የጥርስ ህክምና።')}
      promise={t('Every specialist at Dentora holds accredited international certifications and takes the time to listen, explain, and care.', 'እያንዳንዱ ሐኪማችን በቂ የትምህርት ዝግጅት ያለውና የህሙማንን ስሜት ተረድቶ በቅንነት የሚያክም ነው።')}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {doctors.map((doc, idx) => (
          <Reveal key={doc.id} variant="up" delay={idx * 120}>
            <div className="h-full flex flex-col justify-between rounded-3xl bg-white overflow-hidden border border-blue-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
              {/* Doctor Photo */}
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                  src={doc.avatarUrl}
                  alt={doc.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md shadow-sm flex items-center gap-1 text-xs font-bold text-slate-900">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>{doc.rating}</span>
                  <span className="text-[10px] text-slate-500 font-normal">({doc.reviewCount})</span>
                </div>

                {/* Experience Badge */}
                <div className="absolute bottom-3 left-3 text-white text-xs font-semibold">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#2ba8c9] text-slate-950 text-[11px] font-bold">
                    {doc.yearsExp}+ {t('Years Experience', 'ዓመታት ልምድ')}
                  </span>
                </div>
              </div>

              {/* Bio & Credentials Details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-xl text-slate-900">
                    {language === 'am' && doc.nameAm ? doc.nameAm : doc.name}
                  </h3>
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

                {/* Booking Button */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => openBooking(undefined, doc.id)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-[#2ba8c9] text-slate-800 hover:text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-98"
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
    </SectionOpener>
  );
};

export default DoctorsSection;

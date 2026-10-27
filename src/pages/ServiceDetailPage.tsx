import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, ArrowLeft, CheckCircle2, AlertCircle, HelpCircle, Shield, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useBooking } from '../context/BookingContext';
import { useServices } from '../context/DataContext';

export const ServiceDetailPage: React.FC = () => {
  const services = useServices();
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useLanguage();
  const { openBooking } = useBooking();
  const navigate = useNavigate();

  const service = services.find((s) => s.slug === slug) || services[0];

  return (
    <main className="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('Back to Services', 'ወደ አገልግሎቶች ተመለስ')}</span>
      </button>

      {/* Header Banner Card */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-10 shadow-xl mb-10 relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#2ba8c9] text-slate-950 mb-3">
            <Clock className="w-3.5 h-3.5" />
            <span>~{service.durationMin} {t('minutes average session', 'ደቂቃዎች')}</span>
          </span>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-3">
            {language === 'am' && service.titleAm ? service.titleAm : service.title}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {language === 'am' && service.plainDescAm ? service.plainDescAm : service.plainDesc}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15">
              <span className="text-[11px] text-slate-300 block">{t('Starting Investment', 'መነሻ ክፍያ')}</span>
              <strong className="text-xl font-bold text-white tabular-nums">
                From {service.priceFromETB.toLocaleString()} ETB
              </strong>
            </div>

            <button
              onClick={() => openBooking(service.id)}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#2ba8c9] hover:bg-[#1c88a6] text-slate-950 font-bold text-sm shadow-lg transition-transform active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span>{t('Book This Treatment', 'ይህንን ህክምና ይያዙ')}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Details Column */}
        <div className="lg:col-span-2 space-y-10">
          {/* Detailed Overview */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {t('About the Procedure', 'ስለ ህክምናው ዝርዝር')}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {language === 'am' && service.longDescAm ? service.longDescAm : service.longDesc}
            </p>
          </section>

          {/* Who Needs It */}
          <section className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200/60">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              <span>{t('Who Needs This Treatment?', 'ይህ ህክምና ለማን ይመከራል?')}</span>
            </h3>
            <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
              {language === 'am' && service.whoNeedsItAm ? service.whoNeedsItAm : service.whoNeedsIt}
            </p>
          </section>

          {/* Step-by-Step Procedure */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              {t('What to Expect During Your Visit', 'በክሊኒኩ ምን ይከናወናል?')}
            </h2>
            <div className="space-y-3">
              {service.procedureSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70"
                >
                  <span className="w-6 h-6 rounded-full bg-[#2ba8c9] text-slate-950 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-700 leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Aftercare Instructions */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              {t('Aftercare & Home Instructions', 'የድህረ-ህክምና እንክብካቤ')}
            </h2>
            <ul className="space-y-2.5">
              {service.aftercare.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* FAQs for this Service */}
          {service.faqs && service.faqs.length > 0 && (
            <section className="pt-6 border-t border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#2ba8c9]" />
                <span>{t('Common Questions', 'ተደጋጋሚ ጥያቄዎች')}</span>
              </h2>
              <div className="space-y-3">
                {service.faqs.map((faq, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <h3 className="font-bold text-sm text-slate-900 mb-1">
                      {language === 'am' && faq.qAm ? faq.qAm : faq.q}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {language === 'am' && faq.aAm ? faq.aAm : faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Sticky Card */}
        <div className="space-y-6">
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200/90 sticky top-28 space-y-5">
            <h3 className="font-bold text-slate-900 text-base">
              {t('Schedule Examination', 'ቀጠሮ ይያዙ')}
            </h3>

            <div className="text-xs text-slate-600 space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>{t('Duration:', 'የሚፈጀው ጊዜ:')}</span>
                <strong className="text-slate-900">~{service.durationMin} mins</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>{t('Starting Price:', 'መነሻ ዋጋ:')}</span>
                <strong className="text-[#1c88a6]">{service.priceFromETB.toLocaleString()} ETB</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>{t('Sedation / Anesthesia:', 'ማደንዘዣ:')}</span>
                <span className="text-emerald-700 font-semibold">{t('Gentle / Painless', 'ህመም የሌለው')}</span>
              </div>
            </div>

            <button
              onClick={() => openBooking(service.id)}
              className="w-full py-3 px-4 rounded-2xl bg-[#2ba8c9] hover:bg-[#1c88a6] text-slate-950 font-bold text-xs shadow-md transition-transform active:scale-95"
            >
              {t('Book a visit for this service', 'ቀጠሮ ይያዙ')}
            </button>

            <div className="p-3 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-500 space-y-1">
              <div className="font-semibold text-slate-800 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span>{t('No Outcome Guarantees Disclaimer', 'የህክምና ማሳሰቢያ')}</span>
              </div>
              <p>
                {t(
                  'Final clinical cost is determined after doctor physical inspection and X-ray evaluation.',
                  'ትክክለኛው ዋጋ በዶክተር ምርመራና በኤክስሬይ ውጤት መሰረት የሚወሰን ይሆናል።'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ServiceDetailPage;

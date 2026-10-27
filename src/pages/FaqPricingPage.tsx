import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Shield, CreditCard, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useBooking } from '../context/BookingContext';
import { frequentlyAskedQuestions } from '../data/clinicData';
import { useSettings } from '../context/SettingsContext';
import { useServices } from '../context/DataContext';

export const FaqPricingPage: React.FC = () => {
  const clinicSettings = useSettings();
  const services = useServices(); // pricing table rows
  const { language, t } = useLanguage();
  const { openBooking } = useBooking();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <main className="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="max-w-3xl mb-12">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#e3f4f9] text-[#1c88a6] mb-3">
          {t('Honest & Transparent Guidance', 'ግልጽ የዋጋና የክፍያ መረጃ')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {t('Treatment Pricing & Patient FAQs', 'የህክምና ዋጋ እና ተደጋጋሚ ጥያቄዎች')}
        </h1>
        <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          {t(
            'We believe in straightforward, upfront pricing with zero hidden charges. Review starting rates below or explore common answers.',
            'ያለ ድብቅ ክፍያ ግልጽ የሆነ የዋጋ ዝርዝር እና ለተደጋጋሚ ጥያቄዎች የተሰጡ መልሶች።'
          )}
        </p>
      </div>

      {/* Pricing Table Section */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-[#2ba8c9]" />
          <span>{t('Standard Starting Fees (in Ethiopian Birr)', 'የአገልግሎቶች መነሻ ዋጋ (በብር)')}</span>
        </h2>

        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6 font-bold">{t('Treatment / Service', 'አገልግሎት')}</th>
                  <th className="py-3.5 px-4 sm:px-6 font-bold">{t('Estimated Duration', 'ጊዜ')}</th>
                  <th className="py-3.5 px-4 sm:px-6 font-bold">{t('Starting Investment', 'መነሻ ክፍያ')}</th>
                  <th className="py-3.5 px-4 sm:px-6 font-bold text-right">{t('Action', 'ቀጠሮ')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {services.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4 sm:px-6 font-semibold text-slate-900">
                      {language === 'am' && s.titleAm ? s.titleAm : s.title}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-slate-600">~{s.durationMin} mins</td>
                    <td className="py-4 px-4 sm:px-6 font-bold text-[#1c88a6] tabular-nums">
                      From {s.priceFromETB.toLocaleString()} ETB
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <button
                        onClick={() => openBooking(s.id)}
                        className="px-3 py-1.5 rounded-full bg-[#2ba8c9] hover:bg-[#1c88a6] text-slate-950 font-bold text-xs"
                      >
                        {t('Book', 'ይያዙ')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500">
            * {t('Dental pricing rule: Exact cost is confirmed after doctor clinical assessment and X-ray diagnosis.', 'ትክክለኛው ዋጋ በዶክተር ምርመራና በኤክስሬይ ውጤት መሰረት ይረጋገጣል።')}
          </div>
        </div>
      </section>

      {/* Payment Methods Breakdown */}
      <section className="mb-16 p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 mb-2">
          {t('Supported Payment Channels in Ethiopia', 'በክሊኒካችን የምንቀበላቸው ክፍያዎች')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mb-6">
          {t(
            'We make settlement frictionless. Pay via mobile wallets, instant local bank transfers, cash, or verified insurance.',
            'በቴሌብር፣ በሲቢኢ ብር፣ በባንክ ወይም በጥሬ ገንዘብ ያለምንም እንግልት መክፈል ይችላሉ።'
          )}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-white rounded-2xl border border-slate-200 text-center">
            <strong className="block text-slate-900 font-bold text-sm">Telebirr (ቴሌብር)</strong>
            <span className="text-[11px] text-slate-500">Instant QR & USSD</span>
          </div>
          <div className="p-3 bg-white rounded-2xl border border-slate-200 text-center">
            <strong className="block text-slate-900 font-bold text-sm">CBE Birr (ሲቢኢ ብር)</strong>
            <span className="text-[11px] text-slate-500">Mobile Banking</span>
          </div>
          <div className="p-3 bg-white rounded-2xl border border-slate-200 text-center">
            <strong className="block text-slate-900 font-bold text-sm">Bank Transfer</strong>
            <span className="text-[11px] text-slate-500">Awash, CBE, Dashen</span>
          </div>
          <div className="p-3 bg-white rounded-2xl border border-slate-200 text-center">
            <strong className="block text-slate-900 font-bold text-sm">Cash & Insurance</strong>
            <span className="text-[11px] text-slate-500">Direct at reception</span>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#2ba8c9]" />
          <span>{t('Frequently Asked Questions', 'ተደጋጋሚ የህሙማን ጥያቄዎች')}</span>
        </h2>

        <div className="space-y-3">
          {frequentlyAskedQuestions.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 hover:text-[#1c88a6] transition-colors"
                  aria-expanded={isOpen}
                >
                  <span>{language === 'am' && faq.qAm ? faq.qAm : faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#2ba8c9] shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {language === 'am' && faq.aAm ? faq.aAm : faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Page Ending CTA */}
      <div className="text-center p-8 rounded-3xl bg-[#e3f4f9] border border-cyan-100">
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          {t('Ready to experience pain-free dentistry?', 'ጥርስዎን ለማስመርመር ዝግጁ ነዎት?')}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mb-6 max-w-md mx-auto">
          {t('Schedule your examination today in Bole Medhanialem or call our friendly front desk.', 'ዛሬውኑ ቀጠሮዎን በቦሌ መድኃኔዓለም ክሊኒካችን ይያዙ።')}
        </p>
        <button
          onClick={() => openBooking()}
          className="px-6 py-3 rounded-full bg-[#2ba8c9] hover:bg-[#1c88a6] text-slate-950 font-bold text-xs shadow-md transition-transform active:scale-95"
        >
          {t('Book an Appointment', 'ቀጠሮ ይያዙ')}
        </button>
      </div>
    </main>
  );
};

export default FaqPricingPage;

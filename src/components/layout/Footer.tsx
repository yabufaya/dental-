import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ShieldCheck, Heart, ArrowUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useBooking } from '../../context/BookingContext';
import { useSettings } from '../../context/SettingsContext';
import SocialIcons from '../ui/SocialIcons';

const fmtHours = (v: { open: string; close: string } | null): string =>
  v ? `${v.open} – ${v.close}` : '';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const { openBooking } = useBooking();
  const clinicSettings = useSettings(); // live clinic_settings row (static fallback)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-24 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Clinic Overview */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#2ba8c9] flex items-center justify-center text-slate-950 font-bold">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M12 2C8.5 2 6 4 6 7c0 3.5 1.5 6 3 9 1 2 1.5 4 3 4s2-2 3-4c1.5-3 3-5.5 3-9 0-3-2.5-5-6-5z" />
                  <path d="M12 7v5" />
                </svg>
              </div>
              <span className="font-bold text-xl text-white tracking-tight">Dentora</span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              {t(
                'Personalized, family-friendly dental care with modern painless techniques in Addis Ababa. Restoring confident smiles one patient at a time.',
                'በአዲስ አበባ ጥራት ያለውና ዘመናዊ የጥርስ ሕክምና በታማኝነትና በቅንነት የምንሰጥበት የቤተሰብ ክሊኒክ።'
              )}
            </p>

            <div className="pt-2">
              <button
                onClick={() => openBooking()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2ba8c9] hover:bg-[#1c88a6] text-slate-950 font-bold text-xs transition-colors"
              >
                <span>{t('Book a visit', 'ቀጠሮ ይያዙ')}</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              {t('Explore', 'አቋራጮች')}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/#services" className="hover:text-[#2ba8c9] transition-colors">
                  {t('Our Services', 'አገልግሎቶቻችን')}
                </Link>
              </li>
              <li>
                <Link to="/#doctors" className="hover:text-[#2ba8c9] transition-colors">
                  {t('Specialist Doctors', 'ሐኪሞቻችን')}
                </Link>
              </li>
              <li>
                <Link to="/faq-pricing" className="hover:text-[#2ba8c9] transition-colors">
                  {t('Pricing & FAQs', 'ዋጋ እና ተደጋጋሚ ጥያቄዎች')}
                </Link>
              </li>
              <li>
                <Link to="/#blog" className="hover:text-[#2ba8c9] transition-colors">
                  {t('Dental Health Blog', 'የጥርስ ጤና ትምህርት')}
                </Link>
              </li>
              <li>
                <Link to="/#contact" className="hover:text-[#2ba8c9] transition-colors">
                  {t('Location & Map', 'አድራሻ እና ካርታ')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Opening Hours & Emergency */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              {t('Hours & Emergency', 'የስራ ሰዓት እና አደጋ')}
            </h3>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span>{t('Monday – Friday:', 'ከሰኞ – ዓርብ:')}</span>
                <span className="font-semibold text-slate-200">{fmtHours(clinicSettings.hours.mon)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span>{t('Saturday:', 'ቅዳሜ:')}</span>
                <span className="font-semibold text-slate-200">
                  {clinicSettings.hours.sat ? fmtHours(clinicSettings.hours.sat) : t('Closed', 'ዝግ')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span>{t('Sunday:', 'እሑድ:')}</span>
                {clinicSettings.hours.sun ? (
                  <span className="font-semibold text-slate-200">{fmtHours(clinicSettings.hours.sun)}</span>
                ) : (
                  <span className="text-amber-400 font-semibold">{t('Emergency only', 'ለአደጋ ብቻ')}</span>
                )}
              </div>

              <div className="mt-4 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="block text-[11px] font-semibold text-rose-400 uppercase tracking-wide">
                  {t('24/7 Dental Emergency Hotline', 'የ24 ሰዓት ድንገተኛ ስልክ')}
                </span>
                <a
                  href={`tel:${clinicSettings.emergencyPhone.replace(/\s+/g, '')}`}
                  className="font-bold text-white hover:text-rose-400 text-sm block mt-1"
                >
                  {clinicSettings.emergencyPhone}
                </a>
              </div>
            </div>
          </div>

          {/* Col 4: Location & Payment Methods */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
              {t('Find Us in Addis Ababa', 'አድራሻችን በአዲስ አበባ')}
            </h3>
            <div className="flex items-start gap-2.5 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-[#2ba8c9] shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200 block">{clinicSettings.address}</strong>
                <span>{clinicSettings.landmark}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Mail className="w-3.5 h-3.5 text-[#2ba8c9]" />
              <a href={`mailto:${clinicSettings.email}`} className="hover:text-white">
                {clinicSettings.email}
              </a>
            </div>

            {/* Payment methods badge */}
            <div className="pt-2">
              <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">
                {t('Accepted Payment Methods:', 'የምንቀበላቸው ክፍያዎች:')}
              </span>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-medium border border-slate-700">
                  Telebirr
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-medium border border-slate-700">
                  CBE Birr
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-medium border border-slate-700">
                  Cash (ብር)
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-medium border border-slate-700">
                  Bank Transfer
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Social media row — links come from admin → Contact Info & Social */}
        <div className="pt-10 pb-2 text-center">
          <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
            {t('Follow us', 'ተከተሉን')}
          </span>
          <SocialIcons settings={clinicSettings} />
        </div>

        {/* Bottom Bar: License, Compliance, Copyright & Back to top */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span>© {new Date().getFullYear()} Dentora Dental Care. All rights reserved.</span>
            <span className="hidden sm:inline">·</span>
            <span className="inline-flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              MOH Lic: {clinicSettings.registrationNumber}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/privacy-terms" className="hover:text-slate-300 transition-colors">
              {t('Privacy Policy & Terms', 'የግላዊነት መመሪያ እና ውሎች')}
            </Link>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
              aria-label="Back to top"
            >
              <span>{t('Back to top', 'ወደ ላይ')}</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

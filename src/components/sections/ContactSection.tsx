import React, { useState } from 'react';
import { Phone, MessageSquare, Send, Mail, MapPin, Clock, AlertCircle, CheckCircle, ShieldCheck, Car } from 'lucide-react';
import SectionOpener from '../ui/SectionOpener';
import Reveal from '../motion/Reveal';
import ContactMap from './ContactMap';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';
import { getOpenStatus } from '../../utils/hours';

export const ContactSection: React.FC = () => {
  const clinicSettings = useSettings();
  const { language, t } = useLanguage();
  const [formSent, setFormSent] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const status = getOpenStatus(clinicSettings.hours);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setFormSent(true);
  };

  return (
    <SectionOpener
      id="contact"
      tone="contact"
      from="#0b151e"
      label={t('Visit Us', 'ይምጡና ይጎብኙን')}
      title={t('Convenient Location in Bole,', 'በቦሌ ምቹና ማዕከላዊ ቦታ ላይ')}
      titleSoft={t('With Dedicated Parking & Direct Elevator Access.', 'ከነፃ የመኪና ማቆሚያና ከሊፍት ጋር ይገኛል።')}
      promise={t('We are here for you 6 days a week, with dedicated 24/7 coverage for dental emergencies.', 'በሳምንት 6 ቀናት እንዲሁም ለድንገተኛ የጥርስ ህመም 24 ሰዓት ሁልጊዜም ዝግጁ ነን።')}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Full Landmark Details + Contact Lines + Small Quick Form */}
        <div className="lg:col-span-6 space-y-6">
          {/* Landmark & Address */}
          <Reveal variant="up" delay={0}>
            <div className="p-6 rounded-3xl bg-white/95 border border-teal-100 shadow-sm space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#e3f7f5] flex items-center justify-center text-[#1fb5a8] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {language === 'am' ? clinicSettings.nameAm : clinicSettings.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium mt-0.5">
                    {language === 'am' ? clinicSettings.addressAm : clinicSettings.address}
                  </p>
                  <p className="text-xs text-[#1c88a6] font-semibold mt-1">
                    📍 {language === 'am' ? clinicSettings.landmarkAm : clinicSettings.landmark}
                  </p>
                </div>
              </div>

              {/* Tappable Contact Channels: Phone, WhatsApp, Telegram, Email */}
              <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <a
                  href={`tel:${clinicSettings.phone.replace(/\s+/g, '')}`}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-[#e3f7f5] text-slate-800 flex items-center gap-2 font-medium transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#1fb5a8]" />
                  <span>{clinicSettings.phone}</span>
                </a>

                <a
                  href={`https://wa.me/${clinicSettings.whatsapp}?text=Hello%20Dentora%20Dental%20Clinic`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-800 flex items-center gap-2 font-medium transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp: +{clinicSettings.whatsapp}</span>
                </a>

                <a
                  href={`https://t.me/${clinicSettings.telegram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-800 flex items-center gap-2 font-medium transition-colors"
                >
                  <span className="w-4 h-4 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-[9px]">
                    ✈
                  </span>
                  <span>Telegram: @{clinicSettings.telegram}</span>
                </a>

                <a
                  href={`mailto:${clinicSettings.email}`}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 flex items-center gap-2 font-medium transition-colors"
                >
                  <Mail className="w-4 h-4 text-slate-500" />
                  <span className="truncate">{clinicSettings.email}</span>
                </a>
              </div>

              {/* Emergency Hotline Box */}
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 block">
                    {t('Tooth Emergency? Call Immediately', 'አስቸኳይ የጥርስ ህመም? አሁኑኑ ይደውሉ')}
                  </span>
                  <a
                    href={`tel:${clinicSettings.emergencyPhone.replace(/\s+/g, '')}`}
                    className="font-bold text-rose-900 text-sm hover:underline"
                  >
                    {clinicSettings.emergencyPhone}
                  </a>
                </div>
                <a
                  href={`tel:${clinicSettings.emergencyPhone.replace(/\s+/g, '')}`}
                  className="px-3 py-1.5 rounded-full bg-rose-600 text-white font-bold text-xs shadow-xs"
                >
                  {t('Call Now', 'ይደውሉ')}
                </a>
              </div>

              {/* Hours breakdown with current day highlighted */}
              <div className="pt-2 text-xs space-y-1.5 text-slate-600">
                <div className="flex items-center justify-between font-semibold text-slate-800 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#1fb5a8]" />
                    <span>{t('Opening Hours (Addis Ababa)', 'የስራ ሰዓት')}</span>
                  </span>
                  <span className="text-emerald-700 font-bold">
                    {language === 'am' ? status.labelAm : status.label}
                  </span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span>{t('Monday – Friday:', 'ሰኞ – ዓርብ:')}</span>
                  <span className="font-semibold text-slate-900">08:30 – 17:30</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span>{t('Saturday:', 'ቅዳሜ:')}</span>
                  <span className="font-semibold text-slate-900">09:00 – 15:30</span>
                </div>
                <div className="flex justify-between py-0.5 text-amber-700">
                  <span>{t('Sunday:', 'እሑድ:')}</span>
                  <span>{t('Closed (Emergency On-Call Only)', 'ዝግ ነው (ለድንገተኛ አደጋ ብቻ)')}</span>
                </div>
              </div>

              {/* Access & Payments in one short line each */}
              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                <p>
                  <strong>{t('Parking & Access:', 'ፓርኪንግ እና ተደራሽነት:')}</strong>{' '}
                  {clinicSettings.accessibility.join(' · ')}
                </p>
                <p>
                  <strong>{t('Accepted Payments:', 'የክፍያ አማራጮች:')}</strong>{' '}
                  {clinicSettings.paymentMethods.join(' · ')}
                </p>
              </div>
            </div>
          </Reveal>

          {/* Quick Contact Form */}
          <Reveal variant="up" delay={80}>
            <div className="p-6 rounded-3xl bg-white/95 border border-teal-100 shadow-sm">
              <h4 className="font-bold text-sm text-slate-900 mb-2">
                {t('Send a Quick Inquiry', 'አጭር መልዕክት ይላኩልን')}
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                {t('Our front desk will respond via phone or WhatsApp within 30 minutes.', 'የቀጠሮ ባለሙያችን በ30 ደቂቃ ውስጥ በስልክ ወይም በዋትስአፕ ምላሽ ይሰጥዎታል።')}
              </p>

              {formSent ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center text-xs text-emerald-900 space-y-1">
                  <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto" />
                  <strong className="block font-bold">{t('Message Sent Successfully!', 'መልዕክትዎ በተሳካ ሁኔታ ደርሷል!')}</strong>
                  <span>{t('We will contact you shortly.', 'በቅርቡ በስልክ እንደውላለን።')}</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('Your Name', 'ስም')}
                      className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-[#2ba8c9] focus:outline-none"
                    />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t('Phone Number (+251 9...)', 'ስልክ ቁጥር')}
                      className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-[#2ba8c9] focus:outline-none"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t('How can we help your smile?', 'ምን አይነት ህክምና ይፈልጋሉ?')}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-[#2ba8c9] focus:outline-none resize-none"
                  />
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400">
                      {t('Protected by patient privacy guidelines.', 'የእርስዎ መረጃ ሚስጥራዊነቱ የተጠበቀ ነው።')}
                    </span>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-full bg-[#2ba8c9] hover:bg-[#1c88a6] text-slate-950 font-bold text-xs transition-transform active:scale-95"
                    >
                      {t('Send Message', 'ላክ')}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </Reveal>
        </div>

        {/* Right Column: Google Maps Style Card + Reception Visual */}
        <div className="lg:col-span-6 space-y-4">
          <Reveal variant="fade" delay={120}>
            <ContactMap
              name={clinicSettings.name}
              nameAm={clinicSettings.nameAm}
              address={clinicSettings.address}
              landmark={clinicSettings.landmark}
              hours={clinicSettings.hours}
              lat={clinicSettings.lat}
              lng={clinicSettings.lng}
              mapEmbedUrl={clinicSettings.mapEmbedUrl}
            />
          </Reveal>

          {/* Exterior / Landmark visual to reassure patients arriving in person */}
          <div className="p-4 rounded-2xl bg-white border border-teal-100 text-xs text-slate-600 flex items-center gap-3.5 shadow-xs">
            <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
              <img
                src="/images/clinic.jpg"
                alt="Dentora entrance"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <strong className="block text-slate-900 font-semibold">
                {t('Look for Dentora Sign on the 2nd Floor', 'በ2ኛ ፎቅ ላይ የዴንቶራ ክሊኒክ ምልክትን ይመልከቱ')}
              </strong>
              <span>
                {t('Direct elevator available right from the entrance lobby or basement parking.', 'ከመኪና ማቆሚያውና ከዋናው በር በቀጥታ የሚያደርስ ሊፍት አለ።')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </SectionOpener>
  );
};

export default ContactSection;

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Phone, CheckCircle, Shield, AlertCircle, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useBooking } from '../../context/BookingContext';
import { services, doctors, clinicSettings } from '../../data/clinicData';

const AVAILABLE_SLOTS = [
  '09:00 AM',
  '10:15 AM',
  '11:30 AM',
  '02:00 PM',
  '03:15 PM',
  '04:30 PM',
];

export const BookingModal: React.FC = () => {
  const { language, t } = useLanguage();
  const { isBookingOpen, closeBooking, selectedServiceId, selectedDoctorId } = useBooking();

  const [step, setStep] = useState<1 | 2>(1); // 1: Details & Slot, 2: Confirmation
  const [serviceId, setServiceId] = useState<string>(selectedServiceId || 'checkup-cleaning');
  const [doctorId, setDoctorId] = useState<string>(selectedDoctorId || 'any');
  const [date, setDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState<string>('10:15 AM');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [consent, setConsent] = useState(true);
  const [bookingRef, setBookingRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync props when opening modal with pre-selected options
  useEffect(() => {
    if (selectedServiceId) setServiceId(selectedServiceId);
    if (selectedDoctorId) setDoctorId(selectedDoctorId);
    setStep(1);
  }, [selectedServiceId, selectedDoctorId, isBookingOpen]);

  if (!isBookingOpen) return null;

  const selectedService = services.find((s) => s.id === serviceId) || services[0];
  const selectedDoctor = doctors.find((d) => d.id === doctorId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !consent) return;

    setIsSubmitting(true);
    // Simulate booking save
    setTimeout(() => {
      const ref = `DEN-${Math.floor(100000 + Math.random() * 900000)}`;
      setBookingRef(ref);
      setIsSubmitting(false);
      setStep(2);
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#2ba8c9] text-slate-950 mb-2">
              <Calendar className="w-3.5 h-3.5" />
              {t('Appointment Desk', 'የቀጠሮ ማዕከል')}
            </span>
            <h2 id="booking-modal-title" className="text-xl sm:text-2xl font-bold tracking-tight">
              {step === 1
                ? t('Book a visit in 60 Seconds', 'በ60 ሰከንድ ውስጥ ቀጠሮ ይያዙ')
                : t('Appointment Confirmed!', 'ቀጠሮዎ ተረጋግጧል!')}
            </h2>
          </div>

          <button
            onClick={closeBooking}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto">
          {step === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Service Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  1. {t('Select Service / Treatment', 'አገልግሎት ይምረጡ')}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {services.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setServiceId(s.id)}
                      className={`text-left p-3 rounded-xl border text-xs transition-all flex flex-col justify-between ${
                        serviceId === s.id
                          ? 'border-[#2ba8c9] bg-[#e3f4f9] shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="font-bold text-slate-900">{language === 'am' && s.titleAm ? s.titleAm : s.title}</div>
                      <div className="mt-1 flex items-center justify-between text-slate-600">
                        <span>{s.durationMin} mins</span>
                        <span className="font-semibold text-[#1c88a6]">From {s.priceFromETB} ETB</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Specialist Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  2. {t('Preferred Specialist (Optional)', 'የሚመርጡት ሐኪም (አማራጭ)')}
                </label>
                <select
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#2ba8c9] focus:outline-none"
                >
                  <option value="any">{t('First Available Specialist (Recommended)', 'በቀዳሚነት ዝግጁ የሆነ ሐኪም (የሚመከር)')}</option>
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {language === 'am' && doc.nameAm ? doc.nameAm : doc.name} — {doc.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Slot selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    3. {t('Preferred Date', 'ቀን ይምረጡ')}
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#2ba8c9] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    4. {t('Available Slot', 'ሰዓት ይምረጡ')}
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {AVAILABLE_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTimeSlot(slot)}
                        className={`py-2 text-[11px] font-semibold rounded-lg border text-center transition-all ${
                          timeSlot === slot
                            ? 'bg-[#2ba8c9] text-slate-950 border-[#2ba8c9] shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  5. {t('Your Contact Details', 'የእርስዎ መረጃ')}
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('Full Name (e.g. Almaz Bekele)', 'ሙሉ ስም')}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#2ba8c9] focus:outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t('Phone Number (+251 9...)', 'ስልክ ቁጥር (+251 9...)')}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#2ba8c9] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t('Any dental anxiety or specific symptoms? (Optional)', 'ያለዎት ስሜት ወይም ህመም (አማራጭ)')}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#2ba8c9] focus:outline-none"
                  />
                </div>

                {/* Consent checkbox */}
                <label className="flex items-start gap-2 pt-1 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-[#2ba8c9] focus:ring-[#2ba8c9]"
                  />
                  <span>
                    {t(
                      'I consent to receive an appointment confirmation via SMS or WhatsApp and agree to clinic policies.',
                      'በስልክ ወይም በዋትስአፕ የቀጠሮ ማረጋገጫ ለመቀበል እስማማለሁ።'
                    )}
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !consent}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#2ba8c9] hover:bg-[#1c88a6] disabled:opacity-50 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{t('Confirm Appointment Request', 'ቀጠሮውን አረጋግጥ')}</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Step 2: Confirmation Screen */
            <div className="text-center py-4 space-y-5 animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
                  {t('Booking Reference', 'የቀጠሮ መለያ ቁጥር')}
                </span>
                <div className="text-2xl font-mono font-bold text-slate-900 mt-1">{bookingRef}</div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 text-left text-xs sm:text-sm text-slate-700 space-y-2 border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('Patient:', 'ህመምተኛ:')}</span>
                  <strong className="text-slate-900">{name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('Treatment:', 'አገልግሎት:')}</span>
                  <strong className="text-slate-900">{language === 'am' && selectedService.titleAm ? selectedService.titleAm : selectedService.title}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('Specialist:', 'ሐኪም:')}</span>
                  <strong className="text-slate-900">{selectedDoctor ? (language === 'am' && selectedDoctor.nameAm ? selectedDoctor.nameAm : selectedDoctor.name) : t('First Available Specialist', 'በቀዳሚነት ዝግጁ')}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('Date & Time:', 'ቀንና ሰዓት:')}</span>
                  <strong className="text-[#1c88a6]">{date} at {timeSlot}</strong>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-500">{t('Estimated Cost:', 'መነሻ ክፍያ:')}</span>
                  <strong className="text-slate-900">From {selectedService.priceFromETB} ETB</strong>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-left text-xs text-blue-900">
                <span className="font-bold block mb-1">
                  {t('Payment at Reception:', 'ክፍያ በክሊኒኩ:')}
                </span>
                <span>
                  {t(
                    'No advance payment required. You can pay seamlessly after your examination using Telebirr, CBE Birr, Bank transfer, or Cash.',
                    'ቅድመ ክፍያ አያስፈልግም፤ በክሊኒኩ ከታከሙ በኋላ በቴሌብር፣ በሲቢኢ ብር ወይም በጥሬ ገንዘብ መክፈል ይችላሉ።'
                  )}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={`https://wa.me/${clinicSettings.whatsapp}?text=Hello%20Dentora,%20I%20booked%20an%20appointment%20with%20reference%20${bookingRef}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2"
                >
                  <span>{t('Confirm on WhatsApp', 'በዋትስአፕ አረጋግጥ')}</span>
                </a>

                <button
                  onClick={closeBooking}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs"
                >
                  {t('Done', 'ተጠናቋል')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;

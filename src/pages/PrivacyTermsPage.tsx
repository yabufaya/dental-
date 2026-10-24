import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const PrivacyTermsPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <main className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-6">
        {t('Privacy Policy & Clinical Terms of Care', 'የግላዊነት ፖሊሲ እና የህክምና ውሎች')}
      </h1>

      <div className="prose max-w-none text-slate-700 text-xs sm:text-sm leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Patient Confidentiality & Medical Records</h2>
          <p>
            At Dentora Dental Clinic, patient confidentiality is held with the utmost professional standard in accordance with Ethiopian healthcare regulations. Clinical records, digital intraoral radiographs, and medical histories are securely stored and never disclosed to third parties without prior explicit written consent.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Photographic Consent (Before & After Results)</h2>
          <p>
            Clinical before-and-after photographs are published strictly with explicit written patient consent. Patient names are anonymized or abbreviated to safeguard privacy. Individual biological variations mean that clinical results vary between patients; photographs represent genuine clinical outcomes but do not constitute an outcome guarantee.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Appointment Bookings & Cancellations</h2>
          <p>
            Appointments can be scheduled via our online platform, phone, WhatsApp, or Telegram. If you need to reschedule or cancel a visit, we kindly ask for at least 4 hours advance notice to allow other emergency patients access to chair time.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. Transparent Pricing & Payments</h2>
          <p>
            Starting fees in Ethiopian Birr (ETB) are displayed for transparency. Final fees are established after physical examination and diagnostic X-rays. Payment is accepted via Telebirr, CBE Birr, commercial bank transfer, cash, and approved private health insurance.
          </p>
        </section>
      </div>
    </main>
  );
};

export default PrivacyTermsPage;

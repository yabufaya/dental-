import React from 'react';
import { Calendar, Phone } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useBooking } from '../../context/BookingContext';
import { clinicSettings } from '../../data/clinicData';

export const MobileBookBar: React.FC = () => {
  const { t } = useLanguage();
  const { openBooking } = useBooking();

  return (
    <aside
      aria-label="Mobile quick actions"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
    >
      <div className="flex items-center gap-2 max-w-md mx-auto">
        {/* Call button */}
        <a
          href={`tel:${clinicSettings.phone.replace(/\s+/g, '')}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-semibold active:bg-slate-100 transition-colors"
          aria-label="Call clinic"
        >
          <Phone className="w-3.5 h-3.5 text-[#2ba8c9]" />
          <span>{t('Call Now', 'ይደውሉ')}</span>
        </a>

        {/* Primary Book Visit button */}
        <button
          onClick={() => openBooking()}
          className="flex-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#2ba8c9] text-slate-950 text-xs font-bold shadow-sm active:scale-[0.98] transition-transform"
        >
          <Calendar className="w-4 h-4 text-slate-950" />
          <span>{t('Book a visit', 'ቀጠሮ ይያዙ')}</span>
        </button>
      </div>
    </aside>
  );
};

export default MobileBookBar;

import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useBooking } from '../context/BookingContext';

export const NotFoundPage: React.FC = () => {
  const { t } = useLanguage();
  const { openBooking } = useBooking();

  return (
    <main className="pt-36 pb-24 max-w-md mx-auto px-4 text-center">
      <div className="w-16 h-16 rounded-3xl bg-[#e3f4f9] text-[#1c88a6] flex items-center justify-center font-bold text-2xl mx-auto mb-4">
        404
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">
        {t('Page Not Found', 'ገጹ አልተገኘም')}
      </h1>
      <p className="text-xs sm:text-sm text-slate-600 mb-6">
        {t(
          "The dental page you were looking for doesn't exist or has moved. Let's get you back to healthy smiles.",
          'የፈለጉት ገጽ አልተገኘም። ወደ ዋናው ገጽ በመመለስ አገልግሎቶችን መመልከት ይችላሉ።'
        )}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white font-semibold text-xs"
        >
          <Home className="w-4 h-4" />
          <span>{t('Back to Home', 'ወደ ዋና ገጽ')}</span>
        </Link>
        <button
          onClick={() => openBooking()}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#2ba8c9] text-slate-950 font-bold text-xs"
        >
          <Calendar className="w-4 h-4" />
          <span>{t('Book a visit', 'ቀጠሮ ይያዙ')}</span>
        </button>
      </div>
    </main>
  );
};

export default NotFoundPage;

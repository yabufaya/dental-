import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, Clock } from 'lucide-react';
import { useNearViewport } from '../../hooks/useNearViewport';
import { getOpenStatus } from '../../utils/hours';
import { OpeningHours } from '../../types/clinic';
import { useLanguage } from '../../context/LanguageContext';

interface ContactMapProps {
  name: string;
  nameAm?: string;
  address: string;
  landmark?: string;
  hours: OpeningHours;
  lat: number;
  lng: number;
  mapEmbedUrl?: string; // admin-provided Google "Embed a map" src — wins over lat/lng
  placeId?: string;
}

export const ContactMap: React.FC<ContactMapProps> = ({
  name,
  nameAm,
  address,
  landmark,
  hours,
  lat,
  lng,
  mapEmbedUrl,
  placeId,
}) => {
  const { language, t } = useLanguage();
  const [ref, near] = useNearViewport('400px');
  const [active, setActive] = useState(false);
  const isTouch = typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches;
  const status = getOpenStatus(hours);

  // Opens Google Maps (phone map app on mobile) with the clinic as destination
  const directionsUrl =
    `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}` +
    (placeId ? `&destination_place_id=${placeId}` : '');
  const viewUrl =
    `https://www.google.com/maps/search/?api=1&query=${lat},${lng}` +
    (placeId ? `&query_place_id=${placeId}` : '');

  // Prefer the admin-provided Google embed URL (from clinic_settings);
  // otherwise fall back to a coordinate-based embed.
  const embedUrl = mapEmbedUrl?.trim()
    ? mapEmbedUrl.trim()
    : `https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=15&output=embed`;

  return (
    <div className="relative rounded-[24px] overflow-hidden bg-white border border-slate-200/90 shadow-xl flex flex-col">
      {/* Map View Area */}
      <div ref={ref} className="relative h-[320px] sm:h-[420px] w-full bg-slate-100 overflow-hidden">
        {near ? (
          <>
            <iframe
              src={embedUrl}
              title={`Map showing ${name}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="w-full h-full border-0 block"
            />

            {/* Mobile Touch Overlay: prevents trapping page scroll until tapped */}
            {isTouch && !active && (
              <button
                type="button"
                onClick={() => setActive(true)}
                className="absolute inset-0 z-10 w-full h-full bg-slate-900/10 backdrop-blur-[1px] flex items-end justify-center pb-12 text-xs font-semibold text-slate-900 select-none"
              >
                <span className="bg-white/95 px-4 py-2 rounded-full shadow-md border border-slate-200">
                  {t('Tap to use interactive map', 'ካርታውን ለመጠቀም ይጫኑ')}
                </span>
              </button>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-50 animate-pulse">
            <div className="text-xs text-slate-400">{t('Loading map...', 'ካርታ እየተጫነ ነው...')}</div>
          </div>
        )}

        {/* View larger map link at bottom-left */}
        <a
          href={viewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute left-3 bottom-3 z-20 px-3 py-1.5 rounded-lg bg-white/95 hover:bg-white text-[#1a73e8] text-xs font-semibold shadow-md border border-slate-200 flex items-center gap-1.5 transition-colors"
        >
          <span>{t('View larger map', 'በትልቅ ካርታ')}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* The Google-Style Place Card (Over top-left on desktop, stacked below on mobile) */}
      <div className="sm:absolute sm:top-3 sm:left-3 z-20 w-full sm:max-w-[310px] p-4 bg-white/95 backdrop-blur-md sm:rounded-2xl shadow-lg border-t sm:border border-slate-200/90">
        <strong className="block font-bold text-base text-slate-900 leading-tight">
          {language === 'am' && nameAm ? nameAm : name}
        </strong>

        <p className="text-xs text-slate-600 mt-1 leading-snug">
          {address}
          {landmark ? ` · ${landmark}` : ''}
        </p>

        <div className="mt-2 mb-3 flex items-center gap-1.5 text-xs">
          <span
            className={`w-2 h-2 rounded-full ${
              status.open ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
            }`}
          />
          <span className={`font-semibold ${status.open ? 'text-emerald-700' : 'text-rose-700'}`}>
            {language === 'am' ? status.labelAm : status.label}
          </span>
        </div>

        {/* One primary directions button */}
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-[#2ba8c9] hover:bg-[#1c88a6] text-slate-950 font-bold text-xs shadow-sm transition-transform active:scale-95"
        >
          <Navigation className="w-3.5 h-3.5 fill-slate-950" />
          <span>{t('Get directions', 'አቅጣጫ አሳየኝ')}</span>
        </a>
      </div>
    </div>
  );
};

export default ContactMap;

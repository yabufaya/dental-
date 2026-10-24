import { OpeningHours } from '../types/clinic';

export interface OpenStatus {
  open: boolean;
  label: string;
  labelAm: string;
}

export function getOpenStatus(hours: OpeningHours, now: Date = new Date()): OpenStatus {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Africa/Addis_Ababa',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(now);

    const get = (type: string) => parts.find((p) => p.type === type)?.value;
    const weekdayStr = get('weekday')?.toLowerCase().slice(0, 3) as keyof OpeningHours;
    const hour = Number(get('hour') || 0);
    const minute = Number(get('minute') || 0);
    const currentMins = (hour % 24) * 60 + minute;

    const today = hours?.[weekdayStr];
    if (!today) {
      return {
        open: false,
        label: 'Closed today (Sunday)',
        labelAm: 'ዛሬ ዝግ ነው (እሑድ)',
      };
    }

    const toMin = (s: string) => {
      const [h, m] = s.split(':').map(Number);
      return h * 60 + (m || 0);
    };

    const openMin = toMin(today.open);
    const closeMin = toMin(today.close);

    const isOpen = currentMins >= openMin && currentMins < closeMin;

    if (isOpen) {
      return {
        open: true,
        label: `Open now · until ${today.close}`,
        labelAm: `አሁን ክፍት ነው · እስከ ${today.close}`,
      };
    } else if (currentMins < openMin) {
      return {
        open: false,
        label: `Closed now · Opens at ${today.open}`,
        labelAm: `አሁን ዝግ ነው · በ ${today.open} ይከፈታል`,
      };
    } else {
      return {
        open: false,
        label: 'Closed for the day · Opens tomorrow 08:30',
        labelAm: 'ለዛሬ ተዘግቷል · ነገ ጧት 08:30 ይከፈታል',
      };
    }
  } catch {
    return {
      open: true,
      label: 'Open now · Mon-Sat',
      labelAm: 'ክፍት ነው · ሰኞ - ቅዳሜ',
    };
  }
}

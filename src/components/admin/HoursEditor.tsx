import React from 'react';
import { Clock } from 'lucide-react';
import { C } from '../../admin/theme';

export type DayVal = { open: string; close: string } | null;
export interface HoursValue {
  mon: DayVal; tue: DayVal; wed: DayVal; thu: DayVal; fri: DayVal; sat: DayVal; sun: DayVal;
}

type GroupKey = 'weekdays' | 'sat' | 'sun';
const WEEKDAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri'] as const;

const DEFAULTS: Record<GroupKey, NonNullable<DayVal>> = {
  weekdays: { open: '08:30', close: '17:30' },
  sat: { open: '09:00', close: '15:30' },
  sun: { open: '09:00', close: '15:30' },
};

/** Friendly opening-hours editor: Mon–Fri as one row, Sat & Sun separate.
 *  Converts ⇄ the jsonb `hours` column — admins never see JSON. */
const HoursEditor: React.FC<{ value: HoursValue | null; onChange: (h: HoursValue) => void }> = ({
  value,
  onChange,
}) => {
  const current: HoursValue = value ?? {
    mon: null, tue: null, wed: null, thu: null, fri: null, sat: null, sun: null,
  };

  // Are Mon–Fri currently identical? If not, we note that saving unifies them.
  const weekdayVals = WEEKDAY_KEYS.map((k) => JSON.stringify(current[k]));
  const weekdaysMixed = new Set(weekdayVals).size > 1;
  const weekdayVal = current.mon;

  const getVal = (group: GroupKey): DayVal =>
    group === 'weekdays' ? weekdayVal : current[group];

  const emit = (group: GroupKey, next: DayVal) => {
    const updated = { ...current };
    if (group === 'weekdays') {
      WEEKDAY_KEYS.forEach((k) => { updated[k] = next; });
    } else {
      updated[group] = next;
    }
    onChange(updated);
  };

  const setTime = (group: GroupKey, field: 'open' | 'close', v: string) => {
    const base = getVal(group) ?? DEFAULTS[group];
    emit(group, { ...base, [field]: v });
  };

  const toggleClosed = (group: GroupKey, closed: boolean) => {
    emit(group, closed ? null : { ...DEFAULTS[group] });
  };

  const Row: React.FC<{ group: GroupKey; label: string; labelAm: string }> = ({ group, label, labelAm }) => {
    const val = getVal(group);
    const closed = val === null;
    const inputCls = `px-2.5 py-1.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#2ba8c9] disabled:opacity-40 ${C.input}`;

    return (
      <div className={`flex flex-wrap items-center gap-3 p-3 rounded-xl border bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800`}>
        <div className="w-40">
          <div className="text-sm font-bold">{label}</div>
          <div className="text-[11px] text-slate-500">{labelAm}</div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="time"
            value={val?.open ?? DEFAULTS[group].open}
            disabled={closed}
            onChange={(e) => setTime(group, 'open', e.target.value)}
            className={inputCls}
          />
          <span className="text-slate-400 text-sm">–</span>
          <input
            type="time"
            value={val?.close ?? DEFAULTS[group].close}
            disabled={closed}
            onChange={(e) => setTime(group, 'close', e.target.value)}
            className={inputCls}
          />
        </div>

        <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 cursor-pointer ml-auto">
          <input
            type="checkbox"
            checked={closed}
            onChange={(e) => toggleClosed(group, e.target.checked)}
            className="w-4 h-4 rounded border-slate-400 accent-red-500"
          />
          Closed
        </label>
      </div>
    );
  };

  return (
    <div className={`border rounded-2xl p-5 ${C.card}`}>
      <div className="flex items-center gap-2 mb-1">
        <Clock className="w-4 h-4 text-[#1c88a6] dark:text-[#2ba8c9]" />
        <h3 className="text-sm font-bold">Opening Hours</h3>
      </div>
      <p className="text-[11px] text-slate-500 mb-4">
        Shown on the website and used for the “Open now” status. Sunday closed = emergency only.
      </p>

      <div className="space-y-2.5">
        <Row group="weekdays" label="Monday – Friday" labelAm="ከሰኞ – ዓርብ (አንድ አይነት)" />
        <Row group="sat" label="Saturday" labelAm="ቅዳሜ" />
        <Row group="sun" label="Sunday" labelAm="እሑድ" />
      </div>

      {weekdaysMixed && (
        <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-3">
          ⚠ Weekday times currently differ per day — editing “Monday – Friday” unifies them all.
        </p>
      )}
    </div>
  );
};

export default HoursEditor;

import type { OpeningHours } from '../types/clinic';

/**
 * ── Slot engine ──────────────────────────────────────────────────────
 * The clinic's working window is 08:00 → 17:00 in 30-minute spans,
 * so slot START times run 08:00 … 16:30 (17:00 is the last end, not a start).
 * Rules:
 *  • clinic-wide ONE booking per slot (decided: simplest sellable model)
 *  • a slot on a Closed day (hours.sun === null etc.) is never bookable
 *  • today → a slot is bookable only if it starts ≥ 2 hours from now
 * Source of truth for "taken": the public `booked_slots` view
 * (exposes date+slot only — never patient data).
 * ────────────────────────────────────────────────────────────────────
 */

export interface Slot {
  /** canonical stored form, e.g. "14:30" (24-hour) */
  value: string;
  /** visitor-facing label, e.g. "2:30 PM" */
  label: string;
}

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;

/** All 18 start times of the day — kept even on custom shorter hours
 *  because the admin's Hours editor sets the visible range via
 *  `defaultOpenHours`; the grid here stays the full legal window and
 *  the admin UI edits which of them exist. (Currently fixed window.) */
export const ALL_SLOTS: Slot[] = (() => {
  const out: Slot[] = [];
  for (let h = 8; h < 17; h++) {
    for (const m of [0, 30]) {
      const value = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      const h12 = h > 12 ? h - 12 : h;
      out.push({ value, label: `${h12}:${m === 0 ? '00' : '30'} ${h >= 12 ? 'PM' : 'AM'}` });
    }
  }
  return out; // 08:00 … 16:30 → 18 slots
})();

export const formatSlot = (value: string): string =>
  ALL_SLOTS.find((s) => s.value === value)?.label ?? value;

/** Is the clinic open on this date at all? (uses admin's opening hours) */
export const isClosedDate = (dateISO: string, hours: OpeningHours): boolean => {
  const d = new Date(`${dateISO}T00:00:00`);
  if (Number.isNaN(d.getTime())) return true;
  return hours[DAY_KEYS[d.getDay()]] === null;
};

export const closedReason = (dateISO: string, hours: OpeningHours): string | null => {
  if (!isClosedDate(dateISO, hours)) return null;
  const names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const d = new Date(`${dateISO}T00:00:00`);
  return `Closed on ${names[d.getDay()]}s`;
};

/** Same-day rule: a slot today must start at least 2h from now. */
const LEAD_MS = 2 * 60 * 60 * 1000;

const slotStartMs = (dateISO: string, slotValue: string): number =>
  new Date(`${dateISO}T${slotValue}:00`).getTime();

/** Full decision for ONE slot on ONE date. */
export function slotState(
  dateISO: string,
  slot: Slot,
  hours: OpeningHours,
  taken: ReadonlySet<string>, // canonical slot.values already taken
  now = Date.now(),
): 'available' | 'closed' | 'past' | 'tooSoon' | 'taken' {
  if (isClosedDate(dateISO, hours)) return 'closed';
  if (taken.has(slot.value)) return 'taken';
  const todayISO = new Date(now).toLocaleDateString('en-CA'); // local YYYY-MM-DD
  if (dateISO === todayISO) {
    const t = slotStartMs(dateISO, slot.value);
    if (t <= now) return 'past';
    if (t - now < LEAD_MS) return 'tooSoon';
  }
  return 'available';
}

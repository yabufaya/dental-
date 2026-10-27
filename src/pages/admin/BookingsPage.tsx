import React, { useCallback, useEffect, useState } from 'react';
import { RefreshCw, Trash2, Search, Phone, MessageCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { C, STATUS_STYLES } from '../../admin/theme';
import { formatSlot } from '../../lib/slots';

const todayISO = () => new Date().toLocaleDateString('en-CA'); // local YYYY-MM-DD

interface BookingRow {
  id: string;
  booking_ref: string;
  patient_name: string;
  phone: string;
  service_id: string | null;
  doctor_id: string | null;
  preferred_date: string;
  time_slot: string;
  notes: string | null;
  status: 'pending' | 'confirmed' | 'cancelled' | 'done';
  created_at: string;
}

const STATUS_FILTERS = ['all', 'pending', 'confirmed', 'done', 'cancelled'] as const;
const SCOPE_TABS = [
  { id: 'today', label: 'Today' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'all', label: 'All dates' },
] as const;
type Scope = (typeof SCOPE_TABS)[number]['id'];

const NEXT_ACTIONS: Record<string, { label: string; to: BookingRow['status']; style: string }[]> = {
  pending: [
    { label: 'Confirm', to: 'confirmed', style: 'bg-emerald-600 hover:bg-emerald-500 text-white' },
    { label: 'Cancel', to: 'cancelled', style: 'border hover:bg-red-100 dark:hover:bg-red-600/70' },
  ],
  confirmed: [
    { label: 'Mark done', to: 'done', style: 'bg-sky-600 hover:bg-sky-500 text-white' },
    { label: 'Cancel', to: 'cancelled', style: 'border hover:bg-red-100 dark:hover:bg-red-600/70' },
  ],
  done: [],
  cancelled: [
    { label: 'Re-open', to: 'pending', style: 'border hover:bg-slate-100 dark:hover:bg-slate-700' },
  ],
};

const BookingsPage: React.FC = () => {
  const [rows, setRows] = useState<BookingRow[]>([]);
  const [serviceNames, setServiceNames] = useState<Record<string, string>>({});
  const [doctorNames, setDoctorNames] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<(typeof STATUS_FILTERS)[number]>('all');
  const [scope, setScope] = useState<Scope>('today');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    let query = supabase
      .from('bookings')
      .select('*')
      .order('preferred_date', { ascending: scope !== 'today' })
      .order('time_slot', { ascending: true });
    if (scope === 'today') query = query.eq('preferred_date', todayISO());
    if (scope === 'upcoming') query = query.gte('preferred_date', todayISO());
    if (filter !== 'all') query = query.eq('status', filter);
    if (search.trim()) {
      query = query.or(`patient_name.ilike.%${search.trim()}%,phone.ilike.%${search.trim()}%,booking_ref.ilike.%${search.trim()}%`);
    }
    const [bookingsRes, servicesRes, doctorsRes] = await Promise.all([
      query,
      supabase.from('services').select('id, title'),
      supabase.from('doctors').select('id, name'),
    ]);
    if (bookingsRes.error) {
      setError(`${bookingsRes.error.message} — did you run supabase/schema.sql yet?`);
    } else {
      setRows((bookingsRes.data ?? []) as BookingRow[]);
      setServiceNames(Object.fromEntries((servicesRes.data ?? []).map((s) => [s.id, s.title])));
      setDoctorNames(Object.fromEntries((doctorsRes.data ?? []).map((d) => [d.id, d.name])));
    }
    setLoading(false);
  }, [filter, scope, search]);

  useEffect(() => {
    const t = setTimeout(load, search ? 250 : 0);
    return () => clearTimeout(t);
  }, [load, search]);

  // ⚡ Admin-only realtime: a visitor's new booking pops in without refresh.
  // The private channel is gated by the realtime.messages policy
  // (migration-006) — only emails on the admin allowlist may listen.
  useEffect(() => {
    const channel = supabase
      .channel('admin-bookings', { config: { private: true } })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const row = payload.new as BookingRow;
          setToast(`🔔 New booking: ${row.patient_name} · ${row.booking_ref} · ${row.preferred_date} ${formatSlot(row.time_slot)}`);
          window.setTimeout(() => setToast(null), 9000);
        }
        load();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [load]);

  const setStatus = async (id: string, status: BookingRow['status']) => {
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
    if (error) setError(error.message);
    else load();
  };

  const remove = async (id: string, ref: string) => {
    if (!window.confirm(`Delete booking ${ref} permanently?`)) return;
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (error) setError(error.message);
    else load();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl font-bold">Bookings</h1>
          <p className="text-xs text-slate-500 mt-0.5">{rows.length} shown</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name / phone / ref…"
              className={`pl-9 pr-3 py-2 rounded-lg border text-xs w-56 focus:outline-none focus:ring-2 focus:ring-[#2ba8c9] ${C.input}`}
            />
          </div>
          <button onClick={load} className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border ${C.neutralBtn}`}>
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* Date-scope tabs: Today / Upcoming / All */}
      <div className={`inline-flex rounded-xl border p-1 gap-1 mb-3 ${C.card}`}>
        {SCOPE_TABS.map((tb) => (
          <button
            key={tb.id}
            onClick={() => setScope(tb.id)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              scope === tb.id
                ? 'bg-[#2ba8c9] text-slate-950'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition-colors ${
              filter === s
                ? 'bg-[#2ba8c9] text-slate-950'
                : 'bg-white text-slate-500 border border-slate-300 hover:border-slate-500 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800 dark:hover:border-slate-600'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {error && <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 text-xs">{error}</div>}

      <div className={`border rounded-2xl overflow-hidden ${C.card}`}>
        {loading ? (
          <div className="p-10 flex justify-center">
            <div className={`w-7 h-7 border-2 rounded-full animate-spin ${C.spinner}`} />
          </div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">No bookings match this filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`text-left text-[11px] uppercase tracking-wider text-slate-500 border-b ${C.borderB}`}>
                  <th className="px-4 py-2.5">Ref</th>
                  <th className="px-4 py-2.5">Date &amp; time</th>
                  <th className="px-4 py-2.5">Patient</th>
                  <th className="px-4 py-2.5">Service</th>
                  <th className="px-4 py-2.5">Doctor</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((b) => (
                  <tr key={b.id} className={`border-b border-slate-100 last:border-0 dark:border-slate-800/60 ${C.rowHover}`}>
                    <td className="px-4 py-3 font-mono text-xs text-[#1c88a6] dark:text-[#2ba8c9]">{b.booking_ref}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-semibold">{b.preferred_date}</div>
                      <div className="text-[11px] text-slate-500">{formatSlot(b.time_slot)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold">{b.patient_name}</div>
                      <div className="text-[11px] text-slate-500">{b.phone}</div>
                      {b.notes && <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 italic max-w-[220px]">“{b.notes}”</div>}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{b.service_id ? serviceNames[b.service_id] ?? b.service_id : '—'}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{b.doctor_id ? doctorNames[b.doctor_id] ?? b.doctor_id : 'First available'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-bold px-2 py-1 rounded-full border ${STATUS_STYLES[b.status]}`}>{b.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5 items-center">
                        <a
                          href={`tel:${b.phone}`}
                          className={`p-1.5 rounded-lg border ${C.neutralBtn}`}
                          title={`Call ${b.patient_name}`}
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`https://wa.me/${b.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${b.patient_name}, this is Dentora Dental Clinic about your booking ${b.booking_ref}.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`p-1.5 rounded-lg border ${C.neutralBtn}`}
                          title={`WhatsApp ${b.patient_name}`}
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                        </a>
                        {(NEXT_ACTIONS[b.status] ?? []).map((a) => (
                          <button key={a.to} onClick={() => setStatus(b.id, a.to)} className={`text-[11px] font-bold px-2.5 py-1.5 rounded-lg ${a.style} ${a.style.includes('border') ? C.neutralBtn : ''}`}>
                            {a.label}
                          </button>
                        ))}
                        <button onClick={() => remove(b.id, b.booking_ref)} className={`text-[11px] font-bold px-2.5 py-1.5 rounded-lg border hover:bg-red-100 dark:hover:bg-red-600/80 ${C.neutralBtn}`} title="Delete booking">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 🔔 realtime toast: new booking arrived while you were here */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm p-4 rounded-2xl border shadow-xl text-xs font-semibold bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-700 dark:text-emerald-200">
          {toast}
        </div>
      )}
    </div>
  );
};

export default BookingsPage;

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CalendarDays, Users, CheckCircle, Banknote, RefreshCw,
  CalendarRange, BarChart3, Download, Repeat2, XCircle,
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from 'recharts';
import { supabase } from '../../lib/supabase';
import { C } from '../../admin/theme';
import { ALL_SLOTS } from '../../lib/slots';

/**
 * 📊 Analytics — bookings intelligence with Day / Week / Month / Custom ranges.
 * All aggregation is client-side: a clinic's booking volume (~hundreds/month)
 * is tiny, so we fetch the rows once per range and compute in memory.
 */

interface BookingRow {
  id: string;
  booking_ref: string;
  patient_name: string;
  phone: string;
  service_id: string | null;
  doctor_id: string | null;
  preferred_date: string; // YYYY-MM-DD
  time_slot: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'done';
  created_at: string;
}

type RangeId = 'day' | 'week' | 'month' | 'custom';
const RANGES: { id: RangeId; label: string }[] = [
  { id: 'day', label: 'Today' },
  { id: 'week', label: 'This week' },
  { id: 'month', label: 'This month' },
  { id: 'custom', label: 'Custom' },
];

const PIE_COLORS: Record<string, string> = {
  pending: '#f59e0b', confirmed: '#10b981', done: '#0ea5e9', cancelled: '#f43f5e',
};
const ACCENT = '#2ba8c9';
const AXIS = '#94a3b8'; // readable in both light & dark admin
const GRID = 'rgba(148,163,184,0.18)';

const addDays = (iso: string, n: number): string => {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + n);
  return d.toLocaleDateString('en-CA');
};
const todayISO = () => new Date().toLocaleDateString('en-CA');

/** Monday-start week bounds */
const weekStartOf = (iso: string): string => {
  const d = new Date(`${iso}T00:00:00`);
  const dow = (d.getDay() + 6) % 7; // Mon=0 … Sun=6
  return addDays(iso, -dow);
};
const monthBounds = (iso: string): [string, string] => {
  const d = new Date(`${iso}T00:00:00`);
  const first = new Date(d.getFullYear(), d.getMonth(), 1);
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  return [first.toLocaleDateString('en-CA'), last.toLocaleDateString('en-CA')];
};
const eachDay = (from: string, to: string): string[] => {
  const out: string[] = [];
  for (let d = from; d <= to; d = addDays(d, 1)) out.push(d);
  return out;
};
const dayLabel = (iso: string): string =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' });

const AnalyticsPage: React.FC = () => {
  const [rangeId, setRangeId] = useState<RangeId>('week');
  const [customFrom, setCustomFrom] = useState(todayISO());
  const [customTo, setCustomTo] = useState(todayISO());
  const [rows, setRows] = useState<BookingRow[]>([]);
  const [serviceMeta, setServiceMeta] = useState<Record<string, { title: string; price: number }>>({});
  const [doctorNames, setDoctorNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // resolved date bounds for the active range
  const [from, to]: [string, string] = useMemo(() => {
    const today = todayISO();
    if (rangeId === 'day') return [today, today];
    if (rangeId === 'week') { const ws = weekStartOf(today); return [ws, addDays(ws, 6)]; }
    if (rangeId === 'month') return monthBounds(today);
    return [customFrom, customTo];
  }, [rangeId, customFrom, customTo]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [bRes, sRes, dRes] = await Promise.all([
      supabase.from('bookings').select('*').gte('preferred_date', from).lte('preferred_date', to)
        .order('preferred_date').order('time_slot'),
      supabase.from('services').select('id, title, price_from_etb'),
      supabase.from('doctors').select('id, name'),
    ]);
    if (bRes.error) setError(`${bRes.error.message} — did you run schema.sql / migrations?`);
    else {
      setRows((bRes.data ?? []) as BookingRow[]);
      setServiceMeta(Object.fromEntries((sRes.data ?? []).map((s) => [s.id, { title: s.title, price: s.price_from_etb }])));
      setDoctorNames(Object.fromEntries((dRes.data ?? []).map((d) => [d.id, d.name])));
    }
    setLoading(false);
  }, [from, to]);

  useEffect(() => { load(); }, [load]);

  // For new/returning math we also need each phone's EARLIEST booking overall.
  const [firstSeen, setFirstSeen] = useState<Record<string, string>>({});
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('bookings').select('phone, preferred_date');
      const map: Record<string, string> = {};
      for (const r of data ?? []) {
        const row = r as { phone: string; preferred_date: string };
        if (!map[row.phone] || row.preferred_date < map[row.phone]) map[row.phone] = row.preferred_date;
      }
      setFirstSeen(map);
    })();
  }, []);

  /* ── aggregations ─────────────────────────────────────────── */
  const kpis = useMemo(() => {
    const total = rows.length;
    const done = rows.filter((r) => r.status === 'done').length;
    const cancelled = rows.filter((r) => r.status === 'cancelled').length;
    const revenue = rows.filter((r) => r.status === 'done')
      .reduce((sum, r) => sum + (r.service_id ? serviceMeta[r.service_id]?.price ?? 0 : 0), 0);
    const phones = new Set(rows.map((r) => r.phone));
    const newPatients = [...phones].filter((p) => firstSeen[p] && firstSeen[p] >= from && firstSeen[p] <= to).length;
    return {
      total, done, cancelled, revenue, newPatients,
      returning: phones.size - newPatients,
      completionRate: total ? Math.round((done / total) * 100) : 0,
      cancelRate: total ? Math.round((cancelled / total) * 100) : 0,
      todayCount: rows.filter((r) => r.preferred_date === todayISO()).length,
    };
  }, [rows, serviceMeta, firstSeen, from, to]);

  // Adaptive timeline: day→slot bars, week→Mon..Sun bars, month/custom→per-day area
  const timeline = useMemo(() => {
    if (rangeId === 'day') {
      const counts = new Map<string, number>();
      rows.forEach((r) => counts.set(r.time_slot, (counts.get(r.time_slot) ?? 0) + 1));
      return ALL_SLOTS.map((s) => ({ name: s.label, bookings: counts.get(s.value) ?? 0 }));
    }
    const days = eachDay(from, to);
    const counts = new Map<string, number>();
    rows.forEach((r) => counts.set(r.preferred_date, (counts.get(r.preferred_date) ?? 0) + 1));
    return days.map((d) => ({ name: dayLabel(d), bookings: counts.get(d) ?? 0 }));
  }, [rows, rangeId, from, to]);

  const statusPie = useMemo(() => (
    (['pending', 'confirmed', 'done', 'cancelled'] as const)
      .map((st) => ({ name: st, value: rows.filter((r) => r.status === st).length }))
      .filter((s) => s.value > 0)
  ), [rows]);

  const topServices = useMemo(() => {
    const m = new Map<string, number>();
    rows.forEach((r) => {
      const name = r.service_id ? serviceMeta[r.service_id]?.title ?? r.service_id : 'No service';
      m.set(name, (m.get(name) ?? 0) + 1);
    });
    return [...m.entries()].map(([name, bookings]) => ({ name, bookings }))
      .sort((a, b) => b.bookings - a.bookings).slice(0, 8);
  }, [rows, serviceMeta]);

  const perDoctor = useMemo(() => {
    const m = new Map<string, number>();
    rows.forEach((r) => {
      const name = r.doctor_id ? doctorNames[r.doctor_id] ?? r.doctor_id : 'First available';
      m.set(name, (m.get(name) ?? 0) + 1);
    });
    return [...m.entries()].map(([name, bookings]) => ({ name, bookings }))
      .sort((a, b) => b.bookings - a.bookings);
  }, [rows, doctorNames]);

  const busiestSlots = useMemo(() => {
    const m = new Map<string, number>();
    rows.forEach((r) => m.set(r.time_slot, (m.get(r.time_slot) ?? 0) + 1));
    return [...m.entries()]
      .map(([slot, bookings]) => ({ name: ALL_SLOTS.find((s) => s.value === slot)?.label ?? slot, bookings }))
      .sort((a, b) => b.bookings - a.bookings).slice(0, 6);
  }, [rows]);

  /* ── CSV export of everything in range ────────────────────── */
  const exportCsv = () => {
    const head = 'booking_ref,patient_name,phone,service,doctor,date,slot,status,created_at\n';
    const body = rows.map((r) => [
      r.booking_ref, `"${r.patient_name.replace(/"/g, '""')}"`, r.phone,
      `"${(r.service_id ? serviceMeta[r.service_id]?.title ?? r.service_id : '').replace(/"/g, '""')}"`,
      `"${(r.doctor_id ? doctorNames[r.doctor_id] ?? r.doctor_id : 'First available').replace(/"/g, '""')}"`,
      r.preferred_date, r.time_slot, r.status, r.created_at,
    ].join(',')).join('\n');
    const href = URL.createObjectURL(new Blob([head + body], { type: 'text/csv' }));
    const a = Object.assign(document.createElement('a'), { href, download: `bookings_${from}_${to}.csv` });
    a.click();
    URL.revokeObjectURL(href);
  };

  const card = `border rounded-2xl p-4 ${C.card}`;
  const kpiCards = [
    { icon: CalendarDays, label: 'Bookings in range', value: kpis.total, color: 'text-[#1c88a6] dark:text-[#2ba8c9]' },
    { icon: CalendarRange, label: 'Today', value: kpis.todayCount, color: 'text-indigo-500' },
    { icon: Users, label: 'New patients', value: kpis.newPatients, color: 'text-emerald-500' },
    { icon: Repeat2, label: 'Returning patients', value: kpis.returning, color: 'text-teal-500' },
    { icon: CheckCircle, label: 'Completion rate', value: `${kpis.completionRate}%`, color: 'text-sky-500' },
    { icon: XCircle, label: 'Cancellation rate', value: `${kpis.cancelRate}%`, color: 'text-rose-500' },
    { icon: Banknote, label: 'Est. revenue (done)', value: `${kpis.revenue.toLocaleString()} ETB`, color: 'text-amber-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* header + range switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#1c88a6] dark:text-[#2ba8c9]" /> Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {daysLabel()} · {rows.length} bookings
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className={`inline-flex rounded-xl border p-1 gap-1 ${C.card}`}>
            {RANGES.map((r) => (
              <button
                key={r.id}
                onClick={() => setRangeId(r.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  rangeId === r.id ? 'bg-[#2ba8c9] text-slate-950' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <button onClick={load} className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border ${C.neutralBtn}`}>
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button onClick={exportCsv} className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg bg-[#2ba8c9] text-slate-950 hover:bg-[#1c88a6]">
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
        </div>
      </div>

      {rangeId === 'custom' && (
        <div className={`${card} mb-4 flex items-center gap-3 flex-wrap`}>
          <label className="text-xs font-semibold text-slate-500">From
            <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)}
              className={`ml-2 px-2.5 py-1.5 rounded-lg border text-xs ${C.input}`} />
          </label>
          <label className="text-xs font-semibold text-slate-500">To
            <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)}
              className={`ml-2 px-2.5 py-1.5 rounded-lg border text-xs ${C.input}`} />
          </label>
        </div>
      )}

      {error && <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 text-xs">{error}</div>}

      {loading ? (
        <div className="p-16 flex justify-center">
          <div className={`w-7 h-7 border-2 rounded-full animate-spin ${C.spinner}`} />
        </div>
      ) : (
        <div className="space-y-4">
          {/* KPI row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {kpiCards.map((k) => (
              <div key={k.label} className={card}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{k.label}</span>
                  <k.icon className={`w-4 h-4 ${k.color}`} />
                </div>
                <div className="text-2xl font-bold mt-1.5">{k.value}</div>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className={`${card} h-72`}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              {rangeId === 'day' ? 'Bookings per slot today' : rangeId === 'week' ? 'Bookings per day this week' : 'Bookings per day'}
            </h3>
            <ResponsiveContainer width="100%" height="88%">
              {rangeId === 'month' || rangeId === 'custom' ? (
                <AreaChart data={timeline}>
                  <defs>
                    <linearGradient id="bk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={ACCENT} stopOpacity={0.5} />
                      <stop offset="100%" stopColor={ACCENT} stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={GRID} vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: AXIS, fontSize: 10 }} tickLine={false} interval="preserveStartEnd" />
                  <YAxis allowDecimals={false} tick={{ fill: AXIS, fontSize: 10 }} tickLine={false} axisLine={false} width={30} />
                  <Tooltip contentStyle={tipStyle} labelStyle={{ color: '#0f172a' }} />
                  <Area type="monotone" dataKey="bookings" stroke={ACCENT} fill="url(#bk)" strokeWidth={2} />
                </AreaChart>
              ) : (
                <BarChart data={timeline}>
                  <CartesianGrid stroke={GRID} vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: AXIS, fontSize: 10 }} tickLine={false} interval={rangeId === 'day' ? 2 : 0} angle={rangeId === 'day' ? -35 : 0} textAnchor={rangeId === 'day' ? 'end' : 'middle'} height={rangeId === 'day' ? 50 : 30} />
                  <YAxis allowDecimals={false} tick={{ fill: AXIS, fontSize: 10 }} tickLine={false} axisLine={false} width={30} />
                  <Tooltip contentStyle={tipStyle} labelStyle={{ color: '#0f172a' }} />
                  <Bar dataKey="bookings" fill={ACCENT} radius={[6, 6, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* mix row: donut + top services */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className={`${card} h-72`}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Status breakdown</h3>
              <ResponsiveContainer width="100%" height="88%">
                <PieChart>
                  <Pie data={statusPie} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3} strokeWidth={0}>
                    {statusPie.map((s) => <Cell key={s.name} fill={PIE_COLORS[s.name]} />)}
                  </Pie>
                  <Tooltip contentStyle={tipStyle} labelStyle={{ color: '#0f172a' }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} formatter={(v: string) => <span style={{ color: AXIS }}>{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className={`${card} h-72`}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Top services</h3>
              <ResponsiveContainer width="100%" height="88%">
                <BarChart data={topServices} layout="vertical">
                  <CartesianGrid stroke={GRID} horizontal={false} />
                  <XAxis type="number" allowDecimals={false} tick={{ fill: AXIS, fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fill: AXIS, fontSize: 10 }} tickLine={false} axisLine={false} width={110} />
                  <Tooltip contentStyle={tipStyle} labelStyle={{ color: '#0f172a' }} />
                  <Bar dataKey="bookings" fill="#818cf8" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* doctors + busiest slots */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className={`${card} h-64`}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Bookings per doctor</h3>
              <ResponsiveContainer width="100%" height="88%">
                <BarChart data={perDoctor}>
                  <CartesianGrid stroke={GRID} vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: AXIS, fontSize: 10 }} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fill: AXIS, fontSize: 10 }} tickLine={false} axisLine={false} width={30} />
                  <Tooltip contentStyle={tipStyle} labelStyle={{ color: '#0f172a' }} />
                  <Bar dataKey="bookings" fill="#34d399" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className={`${card} h-64`}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Busiest slots (in range)</h3>
              <ResponsiveContainer width="100%" height="88%">
                <BarChart data={busiestSlots}>
                  <CartesianGrid stroke={GRID} vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: AXIS, fontSize: 10 }} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fill: AXIS, fontSize: 10 }} tickLine={false} axisLine={false} width={30} />
                  <Tooltip contentStyle={tipStyle} labelStyle={{ color: '#0f172a' }} />
                  <Bar dataKey="bookings" fill="#fbbf24" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Range table */}
          <div className={`border rounded-2xl overflow-hidden ${C.card}`}>
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Bookings in range ({rows.length})
              </h3>
            </div>
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-inherit">
                  <tr className={`text-left text-[11px] uppercase tracking-wider text-slate-500 border-b ${C.borderB} bg-white dark:bg-slate-900`}>
                    <th className="px-4 py-2.5">Ref</th>
                    <th className="px-4 py-2.5">Date</th>
                    <th className="px-4 py-2.5">Patient</th>
                    <th className="px-4 py-2.5">Service</th>
                    <th className="px-4 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">No bookings in this range.</td></tr>
                  ) : rows.map((r) => (
                    <tr key={r.id} className={`border-b border-slate-100 last:border-0 dark:border-slate-800/60 ${C.rowHover}`}>
                      <td className="px-4 py-2.5 font-mono text-xs text-[#1c88a6] dark:text-[#2ba8c9]">{r.booking_ref}</td>
                      <td className="px-4 py-2.5 whitespace-nowrap text-xs">{r.preferred_date} · {ALL_SLOTS.find((s) => s.value === r.time_slot)?.label ?? r.time_slot}</td>
                      <td className="px-4 py-2.5">
                        <div className="text-xs font-semibold">{r.patient_name}</div>
                        <div className="text-[11px] text-slate-500">{r.phone}</div>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-slate-600 dark:text-slate-300">
                        {r.service_id ? serviceMeta[r.service_id]?.title ?? r.service_id : '—'}
                      </td>
                      <td className="px-4 py-2.5 text-xs font-bold capitalize">{r.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function daysLabel() {
    return rangeId === 'custom'
      ? `${customFrom} → ${customTo}`
      : `${from} → ${to}${from === to ? ` (${dayLabel(from)})` : ''}`;
  }
};

const tipStyle: React.CSSProperties = {
  background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12,
  fontSize: 12, boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
};

export default AnalyticsPage;

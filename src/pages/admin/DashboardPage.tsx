import React, { useCallback, useEffect, useState } from 'react';
import { CalendarDays, Clock, CheckCircle, XCircle, Users, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { C, STATUS_STYLES } from '../../admin/theme';

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
}

const DashboardPage: React.FC = () => {
  const [todayRows, setTodayRows] = useState<BookingRow[]>([]);
  const [counts, setCounts] = useState({ today: 0, pending: 0, upcoming: 0, total: 0 });
  const [serviceNames, setServiceNames] = useState<Record<string, string>>({});
  const [doctorNames, setDoctorNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().slice(0, 10);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [todayRes, pendingRes, upcomingRes, totalRes, servicesRes, doctorsRes, todayList] =
      await Promise.all([
        supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('preferred_date', today),
        supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('bookings').select('id', { count: 'exact', head: true }).gte('preferred_date', today).neq('status', 'cancelled'),
        supabase.from('bookings').select('id', { count: 'exact', head: true }),
        supabase.from('services').select('id, title'),
        supabase.from('doctors').select('id, name'),
        supabase.from('bookings').select('*').eq('preferred_date', today).order('time_slot', { ascending: true }),
      ]);

    const firstError = [todayRes, pendingRes, upcomingRes, totalRes, todayList].find((r) => r.error)?.error;
    if (firstError) {
      setError(`${firstError.message} — did you run supabase/schema.sql yet?`);
      setLoading(false);
      return;
    }

    setCounts({
      today: todayRes.count ?? 0,
      pending: pendingRes.count ?? 0,
      upcoming: upcomingRes.count ?? 0,
      total: totalRes.count ?? 0,
    });
    setServiceNames(Object.fromEntries((servicesRes.data ?? []).map((s) => [s.id, s.title])));
    setDoctorNames(Object.fromEntries((doctorsRes.data ?? []).map((d) => [d.id, d.name])));
    setTodayRows((todayList.data ?? []) as BookingRow[]);
    setLoading(false);
  }, [today]);

  useEffect(() => { load(); }, [load]);

  // ⚡ Live stats: bookings arrive while you're looking at the dashboard
  // (private channel + realtime.messages RLS → admins only, migration-006).
  useEffect(() => {
    const channel = supabase
      .channel('admin-bookings', { config: { private: true } })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, load)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [load]);

  const setStatus = async (id: string, status: BookingRow['status']) => {
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
    if (error) setError(error.message);
    else load();
  };

  const cards = [
    { label: "Today's appointments", value: counts.today, icon: CalendarDays, color: 'text-[#1c88a6] dark:text-[#2ba8c9]' },
    { label: 'Pending requests', value: counts.pending, icon: Clock, color: 'text-amber-600 dark:text-amber-300' },
    { label: 'Upcoming (all dates)', value: counts.upcoming, icon: Users, color: 'text-emerald-600 dark:text-emerald-300' },
    { label: 'Total bookings', value: counts.total, icon: CheckCircle, color: 'text-sky-600 dark:text-sky-300' },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold">Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">Today is {today}</p>
        </div>
        <button onClick={load} className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border ${C.neutralBtn}`}>
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {error && <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 text-xs">{error}</div>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`border rounded-2xl p-4 ${C.card}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 bg-slate-100 dark:bg-slate-800 ${color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className={`border rounded-2xl overflow-hidden ${C.card}`}>
        <div className={`px-4 py-3 border-b flex items-center justify-between ${C.borderB}`}>
          <h2 className="text-sm font-bold">Today's schedule</h2>
          <span className="text-[11px] text-slate-500">{todayRows.length} appointment(s)</span>
        </div>

        {loading ? (
          <div className="p-10 flex justify-center">
            <div className={`w-7 h-7 border-2 rounded-full animate-spin ${C.spinner}`} />
          </div>
        ) : todayRows.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            No appointments today. New bookings from the website appear here automatically.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`text-left text-[11px] uppercase tracking-wider text-slate-500 border-b ${C.borderB}`}>
                  <th className="px-4 py-2.5">Time</th>
                  <th className="px-4 py-2.5">Patient</th>
                  <th className="px-4 py-2.5">Service</th>
                  <th className="px-4 py-2.5">Doctor</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {todayRows.map((b) => (
                  <tr key={b.id} className={`border-b border-slate-100 last:border-0 dark:border-slate-800/60`}>
                    <td className="px-4 py-3 font-semibold text-[#1c88a6] dark:text-[#2ba8c9] whitespace-nowrap">{b.time_slot}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold">{b.patient_name}</div>
                      <div className="text-[11px] text-slate-500">{b.phone} · {b.booking_ref}</div>
                      {b.notes && <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 italic">“{b.notes}”</div>}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{b.service_id ? serviceNames[b.service_id] ?? b.service_id : '—'}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{b.doctor_id ? doctorNames[b.doctor_id] ?? b.doctor_id : 'First available'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-bold px-2 py-1 rounded-full border ${STATUS_STYLES[b.status]}`}>{b.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        {b.status === 'pending' && (
                          <button onClick={() => setStatus(b.id, 'confirmed')} className="text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white">Confirm</button>
                        )}
                        {b.status === 'confirmed' && (
                          <button onClick={() => setStatus(b.id, 'done')} className="text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white">Mark done</button>
                        )}
                        {b.status !== 'cancelled' && b.status !== 'done' && (
                          <button onClick={() => setStatus(b.id, 'cancelled')} className={`text-[11px] font-bold px-2.5 py-1.5 rounded-lg border hover:bg-red-100 dark:hover:bg-red-600/70 dark:bg-slate-800 ${C.neutralBtn}`}>
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;

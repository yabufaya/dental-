import React, { useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { FieldDef } from '../../admin/resources';
import HoursEditor, { type HoursValue } from '../../components/admin/HoursEditor';
import { C } from '../../admin/theme';

type Row = Record<string, unknown>;

function toFormValue(field: FieldDef, value: unknown): string {
  if (field.type === 'lines') return Array.isArray(value) ? (value as string[]).join('\n') : '';
  if (field.type === 'json') return value ? JSON.stringify(value, null, 2) : '';
  return value === null || value === undefined ? '' : String(value);
}

interface Props {
  title: string;
  description: string;
  fields: FieldDef[];
  includeHours?: boolean; // shows the friendly hours editor (hours jsonb)
}

/** Shared single-row editor for clinic_settings — used by Site Settings and Contact Info. */
const SingleRowSettings: React.FC<Props> = ({ title, description, fields, includeHours }) => {
  const [form, setForm] = useState<Record<string, string>>({});
  const [hours, setHours] = useState<HoursValue | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from('clinic_settings').select('*').eq('id', 1).single();
      if (error) {
        setError(`${error.message} — did you run supabase/schema.sql yet?`);
      } else if (data) {
        const row = data as Row;
        const initial: Record<string, string> = {};
        for (const f of fields) initial[f.key] = toFormValue(f, row[f.key]);
        setForm(initial);
        if (includeHours) setHours((row.hours as HoursValue) ?? null);
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  const save = async () => {
    setSaving(true);
    setError(null);
    setNotice(null);

    const payload: Record<string, unknown> = {};
    for (const f of fields) {
      const str = (form[f.key] ?? '').trim();
      if (f.type === 'number') {
        const n = Number(str);
        if (str !== '' && Number.isNaN(n)) { setError(`"${f.label}" must be a number`); setSaving(false); return; }
        payload[f.key] = str === '' ? null : n;
      } else if (f.type === 'lines') {
        payload[f.key] = str ? str.split('\n').map((l) => l.trim()).filter(Boolean) : [];
      } else if (f.type === 'json') {
        try { payload[f.key] = str ? JSON.parse(str) : null; }
        catch { setError(`"${f.label}" is not valid JSON`); setSaving(false); return; }
      } else {
        payload[f.key] = str === '' ? null : str;
      }
    }
    if (includeHours) payload.hours = hours;
    payload.updated_at = new Date().toISOString();

    const { error } = await supabase.from('clinic_settings').update(payload).eq('id', 1);
    setSaving(false);
    if (error) setError(error.message);
    else setNotice('Saved ✓ — the public website now uses these values.');
  };

  if (loading) {
    return (
      <div className="p-16 flex justify-center">
        <div className={`w-7 h-7 border-2 rounded-full animate-spin ${C.spinner}`} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold">{title}</h1>
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold bg-[#2ba8c9] text-slate-950 hover:bg-[#1c88a6] disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Save all
        </button>
      </div>

      {notice && <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs">{notice}</div>}
      {error && <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 text-xs">{error}</div>}

      {includeHours && (
        <div className="mb-4">
          <HoursEditor value={hours} onChange={setHours} />
        </div>
      )}

      <div className={`border rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 ${C.card}`}>
        {fields.map((f) => {
          const full = f.full || f.type === 'textarea' || f.type === 'json' || f.type === 'lines';
          const base = `w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#2ba8c9] ${C.input}`;
          const val = form[f.key] ?? '';
          return (
            <div key={f.key} className={full ? 'sm:col-span-2' : ''}>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                {f.label}
              </label>
              {f.type === 'textarea' || f.type === 'lines' || f.type === 'json' ? (
                <textarea
                  value={val}
                  onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                  rows={f.type === 'json' ? 5 : f.type === 'lines' ? 4 : 3}
                  className={`${base} ${f.type === 'json' ? 'font-mono text-xs' : ''}`}
                />
              ) : (
                <input
                  type={f.type === 'number' ? 'number' : 'text'}
                  value={val}
                  onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                  className={base}
                />
              )}
              {f.type === 'image' && val && (
                <img src={val} alt="preview" className="mt-2 h-20 w-32 object-cover rounded-lg border border-slate-300 dark:border-slate-700" />
              )}
              {f.hint && <p className="text-[11px] text-slate-400 dark:text-slate-600 mt-1 font-mono">{f.hint}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SingleRowSettings;

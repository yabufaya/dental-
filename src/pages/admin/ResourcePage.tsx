import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, RefreshCw, Pencil, Trash2, X, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { resources, type FieldDef, type ResourceDef } from '../../admin/resources';
import { C } from '../../admin/theme';

type Row = Record<string, unknown>;

function toFormValue(field: FieldDef, value: unknown): string | boolean {
  if (field.type === 'checkbox') return Boolean(value);
  if (field.type === 'lines') return Array.isArray(value) ? (value as string[]).join('\n') : '';
  if (field.type === 'json') return value ? JSON.stringify(value, null, 2) : '';
  return value === null || value === undefined ? '' : String(value);
}

function toDbValue(field: FieldDef, raw: string | boolean): { ok: true; value: unknown } | { ok: false; error: string } {
  if (field.type === 'checkbox') return { ok: true, value: Boolean(raw) };
  const str = String(raw).trim();
  if (field.type === 'number') {
    if (str === '') return { ok: true, value: null };
    const n = Number(str);
    return Number.isNaN(n) ? { ok: false, error: `"${field.label}" must be a number` } : { ok: true, value: n };
  }
  if (field.type === 'lines')
    return { ok: true, value: str ? str.split('\n').map((l) => l.trim()).filter(Boolean) : [] };
  if (field.type === 'json') {
    if (!str) return { ok: true, value: [] };
    try { return { ok: true, value: JSON.parse(str) }; }
    catch { return { ok: false, error: `"${field.label}" is not valid JSON` }; }
  }
  return { ok: true, value: str === '' ? null : str };
}

const FieldInput: React.FC<{
  field: FieldDef;
  value: string | boolean;
  disabled: boolean;
  onChange: (v: string | boolean) => void;
}> = ({ field, value, disabled, onChange }) => {
  const base = `w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#2ba8c9] disabled:opacity-50 ${C.input}`;
  const full = field.full || field.type === 'textarea' || field.type === 'json' || field.type === 'lines';

  if (field.type === 'checkbox') {
    return (
      <div>
        <label className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300 cursor-pointer h-full pt-2">
          <input
            type="checkbox"
            checked={Boolean(value)}
            disabled={disabled}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 rounded border-slate-400 accent-[#2ba8c9]"
          />
          {field.label}
        </label>
      </div>
    );
  }

  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
        {field.label} {field.required && <span className="text-[#1c88a6] dark:text-[#2ba8c9]">*</span>}
      </label>
      {full ? (
        <textarea
          value={String(value)}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          rows={field.type === 'json' ? 5 : field.type === 'lines' ? 4 : 3}
          className={`${base} ${field.type === 'json' ? 'font-mono text-xs' : ''}`}
        />
      ) : (
        <input
          type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
          value={String(value)}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={base}
        />
      )}
      {field.type === 'image' && String(value) && (
        <img src={String(value)} alt="preview" className="mt-2 h-16 w-24 object-cover rounded-lg border border-slate-300 dark:border-slate-700" />
      )}
      {field.hint && <p className="text-[11px] text-slate-400 dark:text-slate-600 mt-1">{field.hint}</p>}
    </div>
  );
};

const ResourcePage: React.FC<{ resourceKey: string }> = ({ resourceKey }) => {
  const def: ResourceDef = useMemo(() => resources[resourceKey], [resourceKey]);

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [editing, setEditing] = useState<Row | 'new' | null>(null);
  const [form, setForm] = useState<Record<string, string | boolean>>({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from(def.table)
      .select('*')
      .order(def.orderBy.column, { ascending: def.orderBy.ascending });
    if (error) setError(`${error.message} — did you run supabase/schema.sql yet?`);
    else setRows((data ?? []) as Row[]);
    setLoading(false);
  }, [def]);

  useEffect(() => { load(); }, [load]);

  const openNew = () => {
    const initial: Record<string, string | boolean> = {};
    if (def.idEditableOnCreate) initial[def.idKey] = '';
    for (const f of def.fields) initial[f.key] = toFormValue(f, def.defaultNew[f.key] ?? null);
    setForm(initial);
    setEditing('new');
    setNotice(null);
  };

  const openEdit = (row: Row) => {
    const initial: Record<string, string | boolean> = {};
    for (const f of def.fields) initial[f.key] = toFormValue(f, row[f.key]);
    setForm(initial);
    setEditing(row);
    setNotice(null);
  };

  const save = async () => {
    setSaving(true);
    setError(null);

    const payload: Record<string, unknown> = {};
    for (const f of def.fields) {
      if (f.key === def.idKey && editing !== 'new' && def.idEditableOnCreate) continue;
      const conv = toDbValue(f, form[f.key] ?? '');
      if (!conv.ok) { setError(conv.error); setSaving(false); return; }
      if (conv.value === null && f.required) { setError(`"${f.label}" is required`); setSaving(false); return; }
      payload[f.key] = conv.value;
    }

    let error;
    if (editing === 'new') {
      ({ error } = await supabase.from(def.table).insert(payload));
    } else if (editing) {
      ({ error } = await supabase.from(def.table).update(payload).eq(def.idKey, editing[def.idKey]));
    }

    setSaving(false);
    if (error) setError(error.message);
    else { setEditing(null); setNotice('Saved ✓ — website content updated.'); load(); }
  };

  const remove = async (row: Row) => {
    const label = String(row[def.listCols[0].key] ?? row[def.idKey]);
    if (!window.confirm(`Delete "${label}" permanently?`)) return;
    const { error } = await supabase.from(def.table).delete().eq(def.idKey, row[def.idKey]);
    if (error) setError(error.message);
    else { setNotice('Deleted.'); load(); }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold">{def.title}</h1>
          <p className="text-xs text-slate-500 mt-0.5">{rows.length} record(s) — public can read, you manage</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border ${C.neutralBtn}`}>
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <button onClick={openNew} className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg bg-[#2ba8c9] text-slate-950 hover:bg-[#1c88a6]">
            <Plus className="w-3.5 h-3.5" /> Add new
          </button>
        </div>
      </div>

      {notice && <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs">{notice}</div>}
      {error && !editing && <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 text-xs">{error}</div>}

      <div className={`border rounded-2xl overflow-hidden ${C.card}`}>
        {loading ? (
          <div className="p-10 flex justify-center">
            <div className={`w-7 h-7 border-2 rounded-full animate-spin ${C.spinner}`} />
          </div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">No records yet — click “Add new”.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`text-left text-[11px] uppercase tracking-wider text-slate-500 border-b ${C.borderB}`}>
                  {def.listCols.map((c) => <th key={c.key} className="px-4 py-2.5">{c.label}</th>)}
                  <th className="px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={String(row[def.idKey])} className={`border-b border-slate-100 last:border-0 dark:border-slate-800/60 ${C.rowHover}`}>
                    {def.listCols.map((c) => (
                      <td key={c.key} className="px-4 py-3 text-slate-600 dark:text-slate-300 max-w-[240px] truncate">
                        {typeof row[c.key] === 'boolean'
                          ? row[c.key]
                            ? <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                            : <span className="text-slate-300 dark:text-slate-600">—</span>
                          : String(row[c.key] ?? '—')}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <button onClick={() => openEdit(row)} className={`p-2 rounded-lg border transition-colors hover:bg-[#2ba8c9] hover:text-slate-950 hover:border-[#2ba8c9] ${C.neutralBtn}`} title="Edit">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => remove(row)} className={`p-2 rounded-lg border transition-colors hover:bg-red-600/80 hover:text-white hover:border-red-500 ${C.neutralBtn}`} title="Delete">
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

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/40 dark:bg-slate-950/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
          <div className={`w-full max-w-2xl border rounded-2xl my-8 shadow-2xl ${C.card}`}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${C.borderB}`}>
              <h2 className="text-sm font-bold">
                {editing === 'new' ? `New ${def.title.replace(/s$/, '')}` : `Edit ${def.title.replace(/s$/, '')}`}
              </h2>
              <button onClick={() => setEditing(null)} className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400`}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[65vh] overflow-y-auto">
              {error && editing && (
                <div className="sm:col-span-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 text-xs">{error}</div>
              )}
              {def.fields.map((f) => (
                <FieldInput
                  key={f.key}
                  field={f}
                  value={form[f.key] ?? ''}
                  disabled={f.key === def.idKey && editing !== 'new'}
                  onChange={(v) => setForm((prev) => ({ ...prev, [f.key]: v }))}
                />
              ))}
            </div>

            <div className={`flex justify-end gap-2 px-5 py-4 border-t ${C.borderB}`}>
              <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold bg-[#2ba8c9] text-slate-950 hover:bg-[#1c88a6] disabled:opacity-50"
              >
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {editing === 'new' ? 'Create' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourcePage;

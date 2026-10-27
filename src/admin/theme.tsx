import React, { useState } from 'react';

/** Admin-only day/night theme. Scoped to admin pages via a `.dark`
 *  wrapper class (Tailwind @custom-variant), so the public site is
 *  untouched. Persisted in localStorage. */
export type AdminTheme = 'light' | 'dark';
const KEY = 'dentora_admin_theme';

export function useAdminTheme(): [AdminTheme, () => void] {
  const [theme, setTheme] = useState<AdminTheme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark';
  });

  const toggle = () =>
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem(KEY, next);
      return next;
    });

  return [theme, toggle];
}

/** Wraps an admin page; sets/unsets the `.dark` scope class. */
export const AdminThemeRoot: React.FC<{ theme: AdminTheme; children: React.ReactNode }> = ({
  theme,
  children,
}) => <div className={theme === 'dark' ? 'dark min-h-screen' : 'min-h-screen'}>{children}</div>;

/* Shared class tokens (light → dark) */
export const C = {
  pageBg: 'bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-white',
  card: 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800',
  input:
    'bg-white border-slate-300 text-slate-900 placeholder-slate-400 dark:bg-slate-950 dark:border-slate-700 dark:text-white',
  neutralBtn:
    'border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800',
  borderB: 'border-slate-200 dark:border-slate-800',
  rowHover: 'hover:bg-slate-50 dark:hover:bg-slate-800/30',
  spinner: 'border-[#2ba8c9]/30 border-t-[#2ba8c9]',
};

export const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30',
  confirmed: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30',
  cancelled: 'bg-red-100 text-red-700 border-red-300 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/30',
  done: 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30',
};

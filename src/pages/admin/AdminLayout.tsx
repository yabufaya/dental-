import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  LayoutDashboard, CalendarDays, Sparkles, Stethoscope,
  MessageSquareQuote, Newspaper, Phone, Settings, LogOut,
  ExternalLink, Sun, Moon, BarChart3,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAdminTheme, AdminThemeRoot, C } from '../../admin/theme';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3, end: false },
  { to: '/admin/bookings', label: 'Bookings', icon: CalendarDays, end: false },
  { to: '/admin/services', label: 'Services', icon: Sparkles, end: false },
  { to: '/admin/doctors', label: 'Doctors', icon: Stethoscope, end: false },
  { to: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote, end: false },
  { to: '/admin/blog', label: 'Blog Posts', icon: Newspaper, end: false },
  { to: '/admin/contact', label: 'Contact Info', icon: Phone, end: false },
  { to: '/admin/settings', label: 'Site Settings', icon: Settings, end: false },
];

const AdminLayout: React.FC = () => {
  const { userEmail, signOut } = useAuth();
  const [theme, toggleTheme] = useAdminTheme();

  return (
    <AdminThemeRoot theme={theme}>
      <div className={`min-h-screen flex ${C.pageBg}`}>
        {/* ── Sidebar ── */}
        <aside className={`w-56 shrink-0 border-r flex flex-col max-sm:hidden bg-white/70 dark:bg-slate-900/60 ${C.borderB}`}>
          <div className={`px-5 py-5 border-b ${C.borderB}`}>
            <div className="text-base font-bold tracking-tight">🦷 Dentora</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#1c88a6] dark:text-[#2ba8c9] font-bold mt-0.5">
              Admin Panel
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#2ba8c9] text-slate-950'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className={`p-3 border-t ${C.borderB}`}>
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View website
            </Link>
          </div>
        </aside>

        {/* ── Main column ── */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className={`h-14 border-b flex items-center justify-between px-4 sm:px-6 bg-white/60 dark:bg-slate-900/40 ${C.borderB}`}>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Dentora Clinic · Admin
            </span>
            <div className="flex items-center gap-2.5">
              <span className="text-xs text-slate-500 max-sm:hidden">{userEmail}</span>

              {/* ☀️/🌙 Day / night toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg border transition-colors ${C.neutralBtn}`}
                title={theme === 'dark' ? 'Switch to day mode' : 'Switch to night mode'}
                aria-label="Toggle admin theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <button
                onClick={signOut}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${C.neutralBtn}`}
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign out
              </button>
            </div>
          </header>

          {/* Mobile nav */}
          <nav className={`sm:hidden flex gap-1 overflow-x-auto p-2 border-b ${C.borderB}`}>
            {navItems.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    isActive
                      ? 'bg-[#2ba8c9] text-slate-950'
                      : 'text-slate-500 bg-white dark:text-slate-400 dark:bg-slate-900'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </AdminThemeRoot>
  );
};

export default AdminLayout;

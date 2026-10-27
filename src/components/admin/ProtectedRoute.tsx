import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { ShieldX } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAdminTheme, AdminThemeRoot, C } from '../../admin/theme';

/**
 * Guard for /admin/* — UX layer; real enforcement is Postgres RLS.
 *  1 loading → spinner · 2 no session → /login
 *  3 not allowlisted → "Not authorized" · 4 admin → pages
 */
const ProtectedRoute: React.FC = () => {
  const { session, loading, isAdmin, userEmail, signOut } = useAuth();
  const [theme] = useAdminTheme();

  if (loading) {
    return (
      <AdminThemeRoot theme={theme}>
        <div className={`min-h-screen flex items-center justify-center ${C.pageBg}`}>
          <div className={`w-10 h-10 border-3 rounded-full animate-spin ${C.spinner}`} />
        </div>
      </AdminThemeRoot>
    );
  }

  if (!session) return <Navigate to="/login" replace />;

  if (!isAdmin) {
    return (
      <AdminThemeRoot theme={theme}>
        <div className={`min-h-screen flex items-center justify-center p-6 ${C.pageBg}`}>
          <div className={`max-w-md w-full border rounded-2xl p-8 text-center ${C.card}`}>
            <div className="w-14 h-14 rounded-full bg-red-500/10 text-red-500 dark:text-red-400 flex items-center justify-center mx-auto mb-4">
              <ShieldX className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold mb-2">Not authorized</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">You signed in as:</p>
            <p className="text-sm font-semibold mb-4">{userEmail}</p>
            <p className="text-xs text-slate-500 mb-6">
              This email is not on the clinic staff allowlist. Add it to{' '}
              <code className="text-[#1c88a6] dark:text-[#2ba8c9]">admin_emails</code> in Supabase
              and <code className="text-[#1c88a6] dark:text-[#2ba8c9]">VITE_ADMIN_EMAILS</code> in
              .env.local.
            </p>
            <button
              onClick={signOut}
              className={`px-5 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${C.neutralBtn}`}
            >
              Sign out &amp; try another account
            </button>
          </div>
        </div>
      </AdminThemeRoot>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;

import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Lock, ArrowLeft, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAdminTheme, AdminThemeRoot, C } from '../admin/theme';

const GoogleIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
  </svg>
);

/** Staff-only login — Google OAuth. */
const LoginPage: React.FC = () => {
  const { session, loading, isAdmin, signInWithGoogle } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, toggleTheme] = useAdminTheme();

  if (!loading && session && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleGoogle = async () => {
    setBusy(true);
    setError(null);
    try {
      await signInWithGoogle(); // navigates away to Google on success
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not start Google sign-in.');
      setBusy(false);
    }
  };

  return (
    <AdminThemeRoot theme={theme}>
      <main className={`min-h-screen flex items-center justify-center p-4 ${C.pageBg}`}>
        {/* theme toggle, top-right */}
        <button
          onClick={toggleTheme}
          className={`fixed top-4 right-4 p-2 rounded-lg border ${C.neutralBtn}`}
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className="w-full max-w-sm">
          <div className={`border rounded-3xl p-8 shadow-2xl ${C.card}`}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2ba8c9] to-[#1c88a6] flex items-center justify-center text-slate-950 mb-5 mx-auto">
              <Lock className="w-6 h-6" />
            </div>

            <h1 className="text-2xl font-bold text-center tracking-tight">Staff Portal</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-2 mb-7">
              Dentora Dental Clinic administrators only. Sign in with your authorized Google
              account.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 text-xs">
                {error}
              </div>
            )}

            <button
              onClick={handleGoogle}
              disabled={busy || loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-opacity"
            >
              {busy ? (
                <div className={`w-5 h-5 border-2 rounded-full animate-spin ${C.spinner}`} />
              ) : (
                <>
                  <GoogleIcon />
                  Continue with Google
                </>
              )}
            </button>

            <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center mt-5 leading-relaxed">
              Authentication is handled entirely by Google — we never see your password. Only
              emails on the staff allowlist can open the dashboard.
            </p>
          </div>

          <div className="text-center mt-5">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to the clinic website
            </Link>
          </div>
        </div>
      </main>
    </AdminThemeRoot>
  );
};

export default LoginPage;

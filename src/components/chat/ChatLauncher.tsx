import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Bot, X, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const ChatPanel = lazy(() => import('./ChatPanel'));

export const ChatLauncher: React.FC = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (typeof sessionStorage !== 'undefined') {
      if (sessionStorage.getItem('dentora_chat_hint_seen')) return;
    }
    const timer = setTimeout(() => {
      setShowHint(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  const toggle = () => {
    setOpen((prev) => !prev);
    setShowHint(false);
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('dentora_chat_hint_seen', '1');
    }
  };

  return (
    <>
      {open && (
        <Suspense
          fallback={
            <div
              className="fixed bottom-20 right-4 sm:right-6 w-[360px] h-[500px] bg-white rounded-2xl shadow-2xl p-6 flex items-center justify-center z-50"
              aria-busy="true"
            >
              <div className="w-8 h-8 border-2 border-[#2ba8c9] border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <ChatPanel onClose={() => setOpen(false)} />
        </Suspense>
      )}

      {/* Floating Launcher Container */}
      <div
        className="fixed right-4 sm:right-6 bottom-20 md:bottom-6 z-40 flex items-center gap-2.5 pointer-events-auto select-none"
      >
        {/* Hint speech bubble */}
        {showHint && !open && (
          <button
            onClick={toggle}
            className="hidden sm:flex items-center gap-1.5 bg-white text-slate-900 border border-slate-200/80 px-3.5 py-2 rounded-2xl rounded-br-sm shadow-xl text-xs font-semibold hover:bg-slate-50 transition-all hover:scale-105 animate-in fade-in slide-in-from-bottom-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#2ba8c9]" />
            <span>{t('Talk to our AI assistant 👋', 'ከአርቴፊሻል ኢንተለጀንስ ረዳታችን ጋር ይወያዩ 👋')}</span>
          </button>
        )}

        {/* Floating Action Button with 3 Expanding Water Wave Ripples */}
        <button
          onClick={toggle}
          className="relative w-14 h-14 rounded-full bg-[#2ba8c9] hover:bg-[#1c88a6] text-slate-950 flex items-center justify-center shadow-[0_8px_25px_rgba(43,168,201,0.4)] transition-all hover:scale-108 active:scale-95 focus-visible:outline-3 focus-visible:outline-[#1c88a6] focus-visible:outline-offset-3"
          aria-label={open ? 'Close chat' : 'Open AI dental assistant'}
          aria-expanded={open}
        >
          {/* Water-wave ripples when closed */}
          {!open && (
            <>
              <span className="wave-ripple" />
              <span className="wave-ripple wave-ripple--2" />
              <span className="wave-ripple wave-ripple--3" />
            </>
          )}

          {open ? (
            <X className="w-6 h-6 text-slate-950 transition-transform duration-200" />
          ) : (
            <Bot className="w-7 h-7 text-slate-950 transition-transform duration-200" />
          )}
        </button>
      </div>
    </>
  );
};

export default ChatLauncher;

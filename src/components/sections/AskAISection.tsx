import React, { useState } from 'react';
import { Bot, Sparkles, Send, ShieldAlert, ArrowRight } from 'lucide-react';
import SectionOpener from '../ui/SectionOpener';
import Reveal from '../motion/Reveal';
import { useLanguage } from '../../context/LanguageContext';

export const AskAISection: React.FC<{ onOpenChat?: () => void }> = () => {
  const { language, t } = useLanguage();
  const [quickQuestion, setQuickQuestion] = useState('');

  const sampleChips = [
    { en: 'Does teeth cleaning hurt?', am: 'የጥርስ ጽዳት ህመም አለው?' },
    { en: 'Can I pay with Telebirr?', am: 'በቴሌብር መክፈል ይቻላል?' },
    { en: 'How long do dental implants last?', am: 'የጥርስ ተከላ ለስንት አመት ይቆያል?' },
    { en: 'What counts as a dental emergency?', am: 'አስቸኳይ የጥርስ ሁኔታ የሚባለው ምንድን ነው?' },
  ];

  const handleLaunchChat = (text?: string) => {
    // Dispatch custom event to open floating chat with initial text
    const chatBtn = document.querySelector('.chat-fab') as HTMLButtonElement | null;
    chatBtn?.click();
  };

  return (
    <SectionOpener
      id="ask-ai"
      tone="ask"
      dark={true}
      from="#f0edfe"
      label={t('Ask Us Anything', 'የፈለጉትን ይጠይቁን')}
      title={t('Have Questions? Ask Our Clinic AI', 'ስለ ጥርስ ህክምና ጥያቄ አለዎት?')}
      titleSoft={t('24/7 Without Feeling Shy or Hesitant.', 'ያለ ምንም ማመንታት በደቂቃዎች ውስጥ መልስ ያግኙ።')}
      promise={t('Get instant, factual answers regarding procedure steps, pain management, recovery times, and transparent ETB pricing.', 'ስለ ህክምና ሂደቶች፣ ህመምን ስለመቆጣጠር እና ስለ ዋጋዎች በማንኛውም ሰዓት ይጠይቁ።')}
    >
      <div className="max-w-3xl mx-auto">
        <Reveal variant="zoom">
          <div className="relative rounded-3xl p-6 sm:p-10 bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-md overflow-hidden">
            {/* Ambient water-ripple glow behind */}
            <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-[#2ba8c9]/15 blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-[#1c88a6]/20 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#2ba8c9] flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-[#2ba8c9]/20">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg sm:text-xl">
                    {t('Dentora Clinic Knowledge Assistant', 'የዴንቶራ ክሊኒክ እውቀት ረዳት')}
                  </h3>
                  <span className="text-xs text-[#2ba8c9] flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {t('Trained strictly on Dentora medical services & local prices', 'በክሊኒካችን አገልግሎቶችና ዋጋዎች ላይ የተመሰረተ')}
                  </span>
                </div>
              </div>

              {/* Sample Quick Prompts */}
              <div className="space-y-2 mb-6">
                <span className="text-xs text-slate-400 font-medium block">
                  {t('Frequently asked patient questions:', 'በብዛት የሚጠየቁ ጥያቄዎች፡')}
                </span>
                <div className="flex flex-wrap gap-2">
                  {sampleChips.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleLaunchChat(language === 'am' ? chip.am : chip.en)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-800 hover:bg-[#2ba8c9] hover:text-slate-950 text-slate-200 transition-all border border-slate-700/80 active:scale-95"
                    >
                      {language === 'am' ? chip.am : chip.en}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Input Form */}
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={quickQuestion}
                  onChange={(e) => setQuickQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleLaunchChat(quickQuestion);
                  }}
                  placeholder={t(
                    'Ask anything (e.g., How much are dental crowns?)',
                    'ጥያቄዎን ይጻፉ (ለምሳሌ፡ የጥርስ ቆብ ዋጋ ስንት ነው?)'
                  )}
                  className="w-full bg-slate-800/90 text-white rounded-full py-3.5 pl-5 pr-32 text-xs sm:text-sm border border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2ba8c9] shadow-inner placeholder:text-slate-500"
                />
                <button
                  onClick={() => handleLaunchChat(quickQuestion)}
                  className="absolute right-1.5 py-2 px-4 rounded-full bg-[#2ba8c9] hover:bg-[#1c88a6] text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-transform active:scale-95 shadow-md"
                >
                  <span>{t('Ask Now', 'ጠይቅ')}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Medical Guardrail Note */}
              <div className="mt-4 flex items-start gap-2 text-[11px] text-slate-400">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  {t(
                    'General health information only, not medical diagnosis. In case of bleeding, swelling, or extreme trauma, please use our 24/7 emergency line.',
                    'አጠቃላይ የጤና መረጃ እንጂ የህክምና ምርመራ አይደለም። ለከባድ ህመም ወዲያውኑ በስልክ ይደውሉ።'
                  )}
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </SectionOpener>
  );
};

export default AskAISection;

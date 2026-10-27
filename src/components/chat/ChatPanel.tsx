import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User, Phone, MessageSquare, AlertTriangle, Calendar, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useBooking } from '../../context/BookingContext';
import { useSettings } from '../../context/SettingsContext';
import { useServices } from '../../context/DataContext';

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  sources?: string[];
  isEmergency?: boolean;
  escalate?: boolean;
}

const INITIAL_MESSAGE_EN =
  "Hello! I'm Dentora's virtual clinic assistant. I can answer questions about our treatments, prices in ETB, opening hours, or emergency care. How can I help you today?";
const INITIAL_MESSAGE_AM =
  "ጤና ይስጥልኝ! የዴንቶራ ክሊኒክ ረዳት ነኝ። ስለ አገልግሎቶች፣ ዋጋዎች፣ የስራ ሰዓት ወይም የአስቸኳይ ህክምና ጥያቄ ካለዎት በደስታ እመልሳለሁ። በምን ልርዳዎ?";

const QUICK_QUESTIONS_EN = [
  'How much is teeth cleaning?',
  'Does root canal hurt?',
  'Opening hours & location',
  'Tooth emergency right now',
  'What payment methods are accepted?',
];

const QUICK_QUESTIONS_AM = [
  'የጥርስ ጽዳት ዋጋ ስንት ነው?',
  'የስር ቦይ ህክምና ያማል?',
  'የስራ ሰዓት እና አድራሻ',
  'ድንገተኛ ህመም አለብኝ',
  'ክፍያ በቴሌብር ይቻላል?',
];

export const ChatPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const clinicSettings = useSettings();
  const services = useServices();
  const { language, t } = useLanguage();
  const { openBooking } = useBooking();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      text: language === 'am' ? INITIAL_MESSAGE_AM : INITIAL_MESSAGE_EN,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = (userText: string) => {
    const text = userText.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // AI Knowledge Retrieval Logic (Simulating fast RAG over Dentora knowledge base)
    setTimeout(() => {
      const q = text.toLowerCase();
      let responseText = '';
      let isEmergency = false;
      let escalate = false;
      let sources: string[] = [];

      // 1. Emergency detection
      if (
        q.includes('emergency') ||
        q.includes('severe pain') ||
        q.includes('unbearable') ||
        q.includes('bleeding') ||
        q.includes('knocked out') ||
        q.includes('swelling') ||
        q.includes('አደጋ') ||
        q.includes('ከባድ ህመም') ||
        q.includes('እብጠት') ||
        q.includes('ደም')
      ) {
        isEmergency = true;
        escalate = true;
        responseText =
          language === 'am'
            ? `ይህ አስቸኳይ የጥርስ ሁኔታ ሊሆን ስለሚችል ወዲያውኑ ወደ ድንገተኛ ስልካችን ይደውሉ፡ ${clinicSettings.emergencyPhone}። በቦሌ መድኃኔዓለም ቢሮ ቁጥር 204 በአፋጣኝ ዝግጁ ነን።`
            : `This sounds like a dental emergency! Please call our 24/7 emergency line right now at ${clinicSettings.emergencyPhone} or proceed directly to our clinic next to Morning Star Mall. Our surgical team will prioritize you immediately.`;
        sources = ['Emergency Protocol', 'Clinic Triage'];
      }
      // 2. Price / Cleaning
      else if (
        q.includes('clean') ||
        q.includes('scaling') ||
        q.includes('ዋጋ') ||
        q.includes('ጽዳት') ||
        q.includes('cost') ||
        q.includes('price')
      ) {
        const cleanService = services.find((s) => s.id === 'checkup-cleaning');
        responseText =
          language === 'am'
            ? `የጥርስ ምርመራ እና የዲጂታል ጽዳት መነሻ ዋጋ ${cleanService?.priceFromETB} የኢትዮጵያ ብር ነው። የቆሻሻና ካልሺየም ማስወገድ እንዲሁም የኢናመል ጥንካሬን ያካትታል።`
            : `Our comprehensive dental checkup and ultrasonic cleaning starts from ${cleanService?.priceFromETB} ETB. It includes digital intraoral scan, tartar removal, and enamel polishing.`;
        sources = ['Services & Pricing Guide'];
      }
      // 3. Root canal / pain
      else if (
        q.includes('root canal') ||
        q.includes('pain') ||
        q.includes('hurt') ||
        q.includes('ስር ቦይ') ||
        q.includes('ያማል')
      ) {
        responseText =
          language === 'am'
            ? `የስር ቦይ ህክምና በፍጹም ህመም የለውም! ዘመናዊ ማደንዘዣዎችን በመጠቀም ህመምን ለማስወገድና የተጎዳ ጥርስን ከመነቀል ለማዳን የሚሰራ ነው። መነሻ ዋጋው 5,500 ብር ነው።`
            : `Root canal treatment at Dentora is virtually pain-free! We use computer-controlled targeted local anesthesia to gently remove the infected nerve and save your real tooth. Starting from 5,500 ETB.`;
        sources = ['Endodontics Clinical FAQ'];
      }
      // 4. Hours & Location
      else if (
        q.includes('hour') ||
        q.includes('location') ||
        q.includes('address') ||
        q.includes('ሰዓት') ||
        q.includes('አድራሻ') ||
        q.includes('የት')
      ) {
        responseText =
          language === 'am'
            ? `ክሊኒካችን ቦሌ መድኃኔዓለም፣ ከኤድና ሞል ፊት ለፊት በሚገኘው የሞርኒንግ ስታር ሞል ጎን፣ 2ኛ ፎቅ ቢሮ 204 ላይ ይገኛል። የስራ ሰዓት፡ ሰኞ - ዓርብ 08:30 – 17:30፣ ቅዳሜ 09:00 – 15:30።`
            : `We are located in Bole Medhanialem on Edna Mall Road, 2nd Floor, Suite 204 (next to Morning Star Mall). Opening hours: Monday–Friday 08:30–17:30, Saturday 09:00–15:30. Dedicated parking and elevator available!`;
        sources = ['Clinic Directory'];
      }
      // 5. Payment
      else if (
        q.includes('telebirr') ||
        q.includes('cbe') ||
        q.includes('pay') ||
        q.includes('ቴሌብር') ||
        q.includes('ክፍያ')
      ) {
        responseText =
          language === 'am'
            ? `አዎ! በቴሌብር (Telebirr)፣ በሲቢኢ ብር (CBE Birr)፣ በባንክ ሒሳብ ማስተላለፍ (ንግድ ባንክ፣ አዋሽ፣ ዳሽን) እና በጥሬ ገንዘብ መክፈል ይችላሉ።`
            : `Yes! We accept Telebirr, CBE Birr, direct local bank transfers (CBE, Awash, Dashen), cash, and select local private health insurance.`;
        sources = ['Billing & Insurance'];
      }
      // 6. Whitening
      else if (
        q.includes('whiten') ||
        q.includes('ማበጠር') ||
        q.includes('ነጭ') ||
        q.includes('stain')
      ) {
        responseText =
          language === 'am'
            ? `የጥርስ ማበጠር (Laser Teeth Whitening) በ50 ደቂቃ ውስጥ ጥርስዎን በ6-8 ደረጃዎች ያደምቃል፤ መነሻ ዋጋው 4,800 ብር ነው። ለኢናመል 100% ደህንነቱ የተጠበቀ ነው።`
            : `Our in-office laser teeth whitening takes 50 minutes and brightens your smile 6 to 8 shades safely without weakening enamel. Starting from 4,800 ETB.`;
        sources = ['Cosmetic Treatments'];
      }
      // Default helpful fallback
      else {
        responseText =
          language === 'am'
            ? `ስለ ዴንቶራ ክሊኒክ ተጨማሪ ማብራሪያ ማግኘት ይፈልጋሉ? ከታች "ቀጠሮ ይያዙ" የሚለውን በመጫን ወይም በ ${clinicSettings.phone} ደውለው በቀጥታ ከባለሙያ ጋር መነጋገር ይችላሉ።`
            : `I can certainly help you with that! At Dentora Dental Clinic, Dr. Daniel Carter and our team offer everything from preventative cleanings to implants. Would you like to schedule an examination or speak with reception?`;
        escalate = true;
        sources = ['General Clinic Knowledge'];
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text: responseText,
          sources,
          isEmergency,
          escalate,
        },
      ]);
      setLoading(false);
    }, 600);
  };

  const quickQuestions = language === 'am' ? QUICK_QUESTIONS_AM : QUICK_QUESTIONS_EN;

  return (
    <div
      role="dialog"
      aria-label="Dentora AI Assistant"
      className="fixed bottom-20 right-4 sm:right-6 w-[calc(100vw-32px)] sm:w-[400px] h-[560px] max-h-[calc(100vh-100px)] bg-white rounded-2xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Header */}
      <div className="bg-slate-900 text-white px-4 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#2ba8c9] flex items-center justify-center text-slate-950">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">Dentora AI</span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span className="text-[11px] text-slate-400 block">
              {t('24/7 Dental Clinic Assistant', 'የ24 ሰዓት የጥርስ ረዳት')}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Medical Safety Disclaimer Strip */}
      <div className="bg-amber-50 border-b border-amber-200/70 px-3 py-1.5 text-[11px] text-amber-800 flex items-center gap-1.5">
        <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
        <span>
          {t(
            'General information only, not medical diagnosis. For severe pain, call emergency.',
            'አጠቃላይ መረጃ ነው፤ ለከባድ ህመም ወዲያውኑ በስልክ ይደውሉ።'
          )}
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50" aria-live="polite">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-[#2ba8c9] text-slate-950 font-medium rounded-tr-xs shadow-sm'
                  : m.isEmergency
                  ? 'bg-rose-50 border border-rose-300 text-rose-950 font-medium rounded-tl-xs shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs shadow-sm'
              }`}
            >
              {m.text}

              {/* Source citations */}
              {m.sources && m.sources.length > 0 && (
                <div className="mt-2 pt-1.5 border-t border-slate-100 flex flex-wrap gap-1 text-[10px] text-slate-500">
                  <span className="font-semibold">Source:</span>
                  {m.sources.map((s, idx) => (
                    <span key={idx} className="bg-slate-100 px-1.5 py-0.5 rounded">
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {/* Escalation options if emergency or requested */}
              {m.escalate && (
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                  <a
                    href={`tel:${clinicSettings.phone.replace(/\s+/g, '')}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 text-white text-[11px] font-semibold hover:bg-slate-800"
                  >
                    <Phone className="w-3 h-3 text-[#2ba8c9]" />
                    <span>{t('Call Reception', 'ይደውሉ')}</span>
                  </a>

                  <button
                    onClick={() => {
                      onClose();
                      openBooking();
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#2ba8c9] text-slate-950 text-[11px] font-bold"
                  >
                    <Calendar className="w-3 h-3" />
                    <span>{t('Book a visit', 'ቀጠሮ ይያዙ')}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-1.5 text-slate-400 text-xs py-1">
            <Bot className="w-4 h-4 text-[#2ba8c9]" />
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[#2ba8c9] rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-[#2ba8c9] rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-[#2ba8c9] rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Quick Question Chips */}
      <div className="px-3 py-2 bg-white border-t border-slate-100 overflow-x-auto flex gap-1.5 no-scrollbar">
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-[#e3f4f9] hover:text-[#1c88a6] text-slate-700 transition-colors border border-slate-200"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('Ask about prices, pain, hours...', 'ስለ ዋጋ፣ ህክምና፣ ሰዓት ይጠይቁ...')}
          maxLength={300}
          className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2ba8c9]"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="w-9 h-9 rounded-full bg-[#2ba8c9] hover:bg-[#1c88a6] disabled:opacity-40 text-slate-950 flex items-center justify-center transition-transform active:scale-95"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;

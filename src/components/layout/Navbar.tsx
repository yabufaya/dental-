import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, Calendar, Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useBooking } from '../../context/BookingContext';
import { useSettings } from '../../context/SettingsContext';

export const Navbar: React.FC = () => {
  const clinicSettings = useSettings();
  const { language, toggleLanguage, t } = useLanguage();
  const { openBooking } = useBooking();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll spy to highlight current section as user scrolls through the homepage
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);

      if (location.pathname === '/') {
        const sections = [
          { id: 'contact', element: document.getElementById('contact') },
          { id: 'testimonials', element: document.getElementById('testimonials') },
          { id: 'doctors', element: document.getElementById('doctors') },
          { id: 'about', element: document.getElementById('about') },
          { id: 'services', element: document.getElementById('services') },
        ];

        const scrollPosition = window.scrollY + 180;
        let found = false;

        for (const sec of sections) {
          if (sec.element && sec.element.offsetTop <= scrollPosition) {
            setActiveSection(sec.id);
            found = true;
            break;
          }
        }

        if (!found) {
          setActiveSection('home');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const navLinks = [
    { id: 'home', hash: '#top', label: t('Home', 'ዋና ገጽ') },
    { id: 'services', hash: '#services', label: t('Services', 'አገልግሎቶች') },
    { id: 'about', hash: '#about', label: t('About Us', 'ስለ እኛ') },
    { id: 'doctors', hash: '#doctors', label: t('Doctors', 'ሐኪሞቻችን') },
    { id: 'testimonials', hash: '#testimonials', label: t('Testimonials', 'ምስክርነቶች') },
    { id: 'contact', hash: '#contact', label: t('Contact', 'አድራሻ') },
  ];

  const handleNavClick = (e: React.MouseEvent, hash: string, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (location.pathname === '/') {
      if (id === 'home' || hash === '#top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        history.replaceState(null, '', '/');
        setActiveSection('home');
      } else {
        const target = document.querySelector(hash);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.replaceState(null, '', `/${hash}`);
          setActiveSection(id);
        }
      }
    } else {
      // If currently on another page, navigate to homepage with hash
      navigate(id === 'home' ? '/' : `/${hash}`);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm py-2.5 border-b border-slate-100'
          : 'bg-white/85 backdrop-blur-sm py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/#top"
          onClick={(e) => handleNavClick(e, '#top', 'home')}
          className="flex items-center gap-2.5 group focus-visible:outline-2 focus-visible:outline-[#2ba8c9] rounded-lg shrink-0"
          aria-label="Dentora Dental Clinic Home"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1c88a6] to-[#2ba8c9] flex items-center justify-center text-white shadow-md shadow-[#2ba8c9]/25 transition-transform group-hover:scale-105">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M12 2C8.5 2 6 4 6 7c0 3.5 1.5 6 3 9 1 2 1.5 4 3 4s2-2 3-4c1.5-3 3-5.5 3-9 0-3-2.5-5-6-5z" />
              <path d="M12 7v5" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight text-slate-900 leading-tight">
              Dentora
            </span>
            <span className="text-[11px] font-medium text-slate-500 tracking-wide uppercase">
              Dental Clinic
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links (Smooth scroll across the entire flowing homepage) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-full border border-slate-200/60 shadow-inner">
          {navLinks.map((link) => {
            const isActive = location.pathname === '/' && activeSection === link.id;
            return (
              <a
                key={link.id}
                href={`/${link.hash}`}
                onClick={(e) => handleNavClick(e, link.hash, link.id)}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Right CTA Area: Language Toggle + Emergency call + Book Button */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Language Toggle Button */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
            title="Switch Language (English / አማርኛ)"
            aria-label="Toggle language"
          >
            <Globe className="w-3.5 h-3.5 text-[#2ba8c9]" />
            <span>{language === 'en' ? 'አማርኛ' : 'English'}</span>
          </button>

          {/* Quick Call */}
          <a
            href={`tel:${clinicSettings.phone.replace(/\s+/g, '')}`}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-[#2ba8c9] px-2 py-1 transition-colors"
            title={t('Call our reception', 'ደውለው ያናግሩን')}
          >
            <Phone className="w-3.5 h-3.5 text-[#2ba8c9]" />
            <span className="tabular-nums font-semibold">{clinicSettings.phone}</span>
          </a>

          {/* Primary Action Button */}
          <button
            onClick={() => openBooking()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2ba8c9] hover:bg-[#1c88a6] text-slate-950 font-bold text-xs sm:text-sm shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-[#2ba8c9]"
          >
            <Calendar className="w-4 h-4 text-slate-950" />
            <span>{t('Book a visit', 'ቀጠሮ ይያዙ')}</span>
          </button>
        </div>

        {/* Mobile Action Controls: Language + Primary CTA + Burger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1 text-xs font-semibold rounded-full border border-slate-200 text-slate-700 bg-white"
            aria-label="Toggle language"
          >
            {language === 'en' ? 'አማ' : 'EN'}
          </button>

          <button
            onClick={() => openBooking()}
            className="px-3 py-1.5 rounded-full bg-[#2ba8c9] text-slate-950 text-xs font-bold shadow-sm"
          >
            {t('Book', 'ቀጠሮ')}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl px-5 py-6 shadow-xl animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === '/' && activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={`/${link.hash}`}
                  onClick={(e) => handleNavClick(e, link.hash, link.id)}
                  className={`px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-[#e3f4f9] text-[#1c88a6] font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}

            <div className="pt-4 mt-2 border-t border-slate-100 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openBooking();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#2ba8c9] text-slate-950 font-bold text-sm shadow-md"
              >
                <Calendar className="w-4 h-4" />
                <span>{t('Book a visit', 'ቀጠሮ ይያዙ')}</span>
              </button>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 px-1">
                <span>{t('Emergency line:', 'የአስቸኳይ ስልክ:')}</span>
                <a
                  href={`tel:${clinicSettings.emergencyPhone.replace(/\s+/g, '')}`}
                  className="font-bold text-rose-600 hover:underline"
                >
                  {clinicSettings.emergencyPhone}
                </a>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;

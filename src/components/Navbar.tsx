import React, { useState, useEffect } from 'react';
import { Language, SiteSettings } from '../types';
import { translations } from '../i18n/translations';
import { Menu, X, Globe, Shield, ExternalLink, ChevronDown } from 'lucide-react';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenAdmin: () => void;
  siteSettings: SiteSettings;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  onOpenAdmin,
  siteSettings
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const t = translations[currentLang];
  const isRtl = currentLang === 'ur' || currentLang === 'ps';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#home', label: t.nav.home },
    { href: '#about', label: t.nav.about },
    { href: '#activities', label: t.nav.activities },
    { href: '#journey', label: t.nav.journey },
    { href: '#news', label: t.nav.news },
    { href: '#gallery', label: t.nav.gallery },
    { href: '#videos', label: t.nav.videos },
    { href: '#sources', label: t.nav.sources },
    { href: '#contact', label: t.nav.contact }
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'ur', label: 'Urdu', native: 'اردو' },
    { code: 'ps', label: 'Pashto', native: 'پښتو' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#030d0a]/90 backdrop-blur-md border-b border-emerald-900/30 shadow-lg shadow-black/40 py-3'
          : 'bg-gradient-to-b from-[#030d0a]/80 via-[#030d0a]/40 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Monogram & Name */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-md bg-gradient-to-br from-emerald-700 via-emerald-800 to-slate-900 border border-amber-500/40 flex items-center justify-center shadow-md shadow-emerald-950/60 group-hover:border-amber-400 transition-colors">
              <span className="font-serif text-amber-300 font-bold text-lg tracking-wider">
                QMA
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-wider text-slate-100 uppercase group-hover:text-amber-200 transition-colors font-serif">
                Qazi Momin Afridi
              </span>
              <span className="text-[11px] text-emerald-400/90 font-medium">
                {currentLang === 'en'
                  ? 'Khyber • Public Profile'
                  : currentLang === 'ur'
                  ? 'ضلع خیبر • عوامی نمائندہ'
                  : 'خیبر • ولسی استازی'}
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-xs font-medium uppercase tracking-wider text-slate-300 hover:text-amber-300 transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-amber-400 hover:after:w-full after:transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Controls: Language Switcher + Admin Button + Mobile Toggle */}
          <div className="flex items-center gap-3">
            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-emerald-950/60 border border-emerald-800/40 text-xs font-medium text-slate-200 hover:text-amber-300 hover:border-amber-500/40 transition-colors"
                aria-label="Change language"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-medium">
                  {languages.find((l) => l.code === currentLang)?.native}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div
                  className={`absolute mt-2 w-36 rounded-md bg-[#051a12] border border-emerald-800/60 shadow-xl shadow-black/80 py-1 z-50 ${
                    isRtl ? 'left-0' : 'right-0'
                  }`}
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-emerald-900/40 transition-colors ${
                        currentLang === lang.code
                          ? 'text-amber-300 font-semibold bg-emerald-950/60'
                          : 'text-slate-300'
                      }`}
                    >
                      <span>{lang.native}</span>
                      <span className="text-[10px] text-slate-500">{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Admin Portal Button */}
            <button
              onClick={onOpenAdmin}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900/80 border border-slate-700/60 text-xs text-slate-300 hover:text-white hover:border-amber-400/50 hover:bg-slate-800 transition-colors shadow-sm"
              title="Admin Portal"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-medium">{t.nav.admin}</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-md bg-emerald-950/70 border border-emerald-800/40 text-slate-300 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#04120d]/98 border-b border-emerald-800/40 shadow-2xl px-5 pt-3 pb-6 animate-fadeIn">
          <div className="flex flex-col gap-2 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="py-2.5 px-3 text-sm font-medium text-slate-200 hover:text-amber-300 hover:bg-emerald-950/50 rounded-md transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-emerald-900/40 mt-2 flex items-center justify-between">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="flex items-center gap-2 py-2 px-3 text-xs text-amber-300 bg-emerald-950/70 border border-emerald-700/40 rounded-md w-full justify-center"
              >
                <Shield className="w-4 h-4 text-amber-400" />
                <span>{t.nav.admin}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

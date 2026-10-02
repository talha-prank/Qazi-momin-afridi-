import React, { useState, useEffect, useRef } from 'react';
import { Language, Profile, SiteSettings } from '../types';
import { translations } from '../i18n/translations';
import { ArrowDown, MapPin, CheckCircle2, ChevronRight, Award } from 'lucide-react';

interface HeroSectionProps {
  currentLang: Language;
  profile: Profile;
  siteSettings: SiteSettings;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentLang,
  profile,
  siteSettings
}) => {
  const t = translations[currentLang];
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (isMobile) return;
    const { clientX, clientY, currentTarget } = e;
    const rect = currentTarget.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width - 0.5;
    const y = (clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Localized hero name & subtitle
  const heroName =
    currentLang === 'ur'
      ? profile.fullNameUr || 'قاضی مومن آفریدی'
      : currentLang === 'ps'
      ? profile.fullNamePs || 'قاضی مومن اپریدی'
      : profile.fullName || 'QAZI MOMIN AFRIDI';

  const heroSubtitle =
    currentLang === 'ur'
      ? siteSettings.siteSubtitleUr
      : currentLang === 'ps'
      ? siteSettings.siteSubtitlePs
      : siteSettings.siteSubtitleEn;

  return (
    <section
      id="home"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-[#030c08] bg-islamic-pattern"
    >
      {/* Background Mountain Layer with Parallax */}
      <div
        className="absolute inset-0 pointer-events-none transition-transform duration-700 ease-out will-change-transform"
        style={{
          transform: isMobile
            ? 'none'
            : `translate3d(${mousePos.x * -20}px, ${mousePos.y * -15}px, 0) scale(1.05)`,
          backgroundImage: `url(${siteSettings.heroImage || profile.coverPhoto})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          opacity: 0.28
        }}
      />

      {/* Atmospheric Vignette & Gradient Masks */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030d0a] via-[#030d0a]/75 to-[#030d0a]/90 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#030d0a]/95 via-transparent to-[#030d0a]/95 pointer-events-none" />

      {/* Ambient Lighting Rays (CSS 3D illusion) */}
      <div
        className="absolute -top-32 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none transition-transform duration-1000"
        style={{
          transform: isMobile
            ? 'none'
            : `translate3d(${mousePos.x * 40}px, ${mousePos.y * 30}px, 0)`
        }}
      />
      <div
        className="absolute top-1/3 -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none transition-transform duration-1000"
        style={{
          transform: isMobile
            ? 'none'
            : `translate3d(${mousePos.x * -35}px, ${mousePos.y * -25}px, 0)`
        }}
      />

      {/* Subtle Floating 3D Geometric Accents */}
      {!isMobile && (
        <>
          <div
            className="absolute top-28 left-[12%] w-16 h-16 border border-amber-400/20 rotate-45 pointer-events-none transition-transform duration-700"
            style={{
              transform: `translate3d(${mousePos.x * 30}px, ${mousePos.y * 30}px, 0) rotate(45deg)`
            }}
          />
          <div
            className="absolute bottom-32 left-[8%] w-10 h-10 border border-emerald-400/20 rotate-12 pointer-events-none transition-transform duration-700"
            style={{
              transform: `translate3d(${mousePos.x * -25}px, ${mousePos.y * -25}px, 0) rotate(12deg)`
            }}
          />
          <div
            className="absolute top-40 right-[10%] w-20 h-20 border border-emerald-500/15 rotate-45 pointer-events-none transition-transform duration-700"
            style={{
              transform: `translate3d(${mousePos.x * -40}px, ${mousePos.y * 35}px, 0) rotate(45deg)`
            }}
          />
        </>
      )}

      {/* Main Hero Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Text Content Column */}
          <div className="lg:col-span-7 flex flex-col items-start text-left rtl:text-right rtl:items-end">
            
            {/* Strict Factual Standard Notice */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-700/30 text-emerald-300 text-xs font-medium mb-6 backdrop-blur-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>{t.hero.verifiedFactualNotice}</span>
            </div>

            {/* Location Pill */}
            <div className="flex items-center gap-2 text-xs text-amber-300/90 font-medium tracking-wide mb-3">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {currentLang === 'ur'
                  ? profile.locationUr
                  : currentLang === 'ps'
                  ? profile.locationPs
                  : profile.location}
              </span>
            </div>

            {/* Large Prominent Hero Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white font-serif mb-4 leading-tight">
              <span className="block">{heroName}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl font-medium text-emerald-300/90 mb-6 font-serif">
              {heroSubtitle}
            </p>

            {/* Tagline / Brief Mission */}
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mb-8 leading-relaxed font-light">
              {currentLang === 'ur'
                ? siteSettings.heroQuoteUr
                : currentLang === 'ps'
                ? siteSettings.heroQuotePs
                : siteSettings.heroQuoteEn}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => scrollToSection('about')}
                className="px-7 py-3.5 rounded-md bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 text-white font-semibold text-sm tracking-wider uppercase border border-amber-400/40 shadow-lg shadow-emerald-950/80 hover:border-amber-300 hover:shadow-amber-500/20 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                {t.hero.exploreProfile}
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('activities')}
                className="px-7 py-3.5 rounded-md bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm tracking-wider uppercase border border-emerald-800/60 hover:border-emerald-500/60 transition-all duration-200 cursor-pointer backdrop-blur-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                {t.hero.publicActivities}
              </button>
            </div>

            {/* Verifiable Affiliation Badge */}
            <div className="mt-10 pt-6 border-t border-emerald-900/40 w-full flex items-center gap-3 text-xs text-slate-400">
              <Award className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                {currentLang === 'ur'
                  ? 'ضلع خیبر میں مصدقہ عوامی نمائندگی اور قبائلی امن و فلاح کے لیے آزادانہ کردار'
                  : currentLang === 'ps'
                  ? 'په خیبر ولسوالۍ کې د ولسی سوکالۍ او جرګو د سولې لپاره فعال استازی'
                  : profile.verifiedPartyAffiliation}
              </span>
            </div>
          </div>

          {/* 3D Depth Portrait Column */}
          <div className="lg:col-span-5 flex justify-center">
            <div
              className="relative w-full max-w-sm sm:max-w-md perspective-1000"
              style={{
                transform: isMobile
                  ? 'none'
                  : `rotateY(${mousePos.x * 10}deg) rotateX(${mousePos.y * -10}deg)`,
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {/* Gold & Emerald Glowing Backdrop Halo */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-emerald-600/30 via-amber-500/20 to-emerald-800/30 rounded-2xl blur-xl opacity-75" />

              {/* Glass Frame */}
              <div className="relative rounded-2xl overflow-hidden glass-panel border border-emerald-600/30 shadow-2xl shadow-black/80">
                {/* Subtle top gold highlight border */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent z-20" />

                {/* Portrait Image */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950">
                  <img
                    src={profile.profilePhoto}
                    alt={profile.fullName}
                    className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
                    loading="eager"
                  />
                  {/* Subtle lighting overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030d0a] via-transparent to-transparent opacity-60 pointer-events-none" />
                </div>

                {/* Portrait Caption Card */}
                <div className="p-4 bg-[#051a12]/95 border-t border-emerald-800/40 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-white font-serif tracking-wide">
                      {heroName}
                    </h2>
                    <p className="text-[11px] text-amber-300 font-medium">
                      {currentLang === 'ur'
                        ? profile.roleUr
                        : currentLang === 'ps'
                        ? profile.rolePs
                        : profile.role}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emerald-900/60 border border-emerald-600/50 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  </div>
                </div>
              </div>

              {/* Subtle floating 3D glass pill badge on desktop */}
              {!isMobile && (
                <div
                  className="absolute -bottom-4 -left-4 px-4 py-2 rounded-lg bg-[#04160f]/90 border border-emerald-600/40 shadow-xl backdrop-blur-md flex items-center gap-2 transition-transform duration-500"
                  style={{
                    transform: `translate3d(${mousePos.x * -15}px, ${mousePos.y * -15}px, 20px)`
                  }}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-medium text-slate-200">
                    {t.hero.districtKhyber}
                  </span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Down Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
        <span className="text-[10px] tracking-widest text-slate-400 uppercase mb-1">
          Scroll
        </span>
        <ArrowDown className="w-4 h-4 text-amber-400 animate-bounce" />
      </div>
    </section>
  );
};

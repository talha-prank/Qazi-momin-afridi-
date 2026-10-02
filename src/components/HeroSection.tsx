import React, { useState, useEffect, useRef } from 'react';
import { Language, Profile, SiteSettings } from '../types';
import { translations } from '../i18n/translations';
import { ArrowDown, MapPin, CheckCircle2, Award, Sparkles, ShieldCheck } from 'lucide-react';
import { LiveParticles3D } from './LiveParticles3D';

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
  const [imageLoaded, setImageLoaded] = useState(false);

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

  // Calculate dynamic 3D glare reflection angle
  const glareX = 50 + mousePos.x * 60;
  const glareY = 50 + mousePos.y * 60;

  return (
    <section
      id="home"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-[#020906] bg-islamic-pattern perspective-1500"
    >
      {/* Background Mountain Layer with Multi-Axis 3D Parallax */}
      <div
        className="absolute inset-0 pointer-events-none transition-transform duration-700 ease-out will-change-transform"
        style={{
          transform: isMobile
            ? 'none'
            : `translate3d(${mousePos.x * -24}px, ${mousePos.y * -18}px, 0) scale(1.08)`,
          backgroundImage: `url(${siteSettings.heroImage || profile.coverPhoto})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 38%',
          opacity: 0.32
        }}
      />

      {/* 3D Live Canvas Particle Atmosphere */}
      <LiveParticles3D mousePos={mousePos} isMobile={isMobile} />

      {/* Atmospheric Vignette & Deep Emerald Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#020b08] via-[#020b08]/80 to-[#020b08]/92 pointer-events-none z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#020b08]/95 via-transparent to-[#020b08]/95 pointer-events-none z-10" />

      {/* 3D Floating Volumetric Ambient Glow Spheres */}
      <div
        className="absolute -top-24 left-1/4 w-[450px] h-[450px] bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none transition-transform duration-1000 animate-glow-pulse z-10"
        style={{
          transform: isMobile
            ? 'none'
            : `translate3d(${mousePos.x * 50}px, ${mousePos.y * 40}px, 0)`
        }}
      />
      <div
        className="absolute top-1/3 -right-20 w-[400px] h-[400px] bg-amber-500/12 rounded-full blur-[90px] pointer-events-none transition-transform duration-1000 animate-glow-pulse z-10"
        style={{
          transform: isMobile
            ? 'none'
            : `translate3d(${mousePos.x * -45}px, ${mousePos.y * -35}px, 0)`
        }}
      />

      {/* Floating 3D Geometric Prisms (Polyhedron Wireframes) */}
      {!isMobile && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {/* Top Left Golden Diamond */}
          <div
            className="absolute top-28 left-[10%] w-16 h-16 border-2 border-amber-400/30 rounded-lg shadow-lg shadow-amber-500/10 transition-transform duration-700 animate-rotate-3d-slow"
            style={{
              transform: `translate3d(${mousePos.x * 40}px, ${mousePos.y * 35}px, 40px) rotateX(${mousePos.y * 30}deg) rotateY(${mousePos.x * 30}deg)`
            }}
          />

          {/* Bottom Left Emerald Hexagon */}
          <div
            className="absolute bottom-36 left-[8%] w-12 h-12 border border-emerald-400/30 rotate-45 rounded-sm shadow-md shadow-emerald-500/10 transition-transform duration-700 animate-float-3d"
            style={{
              transform: `translate3d(${mousePos.x * -35}px, ${mousePos.y * -30}px, 20px) rotate(45deg)`
            }}
          />

          {/* Top Right Floating Gold Ring */}
          <div
            className="absolute top-36 right-[8%] w-24 h-24 border border-amber-400/25 rounded-full transition-transform duration-700 animate-rotate-3d-slow"
            style={{
              transform: `translate3d(${mousePos.x * -50}px, ${mousePos.y * 45}px, 60px) rotateX(60deg)`
            }}
          />
        </div>
      )}

      {/* Main Hero Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col items-start text-left rtl:text-right rtl:items-end">
            
            {/* Live Verification Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-600/40 text-emerald-300 text-xs font-semibold mb-6 backdrop-blur-md shadow-lg shadow-emerald-950/80">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
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
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-serif mb-4 leading-tight">
              <span className="block drop-shadow-md">{heroName}</span>
            </h1>

            {/* Subtitle with Emerald Accent */}
            <p className="text-lg sm:text-xl font-medium text-emerald-300 mb-6 font-serif tracking-wide">
              {heroSubtitle}
            </p>

            {/* Tagline / Mission Quote */}
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
                className="px-8 py-3.5 rounded-lg bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 text-white font-semibold text-xs tracking-wider uppercase border border-amber-400/50 shadow-xl shadow-emerald-950 hover:border-amber-300 hover:shadow-amber-500/25 hover:-translate-y-1 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                {t.hero.exploreProfile}
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('activities')}
                className="px-8 py-3.5 rounded-lg bg-[#04160f]/90 hover:bg-[#062419] text-slate-200 hover:text-white font-semibold text-xs tracking-wider uppercase border border-emerald-700/60 hover:border-emerald-500/80 transition-all duration-200 cursor-pointer backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 hover:-translate-y-1"
              >
                {t.hero.publicActivities}
              </button>
            </div>

            {/* Verifiable Civic Affiliation */}
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

          {/* Right Column: 3D Live Depth Portrait Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div
              className={`relative w-full max-w-sm sm:max-w-md transform-style-3d ${
                isMobile ? 'animate-float-3d' : ''
              }`}
              style={{
                transform: isMobile
                  ? undefined
                  : `rotateY(${mousePos.x * 16}deg) rotateX(${mousePos.y * -16}deg)`,
                transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {/* Multi-layered 3D Glowing Ambient Halos */}
              <div className="absolute -inset-3 bg-gradient-to-tr from-emerald-600/35 via-amber-500/25 to-emerald-700/40 rounded-3xl blur-2xl opacity-80" />
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 via-emerald-500/25 to-amber-400/20 rounded-2xl blur-md opacity-60" />

              {/* 3D Glass Container with Dynamic Specular Glare */}
              <div className="relative rounded-2xl overflow-hidden glass-panel border border-emerald-500/40 shadow-2xl shadow-black/90 transform-style-3d group">
                
                {/* Dynamic Specular Light Glare Sweeping with Cursor */}
                <div
                  className="absolute inset-0 pointer-events-none z-30 opacity-40 transition-opacity duration-300 group-hover:opacity-75"
                  style={{
                    background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 243, 205, 0.4) 0%, rgba(16, 185, 129, 0.15) 35%, transparent 70%)`
                  }}
                />

                {/* Subtle top gold metallic accent hairline */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent z-40" />

                {/* High Resolution Official Portrait */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950">
                  <img
                    src={profile.profilePhoto}
                    alt={profile.fullName}
                    onLoad={() => setImageLoaded(true)}
                    className={`w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    loading="eager"
                  />

                  {/* Shimmer Placeholder before load */}
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-[#04140e] animate-pulse flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-amber-400 animate-spin" />
                    </div>
                  )}

                  {/* Gradient shadow mask at base of portrait */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030d0a] via-transparent to-transparent opacity-70 pointer-events-none" />
                </div>

                {/* Portrait Caption Plate */}
                <div className="p-4 bg-[#04160f]/98 border-t border-emerald-800/60 flex items-center justify-between z-30 relative">
                  <div>
                    <h2 className="text-base font-bold text-white font-serif tracking-wide">
                      {heroName}
                    </h2>
                    <p className="text-xs text-amber-300 font-medium">
                      {currentLang === 'ur'
                        ? profile.roleUr
                        : currentLang === 'ps'
                        ? profile.rolePs
                        : profile.role}
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-emerald-900/80 border border-amber-400/70 flex items-center justify-center shadow-md">
                    <CheckCircle2 className="w-5 h-5 text-amber-300" />
                  </div>
                </div>
              </div>

              {/* 3D Floating District Pill in Front Plane (Z-translated) */}
              <div
                className="absolute -bottom-4 -left-4 px-4 py-2 rounded-xl bg-[#03130d]/95 border border-emerald-500/50 shadow-2xl backdrop-blur-md flex items-center gap-2.5 z-40 transition-transform duration-500 hidden sm:flex"
                style={{
                  transform: isMobile
                    ? 'none'
                    : `translate3d(${mousePos.x * -18}px, ${mousePos.y * -18}px, 45px)`
                }}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-semibold text-slate-100">
                  {t.hero.districtKhyber}
                </span>
              </div>

              {/* 3D Floating Verified Seal on Top Right */}
              <div
                className="absolute -top-3 -right-3 px-3 py-1.5 rounded-lg bg-[#051e13]/95 border border-amber-400/60 shadow-xl backdrop-blur-md flex items-center gap-1.5 z-40 transition-transform duration-500 hidden sm:flex"
                style={{
                  transform: isMobile
                    ? 'none'
                    : `translate3d(${mousePos.x * 20}px, ${mousePos.y * 20}px, 50px)`
                }}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                  Verified Profile
                </span>
              </div>

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

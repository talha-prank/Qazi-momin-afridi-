import React, { useState } from 'react';
import { Language, Profile } from '../types';
import { translations } from '../i18n/translations';
import {
  MapPin,
  Globe,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  CheckCircle,
  X,
  FileText,
  Printer
} from 'lucide-react';
import { ScrollReveal3D } from './ScrollReveal3D';

interface AboutSectionProps {
  currentLang: Language;
  profile: Profile;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ currentLang, profile }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const t = translations[currentLang];

  const bioText =
    currentLang === 'ur'
      ? profile.bioUr
      : currentLang === 'ps'
      ? profile.bioPs
      : profile.bioEn;

  const fullName =
    currentLang === 'ur'
      ? profile.fullNameUr
      : currentLang === 'ps'
      ? profile.fullNamePs
      : profile.fullName;

  const role =
    currentLang === 'ur'
      ? profile.roleUr
      : currentLang === 'ps'
      ? profile.rolePs
      : profile.role;

  const location =
    currentLang === 'ur'
      ? profile.locationUr
      : currentLang === 'ps'
      ? profile.locationPs
      : profile.location;

  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setCardTilt({ x: x * 12, y: y * -12 });
  };

  const handleCardMouseLeave = () => {
    setCardTilt({ x: 0, y: 0 });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="about" className="py-24 bg-[#020b08] relative overflow-hidden">
      {/* Subtle backdrop styling */}
      <div className="absolute inset-0 bg-geometric-grid opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-emerald-700/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <ScrollReveal3D depth={-70} rotateX={5}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-xs font-medium text-emerald-400 mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.about.keyDetails}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-serif tracking-tight mb-4">
              {t.about.sectionTitle}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              {t.about.sectionSubtitle}
            </p>
          </div>
        </ScrollReveal3D>

        {/* Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* 3D Profile Card Column */}
          <div className="lg:col-span-5 perspective-1000">
            <ScrollReveal3D delay={120} depth={-90} rotateX={8}>
              <div
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                style={{
                  transform: `rotateX(${cardTilt.y}deg) rotateY(${cardTilt.x}deg)`,
                  transition: 'transform 0.25s ease-out'
                }}
                className="glass-panel transform-style-3d rounded-2xl p-6 sm:p-8 border border-emerald-700/50 shadow-2xl relative overflow-hidden group hover:border-amber-400/60"
              >
              
              {/* Dynamic 3D Glare */}
              <div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-40 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle at ${50 + cardTilt.x * 3}% ${50 - cardTilt.y * 3}%, rgba(245, 158, 11, 0.25) 0%, transparent 60%)`
                }}
              />

              {/* Gold decorative corner */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-400/15 to-transparent pointer-events-none" />

              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-amber-400 to-emerald-500 blur-sm opacity-60 group-hover:opacity-100 transition-opacity" />
                  <img
                    src={profile.profilePhoto}
                    alt={fullName}
                    className="relative w-20 h-20 rounded-xl object-cover object-top border-2 border-amber-400/70 shadow-md"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-serif">
                    {fullName}
                  </h3>
                  <p className="text-xs text-amber-300 font-medium">
                    {role}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>{location}</span>
                  </div>
                </div>
              </div>

              {/* Quick Details List */}
              <div className="space-y-4 pt-4 border-t border-emerald-900/50">
                <div className="flex items-start gap-3">
                  <Briefcase className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">
                      {t.about.affiliation}
                    </span>
                    <span className="text-xs text-slate-200">
                      {profile.verifiedPartyAffiliation}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">
                      {t.about.languages}
                    </span>
                    <span className="text-xs text-slate-200">
                      {profile.languages.join(' • ')}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <GraduationCap className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">
                      {t.about.academicRecord}
                    </span>
                    <span className="text-xs text-slate-200">
                      {profile.educationVerified[0] || 'Verified Public Record'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Interactive Read Full Profile Trigger */}
              <div className="mt-8 pt-5 border-t border-emerald-900/50">
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="w-full py-3 px-4 rounded-lg bg-emerald-950/70 hover:bg-emerald-900/70 border border-emerald-700/50 hover:border-amber-400/50 text-xs font-semibold uppercase tracking-wider text-amber-300 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>{t.about.fullProfile}</span>
                </button>
              </div>

            </div>
            </ScrollReveal3D>
          </div>

          {/* Biography & Key Initiatives Column */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <ScrollReveal3D delay={220} depth={-70} rotateX={4}>
              <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-emerald-800/30">
                <h3 className="text-xl sm:text-2xl font-bold text-white font-serif mb-4 flex items-center gap-2">
                  <span className="w-2 h-6 bg-amber-400 rounded-full inline-block" />
                  <span>{t.about.biographyTitle}</span>
                </h3>

                <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 font-light">
                  <p>{bioText}</p>
                </div>

                {/* Documented Experience Points */}
                <div className="mt-8 pt-6 border-t border-emerald-900/40">
                  <h4 className="text-xs uppercase tracking-wider text-amber-300 font-semibold mb-3">
                    {t.about.experienceTitle}
                  </h4>
                  <ul className="space-y-2.5">
                    {profile.experience.map((exp, index) => (
                      <li key={index} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span>{exp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Verified Designations */}
                <div className="mt-6 pt-5 border-t border-emerald-900/40">
                  <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                    {t.about.designations}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.verifiedDesignations.map((des, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded bg-slate-900/80 border border-emerald-800/40 text-xs text-slate-300"
                      >
                        {des}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </ScrollReveal3D>
          </div>

        </div>

      </div>

      {/* Read Full Profile Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#051811] border border-emerald-700/60 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-emerald-800/50 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-emerald-900/60 border border-amber-400/40 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-serif">
                    {fullName} — Official Profile Record
                  </h3>
                  <span className="text-xs text-emerald-400">{location}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="p-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-slate-300 hover:text-white border border-emerald-800/40 text-xs flex items-center gap-1.5 transition-colors"
                  title="Print Profile Record"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Print</span>
                </button>

                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
              <div>
                <h4 className="text-xs uppercase tracking-wider text-amber-300 font-bold mb-2">
                  Official Biography
                </h4>
                <p className="bg-[#020b08] p-4 rounded-xl border border-emerald-900/40 text-xs sm:text-sm">
                  {bioText}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#020b08] p-4 rounded-xl border border-emerald-900/40">
                  <h4 className="text-xs uppercase tracking-wider text-emerald-400 font-bold mb-2">
                    Verified Civic Roles
                  </h4>
                  <ul className="space-y-2 text-xs">
                    {profile.verifiedDesignations.map((d, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#020b08] p-4 rounded-xl border border-emerald-900/40">
                  <h4 className="text-xs uppercase tracking-wider text-emerald-400 font-bold mb-2">
                    Languages & Regional Fluency
                  </h4>
                  <ul className="space-y-2 text-xs">
                    {profile.languages.map((l, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                        <span>{l}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-wider text-amber-300 font-bold mb-2">
                  Documented Community & Civic Experience
                </h4>
                <div className="space-y-2">
                  {profile.experience.map((e, i) => (
                    <div
                      key={i}
                      className="p-3 bg-[#020b08] rounded-lg border border-emerald-900/30 text-xs flex items-start gap-2"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{e}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-emerald-950/40 rounded-lg border border-emerald-800/40 text-[11px] text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>{t.about.verifiedNotice}</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-6 pt-4 border-t border-emerald-900/40 flex justify-end">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-5 py-2.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors"
              >
                {t.about.closeProfile}
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};

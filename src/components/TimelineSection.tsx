import React from 'react';
import { Language, TimelineItem } from '../types';
import { translations } from '../i18n/translations';
import { Calendar, ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';
import { ScrollReveal3D } from './ScrollReveal3D';

interface TimelineSectionProps {
  currentLang: Language;
  timeline: TimelineItem[];
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({
  currentLang,
  timeline
}) => {
  const t = translations[currentLang];

  return (
    <section id="journey" className="py-24 bg-[#020b08] relative overflow-hidden">
      {/* Subtle decorative background */}
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-emerald-700/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <ScrollReveal3D depth={-70} rotateX={5}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/40 text-xs font-medium text-emerald-400 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Documented Milestones</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-serif tracking-tight mb-4">
              {t.journey.sectionTitle}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              {t.journey.sectionSubtitle}
            </p>
          </div>
        </ScrollReveal3D>

        {/* 3D Vertical Timeline */}
        <div className="relative">
          
          {/* Central Vertical Rail (desktop center, mobile left) */}
          <div className="absolute top-0 bottom-0 left-4 md:left-1/2 w-0.5 bg-gradient-to-b from-amber-400/40 via-emerald-500/30 to-transparent -translate-x-1/2" />

          {/* Timeline Nodes */}
          <div className="space-y-12">
            {timeline.map((item, index) => {
              const isEven = index % 2 === 0;

              const title =
                currentLang === 'ur'
                  ? item.titleUr
                  : currentLang === 'ps'
                  ? item.titlePs
                  : item.titleEn;

              const description =
                currentLang === 'ur'
                  ? item.descriptionUr
                  : currentLang === 'ps'
                  ? item.descriptionPs
                  : item.descriptionEn;

              return (
                <div
                  key={item.id}
                  className={`relative flex flex-col md:flex-row items-start ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Central Timeline Node/Orb */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#051c14] border-2 border-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20 z-20">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>

                  {/* Card Container */}
                  <div className="ml-12 md:ml-0 md:w-1/2 md:px-8 w-full">
                    <ScrollReveal3D
                      delay={100}
                      depth={isEven ? -75 : -85}
                      rotateX={4}
                    >
                      <div className="glass-panel glass-panel-hover rounded-2xl p-6 border border-emerald-800/30 shadow-xl relative overflow-hidden group">
                        
                        {/* Year Header & Category */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="px-3 py-1 rounded bg-amber-400/15 border border-amber-400/40 text-amber-300 font-serif font-bold text-xs tracking-wider">
                            {item.year}
                          </span>
                          <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-medium">
                            {item.category}
                          </span>
                        </div>

                        {/* Optional Photo */}
                        {item.imageUrl && (
                          <div className="relative h-44 w-full rounded-xl overflow-hidden mb-4 bg-slate-950 border border-emerald-900/40">
                            <img
                              src={item.imageUrl}
                              alt={title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          </div>
                        )}

                        {/* Title & Description */}
                        <h3 className="text-base sm:text-lg font-bold text-white font-serif mb-2 group-hover:text-amber-200 transition-colors">
                          {title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light mb-4">
                          {description}
                        </p>

                        {/* Source Citation */}
                        <div className="pt-3 border-t border-emerald-900/40 flex items-center justify-between text-xs text-slate-400">
                          <div className="flex items-center gap-1.5 truncate max-w-[240px]">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                            <span className="text-[11px] truncate">{item.source}</span>
                          </div>

                          {item.sourceUrl && (
                            <a
                              href={item.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors text-xs font-medium flex-shrink-0 ml-2"
                            >
                              <span>{t.journey.viewDocumentation}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>

                      </div>
                    </ScrollReveal3D>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};

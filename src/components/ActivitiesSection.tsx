import React, { useState } from 'react';
import { Language, Activity, ActivityCategory } from '../types';
import { translations } from '../i18n/translations';
import {
  Users,
  Compass,
  GraduationCap,
  Briefcase,
  Layers,
  HeartHandshake,
  AlertCircle,
  Megaphone,
  MapPin,
  Calendar,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface ActivitiesSectionProps {
  currentLang: Language;
  activities: Activity[];
}

export const ActivitiesSection: React.FC<ActivitiesSectionProps> = ({
  currentLang,
  activities
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const t = translations[currentLang];

  const categories: { label: string; value: string }[] = [
    { label: t.activities.allCategories, value: 'All' },
    { label: 'Community Development', value: 'Community Development' },
    { label: 'Peace & Community Initiatives', value: 'Peace & Community Initiatives' },
    { label: 'Youth Engagement', value: 'Youth Engagement' },
    { label: 'Education', value: 'Education' },
    { label: 'Local Issues', value: 'Local Issues' },
    { label: 'Development of Merged Districts', value: 'Development of Merged Districts' }
  ];

  const filteredActivities =
    selectedCategory === 'All'
      ? activities
      : activities.filter((a) => a.category === selectedCategory);

  const getCategoryIcon = (cat: ActivityCategory | string) => {
    switch (cat) {
      case 'Peace & Community Initiatives':
        return <HeartHandshake className="w-4 h-4 text-amber-400" />;
      case 'Youth Engagement':
        return <Users className="w-4 h-4 text-emerald-400" />;
      case 'Education':
        return <GraduationCap className="w-4 h-4 text-amber-400" />;
      case 'Employment':
        return <Briefcase className="w-4 h-4 text-emerald-400" />;
      case 'Development of Merged Districts':
        return <Layers className="w-4 h-4 text-emerald-400" />;
      case 'Local Issues':
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
      case 'Public Awareness':
        return <Megaphone className="w-4 h-4 text-emerald-400" />;
      default:
        return <Compass className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <section id="activities" className="py-24 bg-[#030d0a] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/40 text-xs font-medium text-emerald-400 mb-3">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Documented Public Engagements</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-serif tracking-tight mb-4">
            {t.activities.sectionTitle}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {t.activities.sectionSubtitle}
          </p>
        </div>

        {/* Interactive Category Filter Bar */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                selectedCategory === cat.value
                  ? 'bg-emerald-800 text-amber-200 border border-amber-400/40 shadow-md shadow-emerald-950'
                  : 'bg-[#051a12]/80 text-slate-400 hover:text-slate-200 hover:bg-emerald-950 border border-emerald-900/30'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Activities Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredActivities.map((act) => {
            const title =
              currentLang === 'ur'
                ? act.titleUr
                : currentLang === 'ps'
                ? act.titlePs
                : act.titleEn;

            const description =
              currentLang === 'ur'
                ? act.descriptionUr
                : currentLang === 'ps'
                ? act.descriptionPs
                : act.descriptionEn;

            return (
              <div
                key={act.id}
                className="glass-panel glass-panel-hover rounded-2xl overflow-hidden border border-emerald-800/30 flex flex-col group"
              >
                {/* Image Header with Category Badge */}
                <div className="relative h-56 sm:h-64 overflow-hidden bg-slate-950">
                  <img
                    src={act.imageUrl}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04120d] via-transparent to-transparent opacity-80" />

                  {/* Clean unboxed category indicator */}
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded bg-[#030d0a]/85 border border-emerald-700/50 backdrop-blur-md text-xs text-amber-300 font-medium">
                    {getCategoryIcon(act.category)}
                    <span>{act.category}</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between bg-[#04120d]/90">
                  <div>
                    {/* Metadata: Date and Location */}
                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        {act.date}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        {act.location}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white font-serif mb-3 leading-snug group-hover:text-amber-200 transition-colors">
                      {title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light mb-6">
                      {description}
                    </p>
                  </div>

                  {/* Verifiable Source Footnote */}
                  <div className="pt-4 border-t border-emerald-900/40 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-[11px] truncate max-w-[200px] sm:max-w-xs">
                        {act.source}
                      </span>
                    </div>

                    {act.sourceUrl && (
                      <a
                        href={act.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors font-medium text-xs flex-shrink-0"
                      >
                        <span>{t.activities.viewSource}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

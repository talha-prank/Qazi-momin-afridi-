import React, { useState } from 'react';
import { Language, Activity, TimelineItem, NewsArticle, SiteSettings } from '../types';
import { translations } from '../i18n/translations';
import {
  ShieldCheck,
  ExternalLink,
  Search,
  FileCheck2,
  Lock,
  Calendar,
  Layers
} from 'lucide-react';

interface SourcesSectionProps {
  currentLang: Language;
  activities: Activity[];
  timeline: TimelineItem[];
  news: NewsArticle[];
  siteSettings: SiteSettings;
}

interface CitationItem {
  id: string;
  claim: string;
  category: string;
  source: string;
  date: string;
  url?: string;
}

export const SourcesSection: React.FC<SourcesSectionProps> = ({
  currentLang,
  activities,
  timeline,
  news,
  siteSettings
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const t = translations[currentLang];

  // Aggregate all citations from verified activities, timeline, and news
  const citations: CitationItem[] = [
    ...timeline.map((t) => ({
      id: `cit-tl-${t.id}`,
      claim:
        currentLang === 'ur'
          ? t.titleUr
          : currentLang === 'ps'
          ? t.titlePs
          : t.titleEn,
      category: 'Civic Milestone',
      source: t.source,
      date: t.year,
      url: t.sourceUrl
    })),
    ...activities.map((a) => ({
      id: `cit-act-${a.id}`,
      claim:
        currentLang === 'ur'
          ? a.titleUr
          : currentLang === 'ps'
          ? a.titlePs
          : a.titleEn,
      category: a.category,
      source: a.source,
      date: a.date,
      url: a.sourceUrl
    })),
    ...news.map((n) => ({
      id: `cit-news-${n.id}`,
      claim:
        currentLang === 'ur'
          ? n.titleUr
          : currentLang === 'ps'
          ? n.titlePs
          : n.titleEn,
      category: 'Media & Statement',
      source: n.source,
      date: n.date,
      url: n.sourceUrl
    }))
  ];

  const filteredCitations = citations.filter((c) => {
    return (
      c.claim.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <section id="sources" className="py-24 bg-[#020b08] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/40 text-xs font-medium text-emerald-400 mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Transparency Standard</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-serif tracking-tight mb-4">
            {t.sources.sectionTitle}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6">
            {t.sources.description}
          </p>
        </div>

        {/* Verification Pledge Callout */}
        <div className="mb-10 p-5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left rtl:text-right">
            <FileCheck2 className="w-8 h-8 text-amber-400 flex-shrink-0" />
            <div>
              <h4 className="text-xs uppercase tracking-wider text-amber-300 font-bold">
                {t.sources.transparencyPledge}
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                {currentLang === 'ur'
                  ? siteSettings.sourcesNoteUr
                  : currentLang === 'ps'
                  ? siteSettings.sourcesNotePs
                  : siteSettings.sourcesNoteEn}
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8 relative">
          <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search documented public records and sources..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#051a12] border border-emerald-800/50 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        {/* Citations Table */}
        <div className="glass-panel rounded-2xl overflow-hidden border border-emerald-800/40 shadow-xl max-w-5xl mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right border-collapse text-xs">
              <thead>
                <tr className="bg-[#04160f] border-b border-emerald-900/60 text-slate-300 uppercase tracking-wider text-[11px] font-semibold">
                  <th className="py-3.5 px-4">{t.sources.claim}</th>
                  <th className="py-3.5 px-4">{t.sources.publication}</th>
                  <th className="py-3.5 px-4">{t.sources.date}</th>
                  <th className="py-3.5 px-4 text-center">{t.sources.verificationLink}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/30">
                {filteredCitations.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-emerald-950/40 transition-colors text-slate-300"
                  >
                    <td className="py-3.5 px-4 font-medium text-white max-w-xs sm:max-w-md">
                      <div className="truncate">{item.claim}</div>
                      <span className="text-[10px] text-emerald-400/90 uppercase font-semibold">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        <span>{item.source}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-400">
                      {item.date}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-900/40 hover:bg-emerald-800/60 text-amber-300 hover:text-amber-200 border border-emerald-700/40 text-[11px] font-medium transition-colors"
                        >
                          <span>Verify</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Archived Record</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
};

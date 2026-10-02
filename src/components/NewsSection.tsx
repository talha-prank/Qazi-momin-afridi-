import React, { useState } from 'react';
import { Language, NewsArticle } from '../types';
import { translations } from '../i18n/translations';
import {
  Search,
  Calendar,
  Share2,
  ExternalLink,
  ShieldCheck,
  Check,
  Newspaper
} from 'lucide-react';

interface NewsSectionProps {
  currentLang: Language;
  news: NewsArticle[];
}

export const NewsSection: React.FC<NewsSectionProps> = ({ currentLang, news }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const t = translations[currentLang];

  const categories = ['All', ...Array.from(new Set(news.map((n) => n.category)))];

  const filteredNews = news.filter((article) => {
    const title =
      currentLang === 'ur'
        ? article.titleUr
        : currentLang === 'ps'
        ? article.titlePs
        : article.titleEn;

    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.source.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || article.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const featured = news.find((n) => n.isFeatured) || news[0];
  const regularArticles = filteredNews.filter((n) => n.id !== featured?.id);

  const handleShare = (article: NewsArticle) => {
    const url = article.sourceUrl || window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(article.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <section id="news" className="py-24 bg-[#030d0a] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/40 text-xs font-medium text-emerald-400 mb-3">
            <Newspaper className="w-3.5 h-3.5 text-amber-400" />
            <span>Documented Media Record</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-serif tracking-tight mb-4">
            {t.news.sectionTitle}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {t.news.sectionSubtitle}
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-emerald-900/40">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.news.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#051a12] border border-emerald-800/50 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
            />
          </div>

          {/* Categories */}
          <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-800 text-amber-200 border border-amber-400/40'
                    : 'bg-[#051a12]/80 text-slate-400 hover:text-slate-200 border border-emerald-900/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Story (if available and matching criteria) */}
        {featured && (!searchTerm || filteredNews.includes(featured)) && (
          <div className="mb-14">
            <div className="glass-panel rounded-2xl overflow-hidden border border-emerald-800/40 grid grid-cols-1 lg:grid-cols-12 group hover:border-amber-400/40 transition-all duration-300">
              
              <div className="lg:col-span-7 relative h-72 lg:h-auto overflow-hidden bg-slate-950">
                <img
                  src={featured.imageUrl}
                  alt={featured.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-transparent via-transparent to-[#04120d] opacity-90" />
              </div>

              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-[#04120d]/95">
                <div>
                  <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold uppercase tracking-wider mb-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-ping" />
                    <span>{t.news.featuredStory}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-400 font-normal">{featured.date}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white font-serif mb-3 leading-snug group-hover:text-amber-200 transition-colors">
                    {currentLang === 'ur'
                      ? featured.titleUr
                      : currentLang === 'ps'
                      ? featured.titlePs
                      : featured.titleEn}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light mb-6">
                    {currentLang === 'ur'
                      ? featured.excerptUr
                      : currentLang === 'ps'
                      ? featured.excerptPs
                      : featured.excerptEn}
                  </p>
                </div>

                <div className="pt-4 border-t border-emerald-900/40 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>{featured.source}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleShare(featured)}
                      className="p-1.5 rounded hover:bg-emerald-900/50 text-slate-400 hover:text-amber-300 transition-colors"
                      title={t.news.shareArticle}
                    >
                      {copiedId === featured.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                    </button>

                    {featured.sourceUrl && (
                      <a
                        href={featured.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300"
                      >
                        <span>{t.news.readFullArticle}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* Regular News Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularArticles.map((article) => {
            const title =
              currentLang === 'ur'
                ? article.titleUr
                : currentLang === 'ps'
                ? article.titlePs
                : article.titleEn;

            const excerpt =
              currentLang === 'ur'
                ? article.excerptUr
                : currentLang === 'ps'
                ? article.excerptPs
                : article.excerptEn;

            return (
              <div
                key={article.id}
                className="glass-panel glass-panel-hover rounded-xl overflow-hidden border border-emerald-800/30 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 overflow-hidden bg-slate-950">
                    <img
                      src={article.imageUrl}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#04120d] via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-2 left-3 text-[11px] text-amber-300/90 font-medium">
                      {article.category}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{article.date}</span>
                    </div>

                    <h4 className="text-base font-bold text-white font-serif mb-2.5 leading-snug group-hover:text-amber-200 transition-colors line-clamp-2">
                      {title}
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed font-light line-clamp-3 mb-4">
                      {excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-emerald-900/30 mt-auto flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400 truncate max-w-[150px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span className="text-[11px] truncate">{article.source}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleShare(article)}
                      className="p-1 text-slate-400 hover:text-amber-300 transition-colors"
                      title={t.news.shareArticle}
                    >
                      {copiedId === article.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Share2 className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {article.sourceUrl && (
                      <a
                        href={article.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-400 hover:text-amber-300"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
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

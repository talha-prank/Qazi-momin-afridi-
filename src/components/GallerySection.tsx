import React, { useState } from 'react';
import { Language, GalleryItem, GalleryCategory } from '../types';
import { translations } from '../i18n/translations';
import {
  Images,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  MapPin,
  Calendar
} from 'lucide-react';
import { ScrollReveal3D } from './ScrollReveal3D';

interface GallerySectionProps {
  currentLang: Language;
  gallery: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ currentLang, gallery }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);

  const t = translations[currentLang];

  const categories = [
    'All',
    'Jirgas',
    'Youth Events',
    'Public Events',
    'Community Meetings',
    'Political Activities',
    'Public Speeches',
    'Other'
  ];

  const filteredGallery =
    selectedCategory === 'All'
      ? gallery
      : gallery.filter((item) => item.category === selectedCategory);

  const openLightbox = (index: number) => {
    setActiveImageIndex(index);
    setZoomed(false);
  };

  const closeLightbox = () => {
    setActiveImageIndex(null);
    setZoomed(false);
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeImageIndex === null) return;
    setActiveImageIndex((activeImageIndex + 1) % filteredGallery.length);
    setZoomed(false);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeImageIndex === null) return;
    setActiveImageIndex(
      (activeImageIndex - 1 + filteredGallery.length) % filteredGallery.length
    );
    setZoomed(false);
  };

  const activeItem = activeImageIndex !== null ? filteredGallery[activeImageIndex] : null;

  return (
    <section id="gallery" className="py-24 bg-[#030d0a] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal3D depth={-75} rotateX={5}>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/40 text-xs font-medium text-emerald-400 mb-3">
              <Images className="w-3.5 h-3.5 text-amber-400" />
              <span>Documentary Photography</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-serif tracking-tight mb-4">
              {t.gallery.sectionTitle}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              {t.gallery.sectionSubtitle}
            </p>
          </div>
        </ScrollReveal3D>

        {/* Category Filters */}
        <ScrollReveal3D delay={80} depth={-50} rotateX={3}>
          <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-800 text-amber-200 border border-amber-400/40 shadow-sm'
                    : 'bg-[#051a12]/80 text-slate-400 hover:text-slate-200 border border-emerald-900/30'
                }`}
              >
                {cat === 'All' ? t.gallery.allPhotos : cat}
              </button>
            ))}
          </div>
        </ScrollReveal3D>

        {/* Masonry-Style Photo Grid with 3D Z-axis entrance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item, index) => {
            const title =
              currentLang === 'ur'
                ? item.titleUr
                : currentLang === 'ps'
                ? item.titlePs
                : item.titleEn;

            const caption =
              currentLang === 'ur'
                ? item.captionUr
                : currentLang === 'ps'
                ? item.captionPs
                : item.captionEn;

            return (
              <ScrollReveal3D
                key={item.id}
                delay={(index % 3) * 110}
                depth={-85}
                rotateX={5}
                className="h-full"
              >
                <div
                  onClick={() => openLightbox(index)}
                  className="group relative rounded-2xl overflow-hidden glass-panel border border-emerald-800/30 cursor-pointer shadow-lg hover:border-amber-400/50 transition-all duration-300 transform hover:-translate-y-1 h-full"
                >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                  <img
                    src={item.imageUrl}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020b08] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Enlarge Overlay Button */}
                  <div className="absolute top-3 right-3 p-2 rounded-lg bg-black/60 border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4 text-amber-300" />
                  </div>

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded bg-black/70 border border-emerald-700/40 text-emerald-300">
                    {item.category}
                  </div>
                </div>

                {/* Caption Footer */}
                <div className="p-4 bg-[#04120d]/95">
                  <h4 className="text-sm font-bold text-white font-serif mb-1 group-hover:text-amber-200 transition-colors">
                    {title}
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-2 mb-2 font-light">
                    {caption}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-emerald-900/30">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-emerald-400" />
                      {item.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      {item.location}
                    </span>
                  </div>
                </div>

                </div>
              </ScrollReveal3D>
            );
          })}
        </div>

      </div>

      {/* Fullscreen Lightbox Modal */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-md animate-fadeIn"
          onClick={closeLightbox}
        >
          {/* Controls Bar */}
          <div
            className="absolute top-4 right-4 z-50 flex items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setZoomed(!zoomed)}
              className="p-2 rounded-lg bg-slate-900/90 text-slate-300 hover:text-white border border-slate-700"
              title="Toggle Zoom"
            >
              {zoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
            </button>
            <button
              type="button"
              onClick={closeLightbox}
              className="p-2 rounded-lg bg-slate-900/90 text-slate-300 hover:text-white border border-slate-700"
              title={t.gallery.close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Prev Button */}
          <button
            type="button"
            onClick={prevImage}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all z-40"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Button */}
          <button
            type="button"
            onClick={nextImage}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all z-40"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image & Caption Container */}
          <div
            className="max-w-5xl max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative overflow-hidden rounded-xl max-h-[75vh] flex items-center justify-center">
              <img
                src={activeItem.imageUrl}
                alt={activeItem.titleEn}
                className={`max-h-[75vh] max-w-full object-contain transition-transform duration-300 ${
                  zoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
                }`}
                onClick={() => setZoomed(!zoomed)}
              />
            </div>

            {/* Bottom Caption */}
            <div className="mt-4 p-4 rounded-xl bg-[#04140e]/90 border border-emerald-800/40 text-center max-w-2xl w-full">
              <h3 className="text-base font-bold text-white font-serif mb-1">
                {currentLang === 'ur'
                  ? activeItem.titleUr
                  : currentLang === 'ps'
                  ? activeItem.titlePs
                  : activeItem.titleEn}
              </h3>
              <p className="text-xs text-slate-300 mb-2">
                {currentLang === 'ur'
                  ? activeItem.captionUr
                  : currentLang === 'ps'
                  ? activeItem.captionPs
                  : activeItem.captionEn}
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-emerald-400">
                <span>{activeItem.date}</span>
                <span>•</span>
                <span>{activeItem.location}</span>
                <span>•</span>
                <span className="text-amber-300">{activeItem.category}</span>
              </div>
            </div>
          </div>

        </div>
      )}
    </section>
  );
};

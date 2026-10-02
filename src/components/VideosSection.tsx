import React, { useState } from 'react';
import { Language, VideoItem } from '../types';
import { translations } from '../i18n/translations';
import {
  Play,
  Calendar,
  X,
  Tv,
  ExternalLink,
  ShieldCheck,
  Video
} from 'lucide-react';

interface VideosSectionProps {
  currentLang: Language;
  videos: VideoItem[];
}

export const VideosSection: React.FC<VideosSectionProps> = ({ currentLang, videos }) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const t = translations[currentLang];

  const getEmbedUrl = (video: VideoItem) => {
    if (video.platform === 'youtube') {
      const match = video.videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      const videoId = match ? match[1] : '';
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    // Return direct or URL
    return video.videoUrl;
  };

  return (
    <section id="videos" className="py-24 bg-[#020b08] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/40 text-xs font-medium text-emerald-400 mb-3">
            <Video className="w-3.5 h-3.5 text-amber-400" />
            <span>Documented Public Addresses</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-serif tracking-tight mb-4">
            {t.videos.sectionTitle}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {t.videos.sectionSubtitle}
          </p>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {videos.map((vid) => {
            const title =
              currentLang === 'ur'
                ? vid.titleUr
                : currentLang === 'ps'
                ? vid.titlePs
                : vid.titleEn;

            const description =
              currentLang === 'ur'
                ? vid.descriptionUr
                : currentLang === 'ps'
                ? vid.descriptionPs
                : vid.descriptionEn;

            return (
              <div
                key={vid.id}
                className="glass-panel glass-panel-hover rounded-2xl overflow-hidden border border-emerald-800/40 flex flex-col group cursor-pointer"
                onClick={() => setSelectedVideo(vid)}
              >
                {/* Thumbnail with Cinematic Play Button */}
                <div className="relative aspect-video overflow-hidden bg-slate-950">
                  <img
                    src={vid.thumbnailUrl}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                  {/* Play Button Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-emerald-600/90 border border-amber-400/80 flex items-center justify-center shadow-xl shadow-black/80 group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                    </div>
                  </div>

                  {/* Platform Indicator */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#030d0a]/80 border border-emerald-800/50 backdrop-blur-md text-[11px] text-amber-300 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <Tv className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{vid.platform}</span>
                  </div>

                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/75 text-[10px] text-slate-300">
                    {vid.date}
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-6 flex-1 flex flex-col justify-between bg-[#04120d]/90">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white font-serif mb-2 group-hover:text-amber-200 transition-colors">
                      {title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light mb-4 line-clamp-2">
                      {description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-emerald-900/40 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1.5 truncate max-w-[200px]">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="truncate">{vid.source}</span>
                    </div>

                    <span className="text-amber-400 font-semibold text-xs flex items-center gap-1">
                      {t.videos.watchVideo}
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Cinematic Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-fadeIn">
          <div className="bg-[#051811] border border-emerald-700/60 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl relative">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-800/50">
              <h3 className="text-sm sm:text-base font-bold text-white font-serif truncate pr-4">
                {currentLang === 'ur'
                  ? selectedVideo.titleUr
                  : currentLang === 'ps'
                  ? selectedVideo.titlePs
                  : selectedVideo.titleEn}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors"
                aria-label={t.videos.closeModal}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Frame */}
            <div className="relative aspect-video w-full bg-black">
              {selectedVideo.platform === 'youtube' ? (
                <iframe
                  src={getEmbedUrl(selectedVideo)}
                  title={selectedVideo.titleEn}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                  <p className="text-slate-300 text-sm mb-4">
                    This video is hosted on {selectedVideo.platform}. You can view the documented source directly:
                  </p>
                  <a
                    href={selectedVideo.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs tracking-wider uppercase inline-flex items-center gap-2"
                  >
                    <span>Open On {selectedVideo.platform}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>

            {/* Modal Info Footer */}
            <div className="p-5 bg-[#030d0a] text-xs text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                {selectedVideo.date}
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                {selectedVideo.source}
              </span>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};

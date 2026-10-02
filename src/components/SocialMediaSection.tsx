import React from 'react';
import { Language, SocialLinks } from '../types';
import {
  Share2,
  CheckCircle2,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { ScrollReveal3D } from './ScrollReveal3D';

interface SocialMediaSectionProps {
  currentLang: Language;
  socialLinks: SocialLinks;
}

export const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({
  currentLang,
  socialLinks
}) => {
  const platforms = [
    {
      name: 'Facebook',
      handle: 'Qazi Momin Khan Afridi',
      url: socialLinks.facebook,
      color: 'hover:border-blue-500/60 hover:text-blue-400 group-hover:shadow-blue-500/10',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )
    },
    {
      name: 'TikTok',
      handle: '@qazimominkhan4941',
      url: socialLinks.tiktok,
      color: 'hover:border-cyan-400/60 hover:text-cyan-300 group-hover:shadow-cyan-500/10',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.11V9.4a6.33 6.33 0 0 0-.86-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.33 6.33 0 0 0 6.33-6.34V8.76a8.28 8.28 0 0 0 4.84 1.56V6.87a4.85 4.85 0 0 1-1.06-.18z" />
        </svg>
      )
    },
    {
      name: 'Instagram',
      handle: '@qazimominafridi',
      url: socialLinks.instagram,
      color: 'hover:border-pink-500/60 hover:text-pink-400 group-hover:shadow-pink-500/10',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      )
    },
    {
      name: 'YouTube',
      handle: 'Official Channel',
      url: socialLinks.youtube,
      color: 'hover:border-red-500/60 hover:text-red-400 group-hover:shadow-red-500/10',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      )
    },
    {
      name: 'X (Twitter)',
      handle: '@QaziMominAfridi',
      url: socialLinks.twitter,
      color: 'hover:border-slate-400/60 hover:text-white group-hover:shadow-slate-500/10',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    },
    {
      name: 'WhatsApp Secretariat',
      handle: 'Direct Public Line',
      url: socialLinks.whatsapp,
      color: 'hover:border-emerald-500/60 hover:text-emerald-400 group-hover:shadow-emerald-500/10',
      icon: <MessageCircle className="w-5 h-5" />
    }
  ];

  return (
    <section id="social" className="py-20 bg-[#030d0a] border-t border-emerald-900/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <ScrollReveal3D depth={-70} rotateX={5}>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-xs font-medium text-emerald-400 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Verified Public Channels</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-serif">
              {currentLang === 'ur'
                ? 'مستند اور تصدیق شدہ سوشل میڈیا اکاؤنٹس'
                : currentLang === 'ps'
                ? 'باوري او رسمي ټولنیزې شبکې'
                : 'Official Verified Public Channels'}
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
              {currentLang === 'ur'
                ? 'جعلی اور غیر مصدقہ اکاؤنٹس سے بچنے کے لیے صرف ان سرکاری چینلز سے رجوع فرمائیں۔'
                : currentLang === 'ps'
                ? 'د جعلي پاڼو د مخنیوي لپاره، مهرباني وکړئ یوازې دا رسمي ادرسونه وڅارئ.'
                : 'To avoid unauthorized duplicates, only follow and communicate via these officially designated public handles.'}
            </p>
          </div>
        </ScrollReveal3D>

        {/* 3D Channels Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {platforms.map((p, index) => (
            <ScrollReveal3D
              key={p.name}
              delay={index * 70}
              depth={-80}
              rotateX={6}
              className="h-full"
            >
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-4 rounded-xl glass-panel glass-panel-hover border border-emerald-800/30 flex flex-col items-center justify-center text-center text-slate-300 transition-all duration-300 ${p.color} group h-full shadow-lg`}
              >
                <div className="mb-2 text-slate-400 group-hover:scale-110 group-hover:text-amber-300 transition-transform">
                  {p.icon}
                </div>
                <span className="text-xs font-bold text-white mb-0.5">{p.name}</span>
                <span className="text-[11px] text-slate-400 truncate max-w-[130px]">
                  {p.handle}
                </span>
                <span className="mt-2 text-[10px] text-amber-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Visit Official</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </span>
              </a>
            </ScrollReveal3D>
          ))}
        </div>
      </div>
    </section>
  );
};

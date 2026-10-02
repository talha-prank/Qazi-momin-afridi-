import React, { useState } from 'react';
import { Language, SocialLinks } from '../types';
import { translations } from '../i18n/translations';
import { Shield, CheckCircle2, X } from 'lucide-react';

interface FooterProps {
  currentLang: Language;
  socialLinks: SocialLinks;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentLang,
  socialLinks,
  onOpenAdmin
}) => {
  const [modalType, setModalType] = useState<'privacy' | 'terms' | null>(null);
  const t = translations[currentLang];

  const quickLinks = [
    { href: '#home', label: t.nav.home },
    { href: '#about', label: t.nav.about },
    { href: '#activities', label: t.nav.activities },
    { href: '#journey', label: t.nav.journey },
    { href: '#news', label: t.nav.news },
    { href: '#gallery', label: t.nav.gallery },
    { href: '#videos', label: t.nav.videos },
    { href: '#sources', label: t.nav.sources },
    { href: '#contact', label: t.nav.contact }
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#010705] border-t border-emerald-950 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Brand & Purpose Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-gradient-to-br from-emerald-800 to-slate-900 border border-amber-500/40 flex items-center justify-center">
                <span className="font-serif text-amber-300 font-bold text-sm">
                  QMA
                </span>
              </div>
              <div>
                <h4 className="text-white font-serif font-bold text-base tracking-wider uppercase">
                  Qazi Momin Afridi
                </h4>
                <p className="text-[11px] text-emerald-400">
                  {t.footer.tagline}
                </p>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-md font-light">
              {t.footer.officialNotice}
            </p>

            <div className="flex items-center gap-2 text-[11px] text-amber-300/80 pt-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>Strict Factual Policy: Verified sources only.</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-4">
            <h5 className="text-white font-serif font-semibold text-xs uppercase tracking-wider mb-4">
              {t.footer.quickLinks}
            </h5>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {quickLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="hover:text-amber-300 transition-colors py-1"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Legal, Secretariat & Admin Column */}
          <div className="md:col-span-3 space-y-4">
            <h5 className="text-white font-serif font-semibold text-xs uppercase tracking-wider mb-4">
              Governance & Policies
            </h5>
            <div className="space-y-2 text-xs">
              <div>
                <button
                  type="button"
                  onClick={() => setModalType('privacy')}
                  className="hover:text-amber-300 transition-colors"
                >
                  {t.footer.privacyPolicy}
                </button>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => setModalType('terms')}
                  className="hover:text-amber-300 transition-colors"
                >
                  {t.footer.termsOfService}
                </button>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-950/70 border border-emerald-800/40 text-amber-300 hover:text-white transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Authorized Admin Portal</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-emerald-950/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Qazi Momin Afridi. {t.footer.allRightsReserved}</p>
          <p>{t.footer.designedWithRespect}</p>
        </div>
      </div>

      {/* Privacy Policy / Terms Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#051811] border border-emerald-700/60 rounded-2xl max-w-xl w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-800/50 mb-4">
              <h3 className="text-base font-bold text-white font-serif">
                {modalType === 'privacy' ? 'Privacy Policy' : 'Terms of Public Service Portal'}
              </h3>
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-3 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
              {modalType === 'privacy' ? (
                <>
                  <p>
                    <strong>1. Information We Collect:</strong> When you send a message through our official contact portal, we collect your name, email address, phone number, and query strictly to allow the secretariat to respond to your inquiry.
                  </p>
                  <p>
                    <strong>2. Use of Information:</strong> Personal contact information is never sold, exchanged, or publicized. It is held securely and reviewed only by authorized staff for community coordination.
                  </p>
                  <p>
                    <strong>3. Data Security:</strong> All submissions utilize encrypted transport, spam honeypot filters, and server-side storage safeguards.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>1. Strict Factual Accuracy:</strong> All public profile milestones, speeches, and community activities are documented for transparent constituent record.
                  </p>
                  <p>
                    <strong>2. Neutrality Standard:</strong> The website provides factual documentation of civic representation and development initiatives in District Khyber.
                  </p>
                  <p>
                    <strong>3. Authorized Media Usage:</strong> Photographs and transcripts provided on this platform may be cited by press organizations with due attribution to the official archive.
                  </p>
                </>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-emerald-800/40 flex justify-end">
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="px-4 py-2 rounded bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

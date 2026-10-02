import React, { useState } from 'react';
import { Language, SiteSettings } from '../types';
import { translations } from '../i18n/translations';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

interface ContactSectionProps {
  currentLang: Language;
  siteSettings: SiteSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  currentLang,
  siteSettings
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    honeypot: '' // Spam bot trap
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const t = translations[currentLang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setErrorMessage('Please fill in your name, email, and message.');
      return;
    }

    // Bot detection check
    if (formData.honeypot) {
      setStatus('error');
      setErrorMessage('Submission rejected.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to deliver message');
      }

      setStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        honeypot: ''
      });
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Error transmitting message. Please try again.');
    }
  };

  const officeAddress =
    currentLang === 'ur'
      ? siteSettings.officeAddressUr
      : currentLang === 'ps'
      ? siteSettings.officeAddressPs
      : siteSettings.officeAddressEn;

  return (
    <section id="contact" className="py-24 bg-[#020b08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/40 text-xs font-medium text-emerald-400 mb-3">
            <Mail className="w-3.5 h-3.5 text-amber-400" />
            <span>Constituent Secretariat</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-serif tracking-tight mb-4">
            {t.contact.sectionTitle}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {t.contact.sectionSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Contact Details Column */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-emerald-800/40 space-y-6">
              <h3 className="text-xl font-bold text-white font-serif mb-4 flex items-center gap-2">
                <span className="w-2 h-5 bg-amber-400 rounded-full inline-block" />
                <span>{t.contact.officialChannels}</span>
              </h3>

              <div className="space-y-5 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-800/50 text-emerald-400 flex-shrink-0">
                    <MapPin className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">
                      {t.contact.officeAddress}
                    </span>
                    <span className="text-slate-200 leading-relaxed block mt-1">
                      {officeAddress}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-800/50 text-emerald-400 flex-shrink-0">
                    <Mail className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">
                      Official Inquiries Email
                    </span>
                    <a
                      href={`mailto:${siteSettings.contactEmail}`}
                      className="text-amber-300 hover:text-amber-200 transition-colors block mt-1"
                    >
                      {siteSettings.contactEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-800/50 text-emerald-400 flex-shrink-0">
                    <Phone className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">
                      {t.contact.directLine}
                    </span>
                    <span className="text-slate-200 block mt-1">
                      {siteSettings.contactPhone}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-emerald-900/40 text-xs text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{t.contact.spamProtected}</span>
              </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-7">
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-emerald-800/40">
              
              {status === 'success' ? (
                <div className="py-12 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-900/50 border border-amber-400 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-amber-300" />
                  </div>
                  <h4 className="text-xl font-bold text-white font-serif mb-2">
                    Message Transmitted
                  </h4>
                  <p className="text-slate-300 text-xs sm:text-sm max-w-md mb-6">
                    {t.contact.successMessage}
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="px-6 py-2.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Honeypot field (hidden from real users, filled only by bots) */}
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      name="honeypot"
                      value={formData.honeypot}
                      onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
                        {t.contact.nameLabel} <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#04140e] border border-emerald-800/60 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                        placeholder="e.g. Taimoor Afridi"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
                        {t.contact.emailLabel} <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#04140e] border border-emerald-800/60 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                        placeholder="name@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
                        {t.contact.phoneLabel}
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#04140e] border border-emerald-800/60 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                        placeholder="+92 3XX XXXXXXX"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
                        {t.contact.subjectLabel}
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#04140e] border border-emerald-800/60 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                        placeholder="e.g. Local water supply initiative inquiry"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
                      {t.contact.messageLabel} <span className="text-amber-400">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#04140e] border border-emerald-800/60 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors resize-y"
                      placeholder="Please convey your message, civic proposal, or inquiry clearly..."
                    />
                  </div>

                  {status === 'error' && (
                    <div className="p-3 rounded-lg bg-red-950/50 border border-red-800/50 text-red-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full py-3.5 px-6 rounded-lg bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 text-white font-semibold text-xs uppercase tracking-wider border border-amber-400/40 hover:border-amber-300 hover:shadow-lg hover:shadow-emerald-950 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 text-amber-300" />
                    <span>
                      {status === 'submitting' ? t.contact.sending : t.contact.sendMessage}
                    </span>
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

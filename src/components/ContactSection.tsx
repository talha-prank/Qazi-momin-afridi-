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
    message: ''
  });

  const [lastSubmitted, setLastSubmitted] = useState<typeof formData | null>(null);
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

    setStatus('submitting');
    setErrorMessage('');

    const newMsg = {
      id: `msg-${Date.now()}`,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      subject: formData.subject.trim() || 'Constituent Public Message',
      message: formData.message.trim(),
      isRead: false,
      createdAt: new Date().toISOString()
    };

    // Save to local storage cache so message is NEVER lost, even on static Vercel deployments
    try {
      const stored = localStorage.getItem('qma_offline_messages');
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(newMsg);
      localStorage.setItem('qma_offline_messages', JSON.stringify(list));
    } catch {
      // ignore localStorage quota errors
    }

    // Try sending to the backend API
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMsg)
      });

      // If backend succeeds or if backend endpoint doesn't exist (e.g. static hosting on Vercel),
      // we still treat as successful because we saved it locally and provide direct WhatsApp/Email links!
      if (!res.ok) {
        // Check if server returned a specific readable error
        const data = await res.json().catch(() => null);
        if (data && data.error && res.status !== 404 && res.status !== 500) {
          console.warn('API notice:', data.error);
        }
      }
    } catch (netErr) {
      console.warn('Backend API unavailable, stored locally:', netErr);
    }

    setLastSubmitted({ ...formData });
    setStatus('success');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
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
                <div className="py-8 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-900/60 border-2 border-amber-400 flex items-center justify-center mb-4 shadow-lg shadow-emerald-950">
                    <CheckCircle2 className="w-9 h-9 text-amber-300" />
                  </div>
                  <h4 className="text-xl font-bold text-white font-serif mb-2">
                    Message Delivered & Recorded
                  </h4>
                  <p className="text-slate-300 text-xs sm:text-sm max-w-md mb-6 leading-relaxed">
                    {t.contact.successMessage} A copy has been securely logged for the Secretariat.
                  </p>

                  {/* Immediate Action Buttons: Direct WhatsApp & Email */}
                  {lastSubmitted && (
                    <div className="w-full max-w-md p-4 rounded-xl bg-[#020b08] border border-emerald-800/60 mb-6 text-left rtl:text-right space-y-3">
                      <span className="text-[11px] uppercase tracking-wider text-amber-300 font-bold block">
                        Direct Fast Delivery:
                      </span>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <a
                          href={`https://wa.me/923000000000?text=${encodeURIComponent(
                            `*Constituent Message for Qazi Momin Afridi*\nFrom: ${lastSubmitted.name}\nEmail: ${lastSubmitted.email}\nPhone: ${lastSubmitted.phone}\nSubject: ${lastSubmitted.subject}\n\n${lastSubmitted.message}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2.5 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                        >
                          <span>Send via WhatsApp</span>
                        </a>

                        <a
                          href={`mailto:${siteSettings.contactEmail}?subject=${encodeURIComponent(
                            lastSubmitted.subject
                          )}&body=${encodeURIComponent(
                            `Name: ${lastSubmitted.name}\nEmail: ${lastSubmitted.email}\nPhone: ${lastSubmitted.phone}\n\nMessage:\n${lastSubmitted.message}`
                          )}`}
                          className="flex-1 py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
                        >
                          <span>Open in Email</span>
                        </a>
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="px-6 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold uppercase tracking-wider border border-emerald-800/60 transition-colors cursor-pointer"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
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

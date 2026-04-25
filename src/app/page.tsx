'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/ui/Header';
import BirthDataForm from '@/components/input/BirthDataForm';
import SavedProfilesList from '@/components/profile/SavedProfilesList';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function HomePage() {
  const { locale } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="min-h-screen pb-12">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* PWA Install Banner */}
        {deferredPrompt && (
          <div className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/50 rounded-xl p-4 mb-8 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-4">
              <span className="text-3xl">📱</span>
              <div>
                <h4 className="font-bold text-amber-400">{locale === 'ne' ? 'एप इन्स्टल गर्नुहोस्' : 'Install App'}</h4>
                <p className="text-sm text-white/70">{locale === 'ne' ? 'छिटो पहुँचको लागि होम स्क्रिनमा थप्नुहोस्' : 'Add to home screen for quick access'}</p>
              </div>
            </div>
            <button onClick={handleInstallClick} className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-lg whitespace-nowrap shadow-lg">
              {locale === 'ne' ? 'इन्स्टल' : 'Install'}
            </button>
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-glow" style={{ color: 'var(--gold-500)' }}>
            {locale === 'ne' ? 'जन्मकुण्डली' : 'Janma Kundali'}
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            {locale === 'ne'
              ? 'शास्त्रीय पाराशरी ज्योतिष अनुसार सम्पूर्ण जन्मकुण्डली विश्लेषण'
              : 'Complete birth chart analysis following classical Parashari Jyotish (BPHS)'}
          </p>

          {/* Sacred geometry decorative line */}
          <div className="flex items-center justify-center gap-2 mt-6 mb-8">
            <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, var(--gold-500))' }}></div>
            <span style={{ color: 'var(--saffron-500)' }}>☸</span>
            <div className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, var(--gold-500))' }}></div>
          </div>
        </div>

        {/* Birth Data Form Card */}
        <div className="glass-card glow-gold p-6 md:p-8 max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold mb-6 text-center" style={{ color: 'var(--gold-400)' }}>
            {locale === 'ne' ? '🪷 जन्म विवरण प्रविष्ट गर्नुहोस्' : '🪷 Enter Birth Details'}
          </h3>
          <BirthDataForm />
        </div>

        {/* Saved Profiles Section */}
        <div className="mt-8">
          <SavedProfilesList />
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
          {[
            { icon: '🪐', label: locale === 'ne' ? 'ग्रहस्पष्ट' : 'Graha Spashta' },
            { icon: '📐', label: locale === 'ne' ? 'षोडशवर्ग' : '16 Vargas' },
            { icon: '⏳', label: locale === 'ne' ? 'विंशोत्तरी दशा' : 'Vimshottari Dasha' },
            { icon: '🔮', label: locale === 'ne' ? 'योग विश्लेषण' : 'Yoga Analysis' },
          ].map((item, i) => (
            <div key={i} className="glass-card text-center p-4">
              <span className="text-2xl block mb-2">{item.icon}</span>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

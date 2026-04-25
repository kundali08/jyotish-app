'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useRouter, usePathname } from 'next/navigation';
import { saveProfile, getSavedProfiles } from '@/lib/utils/profileManager';

export default function Header() {
  const { locale, toggleLocale, t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const [savedStatus, setSavedStatus] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNewKundali = () => {
    sessionStorage.removeItem('kundaliResult');
    router.push('/');
    setMenuOpen(false);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleSaveProfile = () => {
    try {
      const resultStr = sessionStorage.getItem('kundaliResult');
      if (!resultStr) return;
      const result = JSON.parse(resultStr);
      
      // Check if already saved (basic check by name and time)
      const existing = getSavedProfiles();
      const isDuplicate = existing.some(p => 
        p.name === result.birthData.name && 
        p.dateAD.year === result.birthData.dateAD.year &&
        p.dateAD.month === result.birthData.dateAD.month &&
        p.dateAD.day === result.birthData.dateAD.day
      );

      if (isDuplicate) {
        setSavedStatus(locale === 'ne' ? 'पहिल्यै सुरक्षित छ' : 'Already Saved');
        setTimeout(() => setSavedStatus(null), 2000);
        setMenuOpen(false);
        return;
      }

      saveProfile(result.birthData);
      setSavedStatus(locale === 'ne' ? 'सुरक्षित भयो!' : 'Saved!');
      setTimeout(() => setSavedStatus(null), 2000);
    } catch (e) {
      console.error(e);
      setSavedStatus('Error');
      setTimeout(() => setSavedStatus(null), 2000);
    }
    setMenuOpen(false);
  };

  const isKundaliPage = pathname === '/kundali';

  return (
    <header className="mobile-header">
      <div className="mobile-header-inner">
        {/* Logo / Title */}
        <div 
          className="header-logo" 
          onClick={() => router.push('/')}
        >
          <span className="header-logo-icon">🔱</span>
          <div>
            <h1 className="header-title">{t('app.title')}</h1>
            <p className="header-subtitle">{t('app.subtitle')}</p>
          </div>
        </div>

        {/* Right side actions */}
        <div className="header-actions">
          {/* Desktop-only action buttons */}
          {isKundaliPage && (
            <div className="header-desktop-actions">
              <button onClick={handleRefresh} className="header-action-btn" title="Reload">
                🔄 {locale === 'ne' ? 'रिफ्रेस' : 'Refresh'}
              </button>
              <button onClick={handleSaveProfile} className="header-action-btn" title="Save Profile" disabled={!!savedStatus}>
                {savedStatus ? (
                  <span style={{ color: '#4ade80' }}>✓ {savedStatus}</span>
                ) : (
                  <>💾 {locale === 'ne' ? 'सुरक्षित' : 'Save'}</>
                )}
              </button>
              <button onClick={handleNewKundali} className="header-action-btn header-action-primary" title="New Kundali">
                + {locale === 'ne' ? 'नयाँ' : 'New'}
              </button>
            </div>
          )}

          {/* Language Toggle */}
          <button
            onClick={toggleLocale}
            className="header-lang-btn"
            title="Switch language / भाषा बदल्नुहोस्"
          >
            <span className={locale === 'en' ? 'opacity-100' : 'opacity-40'}>EN</span>
            <span style={{ color: 'var(--text-secondary)' }}>|</span>
            <span className={locale === 'ne' ? 'opacity-100' : 'opacity-40'}>ने</span>
          </button>

          {/* Mobile overflow menu button */}
          {isKundaliPage && (
            <button
              className="header-overflow-btn lg:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              ⋯
            </button>
          )}
        </div>
      </div>

      {/* Mobile overflow dropdown */}
      {menuOpen && isKundaliPage && (
        <div className="header-overflow-menu lg:hidden">
          <button onClick={handleRefresh} className="overflow-menu-item">
            🔄 {locale === 'ne' ? 'रिफ्रेस गर्नुहोस्' : 'Refresh'}
          </button>
          <button onClick={handleSaveProfile} className="overflow-menu-item" disabled={!!savedStatus}>
            {savedStatus ? (
              <span style={{ color: '#4ade80' }}>✓ {savedStatus}</span>
            ) : (
              <>{locale === 'ne' ? '💾 सुरक्षित गर्नुहोस्' : '💾 Save Profile'}</>
            )}
          </button>
          <button onClick={handleNewKundali} className="overflow-menu-item overflow-menu-primary">
            ✨ {locale === 'ne' ? 'नयाँ कुण्डली बनाउनुहोस्' : 'Create New Kundali'}
          </button>
        </div>
      )}
    </header>
  );
}

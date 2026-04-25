'use client';

import React, { useRef, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const TAB_CONFIG = [
  { key: 'panchanga',     icon: '📅', en: 'Panchanga',     ne: 'पञ्चाङ्ग' },
  { key: 'grahaspashta',  icon: '🪐', en: 'Graha',         ne: 'ग्रह' },
  { key: 'vargaCharts',   icon: '📐', en: 'Varga',         ne: 'वर्ग' },
  { key: 'shadbala',      icon: '💪', en: 'Shadbala',      ne: 'षड्बल' },
  { key: 'bhavabala',     icon: '🏠', en: 'Bhava',         ne: 'भाव' },
  { key: 'ashtakavarga',  icon: '⭐', en: 'Ashtaka',       ne: 'अष्टक' },
  { key: 'dasha',         icon: '⏳', en: 'Dasha',         ne: 'दशा' },
  { key: 'yogas',         icon: '🔮', en: 'Yogas',         ne: 'योग' },
  { key: 'gochara',       icon: '🌙', en: 'Gochara',       ne: 'गोचर' },
  { key: 'kundaliMilan',  icon: '💑', en: 'Milan',         ne: 'मिलान' },
  { key: 'report',        icon: '📄', en: 'Report',        ne: 'रिपोर्ट' },
] as const;

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function MobileBottomNav({ activeTab, onTabChange }: MobileBottomNavProps) {
  const { locale } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll active tab into view
  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const el = activeRef.current;
      const scrollLeft = el.offsetLeft - container.offsetWidth / 2 + el.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [activeTab]);

  return (
    <nav className="mobile-bottom-nav lg:hidden">
      <div className="mobile-bottom-nav-inner" ref={scrollRef}>
        {TAB_CONFIG.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              ref={isActive ? activeRef : null}
              className={`mobile-tab-btn ${isActive ? 'mobile-tab-active' : ''}`}
              onClick={() => onTabChange(tab.key)}
              aria-label={locale === 'ne' ? tab.ne : tab.en}
            >
              <span className="mobile-tab-icon">{tab.icon}</span>
              <span className="mobile-tab-label">
                {locale === 'ne' ? tab.ne : tab.en}
              </span>
              {isActive && <span className="mobile-tab-indicator" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

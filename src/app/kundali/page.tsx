'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/ui/Header';
import MobileBottomNav from '@/components/ui/MobileBottomNav';
import CollapsibleChartCard from '@/components/ui/CollapsibleChartCard';
import GrahaSpashtaTable from '@/components/tables/GrahaSpashtaTable';
import PanchangaDisplay from '@/components/panchanga/PanchangaDisplay';
import DashaDisplay from '@/components/dasha/DashaDisplay';
import ShadbalaTable from '@/components/strength/ShadbalaTable';
import AshtakavargaGrid from '@/components/strength/AshtakavargaGrid';
import YogaDisplay from '@/components/yogas/YogaDisplay';
import BhavabalaTable from '@/components/strength/BhavabalaTable';
import NorthIndianChart from '@/components/charts/NorthIndianChart';
import VargaChartGrid from '@/components/charts/VargaChartGrid';
import KundaliMilan from '@/components/compatibility/KundaliMilan';
import GocharaDisplay from '@/components/transit/GocharaDisplay';
import JanamPatrika from '@/components/report/JanamPatrika';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { KundaliResult } from '@/lib/types/chart';

const TAB_KEYS = [
  'panchanga', 'grahaspashta', 'vargaCharts',
  'shadbala', 'bhavabala', 'ashtakavarga', 'dasha',
  'yogas', 'gochara', 'kundaliMilan', 'report',
] as const;

export default function KundaliDashboard() {
  const { t, locale } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('panchanga');
  const [kundali, setKundali] = useState<KundaliResult | null>(null);
  const [isChartExpanded, setIsChartExpanded] = useState(false);
  const [swipeDir, setSwipeDir] = useState<'left'|'right'|null>(null);
  const router = useRouter();
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  useEffect(() => {
    const stored = sessionStorage.getItem('kundaliResult');
    if (stored) { setKundali(JSON.parse(stored)); }
    else { router.push('/'); }
  }, [router]);

  // Swipe gesture for tab switching — uses native passive listeners to avoid blocking scroll
  const swipeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = swipeRef.current;
    if (!el) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const dy = e.changedTouches[0].clientY - touchStartY.current;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        const idx = TAB_KEYS.indexOf(activeTab as typeof TAB_KEYS[number]);
        if (dx < 0 && idx < TAB_KEYS.length - 1) {
          setSwipeDir('left'); setActiveTab(TAB_KEYS[idx + 1]);
        } else if (dx > 0 && idx > 0) {
          setSwipeDir('right'); setActiveTab(TAB_KEYS[idx - 1]);
        }
      }
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeTab]);

  useEffect(() => {
    if (swipeDir) { const t = setTimeout(() => setSwipeDir(null), 400); return () => clearTimeout(t); }
  }, [swipeDir, activeTab]);

  if (!kundali) {
    return (
      <div className="min-h-screen"><Header />
        <div className="flex flex-col items-center justify-center py-32">
          <div className="sacred-spinner mb-4"></div>
          <p style={{ color: 'var(--text-secondary)' }}>
            {locale === 'ne' ? 'कुण्डली लोड गर्दै...' : 'Loading kundali...'}
          </p>
          <a href="/" className="mt-4 text-sm underline" style={{ color: 'var(--gold-400)' }}>
            {locale === 'ne' ? '← फिर्ता जानुहोस्' : '← Go back'}
          </a>
        </div>
      </div>
    );
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'grahaspashta': return <GrahaSpashtaTable grahas={kundali.grahas} lagna={kundali.lagna} />;
      case 'panchanga': return <PanchangaDisplay panchanga={kundali.panchanga} />;
      case 'dasha': return kundali.dasha ? <DashaDisplay dasha={kundali.dasha} /> : <EmptyState />;
      case 'shadbala': return kundali.shadbala ? <ShadbalaTable shadbala={kundali.shadbala} /> : <EmptyState />;
      case 'bhavabala': return kundali.bhavas?.[0]?.totalBhavabala !== undefined ? <BhavabalaTable bhavas={kundali.bhavas} /> : <EmptyState />;
      case 'ashtakavarga': return kundali.ashtakavarga ? <AshtakavargaGrid ashtakavarga={kundali.ashtakavarga} /> : <EmptyState />;
      case 'yogas': return kundali.yogas ? <YogaDisplay yogas={kundali.yogas} /> : <EmptyState />;
      case 'vargaCharts': return <VargaChartGrid grahas={kundali.grahas} lagna={kundali.lagna} vargaCharts={kundali.vargaCharts} />;
      case 'gochara': return <GocharaDisplay kundaliData={kundali} />;
      case 'kundaliMilan': return <KundaliMilan kundaliData={kundali} />;
      case 'report': return <JanamPatrika kundaliData={kundali} />;
      default: return <EmptyState />;
    }
  };

  const swipeCls = swipeDir === 'left' ? 'animate-slide-in-right' : swipeDir === 'right' ? 'animate-slide-in-left' : 'animate-tab-content';

  return (
    <div className="mobile-app-shell print:min-h-0 print:block">
      <Header />
      <CollapsibleChartCard kundali={kundali} />

      <div className="kundali-main">
        <div className="kundali-container">
          {/* Desktop Left Pane */}
          <DesktopLeftPane kundali={kundali} locale={locale} onExpand={() => setIsChartExpanded(true)} />

          {/* Right Pane */}
          <div className="kundali-right-pane">
            {/* Desktop tabs */}
            <div className="kundali-desktop-tabs">
              <div className="flex px-6 py-5 gap-3">
                {TAB_KEYS.map(key => (
                  <button key={key}
                    className={`whitespace-nowrap px-6 py-3 rounded-xl text-sm md:text-base font-semibold transition-all duration-300
                      ${activeTab === key
                        ? 'bg-gradient-to-r from-[var(--gold-500)]/30 to-[var(--saffron-500)]/30 text-[var(--gold-400)] shadow-[0_0_20px_rgba(255,215,0,0.2)] ring-1 ring-[var(--gold-400)]/60 scale-105'
                        : 'text-[var(--text-secondary)] hover:bg-white/10 hover:text-white hover:scale-105'}`}
                    onClick={() => setActiveTab(key)}>{t(`nav.${key}`)}</button>
                ))}
              </div>
            </div>

            {/* Tab content with swipe */}
            <div className="kundali-tab-content" ref={swipeRef}>
              <div key={activeTab} className={`${swipeCls} print:h-auto`}>{renderTab()}</div>
            </div>
          </div>
        </div>
      </div>

      <MobileBottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Chart Modal */}
      {isChartExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="glass-card p-4 md:p-8 relative flex flex-col items-center shadow-2xl animate-fade-in w-full max-w-3xl mx-4">
            <button className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-red-400 bg-white/5 hover:bg-white/10 rounded-full w-10 h-10 flex items-center justify-center"
              onClick={() => setIsChartExpanded(false)}><span className="text-xl">✕</span></button>
            <h2 className="text-2xl font-bold mb-6 mt-2" style={{ color: 'var(--gold-400)' }}>
              {locale === 'ne' ? 'लग्न कुण्डली (D1)' : 'Lagna Chart (D1)'}
            </h2>
            <div className="w-full flex justify-center">
              <div style={{ width: '100%', maxWidth: '600px', aspectRatio: '1/1' }}>
                <NorthIndianChart grahas={kundali.grahas} lagna={kundali.lagna} size={600} title="" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return <div className="text-center py-16" style={{ color: 'var(--text-secondary)' }}>
    <span className="text-4xl block mb-4">🚧</span>No data available
  </div>;
}

function DesktopLeftPane({ kundali, locale, onExpand }: { kundali: KundaliResult; locale: string; onExpand: () => void }) {
  return (
    <div className="kundali-left-pane">
      <div className="p-8 lg:sticky lg:top-0 h-full lg:h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar flex flex-col justify-center">
        <h2 className="text-3xl font-bold text-[var(--gold-400)] mb-2">
          {kundali.birthData.name || (locale === 'ne' ? 'कुण्डली' : 'Kundali')}
        </h2>
        <div className="text-base text-[var(--text-secondary)] space-y-3 mb-10">
          <p className="flex items-center gap-3"><span className="text-xl">📅</span>
            {kundali.birthData.dateAD.year}-{String(kundali.birthData.dateAD.month).padStart(2,'0')}-{String(kundali.birthData.dateAD.day).padStart(2,'0')}</p>
          <p className="flex items-center gap-3"><span className="text-xl">🕒</span>
            {String(kundali.birthData.time.hour).padStart(2,'0')}:{String(kundali.birthData.time.minute).padStart(2,'0')}</p>
          <p className="flex items-center gap-3"><span className="text-xl">📍</span>{kundali.birthData.place}</p>
          <p className="text-[var(--saffron-400)] text-sm pt-4 border-t border-[var(--border-primary)] mt-4">
            {locale === 'ne' ? 'अयनांश' : 'Ayanamsha'}: {kundali.ayanamsha.toFixed(4)}°</p>
        </div>
        <div className="border border-[var(--border-primary)] rounded-xl p-8 bg-black/30 flex justify-center shadow-inner relative overflow-hidden group cursor-pointer hover:border-[var(--gold-400)] transition-all"
          onClick={onExpand}>
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold-500)]/10 to-transparent pointer-events-none group-hover:from-[var(--gold-500)]/20 transition-all"></div>
          <NorthIndianChart grahas={kundali.grahas} lagna={kundali.lagna} size={360}
            title={locale === 'ne' ? 'लग्न कुण्डली (D1)' : 'Lagna Chart (D1)'} />
        </div>
      </div>
    </div>
  );
}

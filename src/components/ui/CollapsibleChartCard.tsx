'use client';

import React, { useState } from 'react';
import NorthIndianChart from '@/components/charts/NorthIndianChart';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { KundaliResult } from '@/lib/types/chart';

interface Props {
  kundali: KundaliResult;
}

export default function CollapsibleChartCard({ kundali }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { locale } = useLanguage();

  const lagnaRashi = kundali.lagna?.rashi || '';

  return (
    <div className="collapsible-chart-card lg:hidden">
      {/* Collapsed summary bar */}
      <button
        className="chart-summary-bar"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <div className="chart-summary-info">
          <span className="chart-summary-icon">🔱</span>
          <div>
            <span className="chart-summary-name">
              {kundali.birthData.name || (locale === 'ne' ? 'कुण्डली' : 'Kundali')}
            </span>
            <span className="chart-summary-meta">
              {kundali.birthData.dateAD.year}-
              {String(kundali.birthData.dateAD.month).padStart(2, '0')}-
              {String(kundali.birthData.dateAD.day).padStart(2, '0')}
              {lagnaRashi ? ` · ${lagnaRashi}` : ''}
            </span>
          </div>
        </div>
        <span className={`chart-chevron ${isExpanded ? 'chart-chevron-up' : ''}`}>
          ▾
        </span>
      </button>

      {/* Expandable chart area */}
      <div className={`chart-expand-area ${isExpanded ? 'chart-expand-area-open' : ''}`}>
        <div className="chart-expand-content">
          {/* Birth info */}
          <div className="chart-info-grid">
            <div className="chart-info-item">
              <span>📅</span>
              <span>
                {kundali.birthData.dateAD.year}-
                {String(kundali.birthData.dateAD.month).padStart(2, '0')}-
                {String(kundali.birthData.dateAD.day).padStart(2, '0')}
              </span>
            </div>
            <div className="chart-info-item">
              <span>🕒</span>
              <span>
                {String(kundali.birthData.time.hour).padStart(2, '0')}:
                {String(kundali.birthData.time.minute).padStart(2, '0')}
              </span>
            </div>
            <div className="chart-info-item">
              <span>📍</span>
              <span>{kundali.birthData.place}</span>
            </div>
            <div className="chart-info-item">
              <span>🌀</span>
              <span>{locale === 'ne' ? 'अयनांश' : 'Ayanamsha'}: {kundali.ayanamsha.toFixed(2)}°</span>
            </div>
          </div>

          {/* D1 Chart */}
          <div className="chart-d1-mobile">
            <NorthIndianChart
              grahas={kundali.grahas}
              lagna={kundali.lagna}
              size={280}
              title={locale === 'ne' ? 'लग्न कुण्डली (D1)' : 'Lagna Chart (D1)'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

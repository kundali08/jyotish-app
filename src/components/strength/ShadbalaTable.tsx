'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { GRAHAS } from '@/lib/constants/grahas';
import type { GrahaShadbala } from '@/lib/types/graha';

interface Props {
  shadbala: GrahaShadbala[];
}

export default function ShadbalaTable({ shadbala }: Props) {
  const { tObj, locale, formatNumber } = useLanguage();

  const lordDisplay = (id: string) => {
    const g = GRAHAS[id as keyof typeof GRAHAS];
    return g ? `${tObj(g.symbol)} ${tObj(g.name)}` : id;
  };

  const barWidth = (val: number, max: number) => `${Math.min(100, (val / max) * 100)}%`;

  const strengthColor = (ratio: number): string => {
    if (ratio >= 1.5) return '#4ADE80';  // Very strong
    if (ratio >= 1.0) return '#FACC15';  // Adequate
    if (ratio >= 0.7) return '#FB923C';  // Weak
    return '#F87171';                     // Very weak
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
        {shadbala.map(s => {
          const color = strengthColor(s.ratio);
          return (
            <div key={s.grahaId} className="glass-card p-3 text-center">
              <div className="text-sm font-semibold mb-1" style={{ color: 'var(--gold-400)' }}>
                {lordDisplay(s.grahaId)}
              </div>
              <div className="text-xl font-bold" style={{ color }}>
                {formatNumber(s.totalRupa.toFixed(1))}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                {locale === 'ne' ? 'रुपा' : 'Rupa'}
              </div>
              <div className="text-xs mt-1" style={{ color }}>
                {formatNumber((s.ratio * 100).toFixed(0))}%
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                #{formatNumber(s.rank)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Table */}
      <div className="glass-card overflow-x-auto">
        <table className="jyotish-table">
          <thead>
            <tr>
              <th>{locale === 'ne' ? 'ग्रह' : 'Planet'}</th>
              <th>{locale === 'ne' ? 'स्थान बल' : 'Sthana'}</th>
              <th>{locale === 'ne' ? 'दिग्बल' : 'Dig'}</th>
              <th>{locale === 'ne' ? 'कालबल' : 'Kala'}</th>
              <th>{locale === 'ne' ? 'चेष्टा बल' : 'Cheshta'}</th>
              <th>{locale === 'ne' ? 'नैसर्गिक' : 'Naisargika'}</th>
              <th>{locale === 'ne' ? 'दृक् बल' : 'Drik'}</th>
              <th>{locale === 'ne' ? 'कुल (शष्ट्यंश)' : 'Total (Sh.)'}</th>
              <th>{locale === 'ne' ? 'रुपा' : 'Rupa'}</th>
              <th>{locale === 'ne' ? 'आवश्यक' : 'Required'}</th>
              <th>{locale === 'ne' ? 'अनुपात' : 'Ratio'}</th>
            </tr>
          </thead>
          <tbody>
            {shadbala.map(s => {
              const color = strengthColor(s.ratio);
              return (
                <tr key={s.grahaId}>
                  <td className="font-semibold" style={{ color: 'var(--gold-400)' }}>
                    {lordDisplay(s.grahaId)}
                  </td>
                  <td>{formatNumber(s.sthanaBala.toFixed(1))}</td>
                  <td>{formatNumber(s.digBala.toFixed(1))}</td>
                  <td>{formatNumber(s.kalaBala.toFixed(1))}</td>
                  <td>{formatNumber(s.cheshtaBala.toFixed(1))}</td>
                  <td>{formatNumber(s.naisargikaBala.toFixed(1))}</td>
                  <td>{formatNumber(s.drikBala.toFixed(1))}</td>
                  <td className="font-semibold">{formatNumber(s.totalShashtiamsha.toFixed(1))}</td>
                  <td className="font-bold" style={{ color }}>{formatNumber(s.totalRupa.toFixed(2))}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{formatNumber(s.requiredRupa.toFixed(1))}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                        <div className="h-full rounded-full transition-all" style={{ width: barWidth(s.ratio, 2), background: color }}></div>
                      </div>
                      <span className="text-xs font-semibold" style={{ color }}>
                        {formatNumber((s.ratio * 100).toFixed(0))}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

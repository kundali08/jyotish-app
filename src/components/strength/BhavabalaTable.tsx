'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { GRAHAS } from '@/lib/constants/grahas';
import type { BhavaData } from '@/lib/types/chart';

interface Props {
  bhavas: BhavaData[];
}

export default function BhavabalaTable({ bhavas }: Props) {
  const { tObj, locale, formatNumber } = useLanguage();

  const lordDisplay = (id: string) => {
    const g = GRAHAS[id as keyof typeof GRAHAS];
    return g ? `${tObj(g.symbol)} ${tObj(g.name)}` : id;
  };

  // Find max strength for scaling bars
  const maxStrength = Math.max(...bhavas.map(b => b.totalBhavabala || 0), 100);

  const barWidth = (val: number) => `${Math.min(100, Math.max(0, (val / maxStrength) * 100))}%`;

  const strengthColor = (rank: number): string => {
    if (rank <= 3) return '#4ADE80';  // Very strong (Top 3)
    if (rank <= 8) return '#FACC15';  // Adequate (Middle 5)
    return '#FB923C';                 // Weak (Bottom 4)
  };

  return (
    <div className="space-y-6">
      {/* Detailed Table */}
      <div className="glass-card overflow-x-auto">
        <table className="jyotish-table">
          <thead>
            <tr>
              <th>{locale === 'ne' ? 'भाव' : 'Bhava'}</th>
              <th>{locale === 'ne' ? 'भावेश' : 'Lord'}</th>
              <th>{locale === 'ne' ? 'भावाधिपति बल' : 'Bhavadhipati'}</th>
              <th>{locale === 'ne' ? 'दिग्बल' : 'Digbala'}</th>
              <th>{locale === 'ne' ? 'दृष्टि बल' : 'Drishti'}</th>
              <th>{locale === 'ne' ? 'कुल बल' : 'Total Strength'}</th>
              <th>{locale === 'ne' ? 'स्थान' : 'Rank'}</th>
              <th>{locale === 'ne' ? 'बल' : 'Power'}</th>
            </tr>
          </thead>
          <tbody>
            {bhavas.map(b => {
              const total = b.totalBhavabala || 0;
              const rank = b.rank || 12;
              const color = strengthColor(rank);

              return (
                <tr key={b.number}>
                  <td className="font-bold text-lg" style={{ color: 'var(--gold-400)' }}>
                    {formatNumber(b.number)}
                  </td>
                  <td className="font-semibold text-md">
                    {lordDisplay(b.lord)}
                  </td>
                  <td>{formatNumber((b.bhavadhipatiBala || 0).toFixed(1))}</td>
                  <td>{formatNumber((b.bhavaDigbala || 0).toFixed(1))}</td>
                  <td>{formatNumber((b.bhavaDrishtiBala || 0).toFixed(1))}</td>
                  <td className="font-bold text-lg" style={{ color }}>
                    {formatNumber(total.toFixed(1))}
                  </td>
                  <td>
                    <span className="px-2 py-1 rounded text-xs font-bold" style={{ backgroundColor: `${color}20`, color }}>
                      #{formatNumber(rank)}
                    </span>
                  </td>
                  <td className="w-48">
                    <div className="flex items-center gap-2">
                      <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                        <div className="h-full rounded-full transition-all" style={{ width: barWidth(total), background: color }}></div>
                      </div>
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

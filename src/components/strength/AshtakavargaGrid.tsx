'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { GRAHAS } from '@/lib/constants/grahas';
import { RASHIS } from '@/lib/constants/rashis';
import type { AshtakavargaData } from '@/lib/types/chart';

interface Props {
  ashtakavarga: AshtakavargaData;
}

export default function AshtakavargaGrid({ ashtakavarga }: Props) {
  const { tObj, locale, formatNumber } = useLanguage();

  const planets = ['SU', 'MO', 'MA', 'ME', 'JU', 'VE', 'SA', 'LA'] as const;
  const planetLabels: Record<string, string> = {
    SU: locale === 'ne' ? 'सू' : 'Su',
    MO: locale === 'ne' ? 'च' : 'Mo',
    MA: locale === 'ne' ? 'मं' : 'Ma',
    ME: locale === 'ne' ? 'बु' : 'Me',
    JU: locale === 'ne' ? 'गु' : 'Ju',
    VE: locale === 'ne' ? 'शु' : 'Ve',
    SA: locale === 'ne' ? 'श' : 'Sa',
    LA: locale === 'ne' ? 'ल' : 'Lg',
  };

  const cellColor = (val: number, isSAV: boolean = false): string => {
    if (isSAV) {
      if (val >= 30) return 'rgba(74, 222, 128, 0.2)';
      if (val >= 25) return 'rgba(250, 204, 21, 0.1)';
      return 'rgba(248, 113, 113, 0.1)';
    }
    if (val >= 5) return 'rgba(74, 222, 128, 0.15)';
    if (val >= 4) return 'rgba(250, 204, 21, 0.08)';
    if (val <= 2) return 'rgba(248, 113, 113, 0.1)';
    return 'transparent';
  };

  const valColor = (val: number, isSAV: boolean = false): string => {
    if (isSAV) {
      if (val >= 30) return '#4ADE80';
      if (val >= 25) return '#FACC15';
      return '#F87171';
    }
    if (val >= 5) return '#4ADE80';
    if (val >= 4) return '#FACC15';
    if (val <= 2) return '#F87171';
    return 'var(--text-primary)';
  };

  const savTotal = ashtakavarga.sarva.reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* SAV Summary */}
      <div className="glass-card p-5">
        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--gold-400)' }}>
          {locale === 'ne' ? '📊 सर्वाष्टकवर्ग (SAV)' : '📊 Sarvashtakavarga (SAV)'}
        </h3>
        <div className="flex items-center gap-2 mb-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
          {locale === 'ne' ? 'कुल बिन्दु' : 'Total Bindus'}: {' '}
          <span className="font-bold text-lg" style={{ color: 'var(--gold-500)' }}>{formatNumber(savTotal)}</span>
        </div>
        <div className="grid grid-cols-12 gap-1">
          {ashtakavarga.sarva.map((val, i) => (
            <div key={i} className="text-center p-2 rounded-lg" style={{ background: cellColor(val, true) }}>
              <div className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                {tObj(RASHIS[i].name).slice(0, 3)}
              </div>
              <div className="text-lg font-bold" style={{ color: valColor(val, true) }}>
                {formatNumber(val)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BAV Grid */}
      <div className="glass-card overflow-x-auto">
        <h3 className="text-lg font-semibold p-5 pb-3" style={{ color: 'var(--gold-400)' }}>
          {locale === 'ne' ? '🔢 भिन्नाष्टकवर्ग (BAV)' : '🔢 Bhinnashtakavarga (BAV)'}
        </h3>
        <table className="jyotish-table">
          <thead>
            <tr>
              <th>{locale === 'ne' ? 'ग्रह' : 'Planet'}</th>
              {RASHIS.map((r, i) => (
                <th key={i} className="text-center text-xs">
                  {r.symbol}<br/>
                  <span style={{ color: 'var(--text-secondary)' }}>{tObj(r.name).slice(0, 3)}</span>
                </th>
              ))}
              <th>{locale === 'ne' ? 'कुल' : 'Total'}</th>
            </tr>
          </thead>
          <tbody>
            {planets.map(pid => {
              const bindus = ashtakavarga.bhinna[pid] || new Array(12).fill(0);
              const total = bindus.reduce((a: number, b: number) => a + b, 0);
              return (
                <tr key={pid}>
                  <td className="font-semibold" style={{ color: 'var(--gold-400)' }}>
                    {planetLabels[pid]}
                  </td>
                  {bindus.map((val: number, i: number) => (
                    <td key={i} className="text-center font-mono" style={{ background: cellColor(val), color: valColor(val) }}>
                      {formatNumber(val)}
                    </td>
                  ))}
                  <td className="font-bold text-center">{formatNumber(total)}</td>
                </tr>
              );
            })}
            {/* SAV Row */}
            <tr style={{ borderTop: '2px solid var(--border-accent)' }}>
              <td className="font-bold" style={{ color: 'var(--saffron-400)' }}>SAV</td>
              {ashtakavarga.sarva.map((val, i) => (
                <td key={i} className="text-center font-bold font-mono" style={{ background: cellColor(val, true), color: valColor(val, true) }}>
                  {formatNumber(val)}
                </td>
              ))}
              <td className="font-bold text-center" style={{ color: 'var(--gold-500)' }}>{formatNumber(savTotal)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

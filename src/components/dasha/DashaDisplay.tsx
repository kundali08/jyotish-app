'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { GRAHAS } from '@/lib/constants/grahas';
import type { DashaData, DashaPeriod, DashaSystem } from '@/lib/types/dasha';

interface Props {
  dasha: DashaData;
}

export default function DashaDisplay({ dasha }: Props) {
  const { tObj, locale, formatNumber } = useLanguage();
  const [activeSystem, setActiveSystem] = useState<'vimshottari' | 'tribhagi' | 'yogini'>('vimshottari');
  const [expandedMaha, setExpandedMaha] = useState<number | null>(null);
  const [expandedAntar, setExpandedAntar] = useState<string | null>(null);

  const currentSystem = activeSystem === 'vimshottari' ? dasha.vimshottari : activeSystem === 'tribhagi' ? dasha.tribhagi : dasha.yogini;

  const lordDisplay = (id: string, customName?: { en: string; ne: string }) => {
    if (customName) return locale === 'ne' ? customName.ne : customName.en;
    const g = GRAHAS[id as keyof typeof GRAHAS];
    return g ? `${tObj(g.symbol)} ${tObj(g.name)}` : id;
  };

  const isCurrentPeriod = (period: DashaPeriod): boolean => {
    const today = new Date().toISOString().split('T')[0];
    return today >= period.startDate && today < period.endDate;
  };

  const formatDuration = (years: number): string => {
    const y = Math.floor(years);
    const m = Math.round((years - y) * 12);
    if (y === 0) return `${formatNumber(m)} ${locale === 'ne' ? 'महिना' : 'months'}`;
    if (m === 0) return `${formatNumber(y)} ${locale === 'ne' ? 'वर्ष' : 'years'}`;
    return `${formatNumber(y)}${locale === 'ne' ? 'वर्ष' : 'y'} ${formatNumber(m)}${locale === 'ne' ? 'म' : 'm'}`;
  };

  return (
    <div className="space-y-6">
      {/* System Toggle */}
      <div className="flex gap-3">
        {(['vimshottari', 'tribhagi', 'yogini'] as const).map(sys => (
          <button key={sys}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeSystem === sys
              ? 'border border-amber-500 text-amber-100'
              : 'bg-gray-800/50 text-gray-400 border border-gray-700'}`}
            style={activeSystem === sys ? { background: 'linear-gradient(135deg, var(--saffron-600), var(--maroon-600))' } : {}}
            onClick={() => { setActiveSystem(sys); setExpandedMaha(null); }}>
            {sys === 'vimshottari'
              ? (locale === 'ne' ? 'विंशोत्तरी दशा' : 'Vimshottari Dasha')
              : sys === 'tribhagi'
                ? (locale === 'ne' ? 'त्रिभागी दशा' : 'Tribhagi Dasha')
                : (locale === 'ne' ? 'योगिनी दशा' : 'Yogini Dasha')}
          </button>
        ))}
      </div>

      {/* Current Dasha Highlight */}
      {dasha.currentMaha && (
        <div className="glass-card glow-saffron p-5">
          <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--saffron-400)' }}>
            {locale === 'ne' ? '🔥 वर्तमान दशा' : '🔥 Current Dasha'}
          </h4>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="px-3 py-1 rounded-full" style={{ background: 'rgba(255, 140, 26, 0.15)', color: 'var(--saffron-400)' }}>
              {locale === 'ne' ? 'महा' : 'Maha'}: {lordDisplay(dasha.currentMaha.lord, dasha.currentMaha.lordName)}
            </span>
            {dasha.currentAntar && (
              <span className="px-3 py-1 rounded-full" style={{ background: 'rgba(255, 215, 0, 0.1)', color: 'var(--gold-400)' }}>
                {locale === 'ne' ? 'अन्तर' : 'Antar'}: {lordDisplay(dasha.currentAntar.lord, dasha.currentAntar.lordName)}
              </span>
            )}
            {dasha.currentPratyanta && (
              <span className="px-3 py-1 rounded-full" style={{ background: 'rgba(160, 33, 61, 0.15)', color: 'var(--maroon-300)' }}>
                {locale === 'ne' ? 'प्रत्यन्तर' : 'Pratyanta'}: {lordDisplay(dasha.currentPratyanta.lord, dasha.currentPratyanta.lordName)}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Balance Info */}
      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        {locale === 'ne' ? 'जन्मकालीन शेष' : 'Balance at birth'}: {' '}
        <span style={{ color: 'var(--gold-400)' }}>
          {lordDisplay(currentSystem.startingLord)} — {formatDuration(currentSystem.balanceAtBirth)}
        </span>
      </div>

      {/* Maha Dasha Table */}
      <div className="glass-card overflow-x-auto">
        <table className="jyotish-table w-full">
          <thead>
            <tr>
              <th>{locale === 'ne' ? 'महादशा' : 'Maha Dasha'}</th>
              <th>{locale === 'ne' ? 'सुरु' : 'Start'}</th>
              <th>{locale === 'ne' ? 'अन्त' : 'End'}</th>
              <th>{locale === 'ne' ? 'अवधि' : 'Duration'}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentSystem.periods.map((maha, idx) => {
              const isCurrent = isCurrentPeriod(maha);
              const isExpanded = expandedMaha === idx;

              return (
                <React.Fragment key={idx}>
                  <tr
                    className="cursor-pointer"
                    style={isCurrent ? { background: 'rgba(255, 140, 26, 0.08)' } : {}}
                    onClick={() => setExpandedMaha(isExpanded ? null : idx)}>
                    <td className="font-semibold" style={{ color: isCurrent ? 'var(--saffron-400)' : 'var(--gold-400)' }}>
                      {isCurrent && <span className="mr-1">●</span>}
                      {lordDisplay(maha.lord, maha.lordName)}
                    </td>
                    <td>{formatNumber(maha.startDate)}</td>
                    <td>{formatNumber(maha.endDate)}</td>
                    <td>{formatDuration(maha.durationYears)}</td>
                    <td className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {maha.subPeriods.length > 0 ? (isExpanded ? '▲' : '▼') : ''}
                    </td>
                  </tr>

                  {/* Sub-periods (Antar Dasha) */}
                  {isExpanded && maha.subPeriods.map((antar, aIdx) => {
                    const antarCurrent = isCurrentPeriod(antar);
                    const antarKey = `${idx}-${aIdx}`;
                    const antarExpanded = expandedAntar === antarKey;

                    return (
                      <React.Fragment key={antarKey}>
                        <tr
                          className="cursor-pointer"
                          style={{
                            background: antarCurrent ? 'rgba(255, 215, 0, 0.06)' : 'rgba(0,0,0,0.15)',
                          }}
                          onClick={(e) => { e.stopPropagation(); setExpandedAntar(antarExpanded ? null : antarKey); }}>
                          <td className="pl-12 md:pl-16 text-sm" style={{ color: antarCurrent ? 'var(--gold-400)' : 'var(--text-secondary)' }}>
                            {antarCurrent && <span className="mr-1">●</span>}
                            ↳ {lordDisplay(antar.lord, antar.lordName)}
                          </td>
                          <td className="text-xs">{formatNumber(antar.startDate)}</td>
                          <td className="text-xs">{formatNumber(antar.endDate)}</td>
                          <td className="text-xs">{formatDuration(antar.durationYears)}</td>
                          <td className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            {antar.subPeriods.length > 0 ? (antarExpanded ? '▲' : '▼') : ''}
                          </td>
                        </tr>

                        {/* Pratyanta Dasha */}
                        {antarExpanded && antar.subPeriods.map((praty, pIdx) => {
                          const pratyCurrent = isCurrentPeriod(praty);
                          return (
                            <tr key={`${antarKey}-${pIdx}`}
                              style={{ background: pratyCurrent ? 'rgba(160, 33, 61, 0.08)' : 'rgba(0,0,0,0.25)' }}>
                              <td className="pl-20 md:pl-28 text-xs" style={{ color: pratyCurrent ? 'var(--maroon-300)' : 'var(--cosmic-300)' }}>
                                {pratyCurrent && <span className="mr-1">●</span>}
                                ↳ {lordDisplay(praty.lord, praty.lordName)}
                              </td>
                              <td className="text-xs" style={{ color: 'var(--cosmic-300)' }}>{formatNumber(praty.startDate)}</td>
                              <td className="text-xs" style={{ color: 'var(--cosmic-300)' }}>{formatNumber(praty.endDate)}</td>
                              <td className="text-xs" style={{ color: 'var(--cosmic-300)' }}>{formatDuration(praty.durationYears)}</td>
                              <td></td>
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

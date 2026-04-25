'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { GRAHAS } from '@/lib/constants/grahas';
import { RASHIS } from '@/lib/constants/rashis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import type { GrahaPosition } from '@/lib/types/graha';
import type { LagnaData } from '@/lib/types/chart';

interface Props {
  grahas: GrahaPosition[];
  lagna: LagnaData;
}

export default function GrahaSpashtaTable({ grahas, lagna }: Props) {
  const { tObj, t, locale, formatNumber } = useLanguage();

  const dignityLabel = (d: string): string => {
    const map: Record<string, { en: string; ne: string }> = {
      exalted: { en: 'Exalted', ne: 'उच्च' },
      debilitated: { en: 'Debilitated', ne: 'नीच' },
      own: { en: 'Own Sign', ne: 'स्वगृह' },
      moolatrikona: { en: 'Moolatrikona', ne: 'मूलत्रिकोण' },
      friend: { en: 'Friend', ne: 'मित्र' },
      neutral: { en: 'Neutral', ne: 'सम' },
      enemy: { en: 'Enemy', ne: 'शत्रु' },
    };
    return map[d]?.[locale] || d;
  };

  const dignityClass = (d: string): string => `dignity-${d}`;

  const formatDMS = (lon: number): string => {
    const d = Math.floor(lon);
    const m = Math.floor((lon - d) * 60);
    const s = Math.round(((lon - d) * 60 - m) * 60);
    return `${formatNumber(d)}°${formatNumber(m)}'${formatNumber(s)}"`;
  };

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--gold-400)' }}>
        {locale === 'ne' ? '🪐 ग्रहस्पष्ट — ग्रह स्थिति तालिका' : '🪐 Graha Spashta — Planet Position Table'}
      </h3>

      {/* Lagna Info */}
      <div className="mb-4 p-3 rounded-lg" style={{ background: 'rgba(255, 215, 0, 0.05)', border: '1px solid var(--border-primary)' }}>
        <span className="text-sm font-semibold" style={{ color: 'var(--gold-500)' }}>{t('common.lagna')}: </span>
        <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
          {tObj(RASHIS[lagna.rashi - 1].name)} {formatDMS(lagna.degreeInSign)} | {tObj(NAKSHATRAS[lagna.nakshatra - 1].name)} {t('common.pada')}-{formatNumber(lagna.pada)}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="jyotish-table">
          <thead>
            <tr>
              <th>{locale === 'ne' ? 'ग्रह' : 'Planet'}</th>
              <th>{t('common.rashi')}</th>
              <th>{t('common.degree')}</th>
              <th>{t('common.nakshatra')}</th>
              <th>{t('common.pada')}</th>
              <th>{t('common.lord')}</th>
              <th>{t('common.speed')}</th>
              <th>{t('common.dignity')}</th>
              <th>{locale === 'ne' ? 'विशेष' : 'Status'}</th>
            </tr>
          </thead>
          <tbody>
            {grahas.map(g => {
              const grahaDef = GRAHAS[g.id];
              const rashiDef = RASHIS[g.rashi - 1];
              const nakDef = NAKSHATRAS[g.nakshatra - 1];
              const nLord = GRAHAS[g.nakshatraLord];

              return (
                <tr key={g.id}>
                  <td className="font-semibold" style={{ color: 'var(--gold-400)' }}>
                    {tObj(grahaDef.symbol)} {tObj(grahaDef.name)}
                  </td>
                  <td>
                    <span className="font-mono mr-1" style={{ color: 'var(--saffron-400)' }}>{formatNumber(g.rashi)}.</span>
                    {tObj(rashiDef.name)}
                  </td>
                  <td style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {formatDMS(g.degreeInSign)}
                  </td>
                  <td>{tObj(nakDef.name)}</td>
                  <td className="text-center">{formatNumber(g.pada)}</td>
                  <td>{tObj(nLord.symbol)} {tObj(nLord.name)}</td>
                  <td style={{ fontVariantNumeric: 'tabular-nums', color: g.isRetrograde ? '#F87171' : 'var(--text-secondary)' }}>
                    {formatNumber(g.speed.toFixed(4))}
                    {g.isRetrograde && <span className="ml-1 text-xs">({t('common.retrograde')})</span>}
                  </td>
                  <td className={dignityClass(g.dignity)}>
                    {dignityLabel(g.dignity)}
                  </td>
                  <td className="text-xs space-x-1">
                    {g.isCombust && <span className="px-1.5 py-0.5 rounded" style={{ background: 'rgba(248,113,113,0.15)', color: '#F87171' }}>{t('common.combust')}</span>}
                    {g.isVargottama && <span className="px-1.5 py-0.5 rounded" style={{ background: 'rgba(74,222,128,0.15)', color: '#4ADE80' }}>{t('common.vargottama')}</span>}
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

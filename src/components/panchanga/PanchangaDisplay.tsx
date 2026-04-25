'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { GRAHAS } from '@/lib/constants/grahas';
import { RASHIS } from '@/lib/constants/rashis';
import type { PanchangaData } from '@/lib/types/panchanga';

interface Props {
  panchanga: PanchangaData;
}

export default function PanchangaDisplay({ panchanga }: Props) {
  const { t, tObj, locale, formatNumber } = useLanguage();

  const InfoRow = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
    <div className="flex justify-between items-start py-3 px-4 sm:px-6 border-b transition-colors hover:bg-white/5 rounded-md w-full" style={{ borderColor: 'var(--border-primary)' }}>
      <span className="text-sm font-medium w-1/3 break-words pr-2" style={{ color: 'var(--gold-400)' }}>{label}</span>
      <div className="text-right w-2/3 min-w-0 break-words pl-2">
        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{formatNumber(value)}</span>
        {sub && <span className="block text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{formatNumber(sub)}</span>}
      </div>
    </div>
  );

  const lordName = (id: string) => {
    const g = GRAHAS[id as keyof typeof GRAHAS];
    return g ? tObj(g.name) : id;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Five Limbs */}
      <div className="glass-card p-8">
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--gold-400)' }}>
          {locale === 'ne' ? '📿 पञ्चाङ्ग — पाँच अङ्ग' : '📿 Panchanga — Five Limbs'}
        </h3>
        <InfoRow
          label={`1. ${t('panchanga.tithi')}`}
          value={tObj(panchanga.tithi.name)}
          sub={`${tObj(panchanga.tithi.pakshaName)} | ${locale === 'ne' ? 'स्वामी' : 'Lord'}: ${lordName(panchanga.tithi.lord)}`}
        />
        <InfoRow
          label={`2. ${t('panchanga.vara')}`}
          value={tObj(panchanga.vara.name)}
          sub={`${t('common.lord')}: ${lordName(panchanga.vara.lord)} | Hora: ${lordName(panchanga.vara.horaLord)}`}
        />
        <InfoRow
          label={`3. ${t('panchanga.nakshatra')}`}
          value={`${tObj(panchanga.nakshatra.name)} (${t('common.pada')}-${formatNumber(panchanga.nakshatra.pada)})`}
          sub={`${t('common.lord')}: ${lordName(panchanga.nakshatra.lord)} | ${tObj(panchanga.nakshatra.deity)}`}
        />
        <InfoRow
          label={`4. ${t('panchanga.yoga')}`}
          value={tObj(panchanga.yoga.name)}
          sub={tObj(panchanga.yoga.qualityName)}
        />
        <InfoRow
          label={`5. ${t('panchanga.karana')}`}
          value={tObj(panchanga.karana.name)}
          sub={panchanga.karana.type === 'sthira' ? (locale === 'ne' ? 'स्थिर' : 'Fixed') : (locale === 'ne' ? 'चर' : 'Movable')}
        />
      </div>

      {/* Kala (Time) Data */}
      <div className="space-y-6">
        <div className="glass-card p-8">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--gold-400)' }}>
            {locale === 'ne' ? '🌅 सूर्योदय / सूर्यास्त' : '🌅 Sunrise / Sunset'}
          </h3>
          <InfoRow label={t('panchanga.sunrise')} value={panchanga.riseSets.sunrise} />
          <InfoRow label={t('panchanga.sunset')} value={panchanga.riseSets.sunset} />
        </div>

        <div className="glass-card p-8">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--gold-400)' }}>
            {locale === 'ne' ? '⏱️ काल गणना' : '⏱️ Kala (Time) Computation'}
          </h3>
          <InfoRow
            label={locale === 'ne' ? 'इष्टकाल' : 'Ishta Kala'}
            value={panchanga.kala.ishtaKala.display}
            sub={locale === 'ne' ? 'सूर्योदयदेखि जन्मसम्म' : 'Sunrise to birth time'}
          />
          <InfoRow
            label={locale === 'ne' ? 'दिनमान' : 'Dinamana'}
            value={panchanga.kala.dinamana.display}
            sub={`${panchanga.kala.dinamana.hours.toFixed(2)} ${locale === 'ne' ? 'घण्टा' : 'hours'}`}
          />
          <InfoRow
            label={locale === 'ne' ? 'रात्रिमान' : 'Ratrimana'}
            value={panchanga.kala.ratrimana.display}
            sub={`${panchanga.kala.ratrimana.hours.toFixed(2)} ${locale === 'ne' ? 'घण्टा' : 'hours'}`}
          />
        </div>

        <div className="glass-card p-8">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--gold-400)' }}>
            {locale === 'ne' ? '⭐ नक्षत्र काल' : '⭐ Nakshatra Timing'}
          </h3>
          <InfoRow
            label={locale === 'ne' ? 'भभोग' : 'Bha Bhoga'}
            value={panchanga.kala.bhaBhoga.display}
            sub={locale === 'ne' ? 'नक्षत्रको कुल अवधि' : 'Total nakshatra transit'}
          />
          <InfoRow
            label={locale === 'ne' ? 'भायात (भुक्त)' : 'Bhayat (Elapsed)'}
            value={panchanga.kala.bhayat.display}
            sub={locale === 'ne' ? 'बितेको भाग' : 'Elapsed portion'}
          />
          <InfoRow
            label={locale === 'ne' ? 'भोग्य (शेष)' : 'Bhogya (Remaining)'}
            value={panchanga.kala.bhogya.display}
            sub={locale === 'ne' ? 'बाँकी भाग' : 'Remaining portion'}
          />
          <InfoRow
            label={locale === 'ne' ? 'नक्षत्र उदय' : 'Nakshatra Udaya'}
            value={panchanga.kala.nakshatraUdaya}
            sub={locale === 'ne' ? 'नक्षत्र सुरु भएको समय' : 'Nakshatra start time'}
          />
          <InfoRow
            label={locale === 'ne' ? 'सूर्योदय लग्न' : 'Suryodaya Lagna'}
            value={`${tObj(RASHIS[panchanga.kala.suryodayaLagna.rashi - 1].name)} ${panchanga.kala.suryodayaLagna.degree.toFixed(1)}°`}
            sub={locale === 'ne' ? 'सूर्योदयमा लग्न' : 'Ascendant at sunrise'}
          />
        </div>
      </div>

      {/* Muhurta & Nakshatra Attributes */}
      <div className="space-y-6">
        <div className="glass-card p-8">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--gold-400)' }}>
            {locale === 'ne' ? '⏰ मुहूर्त' : '⏰ Muhurta'}
          </h3>
          <InfoRow
            label={locale === 'ne' ? 'राहुकाल' : 'Rahukala'}
            value={`${panchanga.muhurta.rahukala.start} – ${panchanga.muhurta.rahukala.end}`}
          />
          <InfoRow
            label={locale === 'ne' ? 'यमघण्ट' : 'Yamaghanta'}
            value={`${panchanga.muhurta.yamaghanta.start} – ${panchanga.muhurta.yamaghanta.end}`}
          />
          <InfoRow
            label={locale === 'ne' ? 'गुलिक काल' : 'Gulika Kala'}
            value={`${panchanga.muhurta.gulikaKala.start} – ${panchanga.muhurta.gulikaKala.end}`}
          />
          <InfoRow
            label={locale === 'ne' ? 'अभिजित मुहूर्त' : 'Abhijit Muhurta'}
            value={`${panchanga.muhurta.abhijitMuhurta.start} – ${panchanga.muhurta.abhijitMuhurta.end}`}
          />
        </div>

        <div className="glass-card p-8">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--gold-400)' }}>
            {locale === 'ne' ? '🔮 ज्योतिषीय विवरण' : '🔮 Astrological Details'}
          </h3>
          <InfoRow 
            label={locale === 'ne' ? 'नामाक्षर (पहिलो अक्षर)' : 'Namaksher (First Letter)'} 
            value={tObj(panchanga.nakshatra.namaksher) || '-'} 
          />
          <InfoRow label={locale === 'ne' ? 'गण (आसन)' : 'Gana (Aasan)'} value={tObj(panchanga.nakshatra.ganaName)} />
          <InfoRow label={locale === 'ne' ? 'नाडी' : 'Nadi'} value={tObj(panchanga.nakshatra.nadiName)} />
          <InfoRow label={locale === 'ne' ? 'वर्ण (जात)' : 'Varna (Jaat)'} value={tObj(panchanga.nakshatra.varnaName)} />
          <InfoRow label={locale === 'ne' ? 'योनी' : 'Yoni'} value={tObj(panchanga.nakshatra.yoni)} />
          <InfoRow label={locale === 'ne' ? 'तत्व' : 'Tatva'} value={tObj(panchanga.nakshatra.tatvaName)} />
        </div>
      </div>
    </div>
  );
}

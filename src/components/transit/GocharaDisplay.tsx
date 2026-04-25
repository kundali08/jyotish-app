'use client';

/**
 * GocharaDisplay — Transit Analysis Component
 */

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface TransitPlanet {
  id: string;
  longitude: number;
  rashi: number;
  degreeInSign: number;
  nakshatra: number;
  pada: number;
  isRetrograde: boolean;
  houseFromMoon: number;
  transitQuality: 'benefic' | 'malefic' | 'neutral';
  vedha: boolean;
  description: { en: string; ne: string };
}

interface GocharaResult {
  date: string;
  transitPlanets: TransitPlanet[];
  overallScore: number;
  summary: { en: string; ne: string };
}

const PLANET_SYMBOLS: Record<string, { en: string; ne: string }> = {
  SU: { en: 'Sun', ne: 'सूर्य' },
  MO: { en: 'Moon', ne: 'चन्द्र' },
  MA: { en: 'Mars', ne: 'मङ्गल' },
  ME: { en: 'Mercury', ne: 'बुध' },
  JU: { en: 'Jupiter', ne: 'गुरु' },
  VE: { en: 'Venus', ne: 'शुक्र' },
  SA: { en: 'Saturn', ne: 'शनि' },
  RA: { en: 'Rahu', ne: 'राहु' },
  KE: { en: 'Ketu', ne: 'केतु' },
};

const RASHI_NAMES: Record<number, { en: string; ne: string }> = {
  1: { en: 'Aries', ne: 'मेष' },
  2: { en: 'Taurus', ne: 'वृष' },
  3: { en: 'Gemini', ne: 'मिथुन' },
  4: { en: 'Cancer', ne: 'कर्कट' },
  5: { en: 'Leo', ne: 'सिंह' },
  6: { en: 'Virgo', ne: 'कन्या' },
  7: { en: 'Libra', ne: 'तुला' },
  8: { en: 'Scorpio', ne: 'वृश्चिक' },
  9: { en: 'Sagittarius', ne: 'धनु' },
  10: { en: 'Capricorn', ne: 'मकर' },
  11: { en: 'Aquarius', ne: 'कुम्भ' },
  12: { en: 'Pisces', ne: 'मीन' },
};

interface Props {
  kundaliData: any;
}

export default function GocharaDisplay({ kundaliData }: Props) {
  const { locale } = useLanguage();
  const [result, setResult] = useState<GocharaResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const moon = kundaliData?.grahas?.find((g: any) => g.id === 'MO');

  useEffect(() => {
    if (moon) {
      fetchTransit();
    }
  }, [moon?.longitude]);

  const fetchTransit = async () => {
    if (!moon) return;
    setLoading(true);
    try {
      const res = await fetch('/api/transit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          natalMoonLongitude: moon.longitude,
          timezone: 5.75,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e: any) {
      setError(e.message || 'Transit calculation failed');
    } finally {
      setLoading(false);
    }
  };

  const getQualityIcon = (q: string) => {
    if (q === 'benefic') return '✦';
    if (q === 'malefic') return '✧';
    return '○';
  };

  const getQualityColor = (q: string) => {
    if (q === 'benefic') return 'text-emerald-400 bg-emerald-500/10';
    if (q === 'malefic') return 'text-red-400 bg-red-500/10';
    return 'text-amber-400 bg-amber-500/10';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-400 text-center py-8">{error}</div>;
  }

  if (!result) {
    return <div className="text-white/40 text-center py-8">
      {locale === 'ne' ? 'गोचर डाटा उपलब्ध छैन' : 'No transit data available'}
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with overall score */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-amber-300">
              {locale === 'ne' ? 'गोचर फल' : 'Transit Results'}
            </h3>
            <p className="text-white/50 text-sm mt-1">{result.date}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-amber-400">{result.overallScore}%</div>
            <div className="text-sm text-white/50">
              {locale === 'ne' ? result.summary.ne : result.summary.en}
            </div>
          </div>
        </div>

        {/* Score bar */}
        <div className="mt-4 w-full bg-white/10 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${
              result.overallScore >= 70 ? 'bg-emerald-500' :
              result.overallScore >= 40 ? 'bg-amber-500' : 'bg-red-500'
            }`}
            style={{ width: `${result.overallScore}%` }}
          />
        </div>
      </div>

      {/* Transit Planet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {result.transitPlanets.map(tp => (
          <div
            key={tp.id}
            className={`rounded-xl p-4 border transition-all hover:scale-[1.02] ${getQualityColor(tp.transitQuality)} border-white/10`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-white text-base">
                {locale === 'ne' ? PLANET_SYMBOLS[tp.id]?.ne : PLANET_SYMBOLS[tp.id]?.en}
                {tp.isRetrograde && <span className="text-red-400 text-xs ml-1">(R)</span>}
              </span>
              <span className="text-lg">{getQualityIcon(tp.transitQuality)}</span>
            </div>
            <div className="text-sm text-white/70 space-y-1">
              <div className="flex justify-between">
                <span>{locale === 'ne' ? 'राशि' : 'Rashi'}:</span>
                <span className="text-white">
                  {locale === 'ne' ? RASHI_NAMES[tp.rashi]?.ne : RASHI_NAMES[tp.rashi]?.en}
                  {' '}{tp.degreeInSign.toFixed(1)}°
                </span>
              </div>
              <div className="flex justify-between">
                <span>{locale === 'ne' ? 'भाव' : 'House'}:</span>
                <span className="text-white font-medium">{tp.houseFromMoon}</span>
              </div>
              <div className="flex justify-between">
                <span>{locale === 'ne' ? 'फल' : 'Effect'}:</span>
                <span className={
                  tp.transitQuality === 'benefic' ? 'text-emerald-300' :
                  tp.transitQuality === 'malefic' ? 'text-red-300' : 'text-amber-300'
                }>
                  {tp.transitQuality === 'benefic' ? (locale === 'ne' ? 'शुभ' : 'Benefic') :
                   tp.transitQuality === 'malefic' ? (locale === 'ne' ? 'अशुभ' : 'Malefic') :
                   (locale === 'ne' ? 'मिश्र' : 'Neutral')}
                  {tp.vedha && ` (${locale === 'ne' ? 'वेध' : 'Vedha'})`}
                </span>
              </div>
              <div className="text-xs text-white/40 mt-1 italic">
                {locale === 'ne' ? tp.description.ne : tp.description.en}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

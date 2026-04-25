'use client';

/**
 * KundaliMilan — 36-point Ashtakoota Compatibility Display
 */

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { getSavedProfiles, SavedProfile } from '@/lib/utils/profileManager';

interface KootaScore {
  name: { en: string; ne: string };
  maxPoints: number;
  scored: number;
  description: { en: string; ne: string };
}

interface MilanResult {
  kootas: KootaScore[];
  totalScore: number;
  maxScore: number;
  percentage: number;
  verdict: { en: string; ne: string };
  mangalDosha: { groom: boolean; bride: boolean };
}

interface Props {
  kundaliData: any; // current user's chart data
}

export default function KundaliMilan({ kundaliData }: Props) {
  const { locale } = useLanguage();
  const [savedProfiles, setSavedProfiles] = useState<SavedProfile[]>([]);

  // Selection states
  const [groomSelection, setGroomSelection] = useState<string>('current');
  const [brideSelection, setBrideSelection] = useState<string>('manual');

  // Fetched data states
  const [groomData, setGroomData] = useState<any>(kundaliData);
  const [brideData, setBrideData] = useState<any>(null);

  // Manual bride inputs
  const [manualBrideMoonLon, setManualBrideMoonLon] = useState('');
  const [manualBrideLagnaRashi, setManualBrideLagnaRashi] = useState('1');
  const [manualBrideMarsRashi, setManualBrideMarsRashi] = useState('1');

  const [result, setResult] = useState<MilanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setSavedProfiles(getSavedProfiles());
  }, []);

  const fetchKundaliData = async (profile: SavedProfile) => {
    const res = await fetch('/api/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error('Failed to calculate profile');
    return await res.json();
  };

  const handleGroomChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setGroomSelection(val);
    setResult(null);
    if (val === 'current') {
      setGroomData(kundaliData);
    } else {
      setLoading(true);
      try {
        const p = savedProfiles.find(p => p.id === val);
        if (p) setGroomData(await fetchKundaliData(p));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBrideChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setBrideSelection(val);
    setResult(null);
    if (val === 'manual') {
      setBrideData(null);
    } else {
      setLoading(true);
      try {
        const p = savedProfiles.find(p => p.id === val);
        if (p) setBrideData(await fetchKundaliData(p));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCalculate = async () => {
    setError('');
    
    // Groom extraction
    const groomMoon = groomData?.grahas?.find((g: any) => g.id === 'MO');
    const groomMars = groomData?.grahas?.find((g: any) => g.id === 'MA');
    if (!groomMoon) {
      setError('Groom data missing');
      return;
    }

    // Bride extraction
    let bMoonLon = 0;
    let bLagnaRashi = 1;
    let bMarsRashi = 1;

    if (brideSelection === 'manual') {
      if (!manualBrideMoonLon) {
        setError('Please enter Bride Moon Longitude');
        return;
      }
      bMoonLon = parseFloat(manualBrideMoonLon);
      bLagnaRashi = parseInt(manualBrideLagnaRashi);
      bMarsRashi = parseInt(manualBrideMarsRashi);
    } else {
      const brideMoon = brideData?.grahas?.find((g: any) => g.id === 'MO');
      const brideMars = brideData?.grahas?.find((g: any) => g.id === 'MA');
      if (!brideMoon) {
        setError('Bride data missing');
        return;
      }
      bMoonLon = brideMoon.longitude;
      bLagnaRashi = brideData?.lagna?.rashi || 1;
      bMarsRashi = brideMars?.rashi || 1;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/compatibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groomMoonLon: groomMoon.longitude,
          brideMoonLon: bMoonLon,
          groomLagnaRashi: groomData?.lagna?.rashi || 1,
          brideLagnaRashi: bLagnaRashi,
          groomMarsRashi: groomMars?.rashi || 1,
          brideMarsRashi: bMarsRashi,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e: any) {
      setError(e.message || 'Calculation failed');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (scored: number, max: number) => {
    const ratio = scored / max;
    if (ratio >= 0.75) return 'text-emerald-400';
    if (ratio >= 0.5) return 'text-amber-400';
    return 'text-red-400';
  };

  const getBarColor = (scored: number, max: number) => {
    const ratio = scored / max;
    if (ratio >= 0.75) return 'bg-emerald-500';
    if (ratio >= 0.5) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-bold text-amber-300 mb-6">
          {locale === 'ne' ? 'कुण्डली मिलान — ३६ गुण' : 'Kundali Milan — Ashtakoota'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          {/* Groom Section */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white/80 border-b border-white/10 pb-2">
              {locale === 'ne' ? 'वर (केटा)' : 'Groom (Boy)'}
            </h4>
            <select
              value={groomSelection}
              onChange={handleGroomChange}
              className="w-full px-3 py-2 bg-black/30 border border-white/20 rounded-lg text-white"
            >
              <option value="current">{locale === 'ne' ? 'वर्तमान कुण्डली' : 'Current Kundali'} ({kundaliData?.birthData?.name || 'Unnamed'})</option>
              <optgroup label={locale === 'ne' ? 'सुरक्षित प्रोफाइलहरू' : 'Saved Profiles'}>
                {savedProfiles.map(p => (
                  <option key={`g-${p.id}`} value={p.id}>{p.name}</option>
                ))}
              </optgroup>
            </select>
            
            {groomData && (
              <div className="text-sm text-white/60 bg-black/20 p-3 rounded-lg border border-white/5">
                <div>Moon: {groomData.grahas?.find((g:any)=>g.id==='MO')?.longitude.toFixed(2)}°</div>
                <div>Lagna Rashi: {groomData.lagna?.rashi}</div>
                <div>Mars Rashi: {groomData.grahas?.find((g:any)=>g.id==='MA')?.rashi}</div>
              </div>
            )}
          </div>

          {/* Bride Section */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white/80 border-b border-white/10 pb-2">
              {locale === 'ne' ? 'वधू (केटी)' : 'Bride (Girl)'}
            </h4>
            <select
              value={brideSelection}
              onChange={handleBrideChange}
              className="w-full px-3 py-2 bg-black/30 border border-white/20 rounded-lg text-white"
            >
              <option value="manual">{locale === 'ne' ? 'म्यानुअल प्रविष्टि' : 'Manual Entry'}</option>
              <optgroup label={locale === 'ne' ? 'सुरक्षित प्रोफाइलहरू' : 'Saved Profiles'}>
                {savedProfiles.map(p => (
                  <option key={`b-${p.id}`} value={p.id}>{p.name}</option>
                ))}
              </optgroup>
            </select>

            {brideSelection === 'manual' ? (
              <div className="space-y-3">
                <input
                  type="number"
                  step="0.01"
                  value={manualBrideMoonLon}
                  onChange={e => setManualBrideMoonLon(e.target.value)}
                  className="w-full px-3 py-2 bg-black/30 border border-white/20 rounded-lg text-white text-sm"
                  placeholder={locale === 'ne' ? "चन्द्र देशान्तर (°)" : "Moon Longitude (°)"}
                />
                <div className="flex gap-3">
                  <div className="w-1/2">
                    <label className="text-xs text-white/50">{locale === 'ne' ? 'लग्न राशि' : 'Lagna'}</label>
                    <select
                      value={manualBrideLagnaRashi}
                      onChange={e => setManualBrideLagnaRashi(e.target.value)}
                      className="w-full px-3 py-2 bg-black/30 border border-white/20 rounded-lg text-white text-sm"
                    >
                      {[1,2,3,4,5,6,7,8,9,10,11,12].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="w-1/2">
                    <label className="text-xs text-white/50">{locale === 'ne' ? 'मङ्गल राशि' : 'Mars'}</label>
                    <select
                      value={manualBrideMarsRashi}
                      onChange={e => setManualBrideMarsRashi(e.target.value)}
                      className="w-full px-3 py-2 bg-black/30 border border-white/20 rounded-lg text-white text-sm"
                    >
                      {[1,2,3,4,5,6,7,8,9,10,11,12].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            ) : brideData ? (
              <div className="text-sm text-white/60 bg-black/20 p-3 rounded-lg border border-white/5">
                <div>Moon: {brideData.grahas?.find((g:any)=>g.id==='MO')?.longitude.toFixed(2)}°</div>
                <div>Lagna Rashi: {brideData.lagna?.rashi}</div>
                <div>Mars Rashi: {brideData.grahas?.find((g:any)=>g.id==='MA')?.rashi}</div>
              </div>
            ) : null}
          </div>
        </div>

        <button
          onClick={handleCalculate}
          disabled={loading || (brideSelection === 'manual' && !manualBrideMoonLon)}
          className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg text-white font-bold hover:brightness-110 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(217,119,6,0.3)]"
        >
          {loading ? '...' : locale === 'ne' ? 'मिलान गर्नुहोस्' : 'Calculate Match'}
        </button>

        {error && <p className="mt-4 text-red-400 text-sm font-medium">{error}</p>}
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center shadow-lg">
            <div className="text-6xl font-bold bg-gradient-to-r from-emerald-300 via-amber-300 to-orange-400 bg-clip-text text-transparent">
              {result.totalScore}/{result.maxScore}
            </div>
            <div className="text-white/60 mt-2 font-medium">{result.percentage}% Compatibility</div>
            <div className="mt-4 text-xl font-bold text-amber-200">
              {locale === 'ne' ? result.verdict.ne : result.verdict.en}
            </div>

            <div className="mt-6 flex justify-center gap-8 text-sm bg-black/20 py-3 rounded-lg border border-white/5 max-w-lg mx-auto">
              <span className={`font-medium ${result.mangalDosha.groom ? 'text-red-400' : 'text-emerald-400'}`}>
                {locale === 'ne' ? 'वर' : 'Groom'}: {result.mangalDosha.groom
                  ? (locale === 'ne' ? 'मङ्गलिक' : 'Manglik')
                  : (locale === 'ne' ? 'अमङ्गलिक' : 'Non-Manglik')}
              </span>
              <span className={`font-medium ${result.mangalDosha.bride ? 'text-red-400' : 'text-emerald-400'}`}>
                {locale === 'ne' ? 'वधू' : 'Bride'}: {result.mangalDosha.bride
                  ? (locale === 'ne' ? 'मङ्गलिक' : 'Manglik')
                  : (locale === 'ne' ? 'अमङ्गलिक' : 'Non-Manglik')}
              </span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-black/30 text-white/60 text-left">
                  <th className="px-5 py-4 font-semibold">{locale === 'ne' ? 'कूट' : 'Koota'}</th>
                  <th className="px-5 py-4 font-semibold text-center">{locale === 'ne' ? 'अंक' : 'Score'}</th>
                  <th className="px-5 py-4 font-semibold hidden md:table-cell">{locale === 'ne' ? 'विवरण' : 'Description'}</th>
                  <th className="px-5 py-4 font-semibold w-40">{locale === 'ne' ? 'बार' : 'Bar'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {result.kootas.map((k, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4 font-bold text-white/90">
                      {locale === 'ne' ? k.name.ne : k.name.en}
                    </td>
                    <td className={`px-5 py-4 text-center font-black text-lg ${getScoreColor(k.scored, k.maxPoints)}`}>
                      {k.scored}/{k.maxPoints}
                    </td>
                    <td className="px-5 py-4 text-white/60 hidden md:table-cell leading-relaxed">
                      {locale === 'ne' ? k.description.ne : k.description.en}
                    </td>
                    <td className="px-5 py-4">
                      <div className="w-full bg-black/40 rounded-full h-2.5 border border-white/5">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${getBarColor(k.scored, k.maxPoints)}`}
                          style={{ width: `${(k.scored / k.maxPoints) * 100}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

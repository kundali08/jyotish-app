'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import NorthIndianChart from './NorthIndianChart';
import type { GrahaPosition } from '@/lib/types/graha';
import type { LagnaData, VargaChart } from '@/lib/types/chart';

interface Props {
  grahas: GrahaPosition[];
  lagna: LagnaData;
  vargaCharts: VargaChart[];
}

const IMPORTANT_VARGAS = ['D1', 'D9', 'D2', 'D3', 'D7', 'D10', 'D12', 'D30'];

export default function VargaChartGrid({ grahas, lagna, vargaCharts }: Props) {
  const { tObj, locale } = useLanguage();
  const [selectedVarga, setSelectedVarga] = useState<string>('D1');
  const [showAll, setShowAll] = useState(false);
  const [expandedChartType, setExpandedChartType] = useState<string | null>(null);

  const selectedChart = vargaCharts.find(v => v.type === selectedVarga);

  return (
    <div className="space-y-6">
      {/* Varga Selector */}
      <div className="glass-card p-4">
        <div className="flex flex-wrap gap-2">
          {/* Manually add D1 and Chandra buttons */}
          <button
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedVarga === 'D1'
              ? 'border border-amber-500 text-amber-100'
              : 'bg-gray-800/40 text-gray-400 border border-gray-700 hover:border-gray-500'}`}
            style={selectedVarga === 'D1' ? { background: 'linear-gradient(135deg, var(--saffron-600), var(--maroon-600))' } : {}}
            onClick={() => setSelectedVarga('D1')}>
            D1
            <span className="ml-1 opacity-60">{locale === 'ne' ? 'लग्न' : 'Lagna'}</span>
          </button>

          <button
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedVarga === 'Chandra'
              ? 'border border-amber-500 text-amber-100'
              : 'bg-gray-800/40 text-gray-400 border border-gray-700 hover:border-gray-500'}`}
            style={selectedVarga === 'Chandra' ? { background: 'linear-gradient(135deg, var(--saffron-600), var(--maroon-600))' } : {}}
            onClick={() => setSelectedVarga('Chandra')}>
            {locale === 'ne' ? 'चन्द्र' : 'Chandra'}
            <span className="ml-1 opacity-60">{locale === 'ne' ? 'राशि' : 'Rashi'}</span>
          </button>

          {vargaCharts.map(v => {
            const isImportant = IMPORTANT_VARGAS.includes(v.type);
            if (!showAll && !isImportant) return null;
            return (
              <button key={v.type}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedVarga === v.type
                  ? 'border border-amber-500 text-amber-100'
                  : 'bg-gray-800/40 text-gray-400 border border-gray-700 hover:border-gray-500'}`}
                style={selectedVarga === v.type ? { background: 'linear-gradient(135deg, var(--saffron-600), var(--maroon-600))' } : {}}
                onClick={() => setSelectedVarga(v.type)}>
                {v.type}
                <span className="ml-1 opacity-60">{tObj(v.name).split(' ')[0]}</span>
              </button>
            );
          })}
          <button
            className="px-3 py-1.5 rounded-lg text-xs border border-gray-700 text-gray-500 hover:text-gray-300"
            onClick={() => setShowAll(!showAll)}>
            {showAll ? (locale === 'ne' ? 'कम देखाउ' : 'Show less') : (locale === 'ne' ? 'सबै देखाउ' : 'Show all 16')}
          </button>
        </div>
      </div>

      {/* Selected chart - large */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="glass-card p-6 flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--gold-400)' }}>
            {selectedVarga === 'D1' ? (locale === 'ne' ? 'D1 — लग्न कुण्डली' : 'D1 — Lagna Chart')
              : selectedVarga === 'Chandra' ? (locale === 'ne' ? 'राशि — चन्द्र कुण्डली' : 'Rashi — Chandra Chart')
              : selectedChart ? `${selectedChart.type} — ${tObj(selectedChart.name)}` : ''}
          </h3>
          <div 
            className="cursor-pointer relative group rounded-xl p-4 bg-black/10 border border-transparent hover:border-[var(--gold-400)] transition-all"
            onClick={() => setExpandedChartType(selectedVarga)}
            title={locale === 'ne' ? 'ठूलो हेर्न क्लिक गर्नुहोस्' : 'Click to expand'}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold-500)]/5 to-transparent pointer-events-none group-hover:from-[var(--gold-500)]/20 transition-all rounded-xl"></div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 z-10 rounded-xl">
              <span className="text-2xl">🔍</span>
            </div>
            {(() => {
              if (selectedVarga === 'Chandra') {
                const moon = grahas.find((g: any) => g.id === 'MO');
                const moonRashi = moon ? moon.rashi : lagna.rashi;
                return (
                  <NorthIndianChart
                    grahas={grahas}
                    lagna={{ ...lagna, rashi: moonRashi }}
                    size={380}
                    centerText="च"
                  />
                );
              }
              return (
                <NorthIndianChart
                  grahas={grahas}
                  lagna={lagna}
                  vargaChart={selectedVarga === 'D1' ? undefined : selectedChart}
                  size={380}
                />
              );
            })()}
          </div>
          {selectedChart && (
            <p className="text-xs mt-3 text-center max-w-xs" style={{ color: 'var(--text-secondary)' }}>
              {tObj(selectedChart.signification)}
            </p>
          )}
        </div>

        {/* Side: 4 important vargas as thumbnails */}
        <div className="grid grid-cols-2 gap-4">
          {['D1', 'Chandra', 'D9', 'D10', 'D7'].filter(t => t !== selectedVarga).slice(0, 4).map(vType => {
            const isChandra = vType === 'Chandra';
            const vc = isChandra ? undefined : vargaCharts.find(v => v.type === vType);
            const title = isChandra ? (locale === 'ne' ? 'चन्द्र' : 'Chandra') : `${vType} ${vc ? tObj(vc.name) : ''}`;
            const moon = grahas.find((g: any) => g.id === 'MO');
            const moonRashi = moon ? moon.rashi : lagna.rashi;
            
            return (
              <div key={vType}
                className="glass-card p-3 cursor-pointer relative group border border-transparent hover:border-amber-500/50 transition-all flex flex-col items-center"
                onClick={() => setExpandedChartType(vType)}>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 z-10 rounded-xl">
                  <span className="text-xl">🔍</span>
                </div>
                {isChandra ? (
                  <NorthIndianChart
                    grahas={grahas}
                    lagna={{ ...lagna, rashi: moonRashi }}
                    size={160}
                    title={title}
                    centerText="च"
                  />
                ) : (
                  <NorthIndianChart
                    grahas={grahas}
                    lagna={lagna}
                    vargaChart={vType === 'D1' ? undefined : vc}
                    size={160}
                    title={vType === 'D1' ? (locale === 'ne' ? 'लग्न' : 'Lagna') : title}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Full-screen Chart Modal */}
      {expandedChartType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md transition-opacity duration-300">
          <div className="glass-card p-4 md:p-8 relative flex flex-col items-center shadow-2xl animate-fade-in w-full max-w-3xl mx-4">
            <button 
              className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-red-400 transition-colors bg-white/5 hover:bg-white/10 rounded-full w-10 h-10 flex items-center justify-center"
              onClick={() => setExpandedChartType(null)}
            >
              <span className="text-xl">✕</span>
            </button>
            <h2 className="text-2xl font-bold mb-6 mt-2" style={{ color: 'var(--gold-400)' }}>
              {(() => {
                if (expandedChartType === 'D1') return locale === 'ne' ? 'लग्न कुण्डली (D1)' : 'Lagna Chart (D1)';
                if (expandedChartType === 'Chandra') return locale === 'ne' ? 'राशि — चन्द्र कुण्डली' : 'Rashi — Chandra Chart';
                const expVc = vargaCharts.find(v => v.type === expandedChartType);
                return `${expandedChartType} — ${expVc ? tObj(expVc.name) : ''}`;
              })()}
            </h2>
            <div className="w-full flex justify-center">
              <div style={{ width: '100%', maxWidth: '600px', aspectRatio: '1/1' }}>
                {(() => {
                  if (expandedChartType === 'Chandra') {
                    const moon = grahas.find((g: any) => g.id === 'MO');
                    const moonRashi = moon ? moon.rashi : lagna.rashi;
                    return (
                      <NorthIndianChart 
                        grahas={grahas} 
                        lagna={{ ...lagna, rashi: moonRashi }} 
                        size={600}
                        title="" 
                        centerText="च"
                      />
                    );
                  }
                  return (
                    <NorthIndianChart 
                      grahas={grahas} 
                      lagna={lagna} 
                      vargaChart={expandedChartType === 'D1' ? undefined : vargaCharts.find(v => v.type === expandedChartType)}
                      size={600}
                      title="" 
                    />
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React from 'react';
import { GRAHAS } from '@/lib/constants/grahas';
import type { GrahaPosition, RashiNumber } from '@/lib/types/graha';
import type { LagnaData, VargaChart } from '@/lib/types/chart';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface Props {
  grahas: GrahaPosition[];
  lagna: LagnaData;
  vargaChart?: VargaChart;
  size?: number;
  title?: string;
  centerText?: string;
}

/*
 * Traditional North Indian Kundali (Parashara / Surya Siddhanta style)
 *
 * Structure: outer square + inner diamond + corner-to-center diagonals = 12 houses
 *
 * House layout (counter-clockwise from top):
 *
 *     ┌────────────────────────┐
 *     │╲  12    ╱╲    11    ╱  │
 *     │  ╲    ╱    ╲      ╱    │
 *     │    ╲╱   1    ╲  ╱      │
 *     │    ╱╲        ╱╲   10   │
 *     │  ╱    ╲    ╱    ╲      │
 *     │╱   2    ╲╱        ╲    │
 *     │╲        ╱╲        ╱    │
 *     │  ╲    ╱    ╲    ╱      │
 *     │    ╲╱   C    ╲╱        │
 *     │    ╱╲        ╱╲        │
 *     │  ╱    ╲    ╱    ╲      │
 *     │╱   3    ╲╱    9   ╲    │
 *     │╲        ╱╲        ╱    │
 *     │  ╲    ╱    ╲    ╱      │
 *     │    ╲╱        ╲╱        │
 *     │  4  ╱╲   7  ╱╲   8    │
 *     │   ╱    ╲  ╱    ╲      │
 *     │ ╱  5    ╲╱  6    ╲    │
 *     └────────────────────────┘
 *
 *  H1(top), H4(left), H7(bottom), H10(right) are kendra (diamond kites)
 *  Corner triangles: H2,H3 (TL), H5,H6 (BL), H8,H9 (BR), H11,H12 (TR)
 */

// Text center positions for each house (normalized 0-1)
// Adjusted for Lotus layout to keep text clearly inside respective curved regions
const HOUSE_TEXT: { x: number; y: number }[] = [
  { x: 0.50, y: 0.18 },  // H1  (top petal)
  { x: 0.25, y: 0.16 },  // H2  (top-left outer)
  { x: 0.16, y: 0.25 },  // H3  (left-top outer)
  { x: 0.18, y: 0.50 },  // H4  (left petal)
  { x: 0.16, y: 0.75 },  // H5  (left-bottom outer)
  { x: 0.25, y: 0.84 },  // H6  (bottom-left outer)
  { x: 0.50, y: 0.82 },  // H7  (bottom petal)
  { x: 0.75, y: 0.84 },  // H8  (bottom-right outer)
  { x: 0.84, y: 0.75 },  // H9  (right-bottom outer)
  { x: 0.82, y: 0.50 },  // H10 (right petal)
  { x: 0.84, y: 0.25 },  // H11 (right-top outer)
  { x: 0.75, y: 0.16 },  // H12 (top-right outer)
];

// Rashi number label positions (small numbers)
const RASHI_POS: { x: number; y: number }[] = [
  { x: 0.50, y: 0.38 },  // H1  (near center)
  { x: 0.22, y: 0.07 },  // H2  (tucked in corner)
  { x: 0.07, y: 0.22 },  // H3  
  { x: 0.38, y: 0.50 },  // H4  (near center)
  { x: 0.07, y: 0.78 },  // H5  
  { x: 0.22, y: 0.93 },  // H6  
  { x: 0.50, y: 0.62 },  // H7  (near center)
  { x: 0.78, y: 0.93 },  // H8  
  { x: 0.93, y: 0.78 },  // H9  
  { x: 0.62, y: 0.50 },  // H10 (near center)
  { x: 0.93, y: 0.22 },  // H11 
  { x: 0.78, y: 0.07 },  // H12 
];

export default function NorthIndianChart({ grahas, lagna, vargaChart, size = 560, title, centerText }: Props) {
  const S = size;
  const m = S * 0.045; // increased margin to fit outer border
  const w = S - 2 * m;

  // Key points
  const TL = { x: m, y: m };
  const TR = { x: m + w, y: m };
  const BR = { x: m + w, y: m + w };
  const BL = { x: m, y: m + w };
  const T  = { x: m + w / 2, y: m };
  const R  = { x: m + w, y: m + w / 2 };
  const B  = { x: m + w / 2, y: m + w };
  const L  = { x: m, y: m + w / 2 };
  const C  = { x: m + w / 2, y: m + w / 2 };

  const { locale, formatNumber } = useLanguage();
  const lagnaSign = vargaChart ? vargaChart.lagnaSign : lagna.rashi;

  const getSignForHouse = (house: number): RashiNumber => {
    return (((lagnaSign - 1 + house - 1) % 12) + 1) as RashiNumber;
  };

  const getPlanetsInHouse = (house: number): { label: string; retro: boolean }[] => {
    const sign = getSignForHouse(house);
    const result: { label: string; retro: boolean }[] = [];
    if (vargaChart) {
      for (const [pid, pSign] of Object.entries(vargaChart.planetPositions)) {
        if (pSign === sign && pid !== 'LG') {
          const label = GRAHAS[pid as keyof typeof GRAHAS]?.symbol[locale as 'en' | 'ne'] || pid;
          result.push({ label, retro: false });
        }
      }
    } else {
      for (const g of grahas) {
        if (g.rashi === sign) {
          const label = GRAHAS[g.id]?.symbol[locale as 'en' | 'ne'] || g.id;
          result.push({ label, retro: g.isRetrograde });
        }
      }
    }
    return result;
  };

  const fontSize = Math.max(11, S * 0.024);
  const rashiFontSize = Math.max(9, S * 0.018);
  const strokeColor = "#DAA520"; // Brighter, classic goldenrod color
  const textColor = "#B8860B"; // Dark goldenrod for better text contrast

  return (
    <div className="inline-flex flex-col items-center">
      {title && (
        <div className="text-lg font-bold mb-3" style={{ color: textColor, fontFamily: "'Tiro Devanagari Sanskrit', serif" }}>
          {title}
        </div>
      )}
      <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`}
        style={{ filter: 'drop-shadow(0 0 12px rgba(218,165,32,0.15))' }}>

        {/* Outer Lotus double-frame (rounded square) */}
        {/* Outer decorative line */}
        <rect x={m - w*0.025} y={m - w*0.025} width={w + w*0.05} height={w + w*0.05} rx={w * 0.12}
          fill="none" stroke={strokeColor} strokeWidth="1.5" opacity="0.6" />
        {/* Main boundary line */}
        <rect x={m} y={m} width={w} height={w} rx={w * 0.1}
          fill="none" stroke={strokeColor} strokeWidth="2.5" opacity="0.9" />

        {/* Center bindu / circle */}
        {(() => {
          const r = w * 0.05;
          const cos45 = 0.7071;
          const cx = C.x;
          const cy = C.y;
          
          const cTL = { x: cx - r * cos45, y: cy - r * cos45 };
          const cTR = { x: cx + r * cos45, y: cy - r * cos45 };
          const cBL = { x: cx - r * cos45, y: cy + r * cos45 };
          const cBR = { x: cx + r * cos45, y: cy + r * cos45 };

          // Adjust control point distance for petal plumpness.
          // 0.22 keeps the petals beautiful but leaves room for outer text.
          const d_cp = w * 0.22;
          const cpTL = { x: m + d_cp, y: m + d_cp };
          const cpTR = { x: m + w - d_cp, y: m + d_cp };
          const cpBL = { x: m + d_cp, y: m + w - d_cp };
          const cpBR = { x: m + w - d_cp, y: m + w - d_cp };

          const lotusPath = `
            M ${T.x} ${T.y} Q ${cpTL.x} ${cpTL.y} ${cTL.x} ${cTL.y}
            M ${T.x} ${T.y} Q ${cpTR.x} ${cpTR.y} ${cTR.x} ${cTR.y}
            M ${R.x} ${R.y} Q ${cpTR.x} ${cpTR.y} ${cTR.x} ${cTR.y}
            M ${R.x} ${R.y} Q ${cpBR.x} ${cpBR.y} ${cBR.x} ${cBR.y}
            M ${B.x} ${B.y} Q ${cpBR.x} ${cpBR.y} ${cBR.x} ${cBR.y}
            M ${B.x} ${B.y} Q ${cpBL.x} ${cpBL.y} ${cBL.x} ${cBL.y}
            M ${L.x} ${L.y} Q ${cpBL.x} ${cpBL.y} ${cBL.x} ${cBL.y}
            M ${L.x} ${L.y} Q ${cpTL.x} ${cpTL.y} ${cTL.x} ${cTL.y}
          `;

          return (
            <>
              {/* Inner Lotus Petals */}
              <path d={lotusPath} fill="none" stroke={strokeColor} strokeWidth="2.5" opacity="0.9" />
              
              {/* Diagonal Veins */}
              <line x1={m + w*0.035} y1={m + w*0.035} x2={cTL.x} y2={cTL.y} stroke={strokeColor} strokeWidth="1.5" opacity="0.7" />
              <line x1={m + w - w*0.035} y1={m + w*0.035} x2={cTR.x} y2={cTR.y} stroke={strokeColor} strokeWidth="1.5" opacity="0.7" />
              <line x1={m + w*0.035} y1={m + w - w*0.035} x2={cBL.x} y2={cBL.y} stroke={strokeColor} strokeWidth="1.5" opacity="0.7" />
              <line x1={m + w - w*0.035} y1={m + w - w*0.035} x2={cBR.x} y2={cBR.y} stroke={strokeColor} strokeWidth="1.5" opacity="0.7" />

              <circle cx={cx} cy={cy} r={r} fill="rgba(218,165,32,0.08)" stroke={strokeColor} strokeWidth="2" opacity="0.9" />
              <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize={r * 0.8} fill={textColor} opacity="1" fontWeight="bold" fontFamily="sans-serif">
                {centerText || (() => {
                  const type = vargaChart?.type;
                  if (!type || type === 'D1') return 'ल';
                  const map: Record<string, string> = {
                    'D2': 'हो', 'D3': 'द्रे', 'D4': 'च', 'D7': 'स', 'D9': 'न',
                    'D10': 'द', 'D12': 'द्वा', 'D16': 'षो', 'D20': 'वि',
                    'D24': 'सि', 'D27': 'भ', 'D30': 'त्रिं', 'D40': 'ख',
                    'D45': 'अ', 'D60': 'ष'
                  };
                  return map[type] || type;
                })()}
              </text>
            </>
          );
        })()}

        {/* Render 12 houses */}
        {Array.from({ length: 12 }, (_, i) => {
          const houseNum = i + 1;
          const sign = getSignForHouse(houseNum);
          const planets = getPlanetsInHouse(houseNum);
          const tc = HOUSE_TEXT[i];
          const rp = RASHI_POS[i];

          const cx = tc.x * S;
          const cy = tc.y * S;
          const rx = rp.x * S;
          const ry = rp.y * S;

          const totalH = planets.length * (fontSize + 2);
          const startY = cy - totalH / 2 + fontSize / 2;

          return (
            <g key={houseNum}>
              {/* Rashi number */}
              <text x={rx} y={ry} textAnchor="middle" dominantBaseline="central"
                fontSize={rashiFontSize} fill={textColor} opacity="0.8" fontWeight="bold">
                {formatNumber(sign)}
              </text>
              {/* Planet labels */}
              {planets.map((p, idx) => (
                <text key={idx} x={cx} y={startY + idx * (fontSize + 2)}
                  textAnchor="middle" dominantBaseline="central"
                  fontSize={fontSize} fill={p.retro ? '#F87171' : '#E5C07B'} fontWeight="600" opacity="0.95">
                  {p.label}{p.retro ? 'ᴿ' : ''}
                </text>
              ))}
            </g>
          );
        })}

        {/* Lagna marker */}
        <text x={S / 2} y={m + 14} textAnchor="middle" fontSize={11}
          fill="var(--saffron-400)" fontWeight="bold" opacity="0.7">
          {locale === 'ne' ? 'ल.' : 'Asc'}
        </text>
      </svg>
    </div>
  );
}

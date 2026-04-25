/**
 * Rashi (Zodiac Sign) Constants
 * Based on BPHS Ch. 4 — Rashi characteristics
 */

export interface RashiDefinition {
  number: number;    // 1-12
  name: { en: string; ne: string; sanskrit: string };
  symbol: string;    // Unicode zodiac symbol
  element: 'fire' | 'earth' | 'air' | 'water';
  quality: 'cardinal' | 'fixed' | 'mutable';
  gender: 'male' | 'female';
  direction: 'east' | 'south' | 'west' | 'north';
  startDegree: number;   // 0, 30, 60, ...
  endDegree: number;     // 30, 60, 90, ...
}

export const RASHIS: RashiDefinition[] = [
  {
    number: 1,
    name: { en: 'Aries', ne: 'मेष', sanskrit: 'Mesha' },
    symbol: '♈', element: 'fire', quality: 'cardinal',
    gender: 'male', direction: 'east',
    startDegree: 0, endDegree: 30,
  },
  {
    number: 2,
    name: { en: 'Taurus', ne: 'वृष', sanskrit: 'Vrishabha' },
    symbol: '♉', element: 'earth', quality: 'fixed',
    gender: 'female', direction: 'south',
    startDegree: 30, endDegree: 60,
  },
  {
    number: 3,
    name: { en: 'Gemini', ne: 'मिथुन', sanskrit: 'Mithuna' },
    symbol: '♊', element: 'air', quality: 'mutable',
    gender: 'male', direction: 'west',
    startDegree: 60, endDegree: 90,
  },
  {
    number: 4,
    name: { en: 'Cancer', ne: 'कर्कट', sanskrit: 'Karka' },
    symbol: '♋', element: 'water', quality: 'cardinal',
    gender: 'female', direction: 'north',
    startDegree: 90, endDegree: 120,
  },
  {
    number: 5,
    name: { en: 'Leo', ne: 'सिंह', sanskrit: 'Simha' },
    symbol: '♌', element: 'fire', quality: 'fixed',
    gender: 'male', direction: 'east',
    startDegree: 120, endDegree: 150,
  },
  {
    number: 6,
    name: { en: 'Virgo', ne: 'कन्या', sanskrit: 'Kanya' },
    symbol: '♍', element: 'earth', quality: 'mutable',
    gender: 'female', direction: 'south',
    startDegree: 150, endDegree: 180,
  },
  {
    number: 7,
    name: { en: 'Libra', ne: 'तुला', sanskrit: 'Tula' },
    symbol: '♎', element: 'air', quality: 'cardinal',
    gender: 'male', direction: 'west',
    startDegree: 180, endDegree: 210,
  },
  {
    number: 8,
    name: { en: 'Scorpio', ne: 'वृश्चिक', sanskrit: 'Vrishchika' },
    symbol: '♏', element: 'water', quality: 'fixed',
    gender: 'female', direction: 'north',
    startDegree: 210, endDegree: 240,
  },
  {
    number: 9,
    name: { en: 'Sagittarius', ne: 'धनु', sanskrit: 'Dhanu' },
    symbol: '♐', element: 'fire', quality: 'mutable',
    gender: 'male', direction: 'east',
    startDegree: 240, endDegree: 270,
  },
  {
    number: 10,
    name: { en: 'Capricorn', ne: 'मकर', sanskrit: 'Makara' },
    symbol: '♑', element: 'earth', quality: 'cardinal',
    gender: 'female', direction: 'south',
    startDegree: 270, endDegree: 300,
  },
  {
    number: 11,
    name: { en: 'Aquarius', ne: 'कुम्भ', sanskrit: 'Kumbha' },
    symbol: '♒', element: 'air', quality: 'fixed',
    gender: 'male', direction: 'west',
    startDegree: 300, endDegree: 330,
  },
  {
    number: 12,
    name: { en: 'Pisces', ne: 'मीन', sanskrit: 'Meena' },
    symbol: '♓', element: 'water', quality: 'mutable',
    gender: 'female', direction: 'north',
    startDegree: 330, endDegree: 360,
  },
];

/** Get rashi by number (1-indexed) */
export function getRashi(number: number): RashiDefinition {
  return RASHIS[((number - 1) % 12 + 12) % 12];
}

/** Get rashi number from longitude (0-360) */
export function getRashiFromLongitude(longitude: number): number {
  return Math.floor(longitude / 30) + 1;
}

/** Get degree within sign from longitude */
export function getDegreeInSign(longitude: number): number {
  return longitude % 30;
}

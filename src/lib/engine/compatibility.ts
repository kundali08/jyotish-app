/**
 * Kundali Milan — Ashtakoota Guna Matching (36 Points)
 * BPHS-based compatibility assessment
 *
 * 8 Koota (Guna) factors:
 *  1. Varna (वर्ण)       — 1 point  — Spiritual compatibility
 *  2. Vashya (वश्य)      — 2 points — Dominance/obedience
 *  3. Tara (तारा)        — 3 points — Destiny compatibility
 *  4. Yoni (योनि)        — 4 points — Physical/sexual compatibility
 *  5. Graha Maitri (ग्रहमैत्री) — 5 points — Mental compatibility
 *  6. Gana (गण)          — 6 points — Temperament compatibility
 *  7. Bhakoot (भकूट)      — 7 points — Love & family harmony
 *  8. Nadi (नाडी)        — 8 points — Health & progeny
 *
 * Total: 36 points. ≥18 considered acceptable.
 */

import { NakshatraNumber } from '../types/graha';
import { NAKSHATRAS } from '../constants/nakshatras';
import { getRashiFromLongitude } from '../constants/rashis';
import { getNakshatraFromLongitude } from '../constants/nakshatras';
import { SIGN_LORDS } from '../constants/grahas';

// ─── Types ───

export interface KootaScore {
  name: { en: string; ne: string };
  maxPoints: number;
  scored: number;
  description: { en: string; ne: string };
}

export interface MilanResult {
  kootas: KootaScore[];
  totalScore: number;
  maxScore: 36;
  percentage: number;
  verdict: { en: string; ne: string };
  mangalDosha: { groom: boolean; bride: boolean };
}

// ─── Nakshatra Attribute Tables ───

// Varna: 1=Brahmin, 2=Kshatriya, 3=Vaishya, 4=Shudra
const NAKSHATRA_VARNA: number[] = [
  1, 1, 3, 4, 2, 1, 3, 4, 2, 1, 3, 4,
  2, 1, 3, 4, 2, 1, 3, 4, 2, 1, 3, 4,
  2, 1, 3
];

// Vashya groups based on rashi
// 1=Chatushpada(quadruped), 2=Manava(human), 3=Jalachara(water), 4=Vanachara(wild), 5=Keeta(insect)
function getVashya(rashi: number): number {
  const RASHI_VASHYA = [4, 1, 2, 3, 4, 2, 2, 5, 1, 3, 2, 3];
  return RASHI_VASHYA[(rashi - 1) % 12];
}

// Yoni pairs (animal symbol for sexual compatibility)
// Each nakshatra has an animal + gender
const YONI_ANIMAL: number[] = [
  1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6,
  7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12,
  13, 13, 14
];

// Yoni compatibility matrix (14 animals)
const YONI_COMPAT: Record<string, number> = {};
function initYoniCompat() {
  // Same animal = 4, friendly = 3, neutral = 2, enemy = 1, worst = 0
  for (let i = 1; i <= 14; i++) {
    for (let j = 1; j <= 14; j++) {
      const key = `${i}_${j}`;
      if (i === j) YONI_COMPAT[key] = 4;
      else YONI_COMPAT[key] = 2; // default neutral
    }
  }
  // Known enemy pairs (Horse-Buffalo, Lion-Elephant, etc.)
  const enemies: [number, number][] = [
    [1, 2], [3, 4], [5, 6], [7, 8], [9, 10], [11, 12], [13, 14]
  ];
  for (const [a, b] of enemies) {
    YONI_COMPAT[`${a}_${b}`] = 0;
    YONI_COMPAT[`${b}_${a}`] = 0;
  }
}
initYoniCompat();

// Gana: 0=Deva, 1=Manushya, 2=Rakshasa
const NAKSHATRA_GANA: number[] = [
  0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2,
  0, 0, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2,
  0, 1, 2
];

// Nadi: 0=Adi(Vata), 1=Madhya(Pitta), 2=Antya(Kapha)
const NAKSHATRA_NADI: number[] = [
  0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0,
  0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0,
  0, 1, 2
];

// Graha Maitri (natural friendship)
type FriendLevel = 'friend' | 'neutral' | 'enemy';
const FRIENDSHIP: Record<string, FriendLevel> = {
  'SU_MO': 'friend', 'SU_MA': 'friend', 'SU_JU': 'friend',
  'SU_VE': 'enemy', 'SU_SA': 'enemy', 'SU_ME': 'neutral',
  'MO_SU': 'friend', 'MO_ME': 'friend',
  'MO_MA': 'neutral', 'MO_JU': 'neutral', 'MO_VE': 'neutral', 'MO_SA': 'neutral',
  'MA_SU': 'friend', 'MA_MO': 'friend', 'MA_JU': 'friend',
  'MA_ME': 'enemy', 'MA_VE': 'neutral', 'MA_SA': 'neutral',
  'ME_SU': 'friend', 'ME_VE': 'friend',
  'ME_MO': 'enemy', 'ME_MA': 'neutral', 'ME_JU': 'neutral', 'ME_SA': 'neutral',
  'JU_SU': 'friend', 'JU_MO': 'friend', 'JU_MA': 'friend',
  'JU_VE': 'enemy', 'JU_ME': 'enemy', 'JU_SA': 'neutral',
  'VE_ME': 'friend', 'VE_SA': 'friend',
  'VE_SU': 'enemy', 'VE_MO': 'enemy', 'VE_MA': 'neutral', 'VE_JU': 'neutral',
  'SA_ME': 'friend', 'SA_VE': 'friend',
  'SA_SU': 'enemy', 'SA_MO': 'enemy', 'SA_MA': 'enemy', 'SA_JU': 'neutral',
};

function getFriendship(lord1: string, lord2: string): FriendLevel {
  if (lord1 === lord2) return 'friend';
  return FRIENDSHIP[`${lord1}_${lord2}`] || 'neutral';
}

// ─── Koota Calculations ───

function calcVarna(nak1: number, nak2: number): number {
  const v1 = NAKSHATRA_VARNA[(nak1 - 1) % 27];
  const v2 = NAKSHATRA_VARNA[(nak2 - 1) % 27];
  // Groom varna >= Bride varna → 1 point
  return v1 >= v2 ? 1 : 0;
}

function calcVashya(rashi1: number, rashi2: number): number {
  const v1 = getVashya(rashi1);
  const v2 = getVashya(rashi2);
  if (v1 === v2) return 2;
  // Same group or friendly = 1, otherwise 0
  if (v1 === 2 || v2 === 2) return 1; // Human is friendly to all
  return 0;
}

function calcTara(nak1: number, nak2: number): number {
  // Count from bride's nakshatra to groom's
  const diff = ((nak1 - nak2) % 27 + 27) % 27;
  const tara = (diff % 9) + 1;
  // Tara 1,2,4,6,8,9 are auspicious → 3 points
  // Tara 3,5,7 are inauspicious → 0 points
  // Partial: check both directions
  const diff2 = ((nak2 - nak1) % 27 + 27) % 27;
  const tara2 = (diff2 % 9) + 1;

  const auspicious = [1, 2, 4, 6, 8, 9];
  const t1ok = auspicious.includes(tara);
  const t2ok = auspicious.includes(tara2);

  if (t1ok && t2ok) return 3;
  if (t1ok || t2ok) return 1.5;
  return 0;
}

function calcYoni(nak1: number, nak2: number): number {
  const y1 = YONI_ANIMAL[(nak1 - 1) % 27];
  const y2 = YONI_ANIMAL[(nak2 - 1) % 27];
  return YONI_COMPAT[`${y1}_${y2}`] || 2;
}

function calcGrahaMaitri(rashi1: number, rashi2: number): number {
  const lord1 = SIGN_LORDS[rashi1 as 1] || 'SU';
  const lord2 = SIGN_LORDS[rashi2 as 1] || 'SU';

  if (lord1 === lord2) return 5;

  const f1 = getFriendship(lord1, lord2);
  const f2 = getFriendship(lord2, lord1);

  if (f1 === 'friend' && f2 === 'friend') return 5;
  if (f1 === 'friend' || f2 === 'friend') return 4;
  if (f1 === 'neutral' && f2 === 'neutral') return 3;
  if (f1 === 'enemy' || f2 === 'enemy') return 1;
  return 2;
}

function calcGana(nak1: number, nak2: number): number {
  const g1 = NAKSHATRA_GANA[(nak1 - 1) % 27];
  const g2 = NAKSHATRA_GANA[(nak2 - 1) % 27];

  if (g1 === g2) return 6;
  if ((g1 === 0 && g2 === 1) || (g1 === 1 && g2 === 0)) return 5;
  if ((g1 === 0 && g2 === 2) || (g1 === 2 && g2 === 0)) return 1;
  if ((g1 === 1 && g2 === 2) || (g1 === 2 && g2 === 1)) return 0;
  return 3;
}

function calcBhakoot(rashi1: number, rashi2: number): number {
  const diff = ((rashi2 - rashi1) % 12 + 12) % 12;
  // Inauspicious: 2/12, 5/9, 6/8 axis
  const bad = [1, 4, 5, 7, 8, 11]; // 0-indexed differences for 2/12, 5/9, 6/8
  if (bad.includes(diff)) return 0;
  return 7;
}

function calcNadi(nak1: number, nak2: number): number {
  const n1 = NAKSHATRA_NADI[(nak1 - 1) % 27];
  const n2 = NAKSHATRA_NADI[(nak2 - 1) % 27];
  // Same nadi = 0 (worst for health/progeny), different = 8
  return n1 === n2 ? 0 : 8;
}

// ─── Mangal Dosha Check ───

function checkMangalDosha(marsRashi: number, lagnaRashi: number): boolean {
  // Mars in 1st, 2nd, 4th, 7th, 8th, or 12th house from Lagna
  const house = ((marsRashi - lagnaRashi) % 12 + 12) % 12 + 1;
  return [1, 2, 4, 7, 8, 12].includes(house);
}

// ─── Main Milan Function ───

export function calculateKundaliMilan(
  groomMoonLon: number,
  brideMoonLon: number,
  groomLagnaRashi: number,
  brideLagnaRashi: number,
  groomMarsRashi: number,
  brideMarsRashi: number,
): MilanResult {
  const gNak = getNakshatraFromLongitude(groomMoonLon);
  const bNak = getNakshatraFromLongitude(brideMoonLon);
  const gRashi = getRashiFromLongitude(groomMoonLon);
  const bRashi = getRashiFromLongitude(brideMoonLon);

  const kootas: KootaScore[] = [
    {
      name: { en: 'Varna (वर्ण)', ne: 'वर्ण' },
      maxPoints: 1,
      scored: calcVarna(gNak.nakshatra, bNak.nakshatra),
      description: { en: 'Spiritual compatibility & ego harmony', ne: 'आध्यात्मिक अनुकूलता' },
    },
    {
      name: { en: 'Vashya (वश्य)', ne: 'वश्य' },
      maxPoints: 2,
      scored: calcVashya(gRashi, bRashi),
      description: { en: 'Dominance & mutual control', ne: 'वशीकरण अनुकूलता' },
    },
    {
      name: { en: 'Tara (तारा)', ne: 'तारा' },
      maxPoints: 3,
      scored: calcTara(gNak.nakshatra, bNak.nakshatra),
      description: { en: 'Destiny & luck compatibility', ne: 'भाग्य अनुकूलता' },
    },
    {
      name: { en: 'Yoni (योनि)', ne: 'योनि' },
      maxPoints: 4,
      scored: calcYoni(gNak.nakshatra, bNak.nakshatra),
      description: { en: 'Physical & sexual compatibility', ne: 'शारीरिक अनुकूलता' },
    },
    {
      name: { en: 'Graha Maitri (ग्रहमैत्री)', ne: 'ग्रहमैत्री' },
      maxPoints: 5,
      scored: calcGrahaMaitri(gRashi, bRashi),
      description: { en: 'Mental & intellectual compatibility', ne: 'मानसिक अनुकूलता' },
    },
    {
      name: { en: 'Gana (गण)', ne: 'गण' },
      maxPoints: 6,
      scored: calcGana(gNak.nakshatra, bNak.nakshatra),
      description: { en: 'Temperament & nature compatibility', ne: 'स्वभाव अनुकूलता' },
    },
    {
      name: { en: 'Bhakoot (भकूट)', ne: 'भकूट' },
      maxPoints: 7,
      scored: calcBhakoot(gRashi, bRashi),
      description: { en: 'Love, family happiness & prosperity', ne: 'प्रेम र परिवार सुख' },
    },
    {
      name: { en: 'Nadi (नाडी)', ne: 'नाडी' },
      maxPoints: 8,
      scored: calcNadi(gNak.nakshatra, bNak.nakshatra),
      description: { en: 'Health & progeny compatibility', ne: 'स्वास्थ्य र सन्तान अनुकूलता' },
    },
  ];

  const totalScore = kootas.reduce((sum, k) => sum + k.scored, 0);
  const percentage = Math.round((totalScore / 36) * 100);

  let verdict: { en: string; ne: string };
  if (totalScore >= 25) {
    verdict = { en: 'Excellent match — highly recommended', ne: 'उत्तम मिलान — अत्यन्त उपयुक्त' };
  } else if (totalScore >= 18) {
    verdict = { en: 'Good match — acceptable for marriage', ne: 'राम्रो मिलान — विवाह योग्य' };
  } else if (totalScore >= 12) {
    verdict = { en: 'Average match — proceed with remedies', ne: 'औसत मिलान — उपाय सहित अगाडि बढ्नुहोस्' };
  } else {
    verdict = { en: 'Poor match — not recommended', ne: 'कमजोर मिलान — सिफारिश गरिँदैन' };
  }

  return {
    kootas,
    totalScore,
    maxScore: 36,
    percentage,
    verdict,
    mangalDosha: {
      groom: checkMangalDosha(groomMarsRashi, groomLagnaRashi),
      bride: checkMangalDosha(brideMarsRashi, brideLagnaRashi),
    },
  };
}

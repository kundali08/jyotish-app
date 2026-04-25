/**
 * Shadbala Calculator — BPHS Ch. 27-28
 * Six-fold strength of planets:
 *   1. Sthana Bala (Positional)
 *   2. Dig Bala (Directional)
 *   3. Kala Bala (Temporal)
 *   4. Cheshta Bala (Motional)
 *   5. Naisargika Bala (Natural)
 *   6. Drik Bala (Aspectual)
 *
 * All values in Shashtiamshas (1 Rupa = 60 Shashtiamshas)
 */

import { GrahaId, GrahaPosition, RashiNumber, GrahaShadbala } from '../types/graha';
import { GRAHAS, ALL_GRAHAS } from '../constants/grahas';
import { getRashiFromLongitude, getDegreeInSign } from '../constants/rashis';
import { LagnaData, BhavaData } from '../types/chart';

// ─── STHANA BALA (Positional Strength) ───

/**
 * Uchcha Bala — Exaltation strength
 * Max 60 when planet is at exact exaltation degree, 0 at debilitation
 */
function calcUchchaBala(graha: GrahaPosition): number {
  const grahaDef = GRAHAS[graha.id];
  const exaltDeg = (grahaDef.exaltationSign - 1) * 30 + grahaDef.exaltationDegree;
  const diff = Math.abs(graha.longitude - exaltDeg);
  const angDist = Math.min(diff, 360 - diff);
  // Max at 0° distance (exaltation), min at 180° (debilitation)
  return (180 - angDist) / 3; // 0-60 range
}

/**
 * Saptavargaja Bala — Strength from 7 divisional charts
 * Planet in own/moolatrikona/exaltation in vargas gets points
 */
function calcSaptavargajaBala(graha: GrahaPosition): number {
  // Simplified: use D-1 dignity as proxy
  const dignityScores: Record<string, number> = {
    'exalted': 20, 'moolatrikona': 15, 'own': 12,
    'friend': 8, 'neutral': 5, 'enemy': 2, 'debilitated': 0,
  };
  return (dignityScores[graha.dignity] || 5) * 2.5; // Scale to ~50 max
}

/**
 * Ojha-Yugma Bala — Odd/Even sign and navamsha strength
 * Moon, Venus in even signs; others in odd signs = strong
 */
function calcOjhaYugmaBala(graha: GrahaPosition): number {
  const isEvenSign = graha.rashi % 2 === 0;
  const femininePlanets: GrahaId[] = ['MO', 'VE'];
  const isFeminine = femininePlanets.includes(graha.id);

  if (isFeminine && isEvenSign) return 15;
  if (!isFeminine && !isEvenSign) return 15;
  return 0;
}

/**
 * Kendra Bala — Angular house strength
 * Kendra (1,4,7,10)=60, Panaphara (2,5,8,11)=30, Apoklima (3,6,9,12)=15
 */
function calcKendraBala(graha: GrahaPosition, lagnaLon: number): number {
  const diff = ((graha.longitude - lagnaLon) % 360 + 360) % 360;
  const bhava = Math.floor(diff / 30) + 1;
  if ([1, 4, 7, 10].includes(bhava)) return 60;
  if ([2, 5, 8, 11].includes(bhava)) return 30;
  return 15;
}

/**
 * Drekkana Bala — Decanate strength
 * Male in 1st decanate, neutral in 2nd, female in 3rd = strong
 */
function calcDrekkanaBala(graha: GrahaPosition): number {
  const degInSign = getDegreeInSign(graha.longitude);
  const decanate = Math.floor(degInSign / 10) + 1;

  const grahaDef = GRAHAS[graha.id];
  const isMale = ['SU', 'MA', 'JU'].includes(graha.id);
  const isFemale = ['MO', 'VE'].includes(graha.id);

  if (isMale && decanate === 1) return 15;
  if (isFemale && decanate === 3) return 15;
  if (!isMale && !isFemale && decanate === 2) return 15; // Mercury, Saturn = neutral
  return 0;
}

function calcSthanaBala(graha: GrahaPosition, lagnaLon: number): {
  uchcha: number; saptavargaja: number; ojhaYugma: number;
  kendra: number; drekkana: number; total: number;
} {
  const uchcha = calcUchchaBala(graha);
  const saptavargaja = calcSaptavargajaBala(graha);
  const ojhaYugma = calcOjhaYugmaBala(graha);
  const kendra = calcKendraBala(graha, lagnaLon);
  const drekkana = calcDrekkanaBala(graha);
  return { uchcha, saptavargaja, ojhaYugma, kendra, drekkana, total: uchcha + saptavargaja + ojhaYugma + kendra + drekkana };
}

// ─── DIG BALA (Directional Strength) ───

/**
 * Dig Bala — Based on house position
 * Jupiter/Mercury strongest in Lagna (East)
 * Sun/Mars strongest in 10th (South/Midheaven)
 * Saturn in 7th (West)
 * Moon/Venus in 4th (North/IC)
 */
function calcDigBala(graha: GrahaPosition, lagnaLon: number): number {
  const diff = ((graha.longitude - lagnaLon) % 360 + 360) % 360;

  // Strongest house (as degree offset from lagna)
  const strongestOffset: Record<string, number> = {
    'SU': 270, 'MO': 90, 'MA': 270, 'ME': 0,
    'JU': 0, 'VE': 90, 'SA': 180, 'RA': 0, 'KE': 0,
  };

  const target = strongestOffset[graha.id] || 0;
  const angDist = Math.min(Math.abs(diff - target), 360 - Math.abs(diff - target));
  return (180 - angDist) / 3; // 0-60 range
}

// ─── KALA BALA (Temporal Strength) ───

/**
 * Kala Bala — Simplified
 * Includes Nathonnatha (day/night), Paksha, Tribhaga, Varsha, Masa, Vara, Hora
 * Simplified to key components
 */
function calcKalaBala(graha: GrahaPosition, birthHour: number, dayOfWeek: number, tithiNum: number): number {
  let bala = 0;

  // Nathonnatha Bala: Diurnal planets strong during day, nocturnal at night
  const isDayTime = birthHour >= 6 && birthHour < 18;
  const diurnal: GrahaId[] = ['SU', 'JU', 'VE'];
  const nocturnal: GrahaId[] = ['MO', 'MA', 'SA'];
  if (diurnal.includes(graha.id) && isDayTime) bala += 30;
  else if (nocturnal.includes(graha.id) && !isDayTime) bala += 30;
  else bala += 15; // ME is always moderate

  // Paksha Bala: Benefics strong in Shukla Paksha, malefics in Krishna
  const isShukla = tithiNum <= 15;
  const benefics: GrahaId[] = ['JU', 'VE', 'MO', 'ME'];
  if (benefics.includes(graha.id) && isShukla) bala += 20;
  else if (!benefics.includes(graha.id) && !isShukla) bala += 20;
  else bala += 10;

  // Vara Bala: Lord of the day gets extra
  const varaLords: GrahaId[] = ['SU', 'MO', 'MA', 'ME', 'JU', 'VE', 'SA'];
  if (varaLords[dayOfWeek] === graha.id) bala += 15;

  return bala;
}

// ─── CHESHTA BALA (Motional Strength) ───

/**
 * Cheshta Bala — Based on planet's speed
 * Retrograde planets get high cheshta bala
 * Fast-moving planets get moderate
 * Stationary = maximum
 */
function calcCheshtaBala(graha: GrahaPosition): number {
  if (graha.id === 'SU' || graha.id === 'MO') return 30; // Sun/Moon don't retrograde

  if (graha.isRetrograde) return 60;  // Retrograde = strongest

  // Normal speed: moderate
  const absSpeed = Math.abs(graha.speed);
  if (absSpeed < 0.1) return 45; // Nearly stationary
  return 30;
}

// ─── NAISARGIKA BALA (Natural Strength) ───

/**
 * Naisargika Bala — Fixed natural strength
 * Sun > Moon > Venus > Jupiter > Mercury > Mars > Saturn
 */
const NAISARGIKA_BALA: Record<string, number> = {
  'SU': 60, 'MO': 51.43, 'VE': 42.86, 'JU': 34.29,
  'ME': 25.71, 'MA': 17.14, 'SA': 8.57, 'RA': 12, 'KE': 10,
};

// ─── DRIK BALA (Aspectual Strength) ───

/**
 * Drik Bala — Strength from aspects
 * Benefic aspects add, malefic aspects subtract
 */
function calcDrikBala(graha: GrahaPosition, allGrahas: GrahaPosition[]): number {
  let bala = 0;
  const benefics: GrahaId[] = ['JU', 'VE', 'MO', 'ME'];

  for (const other of allGrahas) {
    if (other.id === graha.id) continue;

    const diff = Math.abs(graha.longitude - other.longitude);
    const angDist = Math.min(diff, 360 - diff);

    // Check standard aspects (approximately)
    const isAspecting = (
      (angDist >= 55 && angDist <= 65) ||   // sextile ~60°
      (angDist >= 85 && angDist <= 95) ||   // square ~90°
      (angDist >= 115 && angDist <= 125) || // trine ~120°
      (angDist >= 175 && angDist <= 185)    // opposition ~180°
    );

    if (isAspecting) {
      if (benefics.includes(other.id)) bala += 7.5;
      else bala -= 5;
    }
  }

  return Math.max(0, Math.min(60, bala + 30)); // Normalize to 0-60
}

// ─── REQUIRED MINIMUM STRENGTHS ───
// BPHS specifies minimum required Shadbala (in Rupas = total/60)
const REQUIRED_STRENGTHS: Record<string, number> = {
  'SU': 6.5, 'MO': 6.0, 'MA': 5.0, 'ME': 7.0,
  'JU': 6.5, 'VE': 5.5, 'SA': 5.0, 'RA': 4.0, 'KE': 4.0,
};

// ─── MAIN CALCULATOR ───

/**
 * Calculate Shadbala for all grahas
 */
export function calculateShadbala(
  grahas: GrahaPosition[],
  lagnaLon: number,
  birthHour: number,
  dayOfWeek: number,
  tithiNum: number
): GrahaShadbala[] {
  return grahas.map(graha => {
    const sthanaBala = calcSthanaBala(graha, lagnaLon);
    const digBala = calcDigBala(graha, lagnaLon);
    const kalaBala = calcKalaBala(graha, birthHour, dayOfWeek, tithiNum);
    const cheshtaBala = calcCheshtaBala(graha);
    const naisargikaBala = NAISARGIKA_BALA[graha.id] || 20;
    const drikBala = calcDrikBala(graha, grahas);

    const totalShashtiamsha = sthanaBala.total + digBala + kalaBala + cheshtaBala + naisargikaBala + drikBala;
    const totalRupa = totalShashtiamsha / 60;
    const required = REQUIRED_STRENGTHS[graha.id] || 5;
    const ratio = totalRupa / required;

    return {
      grahaId: graha.id,
      sthanaBala: sthanaBala.total,
      digBala,
      kalaBala,
      cheshtaBala,
      naisargikaBala,
      drikBala,
      totalShashtiamsha,
      totalRupa,
      requiredRupa: required,
      ratio,
      isStrong: ratio >= 1.0,
      rank: 0, // Will be set after sorting
    };
  }).sort((a, b) => b.totalShashtiamsha - a.totalShashtiamsha)
    .map((item, idx) => ({ ...item, rank: idx + 1 }));
}

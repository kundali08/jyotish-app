/**
 * Vimshottari Dasha Calculator — BPHS Ch. 46
 * 120-year cycle based on Moon's nakshatra at birth
 * Supports up to 5 levels: Maha → Antar → Pratyanta → Sukshma → Prana
 */

import { GrahaId } from '../types/graha';
import { DashaPeriod, DashaSystem } from '../types/dasha';
import { getNakshatraFromLongitude, getNakshatraLord, NAKSHATRA_SPAN } from '../constants/nakshatras';
import { GRAHAS } from '../constants/grahas';

// Vimshottari Dasha sequence and year durations
const DASHA_SEQUENCE: GrahaId[] = ['KE', 'VE', 'SU', 'MO', 'MA', 'RA', 'JU', 'SA', 'ME'];
const DASHA_YEARS: number[] =     [7,    20,   6,    10,   7,    18,   16,   19,   17 ];
const TOTAL_YEARS = 120;

/**
 * Get the starting index of dasha lord from nakshatra lord
 */
function getDashaStartIndex(nakshatraLord: GrahaId): number {
  return DASHA_SEQUENCE.indexOf(nakshatraLord);
}

/**
 * Calculate balance of Maha Dasha at birth
 * Based on Moon's position within the nakshatra
 */
function calculateDashaBalance(moonLongitude: number): {
  startLord: GrahaId;
  balanceYears: number;
  elapsedFraction: number;
} {
  const { nakshatra } = getNakshatraFromLongitude(moonLongitude);
  const nakshatraLord = getNakshatraLord(nakshatra);
  const startIndex = getDashaStartIndex(nakshatraLord);

  // Position within nakshatra (0 to 1)
  const nakshatraStart = (nakshatra - 1) * NAKSHATRA_SPAN;
  const posInNakshatra = moonLongitude - nakshatraStart;
  const elapsedFraction = posInNakshatra / NAKSHATRA_SPAN;

  // Remaining portion of first dasha
  const totalYearsOfLord = DASHA_YEARS[startIndex];
  const balanceYears = totalYearsOfLord * (1 - elapsedFraction);

  return { startLord: nakshatraLord, balanceYears, elapsedFraction };
}

/**
 * Add years (decimal) to a Date
 */
function addYearsToDate(date: Date, years: number): Date {
  const ms = years * 365.25 * 24 * 3600 * 1000;
  return new Date(date.getTime() + ms);
}

/**
 * Format date as YYYY-MM-DD
 */
function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Calculate sub-periods recursively
 */
function calculateSubPeriods(
  parentLord: GrahaId,
  startDate: Date,
  totalYears: number,
  level: number,
  maxLevel: number
): DashaPeriod[] {
  if (level > maxLevel) return [];

  const periods: DashaPeriod[] = [];
  const startIdx = DASHA_SEQUENCE.indexOf(parentLord);
  let currentDate = new Date(startDate);

  for (let i = 0; i < 9; i++) {
    const idx = (startIdx + i) % 9;
    const lord = DASHA_SEQUENCE[idx];
    const proportion = DASHA_YEARS[idx] / TOTAL_YEARS;
    const periodYears = totalYears * proportion;
    const endDate = addYearsToDate(currentDate, periodYears);

    const levelNames: Record<number, { en: string; ne: string }> = {
      1: { en: 'Maha Dasha', ne: 'महादशा' },
      2: { en: 'Antar Dasha', ne: 'अन्तर्दशा' },
      3: { en: 'Pratyanta Dasha', ne: 'प्रत्यन्तर दशा' },
      4: { en: 'Sukshma Dasha', ne: 'सूक्ष्म दशा' },
      5: { en: 'Prana Dasha', ne: 'प्राण दशा' },
    };

    const graha = GRAHAS[lord];
    const period: DashaPeriod = {
      lord,
      lordName: graha.name,
      level,
      levelName: levelNames[level] || { en: `Level ${level}`, ne: `स्तर ${level}` },
      startDate: formatDate(currentDate),
      endDate: formatDate(endDate),
      durationYears: periodYears,
      durationDays: periodYears * 365.25,
      subPeriods: level < maxLevel
        ? calculateSubPeriods(lord, currentDate, periodYears, level + 1, maxLevel)
        : [],
    };

    periods.push(period);
    currentDate = endDate;
  }

  return periods;
}

/**
 * Calculate complete Vimshottari Maha Dasha system
 * @param moonLongitude - Sidereal longitude of Moon
 * @param birthDate - Birth date
 * @param maxLevel - Maximum depth (1-5, default 3 for Pratyanta)
 */
export function calculateVimshottariDasha(
  moonLongitude: number,
  birthDate: Date,
  maxLevel: number = 3
): DashaSystem {
  const { startLord, balanceYears, elapsedFraction } = calculateDashaBalance(moonLongitude);
  const startIdx = getDashaStartIndex(startLord);

  const periods: DashaPeriod[] = [];
  let currentDate = new Date(birthDate);

  // First Maha Dasha (balance only)
  {
    const lord = startLord;
    const endDate = addYearsToDate(currentDate, balanceYears);
    const graha = GRAHAS[lord];

    periods.push({
      lord,
      lordName: graha.name,
      level: 1,
      levelName: { en: 'Maha Dasha', ne: 'महादशा' },
      startDate: formatDate(currentDate),
      endDate: formatDate(endDate),
      durationYears: balanceYears,
      durationDays: balanceYears * 365.25,
      subPeriods: maxLevel > 1
        ? calculateSubPeriods(lord, currentDate, balanceYears, 2, maxLevel)
        : [],
    });
    currentDate = endDate;
  }

  // Remaining 8 Maha Dashas (full duration)
  for (let i = 1; i < 9; i++) {
    const idx = (startIdx + i) % 9;
    const lord = DASHA_SEQUENCE[idx];
    const years = DASHA_YEARS[idx];
    const endDate = addYearsToDate(currentDate, years);
    const graha = GRAHAS[lord];

    periods.push({
      lord,
      lordName: graha.name,
      level: 1,
      levelName: { en: 'Maha Dasha', ne: 'महादशा' },
      startDate: formatDate(currentDate),
      endDate: formatDate(endDate),
      durationYears: years,
      durationDays: years * 365.25,
      subPeriods: maxLevel > 1
        ? calculateSubPeriods(lord, currentDate, years, 2, maxLevel)
        : [],
    });
    currentDate = endDate;
  }

  return {
    system: 'vimshottari',
    systemName: { en: 'Vimshottari Dasha (120 years)', ne: 'विंशोत्तरी दशा (१२० वर्ष)' },
    totalYears: TOTAL_YEARS,
    startingLord: startLord,
    balanceAtBirth: balanceYears,
    periods,
  };
}

/**
 * Find the currently running dasha at a given date
 */
export function findCurrentDasha(
  periods: DashaPeriod[],
  date: Date
): { maha?: DashaPeriod; antar?: DashaPeriod; pratyanta?: DashaPeriod } {
  const dateStr = formatDate(date);

  for (const maha of periods) {
    if (dateStr >= maha.startDate && dateStr < maha.endDate) {
      const result: { maha?: DashaPeriod; antar?: DashaPeriod; pratyanta?: DashaPeriod } = { maha };

      for (const antar of maha.subPeriods || []) {
        if (dateStr >= antar.startDate && dateStr < antar.endDate) {
          result.antar = antar;

          for (const praty of antar.subPeriods || []) {
            if (dateStr >= praty.startDate && dateStr < praty.endDate) {
              result.pratyanta = praty;
              break;
            }
          }
          break;
        }
      }
      return result;
    }
  }
  return {};
}

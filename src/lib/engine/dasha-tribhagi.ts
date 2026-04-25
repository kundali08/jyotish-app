/**
 * Tribhagi Dasha Calculator
 * 40-year cycle based on Moon's nakshatra at birth
 * Same as Vimshottari, but every period is exactly 1/3 of its Vimshottari duration.
 */

import { GrahaId } from '../types/graha';
import { DashaPeriod, DashaSystem } from '../types/dasha';
import { getNakshatraFromLongitude, getNakshatraLord, NAKSHATRA_SPAN } from '../constants/nakshatras';
import { GRAHAS } from '../constants/grahas';

// Vimshottari Dasha sequence and year durations
const DASHA_SEQUENCE: GrahaId[] = ['KE', 'VE', 'SU', 'MO', 'MA', 'RA', 'JU', 'SA', 'ME'];
const DASHA_YEARS_VIMSHOTTARI: number[] = [7, 20, 6, 10, 7, 18, 16, 19, 17];
const TOTAL_YEARS_VIMSHOTTARI = 120;

const DASHA_YEARS = DASHA_YEARS_VIMSHOTTARI.map(y => y / 3);
const TOTAL_YEARS = 40;

function getDashaStartIndex(nakshatraLord: GrahaId): number {
  return DASHA_SEQUENCE.indexOf(nakshatraLord);
}

function calculateDashaBalance(moonLongitude: number): {
  startLord: GrahaId;
  balanceYears: number;
  elapsedFraction: number;
} {
  const { nakshatra } = getNakshatraFromLongitude(moonLongitude);
  const nakshatraLord = getNakshatraLord(nakshatra);
  const startIndex = getDashaStartIndex(nakshatraLord);

  const nakshatraStart = (nakshatra - 1) * NAKSHATRA_SPAN;
  const posInNakshatra = moonLongitude - nakshatraStart;
  const elapsedFraction = posInNakshatra / NAKSHATRA_SPAN;

  const totalYearsOfLord = DASHA_YEARS[startIndex];
  const balanceYears = totalYearsOfLord * (1 - elapsedFraction);

  return { startLord: nakshatraLord, balanceYears, elapsedFraction };
}

function addYearsToDate(date: Date, years: number): Date {
  const ms = years * 365.25 * 24 * 3600 * 1000;
  return new Date(date.getTime() + ms);
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

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

export function calculateTribhagiDasha(
  moonLongitude: number,
  birthDate: Date,
  maxLevel: number = 3
): DashaSystem {
  const { startLord, balanceYears } = calculateDashaBalance(moonLongitude);
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

  // Generate 2 full cycles to roughly cover an average human lifespan (40 + 40 = 80 years)
  for (let cycle = 0; cycle < 3; cycle++) {
    for (let i = (cycle === 0 ? 1 : 0); i < 9; i++) {
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
  }

  return {
    system: 'tribhagi',
    systemName: { en: 'Tribhagi Dasha (40 years)', ne: 'त्रिभागी दशा (४० वर्ष)' },
    totalYears: TOTAL_YEARS,
    startingLord: startLord,
    balanceAtBirth: balanceYears,
    periods,
  };
}

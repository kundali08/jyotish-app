/**
 * Yogini Dasha Calculator
 * Cycle: 36 Years
 */

import { DashaPeriod, DashaSystem } from '../types/dasha';
import { GrahaId } from '../types/graha';
import { getNakshatraFromLongitude } from '../constants/nakshatras';

const YOGINI_LORDS: Array<{
  id: number;
  yogini: string;
  yoginiNe: string;
  lord: GrahaId;
  years: number;
}> = [
  { id: 1, yogini: 'Mangala', yoginiNe: 'मङ्गला', lord: 'MO', years: 1 },
  { id: 2, yogini: 'Pingala', yoginiNe: 'पिङ्गला', lord: 'SU', years: 2 },
  { id: 3, yogini: 'Dhanya', yoginiNe: 'धान्या', lord: 'JU', years: 3 },
  { id: 4, yogini: 'Bhramari', yoginiNe: 'भ्रामरी', lord: 'MA', years: 4 },
  { id: 5, yogini: 'Bhadrika', yoginiNe: 'भद्रिका', lord: 'ME', years: 5 },
  { id: 6, yogini: 'Ulka', yoginiNe: 'उल्का', lord: 'SA', years: 6 },
  { id: 7, yogini: 'Siddha', yoginiNe: 'सिद्धा', lord: 'VE', years: 7 },
  { id: 8, yogini: 'Sankata', yoginiNe: 'सङ्कटा', lord: 'RA', years: 8 },
];

const TOTAL_YEARS = 36;
const DAYS_IN_YEAR = 365.2425;

export function calculateYoginiDasha(
  moonLongitude: number,
  birthDate: Date,
  maxLevels: number = 3
): DashaSystem {
  const { nakshatra } = getNakshatraFromLongitude(moonLongitude);
  
  // Calculate exact position within the nakshatra
  const NAKSHATRA_SPAN = 360 / 27; // 13.333333°
  const degreeInNakshatra = moonLongitude % NAKSHATRA_SPAN;
  const fractionLeft = 1 - (degreeInNakshatra / NAKSHATRA_SPAN);
  
  // Calculate starting Yogini (Nakshatra number 1-27)
  let startIndex = (nakshatra + 3) % 8;
  if (startIndex === 0) startIndex = 8;
  
  // Array index is 0-based
  startIndex -= 1;

  const startingYogini = YOGINI_LORDS[startIndex];
  
  // Calculate balance at birth
  const balanceYears = startingYogini.years * fractionLeft;
  const balanceDays = balanceYears * DAYS_IN_YEAR;
  
  let currentStartDate = new Date(birthDate.getTime());
  const periods: DashaPeriod[] = [];

  // Generate 1 full cycle of 36 years (8 periods)
  // Or enough cycles to cover ~100 years. Let's do 3 cycles (108 years).
  let currentIndex = startIndex;
  let remainingFirstPeriodYears = balanceYears;

  for (let cycle = 0; cycle < 3; cycle++) {
    for (let i = 0; i < 8; i++) {
      if (cycle === 0 && i === 0) {
        // First period uses balance
        const endDate = new Date(currentStartDate.getTime() + balanceDays * 24 * 60 * 60 * 1000);
        periods.push({
          lord: startingYogini.lord,
          lordName: { 
            en: startingYogini.yogini, 
            ne: startingYogini.yoginiNe
          },
          startDate: currentStartDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          durationDays: balanceDays,
          durationYears: balanceYears,
          level: 1,
          levelName: { en: 'Maha', ne: 'महा' },
          subPeriods: maxLevels >= 2 ? calculateSubPeriods(
            startingYogini, balanceYears, currentStartDate, maxLevels - 1, startIndex, true
          ) : []
        });
        currentStartDate = endDate;
        currentIndex = (currentIndex + 1) % 8;
        continue;
      }

      const yogini = YOGINI_LORDS[currentIndex];
      const durationDays = yogini.years * DAYS_IN_YEAR;
      const endDate = new Date(currentStartDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

      periods.push({
        lord: yogini.lord,
        lordName: { 
          en: yogini.yogini, 
          ne: yogini.yoginiNe
        },
        startDate: currentStartDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        durationDays: durationDays,
        durationYears: yogini.years,
        level: 1,
        levelName: { en: 'Maha', ne: 'महा' },
        subPeriods: maxLevels >= 2 ? calculateSubPeriods(
          yogini, yogini.years, currentStartDate, maxLevels - 1, currentIndex, false
        ) : []
      });

      currentStartDate = endDate;
      currentIndex = (currentIndex + 1) % 8;
    }
  }

  return {
    system: 'yogini',
    systemName: { en: 'Yogini Dasha', ne: 'योगिनी दशा' },
    totalYears: TOTAL_YEARS,
    startingLord: startingYogini.lord,
    balanceAtBirth: balanceYears,
    periods
  };
}

function calculateSubPeriods(
  parentYogini: typeof YOGINI_LORDS[0],
  parentDurationYears: number,
  parentStartDate: Date,
  levelsRemaining: number,
  startIndex: number,
  isPartialStart: boolean
): DashaPeriod[] {
  if (levelsRemaining <= 0) return [];

  const subPeriods: DashaPeriod[] = [];
  let currentStartDate = new Date(parentStartDate.getTime());
  
  // If it's a partial start (birth dasha), the subperiods shouldn't be full cycle.
  // Actually, standard practice for balance at birth is to proportion ALL subperiods, 
  // OR to skip the past subperiods and only show the remaining ones.
  // For simplicity and common practice, we'll proportion the remaining duration
  // over the 8 sub-lords starting from the parent lord.
  
  let currentIndex = startIndex;
  
  // Standard full cycle duration
  const totalParentYears = parentYogini.years;

  for (let i = 0; i < 8; i++) {
    const subYogini = YOGINI_LORDS[currentIndex];
    
    // Antar formula: (Maha Years * Antar Years) / 36
    // If partial, we just distribute the partial years using the same ratio
    const ratio = subYogini.years / TOTAL_YEARS;
    const durationYears = parentDurationYears * ratio;
    const durationDays = durationYears * DAYS_IN_YEAR;

    const endDate = new Date(currentStartDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

    const levelNum = 3 - levelsRemaining + 1; // 2 for Antar, 3 for Pratyanta
    const levelNames = [
      { en: 'Maha', ne: 'महा' },
      { en: 'Antar', ne: 'अन्तर' },
      { en: 'Pratyanta', ne: 'प्रत्यन्तर' }
    ];

    subPeriods.push({
      lord: subYogini.lord,
      lordName: { 
        en: subYogini.yogini, 
        ne: subYogini.yoginiNe
      },
      startDate: currentStartDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      durationDays,
      durationYears,
      level: levelNum,
      levelName: levelNames[levelNum - 1],
      subPeriods: levelsRemaining > 1 ? calculateSubPeriods(
        subYogini, durationYears, currentStartDate, levelsRemaining - 1, currentIndex, isPartialStart
      ) : []
    });

    currentStartDate = endDate;
    currentIndex = (currentIndex + 1) % 8;
  }

  return subPeriods;
}

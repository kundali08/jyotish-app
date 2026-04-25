/**
 * Gochara (गोचर) — Transit Analysis Engine
 * BPHS Ch. 64-65: Transit of Planets
 *
 * Evaluates current planetary positions relative to natal Moon sign.
 * Uses Vedha (obstruction) points and Ashtakavarga bindu scores.
 */

import { GrahaId, GrahaPosition, RashiNumber } from '../types/graha';
import { SIGN_LORDS } from '../constants/grahas';
import { getRashiFromLongitude, getDegreeInSign } from '../constants/rashis';
import { getNakshatraFromLongitude } from '../constants/nakshatras';
import { calcPlanetPosition, dateToJulianDay, setAyanamsha, PLANET_CODES, AyanamshaType } from './swisseph-init';

// ─── Types ───

export interface TransitPlanet {
  id: GrahaId;
  longitude: number;
  rashi: RashiNumber;
  degreeInSign: number;
  nakshatra: number;
  pada: number;
  isRetrograde: boolean;
  houseFromMoon: number;  // 1-12 from natal Moon
  transitQuality: 'benefic' | 'malefic' | 'neutral';
  vedha: boolean;         // true if obstructed by vedha
  description: { en: string; ne: string };
}

export interface GocharaResult {
  date: string;
  transitPlanets: TransitPlanet[];
  overallScore: number;    // 0-100
  summary: { en: string; ne: string };
}

// ─── Transit Quality Tables ───

// Houses where each planet gives good results from Moon sign
const BENEFIC_HOUSES: Record<GrahaId, number[]> = {
  SU: [3, 6, 10, 11],
  MO: [1, 3, 6, 7, 10, 11],
  MA: [3, 6, 11],
  ME: [2, 4, 6, 8, 10, 11],
  JU: [2, 5, 7, 9, 11],
  VE: [1, 2, 3, 4, 5, 8, 9, 11, 12],
  SA: [3, 6, 11],
  RA: [3, 6, 10, 11],
  KE: [3, 6, 11],
};

// Vedha points: each benefic house has a vedha house that blocks its good effect
const VEDHA_PAIRS: Record<GrahaId, Record<number, number>> = {
  SU: { 3: 9, 6: 12, 10: 4, 11: 5 },
  MO: { 1: 5, 3: 9, 6: 12, 7: 2, 10: 4, 11: 8 },
  MA: { 3: 12, 6: 9, 11: 5 },
  ME: { 2: 5, 4: 3, 6: 9, 8: 1, 10: 7, 11: 12 },
  JU: { 2: 12, 5: 4, 7: 3, 9: 10, 11: 8 },
  VE: { 1: 8, 2: 7, 3: 1, 4: 10, 5: 9, 8: 5, 9: 11, 11: 6, 12: 3 },
  SA: { 3: 12, 6: 9, 11: 5 },
  RA: { 3: 12, 6: 9, 10: 4, 11: 5 },
  KE: { 3: 12, 6: 9, 11: 5 },
};

// Transit descriptions per house
const TRANSIT_DESC: Record<number, { en: string; ne: string }> = {
  1:  { en: 'Self, health, personality', ne: 'आत्म, स्वास्थ्य, व्यक्तित्व' },
  2:  { en: 'Wealth, family, speech', ne: 'धन, परिवार, वाणी' },
  3:  { en: 'Courage, siblings, travel', ne: 'साहस, भाइबहिनी, यात्रा' },
  4:  { en: 'Home, mother, happiness', ne: 'गृह, मातृ, सुख' },
  5:  { en: 'Children, education, intellect', ne: 'सन्तान, शिक्षा, बुद्धि' },
  6:  { en: 'Enemies, health issues, debt', ne: 'शत्रु, रोग, ऋण' },
  7:  { en: 'Spouse, partnerships', ne: 'जीवनसाथी, साझेदारी' },
  8:  { en: 'Obstacles, transformation', ne: 'बाधा, परिवर्तन' },
  9:  { en: 'Fortune, dharma, guru', ne: 'भाग्य, धर्म, गुरु' },
  10: { en: 'Career, reputation, authority', ne: 'कर्म, प्रतिष्ठा, अधिकार' },
  11: { en: 'Gains, income, fulfillment', ne: 'लाभ, आय, सिद्धि' },
  12: { en: 'Loss, expenses, liberation', ne: 'हानि, खर्च, मोक्ष' },
};

// ─── Normalize longitude ───
function normalizeLon(lon: number): number {
  return ((lon % 360) + 360) % 360;
}

// ─── Main Transit Calculation ───

export function calculateGochara(
  natalMoonLongitude: number,
  transitDate: Date,
  timezoneOffset: number = 5.75,
  ayanamsha: AyanamshaType = 'LAHIRI'
): GocharaResult {
  setAyanamsha(ayanamsha);

  const year = transitDate.getFullYear();
  const month = transitDate.getMonth() + 1;
  const day = transitDate.getDate();
  const hour = transitDate.getHours() + transitDate.getMinutes() / 60;
  const utHour = hour - timezoneOffset;

  let utDay = day;
  let utHourAdj = utHour;
  if (utHour < 0) { utHourAdj += 24; utDay -= 1; }
  else if (utHour >= 24) { utHourAdj -= 24; utDay += 1; }

  const jd = dateToJulianDay(year, month, utDay, utHourAdj);

  const natalMoonRashi = getRashiFromLongitude(natalMoonLongitude);

  // Calculate current positions for all 9 grahas
  const grahaIds: GrahaId[] = ['SU', 'MO', 'MA', 'ME', 'JU', 'VE', 'SA', 'RA', 'KE'];
  const transitPositions: { id: GrahaId; lon: number; speed: number }[] = [];

  for (const id of grahaIds) {
    if (id === 'KE') {
      const rahu = transitPositions.find(p => p.id === 'RA');
      transitPositions.push({
        id: 'KE',
        lon: normalizeLon((rahu?.lon || 0) + 180),
        speed: rahu?.speed || -0.05,
      });
    } else {
      const code = PLANET_CODES[id as keyof typeof PLANET_CODES];
      const pos = calcPlanetPosition(jd, code);
      transitPositions.push({
        id,
        lon: normalizeLon(pos.longitude),
        speed: pos.speedLong,
      });
    }
  }

  // Evaluate each transit planet
  const transitPlanets: TransitPlanet[] = [];
  let totalBenefic = 0;
  let totalCount = 0;

  for (const tp of transitPositions) {
    const rashi = getRashiFromLongitude(tp.lon) as RashiNumber;
    const degInSign = getDegreeInSign(tp.lon);
    const { nakshatra, pada } = getNakshatraFromLongitude(tp.lon);
    const isRetrograde = tp.speed < 0;

    // House from natal Moon
    const houseFromMoon = ((rashi - natalMoonRashi) % 12 + 12) % 12 + 1;

    // Check if benefic
    const beneficHouses = BENEFIC_HOUSES[tp.id] || [];
    const isBenefic = beneficHouses.includes(houseFromMoon);

    // Check vedha
    const vedhaPairs = VEDHA_PAIRS[tp.id] || {};
    let hasVedha = false;
    if (isBenefic && vedhaPairs[houseFromMoon]) {
      const vedhaHouse = vedhaPairs[houseFromMoon];
      // Check if any OTHER planet is transiting the vedha house
      for (const other of transitPositions) {
        if (other.id === tp.id) continue;
        const otherRashi = getRashiFromLongitude(other.lon);
        const otherHouse = ((otherRashi - natalMoonRashi) % 12 + 12) % 12 + 1;
        if (otherHouse === vedhaHouse) {
          hasVedha = true;
          break;
        }
      }
    }

    const transitQuality: TransitPlanet['transitQuality'] =
      isBenefic && !hasVedha ? 'benefic' :
      !isBenefic ? 'malefic' : 'neutral';

    if (transitQuality === 'benefic') totalBenefic++;
    totalCount++;

    transitPlanets.push({
      id: tp.id,
      longitude: tp.lon,
      rashi,
      degreeInSign: degInSign,
      nakshatra,
      pada,
      isRetrograde,
      houseFromMoon,
      transitQuality,
      vedha: hasVedha,
      description: TRANSIT_DESC[houseFromMoon] || { en: '', ne: '' },
    });
  }

  const overallScore = Math.round((totalBenefic / totalCount) * 100);
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  let summary: { en: string; ne: string };
  if (overallScore >= 70) {
    summary = { en: 'Highly favorable transit period', ne: 'अत्यन्त अनुकूल गोचर अवधि' };
  } else if (overallScore >= 50) {
    summary = { en: 'Moderately favorable transit period', ne: 'मध्यम अनुकूल गोचर अवधि' };
  } else if (overallScore >= 30) {
    summary = { en: 'Mixed transit period — exercise caution', ne: 'मिश्रित गोचर — सावधानी अपनाउनुहोस्' };
  } else {
    summary = { en: 'Challenging transit period — remedies advised', ne: 'चुनौतीपूर्ण गोचर — उपाय आवश्यक' };
  }

  return {
    date: dateStr,
    transitPlanets,
    overallScore,
    summary,
  };
}

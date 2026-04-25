/**
 * Graha Spashta — Planet Position Calculator
 * BPHS Ch. 3 (Rashi), Ch. 4 (Graha), Ch. 27 (Nakshatras)
 * 
 * Calculates sidereal positions for all 9 Navagrahas + Lagna
 */

import { GrahaId, GrahaPosition, RashiNumber, DMS, PadaNumber, NakshatraNumber } from '../types/graha';
import { GRAHAS, ALL_GRAHAS } from '../constants/grahas';
import { getRashiFromLongitude, getDegreeInSign } from '../constants/rashis';
import { getNakshatraFromLongitude, getNakshatraLord, NAKSHATRAS, NAKSHATRA_SPAN, PADA_SPAN } from '../constants/nakshatras';
import { calcPlanetPosition, dateToJulianDay, toDecimalHours, localToUT, setAyanamsha, PLANET_CODES, AyanamshaType } from './swisseph-init';

/**
 * Convert decimal degrees to DMS
 */
export function toDMS(totalDegrees: number): DMS {
  const d = Math.floor(totalDegrees);
  const remainder = (totalDegrees - d) * 60;
  const m = Math.floor(remainder);
  const s = Math.round((remainder - m) * 60);
  return { degrees: d, minutes: m, seconds: s, totalDegrees };
}

/**
 * Normalize longitude to 0-360
 */
function normalizeLongitude(lon: number): number {
  return ((lon % 360) + 360) % 360;
}

/**
 * Determine dignity of a planet at a given longitude
 */
function getDignity(grahaId: GrahaId, longitude: number): GrahaPosition['dignity'] {
  const graha = GRAHAS[grahaId];
  const rashi = getRashiFromLongitude(longitude) as RashiNumber;
  const degInSign = getDegreeInSign(longitude);

  // Check exaltation (exact degree gives maximum, but sign itself = exalted)
  if (rashi === graha.exaltationSign) return 'exalted';

  // Check debilitation
  if (rashi === graha.debilitationSign) return 'debilitated';

  // Check moolatrikona
  if (rashi === graha.moolatrikonaSign &&
      degInSign >= graha.moolatrikonaStart &&
      degInSign <= graha.moolatrikonaEnd) {
    return 'moolatrikona';
  }

  // Check own sign
  if (graha.ownSigns.includes(rashi)) return 'own';

  // Check friendship for friend/neutral/enemy
  // (simplified — full temporal friendship needs additional computation)
  return 'neutral';
}

/**
 * Check if planet is combust (within Sun's orb)
 */
function isCombust(grahaId: GrahaId, grahaLon: number, sunLon: number, isRetro: boolean): boolean {
  if (grahaId === 'SU' || grahaId === 'RA' || grahaId === 'KE') return false;
  
  const graha = GRAHAS[grahaId];
  const orb = isRetro ? graha.combustionOrbRetro : graha.combustionOrb;
  const diff = Math.abs(normalizeLongitude(grahaLon - sunLon));
  const angularDist = Math.min(diff, 360 - diff);
  
  return angularDist <= orb;
}

/**
 * Check if planet is vargottama (same sign in D-1 and D-9)
 */
function isVargottama(d1Longitude: number): boolean {
  const d1Sign = getRashiFromLongitude(d1Longitude);
  const degInSign = getDegreeInSign(d1Longitude);
  
  // Navamsha calculation: each sign divided into 9 parts (3°20' each)
  const navamshaSpan = 30 / 9;
  const navamshaPart = Math.floor(degInSign / navamshaSpan);
  
  // Starting sign for navamsha depends on element of D-1 sign
  // Fire signs (1,5,9) start from Aries (1)
  // Earth signs (2,6,10) start from Capricorn (10)
  // Air signs (3,7,11) start from Libra (7)
  // Water signs (4,8,12) start from Cancer (4)
  let startSign: number;
  const mod = ((d1Sign - 1) % 4);
  if (mod === 0) startSign = 1;       // Fire
  else if (mod === 1) startSign = 10; // Earth
  else if (mod === 2) startSign = 7;  // Air
  else startSign = 4;                  // Water
  
  const d9Sign = ((startSign - 1 + navamshaPart) % 12) + 1;
  
  return d1Sign === d9Sign;
}

/**
 * Get KP sub-lord from longitude
 * KP Sub-lord is determined by further subdividing nakshatra padas
 * by Vimshottari dasha proportions
 */
function getSubLord(longitude: number): GrahaId {
  const { nakshatra } = getNakshatraFromLongitude(longitude);
  const nakshatraStart = (nakshatra - 1) * NAKSHATRA_SPAN;
  const posInNakshatra = longitude - nakshatraStart;
  
  // Sub-lord is determined by dividing nakshatra span by dasha year proportions
  const dashaSequence: GrahaId[] = ['KE', 'VE', 'SU', 'MO', 'MA', 'RA', 'JU', 'SA', 'ME'];
  const dashaYears = [7, 20, 6, 10, 7, 18, 16, 19, 17]; // total = 120
  const totalYears = 120;
  
  // Find the starting lord (same as nakshatra lord)
  const nakLord = getNakshatraLord(nakshatra);
  const startIdx = dashaSequence.indexOf(nakLord);
  
  let accumulated = 0;
  for (let i = 0; i < 9; i++) {
    const idx = (startIdx + i) % 9;
    const span = (dashaYears[idx] / totalYears) * NAKSHATRA_SPAN;
    accumulated += span;
    if (posInNakshatra < accumulated) {
      // Now subdivide this sub-period further for sub-lord
      const subStart = accumulated - span;
      const posInSub = posInNakshatra - subStart;
      
      let subAccum = 0;
      for (let j = 0; j < 9; j++) {
        const subIdx = (idx + j) % 9;
        const subSpan = (dashaYears[subIdx] / totalYears) * span;
        subAccum += subSpan;
        if (posInSub < subAccum) {
          return dashaSequence[subIdx];
        }
      }
      return dashaSequence[idx];
    }
  }
  
  return nakLord;
}

/**
 * Calculate all 9 graha positions for a given birth data
 */
export function calculateGrahaPositions(
  year: number, month: number, day: number,
  hour: number, minute: number, second: number,
  timezoneOffset: number,
  ayanamsha: AyanamshaType = 'LAHIRI'
): GrahaPosition[] {
  // Set ayanamsha
  setAyanamsha(ayanamsha);
  
  // Convert to Julian Day (in UT)
  const decimalHours = toDecimalHours(hour, minute, second);
  const utHours = localToUT(decimalHours, timezoneOffset);
  
  // Handle day rollover for UT conversion
  let utYear = year, utMonth = month, utDay = day;
  let utHourAdjusted = utHours;
  if (utHours < 0) {
    utHourAdjusted += 24;
    utDay -= 1;
    // TODO: handle month/year rollover for edge cases
  } else if (utHours >= 24) {
    utHourAdjusted -= 24;
    utDay += 1;
  }
  
  const jd = dateToJulianDay(utYear, utMonth, utDay, utHourAdjusted);
  
  // Calculate Sun position first (needed for combustion check)
  const sunPos = calcPlanetPosition(jd, PLANET_CODES.SU);
  const sunLongitude = sunPos.longitude;
  
  // Calculate all planet positions
  const positions: GrahaPosition[] = [];
  
  for (const grahaId of ALL_GRAHAS) {
    let longitude: number;
    let speed: number;
    
    if (grahaId === 'KE') {
      // Ketu is always 180° from Rahu
      const rahuPos = positions.find(p => p.id === 'RA');
      longitude = normalizeLongitude((rahuPos?.longitude || 0) + 180);
      speed = rahuPos?.speed || -0.053;
    } else {
      const code = PLANET_CODES[grahaId as keyof typeof PLANET_CODES];
      const pos = calcPlanetPosition(jd, code);
      longitude = normalizeLongitude(pos.longitude);
      speed = pos.speedLong;
    }
    
    const rashi = getRashiFromLongitude(longitude) as RashiNumber;
    const degreeInSign = getDegreeInSign(longitude);
    const { nakshatra, pada } = getNakshatraFromLongitude(longitude);
    const nakshatraLord = getNakshatraLord(nakshatra);
    const subLord = getSubLord(longitude);
    const isRetrograde = speed < 0;
    const dignity = getDignity(grahaId, longitude);
    const combust = isCombust(grahaId, longitude, sunLongitude, isRetrograde);
    const vargottama = isVargottama(longitude);
    
    const graha = GRAHAS[grahaId];
    
    positions.push({
      id: grahaId,
      longitude,
      longitudeDMS: toDMS(longitude),
      rashi,
      degreeInSign,
      nakshatra: nakshatra as NakshatraNumber,
      pada: pada as PadaNumber,
      nakshatraLord,
      subLord,
      speed,
      isRetrograde,
      dignity,
      isCombust: combust,
      isVargottama: vargottama,
      exaltationDegree: (graha.exaltationSign - 1) * 30 + graha.exaltationDegree,
      debilitationDegree: (graha.debilitationSign - 1) * 30 + graha.debilitationDegree,
      ownSigns: graha.ownSigns as RashiNumber[],
      moolatrikonaSign: graha.moolatrikonaSign as RashiNumber,
      moolatrikonaStart: graha.moolatrikonaStart,
      moolatrikonaEnd: graha.moolatrikonaEnd,
    });
  }
  
  // ─── VERIFICATION: Rahu-Ketu must be exactly 180° apart ───
  const rahu = positions.find(p => p.id === 'RA');
  const ketu = positions.find(p => p.id === 'KE');
  if (rahu && ketu) {
    const diff = Math.abs(rahu.longitude - ketu.longitude);
    const angDist = Math.min(diff, 360 - diff);
    if (Math.abs(angDist - 180) > 0.01) {
      console.error(`[GRAHA SPASHTA] ERROR: Rahu-Ketu not 180° apart! Rahu=${rahu.longitude.toFixed(4)}°, Ketu=${ketu.longitude.toFixed(4)}°, diff=${angDist.toFixed(4)}°`);
      // Force correct: recalculate Ketu
      ketu.longitude = normalizeLongitude(rahu.longitude + 180);
      ketu.rashi = getRashiFromLongitude(ketu.longitude) as RashiNumber;
      ketu.degreeInSign = getDegreeInSign(ketu.longitude);
      ketu.longitudeDMS = toDMS(ketu.longitude);
      const nakData = getNakshatraFromLongitude(ketu.longitude);
      ketu.nakshatra = nakData.nakshatra as NakshatraNumber;
      ketu.pada = nakData.pada as PadaNumber;
      ketu.nakshatraLord = getNakshatraLord(nakData.nakshatra);
    }
    // Log for debugging
    console.log(`[GRAHA SPASHTA] Rahu: ${rahu.longitude.toFixed(4)}° (rashi ${rahu.rashi}), Ketu: ${ketu.longitude.toFixed(4)}° (rashi ${ketu.rashi}), diff: ${angDist.toFixed(4)}°`);
  }
  
  return positions;
}

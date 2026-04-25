/**
 * Lagna (Ascendant) & Bhava (House) Calculator
 * BPHS Ch. 5 (Special Lagnas), Ch. 6 (Bhava)
 */

import { GrahaId, GrahaPosition, RashiNumber } from '../types/graha';
import { LagnaData, BhavaData, CharaKaraka } from '../types/chart';
import { SIGN_LORDS } from '../constants/grahas';
import { getRashiFromLongitude, getDegreeInSign } from '../constants/rashis';
import { getNakshatraFromLongitude } from '../constants/nakshatras';
import { calcAscendant, dateToJulianDay, toDecimalHours, localToUT } from './swisseph-init';

/**
 * Calculate Lagna (Ascendant) data
 */
export function calculateLagna(
  year: number, month: number, day: number,
  hour: number, minute: number, second: number,
  timezoneOffset: number,
  latitude: number, longitude: number
): { lagna: LagnaData; cusps: number[]; armc: number } {
  const decimalHours = toDecimalHours(hour, minute, second);
  const utHours = localToUT(decimalHours, timezoneOffset);

  let utDay = day;
  let utHourAdj = utHours;
  if (utHours < 0) { utHourAdj += 24; utDay -= 1; }
  else if (utHours >= 24) { utHourAdj -= 24; utDay += 1; }

  const jd = dateToJulianDay(year, month, utDay, utHourAdj);
  const result = calcAscendant(jd, latitude, longitude);

  const ascLon = result.ascendant;
  const rashi = getRashiFromLongitude(ascLon) as RashiNumber;
  const degInSign = getDegreeInSign(ascLon);
  const { nakshatra, pada } = getNakshatraFromLongitude(ascLon);

  // Special Lagnas (simplified calculations)
  // Hora Lagna: advances 1 sign per hora (2.5 ghatis = 1 hour)
  const hoursFromSunrise = decimalHours - 6; // approx sunrise at 6 AM
  const horaLagna = (ascLon + hoursFromSunrise * 30) % 360;

  // Ghati Lagna: advances 1 sign per ghati (24 minutes)
  const ghatis = hoursFromSunrise * 2.5;
  const ghatiLagna = (ascLon + ghatis * 12) % 360;

  return {
    lagna: {
      longitude: ascLon,
      rashi,
      degreeInSign: degInSign,
      nakshatra,
      pada,
      horaLagna,
      ghatiLagna,
    },
    cusps: result.cusps,
    armc: result.armc,
  };
}

/**
 * Calculate all 12 Bhavas (Houses) with equal house system
 */
export function calculateBhavas(
  lagnaLongitude: number,
  grahaPositions: GrahaPosition[]
): BhavaData[] {
  const bhavas: BhavaData[] = [];

  for (let i = 0; i < 12; i++) {
    const bhavaNumber = i + 1;
    const madhya = (lagnaLongitude + i * 30) % 360;
    const sandhi = (lagnaLongitude + i * 30 - 15 + 360) % 360;
    const sandhiEnd = (sandhi + 30) % 360;
    const signOnCusp = getRashiFromLongitude(madhya) as RashiNumber;
    const lord = SIGN_LORDS[signOnCusp] as GrahaId;

    // Find planets in this bhava
    const planetsInBhava: GrahaId[] = [];
    for (const graha of grahaPositions) {
      if (isInBhava(graha.longitude, sandhi, sandhiEnd)) {
        planetsInBhava.push(graha.id);
      }
    }

    bhavas.push({
      number: bhavaNumber,
      signOnCusp,
      madhya,
      sandhi,
      lord,
      planetsInBhava,
    });
  }

  return bhavas;
}

/**
 * Check if a longitude falls within a bhava's range
 */
function isInBhava(lon: number, start: number, end: number): boolean {
  if (start < end) {
    return lon >= start && lon < end;
  }
  // Wraps around 360°
  return lon >= start || lon < end;
}

/**
 * Calculate Chara Karakas (Jaimini system)
 * Planets sorted by degree in sign (highest = Atmakaraka)
 * BPHS Ch. 32
 */
export function calculateCharaKarakas(
  grahaPositions: GrahaPosition[]
): CharaKaraka[] {
  const karakaNames: Array<{
    karaka: CharaKaraka['karaka'];
    name: { en: string; ne: string };
  }> = [
    { karaka: 'AK', name: { en: 'Atmakaraka (Soul)', ne: 'आत्मकारक' } },
    { karaka: 'AmK', name: { en: 'Amatyakaraka (Minister)', ne: 'अमात्यकारक' } },
    { karaka: 'BK', name: { en: 'Bhratrikaraka (Sibling)', ne: 'भ्रातृकारक' } },
    { karaka: 'MK', name: { en: 'Matrikaraka (Mother)', ne: 'मातृकारक' } },
    { karaka: 'PK', name: { en: 'Putrakaraka (Child)', ne: 'पुत्रकारक' } },
    { karaka: 'GK', name: { en: 'Gnatikaraka (Rival)', ne: 'ज्ञातिकारक' } },
    { karaka: 'DK', name: { en: 'Darakaraka (Spouse)', ne: 'दारकारक' } },
    { karaka: 'SK', name: { en: 'Sthirakaraka (Fixed)', ne: 'स्थिरकारक' } },
  ];

  // Use 8 planets (exclude Ketu) — sort by degree in sign, descending
  const sortable = grahaPositions
    .filter(g => g.id !== 'KE')
    .map(g => ({
      grahaId: g.id,
      degree: g.degreeInSign + (g.longitudeDMS.minutes / 60) + (g.longitudeDMS.seconds / 3600),
    }))
    .sort((a, b) => b.degree - a.degree);

  return sortable.map((item, index) => ({
    karaka: karakaNames[index].karaka,
    karakaName: karakaNames[index].name,
    graha: item.grahaId,
    degree: item.degree,
  }));
}

/**
 * Get the bhava number a planet occupies (1-12) from Lagna
 */
export function getBhavaOfPlanet(
  planetLongitude: number,
  lagnaLongitude: number
): number {
  const diff = ((planetLongitude - lagnaLongitude) % 360 + 360) % 360;
  return Math.floor(diff / 30) + 1;
}

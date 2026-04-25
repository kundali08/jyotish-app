/**
 * Varga (Divisional Chart) Calculator — BPHS Ch. 6-7
 * Calculates all 16 Shodashvarga charts
 */

import { GrahaPosition, GrahaId, RashiNumber } from '../types/graha';
import { VargaChart, VargaType } from '../types/chart';
import { getRashiFromLongitude, getDegreeInSign } from '../constants/rashis';

/** Varga chart definitions with division factors */
export const VARGA_DEFINITIONS: Array<{
  type: VargaType;
  name: { en: string; ne: string; sanskrit: string };
  division: number;
  signification: { en: string; ne: string };
}> = [
  { type: 'D1',  name: { en: 'Rashi', ne: 'राशि', sanskrit: 'Rāśi' }, division: 1, signification: { en: 'Physical body & overall life', ne: 'शरीर र समग्र जीवन' } },
  { type: 'D2',  name: { en: 'Hora', ne: 'होरा', sanskrit: 'Horā' }, division: 2, signification: { en: 'Wealth & resources', ne: 'धन र सम्पत्ति' } },
  { type: 'D3',  name: { en: 'Drekkana', ne: 'द्रेक्काण', sanskrit: 'Dreṣkāṇa' }, division: 3, signification: { en: 'Siblings & courage', ne: 'भाइबहिनी र साहस' } },
  { type: 'D4',  name: { en: 'Chaturthamsha', ne: 'चतुर्थांश', sanskrit: 'Caturthāṁśa' }, division: 4, signification: { en: 'Fortune & property', ne: 'भाग्य र सम्पत्ति' } },
  { type: 'D7',  name: { en: 'Saptamsha', ne: 'सप्तमांश', sanskrit: 'Saptāṁśa' }, division: 7, signification: { en: 'Children & progeny', ne: 'सन्तान' } },
  { type: 'D9',  name: { en: 'Navamsha', ne: 'नवमांश', sanskrit: 'Navāṁśa' }, division: 9, signification: { en: 'Spouse & dharma', ne: 'पति/पत्नी र धर्म' } },
  { type: 'D10', name: { en: 'Dashamsha', ne: 'दशमांश', sanskrit: 'Daśāṁśa' }, division: 10, signification: { en: 'Career & actions', ne: 'व्यवसाय र कर्म' } },
  { type: 'D12', name: { en: 'Dwadashamsha', ne: 'द्वादशांश', sanskrit: 'Dvādaśāṁśa' }, division: 12, signification: { en: 'Parents', ne: 'आमाबुवा' } },
  { type: 'D16', name: { en: 'Shodashamsha', ne: 'षोडशांश', sanskrit: 'Ṣoḍaśāṁśa' }, division: 16, signification: { en: 'Vehicles & happiness', ne: 'वाहन र सुख' } },
  { type: 'D20', name: { en: 'Vimshamsha', ne: 'विंशांश', sanskrit: 'Viṁśāṁśa' }, division: 20, signification: { en: 'Spiritual progress', ne: 'आध्यात्मिक प्रगति' } },
  { type: 'D24', name: { en: 'Chaturvimshamsha', ne: 'चतुर्विंशांश', sanskrit: 'Caturviṁśāṁśa' }, division: 24, signification: { en: 'Education & learning', ne: 'शिक्षा र विद्या' } },
  { type: 'D27', name: { en: 'Bhamsha', ne: 'भांश', sanskrit: 'Bhāṁśa' }, division: 27, signification: { en: 'Strength & weakness', ne: 'बल र दुर्बलता' } },
  { type: 'D30', name: { en: 'Trimshamsha', ne: 'त्रिंशांश', sanskrit: 'Triṁśāṁśa' }, division: 30, signification: { en: 'Evils & misfortune', ne: 'पाप र दुर्भाग्य' } },
  { type: 'D40', name: { en: 'Khavedamsha', ne: 'खवेदांश', sanskrit: 'Khavedāṁśa' }, division: 40, signification: { en: 'Auspicious effects', ne: 'शुभ फल' } },
  { type: 'D45', name: { en: 'Akshavedamsha', ne: 'अक्षवेदांश', sanskrit: 'Akṣavedāṁśa' }, division: 45, signification: { en: 'General wellbeing', ne: 'सामान्य कुशलता' } },
  { type: 'D60', name: { en: 'Shashtiamsha', ne: 'षष्ट्यंश', sanskrit: 'Ṣaṣṭyaṁśa' }, division: 60, signification: { en: 'Past life karma', ne: 'पूर्वजन्मको कर्म' } },
];

/**
 * Calculate Navamsha (D9) sign — most important varga
 * BPHS: Fire signs start from Aries, Earth from Capricorn,
 * Air from Libra, Water from Cancer
 */
function calcNavamshaSign(longitude: number): RashiNumber {
  const d1Sign = getRashiFromLongitude(longitude);
  const degInSign = getDegreeInSign(longitude);
  const part = Math.floor(degInSign / (30 / 9));

  // Starting sign based on element
  const mod = ((d1Sign - 1) % 4);
  let startSign: number;
  if (mod === 0) startSign = 1;       // Fire → Aries
  else if (mod === 1) startSign = 10; // Earth → Capricorn
  else if (mod === 2) startSign = 7;  // Air → Libra
  else startSign = 4;                  // Water → Cancer

  return (((startSign - 1 + part) % 12) + 1) as RashiNumber;
}

/**
 * Calculate Hora (D2) sign
 * Sun's hora = Leo, Moon's hora = Cancer
 */
function calcHoraSign(longitude: number): RashiNumber {
  const degInSign = getDegreeInSign(longitude);
  const d1Sign = getRashiFromLongitude(longitude);
  const isOdd = d1Sign % 2 === 1;

  if (isOdd) {
    return degInSign < 15 ? 5 as RashiNumber : 4 as RashiNumber; // Leo or Cancer
  } else {
    return degInSign < 15 ? 4 as RashiNumber : 5 as RashiNumber;
  }
}

/**
 * Calculate Drekkana (D3) sign
 * 1st third: same sign, 2nd third: 5th from, 3rd third: 9th from
 */
function calcDrekkanaSign(longitude: number): RashiNumber {
  const d1Sign = getRashiFromLongitude(longitude);
  const degInSign = getDegreeInSign(longitude);
  const third = Math.floor(degInSign / 10);

  if (third === 0) return d1Sign as RashiNumber;
  if (third === 1) return (((d1Sign - 1 + 4) % 12) + 1) as RashiNumber;
  return (((d1Sign - 1 + 8) % 12) + 1) as RashiNumber;
}

/**
 * Calculate Trimshamsha (D30) — unequal division
 * BPHS: Odd signs: Mars 5°, Saturn 5°, Jupiter 8°, Mercury 7°, Venus 5°
 * Even signs reverse order
 */
function calcTrimshamshaSign(longitude: number): RashiNumber {
  const d1Sign = getRashiFromLongitude(longitude);
  const degInSign = getDegreeInSign(longitude);
  const isOdd = d1Sign % 2 === 1;

  interface TrimRule { deg: number; lord: number } // lord as sign number
  const oddRules: TrimRule[] = [
    { deg: 5, lord: 1 },   // Mars → Aries
    { deg: 10, lord: 11 }, // Saturn → Aquarius
    { deg: 18, lord: 9 },  // Jupiter → Sagittarius
    { deg: 25, lord: 3 },  // Mercury → Gemini
    { deg: 30, lord: 7 },  // Venus → Libra
  ];
  const evenRules: TrimRule[] = [
    { deg: 5, lord: 2 },   // Venus → Taurus
    { deg: 12, lord: 6 },  // Mercury → Virgo
    { deg: 20, lord: 12 }, // Jupiter → Pisces
    { deg: 25, lord: 10 }, // Saturn → Capricorn
    { deg: 30, lord: 8 },  // Mars → Scorpio
  ];

  const rules = isOdd ? oddRules : evenRules;
  for (const rule of rules) {
    if (degInSign < rule.deg) return rule.lord as RashiNumber;
  }
  return rules[rules.length - 1].lord as RashiNumber;
}

/**
 * Generic equal-division varga calculation
 * For D4, D7, D10, D12, D16, D20, D24, D27, D40, D45, D60
 */
function calcGenericVargaSign(longitude: number, division: number): RashiNumber {
  const d1Sign = getRashiFromLongitude(longitude);
  const degInSign = getDegreeInSign(longitude);
  const partSize = 30 / division;
  const part = Math.floor(degInSign / partSize);

  // Different starting rules based on division
  let startSign: number;

  switch (division) {
    case 4: // Chaturthamsha: starts from same sign
      startSign = d1Sign;
      break;
    case 7: // Saptamsha: odd signs from self, even from 7th
      startSign = d1Sign % 2 === 1 ? d1Sign : ((d1Sign - 1 + 6) % 12) + 1;
      break;
    case 10: // Dashamsha: odd from self, even from 9th
      startSign = d1Sign % 2 === 1 ? d1Sign : ((d1Sign - 1 + 8) % 12) + 1;
      break;
    case 12: // Dwadashamsha: starts from same sign
      startSign = d1Sign;
      break;
    case 16: // Shodashamsha: cardinal from Aries, fixed from Leo, mutable from Sagittarius
      { const mod3 = ((d1Sign - 1) % 3);
        startSign = mod3 === 0 ? 1 : mod3 === 1 ? 5 : 9; }
      break;
    case 20: // Vimshamsha: cardinal from Aries, fixed from Sagittarius, mutable from Leo
      { const mod3b = ((d1Sign - 1) % 3);
        startSign = mod3b === 0 ? 1 : mod3b === 1 ? 9 : 5; }
      break;
    case 24: // Chaturvimshamsha: odd from Leo, even from Cancer
      startSign = d1Sign % 2 === 1 ? 5 : 4;
      break;
    case 27: // Bhamsha: fire from Aries, earth from Cancer, air from Libra, water from Capricorn
      { const mod4 = ((d1Sign - 1) % 4);
        startSign = mod4 === 0 ? 1 : mod4 === 1 ? 4 : mod4 === 2 ? 7 : 10; }
      break;
    case 40: // Khavedamsha: odd from Aries, even from Libra
      startSign = d1Sign % 2 === 1 ? 1 : 7;
      break;
    case 45: // Akshavedamsha: cardinal from Aries, fixed from Leo, mutable from Sagittarius
      { const mod3c = ((d1Sign - 1) % 3);
        startSign = mod3c === 0 ? 1 : mod3c === 1 ? 5 : 9; }
      break;
    case 60: // Shashtiamsha: starts from same sign
      startSign = d1Sign;
      break;
    default:
      startSign = d1Sign;
  }

  return (((startSign - 1 + part) % 12) + 1) as RashiNumber;
}

/**
 * Calculate varga sign for a given longitude and varga type
 */
function getVargaSign(longitude: number, division: number): RashiNumber {
  switch (division) {
    case 1: return getRashiFromLongitude(longitude) as RashiNumber;
    case 2: return calcHoraSign(longitude);
    case 3: return calcDrekkanaSign(longitude);
    case 9: return calcNavamshaSign(longitude);
    case 30: return calcTrimshamshaSign(longitude);
    default: return calcGenericVargaSign(longitude, division);
  }
}

/**
 * Calculate a single varga chart for all grahas
 */
export function calculateVargaChart(
  grahas: GrahaPosition[],
  lagnaLongitude: number,
  vargaDef: typeof VARGA_DEFINITIONS[0]
): VargaChart {
  const planetPositions: Record<string, RashiNumber> = {};

  // Lagna in this varga
  planetPositions['LG'] = getVargaSign(lagnaLongitude, vargaDef.division);

  // Each graha
  for (const g of grahas) {
    planetPositions[g.id] = getVargaSign(g.longitude, vargaDef.division);
  }

  return {
    type: vargaDef.type,
    name: vargaDef.name,
    division: vargaDef.division,
    signification: vargaDef.signification,
    planetPositions,
    lagnaSign: planetPositions['LG'],
  };
}

/**
 * Calculate all 16 Shodashvarga charts
 */
export function calculateAllVargas(
  grahas: GrahaPosition[],
  lagnaLongitude: number
): VargaChart[] {
  return VARGA_DEFINITIONS.map(def => calculateVargaChart(grahas, lagnaLongitude, def));
}

/**
 * Calculate Vargottama status for each planet
 * A planet is vargottama if it occupies the same sign in D-1 and D-9
 */
export function getVargottamaStatus(vargas: VargaChart[]): Record<string, boolean> {
  const d1 = vargas.find(v => v.type === 'D1');
  const d9 = vargas.find(v => v.type === 'D9');
  if (!d1 || !d9) return {};

  const result: Record<string, boolean> = {};
  for (const [planet, sign] of Object.entries(d1.planetPositions)) {
    result[planet] = d9.planetPositions[planet] === sign;
  }
  return result;
}

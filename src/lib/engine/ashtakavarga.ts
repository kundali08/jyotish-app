/**
 * Ashtakavarga Calculator — BPHS Ch. 66-72
 *
 * Each of the 7 planets + Lagna contributes 1 bindu (point) to each
 * of the 12 signs, based on their transit positions relative to the
 * natal planet.
 *
 * Bhinnashtakavarga (BAV) — individual planet's bindus per sign
 * Sarvashtakavarga (SAV) — sum of all BAV per sign (max 337, per sign max ~56)
 */

import { GrahaId, GrahaPosition } from '../types/graha';
import { getRashiFromLongitude } from '../constants/rashis';
import { AshtakavargaData } from '../types/chart';

type ContributorId = 'SU' | 'MO' | 'MA' | 'ME' | 'JU' | 'VE' | 'SA' | 'LA';

/**
 * Ashtakavarga contribution tables per BPHS
 * For each planet, from each contributor, the houses (from contributor)
 * that receive a bindu.
 *
 * Format: BINDU_TABLES[planet][contributor] = array of house numbers (1-12)
 */
const BINDU_TABLES: Record<string, Record<string, number[]>> = {
  SU: {
    SU: [1, 2, 4, 7, 8, 9, 10, 11],
    MO: [3, 6, 10, 11],
    MA: [1, 2, 4, 7, 8, 9, 10, 11],
    ME: [3, 5, 6, 9, 10, 11, 12],
    JU: [5, 6, 9, 11],
    VE: [6, 7, 12],
    SA: [1, 2, 4, 7, 8, 9, 10, 11],
    LA: [3, 4, 6, 10, 11, 12],
  },
  MO: {
    SU: [3, 6, 7, 8, 10, 11],
    MO: [1, 3, 6, 7, 10, 11],
    MA: [2, 3, 5, 6, 9, 10, 11],
    ME: [1, 3, 4, 5, 7, 8, 10, 11],
    JU: [1, 4, 7, 8, 10, 11, 12],
    VE: [3, 4, 5, 7, 9, 10, 11],
    SA: [3, 5, 6, 11],
    LA: [3, 6, 10, 11],
  },
  MA: {
    SU: [3, 5, 6, 10, 11],
    MO: [3, 6, 11],
    MA: [1, 2, 4, 7, 8, 10, 11],
    ME: [3, 5, 6, 11],
    JU: [6, 10, 11, 12],
    VE: [6, 8, 11, 12],
    SA: [1, 4, 7, 8, 9, 10, 11],
    LA: [1, 3, 6, 10, 11],
  },
  ME: {
    SU: [5, 6, 9, 11, 12],
    MO: [2, 4, 6, 8, 10, 11],
    MA: [1, 2, 4, 7, 8, 9, 10, 11],
    ME: [1, 3, 5, 6, 9, 10, 11, 12],
    JU: [6, 8, 11, 12],
    VE: [1, 2, 3, 4, 5, 8, 9, 11],
    SA: [1, 2, 4, 7, 8, 9, 10, 11],
    LA: [1, 2, 4, 6, 8, 10, 11],
  },
  JU: {
    SU: [1, 2, 3, 4, 7, 8, 9, 10, 11],
    MO: [2, 5, 7, 9, 11],
    MA: [1, 2, 4, 7, 8, 10, 11],
    ME: [1, 2, 4, 5, 6, 9, 10, 11],
    JU: [1, 2, 3, 4, 7, 8, 10, 11],
    VE: [2, 5, 6, 9, 10, 11],
    SA: [3, 5, 6, 12],
    LA: [1, 2, 4, 5, 6, 7, 9, 10, 11],
  },
  VE: {
    SU: [8, 11, 12],
    MO: [1, 2, 3, 4, 5, 8, 9, 11, 12],
    MA: [3, 5, 6, 9, 11, 12],
    ME: [3, 5, 6, 9, 11],
    JU: [5, 8, 9, 10, 11],
    VE: [1, 2, 3, 4, 5, 8, 9, 10, 11],
    SA: [3, 4, 5, 8, 9, 10, 11],
    LA: [1, 2, 3, 4, 5, 8, 9, 11],
  },
  SA: {
    SU: [1, 2, 4, 7, 8, 10, 11],
    MO: [3, 6, 11],
    MA: [3, 5, 6, 10, 11, 12],
    ME: [6, 8, 9, 10, 11, 12],
    JU: [5, 6, 11, 12],
    VE: [6, 11, 12],
    SA: [3, 5, 6, 11],
    LA: [1, 3, 4, 6, 10, 11],
  },
};

/**
 * Get sign position for a graha or lagna
 */
function getSignNumber(grahas: GrahaPosition[], lagnaLon: number, id: ContributorId): number {
  if (id === 'LA') return getRashiFromLongitude(lagnaLon);
  const graha = grahas.find(g => g.id === id);
  return graha ? graha.rashi : 1;
}

/**
 * Calculate Bhinnashtakavarga for one planet
 */
function calcBhinnashtakavarga(
  planet: GrahaId,
  grahas: GrahaPosition[],
  lagnaLon: number
): number[] {
  const bindus = new Array(12).fill(0);
  const table = BINDU_TABLES[planet];
  if (!table) return bindus;

  const contributors: ContributorId[] = ['SU', 'MO', 'MA', 'ME', 'JU', 'VE', 'SA', 'LA'];

  for (const contributor of contributors) {
    const houses = table[contributor];
    if (!houses) continue;

    const contributorSign = getSignNumber(grahas, lagnaLon, contributor);

    for (const houseNum of houses) {
      // House number from contributor's position
      const targetSign = ((contributorSign - 1 + houseNum - 1) % 12) + 1;
      bindus[targetSign - 1] += 1;
    }
  }

  return bindus;
}

/**
 * Calculate complete Ashtakavarga
 */
export function calculateAshtakavarga(
  grahas: GrahaPosition[],
  lagnaLon: number
): AshtakavargaData {
  const planets: GrahaId[] = ['SU', 'MO', 'MA', 'ME', 'JU', 'VE', 'SA'];
  const bhinna: Record<string, number[]> = {};

  // Calculate BAV for each planet
  for (const planet of planets) {
    bhinna[planet] = calcBhinnashtakavarga(planet, grahas, lagnaLon);
  }

  // Calculate Lagna's BAV (using Jupiter's table as approximation)
  bhinna['LA'] = calcBhinnashtakavarga('JU', grahas, lagnaLon);

  // Calculate SAV — sum all BAV per sign
  const sarva = new Array(12).fill(0);
  for (const planetBindus of Object.values(bhinna)) {
    for (let i = 0; i < 12; i++) {
      sarva[i] += planetBindus[i];
    }
  }

  // Trikona Shodhana (Triangle Reduction)
  const trikonaShodhana = calcTrikonaShodhana(sarva);

  // Ekadhipatya Shodhana (Single Lord Reduction)
  const ekadhipatyaShodhana = calcEkadhipatyaShodhana(sarva);

  return { bhinna, sarva, trikonaShodhana, ekadhipatyaShodhana };
}

/**
 * Trikona Shodhana — Reduce by minimum of trikona signs
 * Signs 1-5-9, 2-6-10, 3-7-11, 4-8-12 form trikona groups
 */
function calcTrikonaShodhana(sarva: number[]): number[] {
  const reduced = [...sarva];
  const trikonas = [[0, 4, 8], [1, 5, 9], [2, 6, 10], [3, 7, 11]];

  for (const group of trikonas) {
    const min = Math.min(...group.map(i => reduced[i]));
    for (const i of group) {
      reduced[i] -= min;
    }
  }

  return reduced;
}

/**
 * Ekadhipatya Shodhana — Reduce pairs ruled by same planet
 * Pairs: Aries-Scorpio (Mars), Taurus-Libra (Venus), etc.
 */
function calcEkadhipatyaShodhana(sarva: number[]): number[] {
  const reduced = [...sarva];
  // Sign pairs with same lord (0-indexed)
  const pairs: [number, number][] = [
    [0, 7],   // Aries-Scorpio (Mars)
    [1, 6],   // Taurus-Libra (Venus)
    [2, 5],   // Gemini-Virgo (Mercury)
    [3, 11],  // Cancer is Moon only (skip)
    [4, 10],  // Leo is Sun only (skip)
    [8, 11],  // Sagittarius-Pisces (Jupiter)
    [9, 10],  // Capricorn-Aquarius (Saturn)
  ];

  for (const [a, b] of pairs) {
    const min = Math.min(reduced[a], reduced[b]);
    // Keep the one with planet, reduce the empty one
    reduced[a] -= min;
    reduced[b] -= min;
  }

  return reduced;
}

/**
 * Get SAV total (Samudaya Ashtakavarga strength)
 */
export function getSAVTotal(ashtakavarga: AshtakavargaData): number {
  return ashtakavarga.sarva.reduce((sum, v) => sum + v, 0);
}

/**
 * Find strong and weak signs based on SAV
 * Signs with SAV >= 28 are generally considered strong
 */
export function getSignStrengths(ashtakavarga: AshtakavargaData): {
  strong: number[];
  weak: number[];
  average: number;
} {
  const avg = getSAVTotal(ashtakavarga) / 12;
  const strong: number[] = [];
  const weak: number[] = [];

  ashtakavarga.sarva.forEach((val, idx) => {
    if (val >= 28) strong.push(idx + 1);
    else if (val < 25) weak.push(idx + 1);
  });

  return { strong, weak, average: avg };
}

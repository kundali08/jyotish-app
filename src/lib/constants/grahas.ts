/**
 * Graha (Planet) Constants
 * Based on BPHS Ch. 3-4 — Rashi & Graha characteristics
 * 
 * All 9 Navagrahas with complete properties including:
 * - Names in English, Nepali, Sanskrit
 * - Dignities (exaltation, debilitation, own signs, moolatrikona)
 * - Natural properties, combustion orbs
 * - Vimshottari dasha years
 * - Swiss Ephemeris codes
 */

import { GrahaDefinition, GrahaId } from '../types/graha';

// Swiss Ephemeris planet codes
export const SE_SUN = 0;
export const SE_MOON = 1;
export const SE_MERCURY = 2;
export const SE_VENUS = 3;
export const SE_MARS = 4;
export const SE_JUPITER = 5;
export const SE_SATURN = 6;
export const SE_MEAN_NODE = 10;  // Rahu (mean node)

export const GRAHAS: Record<GrahaId, GrahaDefinition> = {
  SU: {
    id: 'SU',
    name: { en: 'Sun', ne: 'सूर्य', sanskrit: 'Surya' },
    symbol: { en: 'Su', ne: 'सू' },
    swissephCode: SE_SUN,
    exaltationSign: 1, exaltationDegree: 10,      // Aries 10°
    debilitationSign: 7, debilitationDegree: 10,   // Libra 10°
    ownSigns: [5],                                  // Leo
    moolatrikonaSign: 5, moolatrikonaStart: 0, moolatrikonaEnd: 20,  // Leo 0-20°
    nature: 'malefic',
    gender: 'male',
    element: 'fire',
    caste: 'Kshatriya',
    combustionOrb: 0, combustionOrbRetro: 0,  // Sun can't be combust
    dashaYears: 6,
    naisargikaBala: 60,
    meanDailyMotion: 0.9856,
  },
  MO: {
    id: 'MO',
    name: { en: 'Moon', ne: 'चन्द्र', sanskrit: 'Chandra' },
    symbol: { en: 'Mo', ne: 'चं' },
    swissephCode: SE_MOON,
    exaltationSign: 2, exaltationDegree: 3,        // Taurus 3°
    debilitationSign: 8, debilitationDegree: 3,    // Scorpio 3°
    ownSigns: [4],                                  // Cancer
    moolatrikonaSign: 2, moolatrikonaStart: 4, moolatrikonaEnd: 30,  // Taurus 4-30°
    nature: 'benefic',  // when waxing; malefic when waning (handled in code)
    gender: 'female',
    element: 'water',
    caste: 'Vaishya',
    combustionOrb: 12, combustionOrbRetro: 12,
    dashaYears: 10,
    naisargikaBala: 51.43,
    meanDailyMotion: 13.1764,
  },
  MA: {
    id: 'MA',
    name: { en: 'Mars', ne: 'मङ्गल', sanskrit: 'Mangala' },
    symbol: { en: 'Ma', ne: 'मं' },
    swissephCode: SE_MARS,
    exaltationSign: 10, exaltationDegree: 28,      // Capricorn 28°
    debilitationSign: 4, debilitationDegree: 28,   // Cancer 28°
    ownSigns: [1, 8],                               // Aries, Scorpio
    moolatrikonaSign: 1, moolatrikonaStart: 0, moolatrikonaEnd: 12,  // Aries 0-12°
    nature: 'malefic',
    gender: 'male',
    element: 'fire',
    caste: 'Kshatriya',
    combustionOrb: 17, combustionOrbRetro: 8,
    dashaYears: 7,
    naisargikaBala: 17.14,
    meanDailyMotion: 0.5240,
  },
  ME: {
    id: 'ME',
    name: { en: 'Mercury', ne: 'बुध', sanskrit: 'Budha' },
    symbol: { en: 'Me', ne: 'बु' },
    swissephCode: SE_MERCURY,
    exaltationSign: 6, exaltationDegree: 15,       // Virgo 15°
    debilitationSign: 12, debilitationDegree: 15,  // Pisces 15°
    ownSigns: [3, 6],                               // Gemini, Virgo
    moolatrikonaSign: 6, moolatrikonaStart: 16, moolatrikonaEnd: 20,  // Virgo 16-20°
    nature: 'neutral',  // depends on association
    gender: 'eunuch',
    element: 'earth',
    caste: 'Vaishya',
    combustionOrb: 14, combustionOrbRetro: 12,
    dashaYears: 17,
    naisargikaBala: 25.71,
    meanDailyMotion: 1.3833,
  },
  JU: {
    id: 'JU',
    name: { en: 'Jupiter', ne: 'गुरु', sanskrit: 'Guru' },
    symbol: { en: 'Ju', ne: 'गु' },
    swissephCode: SE_JUPITER,
    exaltationSign: 4, exaltationDegree: 5,        // Cancer 5°
    debilitationSign: 10, debilitationDegree: 5,   // Capricorn 5°
    ownSigns: [9, 12],                              // Sagittarius, Pisces
    moolatrikonaSign: 9, moolatrikonaStart: 0, moolatrikonaEnd: 10,  // Sagittarius 0-10°
    nature: 'benefic',
    gender: 'male',
    element: 'ether',
    caste: 'Brahmin',
    combustionOrb: 11, combustionOrbRetro: 11,
    dashaYears: 16,
    naisargikaBala: 34.28,
    meanDailyMotion: 0.0831,
  },
  VE: {
    id: 'VE',
    name: { en: 'Venus', ne: 'शुक्र', sanskrit: 'Shukra' },
    symbol: { en: 'Ve', ne: 'शु' },
    swissephCode: SE_VENUS,
    exaltationSign: 12, exaltationDegree: 27,      // Pisces 27°
    debilitationSign: 6, debilitationDegree: 27,   // Virgo 27°
    ownSigns: [2, 7],                               // Taurus, Libra
    moolatrikonaSign: 7, moolatrikonaStart: 0, moolatrikonaEnd: 15,  // Libra 0-15°
    nature: 'benefic',
    gender: 'female',
    element: 'water',
    caste: 'Brahmin',
    combustionOrb: 10, combustionOrbRetro: 8,
    dashaYears: 20,
    naisargikaBala: 42.86,
    meanDailyMotion: 1.2000,
  },
  SA: {
    id: 'SA',
    name: { en: 'Saturn', ne: 'शनि', sanskrit: 'Shani' },
    symbol: { en: 'Sa', ne: 'श' },
    swissephCode: SE_SATURN,
    exaltationSign: 7, exaltationDegree: 20,       // Libra 20°
    debilitationSign: 1, debilitationDegree: 20,   // Aries 20°
    ownSigns: [10, 11],                             // Capricorn, Aquarius
    moolatrikonaSign: 11, moolatrikonaStart: 0, moolatrikonaEnd: 20,  // Aquarius 0-20°
    nature: 'malefic',
    gender: 'eunuch',
    element: 'air',
    caste: 'Shudra',
    combustionOrb: 15, combustionOrbRetro: 15,
    dashaYears: 19,
    naisargikaBala: 8.57,
    meanDailyMotion: 0.0335,
  },
  RA: {
    id: 'RA',
    name: { en: 'Rahu', ne: 'राहु', sanskrit: 'Rahu' },
    symbol: { en: 'Ra', ne: 'रा' },
    swissephCode: SE_MEAN_NODE,
    // Rahu dignities are debated; using common Parashari interpretation
    exaltationSign: 3, exaltationDegree: 20,       // Gemini (some say Taurus)
    debilitationSign: 9, debilitationDegree: 20,   // Sagittarius
    ownSigns: [11],                                 // Aquarius (co-lord)
    moolatrikonaSign: 6, moolatrikonaStart: 0, moolatrikonaEnd: 20,  // Virgo
    nature: 'malefic',
    gender: 'female',
    element: 'air',
    caste: 'Outcaste',
    combustionOrb: 0, combustionOrbRetro: 0,  // Nodes not combust
    dashaYears: 18,
    naisargikaBala: 0,  // Nodes excluded from Naisargika Bala
    meanDailyMotion: -0.0530,  // retrograde motion (mean)
  },
  KE: {
    id: 'KE',
    name: { en: 'Ketu', ne: 'केतु', sanskrit: 'Ketu' },
    symbol: { en: 'Ke', ne: 'के' },
    swissephCode: -1,  // Calculated as 180° from Rahu
    // Ketu dignities: opposite of Rahu
    exaltationSign: 9, exaltationDegree: 20,       // Sagittarius
    debilitationSign: 3, debilitationDegree: 20,   // Gemini
    ownSigns: [8],                                  // Scorpio (co-lord)
    moolatrikonaSign: 12, moolatrikonaStart: 0, moolatrikonaEnd: 20,  // Pisces
    nature: 'malefic',
    gender: 'eunuch',
    element: 'fire',
    caste: 'Outcaste',
    combustionOrb: 0, combustionOrbRetro: 0,
    dashaYears: 7,
    naisargikaBala: 0,
    meanDailyMotion: -0.0530,
  },
};

/** Vimshottari Dasha sequence (starting from Ketu) */
export const VIMSHOTTARI_SEQUENCE: GrahaId[] = ['KE', 'VE', 'SU', 'MO', 'MA', 'RA', 'JU', 'SA', 'ME'];

/** Total Vimshottari cycle = 120 years */
export const VIMSHOTTARI_TOTAL_YEARS = 120;

/** Natural friendship matrix per BPHS Ch. 3, Verse 55 */
export const NATURAL_FRIENDSHIPS: Record<GrahaId, { friends: GrahaId[]; enemies: GrahaId[]; neutral: GrahaId[] }> = {
  SU: { friends: ['MO', 'MA', 'JU'],           enemies: ['VE', 'SA'],            neutral: ['ME'] },
  MO: { friends: ['SU', 'ME'],                  enemies: [],                      neutral: ['MA', 'JU', 'VE', 'SA'] },
  MA: { friends: ['SU', 'MO', 'JU'],           enemies: ['ME'],                  neutral: ['VE', 'SA'] },
  ME: { friends: ['SU', 'VE'],                  enemies: ['MO'],                  neutral: ['MA', 'JU', 'SA'] },
  JU: { friends: ['SU', 'MO', 'MA'],           enemies: ['ME', 'VE'],            neutral: ['SA'] },
  VE: { friends: ['ME', 'SA'],                  enemies: ['SU', 'MO'],            neutral: ['MA', 'JU'] },
  SA: { friends: ['ME', 'VE'],                  enemies: ['SU', 'MO', 'MA'],      neutral: ['JU'] },
  RA: { friends: ['JU', 'VE', 'SA'],           enemies: ['SU', 'MO', 'MA'],      neutral: ['ME'] },
  KE: { friends: ['MA', 'VE', 'SA'],           enemies: ['SU', 'MO'],            neutral: ['ME', 'JU'] },
};

/** Graha aspects (drishti) — BPHS Ch. 26 */
export const GRAHA_ASPECTS: Record<GrahaId, number[]> = {
  // All planets aspect 7th house from themselves
  SU: [7],
  MO: [7],
  ME: [7],
  VE: [7],
  // Mars: 4th, 7th, 8th
  MA: [4, 7, 8],
  // Jupiter: 5th, 7th, 9th
  JU: [5, 7, 9],
  // Saturn: 3rd, 7th, 10th
  SA: [3, 7, 10],
  // Rahu/Ketu: 5th, 7th, 9th (some traditions)
  RA: [5, 7, 9],
  KE: [5, 7, 9],
};

/** Sign lords */
export const SIGN_LORDS: Record<number, GrahaId> = {
  1: 'MA',   // Aries
  2: 'VE',   // Taurus
  3: 'ME',   // Gemini
  4: 'MO',   // Cancer
  5: 'SU',   // Leo
  6: 'ME',   // Virgo
  7: 'VE',   // Libra
  8: 'MA',   // Scorpio
  9: 'JU',   // Sagittarius
  10: 'SA',  // Capricorn
  11: 'SA',  // Aquarius
  12: 'JU',  // Pisces
};

/** Dig Bala (Directional Strength) positions — BPHS Ch. 27 */
export const DIG_BALA_HOUSES: Record<GrahaId, number> = {
  SU: 10,  // Sun strongest in 10th (Midheaven)
  MO: 4,   // Moon strongest in 4th
  MA: 10,  // Mars strongest in 10th
  ME: 1,   // Mercury strongest in 1st (Lagna)
  JU: 1,   // Jupiter strongest in 1st
  VE: 4,   // Venus strongest in 4th
  SA: 7,   // Saturn strongest in 7th
  RA: 10,  // Rahu like Saturn/Mars
  KE: 4,   // Ketu like Moon
};

/** Required minimum Shadbala in Rupas per planet — BPHS Ch. 27 */
export const REQUIRED_SHADBALA_RUPAS: Record<GrahaId, number> = {
  SU: 6.5,
  MO: 6.0,
  MA: 5.0,
  ME: 7.0,
  JU: 6.5,
  VE: 5.5,
  SA: 5.0,
  RA: 0,  // Not traditionally calculated for nodes
  KE: 0,
};

/** Get all graha IDs (9 planets) */
export const ALL_GRAHAS: GrahaId[] = ['SU', 'MO', 'MA', 'ME', 'JU', 'VE', 'SA', 'RA', 'KE'];

/** 7 planets excluding nodes (used in Ashtakavarga) */
export const SEVEN_PLANETS: GrahaId[] = ['SU', 'MO', 'MA', 'ME', 'JU', 'VE', 'SA'];

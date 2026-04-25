/**
 * Graha (Planet) Type Definitions
 * Based on Brihat Parasara Hora Shastra (BPHS) Ch. 3-4
 */

export type GrahaId = 'SU' | 'MO' | 'MA' | 'ME' | 'JU' | 'VE' | 'SA' | 'RA' | 'KE';

export type RashiNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type NakshatraNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27;

export type PadaNumber = 1 | 2 | 3 | 4;

export type Dignity = 'exalted' | 'moolatrikona' | 'own' | 'friend' | 'neutral' | 'enemy' | 'debilitated';

export type Relationship = 'bestFriend' | 'friend' | 'neutral' | 'enemy' | 'bitterEnemy';

/** Degrees, Minutes, Seconds representation */
export interface DMS {
  degrees: number;
  minutes: number;
  seconds: number;
  totalDegrees: number; // decimal degrees
}

/** Full graha position data */
export interface GrahaPosition {
  id: GrahaId;
  
  // Position
  longitude: number;        // sidereal longitude (0-360)
  longitudeDMS: DMS;        // degrees, minutes, seconds
  rashi: RashiNumber;       // sign 1-12
  degreeInSign: number;     // 0-30 degrees within sign
  
  // Nakshatra
  nakshatra: NakshatraNumber;  // 1-27
  pada: PadaNumber;            // 1-4
  nakshatraLord: GrahaId;      // lord of the nakshatra
  subLord: GrahaId;            // KP sub-lord
  
  // Motion
  speed: number;            // degrees per day
  isRetrograde: boolean;    // true if speed < 0
  
  // Dignity
  dignity: Dignity;
  isCombust: boolean;       // within Sun's combustion orb
  isVargottama: boolean;    // same sign in D-1 and D-9
  
  // Exaltation/Debilitation info
  exaltationDegree: number | null;
  debilitationDegree: number | null;
  ownSigns: RashiNumber[];
  moolatrikonaSign: RashiNumber | null;
  moolatrikonaStart: number | null;
  moolatrikonaEnd: number | null;
}

/** Graha definition (static properties) */
export interface GrahaDefinition {
  id: GrahaId;
  name: { en: string; ne: string; sanskrit: string };
  symbol: { en: string; ne: string };
  swissephCode: number;    // Swiss Ephemeris planet code
  
  // Dignities per BPHS
  exaltationSign: RashiNumber;
  exaltationDegree: number;
  debilitationSign: RashiNumber;
  debilitationDegree: number;
  ownSigns: RashiNumber[];
  moolatrikonaSign: RashiNumber;
  moolatrikonaStart: number;
  moolatrikonaEnd: number;
  
  // Natural properties
  nature: 'benefic' | 'malefic' | 'neutral';  // natural benefic/malefic
  gender: 'male' | 'female' | 'eunuch';
  element: 'fire' | 'earth' | 'air' | 'water' | 'ether';
  caste: string;
  
  // Combustion orb (degrees from Sun)
  combustionOrb: number;
  combustionOrbRetro: number;
  
  // Vimshottari Dasha years
  dashaYears: number;
  
  // Natural strength order (Naisargika Bala)
  naisargikaBala: number;  // virupas
  
  // Mean daily motion
  meanDailyMotion: number;
}

/** Shadbala (six-fold strength) for a graha */
export interface GrahaShadbala {
  grahaId: GrahaId;

  // Six components (in Shashtiamshas)
  sthanaBala: number;      // Positional strength
  digBala: number;         // Directional strength
  kalaBala: number;        // Temporal strength
  cheshtaBala: number;     // Motional strength
  naisargikaBala: number;  // Natural strength
  drikBala: number;        // Aspectual strength

  // Totals
  totalShashtiamsha: number;
  totalRupa: number;        // totalShashtiamsha / 60
  requiredRupa: number;     // BPHS minimum required
  ratio: number;            // totalRupa / requiredRupa
  isStrong: boolean;        // ratio >= 1.0
  rank: number;             // 1 = strongest
}


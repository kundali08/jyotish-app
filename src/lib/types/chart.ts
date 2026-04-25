/**
 * Chart & Kundali Type Definitions
 */

import { GrahaId, GrahaPosition, RashiNumber, GrahaShadbala } from './graha';
import { PanchangaData } from './panchanga';
import { DashaData } from './dasha';

/** Birth input data */
export interface BirthData {
  name: string;
  gotra?: string;
  fatherName?: string;
  motherName?: string;
  gender: 'male' | 'female' | 'other';
  
  // Date & Time
  dateAD: { year: number; month: number; day: number };
  dateBS: { year: number; month: number; day: number };
  time: { hour: number; minute: number; second: number };
  isTimeUnknown: boolean;
  
  // Location
  place: string;
  latitude: number;
  longitude: number;
  timezone: number;      // offset in hours from UTC (e.g., 5.75 for Nepal)
  timezoneName: string;  // e.g., "Asia/Kathmandu"
}

/** Bhava (House) data */
export interface BhavaData {
  number: number;       // 1-12
  signOnCusp: RashiNumber;
  madhya: number;       // house center degree
  sandhi: number;       // house cusp degree (start)
  lord: GrahaId;        // rashi lord of this bhava
  planetsInBhava: GrahaId[];
  
  // Bhavabala
  bhavadhipatiBala?: number;
  bhavaDigbala?: number;
  bhavaDrishtiBala?: number;
  totalBhavabala?: number;
  rank?: number;
}

/** Lagna (Ascendant) data */
export interface LagnaData {
  // Main Lagna
  longitude: number;
  rashi: RashiNumber;
  degreeInSign: number;
  nakshatra: number;
  pada: number;
  
  // Special Lagnas
  horaLagna?: number;
  ghatiLagna?: number;
  bhavaLagna?: number;
  varnadaLagna?: number;
}

/** Chara Karaka (Jaimini) */
export interface CharaKaraka {
  karaka: 'AK' | 'AmK' | 'BK' | 'MK' | 'PK' | 'GK' | 'DK' | 'SK';
  karakaName: { en: string; ne: string };
  graha: GrahaId;
  degree: number;  // degree within sign (used for sorting)
}

/** Varga type identifiers */
export type VargaType = 'D1' | 'D2' | 'D3' | 'D4' | 'D7' | 'D9' | 'D10' | 'D12' | 'D16' | 'D20' | 'D24' | 'D27' | 'D30' | 'D40' | 'D45' | 'D60';

/** Divisional chart (Varga) */
export interface VargaChart {
  type: VargaType;
  name: { en: string; ne: string; sanskrit: string };
  division: number;
  signification: { en: string; ne: string };
  lagnaSign: RashiNumber;
  planetPositions: Record<string, RashiNumber>; // GrahaId | 'LG' → sign
}

export interface VargaPosition {
  grahaId: GrahaId;
  sign: RashiNumber;
  degreeInSign: number;
}

/** Varga Visesha (dignity classification across all 16 vargas) */
export type VargaViseshaLevel = 
  | 'Parijatamsha'
  | 'Uttamamsha'
  | 'Gopuramsha'
  | 'Simhasanamsha'
  | 'Paravatamsha'
  | 'Devalokamsha'
  | 'Brahmalokamsha'
  | 'Shrikanthamsha'
  | 'Shrivaishnavapadamsha';

/** Ashtakavarga data */
export interface AshtakavargaData {
  // Bhinnashtakavarga: for each planet, 12 signs with bindu count
  bhinna: Record<GrahaId | 'LA', number[]>;  // LA = Lagna
  
  // Sarvashtakavarga: total bindus per sign (max 56)
  sarva: number[];  // 12 values
  
  // After reductions
  trikonaShodhana?: number[];
  ekadhipatyaShodhana?: number[];
}

/** Complete Kundali result */
export interface KundaliResult {
  // Input
  birthData: BirthData;
  
  // Astronomical
  julianDay: number;
  ayanamsha: number;
  ayanamshaName: string;
  siderealTime: number;
  localApparentSiderealTime: number;
  obliquity: number;
  
  // Lagna
  lagna: LagnaData;
  
  // Grahas
  grahas: GrahaPosition[];
  
  // Bhavas
  bhavas: BhavaData[];
  
  // Chara Karakas
  charaKarakas: CharaKaraka[];
  
  // Panchanga
  panchanga: PanchangaData;
  
  // Divisional Charts
  vargaCharts: VargaChart[];
  
  // Strengths
  shadbala?: GrahaShadbala[];
  ashtakavarga?: AshtakavargaData;
  
  // Dasha
  dasha?: DashaData;
  
  // Yogas
  yogas?: DetectedYoga[];
}

/** Detected Yoga */
export interface DetectedYoga {
  id: string;
  name: { en: string; ne: string; sanskrit: string };
  category: 'mahapurusha' | 'raja' | 'dhana' | 'nabhasa' | 'chandra' | 'surya' | 'neechaBhanga' | 'viparita' | 'specific';
  formation: { en: string; ne: string };  // why it formed
  result: { en: string; ne: string };     // classical interpretation
  strength: 'strong' | 'moderate' | 'weak';
  involvedGrahas: GrahaId[];
}

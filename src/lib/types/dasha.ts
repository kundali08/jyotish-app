/**
 * Dasha Type Definitions
 * Based on BPHS Ch. 46-50
 */

import { GrahaId } from './graha';

/** Supported dasha systems */
export type DashaSystemType = 'vimshottari' | 'yogini' | 'ashtottari' | 'kalachakra' | 'chara' | 'narayana' | 'tribhagi';

/** A single dasha period */
export interface DashaPeriod {
  lord: GrahaId;
  lordName: { en: string; ne: string };

  startDate: string;  // YYYY-MM-DD
  endDate: string;
  durationDays: number;
  durationYears: number;

  level: number;  // 1=Maha, 2=Antar, 3=Pratyanta, 4=Sukshma, 5=Prana
  levelName: { en: string; ne: string };

  subPeriods: DashaPeriod[];
}

/** A complete dasha system calculation */
export interface DashaSystem {
  system: DashaSystemType;
  systemName: { en: string; ne: string };
  totalYears: number;
  startingLord: GrahaId;
  balanceAtBirth: number;
  periods: DashaPeriod[];
}

/** Complete dasha data for a kundali */
export interface DashaData {
  vimshottari: DashaSystem;
  tribhagi: DashaSystem;
  yogini: DashaSystem;

  // Currently active periods
  currentMaha?: DashaPeriod;
  currentAntar?: DashaPeriod;
  currentPratyanta?: DashaPeriod;
}

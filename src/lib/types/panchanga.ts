/**
 * Panchanga Type Definitions
 * Based on BPHS Ch. 3 — Five limbs of time
 * Enhanced with all traditional timing elements
 */

import { GrahaId } from './graha';

/** Tithi data */
export interface TithiData {
  number: number;           // 1-30
  name: { en: string; ne: string };
  paksha: 'shukla' | 'krishna';
  pakshaName: { en: string; ne: string };
  lord: GrahaId;
  completionTime?: string;  // local time when tithi completes
  type: 'nanda' | 'bhadra' | 'jaya' | 'rikta' | 'purna';
}

/** Vara (Weekday) data */
export interface VaraData {
  number: number;  // 0=Sunday ... 6=Saturday
  name: { en: string; ne: string };
  lord: GrahaId;
  horaLord: GrahaId;  // hora lord at birth time
}

/** Nakshatra data for panchanga */
export interface NakshatraPanchangaData {
  number: number;  // 1-27
  name: { en: string; ne: string; sanskrit: string };
  pada: number;    // 1-4
  lord: GrahaId;
  completionTime?: string;

  // Attributes
  deity: { en: string; ne: string };
  gana: 'deva' | 'manushya' | 'rakshasa';
  ganaName: { en: string; ne: string };
  nadi: 'aadi' | 'madhya' | 'antya';
  nadiName: { en: string; ne: string };
  varna: 'brahmin' | 'kshatriya' | 'vaishya' | 'shudra';
  varnaName: { en: string; ne: string };
  namaksher: { en: string; ne: string };
  vashya: string;
  yoni: { en: string; ne: string };
  tatva: 'prithvi' | 'jala' | 'agni' | 'vayu' | 'akasha';
  tatvaName: { en: string; ne: string };
}

/** Yoga (27 Nithya Yogas — NOT astrological yogas) */
export interface NithyaYogaData {
  number: number;  // 1-27
  name: { en: string; ne: string };
  quality: 'shubha' | 'ashubha' | 'mishra';
  qualityName: { en: string; ne: string };
  completionTime?: string;
}

/** Karana data */
export interface KaranaData {
  number: number;
  name: { en: string; ne: string };
  lord: string;
  type: 'sthira' | 'chara';
  completionTime?: string;
}

/** Sun/Moon rise/set times */
export interface RiseSetTimes {
  sunrise: string;   // local time HH:MM:SS
  sunset: string;
  moonrise: string;
  moonset: string;

  sunriseJD: number;
  sunsetJD: number;
}

/** Muhurta timing */
export interface MuhurtaTimings {
  rahukala: { start: string; end: string };
  yamaghanta: { start: string; end: string };
  gulikaKala: { start: string; end: string };
  abhijitMuhurta: { start: string; end: string };
}

/** Traditional Kala (time) computations */
export interface KalaData {
  // इष्टकाल — Ishta Kala (elapsed time from sunrise to birth in ghatis)
  ishtaKala: {
    ghati: number;    // 1 ghati = 24 minutes
    pala: number;     // 1 pala = 24 seconds
    vipala: number;   // fractional
    totalGhati: number;
    display: string;
  };

  // दिनमान — Dinamana (day duration in ghatis)
  dinamana: {
    ghati: number;
    pala: number;
    totalGhati: number;
    hours: number;
    display: string;
  };

  // रात्रिमान — Ratrimana (night duration in ghatis)
  ratrimana: {
    ghati: number;
    pala: number;
    totalGhati: number;
    hours: number;
    display: string;
  };

  // भभोग — Bha Bhoga (total duration of current nakshatra)
  bhaBhoga: {
    ghati: number;
    pala: number;
    totalGhati: number;
    display: string;
  };

  // भायात — Bhayat (elapsed portion of current nakshatra)
  bhayat: {
    ghati: number;
    pala: number;
    totalGhati: number;
    display: string;
  };

  // भोग्य — Bhogya (remaining portion of current nakshatra)
  bhogya: {
    ghati: number;
    pala: number;
    totalGhati: number;
    display: string;
  };

  // नक्षत्र उदय — Nakshatra Udaya (time of nakshatra rise)
  nakshatraUdaya: string;  // HH:MM:SS local time

  // सूर्योदय लग्न — Suryodaya Lagna (ascendant at sunrise)
  suryodayaLagna: {
    rashi: number;
    degree: number;
    display: string;
  };
}

/** Complete Panchanga data */
export interface PanchangaData {
  tithi: TithiData;
  vara: VaraData;
  nakshatra: NakshatraPanchangaData;
  yoga: NithyaYogaData;
  karana: KaranaData;

  riseSets: RiseSetTimes;
  muhurta: MuhurtaTimings;
  kala: KalaData;
}

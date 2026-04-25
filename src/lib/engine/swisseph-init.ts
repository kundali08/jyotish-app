/**
 * Swiss Ephemeris Initialization & Helpers
 * Core astronomical calculation interface
 * 
 * Uses the swisseph npm package (Node.js C bindings to Swiss Ephemeris)
 * All calculations use sidereal zodiac with Lahiri ayanamsha by default.
 */

import swisseph from 'swisseph';

// ─── Ayanamsha Constants ───
export const AYANAMSHA = {
  LAHIRI: swisseph.SE_SIDM_LAHIRI,
  KP: swisseph.SE_SIDM_LAHIRI, // KP uses Lahiri (Chitrapaksha)
  RAMAN: swisseph.SE_SIDM_RAMAN,
  YUKTESHWAR: swisseph.SE_SIDM_YUKTESHWAR,
} as const;

export type AyanamshaType = keyof typeof AYANAMSHA;

// ─── Planet Codes ───
export const PLANET_CODES = {
  SU: swisseph.SE_SUN,
  MO: swisseph.SE_MOON,
  MA: swisseph.SE_MARS,
  ME: swisseph.SE_MERCURY,
  JU: swisseph.SE_JUPITER,
  VE: swisseph.SE_VENUS,
  SA: swisseph.SE_SATURN,
  RA: swisseph.SE_MEAN_NODE,   // Rahu = Mean North Node
  // KE is computed as Rahu + 180°
} as const;

// ─── Calculation Flags ───
export const CALC_FLAGS = swisseph.SEFLG_SIDEREAL | swisseph.SEFLG_SPEED;

/**
 * Set the ayanamsha mode for all subsequent calculations
 */
export function setAyanamsha(type: AyanamshaType = 'LAHIRI'): void {
  swisseph.swe_set_sid_mode(AYANAMSHA[type], 0, 0);
}

/**
 * Convert a date/time to Julian Day Number
 * @param year - Gregorian year
 * @param month - Month (1-12)
 * @param day - Day (1-31)
 * @param hour - Hour in decimal (e.g., 14.5 for 2:30 PM)
 * @returns Julian Day Number
 */
export function dateToJulianDay(
  year: number, month: number, day: number, hour: number
): number {
  const result = swisseph.swe_julday(year, month, day, hour, swisseph.SE_GREG_CAL);
  return result;
}

/**
 * Convert hour, minute, second to decimal hours
 */
export function toDecimalHours(hour: number, minute: number, second: number): number {
  return hour + minute / 60 + second / 3600;
}

/**
 * Convert local time to UT by subtracting timezone offset
 */
export function localToUT(decimalHours: number, timezoneOffsetHours: number): number {
  return decimalHours - timezoneOffsetHours;
}

/**
 * Calculate sidereal position of a planet
 * @returns Object with longitude, latitude, distance, speed
 */
export function calcPlanetPosition(julianDay: number, planetCode: number): {
  longitude: number;
  latitude: number;
  distance: number;
  speedLong: number;
  speedLat: number;
  speedDist: number;
  error?: string;
} {
  const result = swisseph.swe_calc_ut(julianDay, planetCode, CALC_FLAGS) as {
    longitude: number;
    latitude: number;
    distance: number;
    longitudeSpeed: number;
    latitudeSpeed: number;
    distanceSpeed: number;
    error?: string;
  };
  
  if (result.error) {
    return {
      longitude: 0, latitude: 0, distance: 0,
      speedLong: 0, speedLat: 0, speedDist: 0,
      error: result.error,
    };
  }
  
  return {
    longitude: result.longitude,
    latitude: result.latitude,
    distance: result.distance,
    speedLong: result.longitudeSpeed,
    speedLat: result.latitudeSpeed,
    speedDist: result.distanceSpeed,
  };
}

/**
 * Calculate Ascendant (Lagna) and house cusps
 * Uses Equal house system, converts tropical → sidereal
 * 
 * IMPORTANT: swe_houses() returns TROPICAL values.
 * We must subtract the ayanamsha to get sidereal positions,
 * matching the sidereal planet positions from swe_calc_ut(SEFLG_SIDEREAL).
 */
export function calcAscendant(julianDay: number, latitude: number, longitude: number): {
  ascendant: number;
  mc: number;         // Midheaven
  armc: number;       // ARMC (sidereal time in degrees)
  vertex: number;
  equatorialAsc: number;
  cusps: number[];    // 12 house cusps
} {
  // Use Equal house system ('E') for traditional Vedic astrology
  const result = swisseph.swe_houses(julianDay, latitude, longitude, 'E') as {
    ascendant: number;
    mc: number;
    armc: number;
    vertex: number;
    equatorialAscendant: number;
    house: number[];
  };
  
  // swe_houses returns TROPICAL — subtract ayanamsha for SIDEREAL
  const ayanamsha = swisseph.swe_get_ayanamsa_ut(julianDay);
  const toSidereal = (tropDeg: number) => ((tropDeg - ayanamsha) % 360 + 360) % 360;

  console.log(`[LAGNA] Tropical Asc: ${result.ascendant.toFixed(4)}°, Ayanamsha: ${ayanamsha.toFixed(4)}°, Sidereal Asc: ${toSidereal(result.ascendant).toFixed(4)}°`);

  return {
    ascendant: toSidereal(result.ascendant),
    mc: toSidereal(result.mc),
    armc: result.armc,  // ARMC stays tropical (it's sidereal time in degrees)
    vertex: toSidereal(result.vertex),
    equatorialAsc: toSidereal(result.equatorialAscendant),
    cusps: result.house.slice(0, 12).map(toSidereal),
  };
}

/**
 * Get ayanamsha value for a given Julian Day
 */
export function getAyanamshaValue(julianDay: number): number {
  return swisseph.swe_get_ayanamsa_ut(julianDay);
}

/**
 * Calculate sunrise and sunset times
 */
export function calcSunrise(julianDay: number, latitude: number, longitude: number, altitude: number = 0): {
  sunrise: number;
  sunset: number;
} {
  const riseResult = swisseph.swe_rise_trans(
    julianDay,          // tjd_ut
    swisseph.SE_SUN,    // ipl
    '',                 // starname (empty for planets)
    0,                  // epheflag
    swisseph.SE_CALC_RISE | swisseph.SE_BIT_DISC_CENTER, // rsmi
    longitude,          // geographic longitude
    latitude,           // geographic latitude
    altitude,           // height
    0,                  // atpress (atmospheric pressure, 0 = default)
    0                   // attemp (atmospheric temperature, 0 = default)
  ) as { transitTime?: number; error?: string };
  
  const setResult = swisseph.swe_rise_trans(
    julianDay,
    swisseph.SE_SUN,
    '',
    0,
    swisseph.SE_CALC_SET | swisseph.SE_BIT_DISC_CENTER,
    longitude,
    latitude,
    altitude,
    0,
    0
  ) as { transitTime?: number; error?: string };
  
  return {
    sunrise: riseResult.transitTime || julianDay,
    sunset: setResult.transitTime || julianDay + 0.5,
  };
}

/**
 * Convert Julian Day to calendar date
 */
export function julianDayToDate(jd: number): {
  year: number; month: number; day: number;
  hour: number; minute: number; second: number;
} {
  const result = swisseph.swe_revjul(jd, swisseph.SE_GREG_CAL);
  const totalHours = result.hour;
  const hours = Math.floor(totalHours);
  const totalMinutes = (totalHours - hours) * 60;
  const minutes = Math.floor(totalMinutes);
  const seconds = Math.round((totalMinutes - minutes) * 60);
  
  return {
    year: result.year,
    month: result.month,
    day: result.day,
    hour: hours,
    minute: minutes,
    second: seconds,
  };
}

/**
 * Convert Julian Day time to local time string
 */
export function jdToLocalTimeString(jd: number, timezoneOffset: number): string {
  const utDate = julianDayToDate(jd);
  let localHour = utDate.hour + timezoneOffset;
  let day = utDate.day;
  
  if (localHour >= 24) { localHour -= 24; day += 1; }
  if (localHour < 0) { localHour += 24; day -= 1; }
  
  const h = Math.floor(localHour);
  const m = utDate.minute;
  const s = utDate.second;
  
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * Get obliquity of the ecliptic
 */
export function getObliquity(julianDay: number): number {
  const result = swisseph.swe_calc_ut(julianDay, swisseph.SE_ECL_NUT, 0) as { longitude: number };
  return result.longitude; // true obliquity
}

// Initialize with Lahiri ayanamsha on module load
setAyanamsha('LAHIRI');

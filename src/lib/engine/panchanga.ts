/**
 * Panchanga Calculator — Five Limbs of Time
 * BPHS Ch. 3 — Tithi, Vara, Nakshatra, Yoga, Karana
 * Enhanced with Ishta Kala, Dinamana, Bha Bhoga, Bhayat, Nakshatra Udaya
 */

import { PanchangaData, TithiData, VaraData, NakshatraPanchangaData, NithyaYogaData, KaranaData, KalaData } from '../types/panchanga';
import { GrahaPosition } from '../types/graha';
import { TITHIS, NITHYA_YOGAS, KARANAS, VARAS, HORA_SEQUENCE } from '../constants/tithis';
import { NAKSHATRAS, getNakshatraFromLongitude, NAKSHATRA_SPAN } from '../constants/nakshatras';
import { getRashiFromLongitude, getDegreeInSign } from '../constants/rashis';
import { RASHIS } from '../constants/rashis';
import { calcSunrise, jdToLocalTimeString, dateToJulianDay, toDecimalHours, localToUT, calcPlanetPosition, PLANET_CODES, calcAscendant, CALC_FLAGS } from './swisseph-init';

// ─── Helpers ───

/** Convert decimal hours to Ghati-Pala-Vipala */
function hoursToGhatiPala(hours: number): { ghati: number; pala: number; vipala: number; totalGhati: number; display: string } {
  const absHours = Math.abs(hours);
  const totalGhati = absHours * 2.5; // 1 hour = 2.5 ghati (60/24)
  const ghati = Math.floor(totalGhati);
  const remainPala = (totalGhati - ghati) * 60;
  const pala = Math.floor(remainPala);
  const vipala = Math.round((remainPala - pala) * 60);
  return {
    ghati, pala, vipala, totalGhati,
    display: `${ghati} घटी ${pala} पल ${vipala} विपल`,
  };
}

function formatTime(h: number): string {
  const hours = Math.floor(h);
  const mins = Math.round((h - hours) * 60);
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

// ─── Tithi ───
export function calculateTithi(sunLon: number, moonLon: number): TithiData {
  const diff = ((moonLon - sunLon) % 360 + 360) % 360;
  const tithiNumber = Math.floor(diff / 12) + 1;
  const tithiDef = TITHIS[(tithiNumber - 1) % 30];
  const paksha: 'shukla' | 'krishna' = tithiNumber <= 15 ? 'shukla' : 'krishna';

  return {
    number: tithiNumber,
    name: tithiDef.name,
    paksha,
    pakshaName: paksha === 'shukla'
      ? { en: 'Shukla (Waxing)', ne: 'शुक्ल पक्ष' }
      : { en: 'Krishna (Waning)', ne: 'कृष्ण पक्ष' },
    lord: tithiDef.lord,
    type: tithiDef.type,
  };
}

// ─── Vara ───
export function calculateVara(julianDay: number, birthHourDecimal: number): VaraData {
  const dayOfWeek = Math.floor(julianDay + 1.5) % 7;
  const vara = VARAS[dayOfWeek];
  const hoursFromSunrise = Math.max(0, birthHourDecimal - 6);
  const horaIndex = Math.floor(hoursFromSunrise) % 7;
  const hora = HORA_SEQUENCE[(vara.number * 24 + Math.floor(hoursFromSunrise)) % 7];

  return {
    number: dayOfWeek,
    name: vara.name,
    lord: vara.lord,
    horaLord: hora || vara.lord,
  };
}

// ─── Nakshatra (Panchanga) ───
export function calculateNakshatraPanchanga(moonLon: number): NakshatraPanchangaData {
  const { nakshatra, pada } = getNakshatraFromLongitude(moonLon);
  const nakDef = NAKSHATRAS[nakshatra - 1];

  const nadiMap = { aadi: { en: 'Aadi', ne: 'आदि' }, madhya: { en: 'Madhya', ne: 'मध्य' }, antya: { en: 'Antya', ne: 'अन्त्य' } };
  const varnaMap = { brahmin: { en: 'Brahmin', ne: 'ब्राह्मण' }, kshatriya: { en: 'Kshatriya', ne: 'क्षत्रिय' }, vaishya: { en: 'Vaishya', ne: 'वैश्य' }, shudra: { en: 'Shudra', ne: 'शूद्र' } };
  const ganaMap = { deva: { en: 'Deva', ne: 'देव' }, manushya: { en: 'Manushya', ne: 'मनुष्य' }, rakshasa: { en: 'Rakshasa', ne: 'राक्षस' } };
  const tatvaMap = { prithvi: { en: 'Prithvi', ne: 'पृथ्वी' }, jala: { en: 'Jala', ne: 'जल' }, agni: { en: 'Agni', ne: 'अग्नि' }, vayu: { en: 'Vayu', ne: 'वायु' }, akasha: { en: 'Akasha', ne: 'आकाश' } };

  return {
    number: nakshatra,
    name: nakDef.name,
    pada,
    lord: nakDef.lord,
    deity: nakDef.deity || { en: '', ne: '' },
    gana: nakDef.gana || 'manushya',
    ganaName: ganaMap[nakDef.gana] || ganaMap.manushya,
    nadi: nakDef.nadi || 'aadi',
    nadiName: nadiMap[nakDef.nadi] || nadiMap.aadi,
    varna: nakDef.varna || 'shudra',
    varnaName: varnaMap[nakDef.varna] || varnaMap.shudra,
    vashya: nakDef.vashya || '',
    yoni: nakDef.yoni || { en: '', ne: '' },
    tatva: nakDef.tatva || 'prithvi',
    tatvaName: tatvaMap[nakDef.tatva] || tatvaMap.prithvi,
    namaksher: nakDef.namaksher?.[pada - 1] || { en: '', ne: '' },
  };
}

// ─── Nithya Yoga ───
export function calculateNithyaYoga(sunLon: number, moonLon: number): NithyaYogaData {
  const sum = (sunLon + moonLon) % 360;
  const yogaNumber = Math.floor(sum / (360 / 27)) + 1;
  const yogaDef = NITHYA_YOGAS[(yogaNumber - 1) % 27];

  return {
    number: yogaNumber,
    name: yogaDef.name,
    quality: (yogaDef as any).nature || 'mishra',
    qualityName: { en: (yogaDef as any).nature || 'Mishra', ne: (yogaDef as any).nature || 'मिश्र' },
  };
}

// ─── Karana ───
export function calculateKarana(sunLon: number, moonLon: number): KaranaData {
  const diff = ((moonLon - sunLon) % 360 + 360) % 360;
  const karanaNumber = Math.floor(diff / 6) + 1; // 1-60

  // Map karana number (1-60) to the 11 karana types:
  // Karana 1 = Kimstughna (index 10, sthira), then 7 chara karanas cycle
  // Karanas 2-57 cycle through 7 chara types (indices 0-6)
  // Karana 58 = Shakuni (7), 59 = Chatushpada (8), 60 = Naga (9)
  let karanaIndex: number;
  if (karanaNumber === 1) {
    karanaIndex = 10; // Kimstughna
  } else if (karanaNumber >= 58) {
    karanaIndex = karanaNumber - 51; // 58->7(Shakuni), 59->8(Chatushpada), 60->9(Naga)
  } else {
    karanaIndex = ((karanaNumber - 2) % 7); // Cycle through 7 chara karanas (0-6)
  }

  const karanaDef = KARANAS[karanaIndex];
  if (!karanaDef) {
    return {
      number: karanaNumber,
      name: { en: 'Unknown', ne: 'अज्ञात' },
      lord: 'SU',
      type: 'chara',
    };
  }

  return {
    number: karanaNumber,
    name: karanaDef.name,
    lord: (karanaDef as any).lord || 'SU',
    type: karanaDef.type,
  };
}

// ─── Muhurta Timings ───
function calculateMuhurtaTimings(
  sunriseHour: number, sunsetHour: number, varaNumber: number
): {
  rahukala: { start: string; end: string };
  yamaghanta: { start: string; end: string };
  gulikaKala: { start: string; end: string };
  abhijitMuhurta: { start: string; end: string };
} {
  const dayDuration = sunsetHour - sunriseHour;
  const segment = dayDuration / 8;

  const rahuSegments = [8, 2, 7, 5, 6, 4, 3, 1]; // Sun to Sat (0-6)
  const yamaSegments = [5, 4, 3, 2, 1, 7, 6, 8];
  const gulikaSegments = [7, 6, 5, 4, 3, 2, 1, 8];

  const rSeg = rahuSegments[varaNumber % 7] - 1;
  const ySeg = yamaSegments[varaNumber % 7] - 1;
  const gSeg = gulikaSegments[varaNumber % 7] - 1;

  const midday = (sunriseHour + sunsetHour) / 2;

  return {
    rahukala: { start: formatTime(sunriseHour + rSeg * segment), end: formatTime(sunriseHour + (rSeg + 1) * segment) },
    yamaghanta: { start: formatTime(sunriseHour + ySeg * segment), end: formatTime(sunriseHour + (ySeg + 1) * segment) },
    gulikaKala: { start: formatTime(sunriseHour + gSeg * segment), end: formatTime(sunriseHour + (gSeg + 1) * segment) },
    abhijitMuhurta: { start: formatTime(midday - 0.4), end: formatTime(midday + 0.4) },
  };
}

// ─── Kala (Time) Calculations ───
function calculateKala(
  birthHourDecimal: number,
  sunriseHour: number,
  sunsetHour: number,
  moonLon: number,
  moonSpeed: number,
  sunriseLagnaRashi: number,
  sunriseLagnaDeg: number,
): KalaData {
  // इष्टकाल — Ishta Kala: time elapsed from sunrise to birth
  let elapsedHours = birthHourDecimal - sunriseHour;
  if (elapsedHours < 0) {
    elapsedHours += 24;
  }
  const ishtaKala = hoursToGhatiPala(elapsedHours);

  // दिनमान — Dinamana: total day duration (sunrise to sunset)
  const dayHours = sunsetHour - sunriseHour;
  const dinamanaGP = hoursToGhatiPala(dayHours);
  const dinamana = { ...dinamanaGP, hours: dayHours };

  // रात्रिमान — Ratrimana: night duration (sunset to next sunrise ≈ 24 - dayHours)
  const nightHours = 24 - dayHours;
  const ratrimanaGP = hoursToGhatiPala(nightHours);
  const ratrimana = { ...ratrimanaGP, hours: nightHours };

  // भभोग — Bha Bhoga: total transit time of Moon through current nakshatra
  // Moon speed is in degrees/day; nakshatra span = 13°20' = 13.3333°
  const transitHours = (NAKSHATRA_SPAN / Math.abs(moonSpeed)) * 24;
  const bhaBhoga = hoursToGhatiPala(transitHours);

  // भायात — Bhayat: how much of nakshatra Moon has already traversed
  const posInNak = moonLon % NAKSHATRA_SPAN;
  const elapsedFraction = posInNak / NAKSHATRA_SPAN;
  const bhayatHours = transitHours * elapsedFraction;
  const bhayat = hoursToGhatiPala(bhayatHours);

  // भोग्य — Bhogya: remaining portion of nakshatra
  const bhogyaHours = transitHours - bhayatHours;
  const bhogya = hoursToGhatiPala(bhogyaHours);

  // नक्षत्र उदय — when current nakshatra started (approximate)
  const nakshatraStartedAgo = bhayatHours; // hours ago
  const nakshatraUdayaHour = birthHourDecimal - nakshatraStartedAgo;
  const nakshatraUdaya = formatTime(((nakshatraUdayaHour % 24) + 24) % 24);

  // सूर्योदय लग्न — Ascendant at sunrise
  const suryodayaLagna = {
    rashi: sunriseLagnaRashi,
    degree: sunriseLagnaDeg,
    display: `${RASHIS[sunriseLagnaRashi - 1]?.name?.en || ''} ${sunriseLagnaDeg.toFixed(1)}°`,
  };

  return {
    ishtaKala,
    dinamana,
    ratrimana,
    bhaBhoga,
    bhayat,
    bhogya,
    nakshatraUdaya,
    suryodayaLagna,
  };
}

// ─── Complete Panchanga ───
export function calculatePanchanga(
  grahas: GrahaPosition[],
  julianDay: number,
  latitude: number,
  longitude: number,
  timezoneOffset: number,
  birthHourDecimal: number
): PanchangaData {
  const sun = grahas.find(g => g.id === 'SU')!;
  const moon = grahas.find(g => g.id === 'MO')!;

  const tithi = calculateTithi(sun.longitude, moon.longitude);
  const vara = calculateVara(julianDay, birthHourDecimal);
  const nakshatra = calculateNakshatraPanchanga(moon.longitude);
  const yoga = calculateNithyaYoga(sun.longitude, moon.longitude);
  const karana = calculateKarana(sun.longitude, moon.longitude);

  // ─── CRITICAL FIX: Sunrise/Sunset ───
  // swe_rise_trans searches FORWARD from the given JD.
  // If birth is at 10:30 AM and we pass that JD, it finds NEXT sunrise (next day).
  // We must pass a JD BEFORE sunrise — use start of day (0h UT = previous midnight).
  
  // Calculate JD at 0h UT of the birth day
  const jdMidnight = Math.floor(julianDay - 0.5) + 0.5; // JD at 0h UT
  
  const { sunrise: sunriseJD, sunset: sunsetJD } = calcSunrise(jdMidnight, latitude, longitude);
  const sunriseStr = jdToLocalTimeString(sunriseJD, timezoneOffset);
  const sunsetStr = jdToLocalTimeString(sunsetJD, timezoneOffset);

  // Debug: verify sunrise/sunset times
  console.log(`[PANCHANGA] Birth JD=${julianDay.toFixed(6)}, Midnight JD=${jdMidnight.toFixed(6)}`);
  console.log(`[PANCHANGA] Sunrise JD=${sunriseJD.toFixed(6)}, Local=${sunriseStr}, TZ=${timezoneOffset}`);
  console.log(`[PANCHANGA] Sunset  JD=${sunsetJD.toFixed(6)}, Local=${sunsetStr}`);
  console.log(`[PANCHANGA] Location: lat=${latitude}, lon=${longitude}`);

  const sunriseParts = sunriseStr.split(':').map(Number);
  const sunsetParts = sunsetStr.split(':').map(Number);
  const sunriseHour = sunriseParts[0] + sunriseParts[1] / 60 + (sunriseParts[2] || 0) / 3600;
  const sunsetHour = sunsetParts[0] + sunsetParts[1] / 60 + (sunsetParts[2] || 0) / 3600;

  // Validate sunrise is reasonable (4-8 AM range)
  if (sunriseHour < 3 || sunriseHour > 9) {
    console.error(`[PANCHANGA] WARNING: Sunrise ${sunriseStr} seems wrong for lat=${latitude}, lon=${longitude}`);
  }

  console.log(`[PANCHANGA] Sunrise hour=${sunriseHour.toFixed(4)}, Sunset hour=${sunsetHour.toFixed(4)}`);
  console.log(`[PANCHANGA] Birth hour=${birthHourDecimal.toFixed(4)}, Ishta Kala=${(birthHourDecimal - sunriseHour).toFixed(4)} hrs`);

  const muhurta = calculateMuhurtaTimings(sunriseHour, sunsetHour, vara.number);

  // Calculate Suryodaya Lagna (ascendant at sunrise)
  let sunriseLagnaRashi = 1;
  let sunriseLagnaDeg = 0;
  try {
    const sunriseResult = calcAscendant(sunriseJD, latitude, longitude);
    sunriseLagnaRashi = getRashiFromLongitude(sunriseResult.ascendant);
    sunriseLagnaDeg = getDegreeInSign(sunriseResult.ascendant);
  } catch { /* fallback */ }

  // Kala computations
  const kala = calculateKala(
    birthHourDecimal, sunriseHour, sunsetHour,
    moon.longitude, moon.speed,
    sunriseLagnaRashi, sunriseLagnaDeg,
  );

  return {
    tithi, vara, nakshatra, yoga, karana,
    riseSets: {
      sunrise: sunriseStr, sunset: sunsetStr,
      moonrise: '--:--:--', moonset: '--:--:--',
      sunriseJD, sunsetJD,
    },
    muhurta,
    kala,
  };
}

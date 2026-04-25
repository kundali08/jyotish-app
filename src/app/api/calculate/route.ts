/**
 * API Route: /api/calculate
 * Main calculation endpoint — accepts birth data, returns full kundali
 */

import { calculateGrahaPositions } from '@/lib/engine/grahaspashta';
import { calculateBhavas, calculateCharaKarakas, calculateLagna } from '@/lib/engine/lagna';
import { calculatePanchanga } from '@/lib/engine/panchanga';
import { calculateVimshottariDasha, findCurrentDasha } from '@/lib/engine/dasha-vimshottari';
import { calculateTribhagiDasha } from '@/lib/engine/dasha-tribhagi';
import { calculateYoginiDasha } from '@/lib/engine/dasha-yogini';
import { calculateAllVargas } from '@/lib/engine/varga';
import { calculateShadbala } from '@/lib/engine/shadbala';
import { calculateBhavabala } from '@/lib/engine/bhavabala';
import { calculateAshtakavarga } from '@/lib/engine/ashtakavarga';
import { detectYogas } from '@/lib/engine/yogas';
import { adToBS, bsToAD } from '@/lib/calendar/bs-ad-converter';
import { dateToJulianDay, toDecimalHours, localToUT, getAyanamshaValue, getObliquity, setAyanamsha } from '@/lib/engine/swisseph-init';
import type { KundaliResult } from '@/lib/types/chart';
import type { AyanamshaType } from '@/lib/engine/swisseph-init';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name, gotra, fatherName, motherName, gender,
      year, month, day,
      hour, minute, second,
      isTimeUnknown,
      latitude, longitude, timezone, timezoneName,
      place,
      calendarType,
      ayanamsha = 'LAHIRI',
    } = body;

    if (!year || !month || !day || latitude === undefined || longitude === undefined) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const birthHour = isTimeUnknown ? 12 : (hour || 0);
    const birthMinute = isTimeUnknown ? 0 : (minute || 0);
    const birthSecond = isTimeUnknown ? 0 : (second || 0);
    const tz = timezone || 5.75;

    let dateAD = { year, month, day };
    let dateBS = { year, month, day };

    if (calendarType === 'bs') {
      dateBS = { year, month, day };
      dateAD = bsToAD(dateBS);
    } else {
      dateAD = { year, month, day };
      dateBS = adToBS(dateAD);
    }

    setAyanamsha(ayanamsha as AyanamshaType);

    const decimalHours = toDecimalHours(birthHour, birthMinute, birthSecond);
    const utHours = localToUT(decimalHours, tz);
    let utDay = dateAD.day;
    let utHourAdj = utHours;
    if (utHours < 0) { utHourAdj += 24; utDay -= 1; }
    else if (utHours >= 24) { utHourAdj -= 24; utDay += 1; }
    const jd = dateToJulianDay(dateAD.year, dateAD.month, utDay, utHourAdj);

    // 1. Graha Spashta — all 9 planet positions
    const grahas = calculateGrahaPositions(
      dateAD.year, dateAD.month, dateAD.day,
      birthHour, birthMinute, birthSecond,
      tz, ayanamsha as AyanamshaType
    );

    // 2. Lagna & Bhavas
    const { lagna, cusps, armc } = calculateLagna(
      dateAD.year, dateAD.month, dateAD.day,
      birthHour, birthMinute, birthSecond,
      tz, latitude, longitude
    );
    let bhavas = calculateBhavas(lagna.longitude, grahas);

    // Debug: log all positions for verification
    console.log('[KUNDALI] Planet positions:');
    for (const g of grahas) {
      console.log(`  ${g.id}: ${g.longitude.toFixed(4)}° Rashi=${g.rashi} Deg=${g.degreeInSign.toFixed(2)}° ${g.isRetrograde ? '(R)' : ''} ${g.dignity}`);
    }
    console.log(`  LG: ${lagna.longitude.toFixed(4)}° Rashi=${lagna.rashi}`);

    // 3. Chara Karakas
    const charaKarakas = calculateCharaKarakas(grahas);

    // 4. Panchanga
    let panchanga;
    try {
      panchanga = calculatePanchanga(grahas, jd, latitude, longitude, tz, decimalHours);
    } catch (e) {
      console.error('[API] Panchanga failed:', e);
      throw e;
    }

    // 5. Varga Charts (all 16 Shodashvarga)
    let vargaCharts: ReturnType<typeof calculateAllVargas> = [];
    try {
      vargaCharts = calculateAllVargas(grahas, lagna.longitude);
    } catch (e) {
      console.error('[API] Varga failed:', e);
      vargaCharts = [];
    }

    // 6. Dasha — Vimshottari (3 levels: Maha, Antar, Pratyanta)
    const birthDateObj = new Date(dateAD.year, dateAD.month - 1, dateAD.day);
    const moon = grahas.find(g => g.id === 'MO')!;
    const vimshottari = calculateVimshottariDasha(moon.longitude, birthDateObj, 3);
    const tribhagi = calculateTribhagiDasha(moon.longitude, birthDateObj);
    const yogini = calculateYoginiDasha(moon.longitude, birthDateObj, 3);

    // 6b. Shadbala
    let shadbala;
    try {
      const tithiNum = panchanga.tithi.number;
      shadbala = calculateShadbala(grahas, lagna.longitude, decimalHours, panchanga.vara.number, tithiNum);
    } catch (e) {
      console.error('[API] Shadbala failed:', e);
      shadbala = [] as any;
    }

    // 6b.5. Bhavabala
    try {
      if (shadbala && shadbala.length > 0) {
        bhavas = calculateBhavabala(bhavas, grahas, shadbala);
      }
    } catch (e) {
      console.error('[API] Bhavabala failed:', e);
    }

    // 6c. Ashtakavarga
    let ashtakavarga;
    try {
      ashtakavarga = calculateAshtakavarga(grahas, lagna.longitude);
    } catch (e) {
      console.error('[API] Ashtakavarga failed:', e);
      ashtakavarga = undefined;
    }

    // 6d. Yoga Detection
    let yogas: ReturnType<typeof detectYogas> = [];
    try {
      yogas = detectYogas(grahas, lagna, bhavas);
    } catch (e) {
      console.error('[API] Yoga detection failed:', e);
    }

    // Find currently running dasha
    const currentDasha = findCurrentDasha(vimshottari.periods, new Date());

    // 7. Ayanamsha & Meta
    const ayanamshaValue = getAyanamshaValue(jd);
    const obliquity = getObliquity(jd);
    const siderealTime = armc / 15;

    const result: KundaliResult = {
      birthData: {
        name: name || '',
        gotra: gotra || '',
        fatherName: fatherName || '',
        motherName: motherName || '',
        gender: gender || 'male',
        dateAD, dateBS,
        time: { hour: birthHour, minute: birthMinute, second: birthSecond },
        isTimeUnknown: !!isTimeUnknown,
        place: place || '',
        latitude, longitude,
        timezone: tz,
        timezoneName: timezoneName || 'Asia/Kathmandu',
      },
      julianDay: jd,
      ayanamsha: ayanamshaValue,
      ayanamshaName: ayanamsha,
      siderealTime,
      localApparentSiderealTime: siderealTime,
      obliquity,
      lagna,
      grahas,
      bhavas,
      charaKarakas,
      panchanga,
      vargaCharts,
      shadbala,
      ashtakavarga,
      dasha: {
        vimshottari,
        tribhagi,
        yogini,
        currentMaha: currentDasha.maha,
        currentAntar: currentDasha.antar,
        currentPratyanta: currentDasha.pratyanta,
      },
      yogas,
    };

    return Response.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Calculation failed';
    console.error('Calculation error:', error);
    return Response.json({ error: message }, { status: 500 });
  }
}

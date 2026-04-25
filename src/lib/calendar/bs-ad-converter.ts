/**
 * Bikram Sambat (BS) ↔ Gregorian (AD) Calendar Converter
 * Uses nepali-date-converter package with wrapper functions
 */

import NepaliDate from 'nepali-date-converter';

export interface BSDate {
  year: number;
  month: number;  // 1-12
  day: number;
}

export interface ADDate {
  year: number;
  month: number;  // 1-12
  day: number;
}

/** Nepali month names */
export const NEPALI_MONTHS: Array<{ en: string; ne: string }> = [
  { en: 'Baishakh', ne: 'बैशाख' },
  { en: 'Jestha', ne: 'जेठ' },
  { en: 'Ashadh', ne: 'असार' },
  { en: 'Shrawan', ne: 'साउन' },
  { en: 'Bhadra', ne: 'भदौ' },
  { en: 'Ashwin', ne: 'असोज' },
  { en: 'Kartik', ne: 'कात्तिक' },
  { en: 'Mangsir', ne: 'मंसिर' },
  { en: 'Poush', ne: 'पुष' },
  { en: 'Magh', ne: 'माघ' },
  { en: 'Falgun', ne: 'फाल्गुन' },
  { en: 'Chaitra', ne: 'चैत्र' },
];

/** English month names for display */
export const ENGLISH_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * Convert AD date to BS date
 */
export function adToBS(adDate: ADDate): BSDate {
  try {
    const npDate = new NepaliDate(new Date(adDate.year, adDate.month - 1, adDate.day));
    return {
      year: npDate.getYear(),
      month: npDate.getMonth() + 1, // NepaliDate months are 0-indexed
      day: npDate.getDate(),
    };
  } catch {
    // Fallback: rough approximation (BS ≈ AD + 56 years 8 months)
    return {
      year: adDate.year + 57,
      month: ((adDate.month + 8 - 1) % 12) + 1,
      day: adDate.day,
    };
  }
}

/**
 * Convert BS date to AD date
 */
export function bsToAD(bsDate: BSDate): ADDate {
  try {
    const npDate = new NepaliDate(bsDate.year, bsDate.month - 1, bsDate.day);
    const adDate = npDate.toJsDate();
    return {
      year: adDate.getFullYear(),
      month: adDate.getMonth() + 1,
      day: adDate.getDate(),
    };
  } catch {
    return {
      year: bsDate.year - 57,
      month: ((bsDate.month - 8 - 1 + 12) % 12) + 1,
      day: bsDate.day,
    };
  }
}

/**
 * Format BS date as string
 */
export function formatBSDate(date: BSDate, locale: 'en' | 'ne' = 'ne'): string {
  const monthName = NEPALI_MONTHS[date.month - 1]?.[locale] || '';
  return `${date.day} ${monthName} ${date.year}`;
}

/**
 * Format AD date as string
 */
export function formatADDate(date: ADDate): string {
  const monthName = ENGLISH_MONTHS[date.month - 1] || '';
  return `${monthName} ${date.day}, ${date.year}`;
}

/**
 * Get today's date in BS
 */
export function todayBS(): BSDate {
  const today = new Date();
  return adToBS({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
  });
}

/**
 * Language Context — Global bilingual system (English ↔ नेपाली)
 * Wraps entire app, persists choice in localStorage
 */
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type Locale = 'en' | 'ne';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (key: string) => string;
  tObj: <T extends { en: string; ne: string }>(obj: T) => string;
  formatNumber: (num: number | string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// UI translation strings
const translations: Record<Locale, Record<string, string>> = {
  en: {
    'app.title': 'Janma Kundali',
    'app.subtitle': 'Nepali Jyotish Kundali Software',
    'nav.birthChart': 'Birth Chart',
    'nav.vargaCharts': 'Varga Charts',
    'nav.panchanga': 'Panchanga',
    'nav.grahaspashta': 'Graha Spashta',
    'nav.shadbala': 'Shadbala',
    'nav.bhavabala': 'Bhavabala',
    'nav.ashtakavarga': 'Ashtakavarga',
    'nav.dasha': 'Dasha',
    'nav.yogas': 'Yogas',
    'nav.gochara': 'Gochara',
    'nav.kundaliMilan': 'Kundali Milan',
    'nav.report': 'Report',
    'form.name': 'Full Name',
    'form.gotra': 'Gotra (Optional)',
    'form.fatherName': 'Father\'s Name (Optional)',
    'form.motherName': 'Mother\'s Name (Optional)',
    'form.gender': 'Gender',
    'form.gender.male': 'Male',
    'form.gender.female': 'Female',
    'form.gender.other': 'Other',
    'form.dob': 'Date of Birth',
    'form.tob': 'Time of Birth',
    'form.pob': 'Place of Birth',
    'form.dateType': 'Calendar Type',
    'form.dateType.ad': 'AD (Gregorian)',
    'form.dateType.bs': 'BS (Bikram Sambat)',
    'form.unknownTime': 'Time unknown (use noon)',
    'form.submit': 'Generate Kundali',
    'form.calculating': 'Calculating...',
    'form.bsDate': 'BS Date',
    'form.adDate': 'AD Date',
    'form.year': 'Year',
    'form.month': 'Month',
    'form.day': 'Day',
    'form.hour': 'Hour',
    'form.minute': 'Minute',
    'form.second': 'Second',
    'form.ampm': 'AM/PM',
    'form.latitude': 'Latitude',
    'form.longitude': 'Longitude',
    'form.timezone': 'Timezone',
    'common.lagna': 'Ascendant',
    'common.rashi': 'Sign',
    'common.nakshatra': 'Nakshatra',
    'common.pada': 'Pada',
    'common.degree': 'Degree',
    'common.lord': 'Lord',
    'common.retrograde': 'Retrograde',
    'common.combust': 'Combust',
    'common.exalted': 'Exalted',
    'common.debilitated': 'Debilitated',
    'common.own': 'Own Sign',
    'common.moolatrikona': 'Moolatrikona',
    'common.vargottama': 'Vargottama',
    'common.speed': 'Speed (°/day)',
    'common.dignity': 'Dignity',
    'panchanga.tithi': 'Tithi',
    'panchanga.vara': 'Weekday',
    'panchanga.nakshatra': 'Nakshatra',
    'panchanga.yoga': 'Yoga',
    'panchanga.karana': 'Karana',
    'panchanga.sunrise': 'Sunrise',
    'panchanga.sunset': 'Sunset',
    'panchanga.paksha': 'Paksha',
    'panchanga.shukla': 'Shukla (Waxing)',
    'panchanga.krishna': 'Krishna (Waning)',
    'warning.unknownTime': 'Birth time is unknown. Using noon (12:00). Results may vary.',
  },
  ne: {
    'app.title': 'जन्मकुण्डली',
    'app.subtitle': 'नेपाली ज्योतिष कुण्डली सफ्टवेयर',
    'nav.birthChart': 'जन्मकुण्डली',
    'nav.vargaCharts': 'वर्ग चार्ट',
    'nav.panchanga': 'पञ्चाङ्ग',
    'nav.grahaspashta': 'ग्रहस्पष्ट',
    'nav.shadbala': 'षड्बल',
    'nav.bhavabala': 'भाव बल',
    'nav.ashtakavarga': 'अष्टकवर्ग',
    'nav.dasha': 'दशा',
    'nav.yogas': 'योग',
    'nav.gochara': 'गोचर',
    'nav.kundaliMilan': 'कुण्डली मिलान',
    'nav.report': 'रिपोर्ट',
    'form.name': 'पूरा नाम',
    'form.gotra': 'गोत्र (वैकल्पिक)',
    'form.fatherName': 'बुवाको नाम (वैकल्पिक)',
    'form.motherName': 'आमाको नाम (वैकल्पिक)',
    'form.gender': 'लिङ्ग',
    'form.gender.male': 'पुरुष',
    'form.gender.female': 'महिला',
    'form.gender.other': 'अन्य',
    'form.dob': 'जन्म मिति',
    'form.tob': 'जन्म समय',
    'form.pob': 'जन्म स्थान',
    'form.dateType': 'पात्रो प्रकार',
    'form.dateType.ad': 'ई.सं. (ग्रेगोरियन)',
    'form.dateType.bs': 'वि.सं. (विक्रम सम्वत)',
    'form.unknownTime': 'समय थाहा छैन (मध्यान्ह प्रयोग गर्ने)',
    'form.submit': 'कुण्डली बनाउनुहोस्',
    'form.calculating': 'गणना गर्दै...',
    'form.bsDate': 'वि.सं. मिति',
    'form.adDate': 'ई.सं. मिति',
    'form.year': 'वर्ष',
    'form.month': 'महिना',
    'form.day': 'गते',
    'form.hour': 'घण्टा',
    'form.minute': 'मिनेट',
    'form.second': 'सेकेन्ड',
    'form.ampm': 'बिहान/बेलुका',
    'form.latitude': 'अक्षांश',
    'form.longitude': 'देशान्तर',
    'form.timezone': 'समय क्षेत्र',
    'common.lagna': 'लग्न',
    'common.rashi': 'राशि',
    'common.nakshatra': 'नक्षत्र',
    'common.pada': 'पाद',
    'common.degree': 'अंश',
    'common.lord': 'स्वामी',
    'common.retrograde': 'वक्री',
    'common.combust': 'अस्त',
    'common.exalted': 'उच्च',
    'common.debilitated': 'नीच',
    'common.own': 'स्वगृह',
    'common.moolatrikona': 'मूलत्रिकोण',
    'common.vargottama': 'वर्गोत्तम',
    'common.speed': 'गति (°/दिन)',
    'common.dignity': 'अवस्था',
    'panchanga.tithi': 'तिथि',
    'panchanga.vara': 'वार',
    'panchanga.nakshatra': 'नक्षत्र',
    'panchanga.yoga': 'योग',
    'panchanga.karana': 'करण',
    'panchanga.sunrise': 'सूर्योदय',
    'panchanga.sunset': 'सूर्यास्त',
    'panchanga.paksha': 'पक्ष',
    'panchanga.shukla': 'शुक्ल (बढ्दो)',
    'panchanga.krishna': 'कृष्ण (घट्दो)',
    'warning.unknownTime': 'जन्म समय थाहा छैन। मध्यान्ह (१२:००) प्रयोग गरिएको छ। नतिजा फरक हुन सक्छ।',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ne'); // Default Nepali

  useEffect(() => {
    const saved = localStorage.getItem('jyotish-locale') as Locale | null;
    if (saved && (saved === 'en' || saved === 'ne')) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('jyotish-locale', newLocale);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === 'en' ? 'ne' : 'en');
  }, [locale, setLocale]);

  const t = useCallback((key: string): string => {
    return translations[locale][key] || translations['en'][key] || key;
  }, [locale]);

  // For bilingual objects like { en: "Sun", ne: "सूर्य" }
  const tObj = useCallback(<T extends { en: string; ne: string }>(obj: T): string => {
    if (!obj) return '';
    return obj[locale];
  }, [locale]);

  const formatNumber = useCallback((num: number | string): string => {
    if (locale !== 'ne') return String(num);
    const digits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return String(num).replace(/[0-9]/g, (d) => digits[parseInt(d)]);
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, toggleLocale, t, tObj, formatNumber }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

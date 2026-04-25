/**
 * Tithi, Nithya Yoga & Karana Constants — BPHS Ch. 3
 */

import { GrahaId } from '../types/graha';

// ─── TITHIS ───
export interface TithiDefinition {
  number: number; // 1-30 (1-15 Shukla, 16-30 Krishna)
  name: { en: string; ne: string };
  lord: GrahaId;
  type: 'nanda' | 'bhadra' | 'jaya' | 'rikta' | 'purna';
}

const TITHI_TYPES: Array<'nanda' | 'bhadra' | 'jaya' | 'rikta' | 'purna'> = ['nanda', 'bhadra', 'jaya', 'rikta', 'purna'];

export const TITHIS: TithiDefinition[] = [
  { number: 1,  name: { en: 'Pratipada', ne: 'प्रतिपदा' }, lord: 'SU', type: 'nanda' },
  { number: 2,  name: { en: 'Dwitiya', ne: 'द्वितीया' }, lord: 'MO', type: 'bhadra' },
  { number: 3,  name: { en: 'Tritiya', ne: 'तृतीया' }, lord: 'MA', type: 'jaya' },
  { number: 4,  name: { en: 'Chaturthi', ne: 'चतुर्थी' }, lord: 'ME', type: 'rikta' },
  { number: 5,  name: { en: 'Panchami', ne: 'पञ्चमी' }, lord: 'JU', type: 'purna' },
  { number: 6,  name: { en: 'Shashthi', ne: 'षष्ठी' }, lord: 'VE', type: 'nanda' },
  { number: 7,  name: { en: 'Saptami', ne: 'सप्तमी' }, lord: 'SA', type: 'bhadra' },
  { number: 8,  name: { en: 'Ashtami', ne: 'अष्टमी' }, lord: 'RA', type: 'jaya' },
  { number: 9,  name: { en: 'Navami', ne: 'नवमी' }, lord: 'SU', type: 'rikta' },
  { number: 10, name: { en: 'Dashami', ne: 'दशमी' }, lord: 'MO', type: 'purna' },
  { number: 11, name: { en: 'Ekadashi', ne: 'एकादशी' }, lord: 'MA', type: 'nanda' },
  { number: 12, name: { en: 'Dwadashi', ne: 'द्वादशी' }, lord: 'ME', type: 'bhadra' },
  { number: 13, name: { en: 'Trayodashi', ne: 'त्रयोदशी' }, lord: 'JU', type: 'jaya' },
  { number: 14, name: { en: 'Chaturdashi', ne: 'चतुर्दशी' }, lord: 'VE', type: 'rikta' },
  { number: 15, name: { en: 'Purnima', ne: 'पूर्णिमा' }, lord: 'SA', type: 'purna' },
  { number: 16, name: { en: 'Pratipada', ne: 'प्रतिपदा' }, lord: 'SU', type: 'nanda' },
  { number: 17, name: { en: 'Dwitiya', ne: 'द्वितीया' }, lord: 'MO', type: 'bhadra' },
  { number: 18, name: { en: 'Tritiya', ne: 'तृतीया' }, lord: 'MA', type: 'jaya' },
  { number: 19, name: { en: 'Chaturthi', ne: 'चतुर्थी' }, lord: 'ME', type: 'rikta' },
  { number: 20, name: { en: 'Panchami', ne: 'पञ्चमी' }, lord: 'JU', type: 'purna' },
  { number: 21, name: { en: 'Shashthi', ne: 'षष्ठी' }, lord: 'VE', type: 'nanda' },
  { number: 22, name: { en: 'Saptami', ne: 'सप्तमी' }, lord: 'SA', type: 'bhadra' },
  { number: 23, name: { en: 'Ashtami', ne: 'अष्टमी' }, lord: 'RA', type: 'jaya' },
  { number: 24, name: { en: 'Navami', ne: 'नवमी' }, lord: 'SU', type: 'rikta' },
  { number: 25, name: { en: 'Dashami', ne: 'दशमी' }, lord: 'MO', type: 'purna' },
  { number: 26, name: { en: 'Ekadashi', ne: 'एकादशी' }, lord: 'MA', type: 'nanda' },
  { number: 27, name: { en: 'Dwadashi', ne: 'द्वादशी' }, lord: 'ME', type: 'bhadra' },
  { number: 28, name: { en: 'Trayodashi', ne: 'त्रयोदशी' }, lord: 'JU', type: 'jaya' },
  { number: 29, name: { en: 'Chaturdashi', ne: 'चतुर्दशी' }, lord: 'VE', type: 'rikta' },
  { number: 30, name: { en: 'Amavasya', ne: 'औँसी' }, lord: 'SA', type: 'purna' },
];

// ─── 27 NITHYA YOGAS ───
export interface NithyaYogaDefinition {
  number: number;
  name: { en: string; ne: string };
  quality: 'shubha' | 'ashubha' | 'mishra';
}

export const NITHYA_YOGAS: NithyaYogaDefinition[] = [
  { number: 1,  name: { en: 'Vishkumbha', ne: 'विष्कम्भ' }, quality: 'ashubha' },
  { number: 2,  name: { en: 'Priti', ne: 'प्रीति' }, quality: 'shubha' },
  { number: 3,  name: { en: 'Ayushman', ne: 'आयुष्मान' }, quality: 'shubha' },
  { number: 4,  name: { en: 'Saubhagya', ne: 'सौभाग्य' }, quality: 'shubha' },
  { number: 5,  name: { en: 'Shobhana', ne: 'शोभन' }, quality: 'shubha' },
  { number: 6,  name: { en: 'Atiganda', ne: 'अतिगण्ड' }, quality: 'ashubha' },
  { number: 7,  name: { en: 'Sukarma', ne: 'सुकर्मा' }, quality: 'shubha' },
  { number: 8,  name: { en: 'Dhriti', ne: 'धृति' }, quality: 'shubha' },
  { number: 9,  name: { en: 'Shula', ne: 'शूल' }, quality: 'ashubha' },
  { number: 10, name: { en: 'Ganda', ne: 'गण्ड' }, quality: 'ashubha' },
  { number: 11, name: { en: 'Vriddhi', ne: 'वृद्धि' }, quality: 'shubha' },
  { number: 12, name: { en: 'Dhruva', ne: 'ध्रुव' }, quality: 'shubha' },
  { number: 13, name: { en: 'Vyaghata', ne: 'व्याघात' }, quality: 'ashubha' },
  { number: 14, name: { en: 'Harshana', ne: 'हर्षण' }, quality: 'shubha' },
  { number: 15, name: { en: 'Vajra', ne: 'वज्र' }, quality: 'ashubha' },
  { number: 16, name: { en: 'Siddhi', ne: 'सिद्धि' }, quality: 'shubha' },
  { number: 17, name: { en: 'Vyatipata', ne: 'व्यतिपात' }, quality: 'ashubha' },
  { number: 18, name: { en: 'Variyan', ne: 'वरीयान' }, quality: 'shubha' },
  { number: 19, name: { en: 'Parigha', ne: 'परिघ' }, quality: 'ashubha' },
  { number: 20, name: { en: 'Shiva', ne: 'शिव' }, quality: 'shubha' },
  { number: 21, name: { en: 'Siddha', ne: 'सिद्ध' }, quality: 'shubha' },
  { number: 22, name: { en: 'Sadhya', ne: 'साध्य' }, quality: 'shubha' },
  { number: 23, name: { en: 'Shubha', ne: 'शुभ' }, quality: 'shubha' },
  { number: 24, name: { en: 'Shukla', ne: 'शुक्ल' }, quality: 'shubha' },
  { number: 25, name: { en: 'Brahma', ne: 'ब्रह्म' }, quality: 'shubha' },
  { number: 26, name: { en: 'Indra', ne: 'ऐन्द्र' }, quality: 'shubha' },
  { number: 27, name: { en: 'Vaidhriti', ne: 'वैधृति' }, quality: 'ashubha' },
];

// ─── 11 KARANAS ───
export interface KaranaDefinition {
  number: number;
  name: { en: string; ne: string };
  type: 'sthira' | 'chara';
}

export const KARANAS: KaranaDefinition[] = [
  { number: 1,  name: { en: 'Bava', ne: 'बव' }, type: 'chara' },
  { number: 2,  name: { en: 'Balava', ne: 'बालव' }, type: 'chara' },
  { number: 3,  name: { en: 'Kaulava', ne: 'कौलव' }, type: 'chara' },
  { number: 4,  name: { en: 'Taitila', ne: 'तैतिल' }, type: 'chara' },
  { number: 5,  name: { en: 'Garija', ne: 'गरज' }, type: 'chara' },
  { number: 6,  name: { en: 'Vanija', ne: 'वणिज' }, type: 'chara' },
  { number: 7,  name: { en: 'Vishti', ne: 'विष्टि' }, type: 'chara' },
  { number: 8,  name: { en: 'Shakuni', ne: 'शकुनि' }, type: 'sthira' },
  { number: 9,  name: { en: 'Chatushpada', ne: 'चतुष्पद' }, type: 'sthira' },
  { number: 10, name: { en: 'Naga', ne: 'नाग' }, type: 'sthira' },
  { number: 11, name: { en: 'Kimstughna', ne: 'किंस्तुघ्न' }, type: 'sthira' },
];

// ─── VARAS (Weekdays) ───
export interface VaraDefinition {
  number: number;  // 0=Sunday
  name: { en: string; ne: string };
  lord: GrahaId;
}

export const VARAS: VaraDefinition[] = [
  { number: 0, name: { en: 'Sunday', ne: 'आइतबार' }, lord: 'SU' },
  { number: 1, name: { en: 'Monday', ne: 'सोमबार' }, lord: 'MO' },
  { number: 2, name: { en: 'Tuesday', ne: 'मङ्गलबार' }, lord: 'MA' },
  { number: 3, name: { en: 'Wednesday', ne: 'बुधबार' }, lord: 'ME' },
  { number: 4, name: { en: 'Thursday', ne: 'बिहिबार' }, lord: 'JU' },
  { number: 5, name: { en: 'Friday', ne: 'शुक्रबार' }, lord: 'VE' },
  { number: 6, name: { en: 'Saturday', ne: 'शनिबार' }, lord: 'SA' },
];

// ─── HORA SEQUENCE ───
// The planetary hour sequence starting from sunrise on Sunday
export const HORA_SEQUENCE: GrahaId[] = ['SU', 'VE', 'ME', 'MO', 'SA', 'JU', 'MA'];

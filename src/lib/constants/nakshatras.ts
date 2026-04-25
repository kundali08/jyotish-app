/**
 * Nakshatra Constants — BPHS Ch. 3
 * 27 Nakshatras with all attributes for Panchanga & compatibility
 */

import { GrahaId } from '../types/graha';

export interface NakshatraDefinition {
  number: number;
  name: { en: string; ne: string; sanskrit: string };
  lord: GrahaId;
  startDegree: number;
  endDegree: number;
  deity: { en: string; ne: string };
  gana: 'deva' | 'manushya' | 'rakshasa';
  nadi: 'aadi' | 'madhya' | 'antya';
  yoni: { en: string; ne: string };
  varna: 'brahmin' | 'kshatriya' | 'vaishya' | 'shudra';
  tatva: 'prithvi' | 'jala' | 'agni' | 'vayu' | 'akasha';
  vashya: string;
  namaksher: Array<{ en: string; ne: string }>;
}

// Each nakshatra spans 13°20' (800 minutes of arc)
export const NAKSHATRA_SPAN = 13 + 20/60; // 13.3333...°
export const PADA_SPAN = NAKSHATRA_SPAN / 4; // 3.3333...°

export const NAKSHATRAS: NakshatraDefinition[] = [
  { number: 1, name: { en: 'Ashwini', ne: 'अश्विनी', sanskrit: 'Ashvini' }, lord: 'KE', startDegree: 0, endDegree: 13.3333, deity: { en: 'Ashwini Kumars', ne: 'अश्विनी कुमार' }, gana: 'deva', nadi: 'aadi', yoni: { en: 'Horse', ne: 'घोडा' }, varna: 'vaishya', tatva: 'prithvi', vashya: 'Chatushpada', namaksher: [{en:'Chu',ne:'चु'},{en:'Che',ne:'चे'},{en:'Cho',ne:'चो'},{en:'La',ne:'ला'}] },
  { number: 2, name: { en: 'Bharani', ne: 'भरणी', sanskrit: 'Bharani' }, lord: 'VE', startDegree: 13.3333, endDegree: 26.6667, deity: { en: 'Yama', ne: 'यम' }, gana: 'manushya', nadi: 'madhya', yoni: { en: 'Elephant', ne: 'हात्ती' }, varna: 'shudra', tatva: 'prithvi', vashya: 'Manava', namaksher: [{en:'Li',ne:'ली'},{en:'Lu',ne:'लू'},{en:'Le',ne:'ले'},{en:'Lo',ne:'लो'}] },
  { number: 3, name: { en: 'Krittika', ne: 'कृत्तिका', sanskrit: 'Krittika' }, lord: 'SU', startDegree: 26.6667, endDegree: 40, deity: { en: 'Agni', ne: 'अग्नि' }, gana: 'rakshasa', nadi: 'antya', yoni: { en: 'Goat', ne: 'बाख्रा' }, varna: 'brahmin', tatva: 'agni', vashya: 'Chatushpada', namaksher: [{en:'A',ne:'अ'},{en:'I',ne:'ई'},{en:'U',ne:'उ'},{en:'E',ne:'ए'}] },
  { number: 4, name: { en: 'Rohini', ne: 'रोहिणी', sanskrit: 'Rohini' }, lord: 'MO', startDegree: 40, endDegree: 53.3333, deity: { en: 'Brahma', ne: 'ब्रह्मा' }, gana: 'manushya', nadi: 'antya', yoni: { en: 'Serpent', ne: 'सर्प' }, varna: 'shudra', tatva: 'prithvi', vashya: 'Chatushpada', namaksher: [{en:'O',ne:'ओ'},{en:'Va',ne:'वा'},{en:'Vi',ne:'वी'},{en:'Vu',ne:'वु'}] },
  { number: 5, name: { en: 'Mrigashira', ne: 'मृगशिरा', sanskrit: 'Mrigashira' }, lord: 'MA', startDegree: 53.3333, endDegree: 66.6667, deity: { en: 'Soma', ne: 'सोम' }, gana: 'deva', nadi: 'madhya', yoni: { en: 'Serpent', ne: 'सर्प' }, varna: 'vaishya', tatva: 'prithvi', vashya: 'Chatushpada', namaksher: [{en:'Ve',ne:'वे'},{en:'Vo',ne:'वो'},{en:'Ka',ne:'का'},{en:'Ki',ne:'की'}] },
  { number: 6, name: { en: 'Ardra', ne: 'आर्द्रा', sanskrit: 'Ardra' }, lord: 'RA', startDegree: 66.6667, endDegree: 80, deity: { en: 'Rudra', ne: 'रुद्र' }, gana: 'manushya', nadi: 'aadi', yoni: { en: 'Dog', ne: 'कुकुर' }, varna: 'shudra', tatva: 'jala', vashya: 'Manava', namaksher: [{en:'Ku',ne:'कु'},{en:'Gha',ne:'घ'},{en:'Ng',ne:'ङ'},{en:'Chha',ne:'छ'}] },
  { number: 7, name: { en: 'Punarvasu', ne: 'पुनर्वसु', sanskrit: 'Punarvasu' }, lord: 'JU', startDegree: 80, endDegree: 93.3333, deity: { en: 'Aditi', ne: 'अदिति' }, gana: 'deva', nadi: 'aadi', yoni: { en: 'Cat', ne: 'बिरालो' }, varna: 'vaishya', tatva: 'jala', vashya: 'Manava', namaksher: [{en:'Ke',ne:'के'},{en:'Ko',ne:'को'},{en:'Ha',ne:'हा'},{en:'Hi',ne:'ही'}] },
  { number: 8, name: { en: 'Pushya', ne: 'पुष्य', sanskrit: 'Pushya' }, lord: 'SA', startDegree: 93.3333, endDegree: 106.6667, deity: { en: 'Brihaspati', ne: 'बृहस्पति' }, gana: 'deva', nadi: 'madhya', yoni: { en: 'Goat', ne: 'बाख्रा' }, varna: 'kshatriya', tatva: 'jala', vashya: 'Chatushpada', namaksher: [{en:'Hu',ne:'हु'},{en:'He',ne:'हे'},{en:'Ho',ne:'हो'},{en:'Da',ne:'डा'}] },
  { number: 9, name: { en: 'Ashlesha', ne: 'अश्लेषा', sanskrit: 'Ashlesha' }, lord: 'ME', startDegree: 106.6667, endDegree: 120, deity: { en: 'Naga', ne: 'नाग' }, gana: 'rakshasa', nadi: 'antya', yoni: { en: 'Cat', ne: 'बिरालो' }, varna: 'shudra', tatva: 'jala', vashya: 'Keeta', namaksher: [{en:'Di',ne:'डी'},{en:'Du',ne:'डू'},{en:'De',ne:'डे'},{en:'Do',ne:'डो'}] },
  { number: 10, name: { en: 'Magha', ne: 'मघा', sanskrit: 'Magha' }, lord: 'KE', startDegree: 120, endDegree: 133.3333, deity: { en: 'Pitris', ne: 'पितृ' }, gana: 'rakshasa', nadi: 'antya', yoni: { en: 'Rat', ne: 'मुसो' }, varna: 'shudra', tatva: 'agni', vashya: 'Chatushpada', namaksher: [{en:'Ma',ne:'मा'},{en:'Mi',ne:'मी'},{en:'Mu',ne:'मू'},{en:'Me',ne:'मे'}] },
  { number: 11, name: { en: 'Purva Phalguni', ne: 'पूर्वा फाल्गुनी', sanskrit: 'Purva Phalguni' }, lord: 'VE', startDegree: 133.3333, endDegree: 146.6667, deity: { en: 'Bhaga', ne: 'भग' }, gana: 'manushya', nadi: 'madhya', yoni: { en: 'Rat', ne: 'मुसो' }, varna: 'brahmin', tatva: 'agni', vashya: 'Manava', namaksher: [{en:'Mo',ne:'मो'},{en:'Ta',ne:'टा'},{en:'Ti',ne:'टी'},{en:'Tu',ne:'टू'}] },
  { number: 12, name: { en: 'Uttara Phalguni', ne: 'उत्तरा फाल्गुनी', sanskrit: 'Uttara Phalguni' }, lord: 'SU', startDegree: 146.6667, endDegree: 160, deity: { en: 'Aryaman', ne: 'अर्यमन' }, gana: 'manushya', nadi: 'aadi', yoni: { en: 'Cow', ne: 'गाई' }, varna: 'kshatriya', tatva: 'agni', vashya: 'Manava', namaksher: [{en:'Te',ne:'टे'},{en:'To',ne:'टो'},{en:'Pa',ne:'पा'},{en:'Pi',ne:'पी'}] },
  { number: 13, name: { en: 'Hasta', ne: 'हस्त', sanskrit: 'Hasta' }, lord: 'MO', startDegree: 160, endDegree: 173.3333, deity: { en: 'Savitar', ne: 'सवितार' }, gana: 'deva', nadi: 'aadi', yoni: { en: 'Buffalo', ne: 'भैंसी' }, varna: 'vaishya', tatva: 'agni', vashya: 'Chatushpada', namaksher: [{en:'Pu',ne:'पू'},{en:'Sha',ne:'ष'},{en:'Na',ne:'ण'},{en:'Tha',ne:'ठ'}] },
  { number: 14, name: { en: 'Chitra', ne: 'चित्रा', sanskrit: 'Chitra' }, lord: 'MA', startDegree: 173.3333, endDegree: 186.6667, deity: { en: 'Tvashtar', ne: 'त्वष्टा' }, gana: 'rakshasa', nadi: 'madhya', yoni: { en: 'Tiger', ne: 'बाघ' }, varna: 'shudra', tatva: 'agni', vashya: 'Vanachara', namaksher: [{en:'Pe',ne:'पे'},{en:'Po',ne:'पो'},{en:'Ra',ne:'रा'},{en:'Ri',ne:'री'}] },
  { number: 15, name: { en: 'Swati', ne: 'स्वाती', sanskrit: 'Swati' }, lord: 'RA', startDegree: 186.6667, endDegree: 200, deity: { en: 'Vayu', ne: 'वायु' }, gana: 'deva', nadi: 'antya', yoni: { en: 'Buffalo', ne: 'भैंसी' }, varna: 'shudra', tatva: 'vayu', vashya: 'Manava', namaksher: [{en:'Ru',ne:'रू'},{en:'Re',ne:'रे'},{en:'Ro',ne:'रो'},{en:'Ta',ne:'ता'}] },
  { number: 16, name: { en: 'Vishakha', ne: 'विशाखा', sanskrit: 'Vishakha' }, lord: 'JU', startDegree: 200, endDegree: 213.3333, deity: { en: 'Indra-Agni', ne: 'इन्द्राग्नि' }, gana: 'rakshasa', nadi: 'antya', yoni: { en: 'Tiger', ne: 'बाघ' }, varna: 'brahmin', tatva: 'vayu', vashya: 'Vanachara', namaksher: [{en:'Ti',ne:'ती'},{en:'Tu',ne:'तू'},{en:'Te',ne:'ते'},{en:'To',ne:'तो'}] },
  { number: 17, name: { en: 'Anuradha', ne: 'अनुराधा', sanskrit: 'Anuradha' }, lord: 'SA', startDegree: 213.3333, endDegree: 226.6667, deity: { en: 'Mitra', ne: 'मित्र' }, gana: 'deva', nadi: 'madhya', yoni: { en: 'Deer', ne: 'मृग' }, varna: 'shudra', tatva: 'vayu', vashya: 'Manava', namaksher: [{en:'Na',ne:'ना'},{en:'Ni',ne:'नी'},{en:'Nu',ne:'नू'},{en:'Ne',ne:'ने'}] },
  { number: 18, name: { en: 'Jyeshtha', ne: 'ज्येष्ठा', sanskrit: 'Jyeshtha' }, lord: 'ME', startDegree: 226.6667, endDegree: 240, deity: { en: 'Indra', ne: 'इन्द्र' }, gana: 'rakshasa', nadi: 'aadi', yoni: { en: 'Deer', ne: 'मृग' }, varna: 'vaishya', tatva: 'vayu', vashya: 'Keeta', namaksher: [{en:'No',ne:'नो'},{en:'Ya',ne:'या'},{en:'Yi',ne:'यी'},{en:'Yu',ne:'यू'}] },
  { number: 19, name: { en: 'Mula', ne: 'मूल', sanskrit: 'Mula' }, lord: 'KE', startDegree: 240, endDegree: 253.3333, deity: { en: 'Nirriti', ne: 'निऋति' }, gana: 'rakshasa', nadi: 'aadi', yoni: { en: 'Dog', ne: 'कुकुर' }, varna: 'shudra', tatva: 'vayu', vashya: 'Chatushpada', namaksher: [{en:'Ye',ne:'ये'},{en:'Yo',ne:'यो'},{en:'Bha',ne:'भा'},{en:'Bhi',ne:'भी'}] },
  { number: 20, name: { en: 'Purva Ashadha', ne: 'पूर्वाषाढा', sanskrit: 'Purva Ashadha' }, lord: 'VE', startDegree: 253.3333, endDegree: 266.6667, deity: { en: 'Apas', ne: 'अपस्' }, gana: 'manushya', nadi: 'madhya', yoni: { en: 'Monkey', ne: 'बाँदर' }, varna: 'brahmin', tatva: 'akasha', vashya: 'Manava', namaksher: [{en:'Bhu',ne:'भू'},{en:'Dha',ne:'धा'},{en:'Pha',ne:'फा'},{en:'Dha',ne:'ढा'}] },
  { number: 21, name: { en: 'Uttara Ashadha', ne: 'उत्तराषाढा', sanskrit: 'Uttara Ashadha' }, lord: 'SU', startDegree: 266.6667, endDegree: 280, deity: { en: 'Vishvadevas', ne: 'विश्वदेव' }, gana: 'manushya', nadi: 'antya', yoni: { en: 'Mongoose', ne: 'न्यौरी' }, varna: 'kshatriya', tatva: 'akasha', vashya: 'Manava', namaksher: [{en:'Bhe',ne:'भे'},{en:'Bho',ne:'भो'},{en:'Ja',ne:'जा'},{en:'Ji',ne:'जी'}] },
  { number: 22, name: { en: 'Shravana', ne: 'श्रवण', sanskrit: 'Shravana' }, lord: 'MO', startDegree: 280, endDegree: 293.3333, deity: { en: 'Vishnu', ne: 'विष्णु' }, gana: 'deva', nadi: 'antya', yoni: { en: 'Monkey', ne: 'बाँदर' }, varna: 'shudra', tatva: 'akasha', vashya: 'Chatushpada', namaksher: [{en:'Khi',ne:'खी'},{en:'Khu',ne:'खू'},{en:'Khe',ne:'खे'},{en:'Kho',ne:'खो'}] },
  { number: 23, name: { en: 'Dhanishtha', ne: 'धनिष्ठा', sanskrit: 'Dhanishtha' }, lord: 'MA', startDegree: 293.3333, endDegree: 306.6667, deity: { en: 'Vasus', ne: 'वसु' }, gana: 'rakshasa', nadi: 'madhya', yoni: { en: 'Lion', ne: 'सिंह' }, varna: 'vaishya', tatva: 'akasha', vashya: 'Vanachara', namaksher: [{en:'Ga',ne:'गा'},{en:'Gi',ne:'गी'},{en:'Gu',ne:'गू'},{en:'Ge',ne:'गे'}] },
  { number: 24, name: { en: 'Shatabhisha', ne: 'शतभिषा', sanskrit: 'Shatabhisha' }, lord: 'RA', startDegree: 306.6667, endDegree: 320, deity: { en: 'Varuna', ne: 'वरुण' }, gana: 'rakshasa', nadi: 'aadi', yoni: { en: 'Horse', ne: 'घोडा' }, varna: 'shudra', tatva: 'akasha', vashya: 'Jalchar', namaksher: [{en:'Go',ne:'गो'},{en:'Sa',ne:'सा'},{en:'Si',ne:'सी'},{en:'Su',ne:'सू'}] },
  { number: 25, name: { en: 'Purva Bhadrapada', ne: 'पूर्वभाद्रपदा', sanskrit: 'Purva Bhadrapada' }, lord: 'JU', startDegree: 320, endDegree: 333.3333, deity: { en: 'Ajaikapada', ne: 'अजैकपाद' }, gana: 'manushya', nadi: 'aadi', yoni: { en: 'Lion', ne: 'सिंह' }, varna: 'brahmin', tatva: 'akasha', vashya: 'Manava', namaksher: [{en:'Se',ne:'से'},{en:'So',ne:'सो'},{en:'Da',ne:'दा'},{en:'Di',ne:'दी'}] },
  { number: 26, name: { en: 'Uttara Bhadrapada', ne: 'उत्तरभाद्रपदा', sanskrit: 'Uttara Bhadrapada' }, lord: 'SA', startDegree: 333.3333, endDegree: 346.6667, deity: { en: 'Ahirbudhnya', ne: 'अहिर्बुध्न्य' }, gana: 'manushya', nadi: 'madhya', yoni: { en: 'Cow', ne: 'गाई' }, varna: 'kshatriya', tatva: 'akasha', vashya: 'Manava', namaksher: [{en:'Du',ne:'दू'},{en:'Tha',ne:'थ'},{en:'Jha',ne:'झ'},{en:'Na',ne:'ञ'}] },
  { number: 27, name: { en: 'Revati', ne: 'रेवती', sanskrit: 'Revati' }, lord: 'ME', startDegree: 346.6667, endDegree: 360, deity: { en: 'Pushan', ne: 'पूषन' }, gana: 'deva', nadi: 'antya', yoni: { en: 'Elephant', ne: 'हात्ती' }, varna: 'shudra', tatva: 'akasha', vashya: 'Chatushpada', namaksher: [{en:'De',ne:'दे'},{en:'Do',ne:'दो'},{en:'Cha',ne:'चा'},{en:'Chi',ne:'ची'}] },
];

/** Get nakshatra from sidereal longitude */
export function getNakshatraFromLongitude(longitude: number): { nakshatra: number; pada: number } {
  const nak = Math.floor(longitude / NAKSHATRA_SPAN) + 1;
  const posInNak = longitude % NAKSHATRA_SPAN;
  const pada = Math.floor(posInNak / PADA_SPAN) + 1;
  return { nakshatra: Math.min(nak, 27) as number, pada: Math.min(pada, 4) as number };
}

/** Get nakshatra lord from nakshatra number */
export function getNakshatraLord(nakshatraNumber: number): GrahaId {
  return NAKSHATRAS[((nakshatraNumber - 1) % 27 + 27) % 27].lord;
}

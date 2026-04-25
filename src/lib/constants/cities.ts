/**
 * Nepal & India City Database for Place of Birth lookup
 * Curated list with lat/lng/timezone for major cities
 */

export interface CityData {
  name: string;
  nameNe: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
  timezone: number;     // UTC offset in hours
  timezoneName: string;
}

export const CITIES: CityData[] = [
  // ─── NEPAL ───
  { name: 'Kathmandu', nameNe: 'काठमाडौं', state: 'Bagmati', country: 'Nepal', lat: 27.7172, lng: 85.3240, timezone: 5.75, timezoneName: 'Asia/Kathmandu' },
  { name: 'Pokhara', nameNe: 'पोखरा', state: 'Gandaki', country: 'Nepal', lat: 28.2096, lng: 83.9856, timezone: 5.75, timezoneName: 'Asia/Kathmandu' },
  { name: 'Lalitpur', nameNe: 'ललितपुर', state: 'Bagmati', country: 'Nepal', lat: 27.6588, lng: 85.3247, timezone: 5.75, timezoneName: 'Asia/Kathmandu' },
  { name: 'Bhaktapur', nameNe: 'भक्तपुर', state: 'Bagmati', country: 'Nepal', lat: 27.6710, lng: 85.4298, timezone: 5.75, timezoneName: 'Asia/Kathmandu' },
  { name: 'Biratnagar', nameNe: 'विराटनगर', state: 'Koshi', country: 'Nepal', lat: 26.4525, lng: 87.2718, timezone: 5.75, timezoneName: 'Asia/Kathmandu' },
  { name: 'Birgunj', nameNe: 'वीरगञ्ज', state: 'Madhesh', country: 'Nepal', lat: 27.0104, lng: 84.8821, timezone: 5.75, timezoneName: 'Asia/Kathmandu' },
  { name: 'Dharan', nameNe: 'धरान', state: 'Koshi', country: 'Nepal', lat: 26.8065, lng: 87.2846, timezone: 5.75, timezoneName: 'Asia/Kathmandu' },
  { name: 'Butwal', nameNe: 'बुटवल', state: 'Lumbini', country: 'Nepal', lat: 27.7006, lng: 83.4486, timezone: 5.75, timezoneName: 'Asia/Kathmandu' },
  { name: 'Hetauda', nameNe: 'हेटौंडा', state: 'Bagmati', country: 'Nepal', lat: 27.4287, lng: 85.0322, timezone: 5.75, timezoneName: 'Asia/Kathmandu' },
  { name: 'Nepalgunj', nameNe: 'नेपालगञ्ज', state: 'Lumbini', country: 'Nepal', lat: 28.0500, lng: 81.6167, timezone: 5.75, timezoneName: 'Asia/Kathmandu' },
  { name: 'Janakpur', nameNe: 'जनकपुर', state: 'Madhesh', country: 'Nepal', lat: 26.7288, lng: 85.9263, timezone: 5.75, timezoneName: 'Asia/Kathmandu' },
  { name: 'Dhangadhi', nameNe: 'धनगढी', state: 'Sudurpashchim', country: 'Nepal', lat: 28.6936, lng: 80.5939, timezone: 5.75, timezoneName: 'Asia/Kathmandu' },
  { name: 'Bharatpur', nameNe: 'भरतपुर', state: 'Bagmati', country: 'Nepal', lat: 27.6833, lng: 84.4333, timezone: 5.75, timezoneName: 'Asia/Kathmandu' },
  { name: 'Tulsipur', nameNe: 'तुल्सीपुर', state: 'Lumbini', country: 'Nepal', lat: 28.1310, lng: 82.2975, timezone: 5.75, timezoneName: 'Asia/Kathmandu' },
  { name: 'Itahari', nameNe: 'इटहरी', state: 'Koshi', country: 'Nepal', lat: 26.6667, lng: 87.2833, timezone: 5.75, timezoneName: 'Asia/Kathmandu' },
  { name: 'Damak', nameNe: 'दमक', state: 'Koshi', country: 'Nepal', lat: 26.6617, lng: 87.6944, timezone: 5.75, timezoneName: 'Asia/Kathmandu' },
  { name: 'Ghorahi', nameNe: 'घोराही', state: 'Lumbini', country: 'Nepal', lat: 28.0389, lng: 82.4889, timezone: 5.75, timezoneName: 'Asia/Kathmandu' },
  { name: 'Siddharthanagar', nameNe: 'सिद्धार्थनगर', state: 'Lumbini', country: 'Nepal', lat: 27.5000, lng: 83.4500, timezone: 5.75, timezoneName: 'Asia/Kathmandu' },
  { name: 'Kirtipur', nameNe: 'कीर्तिपुर', state: 'Bagmati', country: 'Nepal', lat: 27.6781, lng: 85.2775, timezone: 5.75, timezoneName: 'Asia/Kathmandu' },
  { name: 'Lumbini', nameNe: 'लुम्बिनी', state: 'Lumbini', country: 'Nepal', lat: 27.4833, lng: 83.2833, timezone: 5.75, timezoneName: 'Asia/Kathmandu' },
  // ─── INDIA (major cities) ───
  { name: 'New Delhi', nameNe: 'नयाँ दिल्ली', state: 'Delhi', country: 'India', lat: 28.6139, lng: 77.2090, timezone: 5.5, timezoneName: 'Asia/Kolkata' },
  { name: 'Mumbai', nameNe: 'मुम्बई', state: 'Maharashtra', country: 'India', lat: 19.0760, lng: 72.8777, timezone: 5.5, timezoneName: 'Asia/Kolkata' },
  { name: 'Varanasi', nameNe: 'वाराणसी', state: 'Uttar Pradesh', country: 'India', lat: 25.3176, lng: 82.9739, timezone: 5.5, timezoneName: 'Asia/Kolkata' },
  { name: 'Kolkata', nameNe: 'कोलकाता', state: 'West Bengal', country: 'India', lat: 22.5726, lng: 88.3639, timezone: 5.5, timezoneName: 'Asia/Kolkata' },
  { name: 'Chennai', nameNe: 'चेन्नई', state: 'Tamil Nadu', country: 'India', lat: 13.0827, lng: 80.2707, timezone: 5.5, timezoneName: 'Asia/Kolkata' },
  { name: 'Bangalore', nameNe: 'बैंगलोर', state: 'Karnataka', country: 'India', lat: 12.9716, lng: 77.5946, timezone: 5.5, timezoneName: 'Asia/Kolkata' },
  { name: 'Jaipur', nameNe: 'जयपुर', state: 'Rajasthan', country: 'India', lat: 26.9124, lng: 75.7873, timezone: 5.5, timezoneName: 'Asia/Kolkata' },
  { name: 'Lucknow', nameNe: 'लखनऊ', state: 'Uttar Pradesh', country: 'India', lat: 26.8467, lng: 80.9462, timezone: 5.5, timezoneName: 'Asia/Kolkata' },
  { name: 'Patna', nameNe: 'पटना', state: 'Bihar', country: 'India', lat: 25.6093, lng: 85.1376, timezone: 5.5, timezoneName: 'Asia/Kolkata' },
  { name: 'Hyderabad', nameNe: 'हैदराबाद', state: 'Telangana', country: 'India', lat: 17.3850, lng: 78.4867, timezone: 5.5, timezoneName: 'Asia/Kolkata' },
];

/**
 * Search cities by name (fuzzy match)
 */
export function searchCities(query: string): CityData[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return CITIES.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.nameNe.includes(query) ||
    c.state.toLowerCase().includes(q)
  ).slice(0, 10);
}

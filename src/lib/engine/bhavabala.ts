/**
 * Bhavabala Calculator — House Strength
 * Simplified implementation of Sripathi system for MVP.
 */

import { GrahaPosition, GrahaShadbala } from '../types/graha';
import { BhavaData } from '../types/chart';

/**
 * Calculate Bhavabala for all 12 houses.
 * @param bhavas The 12 houses with their cusps, lords, and planets.
 * @param grahas Positions of all planets.
 * @param shadbalas Calculated Shadbala of all planets.
 */
export function calculateBhavabala(
  bhavas: BhavaData[],
  grahas: GrahaPosition[],
  shadbalas: GrahaShadbala[]
): BhavaData[] {
  
  const benefics = ['JU', 'VE', 'ME', 'MO'];

  const updatedBhavas = bhavas.map(bhava => {
    
    // 1. Bhavadhipati Bala (Lord's Shadbala)
    const lordShadbala = shadbalas.find(s => s.grahaId === bhava.lord);
    const bhavadhipatiBala = lordShadbala ? lordShadbala.totalShashtiamsha : 0;

    // 2. Bhava Digbala (Directional Strength)
    const sign = bhava.signOnCusp;
    let maxHouse = 1;
    if ([3, 6, 7, 9, 11].includes(sign)) maxHouse = 1;      // Human signs
    else if ([4, 10, 12].includes(sign)) maxHouse = 4;      // Water signs
    else if ([8].includes(sign)) maxHouse = 7;              // Insect signs
    else if ([1, 2, 5].includes(sign)) maxHouse = 10;       // Quadruped signs

    const houseDist = Math.min(Math.abs(bhava.number - maxHouse), 12 - Math.abs(bhava.number - maxHouse));
    const bhavaDigbala = 60 - (houseDist * 10);

    // 3. Bhava Drishti Bala (Aspectual Strength)
    // Simplified aspect calculation (Full aspects only: 7th, plus special aspects for JU, MA, SA)
    let bhavaDrishtiBala = 0;

    for (const graha of grahas) {
      const diff = Math.abs(graha.longitude - bhava.madhya);
      const angDist = Math.min(diff, 360 - diff);
      const forwardDist = (bhava.madhya - graha.longitude + 360) % 360;

      let hasAspect = false;

      // Standard 7th house aspect (opposition, ~180°)
      if (angDist >= 165 && angDist <= 195) hasAspect = true;

      // Special aspects
      if (graha.id === 'JU' && ((forwardDist >= 105 && forwardDist <= 135) || (forwardDist >= 225 && forwardDist <= 255))) hasAspect = true; // 5th, 9th
      if (graha.id === 'MA' && ((forwardDist >= 75 && forwardDist <= 105) || (forwardDist >= 195 && forwardDist <= 225))) hasAspect = true;  // 4th, 8th
      if (graha.id === 'SA' && ((forwardDist >= 45 && forwardDist <= 75) || (forwardDist >= 255 && forwardDist <= 285))) hasAspect = true;   // 3rd, 10th

      // Conjunction (technically not drishti, but adds positional influence, using a 15° orb)
      if (angDist <= 15) hasAspect = true;

      if (hasAspect) {
        if (graha.id === bhava.lord) {
          bhavaDrishtiBala += 45; // Lord aspecting its own house is very auspicious
        } else if (benefics.includes(graha.id)) {
          bhavaDrishtiBala += 30; // Benefic aspect
        } else {
          bhavaDrishtiBala -= 30; // Malefic aspect
        }
      }
    }

    // Normalize Drishti Bala to not go wildly negative, though it can theoretically be negative
    // Let's cap it reasonably for the MVP
    bhavaDrishtiBala = Math.max(-60, Math.min(120, bhavaDrishtiBala));

    // Total Bhavabala
    const totalBhavabala = bhavadhipatiBala + bhavaDigbala + bhavaDrishtiBala;

    return {
      ...bhava,
      bhavadhipatiBala,
      bhavaDigbala,
      bhavaDrishtiBala,
      totalBhavabala
    };
  });

  // Calculate ranks
  const sorted = [...updatedBhavas].sort((a, b) => (b.totalBhavabala || 0) - (a.totalBhavabala || 0));
  updatedBhavas.forEach(bhava => {
    bhava.rank = sorted.findIndex(b => b.number === bhava.number) + 1;
  });

  return updatedBhavas;
}

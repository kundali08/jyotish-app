/**
 * Quick verification script — run with: conda run -n jyotish npx tsx src/test-verify.ts
 */

import { calculateGrahaPositions } from './lib/engine/grahaspashta';

// Test: 1990-05-15, 10:30 AM, Kathmandu (27.7172°N, 85.3240°E), TZ +5.75
const grahas = calculateGrahaPositions(1990, 5, 15, 10, 30, 0, 5.75, 'LAHIRI');

console.log('\n=== GRAHA SPASHTA VERIFICATION ===\n');
console.log('Planet  | Longitude    | Rashi | Deg in Sign | Retro | Dignity');
console.log('--------|-------------|-------|-------------|-------|--------');
for (const g of grahas) {
  console.log(
    `${g.id.padEnd(7)} | ${g.longitude.toFixed(4).padStart(11)}° | ${String(g.rashi).padStart(5)} | ${g.degreeInSign.toFixed(2).padStart(11)}° | ${g.isRetrograde ? '  Yes' : '   No'} | ${g.dignity}`
  );
}

// Verify Rahu-Ketu
const rahu = grahas.find(g => g.id === 'RA')!;
const ketu = grahas.find(g => g.id === 'KE')!;
const diff = Math.abs(rahu.longitude - ketu.longitude);
const angDist = Math.min(diff, 360 - diff);

console.log('\n=== RAHU-KETU VERIFICATION ===');
console.log(`Rahu:  ${rahu.longitude.toFixed(4)}° (Rashi ${rahu.rashi}, ${rahu.degreeInSign.toFixed(2)}°)`);
console.log(`Ketu:  ${ketu.longitude.toFixed(4)}° (Rashi ${ketu.rashi}, ${ketu.degreeInSign.toFixed(2)}°)`);
console.log(`Angular distance: ${angDist.toFixed(4)}°`);
console.log(`Houses apart: ${Math.abs(rahu.rashi - ketu.rashi)} signs = ${Math.abs(rahu.rashi - ketu.rashi) === 6 ? '✅ CORRECT (7th from each other)' : '❌ WRONG!'}`);
console.log(`180° check: ${Math.abs(angDist - 180) < 0.01 ? '✅ CORRECT' : '❌ WRONG'}`);

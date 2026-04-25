import { calculateTribhagiDasha } from './src/lib/engine/dasha-tribhagi';
const dasha = calculateTribhagiDasha(100, new Date());
dasha.periods.forEach((p, i) => console.log(i, p.lord, p.durationYears));

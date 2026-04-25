const swisseph = require('swisseph');
swisseph.swe_set_ephe_path('/home/par/antigravity_projects/jyotishapp/ephe');

// Birth data
const year = 1990;
const month = 5;
const day = 15;
const hour = 10;
const minute = 30;
const sec = 0;
const tz = 5.75;
const lat = 27.7172;
const lon = 85.324;

// Calculate UT
const decHour = hour + minute/60 + sec/3600;
const utHour = decHour - tz; // 10.5 - 5.75 = 4.75
console.log("Local Time:", hour, ":", minute);
console.log("UT Hour:", utHour);

// Julian Day
const jd = swisseph.swe_julday(year, month, day, utHour, swisseph.SE_GREG_CAL);
console.log("Julian Day (UT):", jd);

// Try using Julian Day UT vs Julian Day ET (Ephemeris Time)
// Sometimes swe_houses expects ET, sometimes UT depending on flag

swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);

// swe_houses_ex
const flag = swisseph.SEFLG_SIDEREAL;
const res = swisseph.swe_houses_ex(jd, flag, lat, lon, 'P'); 
console.log("Ascendant (swe_houses_ex + Sidereal):", res.ascendant, "Rashi:", Math.floor(res.ascendant / 30) + 1);

// What if we don't use sidereal flag for houses, but calculate tropical and subtract ayanamsha?
const resTrop = swisseph.swe_houses_ex(jd, 0, lat, lon, 'P');
const ayanamsha = swisseph.swe_get_ayanamsa_ut(jd);
const ascSid = (resTrop.ascendant - ayanamsha + 360) % 360;
console.log("Tropical Asc:", resTrop.ascendant);
console.log("Ayanamsha:", ayanamsha);
console.log("Ascendant (Tropical - Ayanamsha):", ascSid, "Rashi:", Math.floor(ascSid / 30) + 1);

// Let's check Parashara's Light data: 
// 15 May 1990 10:30 AM Kathmandu
// Is it possible the timezone was entered as 5.5 in Parashara's Light?
const jdIN = swisseph.swe_julday(year, month, day, decHour - 5.5, swisseph.SE_GREG_CAL);
const resIN = swisseph.swe_houses_ex(jdIN, flag, lat, lon, 'P');
console.log("Ascendant (If TZ=5.5):", resIN.ascendant, "Rashi:", Math.floor(resIN.ascendant / 30) + 1);


const swisseph = require('swisseph');
swisseph.swe_set_ephe_path('/home/par/antigravity_projects/jyotishapp/ephe');

const year = 1990;
const month = 5;
const day = 15;
const hour = 10;
const minute = 30;
const tz = 5.75;
const lat = 27.7172;
const lon = 85.324;

const utHour = hour + minute/60 - tz;
const jd = swisseph.swe_julday(year, month, day, utHour, swisseph.SE_GREG_CAL);
swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);

const flag = swisseph.SEFLG_SIDEREAL;

// Try swe_houses_ex
swisseph.swe_houses_ex(jd, flag, lat, lon, 'E', function(result) {
  console.log("EX Sidereal:", result.ascendant, "Rashi:", Math.floor(result.ascendant / 30) + 1);
});

// Try swe_houses
swisseph.swe_houses(jd, lat, lon, 'E', function(result) {
  console.log("swe_houses:", result.ascendant, "Rashi:", Math.floor(result.ascendant / 30) + 1);
  const ayanamsha = swisseph.swe_get_ayanamsa_ut(jd);
  console.log("Ayanamsha:", ayanamsha);
  const sid = (result.ascendant - ayanamsha + 360) % 360;
  console.log("Tropical - Ayanamsha:", sid, "Rashi:", Math.floor(sid / 30) + 1);
});


/**
 * Yoga Detection Engine — BPHS Ch. 35-40
 *
 * Detects classical yogas from planet positions:
 *   - Pancha Mahapurusha Yogas (5 great person yogas)
 *   - Raja Yogas (kingly combinations)
 *   - Dhana Yogas (wealth combinations)
 *   - Gajakesari Yoga (Jupiter-Moon)
 *   - Neecha Bhanga Raja Yoga (debilitation cancellation)
 *   - Viparita Raja Yoga (lords of dusthanas in dusthanas)
 *   - Chandra Yogas (Moon-based)
 *   - Budhaditya Yoga (Sun-Mercury)
 */

import { GrahaId, GrahaPosition, RashiNumber } from '../types/graha';
import { DetectedYoga, LagnaData, BhavaData } from '../types/chart';
import { GRAHAS } from '../constants/grahas';
import { RASHIS } from '../constants/rashis';
import { getRashiFromLongitude } from '../constants/rashis';

function getBhavaOfGraha(grahaLon: number, lagnaLon: number): number {
  const diff = ((grahaLon - lagnaLon) % 360 + 360) % 360;
  return Math.floor(diff / 30) + 1;
}

function isKendra(bhava: number): boolean {
  return [1, 4, 7, 10].includes(bhava);
}

function isTrikona(bhava: number): boolean {
  return [1, 5, 9].includes(bhava);
}

function isDusthana(bhava: number): boolean {
  return [6, 8, 12].includes(bhava);
}

function isKendraOrTrikona(bhava: number): boolean {
  return isKendra(bhava) || isTrikona(bhava);
}

/**
 * Detect all yogas from chart data
 */
export function detectYogas(
  grahas: GrahaPosition[],
  lagna: LagnaData,
  bhavas: BhavaData[]
): DetectedYoga[] {
  const yogas: DetectedYoga[] = [];
  const lagnaLon = lagna.longitude;

  const getGraha = (id: GrahaId) => grahas.find(g => g.id === id);
  const getBhava = (id: GrahaId) => {
    const g = getGraha(id);
    return g ? getBhavaOfGraha(g.longitude, lagnaLon) : 0;
  };

  // ─── 1. Pancha Mahapurusha Yogas ───
  // Mars, Mercury, Jupiter, Venus, Saturn in own/exalted sign AND in kendra

  const mahapurushaGrahas: { id: GrahaId; yoga: string; sanskrit: string; result: { en: string; ne: string } }[] = [
    { id: 'MA', yoga: 'Ruchaka', sanskrit: 'रुचक', result: { en: 'Brave, commanding, military success', ne: 'शूर, आज्ञाकारी, सैनिक सफलता' } },
    { id: 'ME', yoga: 'Bhadra', sanskrit: 'भद्र', result: { en: 'Learned, eloquent, long-lived', ne: 'विद्वान, वक्ता, दीर्घायु' } },
    { id: 'JU', yoga: 'Hamsa', sanskrit: 'हंस', result: { en: 'Righteous, virtuous, respected', ne: 'धार्मिक, सद्गुणी, सम्मानित' } },
    { id: 'VE', yoga: 'Malavya', sanskrit: 'मालव्य', result: { en: 'Wealthy, beautiful, luxurious life', ne: 'धनी, सुन्दर, विलासी जीवन' } },
    { id: 'SA', yoga: 'Shasha', sanskrit: 'शश', result: { en: 'Powerful, authoritative, disciplined', ne: 'शक्तिशाली, अधिकारी, अनुशासित' } },
  ];

  for (const mp of mahapurushaGrahas) {
    const g = getGraha(mp.id);
    if (!g) continue;
    const bhava = getBhava(mp.id);
    if (isKendra(bhava) && (g.dignity === 'own' || g.dignity === 'exalted' || g.dignity === 'moolatrikona')) {
      yogas.push({
        id: `mahapurusha_${mp.yoga.toLowerCase()}`,
        name: { en: `${mp.yoga} Yoga`, ne: `${mp.sanskrit} योग`, sanskrit: `${mp.yoga} Yoga` },
        category: 'mahapurusha',
        formation: {
          en: `${mp.yoga}: ${mp.id} in ${g.dignity} sign in house ${bhava} (kendra)`,
          ne: `${mp.sanskrit}: ${GRAHAS[mp.id].name.ne} ${g.dignity === 'own' ? 'स्वगृह' : 'उच्च'}मा भाव ${bhava} (केन्द्र)`,
        },
        result: mp.result,
        strength: g.dignity === 'exalted' ? 'strong' : 'moderate',
        involvedGrahas: [mp.id],
      });
    }
  }

  // ─── 2. Gajakesari Yoga ───
  // Jupiter in kendra from Moon
  const ju = getGraha('JU');
  const mo = getGraha('MO');
  if (ju && mo) {
    const diff = Math.abs(ju.longitude - mo.longitude);
    const angDist = Math.min(diff, 360 - diff);
    const houseFromMoon = Math.round(angDist / 30);
    if ([0, 3, 6, 9].includes(houseFromMoon)) {
      yogas.push({
        id: 'gajakesari',
        name: { en: 'Gajakesari Yoga', ne: 'गजकेसरी योग', sanskrit: 'Gajakesarī Yoga' },
        category: 'chandra',
        formation: {
          en: `Jupiter in kendra from Moon (${houseFromMoon + 1}th house)`,
          ne: `चन्द्रबाट केन्द्रमा गुरु (${houseFromMoon + 1} औं भाव)`,
        },
        result: {
          en: 'Fame, intelligence, wealth, respected by learned persons',
          ne: 'यश, बुद्धि, धन, विद्वानहरूबाट सम्मान',
        },
        strength: ju.dignity === 'exalted' || ju.dignity === 'own' ? 'strong' : 'moderate',
        involvedGrahas: ['JU', 'MO'],
      });
    }
  }

  // ─── 3. Budhaditya Yoga ───
  // Sun and Mercury in the same sign
  const su = getGraha('SU');
  const me = getGraha('ME');
  if (su && me && su.rashi === me.rashi) {
    const bhava = getBhava('SU');
    if (!me.isCombust) {
      yogas.push({
        id: 'budhaditya',
        name: { en: 'Budhaditya Yoga', ne: 'बुधादित्य योग', sanskrit: 'Budhāditya Yoga' },
        category: 'surya',
        formation: {
          en: `Sun and Mercury conjunct in ${RASHIS[su.rashi - 1].name.en} (house ${bhava})`,
          ne: `सूर्य र बुध ${RASHIS[su.rashi - 1].name.ne}मा सँगै (भाव ${bhava})`,
        },
        result: { en: 'Intelligence, good education, fame through learning', ne: 'बुद्धि, राम्रो शिक्षा, विद्याद्वारा यश' },
        strength: isKendra(bhava) ? 'strong' : 'moderate',
        involvedGrahas: ['SU', 'ME'],
      });
    }
  }

  // ─── 4. Raja Yogas ───
  // Lord of a kendra conjunct/aspecting lord of a trikona

  const signLords: Record<number, GrahaId> = {
    1: 'MA', 2: 'VE', 3: 'ME', 4: 'MO', 5: 'SU', 6: 'ME',
    7: 'VE', 8: 'MA', 9: 'JU', 10: 'SA', 11: 'SA', 12: 'JU',
  };

  const kendras = [1, 4, 7, 10];
  const trikonas = [5, 9];

  for (const k of kendras) {
    const kendraSign = bhavas[k - 1]?.signOnCusp;
    if (!kendraSign) continue;
    const kendraLord = signLords[kendraSign];
    if (!kendraLord || !GRAHAS[kendraLord]) continue;

    for (const tr of trikonas) {
      const trikonaSign = bhavas[tr - 1]?.signOnCusp;
      if (!trikonaSign) continue;
      const trikonaLord = signLords[trikonaSign];
      if (!trikonaLord || !GRAHAS[trikonaLord]) continue;

      if (kendraLord === trikonaLord) continue;

      const kl = getGraha(kendraLord);
      const tl = getGraha(trikonaLord);
      if (!kl || !tl) continue;

      if (kl.rashi === tl.rashi) {
        yogas.push({
          id: `raja_${kendraLord}_${trikonaLord}`,
          name: { en: 'Raja Yoga', ne: 'राजयोग', sanskrit: 'Rāja Yoga' },
          category: 'raja',
          formation: {
            en: `${GRAHAS[kendraLord].name.en} (lord of ${k}H) conjunct ${GRAHAS[trikonaLord].name.en} (lord of ${tr}H)`,
            ne: `${GRAHAS[kendraLord].name.ne} (${k}भावेश) र ${GRAHAS[trikonaLord].name.ne} (${tr}भावेश) सँगै`,
          },
          result: { en: 'Authority, power, leadership, rise in status', ne: 'अधिकार, शक्ति, नेतृत्व, पद वृद्धि' },
          strength: isKendra(getBhava(kendraLord)) ? 'strong' : 'moderate',
          involvedGrahas: [kendraLord, trikonaLord],
        });
      }
    }
  }

  // ─── 5. Dhana Yogas ───
  // Lord of 2nd and 11th house connected
  const lord2Sign = bhavas[1]?.signOnCusp;
  const lord11Sign = bhavas[10]?.signOnCusp;
  if (lord2Sign && lord11Sign) {
    const lord2 = signLords[lord2Sign];
    const lord11 = signLords[lord11Sign];
    if (!lord2 || !lord11 || !GRAHAS[lord2] || !GRAHAS[lord11]) { /* skip */ }
    else {
      const g2 = getGraha(lord2);
      const g11 = getGraha(lord11);
      if (g2 && g11 && g2.rashi === g11.rashi) {
        yogas.push({
          id: 'dhana_2_11',
          name: { en: 'Dhana Yoga', ne: 'धनयोग', sanskrit: 'Dhana Yoga' },
          category: 'dhana',
          formation: {
            en: `2nd lord (${GRAHAS[lord2].name.en}) conjunct 11th lord (${GRAHAS[lord11].name.en})`,
            ne: `द्वितीयेश (${GRAHAS[lord2].name.ne}) र एकादशेश (${GRAHAS[lord11].name.ne}) सँगै`,
          },
          result: { en: 'Wealth accumulation, financial prosperity', ne: 'धन सञ्चय, आर्थिक समृद्धि' },
          strength: 'moderate',
          involvedGrahas: [lord2, lord11],
        });
      }
    }
  }

  // ─── 6. Neecha Bhanga Raja Yoga ───
  // Debilitated planet whose debilitation is cancelled
  for (const g of grahas) {
    if (g.dignity !== 'debilitated') continue;

    const gDef = GRAHAS[g.id];
    if (!gDef) continue;
    const debSign = gDef.debilitationSign;
    const debLord = signLords[debSign];
    if (!debLord || !GRAHAS[debLord]) continue;

    const debLordPos = getGraha(debLord);
    if (debLordPos) {
      const debLordBhava = getBhava(debLord);
      if (isKendra(debLordBhava)) {
        yogas.push({
          id: `neecha_bhanga_${g.id}`,
          name: { en: 'Neecha Bhanga Raja Yoga', ne: 'नीचभङ्ग राजयोग', sanskrit: 'Nīca Bhaṅga Rāja Yoga' },
          category: 'neechaBhanga',
          formation: {
            en: `${GRAHAS[g.id].name.en} debilitated, but ${GRAHAS[debLord].name.en} (dispositor) in kendra`,
            ne: `${GRAHAS[g.id].name.ne} नीच, तर ${GRAHAS[debLord].name.ne} (राशीश) केन्द्रमा`,
          },
          result: { en: 'Rise from humble beginnings, late success', ne: 'विनम्र सुरुवातबाट उठान, ढिलो सफलता' },
          strength: 'moderate',
          involvedGrahas: [g.id, debLord],
        });
      }
    }
  }

  // ─── 7. Viparita Raja Yoga ───
  // Lords of 6, 8, 12 placed in 6, 8, or 12
  const dusthanas = [6, 8, 12];
  for (const d of dusthanas) {
    const dSign = bhavas[d - 1]?.signOnCusp;
    if (!dSign) continue;
    const dLord = signLords[dSign];
    if (!dLord || !GRAHAS[dLord]) continue;
    const dLordBhava = getBhava(dLord);
    if (isDusthana(dLordBhava) && dLordBhava !== d) {
      yogas.push({
        id: `viparita_${d}_${dLordBhava}`,
        name: { en: 'Viparita Raja Yoga', ne: 'विपरीत राजयोग', sanskrit: 'Viparīta Rāja Yoga' },
        category: 'viparita',
        formation: {
          en: `${d}th lord (${GRAHAS[dLord].name.en}) placed in ${dLordBhava}th house (dusthana in dusthana)`,
          ne: `${d}भावेश (${GRAHAS[dLord].name.ne}) ${dLordBhava}औं भावमा (दुःस्थानमा दुःस्थान)`,
        },
        result: { en: 'Unexpected gains through adversity, rise from difficulties', ne: 'प्रतिकूलतामा लाभ, कठिनाइबाट उठान' },
        strength: 'moderate',
        involvedGrahas: [dLord],
      });
    }
  }

  // ─── 8. Chandra-Mangal Yoga ───
  // Moon and Mars conjunct
  if (mo && getGraha('MA')) {
    const ma = getGraha('MA')!;
    if (mo.rashi === ma.rashi) {
      yogas.push({
        id: 'chandra_mangal',
        name: { en: 'Chandra-Mangal Yoga', ne: 'चन्द्र-मङ्गल योग', sanskrit: 'Candra-Maṅgala Yoga' },
        category: 'chandra',
        formation: {
          en: `Moon and Mars conjunct in ${RASHIS[mo.rashi - 1].name.en}`,
          ne: `चन्द्र र मङ्गल ${RASHIS[mo.rashi - 1].name.ne}मा सँगै`,
        },
        result: { en: 'Wealth through business, financial acumen', ne: 'व्यापारबाट धन, आर्थिक कुशलता' },
        strength: 'moderate',
        involvedGrahas: ['MO', 'MA'],
      });
    }
  }

  // ─── 9. Sunapha/Anapha/Durudhara (Moon-based) ───
  if (mo) {
    const moonSign = mo.rashi;
    const sign2 = ((moonSign) % 12) + 1;  // sign after Moon
    const sign12 = ((moonSign - 2 + 12) % 12) + 1;  // sign before Moon

    const planetsIn2 = grahas.filter(g => g.rashi === sign2 && g.id !== 'SU' && g.id !== 'MO' && g.id !== 'RA' && g.id !== 'KE');
    const planetsIn12 = grahas.filter(g => g.rashi === sign12 && g.id !== 'SU' && g.id !== 'MO' && g.id !== 'RA' && g.id !== 'KE');

    if (planetsIn2.length > 0 && planetsIn12.length === 0) {
      yogas.push({
        id: 'sunapha',
        name: { en: 'Sunapha Yoga', ne: 'सुनफा योग', sanskrit: 'Sunaphā Yoga' },
        category: 'chandra',
        formation: { en: `Planet(s) in 2nd from Moon`, ne: 'चन्द्रबाट दोस्रोमा ग्रह' },
        result: { en: 'Self-made wealth, good status', ne: 'स्वनिर्मित धन, राम्रो पद' },
        strength: 'moderate',
        involvedGrahas: ['MO', ...planetsIn2.map(p => p.id)],
      });
    }
    if (planetsIn12.length > 0 && planetsIn2.length === 0) {
      yogas.push({
        id: 'anapha',
        name: { en: 'Anapha Yoga', ne: 'अनफा योग', sanskrit: 'Anaphā Yoga' },
        category: 'chandra',
        formation: { en: `Planet(s) in 12th from Moon`, ne: 'चन्द्रबाट बाह्रौंमा ग्रह' },
        result: { en: 'Regal bearing, virtuous, healthy', ne: 'राजसी व्यवहार, सद्गुणी, स्वस्थ' },
        strength: 'moderate',
        involvedGrahas: ['MO', ...planetsIn12.map(p => p.id)],
      });
    }
    if (planetsIn2.length > 0 && planetsIn12.length > 0) {
      yogas.push({
        id: 'durudhara',
        name: { en: 'Durudhara Yoga', ne: 'दुरुधरा योग', sanskrit: 'Durūdharā Yoga' },
        category: 'chandra',
        formation: { en: `Planets on both sides of Moon`, ne: 'चन्द्रको दुवैतिर ग्रह' },
        result: { en: 'Wealthy, charitable, vehicles, enjoyment', ne: 'धनी, दानवीर, वाहन, भोग' },
        strength: 'strong',
        involvedGrahas: ['MO', ...planetsIn2.map(p => p.id), ...planetsIn12.map(p => p.id)],
      });
    }
  }

  return yogas;
}

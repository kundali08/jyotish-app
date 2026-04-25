'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import NorthIndianChart from '../charts/NorthIndianChart';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS } from '@/lib/constants/grahas';

interface Props {
  kundaliData: any;
}

export default function JanamPatrika({ kundaliData }: Props) {
  const { locale, formatNumber, tObj } = useLanguage();
  const [isExporting, setIsExporting] = useState(false);

  const downloadContinuousPDF = () => {
    const element = document.getElementById('patrika-print-area');
    if (!element) {
      window.print();
      return;
    }
    
    setIsExporting(true);
    
    // Get exact height in pixels
    const heightPx = element.scrollHeight;
    
    // Create a dynamic style element for the print page size
    const styleId = 'dynamic-print-style';
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    
    // Set @page to match exact width (210mm) and custom height (pixels)
    styleEl.innerHTML = `
      @page {
        size: 210mm ${heightPx + 50}px;
        margin: 0;
      }
    `;
    
    // Delay slightly to allow style to apply before print dialog opens
    setTimeout(() => {
      window.print();
      setIsExporting(false);
      
      // Clean up after print dialog closes
      setTimeout(() => {
        if (styleEl && styleEl.parentNode) {
          styleEl.parentNode.removeChild(styleEl);
        }
      }, 1000);
    }, 100);
  };

  if (!kundaliData) return null;

  const bdata = kundaliData.birthData;
  const panchanga = kundaliData.panchanga;
  const d9Chart = kundaliData.vargaCharts?.find((v: any) => v.type === 'D9');
  const tithi = kundaliData.panchanga.tithi;
  const vara = kundaliData.panchanga.vara;
  const nakshatra = kundaliData.panchanga.nakshatra;
  const yoga = kundaliData.panchanga.yoga;
  const karana = kundaliData.panchanga.karana;



  return (
    <div className="space-y-6 pb-20">
      {/* Controls */}
      <div className="glass-card text-center p-8 no-print">
        <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--gold-400)' }}>
          {locale === 'ne' ? 'तपाईंको जन्मपत्रिका' : 'Your Janam Patrika'}
        </h3>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          {locale === 'ne'
            ? 'यो परम्परागत जन्मपत्रिका प्रिन्ट गर्न वा PDF को रूपमा सेभ गर्न तलको बटन थिच्नुहोस्।'
            : 'Click the button below to print or save this traditional birth scroll as a PDF.'}
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => window.print()}
            className="btn-primary text-lg px-8 py-3 bg-red-700 hover:bg-red-800 text-white shadow-xl shadow-red-900/30 border border-red-500"
          >
            {locale === 'ne' ? '🖨️ साधारण प्रिन्ट (A4)' : '🖨️ Standard Print (A4)'}
          </button>
          <button
            onClick={downloadContinuousPDF}
            disabled={isExporting}
            className="btn-primary text-lg px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:brightness-110 disabled:opacity-70 text-white shadow-xl shadow-orange-900/30 border border-orange-500 flex items-center justify-center gap-2"
          >
            {isExporting && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {locale === 'ne' ? (isExporting ? 'डाउनलोड हुँदैछ...' : '📜 अखण्ड PDF डाउनलोड (Scroll)') : (isExporting ? 'Downloading...' : '📜 Download Scroll PDF')}
          </button>
        </div>
      </div>

      {/* The Patrika Document */}
      <div id="patrika-print-area" className="patrika-container">

        {/* Scroll Stick Top */}
        <div className="scroll-stick-top">
          <div className="stick-knob left"></div>
          <div className="stick-cylinder"></div>
          <div className="stick-knob right"></div>

          <div className="hanging-ribbon left"></div>
          <div className="hanging-ribbon right"></div>
        </div>

        <div className="patrika-content">
          <div className="patrika-content-inner">

            {/* Header Section */}
            <div className="patrika-header-motif flex-col text-center">
              <div className="flex justify-center">
                <img src="/ganesh.png" alt="Shree Ganesha" className="w-28 h-auto mix-blend-multiply" />
              </div>
              <div className="text-2xl font-bold mt-4 mb-4" style={{ fontFamily: "'Tiro Devanagari Sanskrit', serif", color: '#B91C1C' }}>
                श्री मङ्गलमूर्तय नमः ॥ श्री सरस्वत्यै नमः ॥
              </div>
              <div className="text-lg leading-loose max-w-2xl mx-auto italic opacity-95 mt-4" style={{ fontFamily: "'Tiro Devanagari Sanskrit', serif", color: '#991B1B' }}>
                आदित्यादिग्रहाः सर्वे सनक्षत्राः सराशयः ।<br />
                दीर्घमायुः प्रयच्छन्तु यस्यैषा जन्मपत्रिका ॥१॥<br /><br />
                ब्रह्मा करोतु दीर्घायु विष्णु कुर्याच्च सम्पदम् ।<br />
                हरो रक्षतु गात्राणि यस्यैवा जन्मपत्रिका ॥२॥<br /><br />
                उमा, गौरी, शिवा, दुर्गा, भद्रा, भगवती तथा ।<br />
                कुलदेव्यांथ, चामुण्डा रक्षतां वालकः सदा ॥३॥
              </div>
            </div>

            {/* Birth Details Paragraph format */}
            <div className="text-justify leading-loose text-lg font-medium my-8 px-6" style={{ fontFamily: "'Tiro Devanagari Sanskrit', serif", wordSpacing: '4px' }}>
              {(() => {
                const sunRashi = kundaliData.grahas.find((g: any) => g.id === 'SU')?.rashi || 1;
                const sunLon = kundaliData.grahas.find((g: any) => g.id === 'SU')?.longitude || 0;
                const moonRashi = kundaliData.grahas.find((g: any) => g.id === 'MO')?.rashi || 1;

                // Ayana
                const ayana = (sunLon >= 90 && sunLon < 270) ? 'दक्षिण' : 'उत्तर';

                // Ritu
                let ritu = 'हेमन्त';
                if ([11, 12].includes(sunRashi)) ritu = 'शिशिर';
                else if ([1, 2].includes(sunRashi)) ritu = 'वसन्त';
                else if ([3, 4].includes(sunRashi)) ritu = 'ग्रीष्म';
                else if ([5, 6].includes(sunRashi)) ritu = 'वर्षा';
                else if ([7, 8].includes(sunRashi)) ritu = 'शरद';

                // Paksha
                const paksha = tithi.number <= 15 ? 'शुक्ल' : 'कृष्ण';

                // Samvatsara
                const SAMVATSARAS = [
                  'प्रभव', 'विभव', 'शुक्ल', 'प्रमोद', 'प्रजापति', 'अंगिरा', 'श्रीमुख', 'भाव', 'युवा', 'धाता',
                  'ईश्वर', 'बहुधान्य', 'प्रमाथी', 'विक्रम', 'वृष', 'चित्रभानु', 'सुभानु', 'तारण', 'पार्थिव', 'व्यय',
                  'सर्वजित्', 'सर्वधारी', 'विरोधी', 'विकृति', 'खर', 'नन्दन', 'विजय', 'जय', 'मन्मथ', 'दुर्मुख',
                  'हेमलम्बी', 'विलम्बी', 'विकारी', 'शार्वरी', 'प्लव', 'शुभकृत्', 'शोभन', 'क्रोधी', 'विश्वावसु', 'पराभव',
                  'प्लवङ्ग', 'कीलक', 'सौम्य', 'साधारण', 'विरोधकृत्', 'परिधावी', 'प्रमादी', 'आनन्द', 'राक्षस', 'नल',
                  'पिङ्गल', 'कालयुक्त', 'सिद्धार्थी', 'रौद्र', 'दुर्मति', 'दुन्दुभि', 'रुधिरोद्गारी', 'रक्ताक्ष', 'क्रोधन', 'क्षय'
                ];
                const shakaYear = bdata.dateBS.year - 135;
                // True Surya Siddhanta Barhaspatya logic (Accounts for Kshaya Samvatsaras)
                // Kali Yuga started 3179 years before Shaka Era.
                const kaliYear = shakaYear + 3179;
                // A Kshaya (skipped) year occurs roughly every 85 solar years. 
                // Formula: kshayas = (KaliYear * 22) / 1875
                const kshayas = Math.floor((kaliYear * 22) / 1875);
                // Kali Yuga started in Vijaya Samvatsara (Index 26 in 0-based Prabhava cycle).
                const samvatIndex = (kaliYear + kshayas + 26) % 60;
                const samvatsara = SAMVATSARAS[samvatIndex] || 'प्रभव';

                // Maas
                const LUNAR_MONTHS = ['वैशाख', 'ज्येष्ठ', 'आषाढ', 'श्रावण', 'भाद्रपद', 'आश्विन', 'कार्तिक', 'मार्गशीर्ष', 'पौष', 'माघ', 'फाल्गुन', 'चैत्र'];
                const maas = LUNAR_MONTHS[bdata.dateBS.month - 1] || 'वैशाख';

                // Varga calculation based on first letter
                const namaksherEn = panchanga.nakshatra.namaksher?.en || 'A';
                const char0 = namaksherEn.charAt(0).toUpperCase();
                let varga = 'सर्प';
                if (['A', 'E', 'I', 'O', 'U'].includes(char0)) varga = 'गरुड';
                else if (['K', 'G'].includes(char0)) varga = 'बिडाल';
                else if (['C', 'J'].includes(char0)) varga = 'सिंह';
                else if (['P', 'B', 'M'].includes(char0)) varga = 'मूषक';
                else if (['Y', 'R', 'L', 'V'].includes(char0)) varga = 'मृग';
                else if (['S', 'H'].includes(char0)) varga = 'मेष';

                // Location details
                const placeParts = bdata.place.split(',').map((p: string) => p.trim());
                const country = placeParts.length > 1 ? placeParts[placeParts.length - 1] : 'नेपाल';
                const city = placeParts[0];

                const txtStyle = "font-bold text-blue-700 mx-1";

                return (
                  <>
                    <p className="mb-6 indent-12 text-justify">
                      श्रीशालिवाहनीयशाके <span className={txtStyle}>{formatNumber(shakaYear)}</span> विक्रमादित्यसंवत्
                      सन् <span className={txtStyle}>{formatNumber(bdata.dateAD.year)}</span> सौरमानेन <span className={txtStyle}>{samvatsara}</span> नाम संवत्सरे
                      श्रीसूर्ये <span className={txtStyle}>{ayana}</span> अयने
                      <span className={txtStyle}>{ritu}</span> ऋतौ
                      <span className={txtStyle}>{maas}</span> मासे <span className={txtStyle}>{paksha}</span> पक्षे
                      <span className={txtStyle}>{vara.name.ne.replace('वार', '')}</span> वासरे
                      <span className={txtStyle}>{tithi.name.ne}</span> तिथौ <span className={txtStyle}>{formatNumber(panchanga.kala.tithiEnd?.ghati || 0)}</span> घटी <span className={txtStyle}>{formatNumber(panchanga.kala.tithiEnd?.pala || 0)}</span> पलानि
                      <span className={txtStyle}>{NAKSHATRAS[nakshatra.number - 1]?.name.ne || ''}</span> नक्षत्रे <span className={txtStyle}>{formatNumber(panchanga.kala.nakshatraEnd?.ghati || 0)}</span> घटी <span className={txtStyle}>{formatNumber(panchanga.kala.nakshatraEnd?.pala || 0)}</span> पलानि
                      नक्षत्रस्य जन्मसमये <span className={txtStyle}>{formatNumber(panchanga.kala.bhayat.ghati)}</span> घटी <span className={txtStyle}>{formatNumber(panchanga.kala.bhayat.pala)}</span> पलानि
                      भभोग <span className={txtStyle}>{formatNumber(panchanga.kala.bhaBhoga.ghati)}</span> घटी <span className={txtStyle}>{formatNumber(panchanga.kala.bhaBhoga.pala)}</span> पलानि
                      <span className={txtStyle}>{yoga.name.ne}</span> योगे
                      <span className={txtStyle}>{karana.name.ne}</span> करणे जन्मेति पञ्चाङ्गम् ।
                    </p>
                    <p className="indent-12 text-justify">
                      सौरमानेन <span className={txtStyle}>{maas}</span> मासे सूर्यसंक्रमाद् दिनगता <span className={txtStyle}>{formatNumber(bdata.dateBS.day)}</span> तदनुसार
                      ईसवीय मास <span className={txtStyle}>{formatNumber(bdata.dateAD.month)}</span> तारिका <span className={txtStyle}>{formatNumber(bdata.dateAD.day)}</span> अत्र
                      <span className={txtStyle}>{vara.name.ne.replace('वार', '')}</span> वासरे सूर्योदया दिष्ट <span className={txtStyle}>{formatNumber(panchanga.kala.ishtaKala.ghati)}</span> घटी <span className={txtStyle}>{formatNumber(panchanga.kala.ishtaKala.pala)}</span> पलानि
                      <span className={txtStyle}>{formatNumber(bdata.time.hour)}</span> घण्टा <span className={txtStyle}>{formatNumber(bdata.time.minute)}</span> मिनेट तदा
                      जन्मसमये <span className={txtStyle}>{tObj(RASHIS[kundaliData.lagna.rashi - 1]?.name)}</span> लग्नोदये
                      <span className={txtStyle}>{tObj(RASHIS[(d9Chart?.lagnaSign || 1) - 1]?.name) || ''}</span> नवमांशे
                      <span className={txtStyle}>{tObj(RASHIS[moonRashi - 1]?.name)}</span> राशिगते चन्द्रमसि एवं विधेपञ्चाङ्ग शुद्धेशुभ पुण्यदिने शुभमूहूर्तबेलायां श्रीमद्ब्रम्हणोधारणात्मके भूगोलैक देशे भारतवर्षे भरतखण्डे जम्बूद्वीपे आर्यावर्तान्तर्गत हिमवतो-दक्षिण पार्श्वे
                      <span className={txtStyle}>{country}</span> देशे
                      <span className={txtStyle}>{city}</span> स्थाने निवसतः सकलमनोरथ स्वःकुलदीपक सद्गुणालंकृत
                      <span className={bdata.gotra ? txtStyle : "px-4 border-b border-blue-700 inline-block min-w-[80px]"}>{bdata.gotra || ''}</span> गोत्रोत्पन्नस्य श्री
                      <span className={bdata.fatherName ? txtStyle : "px-4 border-b border-blue-700"}>{bdata.fatherName || ''}</span> तस्य पाणिगृहीताया धर्मपत्न्या श्रीमत्या
                      <span className={bdata.motherName ? txtStyle : "px-4 border-b border-blue-700"}>{bdata.motherName || ''}</span> देव्याः सुवर्णमयकुक्षौ <span className={txtStyle}>{formatNumber(1)}</span>गर्भे
                      <span className={txtStyle}>{bdata.gender === 'male' ? 'पुत्र' : (bdata.gender === 'female' ? 'पुत्री' : 'सन्तान')}</span> रत्नमजीजनत्। अस्य होराशास्वप्रमाणेन
                      <span className={txtStyle}>{NAKSHATRAS[nakshatra.number - 1]?.name.ne || ''}</span> नक्षत्रस्य
                      <span className={txtStyle}>{formatNumber(nakshatra.pada)}</span> चरणत्वेन
                      <span className={txtStyle}>{tObj(panchanga.nakshatra.namaksher)}</span> काराक्षरस्य
                      <span className={txtStyle}>{tObj(panchanga.nakshatra.yoni)}</span> योनिः
                      <span className={txtStyle}>{tObj(panchanga.nakshatra.ganaName)}</span> गणः
                      <span className={txtStyle}>{tObj(panchanga.nakshatra.nadiName)}</span> नाडी:
                      <span className={txtStyle}>{varga}</span> वर्गः
                      <span className={txtStyle}>{tObj(panchanga.nakshatra.varnaName)}</span> वर्णात्मक श्री
                      <span className="inline-block border-b border-blue-700 px-1 text-blue-700 font-bold min-w-[120px] text-left">
                        {tObj(panchanga.nakshatra.namaksher)}
                      </span> चिरञ्जीवतु शुभनाम देवद्विजाशिवीदैः दीर्घमायू भूयात् ।
                    </p>
                  </>
                );
              })()}
            </div>

            {/* Graha Spashta (Planetary Positions) - Moved Above Charts */}
            <div className="my-10" style={{ pageBreakInside: 'avoid' }}>
              <div className="text-center text-xl font-bold mb-4 text-red-800">॥ ग्रह स्पष्ट ॥</div>
              <table className="patrika-table">
                <thead>
                  <tr>
                    <th>ग्रह</th>
                    <th>राशि</th>
                    <th>अंश</th>
                    <th>नक्षत्र</th>
                    <th>पद</th>
                    <th>अवस्था</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-bold">लग्न</td>
                    <td>{formatNumber(kundaliData.lagna.rashi)}</td>
                    <td>{formatNumber(kundaliData.lagna.degreeInSign.toFixed(2))}°</td>
                    <td>{NAKSHATRAS[kundaliData.lagna.nakshatra - 1]?.name.ne || ''}</td>
                    <td>{formatNumber(kundaliData.lagna.pada)}</td>
                    <td>-</td>
                  </tr>
                  {kundaliData.grahas.map((g: any) => {
                    const dignityNe: Record<string, string> = {
                      'exalted': 'उच्च',
                      'moolatrikona': 'मूलत्रिकोण',
                      'own': 'स्वगृही',
                      'friend': 'मित्र',
                      'neutral': 'सम',
                      'enemy': 'शत्रु',
                      'debilitated': 'नीच',
                    };
                    const dignity = dignityNe[g.dignity] || g.dignity;
                    return (
                      <tr key={g.id}>
                        <td className="font-bold">
                          {GRAHAS[g.id as keyof typeof GRAHAS]?.name.ne || g.id}
                          {g.isCombust ? ' (अस्त)' : ''}
                          {g.isRetrograde ? ' (वक्री)' : ''}
                        </td>
                        <td>{formatNumber(g.rashi)}</td>
                        <td>{formatNumber(g.degreeInSign.toFixed(2))}°</td>
                        <td>{NAKSHATRAS[g.nakshatra - 1]?.name.ne || ''}</td>
                        <td>{formatNumber(g.pada)}</td>
                        <td>{dignity}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Charts Section */}
            <div className="my-10 w-full" style={{ pageBreakInside: 'avoid' }}>
              <div className="text-center text-xl font-bold mb-6 text-red-800">॥ कुण्डली चक्र ॥</div>
              <div className="flex flex-col items-center gap-8 w-full">
                {/* Top Row: Lagna and Rashi Charts */}
                <div className="flex flex-row justify-center gap-4 md:gap-8 flex-nowrap w-full">
                  <div className="flex-1 flex flex-col items-center justify-center p-2 max-w-[400px] bg-transparent">
                    <NorthIndianChart
                      grahas={kundaliData.grahas}
                      lagna={kundaliData.lagna}
                      size={320}
                      title="लग्न कुण्डली"
                    />
                  </div>
                  {(() => {
                    const moon = kundaliData.grahas.find((g: any) => g.id === 'MO');
                    const moonRashi = moon ? moon.rashi : kundaliData.lagna.rashi;
                    return (
                      <div className="flex-1 flex flex-col items-center justify-center p-2 max-w-[400px] bg-transparent">
                        <NorthIndianChart
                          grahas={kundaliData.grahas}
                          lagna={{ ...kundaliData.lagna, rashi: moonRashi }}
                          size={320}
                          title="राशि कुण्डली"
                          centerText="च"
                        />
                      </div>
                    );
                  })()}
                </div>

                {/* Bottom Row: Navamsha and Hora Charts */}
                <div className="flex flex-row justify-center gap-4 md:gap-8 flex-nowrap w-full">
                  {d9Chart && (
                    <div className="flex-1 flex flex-col items-center justify-center p-2 max-w-[400px] bg-transparent">
                      <NorthIndianChart
                        grahas={[]}
                        lagna={kundaliData.lagna}
                        vargaChart={d9Chart}
                        size={320}
                        title="नवमांश कुण्डली"
                      />
                    </div>
                  )}
                  {(() => {
                    const d2Chart = kundaliData.vargaCharts?.find((v: any) => v.type === 'D2');
                    return d2Chart ? (
                      <div className="flex-1 flex flex-col items-center justify-center p-2 max-w-[400px] bg-transparent">
                        <NorthIndianChart
                          grahas={[]}
                          lagna={kundaliData.lagna}
                          vargaChart={d2Chart}
                          size={320}
                          title="होरा कुण्डली"
                        />
                      </div>
                    ) : null;
                  })()}
                </div>
              </div>
            </div>

            {/* Dashas Section (Three Tables) */}
            {kundaliData.dasha && (
              <div className="my-10 space-y-10" style={{ pageBreakInside: 'avoid' }}>
                {(() => {
                  const getYearsMonths = (decimalYears: number) => {
                    let y = Math.floor(decimalYears);
                    let m = Math.round((decimalYears - y) * 12);
                    if (m === 12) {
                      y += 1;
                      m = 0;
                    }
                    return { y, m };
                  };

                  const renderDashaTable = (title: string, periods: any[], lordLabel: string, maxCols: number, maxPeriods?: number) => {
                    const slicedPeriods = maxPeriods ? periods.slice(0, maxPeriods) : periods;

                    const getFullDur = (title: string, p: any) => {
                      const VIM_DUR: Record<string, number> = { 'SU': 6, 'MO': 10, 'MA': 7, 'RA': 18, 'JU': 16, 'SA': 19, 'ME': 17, 'KE': 7, 'VE': 20 };
                      const YOG_DUR: Record<string, number> = { 'मङ्गला': 1, 'पिङ्गला': 2, 'धान्या': 3, 'भ्रामरी': 4, 'भद्रिका': 5, 'उल्का': 6, 'सिद्धा': 7, 'सङ्कटा': 8, 'Mangala': 1, 'Pingala': 2, 'Dhanya': 3, 'Bhramari': 4, 'Bhadrika': 5, 'Ulka': 6, 'Siddha': 7, 'Sankata': 8 };

                      if (title.includes('विंशोत्तरी')) return VIM_DUR[p.lord] || Math.round(p.durationYears);
                      if (title.includes('त्रिभागी')) return (VIM_DUR[p.lord] || Math.round(p.durationYears * 3)) / 3;
                      if (title.includes('योगिनी')) {
                        return YOG_DUR[p.lordName?.ne] || YOG_DUR[p.lordName?.en] || Math.round(p.durationYears);
                      }
                      return p.durationYears;
                    };

                    let cumulative = 0;
                    const now = new Date().toISOString().split('T')[0];
                    const columns = slicedPeriods.map((p: any) => {
                      const fullDurValue = getFullDur(title, p);
                      const dur = getYearsMonths(fullDurValue);
                      cumulative += p.durationYears; // keep cumulative tracking the actual fraction!
                      const pass = getYearsMonths(cumulative);
                      const isRunning = now >= p.startDate && now <= p.endDate;
                      return {
                        lord: p.lordName?.ne || p.lord,
                        durY: dur.y,
                        durM: dur.m,
                        passY: pass.y,
                        passM: pass.m,
                        isRunning
                      };
                    });

                    // Split into chunks of maxCols length
                    const chunks: any[][] = [];
                    for (let i = 0; i < columns.length; i += maxCols) {
                      chunks.push(columns.slice(i, i + maxCols));
                    }

                    if (chunks.length === 0) return null;

                    return (
                      <div className="mt-8" style={{ pageBreakInside: 'avoid' }}>
                        <div className="text-center text-xl font-bold mb-4 text-red-800">{title}</div>
                        <table className="patrika-table w-full">
                          <tbody>
                            {/* Row 1: Lords */}
                            <tr>
                              <td className="font-bold bg-red-50/40 w-20">{lordLabel}</td>
                              {chunks[0].map((c: any, i: number) => {
                                const isColRunning = chunks.some(ch => ch[i]?.isRunning);
                                return <td key={`lord-${i}`} className={`font-bold text-center ${isColRunning ? 'text-blue-800 bg-blue-100' : 'text-red-900'}`}>{c.lord}</td>;
                              })}
                              {Array.from({ length: maxCols - chunks[0].length }).map((_, i) => <td key={`lord-empty-${i}`}></td>)}
                            </tr>

                            {/* Row 2: Duration Years (First Cycle Only) */}
                            <tr>
                              <td className="font-bold bg-red-50/40">वर्ष</td>
                              {chunks[0].map((c: any, i: number) => {
                                const isColRunning = chunks.some(ch => ch[i]?.isRunning);
                                return <td key={`dury-${i}`} className={`text-center ${isColRunning ? 'font-bold text-blue-800 bg-blue-50' : ''}`}>{formatNumber(c.durY)}</td>;
                              })}
                              {Array.from({ length: maxCols - chunks[0].length }).map((_, i) => <td key={`dury-empty-${i}`}></td>)}
                            </tr>

                            {/* Row 3: Duration Months (First Cycle Only) */}
                            <tr>
                              <td className="font-bold bg-red-50/40">महिना</td>
                              {chunks[0].map((c: any, i: number) => {
                                const isColRunning = chunks.some(ch => ch[i]?.isRunning);
                                return <td key={`durm-${i}`} className={`text-center ${isColRunning ? 'font-bold text-blue-800 bg-blue-50' : ''}`}>{formatNumber(c.durM)}</td>;
                              })}
                              {Array.from({ length: maxCols - chunks[0].length }).map((_, i) => <td key={`durm-empty-${i}`}></td>)}
                            </tr>

                            {/* Row 4+: Gatya Years and Gatya Months for each cycle */}
                            {chunks.map((chunk, chunkIdx) => (
                              <React.Fragment key={`gatya-cycle-${chunkIdx}`}>
                                <tr>
                                  <td className="font-bold bg-red-50/40">गत्या वर्ष</td>
                                  {chunk.map((c: any, i: number) => (
                                    <td key={`passy-${chunkIdx}-${i}`} className={`text-center ${c.isRunning ? 'font-bold text-blue-800 bg-blue-50' : ''}`}>{formatNumber(c.passY)}</td>
                                  ))}
                                  {Array.from({ length: maxCols - chunk.length }).map((_, i) => <td key={`passy-empty-${chunkIdx}-${i}`}></td>)}
                                </tr>
                                <tr>
                                  <td className="font-bold bg-red-50/40">मास</td>
                                  {chunk.map((c: any, i: number) => (
                                    <td key={`passm-${chunkIdx}-${i}`} className={`text-center ${c.isRunning ? 'font-bold text-blue-800 bg-blue-50' : ''}`}>{formatNumber(c.passM)}</td>
                                  ))}
                                  {Array.from({ length: maxCols - chunk.length }).map((_, i) => <td key={`passm-empty-${chunkIdx}-${i}`}></td>)}
                                </tr>
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  };

                  return (
                    <>
                      {kundaliData.dasha.vimshottari && renderDashaTable('॥ विंशोत्तरी महादशा चक्रम् ॥', kundaliData.dasha.vimshottari.periods, 'द.', 9)}
                      {kundaliData.dasha.tribhagi && renderDashaTable('॥ त्रिभागी महादशा चक्रम् ॥', kundaliData.dasha.tribhagi.periods, 'द.', 9, 18)}
                      {kundaliData.dasha.yogini && renderDashaTable('॥ योगिनी दशा चक्रम् ॥', kundaliData.dasha.yogini.periods, 'यो.', 8)}
                    </>
                  );
                })()}
              </div>
            )}

            <div className="text-center text-lg font-bold mt-16 mb-4">
              ॥ शुभम् भवतु ॥
            </div>

          </div>
        </div>
      </div>

      {/* Global override for charts inside Patrika to force red strokes and transparent backgrounds */}
      <style dangerouslySetInnerHTML={{
        __html: `
        #patrika-print-area svg text { fill: #D32F2F !important; font-family: 'Tiro Devanagari Sanskrit', serif !important; }
        #patrika-print-area svg line, 
        #patrika-print-area svg rect, 
        #patrika-print-area svg polygon { stroke: #D32F2F !important; stroke-width: 1.5px !important; fill: transparent !important; }
        #patrika-print-area svg { background: transparent !important; }
        
        /* Rolling Stick CSS */
        .scroll-stick-top {
          position: relative;
          width: calc(100% + 40px);
          height: 30px;
          left: -20px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
        }
        
        .stick-cylinder {
          flex-grow: 1;
          height: 24px;
          background: linear-gradient(to bottom, #8B4513 0%, #D2691E 30%, #A0522D 50%, #5C3A21 100%);
          border-top: 1px solid #4a2511;
          border-bottom: 2px solid #3a1c0d;
          box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          position: relative;
          z-index: 10;
        }
        
        .stick-knob {
          width: 30px;
          height: 30px;
          background: radial-gradient(circle at 30% 30%, #FFD700, #DAA520 40%, #B8860B 80%, #8B6508);
          border-radius: 50%;
          box-shadow: 0 4px 4px rgba(0,0,0,0.4), inset -2px -2px 5px rgba(0,0,0,0.5);
          position: relative;
          z-index: 11;
        }
        
        .stick-knob.left {
          margin-right: -10px;
        }
        .stick-knob.right {
          margin-left: -10px;
        }
        
        .hanging-ribbon {
          position: absolute;
          top: 20px;
          width: 30px;
          height: 80px;
          background: #B91C1C;
          z-index: 5;
          box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
        }
        
        /* Creating the swallowtail ribbon cut at the bottom */
        .hanging-ribbon::after {
          content: '';
          position: absolute;
          bottom: -15px;
          left: 0;
          width: 0;
          height: 0;
          border-left: 15px solid #B91C1C;
          border-right: 15px solid #B91C1C;
          border-bottom: 15px solid transparent;
        }
        
        .hanging-ribbon.left {
          left: 10%;
        }
        
        .hanging-ribbon.right {
          right: 10%;
        }

        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          body, #patrika-print-area { 
            background-color: #fdf6e3 !important;
          }
          .no-print { display: none !important; }
          .scroll-stick-top { display: none !important; }
          img { mix-blend-mode: normal !important; }
          svg { box-shadow: none !important; background: transparent !important; }
        }
      `}} />
    </div>
  );
}

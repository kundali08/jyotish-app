'use client';

/**
 * PdfExport — Generates a professional Kundali PDF report
 * Uses html2canvas to capture a hidden print-layout div, then jsPDF to build the document.
 */

import React, { useState, useRef } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import NorthIndianChart from '../charts/NorthIndianChart';
import GrahaSpashtaTable from '../tables/GrahaSpashtaTable';
import PanchangaDisplay from '../panchanga/PanchangaDisplay';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface Props {
  kundaliData: any;
}

export default function PdfExport({ kundaliData }: Props) {
  const { locale } = useLanguage();
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    if (!reportRef.current || !kundaliData) return;
    setIsExporting(true);
    setProgress(10);

    try {
      // Temporarily show the report div to capture it
      reportRef.current.style.display = 'block';

      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // High resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      setProgress(60);

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      // A4 dimensions in mm: 210 x 297
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Calculate how many pages we need
      const ratio = pdfWidth / imgWidth;
      const totalImgHeightInMm = imgHeight * ratio;
      
      let heightLeft = totalImgHeightInMm;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, totalImgHeightInMm);
      heightLeft -= pdfHeight;
      setProgress(80);

      while (heightLeft >= 0) {
        position = heightLeft - totalImgHeightInMm;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, totalImgHeightInMm);
        heightLeft -= pdfHeight;
      }

      const pdfBlob = pdf.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      setProgress(100);

    } catch (error) {
      console.error('PDF Export Error:', error);
      alert(locale === 'ne' ? 'PDF डाउनलोड गर्न असफल भयो' : 'Failed to download PDF');
    } finally {
      // Hide the report div again
      if (reportRef.current) {
        reportRef.current.style.display = 'none';
      }
      setTimeout(() => {
        setIsExporting(false);
        setProgress(0);
      }, 1000);
    }
  };

  const handleShare = async () => {
    if (!pdfUrl || !kundaliData) return;
    try {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const file = new File([blob], `${kundaliData.birthData.name || 'Kundali'}_Report.pdf`, { type: 'application/pdf' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Kundali Report',
          text: 'Here is the Kundali Report.',
        });
      } else {
        alert(locale === 'ne' ? 'तपाईंको उपकरणमा सेयर सुविधा उपलब्ध छैन' : 'Sharing is not supported on this device');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (!kundaliData) return null;

  const bdata = kundaliData.birthData;
  const d9Chart = kundaliData.vargaCharts?.find((v: any) => v.vargaNum === 9);

  return (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center max-w-2xl mx-auto">
        <div className="text-5xl mb-4">📄</div>
        <h3 className="text-2xl font-bold text-amber-300 mb-2">
          {locale === 'ne' ? 'कुण्डली रिपोर्ट डाउनलोड' : 'Download Kundali Report'}
        </h3>
        <p className="text-white/60 mb-8">
          {locale === 'ne'
            ? 'सम्पूर्ण कुण्डली, ग्रह स्पष्ट, र पञ्चाङ्ग सहितको व्यावसायिक PDF रिपोर्ट डाउनलोड गर्नुहोस्।'
            : 'Download a professional PDF report containing the complete Kundali, planetary positions, and Panchanga.'}
        </p>

        {!pdfUrl && (
          <button
            onClick={generatePDF}
            disabled={isExporting}
            className="relative overflow-hidden px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl text-white font-bold text-lg hover:brightness-110 disabled:opacity-70 transition-all shadow-lg shadow-orange-500/20"
          >
            {isExporting ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                {locale === 'ne' ? `तयार हुँदैछ... ${progress}%` : `Generating... ${progress}%`}
              </span>
            ) : (
              locale === 'ne' ? 'PDF रिपोर्ट तयार गर्नुहोस्' : 'Generate PDF Report'
            )}
          </button>
        )}
      </div>

      {/* PDF Viewer & Actions */}
      {pdfUrl && (
        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
          {/* Mobile Success Card */}
          <div className="w-full max-w-md bg-white/5 border border-white/10 p-6 rounded-xl mb-6 text-center lg:hidden">
            <h4 className="text-xl font-bold text-green-400 mb-4">
              {locale === 'ne' ? '✓ PDF तयार भयो!' : '✓ PDF Ready!'}
            </h4>
            <div className="flex flex-col gap-3">
              <a href={pdfUrl} download={`${kundaliData.birthData.name || 'Kundali'}_Report.pdf`} className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg text-white font-bold">
                📥 {locale === 'ne' ? 'डाउनलोड गर्नुहोस्' : 'Download PDF'}
              </a>
              <button onClick={handleShare} className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white font-bold">
                📤 {locale === 'ne' ? 'सेयर गर्नुहोस्' : 'Share PDF'}
              </button>
              <button onClick={() => setPdfUrl(null)} className="w-full py-3 bg-white/10 rounded-lg text-white font-bold mt-2 hover:bg-white/20">
                {locale === 'ne' ? 'बन्द गर्नुहोस्' : 'Close'}
              </button>
            </div>
          </div>
          
          {/* Desktop Iframe Preview */}
          <iframe 
            src={pdfUrl} 
            className="hidden lg:block w-full max-w-4xl h-[800px] rounded-xl border border-white/20 shadow-2xl bg-white" 
            title="PDF Preview"
          />
          <div className="mt-6 hidden lg:flex flex-wrap gap-4 justify-center">
            <a
              href={pdfUrl}
              download={`${kundaliData.birthData.name || 'Kundali'}_Report.pdf`}
              className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white font-bold text-lg hover:brightness-110 shadow-lg shadow-emerald-500/20"
            >
              {locale === 'ne' ? '📥 डाउनलोड गर्नुहोस्' : '📥 Download PDF'}
            </a>
            <button onClick={handleShare} className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white font-bold text-lg hover:brightness-110 shadow-lg shadow-blue-500/20">
              📤 {locale === 'ne' ? 'सेयर गर्नुहोस्' : 'Share PDF'}
            </button>
            <button
              onClick={() => setPdfUrl(null)}
              className="px-8 py-3 bg-white/10 rounded-xl text-white font-bold text-lg hover:bg-white/20"
            >
              {locale === 'ne' ? 'बन्द गर्नुहोस्' : 'Close Preview'}
            </button>
          </div>
        </div>
      )}

      {/* Hidden layout for PDF capture */}
      <div
        ref={reportRef}
        style={{
          display: 'none',
          width: '210mm',
          backgroundColor: '#ffffff',
          color: '#000000',
          padding: '20mm',
          boxSizing: 'border-box',
        }}
        className="pdf-container"
      >
        <style dangerouslySetInnerHTML={{ __html: `
          .pdf-container { font-family: 'Noto Sans Devanagari', sans-serif; }
          .pdf-header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #b45309; padding-bottom: 10px; }
          .pdf-title { font-size: 28px; font-weight: bold; color: #b45309; }
          .pdf-subtitle { font-size: 14px; color: #78350f; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 30px; font-size: 12px; }
          .info-box { border: 1px solid #e5e7eb; padding: 10px; border-radius: 4px; }
          .info-label { font-weight: bold; color: #6b7280; margin-right: 5px; }
          .chart-row { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .chart-col { width: 48%; display: flex; flex-direction: column; items-center; }
          .section-title { font-size: 18px; font-weight: bold; color: #b45309; margin-bottom: 15px; border-bottom: 1px solid #fcd34d; padding-bottom: 5px; }
          .page-break { page-break-before: always; height: 10px; }
          
          /* Override dark mode text for PDF */
          .pdf-container table { color: #000 !important; border-color: #e5e7eb !important; }
          .pdf-container th { background: #fef3c7 !important; color: #b45309 !important; }
          .pdf-container td { border-color: #e5e7eb !important; }
          .pdf-container svg text { fill: #000 !important; }
          .pdf-container svg line, .pdf-container svg rect, .pdf-container svg polygon { stroke: #b45309 !important; }
        `}} />

        {/* Page 1: Header, Info, Charts */}
        <div className="pdf-header">
          <div className="pdf-title">ॐ</div>
          <div className="pdf-title">{locale === 'ne' ? 'जन्मकुण्डली' : 'Janma Kundali'}</div>
          <div className="pdf-subtitle">Vedic Astrology Report</div>
        </div>

        <div className="info-grid">
          <div className="info-box">
            <div><span className="info-label">{locale === 'ne' ? 'नाम' : 'Name'}:</span> {bdata.name || '-'}</div>
            <div><span className="info-label">{locale === 'ne' ? 'जन्म मिति (AD)' : 'Birth Date (AD)'}:</span> {bdata.dateAD.year}-{String(bdata.dateAD.month).padStart(2,'0')}-{String(bdata.dateAD.day).padStart(2,'0')}</div>
            <div><span className="info-label">{locale === 'ne' ? 'समय' : 'Time'}:</span> {String(bdata.time.hour).padStart(2,'0')}:{String(bdata.time.minute).padStart(2,'0')}</div>
            <div><span className="info-label">{locale === 'ne' ? 'स्थान' : 'Place'}:</span> {bdata.place}</div>
          </div>
          <div className="info-box">
            <div><span className="info-label">{locale === 'ne' ? 'अक्षांश/देशान्तर' : 'Lat/Lon'}:</span> {bdata.latitude.toFixed(4)}°, {bdata.longitude.toFixed(4)}°</div>
            <div><span className="info-label">{locale === 'ne' ? 'समय क्षेत्र' : 'Timezone'}:</span> UTC+{bdata.timezone}</div>
            <div><span className="info-label">{locale === 'ne' ? 'अयनांश' : 'Ayanamsha'}:</span> {kundaliData.ayanamsha.toFixed(4)}°</div>
          </div>
        </div>

        <div className="chart-row">
          <div className="chart-col">
            <NorthIndianChart 
              grahas={kundaliData.grahas} 
              lagna={kundaliData.lagna} 
              size={300} 
              title={locale === 'ne' ? 'लग्न कुण्डली (D1)' : 'Lagna Chart (D1)'} 
            />
          </div>
          <div className="chart-col">
            {d9Chart && (
              <NorthIndianChart 
                grahas={kundaliData.grahas} 
                lagna={kundaliData.lagna} 
                vargaChart={d9Chart}
                size={300} 
                title={locale === 'ne' ? 'नवमांश कुण्डली (D9)' : 'Navamsha Chart (D9)'} 
              />
            )}
          </div>
        </div>

        <div className="section-title">{locale === 'ne' ? 'ग्रह स्पष्ट' : 'Planetary Positions'}</div>
        <div style={{ transform: 'scale(0.85)', transformOrigin: 'top left', width: '117%' }}>
          <GrahaSpashtaTable grahas={kundaliData.grahas} lagna={kundaliData.lagna} />
        </div>

        {/* Page 2: Panchanga */}
        <div className="page-break" />
        <div className="section-title mt-4">{locale === 'ne' ? 'पञ्चाङ्ग विवरण' : 'Panchanga Details'}</div>
        <div style={{ transform: 'scale(0.85)', transformOrigin: 'top left', width: '117%' }}>
          <PanchangaDisplay panchanga={kundaliData.panchanga} />
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useCallback } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { searchCities, CityData } from '@/lib/constants/cities';
import { adToBS, bsToAD, formatBSDate, formatADDate, NEPALI_MONTHS, ENGLISH_MONTHS } from '@/lib/calendar/bs-ad-converter';
import { useRouter } from 'next/navigation';

interface FormData {
  name: string;
  gotra: string;
  fatherName: string;
  motherName: string;
  gender: 'male' | 'female' | 'other';
  calendarType: 'ad' | 'bs';
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  ampm: 'am' | 'pm';
  isTimeUnknown: boolean;
  place: string;
  latitude: number;
  longitude: number;
  timezone: number;
  timezoneName: string;
}

export default function BirthDataForm() {
  const { t, locale } = useLanguage();
  const router = useRouter();

  const [form, setForm] = useState<FormData>({
    name: '', gotra: '', fatherName: '', motherName: '', gender: 'male',
    calendarType: 'ad',
    year: 1990, month: 1, day: 1,
    hour: 8, minute: 0, second: 0, ampm: 'am',
    isTimeUnknown: false,
    place: '', latitude: 27.7172, longitude: 85.3240,
    timezone: 5.75, timezoneName: 'Asia/Kathmandu',
  });

  const [cityResults, setCityResults] = useState<CityData[]>([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [convertedDate, setConvertedDate] = useState<string>('');

  // Update converted date preview
  const updateDatePreview = useCallback((calType: string, y: number, m: number, d: number) => {
    try {
      if (calType === 'ad') {
        const bs = adToBS({ year: y, month: m, day: d });
        setConvertedDate(`${t('form.bsDate')}: ${formatBSDate(bs, locale)}`);
      } else {
        const ad = bsToAD({ year: y, month: m, day: d });
        setConvertedDate(`${t('form.adDate')}: ${formatADDate(ad)}`);
      }
    } catch { setConvertedDate(''); }
  }, [t, locale]);

  const handleDateChange = (field: string, value: number) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    updateDatePreview(updated.calendarType, updated.year, updated.month, updated.day);
  };

  const debounceTimer = React.useRef<NodeJS.Timeout | null>(null);

  const handleCitySearch = (query: string) => {
    setForm(prev => ({ ...prev, place: query }));
    
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    
    if (query.length < 3) {
      setCityResults([]);
      setShowCityDropdown(false);
      return;
    }

    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const results = await res.json();
          setCityResults(results);
          setShowCityDropdown(results.length > 0);
        }
      } catch (err) {
        console.error('City search error:', err);
      }
    }, 500);
  };

  const selectCity = async (city: any) => {
    // Optimistically set lat/lng and close dropdown
    setForm(prev => ({
      ...prev,
      place: locale === 'ne' && city.nameNe ? city.nameNe : city.name,
      latitude: city.lat,
      longitude: city.lng,
    }));
    setShowCityDropdown(false);

    // Fetch timezone for the selected coordinates
    try {
      const res = await fetch(`/api/geocode?lat=${city.lat}&lon=${city.lng}`);
      if (res.ok) {
        const tzData = await res.json();
        setForm(prev => ({
          ...prev,
          timezone: tzData.timezoneOffset,
          timezoneName: tzData.timezoneName,
        }));
      }
    } catch (err) {
      console.error('Timezone fetch error:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name.trim()) {
      alert(locale === 'ne' ? 'कृपया नाम भर्नुहोस्' : 'Please enter a name');
      return;
    }
    if (!form.place.trim() || !form.latitude || !form.longitude) {
      alert(locale === 'ne' ? 'कृपया जन्मस्थान भर्नुहोस्' : 'Please select a birth place');
      return;
    }

    setIsLoading(true);

    let hour24 = form.hour;
    if (form.ampm === 'pm' && hour24 < 12) hour24 += 12;
    if (form.ampm === 'am' && hour24 === 12) hour24 = 0;

    try {
      const res = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          hour: hour24,
        }),
      });

      if (!res.ok) throw new Error('Calculation failed');
      const data = await res.json();

      // Store result and navigate to dashboard
      sessionStorage.setItem('kundaliResult', JSON.stringify(data));
      router.push('/kundali');
    } catch (err) {
      console.error(err);
      alert(locale === 'ne' ? 'गणनामा त्रुटि भयो' : 'Calculation error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const months = form.calendarType === 'bs' ? NEPALI_MONTHS : ENGLISH_MONTHS;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      {/* Name & Gotra */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1.5" style={{ color: 'var(--gold-400)' }}>{t('form.name')} <span className="text-red-500">*</span></label>
          <input type="text" className="input-field" placeholder={locale === 'ne' ? 'पूरा नाम लेख्नुहोस्' : 'Enter full name'}
            required
            value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} />
        </div>
        <div>
          <label className="block text-sm mb-1.5" style={{ color: 'var(--gold-400)' }}>{t('form.gotra')}</label>
          <input type="text" className="input-field" placeholder={locale === 'ne' ? 'गोत्र (वैकल्पिक)' : 'Gotra (optional)'}
            value={form.gotra} onChange={e => setForm(prev => ({ ...prev, gotra: e.target.value }))} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1.5" style={{ color: 'var(--gold-400)' }}>{t('form.fatherName')}</label>
          <input type="text" className="input-field" placeholder={locale === 'ne' ? 'बुवाको नाम (वैकल्पिक)' : 'Father\'s Name (optional)'}
            value={form.fatherName} onChange={e => setForm(prev => ({ ...prev, fatherName: e.target.value }))} />
        </div>
        <div>
          <label className="block text-sm mb-1.5" style={{ color: 'var(--gold-400)' }}>{t('form.motherName')}</label>
          <input type="text" className="input-field" placeholder={locale === 'ne' ? 'आमाको नाम (वैकल्पिक)' : 'Mother\'s Name (optional)'}
            value={form.motherName} onChange={e => setForm(prev => ({ ...prev, motherName: e.target.value }))} />
        </div>
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm mb-1.5" style={{ color: 'var(--gold-400)' }}>{t('form.gender')}</label>
        <div className="flex gap-4">
          {(['male', 'female', 'other'] as const).map(g => (
            <label key={g} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="gender" checked={form.gender === g}
                onChange={() => setForm(prev => ({ ...prev, gender: g }))}
                className="accent-amber-500" />
              <span className="text-sm">{t(`form.gender.${g}`)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Calendar Type Toggle */}
      <div>
        <label className="block text-sm mb-1.5" style={{ color: 'var(--gold-400)' }}>{t('form.dateType')}</label>
        <div className="flex gap-2">
          {(['ad', 'bs'] as const).map(ct => (
            <button key={ct} type="button"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${form.calendarType === ct ? 'bg-gradient-to-r from-amber-600 to-red-900 text-amber-100 border border-amber-500' : 'bg-gray-800/50 text-gray-400 border border-gray-700'}`}
              onClick={() => {
                setForm(prev => ({ ...prev, calendarType: ct }));
                updateDatePreview(ct, form.year, form.month, form.day);
              }}>
              {t(`form.dateType.${ct}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Date of Birth */}
      <div>
        <label className="block text-sm mb-1.5" style={{ color: 'var(--gold-400)' }}>{t('form.dob')}</label>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{t('form.year')} <span className="text-red-500">*</span></label>
            <input type="number" className="input-field" value={Number.isNaN(form.year) ? '' : (form.year === 0 ? '' : form.year)} required
              min={form.calendarType === 'bs' ? 1970 : 1900} max={form.calendarType === 'bs' ? 2100 : 2050}
              onChange={e => {
                let val = e.target.value.slice(0, 4);
                let num = parseInt(val, 10);
                if (Number.isNaN(num)) num = 0;
                handleDateChange('year', num);
              }} />
          </div>
          <div>
            <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{t('form.month')} <span className="text-red-500">*</span></label>
            <select className="input-field" value={form.month} required
              onChange={e => handleDateChange('month', parseInt(e.target.value, 10))}>
              {months.map((m, i) => (
                <option key={i} value={i + 1}>{typeof m === 'string' ? m : m[locale]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{t('form.day')} <span className="text-red-500">*</span></label>
            <input type="number" className="input-field" min={1} max={32} value={Number.isNaN(form.day) ? '' : (form.day === 0 ? '' : form.day)} required
              onChange={e => {
                let val = e.target.value.slice(0, 2);
                let num = parseInt(val, 10);
                if (Number.isNaN(num)) num = 0;
                if (num > 32) num = 0;
                handleDateChange('day', num);
              }} />
          </div>
        </div>
        {convertedDate && (
          <p className="mt-2 text-sm animate-pulse" style={{ color: 'var(--saffron-400)' }}>↔ {convertedDate}</p>
        )}
      </div>

      {/* Time of Birth */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm" style={{ color: 'var(--gold-400)' }}>{t('form.tob')}</label>
          <label className="flex items-center gap-2 text-xs cursor-pointer">
            <input type="checkbox" checked={form.isTimeUnknown}
              onChange={e => setForm(prev => ({ ...prev, isTimeUnknown: e.target.checked }))}
              className="accent-amber-500" />
            <span style={{ color: 'var(--text-secondary)' }}>{t('form.unknownTime')}</span>
          </label>
        </div>
        {!form.isTimeUnknown && (
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{t('form.hour')}</label>
              <input type="number" className="input-field" min={1} max={12} value={Number.isNaN(form.hour) ? '' : (form.hour === 0 ? '' : form.hour)}
                onChange={e => {
                  let val = e.target.value.slice(0, 2);
                  let num = parseInt(val, 10);
                  if (Number.isNaN(num)) num = 0;
                  if (num > 12) num = 0;
                  setForm(prev => ({ ...prev, hour: num }));
                }} />
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{t('form.minute')}</label>
              <input type="number" className="input-field" min={0} max={59} value={Number.isNaN(form.minute) ? '' : form.minute}
                onChange={e => {
                  let val = e.target.value.slice(0, 2);
                  let num = parseInt(val, 10);
                  if (Number.isNaN(num)) num = 0;
                  if (num > 59) num = 0;
                  setForm(prev => ({ ...prev, minute: num }));
                }} />
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{t('form.second')}</label>
              <input type="number" className="input-field" min={0} max={59} value={Number.isNaN(form.second) ? '' : form.second}
                onChange={e => {
                  let val = e.target.value.slice(0, 2);
                  let num = parseInt(val, 10);
                  if (Number.isNaN(num)) num = 0;
                  if (num > 59) num = 0;
                  setForm(prev => ({ ...prev, second: num }));
                }} />
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{t('form.ampm')}</label>
              <select className="input-field" value={form.ampm}
                onChange={e => setForm(prev => ({ ...prev, ampm: e.target.value as 'am' | 'pm' }))}>
                <option value="am">AM</option>
                <option value="pm">PM</option>
              </select>
            </div>
          </div>
        )}
        {form.isTimeUnknown && (
          <div className="p-3 rounded-lg text-sm" style={{ background: 'rgba(255, 140, 26, 0.1)', color: 'var(--saffron-400)', border: '1px solid rgba(255, 140, 26, 0.2)' }}>
            ⚠️ {t('warning.unknownTime')}
          </div>
        )}
      </div>

      {/* Place of Birth */}
      <div className="relative">
        <label className="block text-sm mb-1.5" style={{ color: 'var(--gold-400)' }}>{t('form.pob')} <span className="text-red-500">*</span></label>
        <input type="text" className="input-field" placeholder={locale === 'ne' ? 'शहर खोज्नुहोस्...' : 'Search city...'}
          value={form.place} onChange={e => handleCitySearch(e.target.value)} required
          onFocus={() => form.place.length >= 2 && setShowCityDropdown(cityResults.length > 0)} />
        {showCityDropdown && (
          <div className="absolute z-50 w-full mt-1 rounded-lg overflow-hidden border" style={{ background: 'var(--cosmic-700)', borderColor: 'var(--border-accent)' }}>
            {cityResults.map((city, i) => (
              <button key={i} type="button"
                className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-amber-900/30"
                onClick={() => selectCity(city)}>
                <span style={{ color: 'var(--text-primary)' }}>{locale === 'ne' ? city.nameNe : city.name}</span>
                <span className="ml-2 text-xs" style={{ color: 'var(--text-secondary)' }}>{city.state}, {city.country}</span>
              </button>
            ))}
          </div>
        )}
        {/* Manual lat/lng */}
        <div className="grid grid-cols-3 gap-3 mt-3">
          <div>
            <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{t('form.latitude')}</label>
            <input type="number" step="0.0001" className="input-field text-sm" value={form.latitude}
              onChange={e => setForm(prev => ({ ...prev, latitude: parseFloat(e.target.value) }))} />
          </div>
          <div>
            <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{t('form.longitude')}</label>
            <input type="number" step="0.0001" className="input-field text-sm" value={form.longitude}
              onChange={e => setForm(prev => ({ ...prev, longitude: parseFloat(e.target.value) }))} />
          </div>
          <div>
            <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{t('form.timezone')}</label>
            <input type="number" step="0.25" className="input-field text-sm" value={form.timezone}
              onChange={e => setForm(prev => ({ ...prev, timezone: parseFloat(e.target.value) }))} />
          </div>
        </div>
      </div>

      {/* Submit */}
      <button type="submit" className="btn-primary w-full text-lg" disabled={isLoading}>
        {isLoading ? (
          <span className="flex items-center justify-center gap-3">
            <span className="sacred-spinner" style={{ width: 24, height: 24 }}></span>
            {t('form.calculating')}
          </span>
        ) : (
          <>🔱 {t('form.submit')}</>
        )}
      </button>
    </form>
  );
}

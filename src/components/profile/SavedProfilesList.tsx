'use client';

import React, { useEffect, useState, useRef } from 'react';
import { getSavedProfiles, SavedProfile, deleteProfile, updateProfile } from '@/lib/utils/profileManager';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function SavedProfilesList() {
  const [profiles, setProfiles] = useState<SavedProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const router = useRouter();
  const { locale } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setProfiles(getSavedProfiles());
  }, []);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingId]);

  const handleOpenProfile = async (profile: SavedProfile) => {
    if (editingId) return; // Don't open if editing
    setIsLoading(true);
    try {
      const payload = {
        name: profile.name,
        gotra: profile.gotra,
        gender: profile.gender,
        year: profile.dateAD?.year || (profile as any).year,
        month: profile.dateAD?.month || (profile as any).month,
        day: profile.dateAD?.day || (profile as any).day,
        hour: profile.time?.hour || (profile as any).hour,
        minute: profile.time?.minute || (profile as any).minute,
        second: profile.time?.second || (profile as any).second || 0,
        isTimeUnknown: profile.isTimeUnknown,
        place: profile.place,
        latitude: profile.latitude,
        longitude: profile.longitude,
        timezone: profile.timezone,
        timezoneName: profile.timezoneName,
        calendarType: 'ad',
      };

      const res = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Calculation failed with status ${res.status}`);
      }
      
      const data = await res.json();

      try {
        sessionStorage.setItem('kundaliResult', JSON.stringify(data));
      } catch (storageError: any) {
        throw new Error('Storage limit exceeded: ' + storageError.message);
      }
      
      router.push('/kundali');
    } catch (e: any) {
      console.error(e);
      alert('Error opening profile: ' + (e.message || String(e)));
      setIsLoading(false);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm(locale === 'ne' ? 'के तपाइँ यो प्रोफाइल मेटाउन निश्चित हुनुहुन्छ?' : 'Are you sure you want to delete this profile?')) {
      deleteProfile(id);
      setProfiles(getSavedProfiles());
    }
  };

  const startEdit = (e: React.MouseEvent, p: SavedProfile) => {
    e.stopPropagation();
    setEditingId(p.id);
    setEditName(p.name);
  };

  const saveEdit = (e: React.FormEvent | React.FocusEvent | React.KeyboardEvent, p: SavedProfile) => {
    e.stopPropagation();
    if (e.type === 'keydown' && (e as React.KeyboardEvent).key !== 'Enter') return;
    
    if (editName.trim() && editName !== p.name) {
      updateProfile(p.id, { ...p, name: editName.trim() });
      setProfiles(getSavedProfiles());
    }
    setEditingId(null);
  };

  if (profiles.length === 0) return null;

  return (
    <div className="mt-12 max-w-4xl mx-auto">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2" style={{ color: 'var(--gold-400)' }}>
        💾 {locale === 'ne' ? 'सुरक्षित प्रोफाइलहरू' : 'Saved Profiles'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles.map(p => (
          <div 
            key={p.id} 
            className="glass-card p-4 cursor-pointer hover:border-amber-500/50 transition-all group relative"
            onClick={() => handleOpenProfile(p)}
          >
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={(e) => startEdit(e, p)}
                className="p-1 text-amber-400 hover:text-amber-300 transition-colors"
                title="Edit Name"
              >
                ✏️
              </button>
              <button 
                onClick={(e) => handleDelete(e, p.id)}
                className="p-1 text-red-400 hover:text-red-300 transition-colors"
                title="Delete Profile"
              >
                ✕
              </button>
            </div>

            {editingId === p.id ? (
              <input
                ref={inputRef}
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={(e) => saveEdit(e, p)}
                onKeyDown={(e) => saveEdit(e, p)}
                onClick={(e) => e.stopPropagation()}
                className="font-bold text-lg text-white mb-1 bg-black/50 border border-amber-500/50 rounded px-2 w-[80%] outline-none"
              />
            ) : (
              <h4 className="font-bold text-lg text-white mb-1 w-[80%] truncate">
                {p.name || (locale === 'ne' ? 'नाम नभएको' : 'Unnamed')}
              </h4>
            )}
            
            <div className="text-xs text-gray-400 space-y-1">
              <p>📅 {locale === 'ne'
                ? `${p.dateBS.year}-${p.dateBS.month}-${p.dateBS.day} BS` 
                : `${p.dateAD.year}-${p.dateAD.month}-${p.dateAD.day} AD`}
              </p>
              <p>🕒 {p.isTimeUnknown ? 'Unknown' : `${p.time.hour}:${p.time.minute.toString().padStart(2, '0')}`}</p>
              <p>📍 {p.place}</p>
            </div>
            {isLoading && !editingId && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

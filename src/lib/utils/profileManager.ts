import { BirthData } from '../types/chart';

export interface SavedProfile extends BirthData {
  id: string;
  savedAt: number;
}

const STORAGE_KEY = 'jyotish_saved_profiles';

export function getSavedProfiles(): SavedProfile[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to parse saved profiles', e);
    return [];
  }
}

export function saveProfile(data: BirthData): SavedProfile {
  const profiles = getSavedProfiles();
  
  // Create a clean copy of birth data without extra fields that might have sneaked in
  const profileData: BirthData = {
    name: data.name,
    gotra: data.gotra,
    gender: data.gender,
    dateAD: data.dateAD,
    dateBS: data.dateBS,
    time: data.time,
    isTimeUnknown: data.isTimeUnknown,
    place: data.place,
    latitude: data.latitude,
    longitude: data.longitude,
    timezone: data.timezone,
    timezoneName: data.timezoneName
  };

  const newProfile: SavedProfile = {
    ...profileData,
    id: crypto.randomUUID(),
    savedAt: Date.now()
  };
  
  profiles.push(newProfile);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  return newProfile;
}

export function updateProfile(id: string, data: BirthData): void {
  const profiles = getSavedProfiles();
  const index = profiles.findIndex(p => p.id === id);
  if (index !== -1) {
    profiles[index] = { ...profiles[index], ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  }
}

export function deleteProfile(id: string): void {
  const profiles = getSavedProfiles();
  const updated = profiles.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

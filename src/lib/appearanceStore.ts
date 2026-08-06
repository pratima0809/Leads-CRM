'use client';

import { create } from 'zustand';

export interface WallpaperConfig {
  type: 'default' | 'solid' | 'gradient' | 'pattern' | 'upload';
  value: string;
  name: string;
  opacity: number;
  blur: boolean;
  doodle: boolean;
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  chatWallpaper: {
    light: WallpaperConfig;
    dark: WallpaperConfig;
  };
}

const defaultWallpaper: WallpaperConfig = {
  type: 'default',
  value: 'none',
  name: 'None',
  opacity: 50,
  blur: false,
  doodle: false,
};

function loadSettings(): AppearanceSettings {
  if (typeof window === 'undefined') return { theme: 'system', chatWallpaper: { light: { ...defaultWallpaper }, dark: { ...defaultWallpaper } } };
  try {
    const raw = localStorage.getItem('appearance');
    if (raw) return JSON.parse(raw);
  } catch {}
  return { theme: 'system', chatWallpaper: { light: { ...defaultWallpaper }, dark: { ...defaultWallpaper } } };
}

function saveSettings(s: AppearanceSettings) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('appearance', JSON.stringify(s));
}

export const LIGHT_WALLPAPERS: WallpaperConfig[] = [
  { type: 'default', value: 'none', name: 'None', opacity: 50, blur: false, doodle: false },
  { type: 'solid', value: '#FFFFFF', name: 'White', opacity: 50, blur: false, doodle: false },
  { type: 'solid', value: '#F3F4F6', name: 'Soft Grey', opacity: 50, blur: false, doodle: false },
  { type: 'solid', value: '#FEF3C7', name: 'Beige', opacity: 50, blur: false, doodle: false },
  { type: 'solid', value: '#D1FAE5', name: 'Mint', opacity: 50, blur: false, doodle: false },
  { type: 'solid', value: '#DBEAFE', name: 'Sky Blue', opacity: 50, blur: false, doodle: false },
  { type: 'solid', value: '#E9D5FF', name: 'Lavender', opacity: 50, blur: false, doodle: false },
  { type: 'solid', value: '#FCE7F3', name: 'Peach', opacity: 50, blur: false, doodle: false },
  { type: 'pattern', value: 'wa-doodle-light', name: 'WhatsApp Light Doodle', opacity: 30, blur: false, doodle: true },
  { type: 'pattern', value: 'paper-texture', name: 'Paper Texture', opacity: 40, blur: false, doodle: false },
  { type: 'pattern', value: 'marble', name: 'Marble', opacity: 40, blur: false, doodle: false },
  { type: 'gradient', value: 'linear-gradient(135deg, #60A5FA, #3B82F6)', name: 'Blue Gradient', opacity: 30, blur: false, doodle: false },
  { type: 'gradient', value: 'linear-gradient(135deg, #C084FC, #8B5CF6)', name: 'Purple Gradient', opacity: 30, blur: false, doodle: false },
];

export const DARK_WALLPAPERS: WallpaperConfig[] = [
  { type: 'default', value: 'none', name: 'None', opacity: 50, blur: false, doodle: false },
  { type: 'solid', value: '#000000', name: 'Black', opacity: 50, blur: false, doodle: false },
  { type: 'solid', value: '#1F2937', name: 'Dark Grey', opacity: 50, blur: false, doodle: false },
  { type: 'solid', value: '#1E3A5F', name: 'Midnight Blue', opacity: 50, blur: false, doodle: false },
  { type: 'solid', value: '#064E3B', name: 'Forest Green', opacity: 50, blur: false, doodle: false },
  { type: 'solid', value: '#3B0764', name: 'Purple Night', opacity: 50, blur: false, doodle: false },
  { type: 'pattern', value: 'galaxy', name: 'Galaxy', opacity: 40, blur: false, doodle: false },
  { type: 'pattern', value: 'carbon-fiber', name: 'Carbon Fiber', opacity: 40, blur: false, doodle: false },
  { type: 'pattern', value: 'dark-marble', name: 'Dark Marble', opacity: 40, blur: false, doodle: false },
  { type: 'pattern', value: 'wa-doodle-dark', name: 'Dark Doodle', opacity: 30, blur: false, doodle: true },
  { type: 'gradient', value: 'linear-gradient(135deg, #00BFA6, #0284C7)', name: 'Neon Gradient', opacity: 30, blur: false, doodle: false },
  { type: 'pattern', value: 'dark-paper', name: 'Dark Paper', opacity: 40, blur: false, doodle: false },
];

interface AppearanceStore extends AppearanceSettings {
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setWallpaper: (mode: 'light' | 'dark', config: WallpaperConfig) => void;
  setWallpaperOpacity: (mode: 'light' | 'dark', opacity: number) => void;
  setWallpaperBlur: (mode: 'light' | 'dark', blur: boolean) => void;
  setWallpaperDoodle: (mode: 'light' | 'dark', doodle: boolean) => void;
  uploadWallpaper: (mode: 'light' | 'dark', dataUrl: string, name: string) => void;
  resetToDefaults: () => void;
}

export const useAppearanceStore = create<AppearanceStore>((set, get) => {
  const initial = loadSettings();
  return {
    ...initial,
    setTheme: (theme) => {
      set({ theme });
      const s = { ...get(), theme };
      saveSettings(s);
    },
    setWallpaper: (mode, config) => {
      set({ chatWallpaper: { ...get().chatWallpaper, [mode]: config } });
      saveSettings({ ...get(), chatWallpaper: { ...get().chatWallpaper, [mode]: config } });
    },
    setWallpaperOpacity: (mode, opacity) => {
      const wp = { ...get().chatWallpaper[mode], opacity };
      set({ chatWallpaper: { ...get().chatWallpaper, [mode]: wp } });
      saveSettings({ ...get(), chatWallpaper: { ...get().chatWallpaper, [mode]: wp } });
    },
    setWallpaperBlur: (mode, blur) => {
      const wp = { ...get().chatWallpaper[mode], blur };
      set({ chatWallpaper: { ...get().chatWallpaper, [mode]: wp } });
      saveSettings({ ...get(), chatWallpaper: { ...get().chatWallpaper, [mode]: wp } });
    },
    setWallpaperDoodle: (mode, doodle) => {
      const wp = { ...get().chatWallpaper[mode], doodle };
      set({ chatWallpaper: { ...get().chatWallpaper, [mode]: wp } });
      saveSettings({ ...get(), chatWallpaper: { ...get().chatWallpaper, [mode]: wp } });
    },
    uploadWallpaper: (mode, dataUrl, name) => {
      const wp: WallpaperConfig = { type: 'upload', value: dataUrl, name, opacity: 50, blur: false, doodle: false };
      set({ chatWallpaper: { ...get().chatWallpaper, [mode]: wp } });
      saveSettings({ ...get(), chatWallpaper: { ...get().chatWallpaper, [mode]: wp } });
    },
    resetToDefaults: () => {
      const defaults: AppearanceSettings = { theme: 'system', chatWallpaper: { light: { ...defaultWallpaper }, dark: { ...defaultWallpaper } } };
      set(defaults);
      saveSettings(defaults);
    },
  };
});

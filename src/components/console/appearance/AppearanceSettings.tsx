'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon, Monitor, Sliders, Eye, RotateCcw, Image as ImageIcon } from 'lucide-react';
import { useAppearanceStore, WallpaperConfig } from '@/lib/appearanceStore';
import { useAppearance } from '@/hooks/useAppearance';
import WallpaperGallery from './WallpaperGallery';
import WallpaperPreview from './WallpaperPreview';

export default function AppearanceSettings() {
  const store = useAppearanceStore();
  const { theme, resolvedTheme, lightWallpaper, darkWallpaper } = useAppearance();

  const [mode, setMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    setMode(resolvedTheme);
  }, [resolvedTheme]);

  const currentWallpaper = mode === 'dark' ? darkWallpaper : lightWallpaper;

  const handleSelectWallpaper = (wp: WallpaperConfig) => {
    store.setWallpaper(mode, wp);
  };

  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="max-w-5xl mx-auto flex flex-col gap-6 pb-8">

        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-text-primary tracking-tight">Chat Appearance</h2>
          <p className="text-sm text-text-secondary mt-1">Customize how your WhatsApp chat looks and feels.</p>
        </div>

        {/* Theme Selection */}
        <div className="bg-surface-card border border-border-default rounded-xl p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <Sun className="w-5 h-5 text-accent" />
            <h3 className="text-base font-semibold text-text-primary">Theme</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'light' as const, label: 'Light', icon: Sun, desc: 'Always light' },
              { value: 'dark' as const, label: 'Dark', icon: Moon, desc: 'Always dark' },
              { value: 'system' as const, label: 'System', icon: Monitor, desc: 'Follow device' },
            ].map((opt) => {
              const Icon = opt.icon;
              const isActive = theme === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => store.setTheme(opt.value)}
                  aria-label={`${opt.label} theme`}
                  aria-pressed={isActive}
                  className={`
                    flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-accent
                    ${isActive
                      ? 'border-accent bg-accent/5 ring-1 ring-accent/20'
                      : 'border-border-default hover:border-accent/30 hover:bg-surface-bg-alt/50'
                    }
                  `}
                >
                  <div className={`p-2.5 rounded-full transition-colors ${isActive ? 'bg-accent text-white' : 'bg-surface-bg-alt text-icon'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-sm font-semibold ${isActive ? 'text-accent' : 'text-text-primary'}`}>
                    {opt.label}
                  </span>
                  <span className="text-[10px] text-text-muted">{opt.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Wallpaper Selection */}
        <div className="bg-surface-card border border-border-default rounded-xl overflow-hidden">
          <div className="p-5 pb-0">
            <div className="flex items-center gap-2.5 mb-1">
              <ImageIcon className="w-5 h-5 text-accent" />
              <h3 className="text-base font-semibold text-text-primary">Chat Wallpaper</h3>
            </div>
            <p className="text-xs text-text-muted mb-4">
              Choose a wallpaper for <span className="font-semibold text-text-primary capitalize">{mode}</span> mode.
              Switch the theme above to configure each mode separately.
            </p>

            {/* Mode toggle tabs */}
            <div className="flex gap-1 bg-surface-bg-alt rounded-lg p-1 w-fit mb-4" role="tablist" aria-label="Wallpaper mode">
              <button
                role="tab"
                aria-selected={mode === 'light'}
                onClick={() => setMode('light')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${mode === 'light' ? 'bg-surface-card text-accent shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
              >
                <Sun className="w-3.5 h-3.5" />
                Light
              </button>
              <button
                role="tab"
                aria-selected={mode === 'dark'}
                onClick={() => setMode('dark')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${mode === 'dark' ? 'bg-surface-card text-accent shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
              >
                <Moon className="w-3.5 h-3.5" />
                Dark
              </button>
            </div>
          </div>

          <div className="px-5 pb-5">
            <WallpaperGallery
              isDark={mode === 'dark'}
              selected={currentWallpaper}
              onSelect={handleSelectWallpaper}
            />
          </div>
        </div>

        {/* Wallpaper Controls */}
        <div className="bg-surface-card border border-border-default rounded-xl p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <Sliders className="w-5 h-5 text-accent" />
            <h3 className="text-base font-semibold text-text-primary">Wallpaper Controls</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Opacity */}
            <div>
              <label className="flex items-center justify-between text-xs font-medium text-text-primary mb-2">
                Opacity
                <span className="text-accent font-bold">{currentWallpaper.opacity}%</span>
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={currentWallpaper.opacity}
                onChange={(e) => store.setWallpaperOpacity(mode, Number(e.target.value))}
                className="w-full h-1.5 bg-surface-bg-alt rounded-full appearance-none cursor-pointer accent-accent
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-sm
                  [&::-webkit-slider-thumb]:cursor-pointer"
                aria-label="Wallpaper opacity"
              />
            </div>

            {/* Blur */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-text-primary block">Blur</span>
                <span className="text-[10px] text-text-muted">Soft background blur</span>
              </div>
              <button
                onClick={() => store.setWallpaperBlur(mode, !currentWallpaper.blur)}
                aria-label={`Toggle wallpaper blur: ${currentWallpaper.blur ? 'on' : 'off'}`}
                aria-pressed={currentWallpaper.blur}
                className={`
                  relative w-11 h-6 rounded-full transition-colors duration-200
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-accent
                  ${currentWallpaper.blur ? 'bg-accent' : 'bg-border-default'}
                `}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${currentWallpaper.blur ? 'translate-x-5' : 'translate-x-0'}`}
                />
              </button>
            </div>

            {/* Doodle */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-text-primary block">Doodle Overlay</span>
                <span className="text-[10px] text-text-muted">Fun background patterns</span>
              </div>
              <button
                onClick={() => store.setWallpaperDoodle(mode, !currentWallpaper.doodle)}
                aria-label={`Toggle doodle overlay: ${currentWallpaper.doodle ? 'on' : 'off'}`}
                aria-pressed={currentWallpaper.doodle}
                className={`
                  relative w-11 h-6 rounded-full transition-colors duration-200
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-accent
                  ${currentWallpaper.doodle ? 'bg-accent' : 'bg-border-default'}
                `}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${currentWallpaper.doodle ? 'translate-x-5' : 'translate-x-0'}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="bg-surface-card border border-border-default rounded-xl p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <Eye className="w-5 h-5 text-accent" />
            <h3 className="text-base font-semibold text-text-primary">Preview</h3>
          </div>
          <div className="max-w-md mx-auto">
            <WallpaperPreview wallpaper={currentWallpaper} isDark={mode === 'dark'} />
          </div>
        </div>

        {/* Reset */}
        <div className="flex justify-end">
          <button
            onClick={store.resetToDefaults}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary hover:text-error rounded-lg hover:bg-error/5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
}

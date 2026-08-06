'use client';

import React, { memo, useState, useMemo } from 'react';
import { SwatchBook, PaintBucket, LayoutGrid, Upload } from 'lucide-react';
import WallpaperCard from './WallpaperCard';
import { WallpaperConfig, LIGHT_WALLPAPERS, DARK_WALLPAPERS } from '@/lib/appearanceStore';

interface WallpaperGalleryProps {
  isDark: boolean;
  selected: WallpaperConfig;
  onSelect: (wp: WallpaperConfig) => void;
}

type Tab = 'default' | 'solids' | 'gradients' | 'patterns' | 'upload';

const tabs: { id: Tab; label: string; icon: any }[] = [
  { id: 'default', label: 'Default', icon: SwatchBook },
  { id: 'solids', label: 'Solid Colors', icon: PaintBucket },
  { id: 'gradients', label: 'Gradients', icon: LayoutGrid },
  { id: 'patterns', label: 'Patterns', icon: LayoutGrid },
  { id: 'upload', label: 'Upload Custom', icon: Upload },
];

function filterWallpapers(wps: WallpaperConfig[], tab: Tab): WallpaperConfig[] {
  switch (tab) {
    case 'default': return wps.filter(w => w.type === 'default');
    case 'solids': return wps.filter(w => w.type === 'solid');
    case 'gradients': return wps.filter(w => w.type === 'gradient');
    case 'patterns': return wps.filter(w => w.type === 'pattern');
    default: return [];
  }
}

const WallpaperGallery = memo(function WallpaperGallery({ isDark, selected, onSelect }: WallpaperGalleryProps) {
  const [activeTab, setActiveTab] = useState<Tab>('default');
  const wallpapers = isDark ? DARK_WALLPAPERS : LIGHT_WALLPAPERS;

  const filtered = useMemo(() => filterWallpapers(wallpapers, activeTab), [wallpapers, activeTab]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1 bg-surface-bg-alt rounded-lg p-1 overflow-x-auto no-scrollbar" role="tablist" aria-label="Wallpaper categories">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium whitespace-nowrap transition-all
                focus:outline-none focus-visible:ring-2 focus-visible:ring-accent
                ${isActive ? 'bg-surface-card text-accent shadow-sm' : 'text-text-secondary hover:text-text-primary'}
              `}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'upload' ? (
        <div className="bg-surface-bg-alt/50 border border-dashed border-border-default rounded-xl p-8 text-center">
          <Upload className="w-10 h-10 text-icon mx-auto mb-3" />
          <p className="text-sm font-medium text-text-secondary mb-1">Upload Custom Wallpaper</p>
          <p className="text-xs text-text-muted mb-4">JPG, PNG or WEBP — Max 5MB</p>
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-semibold rounded-lg cursor-pointer hover:bg-accent-hover transition-colors">
            <Upload className="w-4 h-4" />
            Choose File
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (file.size > 5 * 1024 * 1024) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                  const dataUrl = ev.target?.result as string;
                  const custom: WallpaperConfig = {
                    type: 'upload',
                    value: dataUrl,
                    name: file.name,
                    opacity: 50,
                    blur: false,
                    doodle: false,
                  };
                  onSelect(custom);
                };
                reader.readAsDataURL(file);
              }}
            />
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 max-h-[360px] overflow-y-auto no-scrollbar pr-1" role="list" aria-label="Available wallpapers">
          {filtered.map((wp, i) => (
            <WallpaperCard
              key={`${wp.name}-${i}`}
              wallpaper={wp}
              selected={selected.value === wp.value && selected.type === wp.type}
              onSelect={() => onSelect(wp)}
              isDark={isDark}
            />
          ))}
        </div>
      )}
    </div>
  );
});

export default WallpaperGallery;

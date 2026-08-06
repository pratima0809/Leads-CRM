'use client';

import React, { memo } from 'react';
import { Check, Image as ImageIcon } from 'lucide-react';
import { WallpaperConfig } from '@/lib/appearanceStore';

interface WallpaperCardProps {
  wallpaper: WallpaperConfig;
  selected: boolean;
  onSelect: () => void;
  isDark?: boolean;
}

function getPreviewStyle(wp: WallpaperConfig, isDark?: boolean): React.CSSProperties {
  if (wp.type === 'default' || wp.value === 'none') {
    return { background: isDark ? '#1F2937' : '#F3F4F6' };
  }
  if (wp.type === 'solid') {
    return { backgroundColor: wp.value };
  }
  if (wp.type === 'gradient') {
    return { backgroundImage: wp.value };
  }
  if (wp.type === 'upload' && (wp.value.startsWith('data:') || wp.value.startsWith('http'))) {
    return { backgroundImage: `url(${wp.value})`, backgroundSize: 'cover', backgroundPosition: 'center' };
  }
  if (wp.type === 'pattern') {
    if (wp.value === 'wa-doodle-light') return { background: '#FFFFFF', backgroundImage: 'radial-gradient(circle at 25% 25%, #E5E7EB 1px, transparent 1px), radial-gradient(circle at 75% 75%, #E5E7EB 1px, transparent 1px)', backgroundSize: '20px 20px' };
    if (wp.value === 'paper-texture') return { background: '#F5F0E8', backgroundImage: 'repeating-linear-gradient(0deg, #E8E0D0 1px, transparent 1px, transparent 20px)' };
    if (wp.value === 'marble') return { background: 'linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 50%, #DEE2E6 100%)' };
    if (wp.value === 'galaxy') return { background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)' };
    if (wp.value === 'carbon-fiber') return { background: '#1F2937', backgroundImage: 'repeating-linear-gradient(45deg, #374151 1px, transparent 1px, transparent 10px)' };
    if (wp.value === 'dark-marble') return { background: 'linear-gradient(135deg, #111827 0%, #1F2937 50%, #111827 100%)' };
    if (wp.value === 'wa-doodle-dark') return { background: '#111827', backgroundImage: 'radial-gradient(circle at 25% 25%, #374151 1px, transparent 1px), radial-gradient(circle at 75% 75%, #374151 1px, transparent 1px)', backgroundSize: '20px 20px' };
    if (wp.value === 'dark-paper') return { background: '#1A1A2E', backgroundImage: 'repeating-linear-gradient(0deg, #2D2D44 1px, transparent 1px, transparent 20px)' };
    return { background: isDark ? '#1F2937' : '#F3F4F6' };
  }
  return { background: isDark ? '#1F2937' : '#F3F4F6' };
}

const WallpaperCard = memo(function WallpaperCard({ wallpaper, selected, onSelect, isDark }: WallpaperCardProps) {
  const previewStyle = getPreviewStyle(wallpaper, isDark);

  return (
    <button
      onClick={onSelect}
      aria-label={`Select ${wallpaper.name} wallpaper`}
      aria-pressed={selected}
      className={`
        relative group flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
        ${selected ? 'bg-accent/10 ring-2 ring-accent' : 'hover:bg-surface-bg-alt'}
      `}
    >
      <div
        className="w-full aspect-[4/3] rounded-lg border border-border-default overflow-hidden transition-transform duration-200 group-hover:scale-105"
        style={previewStyle}
      >
        {wallpaper.type === 'upload' && !wallpaper.value.startsWith('data:') && (
          <div className="w-full h-full flex items-center justify-center bg-surface-bg-alt">
            <ImageIcon className="w-5 h-5 text-icon" />
          </div>
        )}
        {selected && (
          <div className="absolute inset-0 flex items-center justify-center bg-accent/20">
            <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
        )}
      </div>
      <span className={`text-[10px] font-medium truncate w-full text-center ${selected ? 'text-accent' : 'text-text-secondary'}`}>
        {wallpaper.name}
      </span>
    </button>
  );
});

export default WallpaperCard;

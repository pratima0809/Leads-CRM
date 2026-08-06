'use client';

import React, { memo } from 'react';
import { Check, CheckCheck } from 'lucide-react';
import { WallpaperConfig } from '@/lib/appearanceStore';

interface WallpaperPreviewProps {
  wallpaper: WallpaperConfig;
  isDark: boolean;
}

function getWallpaperBg(wp: WallpaperConfig, isDark: boolean): React.CSSProperties {
  if (wp.type === 'default' || wp.value === 'none') {
    return { background: isDark ? '#0F172A' : '#F9FAFB' };
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
    if (wp.value === 'wa-doodle-light') return { backgroundColor: '#FFFFFF', backgroundImage: 'radial-gradient(circle at 25% 25%, #E5E7EB 1px, transparent 1px), radial-gradient(circle at 75% 75%, #E5E7EB 1px, transparent 1px)', backgroundSize: '20px 20px' };
    if (wp.value === 'paper-texture') return { backgroundColor: '#F5F0E8', backgroundImage: 'repeating-linear-gradient(0deg, #E8E0D0 1px, transparent 1px, transparent 20px)' };
    if (wp.value === 'marble') return { background: 'linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 50%, #DEE2E6 100%)' };
    if (wp.value === 'galaxy') return { background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)' };
    if (wp.value === 'carbon-fiber') return { backgroundColor: '#1F2937', backgroundImage: 'repeating-linear-gradient(45deg, #374151 1px, transparent 1px, transparent 10px)' };
    if (wp.value === 'dark-marble') return { background: 'linear-gradient(135deg, #111827 0%, #1F2937 50%, #111827 100%)' };
    if (wp.value === 'wa-doodle-dark') return { backgroundColor: '#111827', backgroundImage: 'radial-gradient(circle at 25% 25%, #374151 1px, transparent 1px), radial-gradient(circle at 75% 75%, #374151 1px, transparent 1px)', backgroundSize: '20px 20px' };
    if (wp.value === 'dark-paper') return { backgroundColor: '#1A1A2E', backgroundImage: 'repeating-linear-gradient(0deg, #2D2D44 1px, transparent 1px, transparent 20px)' };
    return { background: isDark ? '#1F2937' : '#F3F4F6' };
  }
  return { background: isDark ? '#1F2937' : '#F3F4F6' };
}

const WallpaperPreview = memo(function WallpaperPreview({ wallpaper, isDark }: WallpaperPreviewProps) {
  const isDefault = wallpaper.type === 'default' || wallpaper.value === 'none';
  const baseBg = getWallpaperBg(wallpaper, isDark);

  const backgroundLayer: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    transition: 'opacity 300ms ease-in-out',
    ...baseBg,
    opacity: wallpaper.opacity / 100,
  };

  const doodleStyle: React.CSSProperties | null = wallpaper.doodle && !isDefault ? {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    opacity: 0.04,
    backgroundImage: `radial-gradient(circle at 25% 25%, currentColor 1px, transparent 1px), radial-gradient(circle at 75% 75%, currentColor 1px, transparent 1px)`,
    backgroundSize: '20px 20px',
  } : null;

  return (
    <div className="relative w-full h-full min-h-[280px] rounded-xl border border-border-default overflow-hidden"
      style={{ background: isDefault ? (isDark ? '#0F172A' : '#F9FAFB') : 'transparent' }}>
      {!isDefault && <div style={backgroundLayer} />}
      {doodleStyle && <div style={doodleStyle} />}
      {wallpaper.blur && !isDefault && <div className="absolute inset-0 backdrop-blur-sm pointer-events-none" />}
      <div className="absolute inset-0 flex flex-col justify-end p-4 gap-2">
        <div className="flex items-start gap-2 max-w-[75%] self-start">
          <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-[9px] font-bold text-accent shrink-0 mt-1">JW</div>
          <div className="bg-surface-card border border-border-default rounded-lg rounded-tl-none p-2.5 shadow-sm">
            <p className="text-[10px] text-text-primary leading-relaxed">Can you share the specifications?</p>
            <div className="flex items-center gap-1 mt-1 justify-end">
              <span className="text-[8px] text-text-muted">10:42 AM</span>
            </div>
          </div>
        </div>
        <div className="flex items-start gap-2 max-w-[75%] self-end">
          <div className="bg-accent text-white rounded-lg rounded-tr-none p-2.5 shadow-sm">
            <p className="text-[10px] leading-relaxed">Sure, sending the PDF now.</p>
            <div className="flex items-center gap-1 mt-1 justify-end">
              <CheckCheck className="w-2.5 h-2.5 text-white/70" />
              <span className="text-[8px] text-white/70">10:43 AM</span>
            </div>
          </div>
        </div>
        <div className="flex items-start gap-2 max-w-[75%] self-start">
          <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-[9px] font-bold text-accent shrink-0 mt-1">JW</div>
          <div className="bg-surface-card border border-border-default rounded-lg rounded-tl-none p-2.5 shadow-sm">
            <p className="text-[10px] text-text-primary leading-relaxed">Thank you! We&apos;ll review the quote.</p>
            <div className="flex items-center gap-1 mt-1 justify-end">
              <Check className="w-2.5 h-2.5 text-text-muted" />
              <span className="text-[8px] text-text-muted">10:45 AM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default WallpaperPreview;

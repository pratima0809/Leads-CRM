'use client';

import { useMemo } from 'react';
import { useAppearanceStore } from '@/lib/appearanceStore';

export function useAppearance() {
  const store = useAppearanceStore();
  const { theme, chatWallpaper } = store;

  const resolvedTheme = useMemo(() => {
    if (theme === 'system') {
      if (typeof window === 'undefined') return 'light';
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  }, [theme]);

  const activeWallpaper = resolvedTheme === 'dark' ? chatWallpaper.dark : chatWallpaper.light;

  const wallpaperStyle = useMemo((): React.CSSProperties => {
    const style: React.CSSProperties = {};

    if (activeWallpaper.type === 'default' || activeWallpaper.value === 'none') {
      return {};
    }

    if (activeWallpaper.type === 'solid') {
      style.backgroundColor = activeWallpaper.value;
    } else if (activeWallpaper.type === 'gradient') {
      style.backgroundImage = activeWallpaper.value;
    } else if (activeWallpaper.type === 'pattern' || activeWallpaper.type === 'upload') {
      if (activeWallpaper.value.startsWith('data:') || activeWallpaper.value.startsWith('http')) {
        style.backgroundImage = `url(${activeWallpaper.value})`;
      } else {
        style.backgroundColor = resolvedTheme === 'dark' ? '#1F2937' : '#F3F4F6';
      }
    }

    return style;
  }, [activeWallpaper, resolvedTheme]);

  const wallpaperBackgroundLayer = useMemo((): { style: React.CSSProperties; show: boolean } => {
    const hasWallpaper = activeWallpaper.type !== 'default' && activeWallpaper.value !== 'none';
    if (!hasWallpaper) return { style: {}, show: false };

    const style: React.CSSProperties = {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      transition: 'opacity 300ms ease-in-out',
    };

    if (activeWallpaper.type === 'solid') {
      style.backgroundColor = activeWallpaper.value;
    } else if (activeWallpaper.type === 'gradient') {
      style.backgroundImage = activeWallpaper.value;
    } else if (activeWallpaper.type === 'pattern' || activeWallpaper.type === 'upload') {
      if (activeWallpaper.value.startsWith('data:') || activeWallpaper.value.startsWith('http')) {
        style.backgroundImage = `url(${activeWallpaper.value})`;
        style.backgroundSize = 'cover';
        style.backgroundPosition = 'center';
      } else {
        style.backgroundColor = resolvedTheme === 'dark' ? '#1F2937' : '#F3F4F6';
      }
    }

    style.opacity = activeWallpaper.opacity / 100;

    return { style, show: true };
  }, [activeWallpaper, resolvedTheme]);

  const containerClass = useMemo(() => {
    const classes: string[] = [];
    if (activeWallpaper.blur && activeWallpaper.type !== 'default' && activeWallpaper.value !== 'none') {
      classes.push('backdrop-blur-sm');
    }
    return classes.join(' ');
  }, [activeWallpaper.blur, activeWallpaper.type, activeWallpaper.value]);

  const doodleOverlay = useMemo((): React.CSSProperties | null => {
    if (!activeWallpaper.doodle || activeWallpaper.type === 'default' || activeWallpaper.value === 'none') return null;
    return {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      opacity: 0.04,
      backgroundImage: `radial-gradient(circle at 25% 25%, currentColor 1px, transparent 1px), radial-gradient(circle at 75% 75%, currentColor 1px, transparent 1px)`,
      backgroundSize: '20px 20px',
      transition: 'opacity 300ms ease-in-out',
    };
  }, [activeWallpaper.doodle, activeWallpaper.type, activeWallpaper.value]);

  const isDefault = activeWallpaper.type === 'default' || activeWallpaper.value === 'none';

  return {
    theme,
    resolvedTheme,
    activeWallpaper,
    wallpaperStyle,
    wallpaperBackgroundLayer,
    containerClass,
    doodleOverlay,
    isDefault,
    lightWallpaper: chatWallpaper.light,
    darkWallpaper: chatWallpaper.dark,
  };
}

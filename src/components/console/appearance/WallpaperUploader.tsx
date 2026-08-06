'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, ZoomIn, ZoomOut, RotateCw, RotateCcw, Trash2 } from 'lucide-react';
import { WallpaperConfig } from '@/lib/appearanceStore';

interface WallpaperUploaderProps {
  onUpload: (config: WallpaperConfig) => void;
  current?: WallpaperConfig;
}

export default function WallpaperUploader({ onUpload, current }: WallpaperUploaderProps) {
  const [preview, setPreview] = useState<string | null>(
    current?.type === 'upload' && (current.value.startsWith('data:') || current.value.startsWith('http')) ? current.value : null
  );
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState(current?.type === 'upload' ? current.name : '');

  const handleFile = useCallback((file: File) => {
    if (!file || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return;
    if (file.size > 5 * 1024 * 1024) return;
    setFileName(file.name);
    setZoom(100);
    setRotation(0);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleApply = () => {
    if (!preview) return;
    const config: WallpaperConfig = {
      type: 'upload',
      value: preview,
      name: fileName || 'Custom Wallpaper',
      opacity: 50,
      blur: false,
      doodle: false,
    };
    onUpload(config);
  };

  const handleRemove = () => {
    setPreview(null);
    setFileName('');
    setZoom(100);
    setRotation(0);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="flex flex-col gap-4">
      {!preview ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-border-default rounded-xl p-8 text-center hover:border-accent/50 transition-colors cursor-pointer"
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
          aria-label="Upload wallpaper"
        >
          <Upload className="w-10 h-10 text-icon mx-auto mb-3" />
          <p className="text-sm font-medium text-text-secondary mb-1">Drop an image here or click to browse</p>
          <p className="text-xs text-text-muted">JPG, PNG or WEBP — Max 5MB</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="relative overflow-hidden rounded-xl border border-border-default bg-surface-bg-alt/50" style={{ maxHeight: 300 }}>
            <div
              className="w-full h-64 transition-transform duration-200"
              style={{
                backgroundImage: `url(${preview})`,
                backgroundSize: `${zoom}%`,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                transform: `rotate(${rotation}deg)`,
              }}
            />
          </div>

          <div className="flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={() => setZoom(z => Math.max(50, z - 10))}
              className="p-2 rounded-lg bg-surface-bg-alt text-text-secondary hover:bg-surface-bg-alt/80 transition-colors"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-medium text-text-primary w-10 text-center">{zoom}%</span>
            <button
              onClick={() => setZoom(z => Math.min(200, z + 10))}
              className="p-2 rounded-lg bg-surface-bg-alt text-text-secondary hover:bg-surface-bg-alt/80 transition-colors"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className="w-px h-5 bg-border-default mx-1" />
            <button
              onClick={() => setRotation(r => r - 90)}
              className="p-2 rounded-lg bg-surface-bg-alt text-text-secondary hover:bg-surface-bg-alt/80 transition-colors"
              aria-label="Rotate counter-clockwise"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setRotation(r => r + 90)}
              className="p-2 rounded-lg bg-surface-bg-alt text-text-secondary hover:bg-surface-bg-alt/80 transition-colors"
              aria-label="Rotate clockwise"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <div className="w-px h-5 bg-border-default mx-1" />
            <button
              onClick={handleRemove}
              className="p-2 rounded-lg bg-error/10 text-error hover:bg-error/20 transition-colors"
              aria-label="Remove image"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleApply}
              className="flex-1 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Apply Wallpaper
            </button>
            <button
              onClick={() => inputRef.current?.click()}
              className="py-2 px-4 bg-surface-bg-alt text-text-secondary text-sm font-medium rounded-lg hover:bg-surface-bg-alt/80 transition-colors"
            >
              Change
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

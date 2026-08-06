'use client';

import React from 'react';

export function SettingsSection({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h2 className="text-sm font-bold text-text-primary">{title}</h2>
        {desc && <p className="text-xs text-text-muted mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

export function SettingsRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border-default/50 last:border-0">
      <div className="flex-1 min-w-0 pr-4">
        <span className="text-xs font-medium text-text-primary">{label}</span>
        {desc && <p className="text-[10px] text-text-muted mt-0.5">{desc}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export function SettingsCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-surface-card border border-border-default rounded-xl p-5 space-y-1 ${className}`}>{children}</div>;
}

export function SettingsToggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      aria-label={label || 'Toggle'}
      aria-pressed={checked}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent shrink-0 ${checked ? 'bg-accent' : 'bg-border-default'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

export function SettingsSelect({ value, options, onChange, label }: { value: string; options: { value: string; label: string }[]; onChange: (v: string) => void; label?: string }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className="bg-surface-bg border border-border-default rounded-lg px-3 py-1.5 text-xs text-text-primary outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 cursor-pointer min-w-[120px]"
    >
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

export function SettingsInput({ value, onChange, type = 'text', placeholder, label, className = '' }: {
  value: string; onChange: (v: string) => void; type?: string; placeholder?: string; label?: string; className?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={label}
      className={`bg-surface-bg border border-border-default rounded-lg px-3 py-1.5 text-xs text-text-primary outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 placeholder:text-text-muted ${className}`}
    />
  );
}

export function SettingsTextarea({ value, onChange, placeholder, label, rows = 3 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; label?: string; rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={label}
      rows={rows}
      className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs text-text-primary outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 placeholder:text-text-muted resize-none"
    />
  );
}

export function SettingsSlider({ value, onChange, min = 0, max = 100, label }: {
  value: number; onChange: (v: number) => void; min?: number; max?: number; label?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="w-24 h-1 bg-border-default rounded-full appearance-none cursor-pointer accent-accent
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
          [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-sm"
      />
      <span className="text-xs font-medium text-text-primary w-8 text-right">{value}</span>
    </div>
  );
}

const toastColors: Record<string, string> = {
  success: 'bg-success text-white',
  error: 'bg-error text-white',
  info: 'bg-accent text-white',
};

export function Toast({ message, type = 'success', onClose }: { message: string; type?: string; onClose: () => void }) {
  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl shadow-modal text-xs font-semibold animate-fadeIn ${toastColors[type] || toastColors.info}`}>
      <span>{message}</span>
      <button onClick={onClose} className="opacity-70 hover:opacity-100">&times;</button>
    </div>
  );
}

'use client';

import React from 'react';
import { Check, Monitor, Sun, Moon } from 'lucide-react';
import { useSettingsStore } from '@/lib/settingsStore';
import { SettingsSection, SettingsCard, SettingsRow, SettingsToggle, SettingsSelect } from './SettingsField';

const accentSwatches = ['#0F766E', '#2563EB', '#7C3AED', '#DC2626', '#D97706', '#059669', '#DB2777', '#1D4ED8'];

const fontSizeOptions = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

const densityOptions = [
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'compact', label: 'Compact' },
  { value: 'cozy', label: 'Cozy' },
];

const borderRadiusOptions = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

const themeCards = [
  { value: 'light' as const, label: 'Light', icon: Sun },
  { value: 'dark' as const, label: 'Dark', icon: Moon },
  { value: 'system' as const, label: 'System', icon: Monitor },
];

export default function AppearanceSection() {
  const { appearance, updateAppearance } = useSettingsStore();

  return (
    <SettingsSection title="Appearance" desc="Customize how LeadSphere looks and feels">
      <SettingsCard>
        <div className="pb-3 border-b border-border-default/50">
          <span className="text-xs font-medium text-text-primary">Theme</span>
          <p className="text-[10px] text-text-muted mt-0.5 mb-3">Choose your preferred theme</p>
          <div className="flex gap-3">
            {themeCards.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => updateAppearance({ theme: value })}
                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  appearance.theme === value
                    ? 'border-accent bg-accent/5'
                    : 'border-border-default hover:border-accent/50'
                }`}
              >
                <Icon className={`w-6 h-6 ${appearance.theme === value ? 'text-accent' : 'text-text-muted'}`} />
                <span className={`text-xs font-medium ${appearance.theme === value ? 'text-accent' : 'text-text-primary'}`}>
                  {label}
                </span>
                {appearance.theme === value && <Check className="w-3.5 h-3.5 text-accent" />}
              </button>
            ))}
          </div>
        </div>

        <div className="py-3 border-b border-border-default/50">
          <span className="text-xs font-medium text-text-primary">Accent Color</span>
          <p className="text-[10px] text-text-muted mt-0.5 mb-3">Choose your accent color</p>
          <div className="flex gap-2.5">
            {accentSwatches.map((color) => (
              <button
                key={color}
                onClick={() => updateAppearance({ accentColor: color })}
                className={`w-7 h-7 rounded-full transition-all cursor-pointer flex items-center justify-center ${
                  appearance.accentColor === color ? 'ring-2 ring-offset-2 ring-offset-surface-card ring-accent scale-110' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Accent color ${color}`}
              >
                {appearance.accentColor === color && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
            ))}
          </div>
        </div>

        <SettingsRow label="Font Size">
          <SettingsSelect value={appearance.fontSize} options={fontSizeOptions} onChange={(v) => updateAppearance({ fontSize: v as 'small' | 'medium' | 'large' })} label="Font Size" />
        </SettingsRow>

        <SettingsRow label="Compact Mode" desc="Reduce spacing for a denser UI">
          <SettingsToggle checked={appearance.compactMode} onChange={(v) => updateAppearance({ compactMode: v })} />
        </SettingsRow>

        <SettingsRow label="Density">
          <SettingsSelect value={appearance.density} options={densityOptions} onChange={(v) => updateAppearance({ density: v as 'comfortable' | 'compact' | 'cozy' })} label="Density" />
        </SettingsRow>

        <SettingsRow label="Animations" desc="Enable UI transition animations">
          <SettingsToggle checked={appearance.animations} onChange={(v) => updateAppearance({ animations: v })} />
        </SettingsRow>

        <SettingsRow label="Border Radius">
          <SettingsSelect value={appearance.borderRadius} options={borderRadiusOptions} onChange={(v) => updateAppearance({ borderRadius: v as 'small' | 'medium' | 'large' })} label="Border Radius" />
        </SettingsRow>
      </SettingsCard>
    </SettingsSection>
  );
}

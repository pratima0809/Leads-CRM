'use client';

import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { useSettingsStore } from '@/lib/settingsStore';
import { SettingsSection, SettingsCard, SettingsRow, SettingsInput } from './SettingsField';

export default function BrandingSection() {
  const { branding, updateBranding } = useSettingsStore();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState(branding.logo);
  const [faviconPreview, setFaviconPreview] = useState(branding.favicon);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
      updateBranding({ logo: url });
    }
  };

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFaviconPreview(url);
      updateBranding({ favicon: url });
    }
  };

  return (
    <SettingsSection title="Branding" desc="Customize your brand identity across the platform">
      <SettingsCard>
        <div className="flex items-center justify-between py-3 border-b border-border-default/50">
          <div className="flex-1 min-w-0 pr-4">
            <span className="text-xs font-medium text-text-primary">Logo</span>
            <p className="text-[10px] text-text-muted mt-0.5">PNG, JPG or SVG. Recommended 256x256.</p>
          </div>
          <div className="flex items-center gap-3">
            {logoPreview && (
              <div className="w-10 h-10 rounded-lg bg-surface-bg border border-border-default overflow-hidden flex items-center justify-center">
                <img src={logoPreview} alt="Logo" className="max-w-full max-h-full object-contain" />
              </div>
            )}
            <button
              onClick={() => logoInputRef.current?.click()}
              className="flex items-center gap-1.5 bg-surface-bg border border-border-default rounded-lg px-3 py-1.5 text-xs text-text-primary hover:border-accent transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload
            </button>
            <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
          </div>
        </div>

        <SettingsRow label="Primary Color">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={branding.primaryColor}
              onChange={(e) => updateBranding({ primaryColor: e.target.value })}
              className="w-8 h-8 rounded-lg border border-border-default cursor-pointer bg-transparent p-0.5"
            />
            <span className="text-[10px] text-text-muted font-mono">{branding.primaryColor}</span>
          </div>
        </SettingsRow>

        <SettingsRow label="Company Tagline">
          <SettingsInput
            value={branding.companyTagline}
            onChange={(v) => updateBranding({ companyTagline: v })}
            placeholder="Enter company tagline"
            className="w-64"
          />
        </SettingsRow>

        <div className="flex items-center justify-between py-3">
          <div className="flex-1 min-w-0 pr-4">
            <span className="text-xs font-medium text-text-primary">Favicon</span>
            <p className="text-[10px] text-text-muted mt-0.5">PNG or ICO. 32x32 recommended.</p>
          </div>
          <div className="flex items-center gap-3">
            {faviconPreview && (
              <div className="w-8 h-8 rounded border border-border-default overflow-hidden flex items-center justify-center bg-surface-bg">
                <img src={faviconPreview} alt="Favicon" className="max-w-full max-h-full object-contain" />
              </div>
            )}
            <button
              onClick={() => faviconInputRef.current?.click()}
              className="flex items-center gap-1.5 bg-surface-bg border border-border-default rounded-lg px-3 py-1.5 text-xs text-text-primary hover:border-accent transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload
            </button>
            <input ref={faviconInputRef} type="file" accept="image/*" onChange={handleFaviconChange} className="hidden" />
          </div>
        </div>
      </SettingsCard>
    </SettingsSection>
  );
}

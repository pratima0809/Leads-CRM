'use client';

import React, { useRef, useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import { useSettingsStore } from '@/lib/settingsStore';
import { SettingsSection, SettingsCard, SettingsRow, SettingsInput, SettingsSelect } from './SettingsField';

const timezones = [
  { value: 'Asia/Kolkata', label: 'IST (UTC+5:30)' },
  { value: 'Asia/Dubai', label: 'GST (UTC+4:00)' },
  { value: 'America/New_York', label: 'EST (UTC-5:00)' },
  { value: 'America/Chicago', label: 'CST (UTC-6:00)' },
  { value: 'America/Denver', label: 'MST (UTC-7:00)' },
  { value: 'America/Los_Angeles', label: 'PST (UTC-8:00)' },
  { value: 'Europe/London', label: 'GMT (UTC+0:00)' },
  { value: 'Europe/Paris', label: 'CET (UTC+1:00)' },
  { value: 'Asia/Tokyo', label: 'JST (UTC+9:00)' },
  { value: 'Asia/Singapore', label: 'SGT (UTC+8:00)' },
  { value: 'Australia/Sydney', label: 'AEST (UTC+10:00)' },
  { value: 'Pacific/Auckland', label: 'NZST (UTC+12:00)' },
];

const languages = [
  { value: 'English', label: 'English' },
  { value: 'Hindi', label: 'हिन्दी' },
  { value: 'Spanish', label: 'Español' },
  { value: 'French', label: 'Français' },
  { value: 'German', label: 'Deutsch' },
  { value: 'Portuguese', label: 'Português' },
  { value: 'Arabic', label: 'العربية' },
  { value: 'Japanese', label: '日本語' },
  { value: 'Chinese', label: '中文' },
];

export default function ProfileSection() {
  const { profile, updateProfile } = useSettingsStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState(profile.avatar);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
      updateProfile({ avatar: url });
    }
  };

  return (
    <SettingsSection title="Profile" desc="Manage your personal information and preferences">
      <SettingsCard>
        <div className="flex items-center gap-5 pb-3 border-b border-border-default/50">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-surface-bg border border-border-default overflow-hidden flex items-center justify-center">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-6 h-6 text-text-muted" />
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 bg-accent text-white rounded-full p-1.5 shadow-sm hover:opacity-90 transition-opacity"
              aria-label="Upload avatar"
            >
              <Upload className="w-3 h-3" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">Profile Picture</p>
            <p className="text-[10px] text-text-muted mt-0.5">JPG, PNG or GIF. 1MB max.</p>
          </div>
        </div>

        <SettingsRow label="Full Name">
          <SettingsInput value={profile.fullName} onChange={(v) => updateProfile({ fullName: v })} label="Full Name" />
        </SettingsRow>

        <SettingsRow label="Email Address">
          <SettingsInput value={profile.email} onChange={(v) => updateProfile({ email: v })} type="email" label="Email" />
        </SettingsRow>

        <SettingsRow label="Phone Number">
          <SettingsInput value={profile.phone} onChange={(v) => updateProfile({ phone: v })} type="tel" label="Phone" />
        </SettingsRow>

        <SettingsRow label="Job Title">
          <SettingsInput value={profile.jobTitle} onChange={(v) => updateProfile({ jobTitle: v })} label="Job Title" />
        </SettingsRow>

        <SettingsRow label="Company">
          <SettingsInput value={profile.company} onChange={(v) => updateProfile({ company: v })} label="Company" />
        </SettingsRow>

        <SettingsRow label="Timezone">
          <SettingsSelect value={profile.timezone} options={timezones} onChange={(v) => updateProfile({ timezone: v })} label="Timezone" />
        </SettingsRow>

        <SettingsRow label="Language">
          <SettingsSelect value={profile.language} options={languages} onChange={(v) => updateProfile({ language: v })} label="Language" />
        </SettingsRow>
      </SettingsCard>
    </SettingsSection>
  );
}

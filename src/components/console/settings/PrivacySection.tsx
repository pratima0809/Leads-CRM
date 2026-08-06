'use client';

import React from 'react';
import { useSettingsStore } from '@/lib/settingsStore';
import { SettingsSection, SettingsCard, SettingsRow, SettingsToggle, SettingsSelect } from './SettingsField';

const visibilityOptions = [
  { value: 'everyone', label: 'Everyone' },
  { value: 'contacts', label: 'Contacts Only' },
  { value: 'nobody', label: 'Nobody' },
];

const profileVisibilityOptions = [
  { value: 'public', label: 'Public' },
  { value: 'team', label: 'Team Only' },
  { value: 'private', label: 'Private' },
];

const cookieOptions = [
  { value: 'all', label: 'All Cookies' },
  { value: 'essential', label: 'Essential Only' },
  { value: 'none', label: 'No Cookies' },
];

export default function PrivacySection() {
  const { privacy, updatePrivacy } = useSettingsStore();

  return (
    <SettingsSection title="Privacy" desc="Control your privacy and data sharing preferences">
      <SettingsCard>
        <SettingsRow label="Online Status" desc="Who can see your online status">
          <SettingsSelect
            value={privacy.onlineStatus}
            options={visibilityOptions}
            onChange={(v) => updatePrivacy({ onlineStatus: v as 'everyone' | 'contacts' | 'nobody' })}
            label="Online Status"
          />
        </SettingsRow>

        <SettingsRow label="Last Seen" desc="Who can see when you were last active">
          <SettingsSelect
            value={privacy.lastSeen}
            options={visibilityOptions}
            onChange={(v) => updatePrivacy({ lastSeen: v as 'everyone' | 'contacts' | 'nobody' })}
            label="Last Seen"
          />
        </SettingsRow>

        <SettingsRow label="Profile Visibility" desc="Who can view your profile">
          <SettingsSelect
            value={privacy.profileVisibility}
            options={profileVisibilityOptions}
            onChange={(v) => updatePrivacy({ profileVisibility: v as 'public' | 'team' | 'private' })}
            label="Profile Visibility"
          />
        </SettingsRow>

        <SettingsRow label="Read Receipts" desc="Show when you have read messages">
          <SettingsToggle checked={privacy.readReceipts} onChange={(v) => updatePrivacy({ readReceipts: v })} />
        </SettingsRow>

        <SettingsRow label="Analytics Sharing" desc="Help us improve by sharing usage data">
          <SettingsToggle checked={privacy.analyticsSharing} onChange={(v) => updatePrivacy({ analyticsSharing: v })} />
        </SettingsRow>

        <SettingsRow label="Diagnostic Data" desc="Share diagnostic data for troubleshooting">
          <SettingsToggle checked={privacy.diagnosticData} onChange={(v) => updatePrivacy({ diagnosticData: v })} />
        </SettingsRow>

        <SettingsRow label="Cookie Preferences">
          <SettingsSelect
            value={privacy.cookiePreferences}
            options={cookieOptions}
            onChange={(v) => updatePrivacy({ cookiePreferences: v as 'all' | 'essential' | 'none' })}
            label="Cookie Preferences"
          />
        </SettingsRow>
      </SettingsCard>
    </SettingsSection>
  );
}

'use client';

import React from 'react';
import { useSettingsStore } from '@/lib/settingsStore';
import { SettingsSection, SettingsCard, SettingsRow, SettingsSlider } from './SettingsField';

export default function DataRetentionSection() {
  const { dataRetention, updateDataRetention } = useSettingsStore();

  return (
    <SettingsSection title="Data Retention" desc="Set retention periods for different data types">
      <SettingsCard>
        <SettingsRow label="Lead Retention (days)">
          <SettingsSlider
            value={dataRetention.leadRetention}
            onChange={(v) => updateDataRetention({ leadRetention: v })}
            min={30}
            max={730}
          />
        </SettingsRow>

        <SettingsRow label="Deal Retention (days)">
          <SettingsSlider
            value={dataRetention.dealRetention}
            onChange={(v) => updateDataRetention({ dealRetention: v })}
            min={30}
            max={730}
          />
        </SettingsRow>

        <SettingsRow label="Activity Retention (days)">
          <SettingsSlider
            value={dataRetention.activityRetention}
            onChange={(v) => updateDataRetention({ activityRetention: v })}
            min={30}
            max={730}
          />
        </SettingsRow>

        <SettingsRow label="Communication Retention (days)">
          <SettingsSlider
            value={dataRetention.communicationRetention}
            onChange={(v) => updateDataRetention({ communicationRetention: v })}
            min={30}
            max={730}
          />
        </SettingsRow>

        <SettingsRow label="Archive After (days)">
          <SettingsSlider
            value={dataRetention.archiveAfter}
            onChange={(v) => updateDataRetention({ archiveAfter: v })}
            min={30}
            max={1825}
          />
        </SettingsRow>
      </SettingsCard>
    </SettingsSection>
  );
}

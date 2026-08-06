'use client';

import React from 'react';
import { useSettingsStore } from '@/lib/settingsStore';
import { SettingsSection, SettingsCard, SettingsRow, SettingsSelect, SettingsSlider, SettingsToggle } from './SettingsField';

const retentionOptions = [
  { value: '30', label: '30 days' },
  { value: '60', label: '60 days' },
  { value: '90', label: '90 days' },
  { value: '180', label: '180 days' },
  { value: '365', label: '1 year' },
];

const logLevelOptions = [
  { value: 'debug', label: 'Debug' },
  { value: 'info', label: 'Info' },
  { value: 'warn', label: 'Warning' },
  { value: 'error', label: 'Error' },
];

export default function AuditLogSection() {
  const { auditLog, updateAuditLog } = useSettingsStore();

  return (
    <SettingsSection title="Audit Log" desc="Configure audit log retention and tracking preferences">
      <SettingsCard>
        <SettingsRow label="Retention Period">
          <SettingsSelect
            value={String(auditLog.retention)}
            options={retentionOptions}
            onChange={(v) => updateAuditLog({ retention: Number(v) })}
          />
        </SettingsRow>

        <SettingsRow label="Log Level">
          <SettingsSelect
            value={auditLog.logLevel}
            options={logLevelOptions}
            onChange={(v) => updateAuditLog({ logLevel: v })}
          />
        </SettingsRow>

        <SettingsRow label="Track API Calls">
          <SettingsToggle
            checked={auditLog.trackApiCalls}
            onChange={(v) => updateAuditLog({ trackApiCalls: v })}
          />
        </SettingsRow>
      </SettingsCard>
    </SettingsSection>
  );
}

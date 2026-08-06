'use client';

import React from 'react';
import { useSettingsStore } from '@/lib/settingsStore';
import { SettingsSection, SettingsCard, SettingsRow, SettingsInput, SettingsSelect } from './SettingsField';

const currencyOptions = [
  { value: 'INR', label: 'INR (₹)' },
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
];

const numberFormatOptions = [
  { value: '1,234.56', label: '1,234.56' },
  { value: '1 234,56', label: '1 234,56' },
  { value: '1.234,56', label: '1.234,56' },
  { value: '1234.56', label: '1234.56' },
];

const dateFormatOptions = [
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
  { value: 'DD-MM-YYYY', label: 'DD-MM-YYYY' },
];

const fiscalYearOptions = [
  { value: 'April-March', label: 'April - March' },
  { value: 'January-December', label: 'January - December' },
  { value: 'July-June', label: 'July - June' },
  { value: 'October-September', label: 'October - September' },
];

const timezoneOptions = [
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

export default function CRMSection() {
  const { crm, updateCRM } = useSettingsStore();

  return (
    <SettingsSection title="CRM Settings" desc="Configure your CRM preferences and defaults">
      <SettingsCard>
        <SettingsRow label="Default Currency">
          <SettingsSelect value={crm.defaultCurrency} options={currencyOptions} onChange={(v) => updateCRM({ defaultCurrency: v })} label="Default Currency" />
        </SettingsRow>

        <SettingsRow label="Number Format">
          <SettingsSelect value={crm.numberFormat} options={numberFormatOptions} onChange={(v) => updateCRM({ numberFormat: v })} label="Number Format" />
        </SettingsRow>

        <SettingsRow label="Date Format">
          <SettingsSelect value={crm.dateFormat} options={dateFormatOptions} onChange={(v) => updateCRM({ dateFormat: v })} label="Date Format" />
        </SettingsRow>

        <SettingsRow label="Fiscal Year">
          <SettingsSelect value={crm.fiscalYear} options={fiscalYearOptions} onChange={(v) => updateCRM({ fiscalYear: v })} label="Fiscal Year" />
        </SettingsRow>

        <SettingsRow label="Timezone">
          <SettingsSelect value={crm.timezone} options={timezoneOptions} onChange={(v) => updateCRM({ timezone: v })} label="Timezone" />
        </SettingsRow>

        <SettingsRow label="Pipeline Name">
          <SettingsInput value={crm.pipelineName} onChange={(v) => updateCRM({ pipelineName: v })} label="Pipeline Name" />
        </SettingsRow>

        <SettingsRow label="Default Owner">
          <SettingsInput value={crm.defaultOwner} onChange={(v) => updateCRM({ defaultOwner: v })} label="Default Owner" />
        </SettingsRow>
      </SettingsCard>
    </SettingsSection>
  );
}

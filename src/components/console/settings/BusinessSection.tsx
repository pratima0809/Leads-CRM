'use client';

import React from 'react';
import { useSettingsStore } from '@/lib/settingsStore';
import { SettingsSection, SettingsCard, SettingsRow, SettingsInput, SettingsTextarea } from './SettingsField';

export default function BusinessSection() {
  const { business, updateBusiness } = useSettingsStore();

  return (
    <SettingsSection title="Business" desc="Manage your business information and registration details">
      <SettingsCard>
        <SettingsRow label="Business Type">
          <SettingsInput value={business.businessType} onChange={(v) => updateBusiness({ businessType: v })} placeholder="e.g. Private Limited" className="w-64" />
        </SettingsRow>

        <SettingsRow label="Registration Number">
          <SettingsInput value={business.registrationNumber} onChange={(v) => updateBusiness({ registrationNumber: v })} placeholder="Company registration number" className="w-64" />
        </SettingsRow>

        <SettingsRow label="Tax ID">
          <SettingsInput value={business.taxId} onChange={(v) => updateBusiness({ taxId: v })} placeholder="GST / VAT / Tax ID" className="w-64" />
        </SettingsRow>

        <SettingsRow label="Address">
          <SettingsTextarea value={business.address} onChange={(v) => updateBusiness({ address: v })} placeholder="Street address" rows={2} />
        </SettingsRow>

        <SettingsRow label="City">
          <SettingsInput value={business.city} onChange={(v) => updateBusiness({ city: v })} placeholder="City" className="w-48" />
        </SettingsRow>

        <SettingsRow label="State">
          <SettingsInput value={business.state} onChange={(v) => updateBusiness({ state: v })} placeholder="State" className="w-48" />
        </SettingsRow>

        <SettingsRow label="Country">
          <SettingsInput value={business.country} onChange={(v) => updateBusiness({ country: v })} placeholder="Country" className="w-48" />
        </SettingsRow>

        <SettingsRow label="Pincode">
          <SettingsInput value={business.pincode} onChange={(v) => updateBusiness({ pincode: v })} placeholder="Pincode" className="w-36" />
        </SettingsRow>
      </SettingsCard>
    </SettingsSection>
  );
}

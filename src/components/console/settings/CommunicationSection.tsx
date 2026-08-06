'use client';

import React from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import { useSettingsStore } from '@/lib/settingsStore';
import { SettingsSection, SettingsCard, SettingsRow, SettingsInput, SettingsSelect, SettingsToggle } from './SettingsField';

const callingProviders = [
  { value: 'Twilio', label: 'Twilio' },
  { value: 'Vonage', label: 'Vonage' },
  { value: 'Plivo', label: 'Plivo' },
  { value: 'AWS Connect', label: 'AWS Connect' },
  { value: 'RingCentral', label: 'RingCentral' },
];

const meetingProviders = [
  { value: 'Google Meet', label: 'Google Meet' },
  { value: 'Zoom', label: 'Zoom' },
  { value: 'Microsoft Teams', label: 'Microsoft Teams' },
  { value: 'Slack Huddles', label: 'Slack Huddles' },
];

const emailProviders = [
  { value: 'Gmail', label: 'Gmail' },
  { value: 'Outlook', label: 'Outlook' },
  { value: 'Yahoo', label: 'Yahoo' },
  { value: 'Custom SMTP', label: 'Custom SMTP' },
];

export default function CommunicationSection() {
  const { communication, updateCommunication } = useSettingsStore();

  const addAccount = () => {
    const newAccount = { id: crypto.randomUUID?.() || Date.now().toString(), email: '', provider: 'Gmail', active: true };
    updateCommunication({ emailAccounts: [...communication.emailAccounts, newAccount] });
  };

  const updateAccount = (i: number, field: string, value: string | boolean) => {
    const updated = communication.emailAccounts.map((a, idx) => idx === i ? { ...a, [field]: value } : a);
    updateCommunication({ emailAccounts: updated });
  };

  const removeAccount = (i: number) => {
    updateCommunication({ emailAccounts: communication.emailAccounts.filter((_, idx) => idx !== i) });
  };

  return (
    <SettingsSection title="Communication" desc="Configure email, calling, and meeting integrations">
      <SettingsCard>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-text-primary">Email Accounts</span>
          <button onClick={addAccount} className="flex items-center gap-1 bg-accent text-white rounded-lg px-2.5 py-1.5 text-xs font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-3.5 h-3.5" />
            Add Account
          </button>
        </div>
        {communication.emailAccounts.length > 0 && (
          <table className="w-full text-xs">
            <thead>
              <tr className="text-text-muted border-b border-border-default/50">
                <th className="text-left font-medium py-2 pr-2">Email</th>
                <th className="text-left font-medium py-2 pr-2">Provider</th>
                <th className="text-left font-medium py-2 pr-2">Status</th>
                <th className="w-8 py-2" />
              </tr>
            </thead>
            <tbody>
              {communication.emailAccounts.map((a, i) => (
                <tr key={a.id} className="border-b border-border-default/20">
                  <td className="py-1.5 pr-2">
                    <SettingsInput value={a.email} onChange={(v) => updateAccount(i, 'email', v)} placeholder="email@example.com" className="w-44" />
                  </td>
                  <td className="py-1.5 pr-2">
                    <select value={a.provider} onChange={(e) => updateAccount(i, 'provider', e.target.value)}
                      className="bg-surface-bg border border-border-default rounded-lg px-2 py-1.5 text-[10px] text-text-primary outline-none focus:border-accent">
                      {emailProviders.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                  </td>
                  <td className="py-1.5 pr-2">
                    <div className="flex items-center gap-2">
                      <SettingsToggle checked={a.active} onChange={(v) => updateAccount(i, 'active', v)} />
                      {a.active && <Check className="w-3.5 h-3.5 text-success" />}
                    </div>
                  </td>
                  <td className="py-1.5">
                    <button onClick={() => removeAccount(i)} className="text-text-muted hover:text-error transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {communication.emailAccounts.length === 0 && <p className="text-[10px] text-text-muted py-2">No email accounts.</p>}
      </SettingsCard>

      <SettingsCard>
        <SettingsRow label="Calling Provider">
          <SettingsSelect
            value={communication.callingProvider}
            options={callingProviders}
            onChange={(v) => updateCommunication({ callingProvider: v })}
          />
        </SettingsRow>

        <SettingsRow label="Calling API Key">
          <SettingsInput
            value={communication.callingApiKey}
            onChange={(v) => updateCommunication({ callingApiKey: v })}
            type="password"
            placeholder="Enter API key"
            className="w-64"
          />
        </SettingsRow>
      </SettingsCard>

      <SettingsCard>
        <SettingsRow label="Meeting Provider">
          <SettingsSelect
            value={communication.meetingProvider}
            options={meetingProviders}
            onChange={(v) => updateCommunication({ meetingProvider: v })}
          />
        </SettingsRow>

        <SettingsRow label="Meeting Link Prefix">
          <SettingsInput
            value={communication.meetingLinkPrefix}
            onChange={(v) => updateCommunication({ meetingLinkPrefix: v })}
            placeholder="https://meet.google.com/"
            className="w-64"
          />
        </SettingsRow>
      </SettingsCard>
    </SettingsSection>
  );
}

'use client';

import React from 'react';
import { useSettingsStore } from '@/lib/settingsStore';
import { SettingsSection, SettingsCard, SettingsRow, SettingsToggle, SettingsInput, SettingsTextarea, SettingsSelect } from './SettingsField';

const templateOptions = [
  { value: 'welcome', label: 'Welcome Message' },
  { value: 'follow-up', label: 'Follow-up' },
  { value: 'meeting-confirmed', label: 'Meeting Confirmed' },
  { value: 'meeting-reminder', label: 'Meeting Reminder' },
  { value: 'deal-closed', label: 'Deal Closed' },
  { value: 'lead-qualified', label: 'Lead Qualified' },
];

export default function WhatsAppSection() {
  const { whatsapp, updateWhatsApp } = useSettingsStore();

  return (
    <SettingsSection title="WhatsApp Integration" desc="Configure your WhatsApp business settings">
      <SettingsCard>
        <SettingsRow label="Auto Replies" desc="Automatically reply to incoming messages">
          <SettingsToggle checked={whatsapp.autoReplies} onChange={(v) => updateWhatsApp({ autoReplies: v })} />
        </SettingsRow>

        <SettingsRow label="Business Hours" desc="Enable business hours scheduling">
          <SettingsToggle checked={whatsapp.businessHours} onChange={(v) => updateWhatsApp({ businessHours: v })} />
        </SettingsRow>

        {whatsapp.businessHours && (
          <>
            <SettingsRow label="Business Hours Start">
              <SettingsInput value={whatsapp.businessHoursStart} onChange={(v) => updateWhatsApp({ businessHoursStart: v })} type="time" label="Start Time" />
            </SettingsRow>
            <SettingsRow label="Business Hours End">
              <SettingsInput value={whatsapp.businessHoursEnd} onChange={(v) => updateWhatsApp({ businessHoursEnd: v })} type="time" label="End Time" />
            </SettingsRow>
          </>
        )}

        <SettingsRow label="Typing Indicator" desc="Show when you are typing">
          <SettingsToggle checked={whatsapp.typingIndicator} onChange={(v) => updateWhatsApp({ typingIndicator: v })} />
        </SettingsRow>

        <SettingsRow label="Read Receipts" desc="Show when messages are read">
          <SettingsToggle checked={whatsapp.readReceipts} onChange={(v) => updateWhatsApp({ readReceipts: v })} />
        </SettingsRow>
      </SettingsCard>

      <SettingsCard>
        <div className="pb-3 border-b border-border-default/50">
          <span className="text-xs font-medium text-text-primary">Messages & Templates</span>
        </div>

        <SettingsRow label="Greeting Message">
          <SettingsTextarea
            value={whatsapp.greetingMessage}
            onChange={(v) => updateWhatsApp({ greetingMessage: v })}
            label="Greeting Message"
            rows={3}
          />
        </SettingsRow>

        <SettingsRow label="Away Message">
          <SettingsTextarea
            value={whatsapp.awayMessage}
            onChange={(v) => updateWhatsApp({ awayMessage: v })}
            label="Away Message"
            rows={3}
          />
        </SettingsRow>

        <SettingsRow label="Signature">
          <SettingsTextarea
            value={whatsapp.signature}
            onChange={(v) => updateWhatsApp({ signature: v })}
            label="Signature"
            rows={3}
          />
        </SettingsRow>

        <SettingsRow label="Default Template">
          <SettingsSelect value={whatsapp.defaultTemplate} options={templateOptions} onChange={(v) => updateWhatsApp({ defaultTemplate: v })} label="Default Template" />
        </SettingsRow>
      </SettingsCard>
    </SettingsSection>
  );
}

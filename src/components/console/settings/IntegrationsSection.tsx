'use client';

import React from 'react';
import { Calendar, Mail, MessageSquare, Video, Hash } from 'lucide-react';
import { useSettingsStore } from '@/lib/settingsStore';
import { SettingsSection, SettingsCard } from './SettingsField';

const integrationList = [
  { key: 'googleCalendar' as const, label: 'Google Calendar', icon: Calendar },
  { key: 'outlook' as const, label: 'Outlook', icon: Calendar },
  { key: 'slack' as const, label: 'Slack', icon: Hash },
  { key: 'zoom' as const, label: 'Zoom', icon: Video },
  { key: 'gmail' as const, label: 'Gmail', icon: Mail },
  { key: 'whatsappBusiness' as const, label: 'WhatsApp Business', icon: MessageSquare },
];

export default function IntegrationsSection() {
  const { integrations, updateIntegrations } = useSettingsStore();

  return (
    <SettingsSection title="Integrations" desc="Connect your favorite tools and services">
      <SettingsCard>
        {integrationList.map(({ key, label, icon: Icon }) => {
          const connected = integrations[key];
          return (
            <div key={key} className="flex items-center justify-between py-3 border-b border-border-default/50 last:border-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-surface-bg border border-border-default flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-text-primary" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-medium text-text-primary">{label}</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-success' : 'bg-text-muted'}`} />
                    <span className={`text-[10px] ${connected ? 'text-success' : 'text-text-muted'}`}>
                      {connected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => updateIntegrations({ [key]: !connected })}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                  connected
                    ? 'border-error text-error hover:bg-error/5'
                    : 'border-accent text-accent hover:bg-accent/5'
                }`}
              >
                {connected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          );
        })}
      </SettingsCard>
    </SettingsSection>
  );
}

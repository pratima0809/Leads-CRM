'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, LogOut } from 'lucide-react';
import { useSettingsStore } from '@/lib/settingsStore';
import { SettingsSection, SettingsCard, SettingsRow, SettingsToggle, SettingsInput, SettingsSelect } from './SettingsField';

const sessionTimeoutOptions = [
  { value: '15', label: '15 minutes' },
  { value: '30', label: '30 minutes' },
  { value: '60', label: '1 hour' },
  { value: '120', label: '2 hours' },
  { value: '480', label: '8 hours' },
  { value: '1440', label: '24 hours' },
];

export default function SecuritySection() {
  const { security, updateSecurity } = useSettingsStore();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  return (
    <SettingsSection title="Security" desc="Manage your account security and active sessions">
      <SettingsCard>
        <div className="pb-3 border-b border-border-default/50">
          <span className="text-xs font-medium text-text-primary">Change Password</span>
        </div>

        <SettingsRow label="Current Password">
          <div className="relative">
            <SettingsInput
              value={security.currentPassword}
              onChange={(v) => updateSecurity({ currentPassword: v })}
              type={showCurrent ? 'text' : 'password'}
              placeholder="Enter current password"
              label="Current Password"
              className="pr-8"
            />
            <button
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              tabIndex={-1}
            >
              {showCurrent ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </SettingsRow>

        <SettingsRow label="New Password">
          <div className="relative">
            <SettingsInput
              value={security.newPassword}
              onChange={(v) => updateSecurity({ newPassword: v })}
              type={showNew ? 'text' : 'password'}
              placeholder="Enter new password"
              label="New Password"
              className="pr-8"
            />
            <button
              onClick={() => setShowNew(!showNew)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              tabIndex={-1}
            >
              {showNew ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </SettingsRow>
      </SettingsCard>

      <SettingsCard>
        <SettingsRow label="Two-Factor Authentication" desc="Add an extra layer of security">
          <SettingsToggle checked={security.twoFactorEnabled} onChange={(v) => updateSecurity({ twoFactorEnabled: v })} />
        </SettingsRow>

        <SettingsRow label="Login Alerts" desc="Get notified on new sign-ins">
          <SettingsToggle checked={security.loginAlerts} onChange={(v) => updateSecurity({ loginAlerts: v })} />
        </SettingsRow>

        <SettingsRow label="Session Timeout" desc="Auto-logout after inactivity">
          <SettingsSelect
            value={String(security.sessionTimeout)}
            options={sessionTimeoutOptions}
            onChange={(v) => updateSecurity({ sessionTimeout: Number(v) })}
            label="Session Timeout"
          />
        </SettingsRow>
      </SettingsCard>

      <SettingsCard>
        <div className="pb-3 border-b border-border-default/50">
          <span className="text-xs font-medium text-text-primary">Active Sessions</span>
          <p className="text-[10px] text-text-muted mt-0.5">Manage your active login sessions</p>
        </div>

        {security.sessions.map((session) => (
          <div key={session.id} className="flex items-center justify-between py-3 border-b border-border-default/50 last:border-0">
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-text-primary">{session.device}</span>
                {session.current && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/10 text-accent font-medium">Current</span>
                )}
              </div>
              <p className="text-[10px] text-text-muted mt-0.5">{session.location} &middot; {session.lastActive}</p>
            </div>
            {!session.current && (
              <button className="flex items-center gap-1 text-xs text-error hover:text-error/80 font-medium transition-colors cursor-pointer">
                <LogOut className="w-3 h-3" />
                Logout
              </button>
            )}
          </div>
        ))}
      </SettingsCard>
    </SettingsSection>
  );
}

'use client';

import React from 'react';
import { useSettingsStore } from '@/lib/settingsStore';
import { SettingsSection, SettingsCard, SettingsRow, SettingsToggle, SettingsSelect } from './SettingsField';

const reminderTimeOptions = [
  { value: '5', label: '5 minutes before' },
  { value: '10', label: '10 minutes before' },
  { value: '15', label: '15 minutes before' },
  { value: '30', label: '30 minutes before' },
  { value: '60', label: '1 hour before' },
];

type NotificationToggle = {
  key: keyof Omit<import('@/lib/settingsStore').NotificationSettings, 'reminderTime'>;
  label: string;
  desc?: string;
};

const toggles: NotificationToggle[] = [
  { key: 'desktop', label: 'Desktop Notifications', desc: 'Show notifications on desktop' },
  { key: 'email', label: 'Email Notifications', desc: 'Receive email updates' },
  { key: 'whatsapp', label: 'WhatsApp Notifications', desc: 'Get notifications on WhatsApp' },
  { key: 'taskReminders', label: 'Task Reminders', desc: 'Reminders for upcoming tasks' },
  { key: 'meetingReminders', label: 'Meeting Reminders', desc: 'Reminders for scheduled meetings' },
  { key: 'dealUpdates', label: 'Deal Updates', desc: 'Notifications about deal changes' },
  { key: 'leadAssignments', label: 'Lead Assignments', desc: 'When leads are assigned to you' },
  { key: 'aiAlerts', label: 'AI Alerts', desc: 'AI-powered insights and alerts' },
];

export default function NotificationsSection() {
  const { notifications, updateNotifications } = useSettingsStore();

  return (
    <SettingsSection title="Notifications" desc="Control how and when you receive notifications">
      <SettingsCard>
        {toggles.map(({ key, label, desc }) => (
          <SettingsRow key={key} label={label} desc={desc}>
            <SettingsToggle
              checked={notifications[key] as boolean}
              onChange={(v) => updateNotifications({ [key]: v })}
            />
          </SettingsRow>
        ))}

        <SettingsRow label="Reminder Time" desc="How early to notify you before events">
          <SettingsSelect
            value={String(notifications.reminderTime)}
            options={reminderTimeOptions}
            onChange={(v) => updateNotifications({ reminderTime: Number(v) })}
            label="Reminder Time"
          />
        </SettingsRow>
      </SettingsCard>
    </SettingsSection>
  );
}

'use client';

import React from 'react';
import { useSettingsStore } from '@/lib/settingsStore';
import { SettingsSection, SettingsCard, SettingsRow, SettingsToggle, SettingsSlider } from './SettingsField';

export default function AccessibilitySection() {
  const { accessibility, updateAccessibility } = useSettingsStore();

  return (
    <SettingsSection title="Accessibility" desc="Make LeadSphere work better for you">
      <SettingsCard>
        <SettingsRow label="High Contrast" desc="Increase color contrast for better visibility">
          <SettingsToggle checked={accessibility.highContrast} onChange={(v) => updateAccessibility({ highContrast: v })} />
        </SettingsRow>

        <SettingsRow label="Reduce Motion" desc="Minimize animations and transitions">
          <SettingsToggle checked={accessibility.reduceMotion} onChange={(v) => updateAccessibility({ reduceMotion: v })} />
        </SettingsRow>

        <SettingsRow label="Font Scaling" desc="Adjust the scaling of all text">
          <SettingsSlider
            value={accessibility.fontScaling}
            onChange={(v) => updateAccessibility({ fontScaling: v })}
            min={80}
            max={150}
            label="Font Scaling"
          />
        </SettingsRow>

        <SettingsRow label="Keyboard Shortcuts" desc="Enable keyboard navigation shortcuts">
          <SettingsToggle checked={accessibility.keyboardShortcuts} onChange={(v) => updateAccessibility({ keyboardShortcuts: v })} />
        </SettingsRow>

        <SettingsRow label="Screen Reader Support" desc="Optimize for screen reader compatibility">
          <SettingsToggle checked={accessibility.screenReader} onChange={(v) => updateAccessibility({ screenReader: v })} />
        </SettingsRow>
      </SettingsCard>
    </SettingsSection>
  );
}

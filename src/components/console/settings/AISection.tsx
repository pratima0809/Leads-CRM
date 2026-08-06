'use client';

import React from 'react';
import { useSettingsStore } from '@/lib/settingsStore';
import { SettingsSection, SettingsCard, SettingsRow, SettingsToggle, SettingsSelect, SettingsSlider } from './SettingsField';

const toneOptions = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'formal', label: 'Formal' },
];

const responseLengthOptions = [
  { value: 'short', label: 'Short' },
  { value: 'medium', label: 'Medium' },
  { value: 'long', label: 'Long' },
];

type AIToggle = {
  key: 'enableCopilot' | 'autoSuggestions' | 'autoSummarizeChats' | 'smartFollowUp' | 'leadScoringAI';
  label: string;
  desc?: string;
};

const toggles: AIToggle[] = [
  { key: 'enableCopilot', label: 'AI Copilot', desc: 'Enable AI-powered assistance' },
  { key: 'autoSuggestions', label: 'Auto Suggestions', desc: 'Get AI-generated suggestions' },
  { key: 'autoSummarizeChats', label: 'Auto Summarize Chats', desc: 'Automatically summarize conversations' },
  { key: 'smartFollowUp', label: 'Smart Follow-up', desc: 'AI-powered follow-up reminders' },
  { key: 'leadScoringAI', label: 'Lead Scoring AI', desc: 'AI-driven lead scoring' },
];

export default function AISection() {
  const { ai, updateAI } = useSettingsStore();

  return (
    <SettingsSection title="AI & Automation" desc="Configure AI-powered features">
      <SettingsCard>
        {toggles.map(({ key, label, desc }) => (
          <SettingsRow key={key} label={label} desc={desc}>
            <SettingsToggle checked={ai[key]} onChange={(v) => updateAI({ [key]: v })} />
          </SettingsRow>
        ))}
      </SettingsCard>

      <SettingsCard>
        <SettingsRow label="Reply Tone" desc="Default tone for AI-generated replies">
          <SettingsSelect
            value={ai.replyTone}
            options={toneOptions}
            onChange={(v) => updateAI({ replyTone: v as 'professional' | 'casual' | 'friendly' | 'formal' })}
            label="Reply Tone"
          />
        </SettingsRow>

        <SettingsRow label="Creativity Level" desc="Controls how creative AI responses are">
          <SettingsSlider
            value={ai.creativityLevel}
            onChange={(v) => updateAI({ creativityLevel: v })}
            min={0}
            max={100}
            label="Creativity"
          />
        </SettingsRow>

        <SettingsRow label="Response Length">
          <SettingsSelect
            value={ai.responseLength}
            options={responseLengthOptions}
            onChange={(v) => updateAI({ responseLength: v as 'short' | 'medium' | 'long' })}
            label="Response Length"
          />
        </SettingsRow>
      </SettingsCard>
    </SettingsSection>
  );
}

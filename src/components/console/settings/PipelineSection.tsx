'use client';

import React from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { useSettingsStore } from '@/lib/settingsStore';
import { SettingsSection, SettingsCard, SettingsRow, SettingsInput, SettingsToggle } from './SettingsField';

function TagList({ items, onChange, placeholder }: { items: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [input, setInput] = React.useState('');

  const add = () => {
    if (input.trim() && !items.includes(input.trim())) {
      onChange([...items, input.trim()]);
      setInput('');
    }
  };

  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder={placeholder}
          className="flex-1 bg-surface-bg border border-border-default rounded-lg px-3 py-1.5 text-xs text-text-primary outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 placeholder:text-text-muted"
        />
        <button onClick={add} className="flex items-center gap-1 bg-accent text-white rounded-lg px-2.5 py-1.5 text-xs font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-3.5 h-3.5" />
          Add
        </button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-1 bg-surface-bg border border-border-default rounded-md px-2 py-1 text-[10px] text-text-primary">
              {item}
              <button onClick={() => remove(i)} className="text-text-muted hover:text-error transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PipelineSection() {
  const { pipeline, updatePipeline } = useSettingsStore();

  const addPipeline = () => {
    const newPipeline = { id: crypto.randomUUID?.() || Date.now().toString(), name: '', stages: [], active: true };
    updatePipeline({ pipelines: [...pipeline.pipelines, newPipeline] });
  };

  const updatePipelineItem = (i: number, field: string, value: unknown) => {
    const updated = pipeline.pipelines.map((p, idx) => idx === i ? { ...p, [field]: value } : p);
    updatePipeline({ pipelines: updated });
  };

  const removePipeline = (i: number) => {
    updatePipeline({ pipelines: pipeline.pipelines.filter((_, idx) => idx !== i) });
  };

  const addCustomField = () => {
    const newField = { id: crypto.randomUUID?.() || Date.now().toString(), label: '', type: 'text', required: false };
    updatePipeline({ customFields: [...pipeline.customFields, newField] });
  };

  const updateCustomField = (i: number, field: string, value: unknown) => {
    const updated = pipeline.customFields.map((f, idx) => idx === i ? { ...f, [field]: value } : f);
    updatePipeline({ customFields: updated });
  };

  const removeCustomField = (i: number) => {
    updatePipeline({ customFields: pipeline.customFields.filter((_, idx) => idx !== i) });
  };

  return (
    <SettingsSection title="Pipeline" desc="Configure your sales pipelines, stages, and fields">
      <SettingsCard>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-text-primary">Pipelines</span>
          <button onClick={addPipeline} className="flex items-center gap-1 bg-accent text-white rounded-lg px-2.5 py-1.5 text-xs font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-3.5 h-3.5" />
            Add Pipeline
          </button>
        </div>
        {pipeline.pipelines.map((p, i) => (
          <div key={p.id} className="py-2 border-b border-border-default/20 last:border-0">
            <div className="flex items-center justify-between mb-1.5">
              <SettingsInput value={p.name} onChange={(v) => updatePipelineItem(i, 'name', v)} placeholder="Pipeline name" className="w-48" />
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-text-muted">Active</span>
                  <SettingsToggle checked={p.active} onChange={(v) => updatePipelineItem(i, 'active', v)} />
                </div>
                <button onClick={() => removePipeline(i)} className="text-text-muted hover:text-error transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {p.stages.map((s, si) => (
                <span key={si} className="inline-flex items-center gap-1 bg-surface-bg border border-border-default rounded-md px-2 py-1 text-[10px] text-text-primary">
                  {s}
                </span>
              ))}
              <input
                value=''
                onChange={(e) => {
                  if (e.target.value.endsWith(',')) {
                    const val = e.target.value.slice(0, -1).trim();
                    if (val) updatePipelineItem(i, 'stages', [...p.stages, val]);
                    e.target.value = '';
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value.trim()) {
                    updatePipelineItem(i, 'stages', [...p.stages, e.target.value.trim()]);
                    e.target.value = '';
                  }
                }}
                placeholder="Add stage, press Enter"
                className="bg-surface-bg border border-border-default rounded-md px-2 py-1 text-[10px] text-text-primary outline-none focus:border-accent placeholder:text-text-muted w-32"
              />
            </div>
          </div>
        ))}
      </SettingsCard>

      <SettingsCard>
        <SettingsRow label="Lead Stages">
          <TagList items={pipeline.leadStages} onChange={(v) => updatePipeline({ leadStages: v })} placeholder="Add lead stage" />
        </SettingsRow>
      </SettingsCard>

      <SettingsCard>
        <SettingsRow label="Lead Sources">
          <TagList items={pipeline.leadSources} onChange={(v) => updatePipeline({ leadSources: v })} placeholder="Add lead source" />
        </SettingsRow>
      </SettingsCard>

      <SettingsCard>
        <SettingsRow label="Win/Loss Reasons">
          <TagList items={pipeline.winLossReasons} onChange={(v) => updatePipeline({ winLossReasons: v })} placeholder="Add reason" />
        </SettingsRow>
      </SettingsCard>

      <SettingsCard>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-text-primary">Custom Fields</span>
          <button onClick={addCustomField} className="flex items-center gap-1 bg-accent text-white rounded-lg px-2.5 py-1.5 text-xs font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-3.5 h-3.5" />
            Add Field
          </button>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="text-text-muted border-b border-border-default/50">
              <th className="text-left font-medium py-2 pr-2">Label</th>
              <th className="text-left font-medium py-2 pr-2">Type</th>
              <th className="text-left font-medium py-2 pr-2">Required</th>
              <th className="w-8 py-2" />
            </tr>
          </thead>
          <tbody>
            {pipeline.customFields.map((f, i) => (
              <tr key={f.id} className="border-b border-border-default/20">
                <td className="py-1.5 pr-2">
                  <SettingsInput value={f.label} onChange={(v) => updateCustomField(i, 'label', v)} className="w-32" />
                </td>
                <td className="py-1.5 pr-2">
                  <select
                    value={f.type}
                    onChange={(e) => updateCustomField(i, 'type', e.target.value)}
                    className="bg-surface-bg border border-border-default rounded-lg px-2 py-1.5 text-[10px] text-text-primary outline-none focus:border-accent"
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                    <option value="select">Select</option>
                    <option value="boolean">Boolean</option>
                  </select>
                </td>
                <td className="py-1.5 pr-2">
                  <SettingsToggle checked={f.required} onChange={(v) => updateCustomField(i, 'required', v)} />
                </td>
                <td className="py-1.5">
                  <button onClick={() => removeCustomField(i)} className="text-text-muted hover:text-error transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SettingsCard>

      <SettingsCard>
        <SettingsRow label="Tags">
          <TagList items={pipeline.tags} onChange={(v) => updatePipeline({ tags: v })} placeholder="Add tag" />
        </SettingsRow>
      </SettingsCard>

      <SettingsCard>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-text-primary">Record Layouts</span>
          <button
            onClick={() => {
              const newLayout = { id: crypto.randomUUID?.() || Date.now().toString(), name: '', sections: [] };
              updatePipeline({ recordLayouts: [...pipeline.recordLayouts, newLayout] });
            }}
            className="flex items-center gap-1 bg-accent text-white rounded-lg px-2.5 py-1.5 text-xs font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Layout
          </button>
        </div>
        {pipeline.recordLayouts.map((l, i) => (
          <div key={l.id} className="py-2 border-b border-border-default/20 last:border-0">
            <div className="flex items-center justify-between mb-1.5">
              <SettingsInput value={l.name} onChange={(v) => {
                const updated = pipeline.recordLayouts.map((rl, idx) => idx === i ? { ...rl, name: v } : rl);
                updatePipeline({ recordLayouts: updated });
              }} placeholder="Layout name" className="w-48" />
              <button onClick={() => {
                updatePipeline({ recordLayouts: pipeline.recordLayouts.filter((_, idx) => idx !== i) });
              }} className="text-text-muted hover:text-error transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {l.sections.map((s, si) => (
                <span key={si} className="inline-flex items-center gap-1 bg-surface-bg border border-border-default rounded-md px-2 py-1 text-[10px] text-text-primary">
                  {s}
                  <button onClick={() => {
                    const updated = pipeline.recordLayouts.map((rl, idx) => idx === i ? { ...rl, sections: rl.sections.filter((_, sIdx) => sIdx !== si) } : rl);
                    updatePipeline({ recordLayouts: updated });
                  }} className="text-text-muted hover:text-error">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                value=''
                onChange={(e) => {
                  if (e.target.value.endsWith(',')) {
                    const val = e.target.value.slice(0, -1).trim();
                    if (val) {
                      const updated = pipeline.recordLayouts.map((rl, idx) => idx === i ? { ...rl, sections: [...rl.sections, val] } : rl);
                      updatePipeline({ recordLayouts: updated });
                    }
                    e.target.value = '';
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value.trim()) {
                    const updated = pipeline.recordLayouts.map((rl, idx) => idx === i ? { ...rl, sections: [...rl.sections, e.target.value.trim()] } : rl);
                    updatePipeline({ recordLayouts: updated });
                    e.target.value = '';
                  }
                }}
                placeholder="Add section"
                className="bg-surface-bg border border-border-default rounded-md px-2 py-1 text-[10px] text-text-primary outline-none focus:border-accent placeholder:text-text-muted w-28"
              />
            </div>
          </div>
        ))}
      </SettingsCard>
    </SettingsSection>
  );
}

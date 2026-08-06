'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useSettingsStore } from '@/lib/settingsStore';
import { SettingsSection, SettingsCard, SettingsRow, SettingsInput, SettingsToggle } from './SettingsField';

export default function AutomationSection() {
  const { automation, updateAutomation } = useSettingsStore();

  const addWorkflow = () => {
    const newItem = { id: crypto.randomUUID?.() || Date.now().toString(), name: '', trigger: '', actions: [], active: true };
    updateAutomation({ workflows: [...automation.workflows, newItem] });
  };

  const updateWorkflow = (i: number, field: string, value: unknown) => {
    const updated = automation.workflows.map((w, idx) => idx === i ? { ...w, [field]: value } : w);
    updateAutomation({ workflows: updated });
  };

  const removeWorkflow = (i: number) => {
    updateAutomation({ workflows: automation.workflows.filter((_, idx) => idx !== i) });
  };

  const addAssignmentRule = () => {
    const newItem = { id: crypto.randomUUID?.() || Date.now().toString(), name: '', criteria: '', assignee: '' };
    updateAutomation({ assignmentRules: [...automation.assignmentRules, newItem] });
  };

  const updateAssignmentRule = (i: number, field: string, value: string) => {
    const updated = automation.assignmentRules.map((r, idx) => idx === i ? { ...r, [field]: value } : r);
    updateAutomation({ assignmentRules: updated });
  };

  const removeAssignmentRule = (i: number) => {
    updateAutomation({ assignmentRules: automation.assignmentRules.filter((_, idx) => idx !== i) });
  };

  const addSLAPolicy = () => {
    const newItem = { id: crypto.randomUUID?.() || Date.now().toString(), name: '', responseTime: 4, resolutionTime: 24 };
    updateAutomation({ slaPolicies: [...automation.slaPolicies, newItem] });
  };

  const updateSLAPolicy = (i: number, field: string, value: string | number) => {
    const updated = automation.slaPolicies.map((s, idx) => idx === i ? { ...s, [field]: value } : s);
    updateAutomation({ slaPolicies: updated });
  };

  const removeSLAPolicy = (i: number) => {
    updateAutomation({ slaPolicies: automation.slaPolicies.filter((_, idx) => idx !== i) });
  };

  const addEscalationRule = () => {
    const newItem = { id: crypto.randomUUID?.() || Date.now().toString(), name: '', condition: '', target: '' };
    updateAutomation({ escalationRules: [...automation.escalationRules, newItem] });
  };

  const updateEscalationRule = (i: number, field: string, value: string) => {
    const updated = automation.escalationRules.map((e, idx) => idx === i ? { ...e, [field]: value } : e);
    updateAutomation({ escalationRules: updated });
  };

  const removeEscalationRule = (i: number) => {
    updateAutomation({ escalationRules: automation.escalationRules.filter((_, idx) => idx !== i) });
  };

  return (
    <SettingsSection title="Automation" desc="Configure workflows, assignments, SLAs, and escalations">
      <SettingsCard>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-text-primary">Workflows</span>
          <button onClick={addWorkflow} className="flex items-center gap-1 bg-accent text-white rounded-lg px-2.5 py-1.5 text-xs font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-3.5 h-3.5" />
            Add Workflow
          </button>
        </div>
        {automation.workflows.map((w, i) => (
          <div key={w.id} className="py-2 border-b border-border-default/20 last:border-0">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 flex-1 min-w-0 pr-2">
                <SettingsInput value={w.name} onChange={(v) => updateWorkflow(i, 'name', v)} placeholder="Workflow name" className="w-40" />
                <span className="text-[10px] text-text-muted">Trigger:</span>
                <SettingsInput value={w.trigger} onChange={(v) => updateWorkflow(i, 'trigger', v)} placeholder="event.name" className="w-36" />
              </div>
              <div className="flex items-center gap-3">
                <SettingsToggle checked={w.active} onChange={(v) => updateWorkflow(i, 'active', v)} />
                <button onClick={() => removeWorkflow(i)} className="text-text-muted hover:text-error transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-text-muted shrink-0">Actions:</span>
              <div className="flex flex-wrap gap-1">
                {w.actions.map((a, ai) => (
                  <span key={ai} className="inline-flex items-center gap-1 bg-surface-bg border border-border-default rounded-md px-2 py-1 text-[10px] text-text-primary">
                    {a}
                    <button onClick={() => updateWorkflow(i, 'actions', w.actions.filter((_, idx) => idx !== ai))} className="text-text-muted hover:text-error">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                value=''
                onChange={(e) => {
                  if (e.target.value.endsWith(',')) {
                    const val = e.target.value.slice(0, -1).trim();
                    if (val) updateWorkflow(i, 'actions', [...w.actions, val]);
                    e.target.value = '';
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value.trim()) {
                    updateWorkflow(i, 'actions', [...w.actions, e.target.value.trim()]);
                    e.target.value = '';
                  }
                }}
                placeholder="Add action"
                className="bg-surface-bg border border-border-default rounded-md px-2 py-1 text-[10px] text-text-primary outline-none focus:border-accent placeholder:text-text-muted w-24"
              />
            </div>
          </div>
        ))}
        {automation.workflows.length === 0 && <p className="text-[10px] text-text-muted py-2">No workflows.</p>}
      </SettingsCard>

      <SettingsCard>
        <SettingsRow label="Auto Assignment">
          <SettingsToggle checked={automation.autoAssignment} onChange={(v) => updateAutomation({ autoAssignment: v })} />
        </SettingsRow>

        <div className="flex items-center justify-between mb-3 mt-2">
          <span className="text-xs font-semibold text-text-primary">Assignment Rules</span>
          <button onClick={addAssignmentRule} className="flex items-center gap-1 bg-accent text-white rounded-lg px-2.5 py-1.5 text-xs font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-3.5 h-3.5" />
            Add Rule
          </button>
        </div>
        {automation.assignmentRules.length > 0 && (
          <table className="w-full text-xs">
            <thead>
              <tr className="text-text-muted border-b border-border-default/50">
                <th className="text-left font-medium py-2 pr-2">Name</th>
                <th className="text-left font-medium py-2 pr-2">Criteria</th>
                <th className="text-left font-medium py-2 pr-2">Assignee</th>
                <th className="w-8 py-2" />
              </tr>
            </thead>
            <tbody>
              {automation.assignmentRules.map((r, i) => (
                <tr key={r.id} className="border-b border-border-default/20">
                  <td className="py-1.5 pr-2"><SettingsInput value={r.name} onChange={(v) => updateAssignmentRule(i, 'name', v)} className="w-28" /></td>
                  <td className="py-1.5 pr-2"><SettingsInput value={r.criteria} onChange={(v) => updateAssignmentRule(i, 'criteria', v)} className="w-28" /></td>
                  <td className="py-1.5 pr-2"><SettingsInput value={r.assignee} onChange={(v) => updateAssignmentRule(i, 'assignee', v)} className="w-28" /></td>
                  <td className="py-1.5"><button onClick={() => removeAssignmentRule(i)} className="text-text-muted hover:text-error"><Trash2 className="w-3.5 h-3.5" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {automation.assignmentRules.length === 0 && <p className="text-[10px] text-text-muted py-2">No assignment rules.</p>}
      </SettingsCard>

      <SettingsCard>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-text-primary">SLA Policies</span>
          <button onClick={addSLAPolicy} className="flex items-center gap-1 bg-accent text-white rounded-lg px-2.5 py-1.5 text-xs font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-3.5 h-3.5" />
            Add SLA
          </button>
        </div>
        {automation.slaPolicies.length > 0 && (
          <table className="w-full text-xs">
            <thead>
              <tr className="text-text-muted border-b border-border-default/50">
                <th className="text-left font-medium py-2 pr-2">Name</th>
                <th className="text-left font-medium py-2 pr-2">Response (hrs)</th>
                <th className="text-left font-medium py-2 pr-2">Resolution (hrs)</th>
                <th className="w-8 py-2" />
              </tr>
            </thead>
            <tbody>
              {automation.slaPolicies.map((s, i) => (
                <tr key={s.id} className="border-b border-border-default/20">
                  <td className="py-1.5 pr-2"><SettingsInput value={s.name} onChange={(v) => updateSLAPolicy(i, 'name', v)} className="w-28" /></td>
                  <td className="py-1.5 pr-2">
                    <input type="number" value={s.responseTime} onChange={(e) => updateSLAPolicy(i, 'responseTime', Number(e.target.value))}
                      className="bg-surface-bg border border-border-default rounded-lg px-2 py-1.5 text-[10px] text-text-primary outline-none focus:border-accent w-16" />
                  </td>
                  <td className="py-1.5 pr-2">
                    <input type="number" value={s.resolutionTime} onChange={(e) => updateSLAPolicy(i, 'resolutionTime', Number(e.target.value))}
                      className="bg-surface-bg border border-border-default rounded-lg px-2 py-1.5 text-[10px] text-text-primary outline-none focus:border-accent w-16" />
                  </td>
                  <td className="py-1.5"><button onClick={() => removeSLAPolicy(i)} className="text-text-muted hover:text-error"><Trash2 className="w-3.5 h-3.5" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {automation.slaPolicies.length === 0 && <p className="text-[10px] text-text-muted py-2">No SLA policies.</p>}
      </SettingsCard>

      <SettingsCard>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-text-primary">Escalation Rules</span>
          <button onClick={addEscalationRule} className="flex items-center gap-1 bg-accent text-white rounded-lg px-2.5 py-1.5 text-xs font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-3.5 h-3.5" />
            Add Rule
          </button>
        </div>
        {automation.escalationRules.length > 0 && (
          <table className="w-full text-xs">
            <thead>
              <tr className="text-text-muted border-b border-border-default/50">
                <th className="text-left font-medium py-2 pr-2">Name</th>
                <th className="text-left font-medium py-2 pr-2">Condition</th>
                <th className="text-left font-medium py-2 pr-2">Target</th>
                <th className="w-8 py-2" />
              </tr>
            </thead>
            <tbody>
              {automation.escalationRules.map((e, i) => (
                <tr key={e.id} className="border-b border-border-default/20">
                  <td className="py-1.5 pr-2"><SettingsInput value={e.name} onChange={(v) => updateEscalationRule(i, 'name', v)} className="w-28" /></td>
                  <td className="py-1.5 pr-2"><SettingsInput value={e.condition} onChange={(v) => updateEscalationRule(i, 'condition', v)} className="w-28" /></td>
                  <td className="py-1.5 pr-2"><SettingsInput value={e.target} onChange={(v) => updateEscalationRule(i, 'target', v)} className="w-28" /></td>
                  <td className="py-1.5"><button onClick={() => removeEscalationRule(i)} className="text-text-muted hover:text-error"><Trash2 className="w-3.5 h-3.5" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {automation.escalationRules.length === 0 && <p className="text-[10px] text-text-muted py-2">No escalation rules.</p>}
      </SettingsCard>

      <SettingsCard>
        <span className="text-xs font-semibold text-text-primary block mb-3">Reminder Defaults (hours)</span>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] text-text-muted block mb-1">Lead Follow-Up</label>
            <input type="number" value={automation.reminderDefaults.leadFollowUp}
              onChange={(e) => updateAutomation({ reminderDefaults: { ...automation.reminderDefaults, leadFollowUp: Number(e.target.value) } })}
              className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-1.5 text-xs text-text-primary outline-none focus:border-accent" />
          </div>
          <div>
            <label className="text-[10px] text-text-muted block mb-1">Deal Follow-Up</label>
            <input type="number" value={automation.reminderDefaults.dealFollowUp}
              onChange={(e) => updateAutomation({ reminderDefaults: { ...automation.reminderDefaults, dealFollowUp: Number(e.target.value) } })}
              className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-1.5 text-xs text-text-primary outline-none focus:border-accent" />
          </div>
          <div>
            <label className="text-[10px] text-text-muted block mb-1">Task Default</label>
            <input type="number" value={automation.reminderDefaults.taskDefault}
              onChange={(e) => updateAutomation({ reminderDefaults: { ...automation.reminderDefaults, taskDefault: Number(e.target.value) } })}
              className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-1.5 text-xs text-text-primary outline-none focus:border-accent" />
          </div>
        </div>
      </SettingsCard>
    </SettingsSection>
  );
}

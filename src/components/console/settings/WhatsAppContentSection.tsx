'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useSettingsStore } from '@/lib/settingsStore';
import { SettingsSection, SettingsCard, SettingsRow, SettingsInput, SettingsToggle, SettingsTextarea } from './SettingsField';

export default function WhatsAppContentSection() {
  const { whatsAppContent, updateWhatsAppContent } = useSettingsStore();

  const addTemplate = () => {
    const newItem = { id: crypto.randomUUID?.() || Date.now().toString(), name: '', body: '', category: 'Marketing' };
    updateWhatsAppContent({ templates: [...whatsAppContent.templates, newItem] });
  };

  const updateTemplate = (i: number, field: string, value: string) => {
    const updated = whatsAppContent.templates.map((t, idx) => idx === i ? { ...t, [field]: value } : t);
    updateWhatsAppContent({ templates: updated });
  };

  const removeTemplate = (i: number) => {
    updateWhatsAppContent({ templates: whatsAppContent.templates.filter((_, idx) => idx !== i) });
  };

  const addAutoReply = () => {
    const newItem = { id: crypto.randomUUID?.() || Date.now().toString(), keyword: '', response: '', active: true };
    updateWhatsAppContent({ autoReplies: [...whatsAppContent.autoReplies, newItem] });
  };

  const updateAutoReply = (i: number, field: string, value: string | boolean) => {
    const updated = whatsAppContent.autoReplies.map((a, idx) => idx === i ? { ...a, [field]: value } : a);
    updateWhatsAppContent({ autoReplies: updated });
  };

  const removeAutoReply = (i: number) => {
    updateWhatsAppContent({ autoReplies: whatsAppContent.autoReplies.filter((_, idx) => idx !== i) });
  };

  const addCampaign = () => {
    const newItem = { id: crypto.randomUUID?.() || Date.now().toString(), name: '', status: 'Draft' };
    updateWhatsAppContent({ campaigns: [...whatsAppContent.campaigns, newItem] });
  };

  const updateCampaign = (i: number, field: string, value: string) => {
    const updated = whatsAppContent.campaigns.map((c, idx) => idx === i ? { ...c, [field]: value } : c);
    updateWhatsAppContent({ campaigns: updated });
  };

  const removeCampaign = (i: number) => {
    updateWhatsAppContent({ campaigns: whatsAppContent.campaigns.filter((_, idx) => idx !== i) });
  };

  const addRoutingRule = () => {
    const newItem = { id: crypto.randomUUID?.() || Date.now().toString(), name: '', condition: '', action: '', active: true };
    updateWhatsAppContent({ routingRules: [...whatsAppContent.routingRules, newItem] });
  };

  const updateRoutingRule = (i: number, field: string, value: string | boolean) => {
    const updated = whatsAppContent.routingRules.map((r, idx) => idx === i ? { ...r, [field]: value } : r);
    updateWhatsAppContent({ routingRules: updated });
  };

  const removeRoutingRule = (i: number) => {
    updateWhatsAppContent({ routingRules: whatsAppContent.routingRules.filter((_, idx) => idx !== i) });
  };

  const statusColors: Record<string, string> = { Active: 'bg-success/10 text-success', Draft: 'bg-text-muted/10 text-text-muted', Paused: 'bg-warning/10 text-warning' };

  return (
    <SettingsSection title="WhatsApp Content" desc="Manage WhatsApp templates, auto-replies, campaigns, and routing">
      <SettingsCard>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-text-primary">Templates</span>
          <button onClick={addTemplate} className="flex items-center gap-1 bg-accent text-white rounded-lg px-2.5 py-1.5 text-xs font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-3.5 h-3.5" />
            Add Template
          </button>
        </div>
        {whatsAppContent.templates.length > 0 && (
          <table className="w-full text-xs">
            <thead>
              <tr className="text-text-muted border-b border-border-default/50">
                <th className="text-left font-medium py-2 pr-2">Name</th>
                <th className="text-left font-medium py-2 pr-2">Body</th>
                <th className="text-left font-medium py-2 pr-2">Category</th>
                <th className="w-8 py-2" />
              </tr>
            </thead>
            <tbody>
              {whatsAppContent.templates.map((t, i) => (
                <tr key={t.id} className="border-b border-border-default/20">
                  <td className="py-1.5 pr-2"><SettingsInput value={t.name} onChange={(v) => updateTemplate(i, 'name', v)} className="w-24" /></td>
                  <td className="py-1.5 pr-2"><SettingsInput value={t.body} onChange={(v) => updateTemplate(i, 'body', v)} className="w-48" /></td>
                  <td className="py-1.5 pr-2">
                    <select value={t.category} onChange={(e) => updateTemplate(i, 'category', e.target.value)}
                      className="bg-surface-bg border border-border-default rounded-lg px-2 py-1.5 text-[10px] text-text-primary outline-none focus:border-accent">
                      <option value="Marketing">Marketing</option>
                      <option value="Utility">Utility</option>
                      <option value="Authentication">Authentication</option>
                    </select>
                  </td>
                  <td className="py-1.5">
                    <button onClick={() => removeTemplate(i)} className="text-text-muted hover:text-error transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {whatsAppContent.templates.length === 0 && <p className="text-[10px] text-text-muted py-2">No templates.</p>}
      </SettingsCard>

      <SettingsCard>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-text-primary">Auto Replies</span>
          <button onClick={addAutoReply} className="flex items-center gap-1 bg-accent text-white rounded-lg px-2.5 py-1.5 text-xs font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-3.5 h-3.5" />
            Add Auto Reply
          </button>
        </div>
        {whatsAppContent.autoReplies.length > 0 && (
          <table className="w-full text-xs">
            <thead>
              <tr className="text-text-muted border-b border-border-default/50">
                <th className="text-left font-medium py-2 pr-2">Keyword</th>
                <th className="text-left font-medium py-2 pr-2">Response</th>
                <th className="text-left font-medium py-2 pr-2">Active</th>
                <th className="w-8 py-2" />
              </tr>
            </thead>
            <tbody>
              {whatsAppContent.autoReplies.map((a, i) => (
                <tr key={a.id} className="border-b border-border-default/20">
                  <td className="py-1.5 pr-2"><SettingsInput value={a.keyword} onChange={(v) => updateAutoReply(i, 'keyword', v)} className="w-24" /></td>
                  <td className="py-1.5 pr-2"><SettingsInput value={a.response} onChange={(v) => updateAutoReply(i, 'response', v)} className="w-48" /></td>
                  <td className="py-1.5 pr-2"><SettingsToggle checked={a.active} onChange={(v) => updateAutoReply(i, 'active', v)} /></td>
                  <td className="py-1.5">
                    <button onClick={() => removeAutoReply(i)} className="text-text-muted hover:text-error transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {whatsAppContent.autoReplies.length === 0 && <p className="text-[10px] text-text-muted py-2">No auto replies.</p>}
      </SettingsCard>

      <SettingsCard>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-text-primary">Campaigns</span>
          <button onClick={addCampaign} className="flex items-center gap-1 bg-accent text-white rounded-lg px-2.5 py-1.5 text-xs font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-3.5 h-3.5" />
            Add Campaign
          </button>
        </div>
        {whatsAppContent.campaigns.length > 0 && (
          <table className="w-full text-xs">
            <thead>
              <tr className="text-text-muted border-b border-border-default/50">
                <th className="text-left font-medium py-2 pr-2">Name</th>
                <th className="text-left font-medium py-2 pr-2">Status</th>
                <th className="w-8 py-2" />
              </tr>
            </thead>
            <tbody>
              {whatsAppContent.campaigns.map((c, i) => (
                <tr key={c.id} className="border-b border-border-default/20">
                  <td className="py-1.5 pr-2"><SettingsInput value={c.name} onChange={(v) => updateCampaign(i, 'name', v)} className="w-48" /></td>
                  <td className="py-1.5 pr-2">
                    <select value={c.status} onChange={(e) => updateCampaign(i, 'status', e.target.value)}
                      className="bg-surface-bg border border-border-default rounded-lg px-2 py-1.5 text-[10px] text-text-primary outline-none focus:border-accent">
                      <option value="Active">Active</option>
                      <option value="Draft">Draft</option>
                      <option value="Paused">Paused</option>
                    </select>
                    <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusColors[c.status] || 'bg-text-muted/10 text-text-muted'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-1.5">
                    <button onClick={() => removeCampaign(i)} className="text-text-muted hover:text-error transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {whatsAppContent.campaigns.length === 0 && <p className="text-[10px] text-text-muted py-2">No campaigns.</p>}
      </SettingsCard>

      <SettingsCard>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-text-primary">Routing Rules</span>
          <button onClick={addRoutingRule} className="flex items-center gap-1 bg-accent text-white rounded-lg px-2.5 py-1.5 text-xs font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-3.5 h-3.5" />
            Add Rule
          </button>
        </div>
        {whatsAppContent.routingRules.length > 0 && (
          <table className="w-full text-xs">
            <thead>
              <tr className="text-text-muted border-b border-border-default/50">
                <th className="text-left font-medium py-2 pr-2">Name</th>
                <th className="text-left font-medium py-2 pr-2">Condition</th>
                <th className="text-left font-medium py-2 pr-2">Action</th>
                <th className="text-left font-medium py-2 pr-2">Active</th>
                <th className="w-8 py-2" />
              </tr>
            </thead>
            <tbody>
              {whatsAppContent.routingRules.map((r, i) => (
                <tr key={r.id} className="border-b border-border-default/20">
                  <td className="py-1.5 pr-2"><SettingsInput value={r.name} onChange={(v) => updateRoutingRule(i, 'name', v)} className="w-24" /></td>
                  <td className="py-1.5 pr-2"><SettingsInput value={r.condition} onChange={(v) => updateRoutingRule(i, 'condition', v)} className="w-32" /></td>
                  <td className="py-1.5 pr-2"><SettingsInput value={r.action} onChange={(v) => updateRoutingRule(i, 'action', v)} className="w-32" /></td>
                  <td className="py-1.5 pr-2"><SettingsToggle checked={r.active} onChange={(v) => updateRoutingRule(i, 'active', v)} /></td>
                  <td className="py-1.5">
                    <button onClick={() => removeRoutingRule(i)} className="text-text-muted hover:text-error transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {whatsAppContent.routingRules.length === 0 && <p className="text-[10px] text-text-muted py-2">No routing rules.</p>}
      </SettingsCard>
    </SettingsSection>
  );
}

'use client';

import React, { useState } from 'react';
import { X, Loader2, Megaphone, Users, Clock, Send, Save } from 'lucide-react';

const AUDIENCES = [
  { value: 'ALL_LEADS', label: 'All Active Leads' },
  { value: 'HOT_LEADS', label: 'Hot Leads Only' },
  { value: 'WARM_LEADS', label: 'Warm Leads' },
  { value: 'COLD_LEADS', label: 'Cold Leads' },
  { value: 'ALL_CONTACTS', label: 'All Contacts' },
];

interface Props {
  onClose: () => void;
  onCreated: (broadcast: any) => void;
}

export default function BroadcastBuilderModal({ onClose, onCreated }: Props) {
  const [form, setForm] = useState({
    name: '', audience: 'ALL_LEADS', templateId: '',
    message: '', scheduled: false, scheduledAt: '',
  });
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.message.trim()) errs.message = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (sendNow: boolean) => {
    if (!validate()) return;
    const action = sendNow ? setSending : setSaving;
    action(true);
    setError('');
    try {
      const res = await fetch('/api/broadcasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          audience: form.audience,
          templateId: form.templateId || null,
          message: form.message,
          scheduledAt: sendNow ? null : (form.scheduled ? form.scheduledAt : null),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create broadcast');
      }
      const data = await res.json();

      if (sendNow) {
        data.broadcast.status = 'SENDING';
      }

      onCreated(data.broadcast);
    } catch (e: any) {
      setError(e.message);
    } finally {
      action(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-surface-card border border-border-default rounded-[14px] w-[520px] max-h-[90vh] shadow-xl flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-default shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center"><Megaphone className="w-4 h-4 text-accent" /></div>
            <h3 className="text-sm font-bold text-text-primary">New Broadcast Campaign</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-surface-bg-alt text-text-secondary"><X className="w-4 h-4" /></button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
          <div>
            <label className="text-[10px] font-medium text-text-muted block mb-1">Campaign Name *</label>
            <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Festive Season Offer 2025"
              className={`w-full bg-surface-bg border rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary placeholder:text-text-muted ${errors.name ? 'border-error' : 'border-border-default'}`} />
            {errors.name && <p className="text-[9px] text-error mt-0.5">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-medium text-text-muted block mb-1"><Users className="w-3 h-3 inline mr-1" />Target Audience</label>
              <select value={form.audience} onChange={e => setForm(p => ({ ...p, audience: e.target.value }))}
                className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary">
                {AUDIENCES.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-medium text-text-muted block mb-1">Template (optional)</label>
              <select value={form.templateId} onChange={e => setForm(p => ({ ...p, templateId: e.target.value }))}
                className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary">
                <option value="">Custom message</option>
                <option value="t1">Welcome Onboarding (20% conv)</option>
                <option value="t2">Festive Discount (12% conv)</option>
                <option value="t3">Proposal Follow-up (42% conv)</option>
                <option value="t4">Payment Reminder (68% conv)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-medium text-text-muted block mb-1">Message *</label>
            <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
              placeholder="Hi {{name}}, festive offer! Get 15% off on all orders above ₹50,000. Limited time only!"
              rows={4}
              className={`w-full bg-surface-bg border rounded-lg px-3 py-2.5 text-xs outline-none focus:border-accent text-text-primary placeholder:text-text-muted resize-none ${errors.message ? 'border-error' : 'border-border-default'}`} />
            {errors.message && <p className="text-[9px] text-error mt-0.5">{errors.message}</p>}
          </div>

          <div className="bg-accent/5 border border-accent/10 rounded-lg p-3">
            <div className="text-[9px] font-medium text-text-muted mb-1">Preview:</div>
            <p className="text-xs text-text-primary leading-relaxed">
              &ldquo;{form.message || 'Your message will appear here'}&rdquo;
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="schedule" checked={form.scheduled}
              onChange={e => setForm(p => ({ ...p, scheduled: e.target.checked }))}
              className="rounded border-border-default bg-surface-bg text-accent focus:ring-accent" />
            <label htmlFor="schedule" className="text-[10px] text-text-secondary">Schedule for later</label>
          </div>

          {form.scheduled && (
            <div>
              <label className="text-[10px] font-medium text-text-muted block mb-1"><Clock className="w-3 h-3 inline mr-1" />Schedule Date & Time</label>
              <input type="datetime-local" value={form.scheduledAt} onChange={e => setForm(p => ({ ...p, scheduledAt: e.target.value }))}
                className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary" />
            </div>
          )}
        </div>

        {error && <div className="px-5 pb-2"><p className="text-[10px] text-error font-medium">{error}</p></div>}

        <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-border-default shrink-0">
          <button onClick={onClose} className="border border-border-default text-text-secondary hover:text-text-primary text-xs font-semibold px-4 py-2 rounded-lg transition-colors">Cancel</button>
          <button onClick={() => handleSave(false)} disabled={saving}
            className="border border-border-default text-text-secondary hover:text-text-primary text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5">
            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button onClick={() => handleSave(true)} disabled={sending}
            className="bg-accent hover:bg-accent-hover disabled:bg-accent/50 text-white text-xs font-semibold px-5 py-2 rounded-lg transition-colors flex items-center gap-1.5">
            {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            {sending ? 'Sending...' : 'Send Now'}
          </button>
        </div>
      </div>
    </div>
  );
}

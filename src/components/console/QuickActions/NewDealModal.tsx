'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2, DollarSign, Calendar, User, Target } from 'lucide-react';

interface Props {
  onClose: () => void;
  onCreated: (deal: any) => void;
}

export default function NewDealModal({ onClose, onCreated }: Props) {
  const [form, setForm] = useState({
    name: '', contactId: '', contactName: '', company: '', amount: '',
    expectedCloseDate: '', stageId: '', pipelineId: '', probability: '',
    note: '',
  });
  const [contacts, setContacts] = useState<any[]>([]);
  const [stages, setStages] = useState<any[]>([]);
  const [pipelines, setPipelines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    Promise.all([
      fetch('/api/crm?collection=contacts').then(r => r.json()),
      fetch('/api/crm?collection=stages').then(r => r.json()),
    ]).then(([c, s]) => {
      setContacts(c);
      setStages(s);
      if (s.length > 0) {
        setForm(prev => ({ ...prev, stageId: s[0].id }));
        setPipelines([{ id: s[0].pipelineId, name: 'Default Pipeline' }]);
        setForm(prev => ({ ...prev, pipelineId: s[0].pipelineId }));
      }
    }).catch(() => setError('Failed to load data'))
    .finally(() => setLoading(false));
  }, []);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.contactId) errs.contactId = 'Select a contact';
    if (!form.stageId) errs.stageId = 'Select a stage';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          value: Number(form.amount) || 0,
          contactId: form.contactId,
          pipelineId: form.pipelineId,
          stageId: form.stageId,
          expectedCloseDate: form.expectedCloseDate || null,
          probability: Number(form.probability) || 0,
          note: form.note || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create deal');
      }
      const data = await res.json();
      onCreated(data.deal);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
        <div className="bg-surface-card border border-border-default rounded-[14px] w-[480px] p-8 shadow-xl" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-center"><Loader2 className="w-6 h-6 text-accent animate-spin" /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-surface-card border border-border-default rounded-[14px] w-[520px] max-h-[90vh] shadow-xl flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-default shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center"><DollarSign className="w-4 h-4 text-accent" /></div>
            <h3 className="text-sm font-bold text-text-primary">New Deal</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-surface-bg-alt text-text-secondary"><X className="w-4 h-4" /></button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
          <div>
            <label className="text-[10px] font-medium text-text-muted block mb-1">Deal Name *</label>
            <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Steel Supply Order — Patel Logistics"
              className={`w-full bg-surface-bg border rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary placeholder:text-text-muted ${errors.name ? 'border-error' : 'border-border-default'}`} />
            {errors.name && <p className="text-[9px] text-error mt-0.5">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-medium text-text-muted block mb-1"><User className="w-3 h-3 inline mr-1" />Contact *</label>
              <select value={form.contactId} onChange={e => {
                const c = contacts.find(c => c.id === e.target.value);
                setForm(p => ({ ...p, contactId: e.target.value, contactName: c?.name || '', company: c?.companyName || '' }));
              }} className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary">
                <option value="">Select contact</option>
                {contacts.map(c => <option key={c.id} value={c.id}>{c.name}{c.companyName ? ` (${c.companyName})` : ''}</option>)}
              </select>
              {errors.contactId && <p className="text-[9px] text-error mt-0.5">{errors.contactId}</p>}
            </div>
            <div>
              <label className="text-[10px] font-medium text-text-muted block mb-1">Company</label>
              <input type="text" value={form.company} readOnly disabled
                className="w-full bg-surface-bg/50 border border-border-default rounded-lg px-3 py-2 text-xs text-text-muted cursor-not-allowed" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-medium text-text-muted block mb-1"><DollarSign className="w-3 h-3 inline mr-1" />Amount</label>
              <input type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                placeholder="450000" className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary placeholder:text-text-muted" />
            </div>
            <div>
              <label className="text-[10px] font-medium text-text-muted block mb-1"><Target className="w-3 h-3 inline mr-1" />Probability (%)</label>
              <input type="number" min="0" max="100" value={form.probability} onChange={e => setForm(p => ({ ...p, probability: e.target.value }))}
                placeholder="80" className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary placeholder:text-text-muted" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-medium text-text-muted block mb-1"><Calendar className="w-3 h-3 inline mr-1" />Expected Close Date</label>
              <input type="date" value={form.expectedCloseDate} onChange={e => setForm(p => ({ ...p, expectedCloseDate: e.target.value }))}
                className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary" />
            </div>
            <div>
              <label className="text-[10px] font-medium text-text-muted block mb-1">Stage *</label>
              <select value={form.stageId} onChange={e => setForm(p => ({ ...p, stageId: e.target.value }))}
                className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary">
                <option value="">Select stage</option>
                {stages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              {errors.stageId && <p className="text-[9px] text-error mt-0.5">{errors.stageId}</p>}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-medium text-text-muted block mb-1">Notes</label>
            <textarea value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
              placeholder="Additional details..." rows={2}
              className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary placeholder:text-text-muted resize-none" />
          </div>
        </div>

        {error && <div className="px-5 pb-2"><p className="text-[10px] text-error font-medium">{error}</p></div>}

        <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-border-default shrink-0">
          <button onClick={onClose} className="border border-border-default text-text-secondary hover:text-text-primary text-xs font-semibold px-4 py-2 rounded-lg transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="bg-accent hover:bg-accent-hover disabled:bg-accent/50 text-white text-xs font-semibold px-5 py-2 rounded-lg transition-colors flex items-center gap-1.5">
            {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {saving ? 'Creating...' : 'Create Deal'}
          </button>
        </div>
      </div>
    </div>
  );
}

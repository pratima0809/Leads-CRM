'use client';

import React, { useState } from 'react';
import { X, Loader2, Building2, Phone, Mail, Globe, DollarSign, User } from 'lucide-react';

const SOURCES = ['WEBSITE', 'META_ADS', 'GOOGLE_ADS', 'GOOGLE_FORMS', 'INDIAMART', 'JUSTDIAL', 'WHATSAPP', 'MISSED_CALL', 'CSV', 'API', 'REFERRAL'];
const INDUSTRIES = ['Technology', 'Healthcare', 'Education', 'Manufacturing', 'Logistics', 'Construction', 'Retail', 'Finance', 'Real Estate', 'Other'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const STATUSES = ['NEW', 'QUALIFYING', 'CONTACTED', 'CONVERTED', 'COLD'];

interface Props {
  onClose: () => void;
  onCreated: (lead: any) => void;
}

export default function NewLeadModal({ onClose, onCreated }: Props) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', companyName: '',
    industry: '', source: 'WEBSITE', dealValue: '', status: 'NEW',
    priority: 'MEDIUM', description: '', assignedUserId: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = 'Required';
    if (!form.lastName.trim()) errs.lastName = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          dealValue: form.dealValue ? Number(form.dealValue) : 0,
          score: form.priority === 'CRITICAL' ? 95 : form.priority === 'HIGH' ? 80 : form.priority === 'MEDIUM' ? 50 : 20,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create lead');
      }
      const data = await res.json();
      onCreated(data.lead);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-surface-card border border-border-default rounded-[14px] w-[520px] max-h-[90vh] shadow-xl flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-default shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center"><User className="w-4 h-4 text-accent" /></div>
            <h3 className="text-sm font-bold text-text-primary">New Lead</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-surface-bg-alt text-text-secondary"><X className="w-4 h-4" /></button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-medium text-text-muted block mb-1">First Name *</label>
              <input type="text" value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))}
                placeholder="John" className={`w-full bg-surface-bg border rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary placeholder:text-text-muted ${errors.firstName ? 'border-error' : 'border-border-default'}`} />
              {errors.firstName && <p className="text-[9px] text-error mt-0.5">{errors.firstName}</p>}
            </div>
            <div>
              <label className="text-[10px] font-medium text-text-muted block mb-1">Last Name *</label>
              <input type="text" value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))}
                placeholder="Doe" className={`w-full bg-surface-bg border rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary placeholder:text-text-muted ${errors.lastName ? 'border-error' : 'border-border-default'}`} />
              {errors.lastName && <p className="text-[9px] text-error mt-0.5">{errors.lastName}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-medium text-text-muted block mb-1"><Phone className="w-3 h-3 inline mr-1" />Phone</label>
              <input type="text" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                placeholder="+91 98765 43210" className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary placeholder:text-text-muted" />
            </div>
            <div>
              <label className="text-[10px] font-medium text-text-muted block mb-1"><Mail className="w-3 h-3 inline mr-1" />Email</label>
              <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="john@company.com" className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary placeholder:text-text-muted" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-medium text-text-muted block mb-1"><Building2 className="w-3 h-3 inline mr-1" />Company</label>
              <input type="text" value={form.companyName} onChange={e => setForm(p => ({ ...p, companyName: e.target.value }))}
                placeholder="Acme Corp" className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary placeholder:text-text-muted" />
            </div>
            <div>
              <label className="text-[10px] font-medium text-text-muted block mb-1"><Globe className="w-3 h-3 inline mr-1" />Industry</label>
              <select value={form.industry} onChange={e => setForm(p => ({ ...p, industry: e.target.value }))}
                className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary">
                <option value="">Select industry</option>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-medium text-text-muted block mb-1">Source</label>
              <select value={form.source} onChange={e => setForm(p => ({ ...p, source: e.target.value }))}
                className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary">
                {SOURCES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-medium text-text-muted block mb-1"><DollarSign className="w-3 h-3 inline mr-1" />Deal Value</label>
              <input type="number" value={form.dealValue} onChange={e => setForm(p => ({ ...p, dealValue: e.target.value }))}
                placeholder="450000" className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary placeholder:text-text-muted" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-medium text-text-muted block mb-1">Status</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary">
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-medium text-text-muted block mb-1">Priority</label>
              <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
                className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary">
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-medium text-text-muted block mb-1">Notes</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Additional notes about this lead..." rows={3}
              className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary placeholder:text-text-muted resize-none" />
          </div>
        </div>

        {error && <div className="px-5 pb-2"><p className="text-[10px] text-error font-medium">{error}</p></div>}

        <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-border-default shrink-0">
          <button onClick={onClose} className="border border-border-default text-text-secondary hover:text-text-primary text-xs font-semibold px-4 py-2 rounded-lg transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="bg-accent hover:bg-accent-hover disabled:bg-accent/50 text-white text-xs font-semibold px-5 py-2 rounded-lg transition-colors flex items-center gap-1.5">
            {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {saving ? 'Creating...' : 'Create Lead'}
          </button>
        </div>
      </div>
    </div>
  );
}

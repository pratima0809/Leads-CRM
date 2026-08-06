'use client';

import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

interface Props {
  chatId: string;
  phone: string;
  onClose: () => void;
  onCreated: (contact: any) => void;
}

export default function CreateContactModal({ chatId, phone, onClose, onCreated }: Props) {
  const [form, setForm] = useState({ name: '', phone, email: '', company: '', designation: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.phone.trim()) errs.phone = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, chatId }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create contact');
      }
      const data = await res.json();
      onCreated(data.contact);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const fields: Array<{ key: keyof typeof form; label: string; placeholder: string; required?: boolean }> = [
    { key: 'name', label: 'Full Name', placeholder: 'John Doe', required: true },
    { key: 'phone', label: 'Phone Number', placeholder: '+91 98765 43210', required: true },
    { key: 'email', label: 'Email', placeholder: 'john@company.com' },
    { key: 'company', label: 'Company', placeholder: 'Acme Corp' },
    { key: 'designation', label: 'Designation', placeholder: 'CEO' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-surface-card border border-border-default rounded-[14px] w-[420px] shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
          <h3 className="text-sm font-bold text-text-primary">Create Contact</h3>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-surface-bg-alt text-text-secondary"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-4 space-y-3">
          {fields.map(f => (
            <div key={f.key}>
              <label className="text-[10px] font-medium text-text-muted block mb-1">
                {f.label}{f.required ? ' *' : ''}
              </label>
              <input
                type="text"
                value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className={`w-full bg-surface-bg border rounded-lg px-3 py-2 text-xs outline-none text-text-primary placeholder:text-text-muted transition-colors ${
                  errors[f.key] ? 'border-error' : 'border-border-default focus:border-accent'
                }`}
              />
              {errors[f.key] && <p className="text-[9px] text-error mt-0.5">{errors[f.key]}</p>}
            </div>
          ))}
        </div>

        {error && (
          <div className="px-4 pb-2">
            <p className="text-[10px] text-error font-medium">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border-default">
          <button onClick={onClose} className="border border-border-default text-text-secondary hover:text-text-primary text-xs font-semibold px-4 py-2 rounded-lg transition-colors">Cancel</button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-accent hover:bg-accent-hover disabled:bg-accent/50 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
          >
            {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

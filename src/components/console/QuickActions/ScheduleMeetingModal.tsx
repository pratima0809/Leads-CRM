'use client';

import React, { useState } from 'react';
import { X, Video, Phone, MapPin, Loader2 } from 'lucide-react';

interface Props {
  chatId: string;
  onClose: () => void;
  onScheduled: (meeting: any) => void;
}

const MEETING_TYPES = [
  { value: 'GOOGLE_MEET', label: 'Google Meet', icon: Video, color: 'text-[#34A853]' },
  { value: 'ZOOM', label: 'Zoom', icon: Video, color: 'text-[#2D8CFF]' },
  { value: 'OFFICE', label: 'In Office', icon: MapPin, color: 'text-accent' },
  { value: 'PHONE_CALL', label: 'Phone Call', icon: Phone, color: 'text-warning' },
];

export default function ScheduleMeetingModal({ chatId, onClose, onScheduled }: Props) {
  const [form, setForm] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    type: 'GOOGLE_MEET',
    link: '',
    notes: '',
    customerName: '',
    customerPhone: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const getLinkLabel = () => {
    switch (form.type) {
      case 'GOOGLE_MEET': return 'Google Meet Link';
      case 'ZOOM': return 'Zoom Link';
      default: return 'Location / Dial-in';
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, chatId }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to schedule meeting');
      }
      const data = await res.json();
      onScheduled(data.meeting);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-surface-card border border-border-default rounded-[14px] w-[420px] shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
          <h3 className="text-sm font-bold text-text-primary">Schedule Meeting</h3>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-surface-bg-alt text-text-secondary"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="text-[10px] font-medium text-text-muted block mb-1">Meeting Title</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Proposal Review — Patel Logistics"
              className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary placeholder:text-text-muted"
            />
          </div>

          <div>
            <label className="text-[10px] font-medium text-text-muted block mb-1.5">Meeting Type</label>
            <div className="grid grid-cols-4 gap-2">
              {MEETING_TYPES.map(t => {
                const Icon = t.icon;
                const selected = form.type === t.value;
                return (
                  <button
                    key={t.value}
                    onClick={() => setForm(p => ({ ...p, type: t.value }))}
                    className={`flex flex-col items-center gap-1 py-2.5 rounded-lg border transition-colors ${
                      selected ? 'border-accent bg-accent/5' : 'border-border-default hover:border-border-hover'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${selected ? t.color : 'text-icon'}`} />
                    <span className={`text-[9px] font-medium ${selected ? 'text-text-primary' : 'text-text-muted'}`}>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-medium text-text-muted block mb-1">Customer Name</label>
              <input
                type="text"
                value={form.customerName}
                onChange={e => setForm(p => ({ ...p, customerName: e.target.value }))}
                placeholder="Full name"
                className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary placeholder:text-text-muted"
              />
            </div>
            <div>
              <label className="text-[10px] font-medium text-text-muted block mb-1">Customer Phone</label>
              <input
                type="text"
                value={form.customerPhone}
                onChange={e => setForm(p => ({ ...p, customerPhone: e.target.value }))}
                placeholder="+91 98765 43210"
                className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary placeholder:text-text-muted"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-medium text-text-muted block mb-1">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary"
              />
            </div>
            <div>
              <label className="text-[10px] font-medium text-text-muted block mb-1">Time</label>
              <input
                type="time"
                value={form.time}
                onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
                className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary"
              />
            </div>
          </div>

          {form.type !== 'OFFICE' && form.type !== 'PHONE_CALL' && (
            <div>
              <label className="text-[10px] font-medium text-text-muted block mb-1">{getLinkLabel()}</label>
              <input
                type="text"
                value={form.link}
                onChange={e => setForm(p => ({ ...p, link: e.target.value }))}
                placeholder="https://meet.google.com/..."
                className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary placeholder:text-text-muted"
              />
            </div>
          )}

          <div>
            <label className="text-[10px] font-medium text-text-muted block mb-1">Notes & Agenda</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              placeholder="Meeting agenda, talking points..."
              rows={3}
              className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary placeholder:text-text-muted resize-none"
            />
          </div>
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
            {saving ? 'Scheduling...' : 'Schedule'}
          </button>
        </div>
      </div>
    </div>
  );
}

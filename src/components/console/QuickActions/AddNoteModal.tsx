'use client';

import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

interface Props {
  chatId: string;
  onClose: () => void;
  onAdded: (note: any) => void;
}

export default function AddNoteModal({ chatId, onClose, onAdded }: Props) {
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!content.trim()) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, chatId }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to add note');
      }
      const data = await res.json();
      onAdded(data.note);
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
          <h3 className="text-sm font-bold text-text-primary">Add Note</h3>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-surface-bg-alt text-text-secondary"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-4">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="What do you want to note about this conversation?"
            rows={5}
            autoFocus
            className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2.5 text-xs outline-none focus:border-accent text-text-primary placeholder:text-text-muted resize-none"
          />
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
            disabled={saving || !content.trim()}
            className="bg-accent hover:bg-accent-hover disabled:bg-accent/50 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
          >
            {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {saving ? 'Saving...' : 'Save Note'}
          </button>
        </div>
      </div>
    </div>
  );
}

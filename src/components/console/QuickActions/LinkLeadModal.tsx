'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, Search, User, Building2, Phone, Loader2 } from 'lucide-react';

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  companyName: string | null;
  status: string;
  score: number;
}

interface Props {
  chatId: string;
  onClose: () => void;
  onLinked: (lead: Lead) => void;
}

export default function LinkLeadModal({ chatId, onClose, onLinked }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [linking, setLinking] = useState<string | null>(null);
  const [error, setError] = useState('');

  const search = useCallback(async (q: string) => {
    if (q.length < 1) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/leads/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error('Search failed');
      setResults(await res.json());
    } catch {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  const handleLink = async (lead: Lead) => {
    setLinking(lead.id);
    setError('');
    try {
      const res = await fetch('/api/chats/link-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId, leadId: lead.id }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to link lead');
      }
      onLinked(lead);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLinking(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-surface-card border border-border-default rounded-[14px] w-[480px] max-h-[580px] shadow-xl flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
          <h3 className="text-sm font-bold text-text-primary">Link to Lead</h3>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-surface-bg-alt text-text-secondary"><X className="w-4 h-4" /></button>
        </div>

        <div className="px-4 py-3 border-b border-border-default">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-icon" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by name, phone, or company..."
              className="w-full bg-surface-bg border border-border-default rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-accent text-text-primary placeholder:text-text-muted"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-1">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 text-icon animate-spin" />
            </div>
          )}
          {!loading && query && results.length === 0 && (
            <div className="text-center py-8 text-xs text-text-muted">No leads found</div>
          )}
          {!query && (
            <div className="text-center py-8 text-xs text-text-muted">Type to search leads</div>
          )}
          {results.map(lead => (
            <div key={lead.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-bg-alt transition-colors group">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-text-primary">{lead.firstName} {lead.lastName}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    lead.status === 'CONVERTED' ? 'bg-success/10 text-success' :
                    lead.status === 'QUALIFYING' ? 'bg-warning/10 text-warning' :
                    'bg-accent/10 text-accent'
                  }`}>{lead.status}</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-text-muted mt-0.5">
                  {lead.companyName && <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{lead.companyName}</span>}
                  {lead.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{lead.phone}</span>}
                </div>
              </div>
              <button
                onClick={() => handleLink(lead)}
                disabled={linking === lead.id}
                className="shrink-0 bg-accent hover:bg-accent-hover disabled:bg-accent/50 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
              >
                {linking === lead.id ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                {linking === lead.id ? 'Linking...' : 'Link'}
              </button>
            </div>
          ))}
        </div>

        {error && (
          <div className="px-4 py-2 border-t border-border-default">
            <p className="text-[10px] text-error font-medium">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

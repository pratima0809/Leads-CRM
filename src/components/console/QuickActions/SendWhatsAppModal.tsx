'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Loader2, Search, Send, Paperclip, Smile, MessageSquare, Image as ImageIcon } from 'lucide-react';

interface Props {
  onClose: () => void;
  onSent: (chat: any) => void;
}

export default function SendWhatsAppModal({ onClose, onSent }: Props) {
  const [step, setStep] = useState<'search' | 'compose'>('search');
  const [query, setQuery] = useState('');
  const [contacts, setContacts] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<{ name: string; phone: string; chatId?: string } | null>(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, [step]);

  useEffect(() => {
    if (query.length < 1) { setContacts([]); setLeads([]); return; }
    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const [chatsRes, leadsRes] = await Promise.all([
          fetch(`/api/whatsapp/chats?q=${encodeURIComponent(query)}`),
          fetch(`/api/leads/search?q=${encodeURIComponent(query)}`),
        ]);
        if (chatsRes.ok) setContacts(await chatsRes.json());
        if (leadsRes.ok) setLeads(await leadsRes.json());
      } catch { /* silent */ }
      setSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (item: { name: string; phone: string; chatId?: string }) => {
    setSelected(item);
    setMessage(`Hi ${item.name.split(' ')[0]},`);
    setStep('compose');
  };

  const handleSend = async () => {
    if (!message.trim() || !selected) return;
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: selected.chatId,
          contactName: selected.name,
          phone: selected.phone,
          text: message,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to send');
      }
      const data = await res.json();
      onSent(data.chat);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  };

  const handleAttach = (type: 'pdf' | 'image') => {
    setMessage(prev => prev + ` [${type} attached]`);
  };

  const emojis = ['😊', '👍', '📄', '✅', '🎉', '📞', '📅', '💰', '⭐', '🔥'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-surface-card border border-border-default rounded-[14px] w-[500px] max-h-[85vh] shadow-xl flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-default shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-success/10 flex items-center justify-center"><MessageSquare className="w-4 h-4 text-success" /></div>
            <h3 className="text-sm font-bold text-text-primary">Send WhatsApp</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-surface-bg-alt text-text-secondary"><X className="w-4 h-4" /></button>
        </div>

        {step === 'search' && (
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="p-4 border-b border-border-default">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-icon" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search contacts or leads..."
                  className="w-full bg-surface-bg border border-border-default rounded-lg pl-9 pr-3 py-2.5 text-xs outline-none focus:border-accent text-text-primary placeholder:text-text-muted"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-1">
              {searching && (
                <div className="flex items-center justify-center py-8"><Loader2 className="w-5 h-5 text-icon animate-spin" /></div>
              )}
              {!searching && query && contacts.length === 0 && leads.length === 0 && (
                <div className="text-center py-8 text-[10px] text-text-muted">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 text-icon opacity-50" />
                  No contacts or leads found. Try a different search.
                </div>
              )}
              {!query && (
                <div className="text-center py-8 text-[10px] text-text-muted">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 text-icon opacity-50" />
                  Search for a contact or lead to start a conversation
                </div>
              )}

              {contacts.length > 0 && (
                <>
                  <div className="px-3 py-2 text-[9px] font-bold text-text-muted uppercase tracking-wider">Existing Chats</div>
                  {contacts.map(c => (
                    <button key={c.id} onClick={() => handleSelect({ name: c.contactName, phone: c.phone, chatId: c.id })}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-bg-alt transition-colors">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-accent">
                        {c.contactName.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <div className="text-xs font-semibold text-text-primary">{c.contactName}</div>
                        <div className="text-[9px] text-text-muted">{c.phone}</div>
                      </div>
                      <Send className="w-3.5 h-3.5 text-icon" />
                    </button>
                  ))}
                </>
              )}

              {leads.length > 0 && (
                <>
                  <div className="px-3 py-2 text-[9px] font-bold text-text-muted uppercase tracking-wider">Leads</div>
                  {leads.filter(l => !contacts.some((c: any) => c.phone === l.phone)).map(l => (
                    <button key={l.id} onClick={() => handleSelect({ name: `${l.firstName} ${l.lastName}`, phone: l.phone || '' })}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-bg-alt transition-colors">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-accent">
                        {l.firstName[0]}{l.lastName[0]}
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <div className="text-xs font-semibold text-text-primary">{l.firstName} {l.lastName}</div>
                        <div className="text-[9px] text-text-muted">{l.companyName || l.phone || 'No phone'}</div>
                      </div>
                      <Send className="w-3.5 h-3.5 text-icon" />
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        )}

        {step === 'compose' && selected && (
          <div className="flex flex-col flex-1">
            <div className="px-5 py-3 bg-surface-bg-alt/30 border-b border-border-default">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-accent">
                  {selected.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-xs font-semibold text-text-primary">{selected.name}</div>
                  <div className="text-[9px] text-text-muted">{selected.phone}</div>
                </div>
              </div>
            </div>

            <div className="flex-1 p-4">
              <label className="text-[10px] font-medium text-text-muted block mb-2">Message</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Type your message..."
                rows={6}
                autoFocus
                className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2.5 text-xs outline-none focus:border-accent text-text-primary placeholder:text-text-muted resize-none"
              />

              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                {emojis.map(emoji => (
                  <button key={emoji} onClick={() => setMessage(prev => prev + emoji)}
                    className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-surface-bg-alt transition-colors text-sm">{emoji}</button>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-3">
                <button onClick={() => handleAttach('pdf')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-default text-text-secondary hover:text-text-primary hover:bg-surface-bg-alt transition-colors text-[9px] font-medium">
                  <Paperclip className="w-3 h-3" /> PDF
                </button>
                <button onClick={() => handleAttach('image')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-default text-text-secondary hover:text-text-primary hover:bg-surface-bg-alt transition-colors text-[9px] font-medium">
                  <ImageIcon className="w-3 h-3" /> Image
                </button>
              </div>
            </div>

            {error && <div className="px-5 pb-2"><p className="text-[10px] text-error font-medium">{error}</p></div>}

            <div className="flex items-center justify-between px-5 py-3.5 border-t border-border-default shrink-0">
              <button onClick={() => setStep('search')} className="text-[10px] text-text-secondary hover:text-text-primary font-medium transition-colors">
                ← Change recipient
              </button>
              <button onClick={handleSend} disabled={sending || !message.trim()}
                className="bg-success hover:bg-success/80 disabled:bg-success/50 text-white text-xs font-semibold px-5 py-2 rounded-lg transition-colors flex items-center gap-1.5">
                {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

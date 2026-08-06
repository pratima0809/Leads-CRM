'use client';

import React, { useState } from 'react';
import {
  Bot,
  Globe,
  MessageSquare,
  Layers,
  Phone,
  Users,
  LayoutDashboard,
  Sparkles
} from 'lucide-react';
import { useStore } from '@/lib/store';

export default function MobileView({ leads, contacts, deals }: { leads: any[], contacts: any[], deals: any[] }) {
  const [mobileTab, setMobileTab] = useState<'dashboard' | 'pipeline' | 'whatsapp' | 'contacts' | 'copilot'>('dashboard');
  const { triggerMockCallLifecycle } = useStore();

  const tabs = [
    { id: 'dashboard' as const, label: 'Home', icon: LayoutDashboard, activeColor: 'text-text-primary' },
    { id: 'pipeline' as const, label: 'Deals', icon: Layers, activeColor: 'text-info' },
    { id: 'whatsapp' as const, label: 'Inbox', icon: MessageSquare, activeColor: 'text-info' },
    { id: 'contacts' as const, label: 'Contacts', icon: Users, activeColor: 'text-info' },
    { id: 'copilot' as const, label: 'Copilot', icon: Bot, activeColor: 'text-accent' },
  ];

  return (
    <div className="w-full flex justify-center items-center py-6 bg-surface-bg-alt">
      <div className="w-[360px] h-[720px] bg-black rounded-[48px] p-3 shadow-modal border-[4px] border-border-divider relative flex flex-col overflow-hidden">

        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-4 bg-black rounded-b-xl z-50 flex justify-between items-center px-4 text-[9px] text-white">
          <span>9:41</span>
          <div className="w-2.5 h-2.5 rounded-full bg-border-divider" />
          <div className="flex gap-0.5">
            <span className="w-1.5 h-1.5 bg-white rounded-full" />
            <span className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
        </div>

        <div className="flex-1 bg-surface-bg rounded-[38px] overflow-hidden flex flex-col pt-6 font-sans relative text-xs select-none">

          <div className="bg-surface-card border-b border-border-default px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded bg-sidebar flex items-center justify-center text-white">
                <Globe className="w-3 h-3" />
              </div>
              <span className="font-bold text-text-primary tracking-tight">LeadSphere</span>
            </div>
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">
              {mobileTab}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 no-scrollbar pb-16">

            {mobileTab === 'dashboard' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-surface-card p-3 border border-border-default rounded-xl">
                    <span className="text-text-muted font-semibold text-[9px] block uppercase">Revenue (YTD)</span>
                    <span className="text-base font-extrabold text-text-primary block mt-1">₹349k</span>
                  </div>
                  <div className="bg-surface-card p-3 border border-border-default rounded-xl">
                    <span className="text-text-muted font-semibold text-[9px] block uppercase">Growth</span>
                    <span className="text-base font-extrabold text-info block mt-1">+18.4%</span>
                  </div>
                </div>

                <div className="bg-surface-card p-3 border border-border-default rounded-xl space-y-2.5">
                  <h4 className="font-bold text-text-primary text-xs flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-accent" />
                    AI Action Required
                  </h4>
                  <div className="bg-error-light text-error border border-error-border p-2.5 rounded-lg">
                    <div className="font-bold">Apex Health (₹85,000)</div>
                    <p className="text-[10px] text-text-secondary mt-1">Stagnant deal. Recommendation: Call Robert Johnson.</p>
                  </div>
                </div>
              </div>
            )}

            {mobileTab === 'pipeline' && (
              <div className="space-y-3">
                <h4 className="font-bold text-text-primary">Active Deals ({deals?.length || 0})</h4>
                <div className="space-y-2">
                  {deals?.map((deal) => (
                    <div key={deal.id} className="bg-surface-card border border-border-default p-3 rounded-xl flex justify-between items-center">
                      <div>
                        <div className="font-bold text-text-primary">{deal.name}</div>
                        <div className="text-[10px] text-text-muted mt-1">Value: ₹{deal.value.toLocaleString()}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold border ${
                        deal.aiHealthStatus === 'HOT' ? 'badge-info' : 'badge-error'
                      }`}>
                        {deal.aiHealthStatus}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mobileTab === 'whatsapp' && (
              <div className="space-y-3">
                <h4 className="font-bold text-text-primary">Active Chats</h4>
                <div className="space-y-1 bg-surface-card border border-border-default rounded-xl divide-y divide-border-default overflow-hidden">
                  <div className="p-3 bg-info-light/30 flex justify-between items-start">
                    <div>
                      <div className="font-bold text-text-primary">James Wilson</div>
                      <p className="text-[10px] text-text-secondary truncate mt-1">Can you share the specs PDF...</p>
                    </div>
                    <span className="w-1.5 h-1.5 rounded-full bg-info" />
                  </div>
                  <div className="p-3 flex justify-between items-start">
                    <div>
                      <div className="font-bold text-text-primary">Jane Smith</div>
                      <p className="text-[10px] text-text-secondary truncate mt-1">Great, see you Thursday...</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {mobileTab === 'contacts' && (
              <div className="space-y-3">
                <h4 className="font-bold text-text-primary">Account Directory</h4>
                <div className="space-y-2">
                  {contacts?.map((contact) => (
                    <div key={contact.id} className="bg-surface-card border border-border-default p-3 rounded-xl flex justify-between items-center">
                      <div>
                        <div className="font-bold text-text-primary">{contact.name}</div>
                        <div className="text-[10px] text-text-muted mt-1">{contact.companyName}</div>
                      </div>
                      <button
                        onClick={() => triggerMockCallLifecycle(contact.phone || '+1 555 1234', contact.name)}
                        aria-label={`Call ${contact.name}`}
                        className="p-1.5 bg-info-light/30 text-info rounded-lg hover:bg-info-light transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mobileTab === 'copilot' && (
              <div className="space-y-3">
                <div className="bg-accent-light border border-accent/20 p-3 rounded-xl space-y-2">
                  <span className="text-[9px] font-bold text-accent flex items-center gap-1 uppercase tracking-wide">
                    <Bot className="w-3.5 h-3.5" />
                    AI Mobile Copilot
                  </span>
                  <p className="text-text-secondary leading-relaxed font-semibold">
                    Ask me: &ldquo;Show deals at risk&rdquo;, &ldquo;Create follow-up task&rdquo;, or &ldquo;Draft invoice summary&rdquo;.
                  </p>
                </div>
                <div className="bg-surface-card border border-border-default rounded-xl p-3 flex gap-2">
                  <input
                    type="text"
                    placeholder="Search queries..."
                    disabled
                    className="flex-1 bg-surface-bg-alt border border-border-default rounded-lg p-2 text-[10px] outline-none text-text-muted"
                  />
                  <button className="bg-accent hover:bg-accent-hover text-white font-bold px-3.5 rounded-lg text-[10px] transition-colors">
                    Go
                  </button>
                </div>
              </div>
            )}

          </div>

          <div className="absolute bottom-0 left-0 right-0 h-16 bg-surface-card border-t border-border-default flex items-center justify-around px-2 z-50">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setMobileTab(tab.id)}
                  aria-current={mobileTab === tab.id ? 'page' : undefined}
                  className={`flex flex-col items-center gap-1 transition-colors ${
                    mobileTab === tab.id ? tab.activeColor : 'text-text-muted'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[8px] font-bold">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-border-divider rounded-full z-50" />

        </div>

      </div>
    </div>
  );
}

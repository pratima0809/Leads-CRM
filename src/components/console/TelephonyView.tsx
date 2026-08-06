'use client';

import React, { useState } from 'react';
import {
  Phone, PhoneCall, PhoneMissed, Clock, TrendingUp, Target, Search,
  Filter, BrainCircuit, AlertTriangle, CheckCircle2,
  Zap, MessageSquare, User, Building2, Calendar, Play, Mic,
  ThumbsUp, ThumbsDown, Minus, ArrowUpRight, ArrowDownRight,
  X, PhoneOff, DollarSign, ChevronDown, ChevronUp, Eye,
  Notebook, ListChecks, Maximize2, Minimize2,
} from 'lucide-react';

/* ---- Mock data ---- */

const callLogs = [
  { id: 'c1', contact: 'Vikram Mehta', company: 'ABC Metals & Forgings', number: '+91 98765 43210', time: '10:15 AM', duration: '12m 30s', type: 'outbound', status: 'completed', sentiment: 'positive', outcome: 'followup' },
  { id: 'c2', contact: 'Ananya Desai', company: 'Desai Textiles', number: '+91 87654 32109', time: '11:00 AM', duration: '8m 15s', type: 'inbound', status: 'completed', sentiment: 'positive', outcome: 'demo_scheduled' },
  { id: 'c3', contact: 'Rahul Kapoor', company: 'Kapoor Auto Parts', number: '+91 76543 21098', time: '1:30 PM', duration: '3m 45s', type: 'outbound', status: 'missed', sentiment: 'neutral', outcome: 'no_answer' },
  { id: 'c4', contact: 'Dr. Priya Sharma', company: 'Sahyadri Healthcare', number: '+91 65432 10987', time: '2:00 PM', duration: '22m 10s', type: 'outbound', status: 'completed', sentiment: 'positive', outcome: 'contract_review' },
  { id: 'c5', contact: 'Arun Nair', company: 'NovaTech Software', number: '+91 54321 09876', time: '3:45 PM', duration: '5m 00s', type: 'inbound', status: 'completed', sentiment: 'negative', outcome: 'objection' },
  { id: 'c6', contact: 'Neha Gupta', company: 'Apex Educational Solutions', number: '+91 43210 98765', time: '4:30 PM', duration: '15m 20s', type: 'outbound', status: 'completed', sentiment: 'positive', outcome: 'onboarding' },
  { id: 'c7', contact: 'Emily Davis', company: 'Horizon Real Estate', number: '+91 32109 87654', time: '5:00 PM', duration: '1m 05s', type: 'outbound', status: 'missed', sentiment: 'neutral', outcome: 'busy' },
];

const callQueue = [
  { id: 'q1', contact: 'Rajesh Kumar', company: 'Kumar Logistics', number: '+91 98234 56789', value: 340000, lastContacted: '2 days ago', priority: 'high' as const },
  { id: 'q2', contact: 'Sneha Patel', company: 'Patel Pharma', number: '+91 89123 45678', value: 180000, lastContacted: '5 days ago', priority: 'medium' as const },
  { id: 'q3', contact: 'Amit Joshi', company: 'Joshi Enterprises', number: '+91 79012 34567', value: 75000, lastContacted: '1 week ago', priority: 'low' as const },
  { id: 'q4', contact: 'Pooja Singh', company: 'Singh Consulting', number: '+91 78901 23456', value: 520000, lastContacted: 'Yesterday', priority: 'high' as const },
  { id: 'q5', contact: 'Deepak Verma', company: 'Verma Tech Solutions', number: '+91 67890 12345', value: 950000, lastContacted: '3 days ago', priority: 'high' as const },
];

const scheduledCalls = [
  { time: '9:00 AM', contact: 'Vikram Mehta', company: 'ABC Metals', purpose: 'Q3 Renewal', status: 'completed' as const },
  { time: '10:00 AM', contact: 'Ananya Desai', company: 'Desai Textiles', purpose: 'Product Demo', status: 'completed' as const },
  { time: '11:30 AM', contact: 'Dr. Priya Sharma', company: 'Sahyadri Healthcare', purpose: 'Security Compliance', status: 'upcoming' as const },
  { time: '2:00 PM', contact: 'Arun Nair', company: 'NovaTech', purpose: 'Enterprise Agreement', status: 'upcoming' as const },
  { time: '4:00 PM', contact: 'Neha Gupta', company: 'Apex Edu', purpose: 'Onboarding Review', status: 'upcoming' as const },
];

const recentContacts = [
  { name: 'Ananya Desai', company: 'Desai Textiles', role: 'CEO', lastContacted: 'Today, 11:00 AM', sentiment: 'positive' as const },
  { name: 'Dr. Priya Sharma', company: 'Sahyadri Healthcare', role: 'Medical Director', lastContacted: 'Today, 2:00 PM', sentiment: 'positive' as const },
  { name: 'Arun Nair', company: 'NovaTech Software', role: 'CTO', lastContacted: 'Today, 3:45 PM', sentiment: 'negative' as const },
  { name: 'Rahul Kapoor', company: 'Kapoor Auto Parts', role: 'Owner', lastContacted: 'Yesterday', sentiment: 'neutral' as const },
];

/* ---- Helpers ---- */

const SentimentIcon = ({ s }: { s: string }) =>
  s === 'positive' ? <ThumbsUp className="w-3 h-3 text-success" /> :
  s === 'negative' ? <ThumbsDown className="w-3 h-3 text-error" /> :
  <Minus className="w-3 h-3 text-text-muted" />;

/* ============================
   Dialer Modal
   ============================ */
function DialerModal({ onClose }: { onClose: () => void }) {
  const [num, setNum] = useState('');

  const keys = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['*', '0', '#']];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-surface-card border border-border-default rounded-[16px] p-5 w-[280px] shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-text-primary">New Call</span>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-surface-bg-alt text-text-secondary"><X className="w-4 h-4" /></button>
        </div>
        <input
          type="text"
          value={num}
          onChange={e => setNum(e.target.value)}
          placeholder="Enter number"
          className="w-full bg-surface-bg-alt border border-border-default rounded-lg px-3 py-2 text-sm text-center outline-none focus:border-accent text-text-primary placeholder:text-text-muted font-mono tracking-wider"
        />
        <div className="grid grid-cols-3 gap-1.5 my-3">
          {keys.flat().map(k => (
            <button key={k} onClick={() => setNum(n => n + k)}
              className="bg-surface-bg-alt hover:bg-surface-bg border border-border-default rounded-lg py-2 text-sm font-bold text-text-primary transition-colors"
            >{k}</button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setNum(n => n.slice(0, -1))}
            className="flex-1 border border-border-default rounded-lg py-2 text-xs font-semibold text-text-secondary hover:bg-surface-bg-alt transition-colors"
          >Backspace</button>
          <button className="flex-1 bg-accent hover:bg-accent-hover text-white rounded-lg py-2 text-xs font-bold transition-colors flex items-center justify-center gap-1.5">
            <Phone className="w-3.5 h-3.5 fill-white" /> Call
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================
   Active Call Workspace – Idle
   ============================ */
function IdleWorkspace() {
  const [showAllSchedule, setShowAllSchedule] = useState(false);

  const upcoming = scheduledCalls.filter(s => s.status === 'upcoming');
  const displayed = showAllSchedule ? scheduledCalls : upcoming;

  return (
    <div className="h-full flex flex-col gap-5">
      {/* Scheduled Calls */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-text-primary">Scheduled Calls</h2>
          <button onClick={() => setShowAllSchedule(s => !s)} className="text-[10px] font-medium text-accent hover:underline">
            {showAllSchedule ? 'Show upcoming' : 'Show all'}
          </button>
        </div>
        <div className="space-y-2">
          {displayed.map(s => (
            <div key={s.time} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-surface-bg-alt/50 transition-colors">
              <div className="w-14 text-[10px] font-bold text-text-secondary text-right shrink-0">{s.time}</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-text-primary">{s.purpose}</div>
                <div className="text-[10px] text-text-muted flex items-center gap-2 mt-0.5">
                  <User className="w-2.5 h-2.5" /><span>{s.contact}</span>
                  <Building2 className="w-2.5 h-2.5" /><span>{s.company}</span>
                </div>
              </div>
              <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                s.status === 'completed' ? 'bg-success/10 text-success' : 'bg-accent/10 text-accent'
              }`}>{s.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Contacts */}
      <div>
        <h2 className="text-sm font-bold text-text-primary mb-3">Recent Contacts</h2>
        <div className="space-y-1.5">
          {recentContacts.map(c => (
            <div key={c.name} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-surface-bg-alt/50 transition-colors cursor-pointer group">
              <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                <User className="w-3.5 h-3.5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-text-primary">{c.name}</span>
                  <SentimentIcon s={c.sentiment} />
                </div>
                <div className="text-[9px] text-text-muted">{c.role} · {c.company}</div>
              </div>
              <div className="text-[9px] text-text-muted text-right shrink-0">
                <div>{c.lastContacted}</div>
              </div>
              <button className="opacity-0 group-hover:opacity-100 bg-accent/10 hover:bg-accent/20 text-accent text-[8px] font-bold px-2 py-1 rounded transition-all">
                <Phone className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Draft Notes */}
      <div>
        <h2 className="text-sm font-bold text-text-primary mb-3">Draft Notes</h2>
        <div className="bg-surface-bg-alt/50 border border-border-default/50 rounded-[10px] p-3">
          <textarea
            placeholder="Type call notes here..."
            rows={3}
            className="w-full bg-transparent outline-none text-xs text-text-primary placeholder:text-text-muted resize-none"
          />
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border-default/30">
            <span className="text-[9px] text-text-muted">Auto-saved · 2 draft(s)</span>
            <button className="text-[9px] font-semibold text-accent hover:underline">View drafts</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================
   Active Call Workspace – Live
   ============================ */
function ActiveCallWorkspace({ onEnd }: { onEnd: () => void }) {
  const [elapsed] = useState('04:23');
  const [notes, setNotes] = useState('');
  const [showAIDrawer, setShowAIDrawer] = useState(false);

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Call header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center">
            <User className="w-5 h-5 text-accent" />
          </div>
          <div>
            <div className="text-sm font-bold text-text-primary flex items-center gap-2">
              Dr. Priya Sharma
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            </div>
            <div className="text-[10px] text-text-muted">Sahyadri Healthcare · Medical Director</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs font-mono font-bold text-text-primary">{elapsed}</div>
          <span className="bg-success/10 text-success text-[9px] font-semibold px-2 py-0.5 rounded">Connected</span>
        </div>
      </div>

      {/* Company + Deal info */}
      <div className="flex gap-3">
        <div className="bg-surface-bg-alt/50 border border-border-default/50 rounded-lg px-3 py-2 flex-1">
          <div className="text-[9px] text-text-muted">Company</div>
          <div className="text-xs font-semibold text-text-primary">Sahyadri Healthcare</div>
        </div>
        <div className="bg-surface-bg-alt/50 border border-border-default/50 rounded-lg px-3 py-2">
          <div className="text-[9px] text-text-muted">Deal Value</div>
          <div className="text-xs font-bold text-success">₹8.5L</div>
        </div>
        <div className="bg-surface-bg-alt/50 border border-border-default/50 rounded-lg px-3 py-2">
          <div className="text-[9px] text-text-muted">Buying Intent</div>
          <div className="text-xs font-bold text-accent">87%</div>
        </div>
        <div className="bg-surface-bg-alt/50 border border-border-default/50 rounded-lg px-3 py-2">
          <div className="text-[9px] text-text-muted">Health</div>
          <div className="text-xs font-bold text-success">Hot</div>
        </div>
      </div>

      {/* Live notes + AI suggestions */}
      <div className="flex gap-4 flex-1 min-h-0">
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <Notebook className="w-3.5 h-3.5 text-icon" />
            <span className="text-[10px] font-semibold text-text-primary">Live Notes</span>
          </div>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Type notes during the call..."
            rows={5}
            className="flex-1 w-full bg-surface-bg-alt/50 border border-border-default/50 rounded-lg p-2.5 text-xs text-text-primary placeholder:text-text-muted outline-none focus:border-accent/50 resize-none"
          />
        </div>
        <div className="w-56 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-3.5 h-3.5 text-accent" />
              <span className="text-[10px] font-semibold text-text-primary">AI Suggestions</span>
            </div>
            <button onClick={() => setShowAIDrawer(s => !s)} className="text-text-muted hover:text-text-primary">
              {showAIDrawer ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
            </button>
          </div>
          <div className="space-y-2">
            <div className="bg-accent/5 border border-accent/10 rounded-lg p-2.5">
              <div className="text-[9px] font-semibold text-accent mb-0.5">Next question</div>
              <p className="text-[9px] text-text-secondary leading-relaxed">"What timeline are you targeting for implementation?"</p>
            </div>
            <div className="bg-warning/5 border border-warning/10 rounded-lg p-2.5">
              <div className="text-[9px] font-semibold text-warning mb-0.5">Objection detected</div>
              <p className="text-[9px] text-text-secondary leading-relaxed">Customer mentioned budget constraints — address value ROI</p>
            </div>
            <div className="bg-info/5 border border-info/10 rounded-lg p-2.5">
              <div className="text-[9px] font-semibold text-info mb-0.5">Key insight</div>
              <p className="text-[9px] text-text-secondary leading-relaxed">Interested in compliance features — mention HIPAA readiness</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call controls */}
      <div className="flex items-center justify-between pt-3 border-t border-border-default/50">
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-full bg-surface-bg-alt border border-border-default flex items-center justify-center hover:bg-surface-bg transition-colors" title="Mute"><Mic className="w-3.5 h-3.5 text-text-secondary" /></button>
          <button className="w-8 h-8 rounded-full bg-surface-bg-alt border border-border-default flex items-center justify-center hover:bg-surface-bg transition-colors" title="Hold"><Clock className="w-3.5 h-3.5 text-text-secondary" /></button>
          <button className="w-8 h-8 rounded-full bg-surface-bg-alt border border-border-default flex items-center justify-center hover:bg-surface-bg transition-colors" title="Keypad"><Phone className="w-3.5 h-3.5 text-text-secondary" /></button>
          <button className="w-8 h-8 rounded-full bg-surface-bg-alt border border-border-default flex items-center justify-center hover:bg-surface-bg transition-colors" title="Transfer"><PhoneCall className="w-3.5 h-3.5 text-text-secondary" /></button>
        </div>
        <button onClick={onEnd}
          className="bg-error hover:bg-error/80 text-white text-[10px] font-bold px-4 py-2 rounded-full flex items-center gap-1.5 transition-all shadow-sm"
        >
          <PhoneOff className="w-3.5 h-3.5" /> End Call
        </button>
      </div>

      {/* Full AI Insights Drawer */}
      {showAIDrawer && (
        <div className="bg-surface-card dark:bg-sidebar text-text-primary dark:text-white border-border-default dark:border-sidebar-hover rounded-[12px] p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl -translate-y-1/4 translate-x-1/4 pointer-events-none" />
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-accent" />
              <h3 className="text-xs font-bold text-text-primary dark:text-white">AI Insights</h3>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-white/5 border border-white/5 rounded-lg p-2.5">
                <div className="text-[9px] font-semibold text-slate-300 mb-1">Talk-to-Listen</div>
                <div className="text-lg font-bold text-text-primary dark:text-white">40:60</div>
                <div className="text-[9px] text-text-secondary dark:text-sidebar-text">Great balance</div>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-lg p-2.5">
                <div className="text-[9px] font-semibold text-slate-300 mb-1">Call Quality</div>
                <div className="text-lg font-bold text-success">92</div>
                <div className="text-[9px] text-text-secondary dark:text-sidebar-text">Top 15% of calls</div>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-lg p-2.5 col-span-2">
                <div className="text-[9px] font-semibold text-slate-300 mb-1">Suggested Improvements</div>
                <ul className="space-y-1">
                  <li className="text-[9px] text-text-secondary dark:text-sidebar-text flex items-start gap-1.5"><div className="w-1 h-1 rounded-full bg-accent mt-1 shrink-0" />Pause 2-3s after discovery questions</li>
                  <li className="text-[9px] text-text-secondary dark:text-sidebar-text flex items-start gap-1.5"><div className="w-1 h-1 rounded-full bg-accent mt-1 shrink-0" />Reduce filler words ("actually", "basically")</li>
                  <li className="text-[9px] text-text-secondary dark:text-sidebar-text flex items-start gap-1.5"><div className="w-1 h-1 rounded-full bg-accent mt-1 shrink-0" />Mirror customer's pace on technical topics</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================
   Main Component
   ============================ */
export default function TelephonyView({ activities: _activities }: { activities: any[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCall, setExpandedCall] = useState<string | null>(null);
  const [showDialer, setShowDialer] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [showAIDrawer, setShowAIDrawer] = useState(false);

  const filteredLogs = callLogs.filter(c =>
    c.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const allCalls = callLogs.length;
  const connected = callLogs.filter(c => c.status === 'completed').length;
  const missed = callLogs.filter(c => c.status === 'missed').length;

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden relative">
      {/* Floating New Call FAB */}
      {!showDialer && (
        <button
          onClick={() => setShowDialer(true)}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-accent hover:bg-accent-hover text-white shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        >
          <Phone className="w-5 h-5 fill-white" />
        </button>
      )}
      {showDialer && <DialerModal onClose={() => setShowDialer(false)} />}

      {/* KPI Row */}
      <div className="grid grid-cols-5 gap-3 shrink-0">
        {[
          { icon: Phone, label: 'Calls Today', value: String(allCalls), sub: 'vs 12 yesterday', color: 'text-accent', trend: 'up' },
          { icon: PhoneCall, label: 'Connected', value: String(connected), sub: `${Math.round(connected/allCalls*100)}% rate`, color: 'text-success', trend: 'up' },
          { icon: PhoneMissed, label: 'Missed', value: String(missed), sub: `${Math.round(missed/allCalls*100)}% rate`, color: 'text-error', trend: 'down' },
          { icon: Clock, label: 'Avg Duration', value: '10m 32s', sub: '2m 18s above target', color: 'text-info', trend: 'up' },
          { icon: TrendingUp, label: 'Revenue Influenced', value: '₹12.5L', sub: '5 deals touched', color: 'text-warning', trend: 'up' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-surface-card border border-border-default rounded-[12px] px-4 py-3 hover:shadow-[var(--shadow-card-hov)] transition-shadow">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-medium text-text-muted uppercase tracking-wider">{kpi.label}</span>
              <kpi.icon className={`w-3.5 h-3.5 ${kpi.color}`} />
            </div>
            <div className="text-lg font-bold text-text-primary">{kpi.value}</div>
            <div className="text-[9px] text-text-muted mt-0.5 flex items-center gap-1">
              {kpi.trend === 'up' ? <ArrowUpRight className="w-2.5 h-2.5 text-success" /> : <ArrowDownRight className="w-2.5 h-2.5 text-error" />}
              {kpi.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          {/* New Call Action dropdown */}
          <div className="relative group">
            <button className="bg-accent hover:bg-accent-hover text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm">
              <Phone className="w-3.5 h-3.5" /> New Call
              <ChevronDown className="w-3 h-3" />
            </button>
            <div className="absolute top-full left-0 mt-1 w-44 bg-surface-card border border-border-default rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
              {[
                { label: 'Outbound Call', icon: Phone },
                { label: 'Voicemail Drop', icon: Mic },
                { label: 'Schedule Callback', icon: Calendar },
                { label: 'WhatsApp Call', icon: MessageSquare },
              ].map(a => {
                const Icon = a.icon;
                return (
                  <button key={a.label} className="w-full flex items-center gap-2 px-3 py-2 text-[11px] text-text-primary hover:bg-surface-bg-alt transition-colors text-left">
                    <Icon className="w-3.5 h-3.5 text-icon" />
                    {a.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-[10px] text-text-muted font-medium">or</div>

          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-icon" />
            <input
              type="text"
              placeholder="Search calls..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-56 bg-surface-bg border border-border-default rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none focus:border-accent text-text-primary placeholder:text-text-muted"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAIDrawer(s => !s)}
            className={`text-[10px] font-semibold px-2.5 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 ${
              showAIDrawer
                ? 'bg-accent/10 text-accent border-accent/30'
                : 'bg-surface-bg border-border-default text-text-secondary hover:text-text-primary'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" /> AI Insights
          </button>
          <Filter className="w-3.5 h-3.5 text-icon cursor-pointer hover:text-text-primary" />
        </div>
      </div>

      {/* Main workspace: 50/50 */}
      <div className="flex-1 flex gap-5 overflow-hidden min-h-0">
        {/* Left: Active Call Workspace */}
        <div className="flex-1 bg-surface-card border border-border-default rounded-[12px] p-4 overflow-y-auto no-scrollbar">
          {isCallActive ? (
            <ActiveCallWorkspace onEnd={() => setIsCallActive(false)} />
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-text-primary">Call Workspace</h2>
                <span className="text-[9px] text-text-muted bg-surface-bg-alt px-2 py-0.5 rounded">Idle</span>
              </div>
              <IdleWorkspace />
            </>
          )}
        </div>

        {/* Right: Queue + Recent Calls */}
        <div className="w-[420px] shrink-0 flex flex-col gap-4 overflow-y-auto no-scrollbar">
          {/* Call Queue (expanded) */}
          <div className="bg-surface-card border border-border-default rounded-[12px] p-4 shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-accent" />
                <h3 className="text-xs font-bold text-text-primary">Call Queue</h3>
              </div>
              <span className="bg-accent/10 text-accent text-[9px] font-bold px-2 py-0.5 rounded">{callQueue.length} waiting</span>
            </div>
            <div className="space-y-2">
              {callQueue.map(q => (
                <div key={q.id} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-surface-bg-alt/50 transition-colors group">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-text-primary">{q.contact}</span>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                        q.priority === 'high' ? 'bg-error/10 text-error' :
                        q.priority === 'medium' ? 'bg-warning/10 text-warning' : 'bg-text-muted/10 text-text-muted'
                      }`}>{q.priority}</span>
                    </div>
                    <div className="flex items-center gap-2.5 mt-0.5 text-[9px] text-text-muted">
                      <span className="flex items-center gap-1"><Building2 className="w-2.5 h-2.5" />{q.company}</span>
                      <span className="flex items-center gap-1"><DollarSign className="w-2.5 h-2.5" />₹{(q.value / 100000).toFixed(1)}L</span>
                      <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{q.lastContacted}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsCallActive(true)}
                    className="opacity-0 group-hover:opacity-100 bg-accent hover:bg-accent-hover text-white text-[9px] font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" /> Call
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Calls Table */}
          <div className="flex-1 bg-surface-card border border-border-default rounded-[12px] overflow-hidden flex flex-col min-h-0">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-default shrink-0">
              <span className="text-[10px] font-bold text-text-primary">Recent Calls</span>
              <span className="text-[9px] text-text-muted">{filteredLogs.length} calls</span>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar">
              <table className="w-full text-[10px]">
                <thead className="text-[8px] text-text-muted uppercase tracking-wider sticky top-0 bg-surface-card z-10">
                  <tr className="border-b border-border-default/30">
                    <th className="text-left px-3 py-1.5 font-semibold">Contact</th>
                    <th className="text-left px-3 py-1.5 font-semibold">Duration</th>
                    <th className="text-left px-3 py-1.5 font-semibold">Sentiment</th>
                    <th className="text-left px-3 py-1.5 font-semibold">Outcome</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map(call => (
                    <React.Fragment key={call.id}>
                      <tr
                        className="border-b border-border-default/20 hover:bg-surface-bg-alt/50 cursor-pointer transition-colors"
                        onClick={() => setExpandedCall(expandedCall === call.id ? null : call.id)}
                      >
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center">
                              <User className="w-2.5 h-2.5 text-accent" />
                            </div>
                            <span className="font-semibold text-text-primary">{call.contact}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-text-secondary font-medium">{call.duration}</td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1">
                            <SentimentIcon s={call.sentiment} />
                            <span className="text-text-secondary capitalize">{call.sentiment}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                            call.outcome === 'contract_review' || call.outcome === 'demo_scheduled' || call.outcome === 'onboarding'
                              ? 'bg-success/10 text-success'
                              : call.outcome === 'objection'
                                ? 'bg-error/10 text-error'
                                : call.outcome === 'no_answer'
                                  ? 'bg-text-muted/10 text-text-muted'
                                  : 'bg-warning/10 text-warning'
                          }`}>{call.outcome.replace('_', ' ')}</span>
                        </td>
                      </tr>
                      {expandedCall === call.id && (
                        <tr>
                          <td colSpan={4} className="px-3 py-2.5 bg-surface-bg-alt/30 border-b border-border-default">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1.5 text-[9px] text-text-muted">
                                <Play className="w-2.5 h-2.5" /> Recording
                              </div>
                              <div className="flex items-center gap-2 flex-1 max-w-[120px]">
                                <div className="h-1 flex-1 bg-surface-bg-alt rounded-full overflow-hidden"><div className="bg-accent w-1/3 h-full rounded-full" /></div>
                              </div>
                              <div className="flex items-center gap-1.5 text-[9px] text-text-muted">
                                <ListChecks className="w-2.5 h-2.5" /> 2 follow-ups
                              </div>
                              <div className="flex items-center gap-1.5 text-[9px] text-accent">
                                <BrainCircuit className="w-2.5 h-2.5" /> AI summary
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights Drawer (collapsible overlay) */}
      {showAIDrawer && !isCallActive && (
        <div className="absolute bottom-4 right-4 w-80 bg-surface-card dark:bg-sidebar text-text-primary dark:text-white border-border-default dark:border-sidebar-hover rounded-[12px] p-4 shadow-xl z-30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-accent" />
              <h3 className="text-xs font-bold text-text-primary dark:text-white">AI Insights</h3>
            </div>
            <button onClick={() => setShowAIDrawer(false)} className="p-1 rounded hover:bg-white/5"><X className="w-3 h-3 text-text-secondary dark:text-sidebar-text" /></button>
          </div>
          <div className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/5 border border-white/5 rounded-lg p-2.5">
                <div className="text-[9px] font-semibold text-slate-300">Talk-to-Listen</div>
                <div className="text-base font-bold text-text-primary dark:text-white">40:60</div>
                <div className="text-[8px] text-text-secondary dark:text-sidebar-text">Great balance</div>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-lg p-2.5">
                <div className="text-[9px] font-semibold text-slate-300">Quality Score</div>
                <div className="text-base font-bold text-success">92</div>
                <div className="text-[8px] text-text-secondary dark:text-sidebar-text">Top 15%</div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-lg p-2.5">
              <div className="text-[9px] font-semibold text-slate-300 mb-1">Improvements</div>
              <ul className="space-y-0.5">
                <li className="text-[9px] text-text-secondary dark:text-sidebar-text flex items-start gap-1.5"><div className="w-1 h-1 rounded-full bg-accent mt-1 shrink-0" />Pause after discovery questions</li>
                <li className="text-[9px] text-text-secondary dark:text-sidebar-text flex items-start gap-1.5"><div className="w-1 h-1 rounded-full bg-accent mt-1 shrink-0" />Reduce filler words</li>
                <li className="text-[9px] text-text-secondary dark:text-sidebar-text flex items-start gap-1.5"><div className="w-1 h-1 rounded-full bg-accent mt-1 shrink-0" />Mirror customer's pace</li>
              </ul>
            </div>
            <div className="flex items-center justify-between text-[9px] text-text-muted dark:text-sidebar-text-muted pt-1">
              <span>Updated in real-time</span>
              <span className="text-accent cursor-pointer hover:underline">Full report →</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import {
  BrainCircuit, Sparkles, TrendingUp, Target, AlertTriangle, Zap, Clock,
  DollarSign, User, Building2, Phone, MessageSquare, Calendar,
  ArrowUpRight, ArrowDownRight, CheckCircle2, X, Copy, RefreshCw,
  BarChart3, Flame, Thermometer, Lightbulb, ChevronDown, ChevronUp,
  Send, Edit3, FileText, Bell, ToggleLeft, ToggleRight, ListChecks,
  ThumbsUp, ThumbsDown, Minus, Eye, Activity, Sliders,
} from 'lucide-react';

/* ---- Mock Data ---- */

const recommendations = [
  {
    id: 'r1', lead: 'Rajesh Kumar', company: 'Kumar Logistics', contact: '+91 98234 56789',
    value: 340000, confidence: 93, priority: 'critical' as const, dealStage: 'Negotiation',
    lastContact: '14 days ago', proposalViews: 4, sentiment: 'positive' as const,
    waRead: true, websiteVisits: 3, reasoning: 'No contact for 14 days. Proposal viewed 4 times. All WhatsApp messages read. High buying signals detected.',
    suggestedAction: 'Call Now', impact: '+28% conversion probability',
  },
  {
    id: 'r2', lead: 'Sneha Patel', company: 'Patel Pharma', contact: '+91 89123 45678',
    value: 180000, confidence: 87, priority: 'high' as const, dealStage: 'Proposal Sent',
    lastContact: '7 days ago', proposalViews: 2, sentiment: 'neutral' as const,
    waRead: true, websiteVisits: 1, reasoning: 'Proposal sent 7 days ago with 2 views. Customer opened all WhatsApp messages but hasn\'t responded.',
    suggestedAction: 'Send WhatsApp', impact: '+22% conversion probability',
  },
  {
    id: 'r3', lead: 'Dr. Priya Sharma', company: 'Sahyadri Healthcare', contact: '+91 65432 10987',
    value: 850000, confidence: 91, priority: 'critical' as const, dealStage: 'Contract Review',
    lastContact: '3 days ago', proposalViews: 0, sentiment: 'positive' as const,
    waRead: true, websiteVisits: 5, reasoning: 'Positive call sentiment detected. Website activity: pricing page visited 5 times. Best time to call: 2-4 PM.',
    suggestedAction: 'Schedule Meeting', impact: '+35% conversion probability',
  },
  {
    id: 'r4', lead: 'Amit Joshi', company: 'Joshi Enterprises', contact: '+91 79012 34567',
    value: 75000, confidence: 72, priority: 'medium' as const, dealStage: 'Discovery',
    lastContact: '5 days ago', proposalViews: 0, sentiment: 'neutral' as const,
    waRead: false, websiteVisits: 0, reasoning: 'Initial discovery completed. Low engagement signals. Consider re-engagement strategy.',
    suggestedAction: 'Send Proposal Reminder', impact: '+12% conversion probability',
  },
  {
    id: 'r5', lead: 'Pooja Singh', company: 'Singh Consulting', contact: '+91 78901 23456',
    value: 520000, confidence: 88, priority: 'high' as const, dealStage: 'Negotiation',
    lastContact: '2 days ago', proposalViews: 6, sentiment: 'positive' as const,
    waRead: true, websiteVisits: 4, reasoning: 'Competitor mentioned in last call. Proposal viewed 6 times — highest engagement. Urgent follow-up required to counter competitor.',
    suggestedAction: 'Call Now', impact: '+30% conversion probability',
  },
  {
    id: 'r6', lead: 'Deepak Verma', company: 'Verma Tech Solutions', contact: '+91 67890 12345',
    value: 950000, confidence: 95, priority: 'critical' as const, dealStage: 'Proposal Sent',
    lastContact: '1 day ago', proposalViews: 3, sentiment: 'positive' as const,
    waRead: true, websiteVisits: 7, reasoning: 'Maximum engagement across all channels. Decision maker viewed pricing page 7 times. Ready to close.',
    suggestedAction: 'Escalate Follow-Up', impact: '+40% conversion probability',
  },
  {
    id: 'r7', lead: 'Ananya Desai', company: 'Desai Textiles', contact: '+91 87654 32109',
    value: 150000, confidence: 76, priority: 'medium' as const, dealStage: 'Demo Completed',
    lastContact: '10 days ago', proposalViews: 1, sentiment: 'positive' as const,
    waRead: true, websiteVisits: 0, reasoning: 'Demo completed positively but no follow-up in 10 days. Single proposal view suggests hesitation.',
    suggestedAction: 'Send WhatsApp', impact: '+15% conversion probability',
  },
  {
    id: 'r8', lead: 'Rahul Kapoor', company: 'Kapoor Auto Parts', contact: '+91 76543 21098',
    value: 75000, confidence: 65, priority: 'low' as const, dealStage: 'Discovery',
    lastContact: '14 days ago', proposalViews: 0, sentiment: 'neutral' as const,
    waRead: false, websiteVisits: 0, reasoning: 'No response to 3 follow-ups. Re-engagement needed via different channel.',
    suggestedAction: 'Escalate Follow-Up', impact: '+8% conversion probability',
  },
];

const queueItems = recommendations.map((r, i) => ({
  id: `q${i}`, lead: r.lead, company: r.company, value: r.value,
  priority: r.priority, lastInteraction: r.lastContact, suggestedAction: r.suggestedAction,
  dueDate: ['Today', 'Tomorrow', 'Jul 20', 'Jul 22', 'Jul 25', 'Today', 'Jul 28', 'Jul 30'][i],
}));

const performanceMetrics = {
  successRate: 64,
  responseRate: 48,
  meetingsBooked: 18,
  dealsRevived: 7,
  revenueInfluenced: 4250000,
};

const insights = [
  { icon: Clock, text: 'Customers contacted within 24 hours convert 32% more often.', type: 'best-practice' as const },
  { icon: AlertTriangle, text: '3 high-value leads have not been contacted in 7+ days.', type: 'alert' as const },
  { icon: Calendar, text: 'Best calling window today: 2 PM – 4 PM.', type: 'tip' as const },
  { icon: MessageSquare, text: 'WhatsApp response rate (68%) is outperforming email (22%).', type: 'insight' as const },
];

const automations = [
  { id: 'a1', title: 'Auto WhatsApp Reminder', desc: 'Automatically send WhatsApp follow-up when a lead is inactive for 5 days.', icon: MessageSquare, active: false },
  { id: 'a2', title: 'Auto Task Creation', desc: 'Create follow-up tasks in CRM when call ends or meeting is scheduled.', icon: ListChecks, active: true },
  { id: 'a3', title: 'Auto Meeting Scheduling', desc: 'Let AI suggest and book meeting slots based on prospect availability.', icon: Calendar, active: false },
  { id: 'a4', title: 'Auto Deal Stage Updates', desc: 'Automatically move deals when prospect hits key engagement milestones.', icon: TrendingUp, active: false },
];

const styleOptions = ['Friendly', 'Professional', 'Urgent', 'Relationship Building', 'Negotiation'];

const waTemplates: Record<string, string> = {
  Friendly: 'Hey {name}, just checking in! Wanted to see if you had any questions about the proposal. Happy to hop on a quick call if that helps. 😊',
  Professional: 'Dear {name},\n\nFollowing up regarding the quotation we shared. Would you be available for a quick discussion this week?\n\nRegards,\nSarah',
  Urgent: 'Hi {name},\n\nFollowing up urgently on the proposal. We have a limited-time pricing window closing this Friday. Please confirm your interest at the earliest.',
  'Relationship Building': 'Hi {name},\n\nCame across this article on industry trends and thought of you. Also wanted to check if you\'d like to discuss the proposal over coffee this week?',
  Negotiation: 'Hi {name},\n\nI understand you\'re evaluating options. We\'d love the opportunity to address any concerns. Can we schedule a call to discuss terms?',
};

/* ---- Helpers ---- */

const SentimentIcon = ({ s }: { s: string }) =>
  s === 'positive' ? <ThumbsUp className="w-3 h-3 text-success" /> :
  s === 'negative' ? <ThumbsDown className="w-3 h-3 text-error" /> :
  <Minus className="w-3 h-3 text-text-muted" />;

const PriorityBadge = ({ p }: { p: string }) => {
  const m: Record<string, string> = { critical: 'bg-error/10 text-error', high: 'bg-warning/10 text-warning', medium: 'bg-info/10 text-info', low: 'bg-text-muted/10 text-text-muted' };
  return <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${m[p] || m.low}`}>{p}</span>;
};

/* ---- Section 4: WhatsApp Generator ---- */

function WhatsAppSection({ recommendation }: { recommendation: typeof recommendations[0] }) {
  const [style, setStyle] = useState('Friendly');
  const [copied, setCopied] = useState(false);

  const msg = (waTemplates[style] || waTemplates.Friendly).replace(/\{name\}/g, recommendation.lead.split(' ')[0]);

  return (
    <div className="bg-surface-card border border-border-default rounded-[12px] p-4">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="w-4 h-4 text-success" />
        <h3 className="text-xs font-bold text-text-primary">AI WhatsApp Follow-Up</h3>
        <span className="text-[8px] bg-success/10 text-success font-bold px-2 py-0.5 rounded ml-auto">For {recommendation.lead}</span>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[9px] text-text-muted">Style:</span>
        <div className="flex flex-wrap gap-1">
          {styleOptions.map(s => (
            <button key={s} onClick={() => setStyle(s)}
              className={`text-[9px] font-medium px-2 py-1 rounded-md transition-colors ${style === s ? 'bg-accent text-white' : 'bg-surface-bg-alt text-text-secondary hover:bg-surface-bg'}`}
            >{s}</button>
          ))}
        </div>
      </div>
      <div className="bg-[#dcf8c6] dark:bg-green-800/30 rounded-lg p-3 mb-3">
        <p className="text-xs text-gray-800 dark:text-gray-100 leading-relaxed whitespace-pre-line">{msg}</p>
        <div className="text-[8px] text-gray-500 dark:text-gray-400 mt-1 text-right">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="bg-success hover:bg-success/80 text-white text-[9px] font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"><Send className="w-3 h-3" /> Send via WhatsApp</button>
        <button className="border border-border-default text-text-secondary hover:text-text-primary text-[9px] font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"><Edit3 className="w-3 h-3" /> Edit</button>
        <button onClick={() => { navigator.clipboard.writeText(msg); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          className="border border-border-default text-text-secondary hover:text-text-primary text-[9px] font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
          {copied ? <CheckCircle2 className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <button className="border border-border-default text-text-secondary hover:text-text-primary text-[9px] font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Regenerate</button>
      </div>
    </div>
  );
}

/* ============================
   Main Component
   ============================ */

export default function FollowUpSuggestionsView() {
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [expandedRecs, setExpandedRecs] = useState<string[]>([]);
  const [waExpanded, setWaExpanded] = useState<string | null>(null);
  const [toggledAutos, setToggledAutos] = useState<string[]>(['a2']);

  const toggleRec = (id: string) =>
    setExpandedRecs(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const filteredQueue = priorityFilter === 'all'
    ? queueItems
    : queueItems.filter(q => q.priority === priorityFilter);

  const totalRevenue = recommendations.reduce((s, r) => s + r.value, 0);

  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="flex flex-col gap-5 max-w-7xl mx-auto pb-8">
        {/* ========== Section 1: KPI Overview ========== */}
        <div className="grid grid-cols-5 gap-3">
          {[
            { icon: Clock, label: 'Follow-Ups Due Today', value: '14', sub: '+3 vs yesterday', color: 'text-accent', trend: 'up' },
            { icon: Flame, label: 'High Priority', value: '8', sub: 'Critical: 3', color: 'text-error', trend: 'up' },
            { icon: Thermometer, label: 'At-Risk Opportunities', value: '4', sub: '₹18.5L total value', color: 'text-warning', trend: 'down' },
            { icon: Sparkles, label: 'AI Opportunities Found', value: '6', sub: '3 new this week', color: 'text-success', trend: 'up' },
            { icon: DollarSign, label: 'Pipeline Value', value: `₹${(totalRevenue / 100000).toFixed(1)}L`, sub: '8 active deals', color: 'text-info', trend: 'up' },
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

        {/* ========== Section 2: AI Recommended Actions ========== */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-bold text-text-primary">AI Recommended Actions</h2>
              <span className="text-[9px] bg-accent/10 text-accent font-bold px-2 py-0.5 rounded">{recommendations.length} actions</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-text-muted">Sorted by impact</span>
              <Sliders className="w-3 h-3 text-icon cursor-pointer hover:text-text-primary" />
            </div>
          </div>

          <div className="space-y-2">
            {recommendations.map((rec) => {
              const isExpanded = expandedRecs.includes(rec.id);
              return (
                <div key={rec.id} className="bg-surface-card border border-border-default rounded-[10px] overflow-hidden">
                  <button onClick={() => toggleRec(rec.id)} className="w-full text-left">
                    <div className="px-4 py-3 hover:bg-surface-bg-alt/20 transition-colors">
                      <div className="flex items-center gap-4">
                        {/* Left: Priority + Confidence */}
                        <div className="flex items-center gap-2 w-16 shrink-0">
                          <PriorityBadge p={rec.priority} />
                        </div>
                        <div className="w-12 text-center shrink-0">
                          <div className="text-xs font-bold text-accent">{rec.confidence}%</div>
                          <div className="text-[7px] text-text-muted uppercase">AI Score</div>
                        </div>
                        {/* Center: Lead info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-text-primary">{rec.lead}</span>
                            <SentimentIcon s={rec.sentiment} />
                            <span className="text-[9px] text-text-muted">· {rec.company}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-[9px] text-text-muted">
                            <span className="flex items-center gap-1"><DollarSign className="w-2.5 h-2.5" />₹{(rec.value / 100000).toFixed(1)}L</span>
                            <span>· {rec.dealStage}</span>
                            <span>· No contact for {rec.lastContact}</span>
                          </div>
                        </div>
                        {/* Right: Suggested action + impact */}
                        <div className="text-right shrink-0">
                          <div className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                            rec.suggestedAction === 'Call Now' ? 'bg-accent/10 text-accent' :
                            rec.suggestedAction === 'Send WhatsApp' ? 'bg-success/10 text-success' :
                            rec.suggestedAction === 'Schedule Meeting' ? 'bg-info/10 text-info' :
                            rec.suggestedAction === 'Escalate Follow-Up' ? 'bg-error/10 text-error' :
                            'bg-warning/10 text-warning'
                          }`}>{rec.suggestedAction}</div>
                          <div className="text-[8px] text-success font-semibold mt-0.5">{rec.impact}</div>
                        </div>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-icon" /> : <ChevronDown className="w-3.5 h-3.5 text-icon" />}
                      </div>
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0 border-t border-border-default/50">
                      <div className="mt-3 grid grid-cols-2 gap-4">
                        {/* Left: Reasoning */}
                        <div>
                          <div className="flex items-center gap-1.5 mb-2">
                            <BrainCircuit className="w-3 h-3 text-accent" />
                            <span className="text-[9px] font-semibold text-text-primary">AI Reasoning</span>
                          </div>
                          <p className="text-[10px] text-text-secondary leading-relaxed">{rec.reasoning}</p>
                          <div className="grid grid-cols-3 gap-2 mt-2">
                            <div className="bg-surface-bg-alt/50 border border-border-default/50 rounded p-2 text-center">
                              <div className="text-[9px] font-bold text-text-primary">{rec.proposalViews}</div>
                              <div className="text-[7px] text-text-muted">Proposal Views</div>
                            </div>
                            <div className="bg-surface-bg-alt/50 border border-border-default/50 rounded p-2 text-center">
                              <div className="text-[9px] font-bold text-text-primary">{rec.websiteVisits}</div>
                              <div className="text-[7px] text-text-muted">Web Visits</div>
                            </div>
                            <div className="bg-surface-bg-alt/50 border border-border-default/50 rounded p-2 text-center">
                              <div className={`text-[9px] font-bold ${rec.waRead ? 'text-success' : 'text-text-muted'}`}>
                                {rec.waRead ? 'Read' : 'Unread'}
                              </div>
                              <div className="text-[7px] text-text-muted">WhatsApp</div>
                            </div>
                          </div>
                        </div>
                        {/* Right: Action buttons + WhatsApp Generator */}
                        <div>
                          <div className="flex items-center gap-1.5 mb-2">
                            <Zap className="w-3 h-3 text-accent" />
                            <span className="text-[9px] font-semibold text-text-primary">Actions</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            <button className="bg-accent hover:bg-accent-hover text-white text-[9px] font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"><Phone className="w-3 h-3" /> Call Now</button>
                            <button onClick={() => setWaExpanded(waExpanded === rec.id ? null : rec.id)}
                              className={`text-[9px] font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 border ${
                                waExpanded === rec.id ? 'bg-success/10 text-success border-success/30' : 'border-border-default text-text-secondary hover:text-text-primary'
                              }`}><MessageSquare className="w-3 h-3" /> Send WhatsApp</button>
                            <button className="border border-border-default text-text-secondary hover:text-text-primary text-[9px] font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"><Calendar className="w-3 h-3" /> Schedule</button>
                            <button className="border border-border-default text-text-secondary hover:text-text-primary text-[9px] font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"><FileText className="w-3 h-3" /> Create Task</button>
                            <button className="border border-border-default text-text-secondary hover:text-text-primary text-[9px] font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"><X className="w-3 h-3" /> Dismiss</button>
                          </div>
                          {waExpanded === rec.id && <WhatsAppSection recommendation={rec} />}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ========== Section 3 + 4 + 5 + 6 + 7 in 2-column layout ========== */}
        <div className="grid grid-cols-3 gap-4">
          {/* Col 1-2: Priority Queue + WhatsApp Generator */}
          <div className="col-span-2 space-y-4">
            {/* Section 3: Priority Follow-Up Queue */}
            <div className="bg-surface-card border border-border-default rounded-[12px] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
                <div className="flex items-center gap-2">
                  <ListChecks className="w-4 h-4 text-accent" />
                  <h3 className="text-xs font-bold text-text-primary">Priority Follow-Up Queue</h3>
                </div>
                <div className="flex items-center gap-2">
                  {['all', 'critical', 'high', 'medium', 'low'].map(p => (
                    <button key={p} onClick={() => setPriorityFilter(p)}
                      className={`text-[9px] font-semibold px-2 py-1 rounded-lg capitalize transition-colors ${
                        priorityFilter === p ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary'
                      }`}>{p}</button>
                  ))}
                </div>
              </div>
              <table className="w-full text-[10px]">
                <thead className="text-[8px] text-text-muted uppercase tracking-wider bg-surface-bg-alt/30">
                  <tr>
                    <th className="text-left px-3 py-2 font-semibold">Priority</th>
                    <th className="text-left px-3 py-2 font-semibold">Lead</th>
                    <th className="text-left px-3 py-2 font-semibold">Company</th>
                    <th className="text-left px-3 py-2 font-semibold">Value</th>
                    <th className="text-left px-3 py-2 font-semibold">Last Interaction</th>
                    <th className="text-left px-3 py-2 font-semibold">Suggested Action</th>
                    <th className="text-left px-3 py-2 font-semibold">Due</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default/20">
                  {filteredQueue.map(q => (
                    <tr key={q.id} className="hover:bg-surface-bg-alt/30 transition-colors">
                      <td className="px-3 py-2.5"><PriorityBadge p={q.priority} /></td>
                      <td className="px-3 py-2.5 font-semibold text-text-primary">{q.lead}</td>
                      <td className="px-3 py-2.5 text-text-secondary">{q.company}</td>
                      <td className="px-3 py-2.5 text-text-primary font-semibold">₹{(q.value / 100000).toFixed(1)}L</td>
                      <td className="px-3 py-2.5 text-text-secondary">{q.lastInteraction}</td>
                      <td className="px-3 py-2.5">
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                          q.suggestedAction === 'Call Now' ? 'bg-accent/10 text-accent' :
                          q.suggestedAction === 'Send WhatsApp' ? 'bg-success/10 text-success' :
                          q.suggestedAction === 'Schedule Meeting' ? 'bg-info/10 text-info' :
                          'bg-error/10 text-error'
                        }`}>{q.suggestedAction}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`font-semibold ${q.dueDate === 'Today' ? 'text-error' : q.dueDate === 'Tomorrow' ? 'text-warning' : 'text-text-secondary'}`}>
                          {q.dueDate}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Section 7: Smart Automation Suggestions */}
            <div className="bg-surface-card border border-border-default rounded-[12px] p-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-warning" />
                <h3 className="text-xs font-bold text-text-primary">Smart Automation Suggestions</h3>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {automations.map(a => {
                  const Icon = a.icon;
                  const isActive = toggledAutos.includes(a.id);
                  return (
                    <div key={a.id} className={`border rounded-[10px] p-3 transition-all ${isActive ? 'border-accent/30 bg-accent/5' : 'border-border-default hover:border-border-default/70'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isActive ? 'bg-accent/20' : 'bg-surface-bg-alt'}`}>
                          <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-accent' : 'text-icon'}`} />
                        </div>
                        <button onClick={() => setToggledAutos(prev => isActive ? prev.filter(i => i !== a.id) : [...prev, a.id])}>
                          {isActive
                            ? <ToggleRight className="w-5 h-5 text-accent" />
                            : <ToggleLeft className="w-5 h-5 text-icon hover:text-text-primary" />
                          }
                        </button>
                      </div>
                      <div className="text-[10px] font-bold text-text-primary mb-0.5">{a.title}</div>
                      <div className="text-[8px] text-text-muted leading-relaxed">{a.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Col 3: Performance + Insights */}
          <div className="space-y-4">
            {/* Section 5: Follow-Up Performance */}
            <div className="bg-surface-card border border-border-default rounded-[12px] p-4">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-info" />
                <h3 className="text-xs font-bold text-text-primary">Follow-Up Performance</h3>
              </div>
              <div className="space-y-3">
                {/* Success Rate */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] text-text-muted">Success Rate</span>
                    <span className="text-[10px] font-bold text-text-primary">{performanceMetrics.successRate}%</span>
                  </div>
                  <div className="w-full bg-surface-bg-alt h-1.5 rounded-full overflow-hidden">
                    <div className="bg-success h-full rounded-full" style={{ width: `${performanceMetrics.successRate}%` }} />
                  </div>
                </div>
                {/* Response Rate */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] text-text-muted">Response Rate</span>
                    <span className="text-[10px] font-bold text-text-primary">{performanceMetrics.responseRate}%</span>
                  </div>
                  <div className="w-full bg-surface-bg-alt h-1.5 rounded-full overflow-hidden">
                    <div className="bg-accent h-full rounded-full" style={{ width: `${performanceMetrics.responseRate}%` }} />
                  </div>
                </div>
                {/* Metrics grid */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="bg-surface-bg-alt/50 border border-border-default/50 rounded-lg p-2.5 text-center">
                    <div className="text-xs font-bold text-text-primary">{performanceMetrics.meetingsBooked}</div>
                    <div className="text-[7px] text-text-muted">Meetings Booked</div>
                  </div>
                  <div className="bg-surface-bg-alt/50 border border-border-default/50 rounded-lg p-2.5 text-center">
                    <div className="text-xs font-bold text-success">{performanceMetrics.dealsRevived}</div>
                    <div className="text-[7px] text-text-muted">Deals Revived</div>
                  </div>
                  <div className="bg-surface-bg-alt/50 border border-border-default/50 rounded-lg p-2.5 text-center">
                    <div className="text-xs font-bold text-info">₹{(performanceMetrics.revenueInfluenced / 100000).toFixed(1)}L</div>
                    <div className="text-[7px] text-text-muted">Revenue</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 6: AI Insights Panel */}
            <div className="bg-surface-card dark:bg-sidebar text-text-primary dark:text-white border-border-default dark:border-sidebar-hover rounded-[12px] p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl -translate-y-1/4 translate-x-1/4 pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-accent" />
                  <h3 className="text-xs font-bold text-text-primary dark:text-white">AI Insights</h3>
                </div>
                <div className="space-y-2.5">
                  {insights.map((insight, i) => {
                    const Icon = insight.icon;
                    const typeStyles: Record<string, string> = {
                      'best-practice': 'bg-info/10 border-info/20',
                      'alert': 'bg-warning/10 border-warning/20',
                      'tip': 'bg-accent/10 border-accent/20',
                      'insight': 'bg-success/10 border-success/20',
                    };
                    return (
                      <div key={i} className={`${typeStyles[insight.type]} border rounded-lg p-2.5`}>
                        <div className="flex items-start gap-2">
                          <Icon className="w-3.5 h-3.5 mt-0.5 shrink-0 text-current" />
                          <p className="text-[10px] text-text-secondary dark:text-sidebar-text font-medium leading-relaxed">{insight.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[9px] text-text-muted dark:text-sidebar-text-muted">
                  <span>Updated 2 min ago</span>
                  <span className="text-accent cursor-pointer hover:underline">View all insights</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

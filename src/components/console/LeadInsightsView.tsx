'use client';

import React, { useState } from 'react';
import {
  BrainCircuit, Sparkles, TrendingUp, Target, AlertTriangle, Zap, Clock,
  DollarSign, User, Building2, Phone, MessageSquare, Calendar,
  ArrowUpRight, ArrowDownRight, CheckCircle2, XCircle, AlertCircle,
  BarChart3, PieChart, Activity, Flame, Thermometer, Eye,
  ChevronDown, ChevronUp, Lightbulb, Filter as FilterIcon,
} from 'lucide-react';

/* ---- Mock Data ---- */

const rankedLeads = [
  { id: 'l1', name: 'Sahyadri Healthcare', contact: 'Dr. Priya Sharma', value: 850000, stage: 'Contract Review', aiScore: 94, probability: 92, reasoning: 'Strong product-market fit. Compliance features directly address their HIPAA requirements. CEO champion engaged.' },
  { id: 'l2', name: 'NovaTech Software', contact: 'Arun Nair', value: 1200000, stage: 'Proposal Sent', aiScore: 87, probability: 78, reasoning: 'Enterprise license renewal. Budget approved. Timeline alignment needed for Q3 implementation.' },
  { id: 'l3', name: 'ABC Metals & Forgings', contact: 'Vikram Mehta', value: 450000, stage: 'Demo Completed', aiScore: 82, probability: 71, reasoning: 'ERP integration demo completed positively. Competitor evaluation in progress — urgency high.' },
  { id: 'l4', name: 'Desai Textiles', contact: 'Ananya Desai', value: 150000, stage: 'Discovery', aiScore: 76, probability: 65, reasoning: 'Initial discovery positive. Decision maker engaged. Need to present competitive pricing.' },
  { id: 'l5', name: 'Apex Educational Solutions', contact: 'Neha Gupta', value: 250000, stage: 'Onboarding', aiScore: 73, probability: 68, reasoning: 'In onboarding phase. Expansion opportunity for additional modules. Low churn risk.' },
];

const attentionLeads = [
  { name: 'Kapoor Auto Parts', contact: 'Rahul Kapoor', value: 75000, inactive: 14, issue: 'No response to 3 follow-ups', action: 'Try WhatsApp outreach with case study', severity: 'high' as const },
  { name: 'Horizon Real Estate', contact: 'Emily Davis', value: 320000, inactive: 9, issue: 'Stalled at proposal stage', action: 'Schedule value-based ROI review call', severity: 'medium' as const },
  { name: 'Patel Pharma', contact: 'Sneha Patel', value: 180000, inactive: 7, issue: 'Missed follow-up commitment', action: 'Send personalized lab efficiency report', severity: 'medium' as const },
  { name: 'Singh Consulting', contact: 'Pooja Singh', value: 520000, inactive: 5, issue: 'Competitor presented alternative', action: 'Schedule executive meeting ASAP', severity: 'high' as const },
];

const recommendations = [
  { icon: Clock, title: 'Best time to call', detail: '2-4 PM has 73% higher connect rate', action: 'Schedule calls in this window' },
  { icon: Target, title: 'Next best action: Vikram Mehta', detail: 'Sent proposal 5 days ago — follow up with case study', action: 'Send case study' },
  { icon: Flame, title: 'Hot lead: Sahyadri Healthcare', detail: '94% AI match — close probability 92%', action: 'Prioritize contract review' },
  { icon: Activity, title: 'Win rate optimization', detail: 'Stage 2→3 conversion dropped 8% this quarter', action: 'Review discovery process' },
];

/* ---- Sub-components ---- */

function LeadCard({ lead, rank }: { lead: typeof rankedLeads[0]; rank: number }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-surface-card border border-border-default rounded-[10px] overflow-hidden">
      <button onClick={() => setExpanded(s => !s)} className="w-full text-left px-4 py-3 hover:bg-surface-bg-alt/30 transition-colors">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 w-8">
            <span className="text-[10px] font-bold text-text-muted">#{rank}</span>
            {rank <= 2 && <Flame className="w-3.5 h-3.5 text-warning" />}
          </div>
          <div className="w-14 text-center">
            <div className="text-xs font-bold text-accent">{lead.aiScore}%</div>
            <div className="text-[7px] text-text-muted uppercase">AI Score</div>
          </div>
          <div className="w-14 text-center">
            <div className="text-xs font-bold text-success">{lead.probability}%</div>
            <div className="text-[7px] text-text-muted uppercase">Close Prob</div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-text-primary">{lead.name}</span>
              <span className="text-[9px] text-text-muted">· {lead.stage}</span>
            </div>
            <div className="text-[9px] text-text-muted flex items-center gap-1">
              <User className="w-2.5 h-2.5" />{lead.contact}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-text-primary">₹{(lead.value / 100000).toFixed(1)}L</div>
            <div className="text-[7px] text-text-muted">Deal Value</div>
          </div>
          {expanded ? <ChevronUp className="w-3.5 h-3.5 text-icon" /> : <ChevronDown className="w-3.5 h-3.5 text-icon" />}
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-3 pt-0 border-t border-border-default/50">
          <div className="flex items-start gap-2 mt-2.5">
            <BrainCircuit className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
            <p className="text-[10px] text-text-secondary leading-relaxed">{lead.reasoning}</p>
          </div>
          <div className="flex gap-2 mt-2">
            <button className="text-[9px] font-semibold bg-accent/10 text-accent px-3 py-1.5 rounded-lg hover:bg-accent/20 transition-colors">Engage Now</button>
            <button className="text-[9px] font-semibold bg-surface-bg-alt text-text-secondary px-3 py-1.5 rounded-lg hover:bg-surface-bg transition-colors">View Profile</button>
            <button className="text-[9px] font-semibold bg-success/10 text-success px-3 py-1.5 rounded-lg hover:bg-success/20 transition-colors">Move Stage</button>
          </div>
        </div>
      )}
    </div>
  );
}

function AttentionCard({ item }: { item: typeof attentionLeads[0] }) {
  return (
    <div className="flex items-start gap-3 py-2.5 px-3 rounded-lg hover:bg-surface-bg-alt/50 transition-colors group">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
        item.severity === 'high' ? 'bg-error/10' : 'bg-warning/10'
      }`}>
        <AlertCircle className={`w-3 h-3 ${item.severity === 'high' ? 'text-error' : 'text-warning'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-text-primary">{item.name}</span>
          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
            item.severity === 'high' ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'
          }`}>{item.severity}</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5 text-[9px] text-text-muted">
          <span>{item.contact}</span>
          <span>·</span>
          <span>₹{(item.value / 100000).toFixed(1)}L</span>
          <span>·</span>
          <span className={item.inactive >= 7 ? 'text-error' : 'text-text-muted'}>{item.inactive}d inactive</span>
        </div>
        <div className="text-[9px] text-text-secondary mt-0.5">{item.issue}</div>
        <div className="flex items-center gap-1 mt-1">
          <Zap className="w-2.5 h-2.5 text-accent" />
          <span className="text-[9px] font-medium text-accent">{item.action}</span>
        </div>
      </div>
      <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-1.5 rounded-md bg-surface-bg-alt hover:bg-surface-bg text-text-secondary transition-colors"><Phone className="w-3 h-3" /></button>
        <button className="p-1.5 rounded-md bg-surface-bg-alt hover:bg-surface-bg text-text-secondary transition-colors"><MessageSquare className="w-3 h-3" /></button>
      </div>
    </div>
  );
}

export default function LeadInsightsView() {
  const totalPotential = rankedLeads.reduce((s, l) => s + l.value, 0);
  const largestDeal = Math.max(...rankedLeads.map(l => l.value));
  const fastestGrowth = 'Apex Educational Solutions';

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-3 shrink-0">
        {[
          { icon: Flame, label: 'Hot Leads', value: '12', sub: '+3 this week', color: 'text-error', trend: 'up' },
          { icon: Thermometer, label: 'At Risk Leads', value: '4', sub: '-2 from last week', color: 'text-warning', trend: 'down' },
          { icon: CheckCircle2, label: 'Likely to Close', value: '8', sub: 'Avg 78% probability', color: 'text-success', trend: 'up' },
          { icon: AlertCircle, label: 'Need Follow-up', value: '6', sub: '3 overdue', color: 'text-info', trend: 'up' },
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

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-3 gap-4 overflow-hidden min-h-0" style={{ gridTemplateRows: '1fr auto' }}>
        {/* Left: AI Lead Prioritization (spans 2 cols, full height) */}
        <div className="col-span-2 row-span-1 bg-surface-card border border-border-default rounded-[12px] flex flex-col overflow-hidden min-h-0">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-default shrink-0">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-accent" />
              <h2 className="text-xs font-bold text-text-primary">AI Lead Prioritization</h2>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-[9px] font-medium text-accent hover:underline">View all</button>
              <FilterIcon className="w-3 h-3 text-icon cursor-pointer hover:text-text-primary" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 p-4 pt-3">
            {rankedLeads.map((lead, i) => (
              <LeadCard key={lead.id} lead={lead} rank={i + 1} />
            ))}
          </div>
        </div>

        {/* Right Top: Leads Requiring Attention */}
        <div className="col-span-1 row-span-1 bg-surface-card border border-border-default rounded-[12px] flex flex-col overflow-hidden min-h-0">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-default shrink-0">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <h2 className="text-xs font-bold text-text-primary">Needs Attention</h2>
            </div>
            <span className="text-[9px] bg-warning/10 text-warning font-bold px-2 py-0.5 rounded">{attentionLeads.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-border-default/30">
            {attentionLeads.map(item => (
              <AttentionCard key={item.name} item={item} />
            ))}
          </div>
        </div>

        {/* Bottom Left: Revenue Opportunities */}
        <div className="col-span-1 bg-surface-card border border-border-default rounded-[12px] p-4">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-4 h-4 text-success" />
            <h2 className="text-xs font-bold text-text-primary">Revenue Opportunities</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-surface-bg-alt/50 border border-border-default/50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-text-primary">₹{(totalPotential / 100000).toFixed(1)}L</div>
              <div className="text-[8px] text-text-muted mt-0.5">Potential Revenue</div>
            </div>
            <div className="bg-surface-bg-alt/50 border border-border-default/50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-accent">₹{(largestDeal / 100000).toFixed(1)}L</div>
              <div className="text-[8px] text-text-muted mt-0.5">Largest Opportunity</div>
            </div>
            <div className="bg-surface-bg-alt/50 border border-border-default/50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-success">{fastestGrowth}</div>
              <div className="text-[8px] text-text-muted mt-0.5">Fastest Growing</div>
            </div>
          </div>
        </div>

        {/* Bottom Middle: AI Recommendations */}
        <div className="col-span-1 bg-surface-card border border-border-default rounded-[12px] p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-accent" />
            <h2 className="text-xs font-bold text-text-primary">AI Recommendations</h2>
          </div>
          <div className="space-y-2">
            {recommendations.map(r => {
              const Icon = r.icon;
              return (
                <div key={r.title} className="flex items-start gap-2.5 py-2 px-2.5 rounded-lg hover:bg-surface-bg-alt/50 transition-colors group cursor-pointer">
                  <div className="w-6 h-6 rounded-md bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-3 h-3 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-semibold text-text-primary">{r.title}</div>
                    <div className="text-[9px] text-text-muted mt-0.5">{r.detail}</div>
                    <div className="text-[9px] font-medium text-accent mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">{r.action} →</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Right: Pipeline Health */}
        <div className="col-span-1 bg-surface-card border border-border-default rounded-[12px] p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-info" />
            <h2 className="text-xs font-bold text-text-primary">Pipeline Health</h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-surface-bg-alt/50 border border-border-default/50 rounded-lg p-2.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] text-text-muted">Conversion</span>
                <span className="text-[10px] font-bold text-text-primary">34%</span>
              </div>
              <div className="w-full bg-surface-bg-alt h-1.5 rounded-full overflow-hidden"><div className="bg-success h-full rounded-full" style={{ width: '34%' }} /></div>
              <div className="text-[8px] text-text-muted mt-0.5">+2% vs last month</div>
            </div>
            <div className="bg-surface-bg-alt/50 border border-border-default/50 rounded-lg p-2.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] text-text-muted">Win Rate</span>
                <span className="text-[10px] font-bold text-text-primary">28%</span>
              </div>
              <div className="w-full bg-surface-bg-alt h-1.5 rounded-full overflow-hidden"><div className="bg-accent h-full rounded-full" style={{ width: '28%' }} /></div>
              <div className="text-[8px] text-text-muted mt-0.5">Industry avg: 22%</div>
            </div>
            <div className="col-span-2 bg-surface-card dark:bg-sidebar rounded-lg p-3 text-text-primary dark:text-white">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] text-text-secondary dark:text-sidebar-text font-medium">Stage Drop-offs</span>
                <Eye className="w-3 h-3 text-text-muted dark:text-sidebar-text-muted" />
              </div>
              <div className="space-y-1.5 mt-1.5">
                {[
                  { stage: 'Discovery → Demo', drop: 18 },
                  { stage: 'Demo → Proposal', drop: 24 },
                  { stage: 'Proposal → Negotiation', drop: 32 },
                  { stage: 'Negotiation → Closed', drop: 15 },
                ].map(s => (
                  <div key={s.stage} className="flex items-center gap-2">
                    <span className="text-[8px] text-text-secondary dark:text-sidebar-text font-medium w-36 shrink-0">{s.stage}</span>
                    <div className="flex-1 bg-white/10 h-1 rounded-full overflow-hidden">
                      <div className="bg-warning h-full rounded-full" style={{ width: `${s.drop}%` }} />
                    </div>
                    <span className="text-[8px] font-bold text-warning">{s.drop}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-span-2 bg-surface-bg-alt/50 border border-border-default/50 rounded-lg p-2.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] font-medium text-text-muted">Top Sources by Win Rate</span>
              </div>
              <div className="space-y-1">
                {[
                  { source: 'WhatsApp Inbound', rate: 42 },
                  { source: 'Referral', rate: 38 },
                  { source: 'Website', rate: 24 },
                  { source: 'Cold Call', rate: 12 },
                ].map(s => (
                  <div key={s.source} className="flex items-center gap-2">
                    <span className="text-[9px] text-text-secondary w-28">{s.source}</span>
                    <div className="flex-1 bg-surface-bg-alt h-1 rounded-full overflow-hidden">
                      <div className="bg-info h-full rounded-full" style={{ width: `${s.rate}%` }} />
                    </div>
                    <span className="text-[9px] font-bold text-text-primary">{s.rate}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



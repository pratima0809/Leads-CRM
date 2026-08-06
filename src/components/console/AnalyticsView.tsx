'use client';

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import {
  TrendingUp, DollarSign, Target, Users, Activity, Calendar, Download,
  BrainCircuit, Sparkles, Zap, Clock, Phone, MessageSquare, CheckCircle2,
  ArrowUpRight, ArrowDownRight, Flame, Eye, FileText, AlertTriangle,
  Filter, ChevronDown, Building2,
} from 'lucide-react';

/* ---- Mock Data ---- */

const revenueData = [
  { month: 'Feb', actual: 28, forecast: 30 },
  { month: 'Mar', actual: 32, forecast: 31 },
  { month: 'Apr', actual: 35, forecast: 34 },
  { month: 'May', actual: 38, forecast: 37 },
  { month: 'Jun', actual: 42, forecast: 40 },
  { month: 'Jul', actual: 45, forecast: 48 },
];

const pipelineStages = [
  { name: 'Leads', count: 128, value: 32000000, conversion: 100 },
  { name: 'Qualified', count: 64, value: 18500000, conversion: 50, dropoff: 50 },
  { name: 'Proposal', count: 28, value: 12400000, conversion: 22, dropoff: 56 },
  { name: 'Negotiation', count: 12, value: 6800000, conversion: 9, dropoff: 57 },
  { name: 'Won', count: 8, value: 4200000, conversion: 6, dropoff: 33 },
];

const leadSources = [
  { name: 'WhatsApp', leads: 64, convRate: 31, revenue: 1850000, cpl: 120 },
  { name: 'IndiaMART', leads: 92, convRate: 12, revenue: 980000, cpl: 85 },
  { name: 'Website', leads: 78, convRate: 18, revenue: 1240000, cpl: 45 },
  { name: 'Google Ads', leads: 56, convRate: 14, revenue: 720000, cpl: 240 },
  { name: 'Referrals', leads: 32, convRate: 42, revenue: 2100000, cpl: 0 },
  { name: 'Direct', leads: 24, convRate: 28, revenue: 890000, cpl: 0 },
];

const teamMembers = [
  { name: 'Sarah Johnson', revenue: 1850000, deals: 5, winRate: 63, calls: 84, meetings: 22 },
  { name: 'Arun Patel', revenue: 1420000, deals: 4, winRate: 52, calls: 72, meetings: 18 },
  { name: 'Priya Sharma', revenue: 980000, deals: 3, winRate: 48, calls: 65, meetings: 15 },
  { name: 'Rajesh Verma', revenue: 720000, deals: 2, winRate: 35, calls: 48, meetings: 10 },
  { name: 'Ananya Gupta', revenue: 560000, deals: 2, winRate: 32, calls: 52, meetings: 8 },
];

const dealMetrics = {
  largestDeal: 1200000,
  fastestClosed: 14,
  longestOpen: 87,
  avgCycle: 38,
};

const activityCorrelation = [
  { activity: 'Calls Made', count: 42, revenue: 3200000 },
  { activity: 'Meetings Held', count: 18, revenue: 2800000 },
  { activity: 'WhatsApp Sent', count: 156, revenue: 2100000 },
  { activity: 'Tasks Completed', count: 34, revenue: 1800000 },
];

const insights = [
  { icon: Target, title: 'Deals with 3+ meetings close 42% more often.', type: 'best-practice' as const },
  { icon: Clock, title: 'Following up within 24 hours increases conversion by 28%.', type: 'tip' as const },
  { icon: MessageSquare, title: 'WhatsApp leads are generating the highest ROI this month.', type: 'insight' as const },
  { icon: Flame, title: '4 high-value deals are showing strong buying signals.', type: 'alert' as const },
];

const aiActions = [
  { lead: 'Rajesh Kumar', company: 'Kumar Logistics', action: 'Contact today', impact: '+₹4.5L', urgency: 'high' as const },
  { lead: 'Neha Gupta', company: 'Apex Educational Solutions', action: 'Schedule follow-up', impact: '+18% close probability', urgency: 'medium' as const },
  { lead: 'Arun Nair', company: 'NovaTech Software', action: 'Review stalled proposal', impact: '+₹12L potential', urgency: 'high' as const },
];

/* ---- Helpers ---- */

function formatCurrency(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${(n / 1000).toFixed(0)}K`;
}

function RevenueChart() {
  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={revenueData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--surface-bg-alt)" />
          <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}L`} />
          <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '11px', background: 'var(--surface-card)', border: '1px solid var(--border-default)' }} />
          <Line type="monotone" dataKey="actual" stroke="var(--accent)" strokeWidth={2} dot={{ fill: 'var(--accent)', r: 4 }} name="Actual" />
          <Line type="monotone" dataKey="forecast" stroke="var(--info)" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: 'var(--info)', r: 3 }} name="Forecast" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ============================
   Main Component
   ============================ */

export default function AnalyticsView() {
  const [dateRange, setDateRange] = useState('This Quarter');

  const wonDeals = teamMembers.reduce((s, m) => s + m.deals, 0);
  const avgDealSize = wonDeals ? revenueData[revenueData.length - 1].actual * 100000 / wonDeals : 0;
  const conversionRate = Math.round((pipelineStages[pipelineStages.length - 1].count / pipelineStages[0].count) * 100);

  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="flex flex-col gap-5 max-w-7xl mx-auto pb-8">
        {/* ========== Section 10: Report Filters ========== */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-text-primary">Analytics</h1>
            <span className="text-[9px] bg-surface-bg-alt text-text-muted px-2 py-0.5 rounded font-medium">Executive Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-surface-bg border border-border-default rounded-lg p-0.5">
              {['This Week', 'This Month', 'This Quarter', 'This Year'].map(r => (
                <button key={r} onClick={() => setDateRange(r)}
                  className={`text-[9px] font-semibold px-2.5 py-1 rounded-md transition-colors ${dateRange === r ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary'}`}
                >{r}</button>
              ))}
            </div>
            <Filter className="w-3.5 h-3.5 text-icon cursor-pointer hover:text-text-primary" />
            <button className="border border-border-default text-text-secondary hover:text-text-primary text-[9px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1">
              <Download className="w-3 h-3" /> Export
            </button>
          </div>
        </div>

        {/* ========== Section 1: Executive KPI Row ========== */}
        <div className="grid grid-cols-6 gap-3">
          {[
            { icon: TrendingUp, label: 'Revenue This Month', value: '₹45L', sub: '+12% vs last month', color: 'text-success', trend: 'up', insight: 'Best month this year' },
            { icon: DollarSign, label: 'Pipeline Value', value: '₹3.2Cr', sub: '+8% QoQ', color: 'text-accent', trend: 'up', insight: '28 active deals' },
            { icon: CheckCircle2, label: 'Won Deals', value: String(wonDeals), sub: 'This quarter', color: 'text-success', trend: 'up', insight: 'Avg ₹{(wonDeals ? revenueData[revenueData.length - 1].actual * 100000 / wonDeals / 100000 : 0).toFixed(1)}L per deal' },
            { icon: Target, label: 'Conversion Rate', value: `${conversionRate}%`, sub: '+2% improvement', color: 'text-info', trend: 'up', insight: 'Industry avg: 22%' },
            { icon: Activity, label: 'Avg Deal Size', value: formatCurrency(avgDealSize), sub: '+5% growth', color: 'text-warning', trend: 'up', insight: '16 deals closed' },
            { icon: Eye, label: 'Forecast Accuracy', value: '89%', sub: '+3% this month', color: 'text-accent', trend: 'up', insight: 'AI confidence: high' },
          ].map(kpi => (
            <div key={kpi.label} className="bg-surface-card border border-border-default rounded-[12px] px-3.5 py-3 hover:shadow-[var(--shadow-card-hov)] transition-shadow">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[8px] font-medium text-text-muted uppercase tracking-wider">{kpi.label}</span>
                <kpi.icon className={`w-3 h-3 ${kpi.color}`} />
              </div>
              <div className="text-base font-bold text-text-primary">{kpi.value}</div>
              <div className="text-[8px] text-text-muted mt-0.5 flex items-center gap-1">
                {kpi.trend === 'up' ? <ArrowUpRight className="w-2 h-2 text-success" /> : <ArrowDownRight className="w-2 h-2 text-error" />}
                {kpi.sub}
              </div>
              <div className="text-[7px] text-accent mt-0.5 opacity-70">{kpi.insight}</div>
            </div>
          ))}
        </div>

        {/* ========== Section 2: Revenue & Forecasting ========== */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 bg-surface-card border border-border-default rounded-[12px] p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                <h2 className="text-xs font-bold text-text-primary">Revenue & Forecast</h2>
              </div>
              <div className="flex items-center gap-3 text-[9px] text-text-muted">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-accent" /> Actual</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-info" /> Forecast</span>
              </div>
            </div>
            <RevenueChart />
          </div>

          {/* AI Forecast Panel */}
          <div className="bg-surface-card dark:bg-sidebar text-text-primary dark:text-white border-border-default dark:border-sidebar-hover rounded-[12px] p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-accent/5 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <BrainCircuit className="w-4 h-4 text-accent" />
                <h3 className="text-xs font-bold text-text-primary dark:text-white">AI Forecast</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-white/5 border border-white/5 rounded-lg p-3 text-center">
                  <div className="text-[9px] text-text-secondary dark:text-sidebar-text font-medium">Expected Revenue</div>
                  <div className="text-2xl font-bold text-text-primary dark:text-white mt-1">₹56L</div>
                  <div className="text-[8px] text-success flex items-center justify-center gap-0.5 mt-0.5"><ArrowUpRight className="w-2.5 h-2.5" /> +24% vs last month</div>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] text-text-secondary dark:text-sidebar-text">Confidence</span>
                    <span className="text-[10px] font-bold text-accent">87%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-accent h-full rounded-full" style={{ width: '87%' }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/5 border border-white/5 rounded-lg p-2.5">
                    <div className="text-[8px] text-text-secondary dark:text-sidebar-text">Upside</div>
                    <div className="text-[11px] font-bold text-success mt-0.5">₹12L</div>
                    <div className="text-[8px] text-text-secondary dark:text-sidebar-text">3 deals likely</div>
                  </div>
                  <div className="bg-white/5 border border-white/5 rounded-lg p-2.5">
                    <div className="text-[8px] text-text-secondary dark:text-sidebar-text">Risk</div>
                    <div className="text-[11px] font-bold text-warning mt-0.5">₹4.5L</div>
                    <div className="text-[8px] text-text-secondary dark:text-sidebar-text">2 deals at risk</div>
                  </div>
                </div>
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-2.5">
                  <div className="flex items-start gap-1.5">
                    <Sparkles className="w-3 h-3 text-accent mt-0.5 shrink-0" />
                    <p className="text-[9px] text-text-secondary dark:text-sidebar-text font-medium leading-relaxed">3 large deals are likely to close within 14 days — total potential ₹12L.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========== Section 3: Sales Pipeline Analytics + Section 6: Deal Analytics ========== */}
        <div className="grid grid-cols-3 gap-4">
          {/* Pipeline Funnel */}
          <div className="col-span-2 bg-surface-card border border-border-default rounded-[12px] p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-accent" />
                <h2 className="text-xs font-bold text-text-primary">Sales Pipeline</h2>
              </div>
              <div className="text-[9px] bg-warning/10 text-warning font-medium px-2 py-0.5 rounded">Bottleneck: Proposal stage</div>
            </div>
            <div className="space-y-3">
              {pipelineStages.map((stage, i) => (
                <div key={stage.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-text-primary w-24">{stage.name}</span>
                      <span className="text-[9px] text-text-muted">{stage.count} deals</span>
                      <span className="text-[9px] text-text-muted">· {formatCurrency(stage.value)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {i > 0 && (
                        <span className="text-[8px] text-error flex items-center gap-0.5">
                          <ArrowDownRight className="w-2 h-2" /> -{stage.dropoff}%
                        </span>
                      )}
                      <span className="text-[9px] font-semibold text-text-primary">{stage.conversion}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-surface-bg-alt h-2 rounded-full overflow-hidden flex">
                    <div className="bg-accent h-full rounded-full transition-all" style={{ width: `${stage.conversion}%` }} />
                    {i > 0 && i < pipelineStages.length - 1 && (
                      <div className="bg-warning h-full rounded-full transition-all" style={{ width: `${Math.max(stage.dropoff! - 10, 0)}%`, marginLeft: '2px' }} />
                    )}
                  </div>
                  <div className="flex justify-between text-[7px] text-text-muted mt-0.5">
                    <span>{stage.count} deals · {formatCurrency(stage.value)}</span>
                    {i > 0 && <span>{stage.dropoff}% drop-off</span>}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 bg-warning/5 border border-warning/10 rounded-lg p-2.5 flex items-start gap-2">
              <AlertTriangle className="w-3 h-3 text-warning mt-0.5 shrink-0" />
              <p className="text-[9px] text-text-secondary font-medium">Proposal stage has the highest drop-off rate (57%). Review proposal templates and pricing strategy.</p>
            </div>
          </div>

          {/* Deal Analytics */}
          <div className="bg-surface-card border border-border-default rounded-[12px] p-4">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-info" />
              <h2 className="text-xs font-bold text-text-primary">Deal Analytics</h2>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-surface-bg-alt/50 border border-border-default/50 rounded-lg p-3">
                <div className="text-[8px] text-text-muted">Largest Deal</div>
                <div className="text-sm font-bold text-text-primary mt-0.5">{formatCurrency(dealMetrics.largestDeal)}</div>
              </div>
              <div className="bg-surface-bg-alt/50 border border-border-default/50 rounded-lg p-3">
                <div className="text-[8px] text-text-muted">Fastest Closed</div>
                <div className="text-sm font-bold text-success mt-0.5">{dealMetrics.fastestClosed} days</div>
              </div>
              <div className="bg-surface-bg-alt/50 border border-border-default/50 rounded-lg p-3">
                <div className="text-[8px] text-text-muted">Longest Open</div>
                <div className="text-sm font-bold text-warning mt-0.5">{dealMetrics.longestOpen} days</div>
              </div>
              <div className="bg-surface-bg-alt/50 border border-border-default/50 rounded-lg p-3">
                <div className="text-[8px] text-text-muted">Avg Sales Cycle</div>
                <div className="text-sm font-bold text-accent mt-0.5">{dealMetrics.avgCycle} days</div>
              </div>
            </div>
            {/* Deal velocity mini bar chart */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] text-text-muted">Deal Velocity (days per stage)</span>
              </div>
              {[
                { stage: 'Discovery', days: 8 },
                { stage: 'Demo', days: 6 },
                { stage: 'Proposal', days: 10 },
                { stage: 'Negotiation', days: 8 },
                { stage: 'Close', days: 6 },
              ].map(s => (
                <div key={s.stage} className="flex items-center gap-2 mb-1">
                  <span className="text-[8px] text-text-secondary w-16">{s.stage}</span>
                  <div className="flex-1 bg-surface-bg-alt h-1.5 rounded-full overflow-hidden">
                    <div className="bg-accent h-full rounded-full" style={{ width: `${(s.days / 10) * 100}%` }} />
                  </div>
                  <span className="text-[8px] font-semibold text-text-primary w-4 text-right">{s.days}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========== Section 4: Lead Source Performance + Section 5: Team Performance ========== */}
        <div className="grid grid-cols-3 gap-4">
          {/* Lead Source Performance */}
          <div className="col-span-2 bg-surface-card border border-border-default rounded-[12px] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-accent" />
                <h2 className="text-xs font-bold text-text-primary">Lead Source Performance</h2>
              </div>
              <div className="text-[9px] bg-success/10 text-success font-medium px-2 py-0.5 rounded">Best: Referrals (42% conversion)</div>
            </div>
            <table className="w-full text-[10px]">
              <thead className="text-[8px] text-text-muted uppercase tracking-wider bg-surface-bg-alt/30">
                <tr>
                  <th className="text-left px-3 py-2 font-semibold">Source</th>
                  <th className="text-left px-3 py-2 font-semibold">Leads</th>
                  <th className="text-left px-3 py-2 font-semibold">Conversion</th>
                  <th className="text-left px-3 py-2 font-semibold">Revenue</th>
                  <th className="text-left px-3 py-2 font-semibold">Cost/Lead</th>
                  <th className="text-left px-3 py-2 font-semibold">ROI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default/20">
                {leadSources.map(s => {
                  const roi = s.cpl > 0 ? ((s.revenue / s.leads - s.cpl) / s.cpl * 100) : 999;
                  return (
                    <tr key={s.name} className={`hover:bg-surface-bg-alt/30 transition-colors ${s.name === 'Referrals' ? 'bg-success/5' : s.name === 'WhatsApp' ? 'bg-accent/5' : ''}`}>
                      <td className="px-3 py-2.5 font-semibold text-text-primary flex items-center gap-1.5">
                        {s.name === 'WhatsApp' && <MessageSquare className="w-3 h-3 text-success" />}
                        {s.name}
                        {(s.name === 'Referrals' || s.name === 'WhatsApp') && <span className="text-[7px] bg-success/10 text-success px-1 py-0.5 rounded font-bold ml-1">Top</span>}
                      </td>
                      <td className="px-3 py-2.5 text-text-secondary">{s.leads}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-12 bg-surface-bg-alt h-1.5 rounded-full overflow-hidden">
                            <div className="bg-accent h-full rounded-full" style={{ width: `${s.convRate}%` }} />
                          </div>
                          <span className="font-semibold text-text-primary">{s.convRate}%</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 font-semibold text-text-primary">{formatCurrency(s.revenue)}</td>
                      <td className="px-3 py-2.5 text-text-secondary">{s.cpl === 0 ? 'Free' : `₹${s.cpl}`}</td>
                      <td className="px-3 py-2.5">
                        <span className={`text-[9px] font-bold ${roi >= 500 ? 'text-success' : roi >= 200 ? 'text-warning' : 'text-text-muted'}`}>
                          {roi >= 999 ? '∞' : `${Math.round(roi)}%`}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="px-4 py-2.5 bg-accent/5 border-t border-accent/10">
              <p className="text-[9px] text-accent font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> WhatsApp generates 31% higher conversion than Website leads. Referral leads cost ₹0 and convert at 42%.
              </p>
            </div>
          </div>

          {/* Team Performance */}
          <div className="bg-surface-card border border-border-default rounded-[12px] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-info" />
                <h2 className="text-xs font-bold text-text-primary">Sales Team</h2>
              </div>
              <span className="text-[9px] text-text-muted">{teamMembers.length} reps</span>
            </div>
            {/* Top Performer Card */}
            <div className="mx-4 mt-3 bg-surface-card dark:bg-sidebar text-text-primary dark:text-white border-border-default dark:border-sidebar-hover rounded-lg p-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-accent/10 rounded-full blur-xl translate-x-1/4 -translate-y-1/4 pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="w-3.5 h-3.5 text-warning" />
                  <span className="text-[8px] font-bold text-accent uppercase tracking-wider">Rep of the Month</span>
                </div>
                <div className="text-xs font-bold text-text-primary dark:text-white">Sarah Johnson</div>
                <div className="flex items-center gap-3 mt-1.5 text-[9px] text-text-secondary dark:text-sidebar-text">
                  <span>₹18.5L closed</span>
                  <span>·</span>
                  <span>63% win rate</span>
                  <span>·</span>
                  <span>5 deals won</span>
                </div>
              </div>
            </div>
            <table className="w-full text-[9px] mt-2">
              <thead className="text-[8px] text-text-muted uppercase tracking-wider">
                <tr className="border-b border-border-default/30">
                  <th className="text-left px-3 py-1.5 font-semibold">Rep</th>
                  <th className="text-left px-3 py-1.5 font-semibold">Revenue</th>
                  <th className="text-left px-3 py-1.5 font-semibold">Win Rate</th>
                  <th className="text-left px-3 py-1.5 font-semibold">Calls</th>
                  <th className="text-left px-3 py-1.5 font-semibold">Meetings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default/20">
                {teamMembers.filter(m => m.name !== 'Sarah Johnson').map(m => (
                  <tr key={m.name} className="hover:bg-surface-bg-alt/30 transition-colors">
                    <td className="px-3 py-2 font-semibold text-text-primary">{m.name}</td>
                    <td className="px-3 py-2 text-text-primary">{formatCurrency(m.revenue)}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-10 bg-surface-bg-alt h-1 rounded-full overflow-hidden">
                          <div className="bg-accent h-full rounded-full" style={{ width: `${m.winRate}%` }} />
                        </div>
                        <span className="text-text-primary">{m.winRate}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-text-secondary">{m.calls}</td>
                    <td className="px-3 py-2 text-text-secondary">{m.meetings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========== Section 7: Activity Performance + Section 8: AI Insights + Section 9: Recommended Actions ========== */}
        <div className="grid grid-cols-3 gap-4">
          {/* Activity Performance */}
          <div className="bg-surface-card border border-border-default rounded-[12px] p-4">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-accent" />
              <h2 className="text-xs font-bold text-text-primary">Activity vs Revenue</h2>
            </div>
            <div className="space-y-2.5">
              {activityCorrelation.map(a => {
                const maxRevenue = Math.max(...activityCorrelation.map(x => x.revenue));
                const Icon = a.activity === 'Calls Made' ? Phone :
                  a.activity === 'Meetings Held' ? Calendar :
                  a.activity === 'WhatsApp Sent' ? MessageSquare : CheckCircle2;
                return (
                  <div key={a.activity} className="flex items-center gap-3 py-1.5">
                    <div className="w-6 h-6 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <Icon className="w-3 h-3 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-semibold text-text-primary">{a.activity}</span>
                        <span className="text-[9px] font-bold text-text-primary">{a.count}</span>
                      </div>
                      <div className="w-full bg-surface-bg-alt h-1.5 rounded-full mt-1 overflow-hidden">
                        <div className="bg-accent h-full rounded-full transition-all" style={{ width: `${(a.revenue / maxRevenue) * 100}%` }} />
                      </div>
                      <div className="text-[8px] text-text-muted mt-0.5">{formatCurrency(a.revenue)} revenue</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-2 bg-surface-card dark:bg-sidebar rounded-lg p-2.5 text-text-primary dark:text-white">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[8px] text-text-secondary dark:text-sidebar-text">Revenue per Call</span>
                <span className="text-[10px] font-bold text-success">₹76,190</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[8px] text-text-secondary dark:text-sidebar-text">Revenue per Meeting</span>
                <span className="text-[10px] font-bold text-accent">₹1,55,556</span>
              </div>
            </div>
          </div>

          {/* AI Business Insights */}
          <div className="bg-surface-card border border-border-default rounded-[12px] p-4">
            <div className="flex items-center gap-2 mb-3">
              <BrainCircuit className="w-4 h-4 text-accent" />
              <h2 className="text-xs font-bold text-text-primary">AI Business Insights</h2>
            </div>
            <div className="space-y-2">
              {insights.map((insight, i) => {
                const Icon = insight.icon;
                const typeStyles: Record<string, string> = {
                  'best-practice': 'bg-info/5 border-info/20',
                  'tip': 'bg-accent/5 border-accent/20',
                  'insight': 'bg-success/5 border-success/20',
                  'alert': 'bg-warning/5 border-warning/20',
                };
                const iconColors: Record<string, string> = {
                  'best-practice': 'text-info',
                  'tip': 'text-accent',
                  'insight': 'text-success',
                  'alert': 'text-warning',
                };
                return (
                  <div key={i} className={`${typeStyles[insight.type]} border rounded-lg p-2.5`}>
                    <div className="flex items-start gap-2">
                      <Icon className={`w-3 h-3 mt-0.5 shrink-0 ${iconColors[insight.type]}`} />
                      <p className="text-[9px] text-text-secondary font-medium leading-relaxed">{insight.title}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-2.5 pt-2 border-t border-border-default/50 flex items-center justify-between text-[9px] text-text-muted">
              <span>Updated today at 10:30 AM</span>
              <span className="text-accent cursor-pointer hover:underline">View all</span>
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="bg-surface-card dark:bg-sidebar text-text-primary dark:text-white border-border-default dark:border-sidebar-hover rounded-[12px] p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-accent/5 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-accent" />
                <h3 className="text-xs font-bold text-text-primary dark:text-white">Recommended Actions</h3>
              </div>
              <div className="space-y-2.5">
                {aiActions.map(a => (
                  <div key={a.lead} className="bg-white/5 border border-white/5 rounded-lg p-2.5 hover:bg-white/10 transition-colors cursor-pointer">
                    <div className="flex items-start gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${a.urgency === 'high' ? 'bg-error/20' : 'bg-warning/20'}`}>
                        <AlertTriangle className={`w-2.5 h-2.5 ${a.urgency === 'high' ? 'text-error' : 'text-warning'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-text-primary dark:text-white">{a.lead}</span>
                          <span className="text-[8px] text-text-secondary dark:text-sidebar-text">· {a.company}</span>
                        </div>
                        <div className="text-[9px] text-text-secondary dark:text-sidebar-text mt-0.5">{a.action}</div>
                        <div className="text-[9px] font-bold text-success mt-0.5">{a.impact}</div>
                        <div className="flex gap-1.5 mt-1.5">
                          <button className="bg-accent hover:bg-accent-hover text-white text-[8px] font-bold px-2 py-1 rounded transition-colors">Take Action</button>
                          <button className="border border-white/10 text-text-secondary dark:text-sidebar-text hover:text-text-primary dark:hover:text-white text-[8px] font-semibold px-2 py-1 rounded transition-colors">Dismiss</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2.5 pt-2 border-t border-white/5">
                <p className="text-[8px] text-text-muted dark:text-sidebar-text-muted">Based on real-time pipeline analysis</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

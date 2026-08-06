'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MessageSquare, DollarSign, TrendingUp, TrendingDown, Sparkles,
  Bot, ArrowUpRight, ArrowDownRight, Flame, Target, ChevronRight,
  Phone, Calendar, Clock, User, Building2, Eye, Zap, CheckCircle2,
  BrainCircuit, Activity, BarChart3, Send, Reply, Plus, Users,
  Mail, Bell, Lightbulb, AlertTriangle, ListTodo,
  Loader2, CheckCheck, Timer, UserPlus, Link2, FileText,
  Megaphone, MapPin, Video, X,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import {
  NewLeadModal, NewDealModal, SendWhatsAppModal,
  ScheduleMeetingModal, BroadcastBuilderModal,
} from './QuickActions';

/* ─── Helpers ─── */

function useCountUp(end: number, duration = 1200, enabled = true) {
  const [value, setValue] = useState(0);
  const raf = useRef<number>();
  useEffect(() => {
    if (!enabled) { setValue(end); return; }
    const start = performance.now();
    const startVal = 0;
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(startVal + (end - startVal) * eased));
      if (progress < 1) { raf.current = requestAnimationFrame(tick); }
    }
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [end, duration, enabled]);
  return value;
}

function formatNum(n: number) {
  if (!n) return '₹0';
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
}

function timeAgo(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date;
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return 'Just now';
  const m = Math.floor(s / 60); if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
  const dd = Math.floor(h / 24); return `${dd}d ago`;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return { text: 'Good Morning', emoji: '☀️' };
  if (h >= 12 && h < 17) return { text: 'Good Afternoon', emoji: '🌤️' };
  if (h >= 17 && h < 20) return { text: 'Good Evening', emoji: '🌆' };
  return { text: 'Good Evening', emoji: '🌙' };
}

function getISTDate() {
  return new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function getISTTime() {
  return new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true });
}

/* ─── Activity icon map ─── */

const activityConfig: Record<string, { icon: any; color: string; bg: string }> = {
  lead:     { icon: UserPlus,      color: 'text-accent',      bg: 'bg-accent/10' },
  meeting:  { icon: Calendar,      color: 'text-warning',     bg: 'bg-warning/10' },
  whatsapp: { icon: MessageSquare, color: 'text-success',     bg: 'bg-success/10' },
  deal:     { icon: DollarSign,    color: 'text-info',        bg: 'bg-info/10' },
  quote:    { icon: FileText,      color: 'text-accent',      bg: 'bg-accent/10' },
  call:     { icon: Phone,         color: 'text-error',       bg: 'bg-error/10' },
  email:    { icon: Mail,          color: 'text-text-primary', bg: 'bg-surface-bg-alt' },
  system:   { icon: Bell,          color: 'text-text-muted',   bg: 'bg-surface-bg-alt' },
  note:     { icon: FileText,      color: 'text-accent',      bg: 'bg-accent/10' },
};

/* ─── Skeleton ─── */

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-shimmer rounded-lg ${className}`} />;
}

/* ─── Stat Card Button ─── */

function StatCardButton({ icon: Icon, label, value, sub, trend, trendLabel, onClick, delay }: {
  icon: any; label: string; value: string; sub: string; trend: 'up' | 'down'; trendLabel: string; onClick: () => void; delay: number;
}) {
  const numeric = Number(String(value).replace(/[^0-9]/g, ''));
  const animatedValue = useCountUp(numeric, 1200);
  const prefix = value.includes('₹') ? '₹' : '';
  const suffix = value.includes('%') ? '%' : '';
  const displayVal = numeric > 0 ? `${prefix}${animatedValue}${suffix}` : value;
  return (
    <button onClick={onClick}
      className="premium-card p-4 hover-lift animate-fadeInUp text-left"
      style={{ animationDelay: `${delay}s` }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[9px] font-medium text-text-muted uppercase tracking-wider">{label}</span>
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center"><Icon className="w-4 h-4 text-accent" /></div>
      </div>
      <div className="text-xl font-bold text-text-primary tracking-tight">{displayVal}</div>
      <div className="flex items-center gap-1.5 mt-1">
        {trend === 'up' ? <TrendingUp className="w-3 h-3 text-success" /> : <TrendingDown className="w-3 h-3 text-error" />}
        <span className="text-[10px] font-medium text-text-muted">{sub}</span>
      </div>
      <div className="text-[9px] text-text-muted mt-0.5">{trendLabel}</div>
    </button>
  );
}

/* ─── Main Component ─── */

export default function DashboardView({ stats: _stats, leads: _leads, addToast }: {
  stats?: any; leads?: any[]; addToast?: (type: 'success' | 'error' | 'info', msg: string) => void;
} = {}) {
  const setActiveTab = useStore(s => s.setActiveTab);
  const openDialer = useStore(s => s.openDialer);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [greeting] = useState(getGreeting);
  const [dateStr] = useState(getISTDate);
  const [timeStr, setTimeStr] = useState(getISTTime);
  const [userName] = useState('Sarah');

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [meetingDetail, setMeetingDetail] = useState<any>(null);
  const [followupDetail, setFollowupDetail] = useState<any>(null);
  const [confirmAction, setConfirmAction] = useState<{ type: string; id: string; msg: string } | null>(null);

  // Update time every minute
  useEffect(() => {
    const iv = setInterval(() => setTimeStr(getISTTime()), 60000);
    return () => clearInterval(iv);
  }, []);

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await fetch('/api/dashboard');
      if (res.ok) setData(await res.json());
    } catch { /* silent */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const handleActionSuccess = (msg: string) => {
    setActiveModal(null);
    addToast?.('success', msg);
    fetchDashboard();
  };

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
  };

  const handleCall = (phone: string, name: string) => {
    if (phone) {
      openDialer(phone, name);
      addToast?.('info', `Calling ${name}...`);
    } else {
      addToast?.('error', 'No phone number available');
    }
  };

  const handleMessage = (chatId?: string) => {
    if (chatId) {
      useStore.getState().setSelectedChatId(chatId);
    }
    setActiveTab('whatsapp');
  };

  const handleOpenLead = (leadId: string) => {
    useStore.getState().setSelectedLeadId(leadId);
    setActiveTab('leads');
  };

  const handleCompleteFollowup = async (id: string) => {
    try {
      await fetch(`/api/activities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: 'Follow-up Completed', content: 'Completed', type: 'NOTE' }),
      });
      addToast?.('success', 'Follow-up completed');
      fetchDashboard();
    } catch { addToast?.('error', 'Failed to update'); }
  };

  const handleMeetingAction = async (id: string, action: string) => {
    const statusMap: Record<string, string> = { complete: 'COMPLETED', cancel: 'CANCELLED', reschedule: 'RESCHEDULED' };
    try {
      await fetch(`/api/meetings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusMap[action] || 'SCHEDULED' }),
      });
      addToast?.('success', `Meeting ${action}d successfully`);
      setMeetingDetail(null);
      fetchDashboard();
    } catch { addToast?.('error', `Failed to ${action} meeting`); }
  };

  if (loading) {
    return (
      <div className="h-full overflow-y-auto no-scrollbar p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="space-y-2"><Skeleton className="h-8 w-64" /><Skeleton className="h-4 w-48" /></div>
          <div className="text-right space-y-1.5"><Skeleton className="h-4 w-40 ml-auto" /><Skeleton className="h-4 w-24 ml-auto" /></div>
        </div>
        <Skeleton className="h-36 w-full" />
        <div className="grid grid-cols-5 gap-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
        <div className="grid grid-cols-4 gap-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}</div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
          <div className="space-y-4"><Skeleton className="h-64" /><Skeleton className="h-64" /></div>
          <div className="space-y-4"><Skeleton className="h-40" /><Skeleton className="h-40" /><Skeleton className="h-40" /></div>
        </div>
      </div>
    );
  }

  const d = data || {
    overview: { leadCount: 0, contactCount: 0, pipelineValue: 0, totalRevenue: 0, conversionRate: 0, forecastRevenue: 0, targetRevenue: 5000000, revenueAtRisk: 0, closingThisWeek: 0, highPriorityFollowUps: 0, whatsappAwaiting: 0, aiConfidence: 94, responseRate: 68 },
    priorities: [], meetings: [], stats: { revenue: 0, dealsClosing: 0, pendingFollowups: 0, waResponseRate: 68 },
  };

  const { overview, priorities, meetings, stats } = d;

  return (
    <div className="h-full overflow-y-auto no-scrollbar page-enter">
      <div className="flex flex-col gap-5 max-w-7xl mx-auto pb-8 px-4 lg:px-6">

        {/* ═══ SECTION 1: WELCOME HEADER ═══ */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 animate-fadeInUp">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-text-primary tracking-tight">
              {greeting.text}, {userName} {greeting.emoji}
            </h1>
            <p className="text-sm text-text-secondary mt-1.5 font-medium">Here&apos;s your sales summary for today.</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-sm font-semibold text-text-primary">{dateStr}</div>
            <div className="flex items-center gap-2 mt-1 justify-end">
              <Clock className="w-4 h-4 text-icon" />
              <span className="text-sm font-bold text-accent">{timeStr}</span>
              <span className="text-xs text-text-muted">· Updated {timeAgo(new Date())}</span>
            </div>
          </div>
        </div>

        {/* ═══ SECTION 2: AI EXECUTIVE SUMMARY ═══ */}
        <div className="bg-gradient-to-br from-[#DDF7F2] via-[#D3F2EB] to-[#C8EFE7] dark:bg-gradient-to-br dark:from-[#172136] dark:via-[#1D2940] dark:to-[#22314A] text-text-primary dark:text-white border-2 border-[#5BC0AE] dark:border-[rgba(72,187,171,.25)] rounded-[20px] p-7 lg:p-7 relative overflow-hidden animate-fadeInUp shadow-[0_12px_30px_rgba(15,118,110,0.18)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.45),0_0_40px_rgba(20,184,166,0.08)] transition-all duration-[250ms] hover:brightness-[1.03] dark:hover:brightness-[1.06]" style={{ animationDelay: '0.05s' }}>
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none dark:hidden" style={{ background: 'radial-gradient(circle at top right, rgba(16,185,129,0.18), transparent 60%)' }} />
          <div className="hidden dark:block absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle at top right, rgba(20,184,166,0.14), transparent 45%)' }} />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-white/60 dark:bg-[rgba(20,184,166,.18)] dark:shadow-[0_0_20px_rgba(20,184,166,.15)] flex items-center justify-center"><BrainCircuit className="w-5 h-5 text-[#0F766E] dark:text-[#5EEAD4]" /></div>
              <h2 className="text-lg font-bold text-text-primary dark:text-white/90" style={{ fontWeight: 700 }}>AI Executive Summary</h2>
              <span className="bg-[#0F766E] dark:bg-gradient-to-br dark:from-[#14B8A6] dark:to-[#0F766E] text-white text-xs font-bold rounded-full dark:font-semibold" style={{ padding: '6px 14px' }}>AI Powered</span>
              <span className="bg-[#0F766E] dark:bg-[rgba(20,184,166,.18)] dark:border dark:border-[rgba(20,184,166,.45)] dark:text-[#7EF3D8] dark:backdrop-blur-[8px] text-white text-xs font-semibold rounded-full ml-auto" style={{ padding: '6px 14px', fontWeight: 600 }}>{overview.aiConfidence}% confidence</span>
            </div>
            {overview.leadCount === 0 ? (
              <div className="bg-white/90 dark:bg-[rgba(255,255,255,.04)] dark:backdrop-blur-[8px] border border-white/50 dark:border-[rgba(255,255,255,.06)] rounded-lg p-4 text-center">
                <Sparkles className="w-6 h-6 text-[#0F766E] dark:text-[#5EEAD4] mx-auto mb-2" />
                <p className="text-sm text-text-secondary dark:text-[rgba(255,255,255,.72)]">No data yet. Create your first lead to see AI-powered insights.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
                  {[
                    { label: 'High-Priority Follow-ups', value: String(overview.highPriorityFollowUps), sub: 'Require attention today', color: 'text-accent' },
                    { label: 'WhatsApp Awaiting', value: String(overview.whatsappAwaiting), sub: 'Need immediate response', color: 'text-success' },
                    { label: 'Forecast Revenue', value: formatNum(overview.forecastRevenue), sub: '+12% above target', color: 'text-accent' },
                    { label: 'Closing This Week', value: String(overview.closingThisWeek), sub: `Avg ${overview.pipelineValue > 0 ? formatNum(Math.round(overview.pipelineValue / Math.max(1, overview.leadCount))) : '₹0'} per deal`, color: 'text-warning' },
                    { label: 'Revenue at Risk', value: formatNum(overview.revenueAtRisk), sub: `${priorities.filter((p: any) => p.priority === 'CRITICAL').length} deals inactive`, color: 'text-error' },
                  ].map((item, i) => (
                    <div key={i} className="bg-white dark:bg-[#243248] border border-[#E8F1EF] dark:border-[rgba(255,255,255,.06)] rounded-[14px] p-3 transition-all duration-[250ms] ease hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(0,0,0,0.08)] dark:hover:bg-[#2B3A53] dark:hover:shadow-[0_10px_20px_rgba(0,0,0,0.25)]">
                      <div className="text-xs text-text-secondary dark:text-[rgba(255,255,255,.72)] font-medium mb-1">{item.label}</div>
                      <div className={`text-2xl font-bold mt-1 ${item.color || 'text-text-primary dark:text-white/90'}`}>{item.value}</div>
                      <div className="text-xs text-text-secondary dark:text-[rgba(255,255,255,.72)] mt-1">{item.sub}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-white/85 dark:bg-[rgba(255,255,255,.04)] dark:backdrop-blur-[12px] border-l-[5px] border-l-[#0F766E] dark:border-l-[#14B8A6] border border-[#E8F1EF] dark:border-[rgba(255,255,255,.06)] rounded-[12px] p-4 flex flex-col sm:flex-row sm:items-center gap-4 transition-all duration-[250ms] ease hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                  <div className="flex-1">
                    <p className="text-sm text-text-secondary dark:text-[rgba(255,255,255,.72)] font-medium leading-relaxed">
                      {priorities.length > 0 && (
                        <><span className="text-text-primary dark:text-white/90 font-bold">{priorities[0].name}</span> has a {priorities[0].prob}% close probability — {priorities[0].priority === 'CRITICAL' ? 'call immediately' : 'follow up today'}. </>)}
                      {overview.whatsappAwaiting > 0 && <><span className="text-accent dark:text-[#3DD9C5] font-semibold">{overview.whatsappAwaiting} WhatsApp conversations</span> awaiting response. </>}
                      <span className="text-success dark:text-[#3DD9C5] font-bold">{formatNum(overview.forecastRevenue)}</span> expected revenue this month.
                    </p>
                  </div>
                  <button onClick={() => handleNavigate('lead-insights')}
                    className="shrink-0 bg-gradient-to-br from-[#0F766E] to-[#14B8A6] dark:bg-gradient-to-br dark:from-[#14B8A6] dark:to-[#0F766E] text-white text-sm font-bold px-5 py-2.5 rounded-[12px] transition-all duration-[250ms] ease flex items-center gap-2 shadow-[0_10px_25px_rgba(15,118,110,0.35)] dark:shadow-[0_10px_30px_rgba(20,184,166,0.35)] hover:-translate-y-0.5 hover:brightness-105 dark:hover:brightness-110">
                    <Sparkles className="w-5 h-5" /> View AI Briefing
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ═══ TWO-COLUMN LAYOUT ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">

          {/* ─── LEFT COLUMN ─── */}
          <div className="flex flex-col gap-5 min-w-0">

            {/* SECTION 4: TODAY'S STATS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCardButton icon={DollarSign} label="Revenue" value={formatNum(stats.revenue)} sub="Total pipeline value" trend="up" trendLabel={`${overview.leadCount} active deals`} onClick={() => handleNavigate('deals')} delay={0.15} />
              <StatCardButton icon={Flame} label="Deals Closing Today" value={String(stats.dealsClosing)} sub="High probability deals" trend="up" trendLabel={`${overview.closingThisWeek} closing this week`} onClick={() => handleNavigate('deals')} delay={0.2} />
              <StatCardButton icon={ListTodo} label="Pending Follow-ups" value={String(stats.pendingFollowups)} sub="Need attention" trend="up" trendLabel={`${overview.highPriorityFollowUps} high priority`} onClick={() => handleNavigate('followup-suggestions')} delay={0.25} />
              <StatCardButton icon={MessageSquare} label="WA Response Rate" value={`${stats.waResponseRate}%`} sub="Response rate" trend={stats.waResponseRate >= 70 ? 'up' : 'down'} trendLabel={stats.waResponseRate >= 70 ? 'Above benchmark' : 'Needs improvement'} onClick={() => handleNavigate('whatsapp')} delay={0.3} />
            </div>

            {/* SECTION: REVENUE FORECAST */}
            <div className="premium-card p-5 animate-fadeInUp" style={{ animationDelay: '0.35s' }}>
              <div className="flex items-center gap-2.5 mb-4">
                <BarChart3 className="w-5 h-5 text-info" />
                <h2 className="section-title">Revenue Forecast</h2>
                <span className="ml-auto text-[10px] font-semibold text-success flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> {overview.aiConfidence}% confidence
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'Current Revenue', value: stats.revenue, color: 'text-accent', bg: 'bg-accent/10' },
                  { label: 'Forecast Revenue', value: overview.forecastRevenue, color: 'text-info', bg: 'bg-info/10' },
                  { label: 'Target Revenue', value: overview.targetRevenue, color: 'text-warning', bg: 'bg-warning/10' },
                ].map((m, i) => (
                  <div key={i} className={`${m.bg} border border-border-default/50 rounded-lg p-4 text-center hover:bg-surface-bg/80 transition-colors cursor-pointer`} onClick={() => handleNavigate('deals')}>
                    <div className={`text-2xl font-bold ${m.color}`}>{formatNum(m.value)}</div>
                    <div className="text-xs text-text-muted mt-1 font-medium">{m.label}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-2 mb-3">
                {[
                  { label: 'Current vs Target', pct: overview.targetRevenue > 0 ? Math.round((stats.revenue / overview.targetRevenue) * 100) : 0, color: 'bg-accent' },
                  { label: 'Forecast vs Target', pct: overview.targetRevenue > 0 ? Math.round((overview.forecastRevenue / overview.targetRevenue) * 100) : 0, color: 'bg-info' },
                  { label: 'Pipeline Health', pct: overview.pipelineValue > 0 ? Math.min(100, Math.round((overview.forecastRevenue / overview.pipelineValue) * 100)) : 0, color: 'bg-success' },
                ].map((b, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between text-xs text-text-muted mb-1">
                      <span>{b.label}</span>
                      <span className="font-bold text-text-primary">{b.pct}%</span>
                    </div>
                    <div className="w-full bg-surface-bg-alt h-2.5 rounded-full overflow-hidden">
                      <div className={`${b.color} h-full rounded-full transition-all duration-1000 ease-out`} style={{ width: `${Math.min(b.pct, 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-surface-card dark:bg-sidebar text-text-primary dark:text-white border-border-default dark:border-sidebar-hover rounded-lg p-4">
                <div className="flex items-center gap-2.5">
                  <BrainCircuit className="w-5 h-5 text-accent shrink-0" />
                  <p className="text-xs text-text-secondary dark:text-sidebar-text font-medium leading-relaxed">
                    Based on current pipeline, there is an <span className="text-accent font-bold">{overview.aiConfidence}% probability</span> of exceeding this month&apos;s target.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* ─── RIGHT SIDEBAR ─── */}
          <div className="flex flex-col gap-4">

            {/* Today's Meetings */}
            <div className="premium-card p-4 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-warning" />
                  <h3 className="text-[11px] font-bold text-text-primary">Today&apos;s Meetings</h3>
                </div>
                <span className="text-[9px] text-text-muted">{meetings.length}</span>
              </div>
              <div className="space-y-2">
                {meetings.length === 0 ? (
                  <p className="text-[10px] text-text-muted text-center py-4">No meetings scheduled today</p>
                ) : meetings.map((m: any) => {
                  const MIcon = m.type === 'video' ? Video : m.type === 'phone' ? Phone : MapPin;
                  return (
                    <button key={m.id} onClick={() => setMeetingDetail(m)}
                      className="w-full bg-surface-bg-alt/50 border border-border-default/50 rounded-lg p-3 hover:bg-surface-bg/80 transition-colors text-left">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                          <MIcon className="w-4 h-4 text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-semibold text-text-primary leading-snug">{m.title}</p>
                          <div className="flex items-center gap-1.5 mt-1 text-[9px] text-text-muted">
                            <Clock className="w-3 h-3" /><span>{m.time}</span><span>· {m.duration}</span>
                          </div>
                          <p className="text-[8px] text-text-muted mt-0.5">with {m.with}</p>
                        </div>
                        <ChevronRight className="w-3 h-3 text-text-muted mt-1 shrink-0" />
                      </div>
                    </button>
                  );
                })}
                <button onClick={() => handleNavigate('meetings')} className="w-full text-[9px] font-medium text-accent hover:underline text-center pt-1 transition-colors">View all →</button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="premium-card p-4 animate-fadeInUp" style={{ animationDelay: '0.25s' }}>
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-accent" />
                <h3 className="text-[11px] font-bold text-text-primary">Quick Actions</h3>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { icon: UserPlus, label: 'New Lead', desc: 'Create a new lead', modal: 'new-lead' },
                  { icon: DollarSign, label: 'New Deal', desc: 'Add a new deal', modal: 'new-deal' },
                  { icon: Send, label: 'Send WhatsApp', desc: 'Send a message', modal: 'send-whatsapp' },
                  { icon: Calendar, label: 'Schedule Meeting', desc: 'Plan a meeting', modal: 'schedule-meeting' },
                  { icon: Megaphone, label: 'Broadcast', desc: 'Campaign broadcast', modal: 'broadcast' },
                ].map((action, i) => {
                  const Icon = action.icon;
                  return (
                    <button key={i} onClick={() => setActiveModal(action.modal)}
                      className="flex items-center gap-3 w-full bg-surface-bg-alt/50 border border-border-default/50 rounded-lg p-3 hover:bg-accent/5 hover:border-accent/20 transition-all text-left group">
                      <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors shrink-0">
                        <Icon className="w-4 h-4 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-semibold text-text-primary">{action.label}</p>
                        <p className="text-[8px] text-text-muted">{action.desc}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-text-muted shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Upcoming Follow-ups (removed) */}
            {/* Notifications (removed) */}
            {/* AI Suggestions (removed) */}
          </div>
        </div>
      </div>

      {/* ═══ MODALS ═══ */}
      {activeModal === 'new-lead' && <NewLeadModal onClose={() => setActiveModal(null)} onCreated={() => handleActionSuccess('Lead created')} />}
      {activeModal === 'new-deal' && <NewDealModal onClose={() => setActiveModal(null)} onCreated={() => handleActionSuccess('Deal created')} />}
      {activeModal === 'send-whatsapp' && <SendWhatsAppModal onClose={() => setActiveModal(null)} onSent={() => handleActionSuccess('Message sent')} />}
      {activeModal === 'schedule-meeting' && <ScheduleMeetingModal chatId="" onClose={() => setActiveModal(null)} onScheduled={() => handleActionSuccess('Meeting scheduled')} />}
      {activeModal === 'broadcast' && <BroadcastBuilderModal onClose={() => setActiveModal(null)} onCreated={() => handleActionSuccess('Broadcast campaign created')} />}

      {/* ═══ MEETING DETAIL MODAL ═══ */}
      {meetingDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setMeetingDetail(null)}>
          <div className="bg-surface-card border border-border-default rounded-[14px] w-[400px] shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
              <h3 className="text-sm font-bold text-text-primary">Meeting Details</h3>
              <button onClick={() => setMeetingDetail(null)} className="p-1 rounded-md hover:bg-surface-bg-alt text-text-secondary"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-4 space-y-3">
              <div><span className="text-[10px] font-medium text-text-muted block">Title</span><span className="text-xs font-semibold text-text-primary">{meetingDetail.title}</span></div>
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-[10px] font-medium text-text-muted block">Date</span><span className="text-xs text-text-primary">{meetingDetail.date}</span></div>
                <div><span className="text-[10px] font-medium text-text-muted block">Time</span><span className="text-xs text-text-primary">{meetingDetail.time}</span></div>
              </div>
              <div><span className="text-[10px] font-medium text-text-muted block">With</span><span className="text-xs text-text-primary">{meetingDetail.with}</span></div>
              <div><span className="text-[10px] font-medium text-text-muted block">Duration</span><span className="text-xs text-text-primary">{meetingDetail.duration}</span></div>
              {meetingDetail.notes && <div><span className="text-[10px] font-medium text-text-muted block">Notes</span><span className="text-xs text-text-primary">{meetingDetail.notes}</span></div>}
              {meetingDetail.link && (
                <div><span className="text-[10px] font-medium text-text-muted block">Link</span>
                  <a href={meetingDetail.link} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline">{meetingDetail.link}</a>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 px-4 py-3 border-t border-border-default">
              {meetingDetail.link && <a href={meetingDetail.link} target="_blank" rel="noopener noreferrer"
                className="flex-1 text-center bg-accent hover:bg-accent-hover text-white text-[10px] font-bold px-3 py-2 rounded-lg transition-colors">Join Meeting</a>}
              <button onClick={() => handleMeetingAction(meetingDetail.id, 'complete')} disabled={meetingDetail.status === 'COMPLETED'}
                className="flex-1 bg-success/10 text-success text-[10px] font-bold px-3 py-2 rounded-lg hover:bg-success/20 transition-colors disabled:opacity-50">Complete</button>
              <button onClick={() => handleMeetingAction(meetingDetail.id, 'cancel')} disabled={meetingDetail.status === 'CANCELLED'}
                className="flex-1 bg-error/10 text-error text-[10px] font-bold px-3 py-2 rounded-lg hover:bg-error/20 transition-colors disabled:opacity-50">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ FOLLOW-UP DETAIL MODAL ═══ */}
      {followupDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setFollowupDetail(null)}>
          <div className="bg-surface-card border border-border-default rounded-[14px] w-[380px] shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
              <h3 className="text-sm font-bold text-text-primary">Follow-up: {followupDetail.lead}</h3>
              <button onClick={() => setFollowupDetail(null)} className="p-1 rounded-md hover:bg-surface-bg-alt text-text-secondary"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-4 space-y-3">
              <div><span className="text-[10px] font-medium text-text-muted block">Note</span><span className="text-xs text-text-primary">{followupDetail.note}</span></div>
              <div><span className="text-[10px] font-medium text-text-muted block">Due</span><span className="text-xs font-semibold text-warning">{followupDetail.due}</span></div>
            </div>
            <div className="flex items-center gap-2 px-4 py-3 border-t border-border-default">
              <button onClick={() => { handleCompleteFollowup(followupDetail.id); setFollowupDetail(null); }}
                className="flex-1 bg-success/10 text-success text-[10px] font-bold px-3 py-2 rounded-lg hover:bg-success/20 transition-colors flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Complete
              </button>
              <button onClick={() => { handleCall(followupDetail.phone, followupDetail.lead); setFollowupDetail(null); }}
                className="flex-1 bg-accent/10 text-accent text-[10px] font-bold px-3 py-2 rounded-lg hover:bg-accent/20 transition-colors flex items-center justify-center gap-1">
                <Phone className="w-3 h-3" /> Call
              </button>
              <button onClick={() => { handleMessage(); setFollowupDetail(null); }}
                className="flex-1 bg-success/10 text-success text-[10px] font-bold px-3 py-2 rounded-lg hover:bg-success/20 transition-colors flex items-center justify-center gap-1">
                <MessageSquare className="w-3 h-3" /> Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Clock,
  User,
  Sparkles,
  Bot,
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  X,
  Search,
  ArrowUpRight,
  Target,
  BarChart3,
  Flame,
  ShieldCheck,
  Eye,
  ArrowRight,
  GripVertical,
  Check,
  Plus,
  Filter,
} from 'lucide-react';

const pipelines = ['All Pipelines', 'Direct Sales', 'Partner Sales'];
const healthFilters = ['All Health', 'Hot', 'At Risk', 'Stuck'];
const savedViews = ['My Deals', 'At Risk', 'Closing This Month', 'High Value', 'Recently Updated'];

interface Deal {
  id: string; name: string; value: number; ageDays: number; winProb: number;
  aiHealthStatus: string; contact?: { name: string }; company?: string;
  lastWhatsApp?: string; customerReplied?: boolean; sentiment?: string;
  aiSummary?: string; aiCoaching?: string; stageId?: string; pipeline?: { name: string };
}

const stageConfigs = [
  { id: 'qualified', name: 'Lead Qualified', probability: 20 },
  { id: 'meeting', name: 'Meeting Scheduled', probability: 40 },
  { id: 'proposal', name: 'Proposal Sent', probability: 60 },
  { id: 'negotiation', name: 'Negotiation', probability: 80 },
  { id: 'won', name: 'Closed Won', probability: 100 },
  { id: 'lost', name: 'Closed Lost', probability: 0 },
];

interface StageTheme {
  gradient: string;
  darkGradient: string;
  border: string;
  glowLight: string;
  glowDark: string;
  shadow: string;
  darkShadow: string;
  hoverShadow: string;
  darkHoverShadow: string;
  headerBorder: string;
  accentText: string;
  countBg: string;
}

const stageThemes: Record<string, StageTheme> = {
  qualified: {
    gradient: 'from-[#EAF2FF] via-[#E1EDFF] to-[#D3E4FF]',
    darkGradient: 'dark:from-[#1B2333] dark:via-[#1F2B3F] dark:to-[#243552]',
    border: 'border-[#7FA9E8] dark:border-[rgba(120,170,230,.32)]',
    glowLight: 'rgba(96,133,255,0.10)',
    glowDark: 'rgba(96,133,255,0.08)',
    shadow: 'shadow-[0_14px_34px_rgba(96,133,255,0.08)]',
    darkShadow: 'dark:shadow-[0_15px_40px_rgba(0,0,0,0.45),0_0_40px_rgba(96,133,255,0.08)]',
    hoverShadow: 'hover:shadow-[0_18px_40px_rgba(96,133,255,0.14)]',
    darkHoverShadow: 'dark:hover:shadow-[0_18px_40px_rgba(0,0,0,0.5),0_0_50px_rgba(96,133,255,0.12)]',
    headerBorder: 'border-[rgba(120,170,230,.25)] dark:border-[rgba(255,255,255,.06)]',
    accentText: 'text-[#3B5BDB]',
    countBg: 'bg-[rgba(123,161,232,0.18)] dark:bg-[rgba(123,161,232,0.16)]',
  },
  meeting: {
    gradient: 'from-[#FFF4E0] via-[#FFEFD2] to-[#FFE7BC]',
    darkGradient: 'dark:from-[#26211A] dark:via-[#2E271C] dark:to-[#382D1D]',
    border: 'border-[#E8B867] dark:border-[rgba(232,184,103,.30)]',
    glowLight: 'rgba(230,158,50,0.12)',
    glowDark: 'rgba(230,158,50,0.08)',
    shadow: 'shadow-[0_14px_34px_rgba(230,158,50,0.08)]',
    darkShadow: 'dark:shadow-[0_15px_40px_rgba(0,0,0,0.45),0_0_40px_rgba(230,158,50,0.08)]',
    hoverShadow: 'hover:shadow-[0_18px_40px_rgba(230,158,50,0.14)]',
    darkHoverShadow: 'dark:hover:shadow-[0_18px_40px_rgba(0,0,0,0.5),0_0_50px_rgba(230,158,50,0.12)]',
    headerBorder: 'border-[rgba(232,184,103,.30)] dark:border-[rgba(255,255,255,.06)]',
    accentText: 'text-[#B45309]',
    countBg: 'bg-[rgba(232,184,103,0.18)] dark:bg-[rgba(232,184,103,0.16)]',
  },
  proposal: {
    gradient: 'from-[#F1ECFF] via-[#EAE3FF] to-[#E0D6FF]',
    darkGradient: 'dark:from-[#221E33] dark:via-[#282242] dark:to-[#30274F]',
    border: 'border-[#A58AE8] dark:border-[rgba(165,138,232,.32)]',
    glowLight: 'rgba(139,108,255,0.10)',
    glowDark: 'rgba(139,108,255,0.08)',
    shadow: 'shadow-[0_14px_34px_rgba(139,108,255,0.08)]',
    darkShadow: 'dark:shadow-[0_15px_40px_rgba(0,0,0,0.45),0_0_40px_rgba(139,108,255,0.08)]',
    hoverShadow: 'hover:shadow-[0_18px_40px_rgba(139,108,255,0.14)]',
    darkHoverShadow: 'dark:hover:shadow-[0_18px_40px_rgba(0,0,0,0.5),0_0_50px_rgba(139,108,255,0.12)]',
    headerBorder: 'border-[rgba(165,138,232,.30)] dark:border-[rgba(255,255,255,.06)]',
    accentText: 'text-[#6D28D9]',
    countBg: 'bg-[rgba(165,138,232,0.18)] dark:bg-[rgba(165,138,232,0.16)]',
  },
  negotiation: {
    gradient: 'from-[#FFECF1] via-[#FFE3EB] to-[#FFD9E4]',
    darkGradient: 'dark:from-[#2A1C22] dark:via-[#331F29] dark:to-[#3E2430]',
    border: 'border-[#E88AA8] dark:border-[rgba(232,138,168,.30)]',
    glowLight: 'rgba(240,110,150,0.10)',
    glowDark: 'rgba(240,110,150,0.08)',
    shadow: 'shadow-[0_14px_34px_rgba(240,110,150,0.08)]',
    darkShadow: 'dark:shadow-[0_15px_40px_rgba(0,0,0,0.45),0_0_40px_rgba(240,110,150,0.08)]',
    hoverShadow: 'hover:shadow-[0_18px_40px_rgba(240,110,150,0.14)]',
    darkHoverShadow: 'dark:hover:shadow-[0_18px_40px_rgba(0,0,0,0.5),0_0_50px_rgba(240,110,150,0.12)]',
    headerBorder: 'border-[rgba(232,138,168,.30)] dark:border-[rgba(255,255,255,.06)]',
    accentText: 'text-[#BE185D]',
    countBg: 'bg-[rgba(232,138,168,0.18)] dark:bg-[rgba(232,138,168,0.16)]',
  },
  won: {
    gradient: 'from-[#DFF7EF] via-[#D5F3E8] to-[#C6ECDC]',
    darkGradient: 'dark:from-[#152B23] dark:via-[#173428] dark:to-[#1B3E2F]',
    border: 'border-[#57C7A8] dark:border-[rgba(87,199,168,.32)]',
    glowLight: 'rgba(20,180,140,0.10)',
    glowDark: 'rgba(20,180,140,0.08)',
    shadow: 'shadow-[0_14px_34px_rgba(20,180,140,0.08)]',
    darkShadow: 'dark:shadow-[0_15px_40px_rgba(0,0,0,0.45),0_0_40px_rgba(20,180,140,0.08)]',
    hoverShadow: 'hover:shadow-[0_18px_40px_rgba(20,180,140,0.14)]',
    darkHoverShadow: 'dark:hover:shadow-[0_18px_40px_rgba(0,0,0,0.5),0_0_50px_rgba(20,180,140,0.12)]',
    headerBorder: 'border-[rgba(87,199,168,.28)] dark:border-[rgba(255,255,255,.06)]',
    accentText: 'text-[#047857]',
    countBg: 'bg-[rgba(87,199,168,0.18)] dark:bg-[rgba(87,199,168,0.16)]',
  },
  lost: {
    gradient: 'from-[#F1F2F4] via-[#EAECEF] to-[#E0E3E8]',
    darkGradient: 'dark:from-[#1B1E24] dark:via-[#20242B] dark:to-[#272B33]',
    border: 'border-[#A6AEB8] dark:border-[rgba(166,174,184,.28)]',
    glowLight: 'rgba(140,150,165,0.10)',
    glowDark: 'rgba(140,150,165,0.08)',
    shadow: 'shadow-[0_14px_34px_rgba(140,150,165,0.08)]',
    darkShadow: 'dark:shadow-[0_15px_40px_rgba(0,0,0,0.45),0_0_40px_rgba(140,150,165,0.08)]',
    hoverShadow: 'hover:shadow-[0_18px_40px_rgba(140,150,165,0.14)]',
    darkHoverShadow: 'dark:hover:shadow-[0_18px_40px_rgba(0,0,0,0.5),0_0_50px_rgba(140,150,165,0.12)]',
    headerBorder: 'border-[rgba(166,174,184,.30)] dark:border-[rgba(255,255,255,.06)]',
    accentText: 'text-[#4B5563]',
    countBg: 'bg-[rgba(166,174,184,0.18)] dark:bg-[rgba(166,174,184,0.16)]',
  },
};

const STORAGE_KEY = 'crm_pipeline_filter';

function HealthBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; label: string; icon: any }> = {
    HOT: { color: 'badge-success', label: 'Hot', icon: Flame },
    STUCK: { color: 'badge-warning', label: 'Stuck', icon: AlertTriangle },
    AT_RISK: { color: 'badge-error', label: 'At Risk', icon: AlertTriangle },
  };
  const c = config[status] || config.STUCK;
  const Icon = c.icon;
  return (
    <span className={`${c.color} text-[9px] font-bold inline-flex items-center gap-1`}>
      <Icon className="w-2.5 h-2.5" /> {c.label}
    </span>
  );
}

export default function SalesPipelineView({ stages: _stages, deals: _deals, refetchDeals, addToast }: {
  stages: any[]; deals: any[]; refetchDeals: () => void; addToast?: (type: 'success' | 'error' | 'info', msg: string) => void;
}) {
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState('My Deals');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [healthFilter, setHealthFilter] = useState('All Health');
  const [hoveredDeal, setHoveredDeal] = useState<string | null>(null);
  const [pipelineOpen, setPipelineOpen] = useState(false);
  const pipelineRef = useRef<HTMLDivElement>(null);

  const [pipelineFilter, setPipelineFilter] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem(STORAGE_KEY) || 'All Pipelines';
    return 'All Pipelines';
  });

  const setPipeline = (p: string) => {
    setPipelineFilter(p);
    localStorage.setItem(STORAGE_KEY, p);
    setPipelineOpen(false);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (pipelineRef.current && !pipelineRef.current.contains(e.target as Node)) setPipelineOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const getFilteredDeals = (): Record<string, Deal[]> => {
    const grouped: Record<string, Deal[]> = {};
    for (const stage of stageConfigs) grouped[stage.id] = [];

    const stageMap: Record<string, string> = {};
    for (const s of _stages || []) stageMap[s.id] = s.name;

    const reverseStageMap: Record<string, string> = {};
    for (const s of stageConfigs) {
      for (const [dbId, dbName] of Object.entries(stageMap)) {
        if (dbName.toLowerCase() === s.name.toLowerCase()) {
          reverseStageMap[dbId] = s.id;
          break;
        }
      }
    }

    let filtered = [...(_deals || [])];

    // Pipeline filter
    if (pipelineFilter === 'Direct Sales') {
      filtered = filtered.filter(d => d.pipeline?.name === 'Direct Sales');
    } else if (pipelineFilter === 'Partner Sales') {
      filtered = filtered.filter(d => d.pipeline?.name === 'Partner Sales');
    }

    // Health filter
    if (healthFilter !== 'All Health') {
      filtered = filtered.filter(d => d.aiHealthStatus === healthFilter.toUpperCase().replace(' ', '_'));
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(d =>
        d.name?.toLowerCase().includes(q) ||
        d.contact?.name?.toLowerCase().includes(q) ||
        d.company?.toLowerCase().includes(q)
      );
    }

    // Saved view filters
    if (selectedView === 'At Risk') {
      filtered = filtered.filter(d => d.aiHealthStatus === 'AT_RISK');
    } else if (selectedView === 'Closing This Month') {
      const now = new Date();
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      filtered = filtered.filter(d => {
        if (!d.expectedCloseDate) return false;
        const closeDate = new Date(d.expectedCloseDate);
        return closeDate >= now && closeDate <= endOfMonth;
      });
    } else if (selectedView === 'High Value') {
      const allValues = filtered.map(d => d.value).filter(Boolean);
      const sorted = [...allValues].sort((a, b) => b - a);
      const top25 = sorted[Math.ceil(sorted.length * 0.25) - 1] || 0;
      filtered = filtered.filter(d => d.value >= top25);
    } else if (selectedView === 'Recently Updated') {
      filtered = [...filtered].sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime());
    }

    for (const deal of filtered) {
      const mappedStageId = reverseStageMap[deal.stageId] || deal.stageId;
      const target = stageConfigs.find(s => s.id === mappedStageId);
      if (target) {
        if (!grouped[target.id]) grouped[target.id] = [];
        grouped[target.id].push({
          id: deal.id,
          name: deal.name,
          value: deal.value || 0,
          ageDays: deal.ageDays || 0,
          winProb: deal.probability || 0,
          aiHealthStatus: deal.aiHealthStatus || 'HOT',
          contact: deal.contact || undefined,
          company: deal.company || deal.contact?.companyName || '',
          stageId: target.id,
          pipeline: deal.pipeline,
        });
      }
    }

    return grouped;
  };

  const filteredStageDeals = useMemo(() => getFilteredDeals(), [_deals, pipelineFilter, healthFilter, searchQuery, selectedView, _stages]);

  const allFilteredDeals = useMemo(() =>
    Object.values(filteredStageDeals).flat(),
    [filteredStageDeals]
  );

  const totalPipeline = useMemo(() =>
    allFilteredDeals.reduce((s, d) => s + d.value, 0),
    [allFilteredDeals]
  );

  const openDealsCount = useMemo(() =>
    allFilteredDeals.filter(d => d.winProb > 0 && d.winProb < 100).length,
    [allFilteredDeals]
  );

  const forecastRevenue = useMemo(() => {
    const negotiating = filteredStageDeals['negotiation'] || [];
    const proposal = filteredStageDeals['proposal'] || [];
    return negotiating.reduce((s, d) => s + d.value * (d.winProb / 100), 0) +
      proposal.reduce((s, d) => s + d.value * (d.winProb / 100), 0);
  }, [filteredStageDeals]);

  const avgDealSize = useMemo(() =>
    allFilteredDeals.length > 0 ? Math.round(totalPipeline / allFilteredDeals.length) : 0,
    [totalPipeline, allFilteredDeals]
  );

  const wonDeals = useMemo(() => filteredStageDeals['won'] || [], [filteredStageDeals]);
  const lostDeals = useMemo(() => filteredStageDeals['lost'] || [], [filteredStageDeals]);
  const totalDealsCount = allFilteredDeals.length;
  const winRate = useMemo(() =>
    (wonDeals.length + lostDeals.length) > 0
      ? Math.round((wonDeals.length / Math.max(1, wonDeals.length + lostDeals.length)) * 100)
      : 0,
    [wonDeals, lostDeals]
  );

  const allDealsCount = useMemo(() => {
    const all = getFilteredDeals();
    return Object.values(all).flat().length;
  }, [_deals, pipelineFilter]);

  const handleDragStart = (dealId: string) => {
    setDraggedDealId(dealId);
    setTimeout(() => document.getElementById(`deal-${dealId}`)?.classList.add('dragging'), 0);
  };
  const handleDragEnd = () => {
    if (draggedDealId) document.getElementById(`deal-${draggedDealId}`)?.classList.remove('dragging');
    setDraggedDealId(null);
  };
  const handleDrop = async (stageId: string) => {
    setDragOverStage(null);
    if (!draggedDealId) return;
    try {
      await fetch('/api/crm', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'update_deal_stage', data: { dealId: draggedDealId, stageId } }) });
      refetchDeals();
      addToast?.('success', `Deal moved to ${stageConfigs.find(s => s.id === stageId)?.name || stageId}`);
    } catch (_) { addToast?.('error', 'Failed to move deal'); } finally { setDraggedDealId(null); }
  };

  const winProbColor = (p: number) =>
    p >= 70 ? 'text-success' : p >= 40 ? 'text-warning' : 'text-text-muted';

  const stageTotal = (stageId: string) => (filteredStageDeals[stageId] || []).reduce((s: number, d: Deal) => s + d.value, 0);

  // AI Review Intelligence insights
  const hotCount = useMemo(() => allFilteredDeals.filter(d => d.aiHealthStatus === 'HOT').length, [allFilteredDeals]);
  const atRiskCount = useMemo(() => allFilteredDeals.filter(d => d.aiHealthStatus === 'AT_RISK').length, [allFilteredDeals]);
  const stuckCount = useMemo(() => allFilteredDeals.filter(d => d.aiHealthStatus === 'STUCK').length, [allFilteredDeals]);
  const opportunityValue = useMemo(() => {
    const open = allFilteredDeals.filter(d => d.winProb > 0 && d.winProb < 100);
    return open.reduce((s, d) => s + d.value * (d.winProb / 100), 0);
  }, [allFilteredDeals]);

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      {/* ── Top Revenue KPI Row ────────────────────────── */}
      <div className="grid grid-cols-5 gap-3 shrink-0">
        {[
          { icon: DollarSign, label: 'Total Pipeline', value: `₹${(totalPipeline / 10000000).toFixed(1)}Cr`, trend: '+12%', color: 'text-accent' },
          { icon: BarChart3, label: 'Open Deals', value: String(openDealsCount), trend: pipelineFilter === 'All Pipelines' ? `${_deals?.length || 0} total` : `${allFilteredDeals.length} in filter`, color: 'text-info' },
          { icon: Target, label: 'Forecast Revenue', value: `₹${(forecastRevenue / 100000).toFixed(0)}L`, trend: '82% confidence', color: 'text-success' },
          { icon: TrendingUp, label: 'Avg Deal Size', value: `₹${(avgDealSize / 1000).toFixed(0)}K`, trend: `${allFilteredDeals.length} deals`, color: 'text-accent' },
          { icon: Target, label: 'Win Rate', value: `${winRate}%`, trend: '+4% this quarter', color: 'text-success' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-surface-card border border-border-default rounded-[12px] px-4 py-3 hover:shadow-[var(--shadow-card-hov)] transition-shadow">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider">{kpi.label}</span>
              <kpi.icon className={`w-3.5 h-3.5 ${kpi.color}`} />
            </div>
            <div className="text-lg font-bold text-text-primary">{kpi.value}</div>
            <span className="text-[10px] font-semibold text-success flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight className="w-2.5 h-2.5" /> {kpi.trend}
            </span>
          </div>
        ))}
      </div>

      {/* ── AI Revenue Intelligence + Smart Filters ──────── */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="bg-surface-card dark:bg-sidebar text-text-primary dark:text-white border-border-default dark:border-sidebar-hover rounded-[12px] px-4 py-2.5 flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-xs font-bold text-text-primary dark:text-white">AI Revenue Intelligence</span>
          </div>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-warning" /> {hotCount} hot</span>
            <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-error" /> {atRiskCount} risk</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-text-muted" /> {stuckCount} inactive</span>
            <span className="flex items-center gap-1 text-accent">₹{(opportunityValue / 100000).toFixed(1)}L opportunity</span>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] font-medium text-text-muted dark:text-sidebar-text-muted border-l border-border-default dark:border-sidebar-hover pl-3">
            <ShieldCheck className="w-3 h-3 text-success" />
            <span>Pipeline: {totalPipeline > 0 ? 'Excellent' : 'No data'}</span>
          </div>
        </div>
      </div>

      {/* ── Premium Filter Container ──────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#E9FBF7] via-[#E2F8F2] to-[#D8F5EF] dark:from-[#172136] dark:via-[#1D2940] dark:to-[#22314A] border-2 border-[#57C7B7] dark:border-[rgba(72,187,171,.25)] rounded-[22px] p-5 shadow-[0_16px_40px_rgba(16,185,129,0.1)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.45),0_0_40px_rgba(20,184,166,0.08)] shrink-0">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none dark:hidden" style={{ background: 'radial-gradient(circle at top right, rgba(20,184,166,0.12), transparent 45%)' }} />
        <div className="hidden dark:block absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle at top right, rgba(20,184,166,0.14), transparent 45%)' }} />
        <div className="relative z-10 flex flex-col gap-3">
          {/* Saved View Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {savedViews.map((view) => (
              <button
                key={view}
                onClick={() => setSelectedView(view)}
                className={`h-[34px] px-3.5 text-[11px] font-semibold rounded-full transition-all duration-200 ease ${
                  selectedView === view
                    ? 'bg-gradient-to-r from-[#14B8A6] to-[#0F766E] text-white shadow-sm'
                    : 'bg-white/90 dark:bg-[#1E293B]/90 border border-[#D7E4E0] dark:border-[#2D3A4A] text-[#475467] dark:text-sidebar-text hover:bg-[#F4FBF8] dark:hover:bg-[#1A2A3A] hover:border-[#14B8A6]'
                }`}
              >
                {view}
              </button>
            ))}
          </div>

          {/* Search + Dropdowns Row */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-icon" />
              <input
                type="text"
                placeholder="Search deals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 bg-white dark:bg-[#1E293B] border border-[#D7E4E0] dark:border-[#2D3A4A] rounded-[14px] pl-9 pr-3.5 py-2 text-xs outline-none text-text-primary placeholder:text-text-muted transition-all duration-200 focus:border-[#14B8A6] focus:shadow-[0_0_0_4px_rgba(20,184,166,0.12)]"
              />
            </div>
            {/* Pipeline Dropdown */}
            <div className="relative" ref={pipelineRef}>
              <button
                onClick={() => setPipelineOpen(!pipelineOpen)}
                className="h-11 bg-white dark:bg-[#1E293B] border border-[#D7E4E0] dark:border-[#2D3A4A] rounded-[14px] px-3.5 text-xs font-semibold text-[#475467] dark:text-sidebar-text outline-none transition-all duration-200 cursor-pointer hover:border-[#14B8A6] flex items-center gap-2 min-w-[140px]"
              >
                <Filter className="w-3.5 h-3.5 text-icon shrink-0" />
                <span className="truncate flex-1 text-left">{pipelineFilter}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-icon transition-transform duration-200 ${pipelineOpen ? 'rotate-180' : ''}`} />
              </button>
              {pipelineOpen && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-[#1E293B] border border-[#D7E4E0] dark:border-[#2D3A4A] rounded-[12px] shadow-dropdown z-50 py-1 overflow-hidden animate-fadeIn">
                  {pipelines.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPipeline(p)}
                      className={`w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold transition-all duration-150 ${
                        pipelineFilter === p
                          ? 'text-[#14B8A6] bg-[rgba(20,184,166,0.06)]'
                          : 'text-[#475467] dark:text-sidebar-text hover:bg-[#F4FBF8] dark:hover:bg-[#1A2A3A]'
                      }`}
                    >
                      <span className={`w-4 h-4 flex items-center justify-center transition-all duration-200 ${
                        pipelineFilter === p ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                      }`}>
                        <Check className="w-3.5 h-3.5" />
                      </span>
                      <span>{p}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <select className="h-11 bg-white dark:bg-[#1E293B] border border-[#D7E4E0] dark:border-[#2D3A4A] rounded-[14px] px-3.5 text-xs font-semibold text-[#475467] dark:text-sidebar-text outline-none transition-all duration-200 cursor-pointer hover:border-[#14B8A6] focus:border-[#14B8A6] focus:shadow-[0_0_0_4px_rgba(20,184,166,0.12)]">
              <option>All Health</option>
              <option>Hot</option>
              <option>At Risk</option>
              <option>Stuck</option>
            </select>
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className={`h-11 w-11 flex items-center justify-center rounded-[14px] transition-all duration-200 border-2 ${
                showAnalytics
                  ? 'bg-white dark:bg-[#1E293B] border-[#14B8A6] text-[#14B8A6] shadow-[0_0_0_4px_rgba(20,184,166,0.12)]'
                  : 'bg-white/90 dark:bg-[#1E293B]/90 border-[#D7E4E0] dark:border-[#2D3A4A] text-[#475467] dark:text-sidebar-text hover:border-[#14B8A6]'
              }`}
              title="Toggle Analytics Panel"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Kanban Pipeline + Analytics Panel ───────────── */}
      <div className="flex-1 flex gap-4 overflow-hidden min-h-0">
        {/* Pipeline Stages */}
        <div className="flex-1 flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {allFilteredDeals.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-3 animate-fadeIn">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#E9FBF7] dark:bg-[#1A2A3A] flex items-center justify-center">
                  <Filter className="w-7 h-7 text-[#14B8A6]" />
                </div>
                <p className="text-sm font-bold text-text-primary">No deals found{pipelineFilter !== 'All Pipelines' ? ` in ${pipelineFilter}` : ''}.</p>
                <p className="text-xs text-text-muted max-w-xs">Try switching pipelines or adjusting your filters to discover deals.</p>
                <button
                  onClick={() => addToast?.('info', 'Create a new deal from the top navbar')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#14B8A6] to-[#0F766E] text-white text-xs font-semibold rounded-full hover:shadow-lg transition-all duration-200"
                >
                  <Plus className="w-3.5 h-3.5" /> Create Deal
                </button>
              </div>
            </div>
          ) : (
            stageConfigs.map((stage) => {
            const deals = filteredStageDeals[stage.id] || [];
            const total = stageTotal(stage.id);
            const theme = stageThemes[stage.id];

            return (
              <div
                key={stage.id}
                onDragOver={(e) => { e.preventDefault(); setDragOverStage(stage.id); }}
                onDragLeave={() => setDragOverStage(null)}
                onDrop={() => handleDrop(stage.id)}
                className={`w-64 shrink-0 relative overflow-hidden bg-gradient-to-br ${theme.gradient} ${theme.darkGradient} border-2 rounded-[22px] p-3.5 flex flex-col transition-all duration-[250ms] ease ${theme.shadow} ${theme.darkShadow} hover:-translate-y-0.5 ${theme.hoverShadow} ${theme.darkHoverShadow} ${
                  dragOverStage === stage.id ? 'border-accent dark:border-accent' : theme.border
                }`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none dark:hidden" style={{ background: `radial-gradient(circle at top right, ${theme.glowLight}, transparent 45%)` }} />
                <div className="hidden dark:block absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle at top right, ${theme.glowDark}, transparent 45%)` }} />
                <div className={`relative z-10 p-3 border-b ${theme.headerBorder}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold ${theme.accentText} dark:text-white/90 flex items-center gap-1.5`}>
                      <span className={`w-2 h-2 rounded-full inline-block ${theme.countBg}`} />
                      {stage.name}
                    </span>
                    <span className={`text-[9px] font-semibold ${theme.accentText} ${theme.countBg} px-1.5 py-0.5 rounded`}>{deals.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-semibold text-text-secondary dark:text-[rgba(255,255,255,.72)]">
                    <span>₹{(total / 1000).toFixed(0)}K</span>
                    <span className="text-[10px] text-text-muted dark:text-[rgba(255,255,255,.72)]">{stage.probability}%</span>
                  </div>
                </div>

                <div className="flex-1 p-2 space-y-2 overflow-y-auto no-scrollbar min-h-[200px]">
                  {deals.map((deal) => (
                    <div
                      key={deal.id}
                      id={`deal-${deal.id}`}
                      draggable
                      onDragStart={() => handleDragStart(deal.id)}
                      onDragEnd={handleDragEnd}
                      onMouseEnter={() => setHoveredDeal(deal.id)}
                      onMouseLeave={() => setHoveredDeal(null)}
                      className="bg-surface-card border border-border-default rounded-[10px] p-3 cursor-grab active:cursor-grabbing hover:shadow-[var(--shadow-card-hov)] transition-all duration-150 relative group"
                    >
                      {/* Deal Name + Company */}
                      <div className="flex items-start gap-2 mb-2">
                        <GripVertical className="w-3 h-3 text-icon/30 shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-text-primary leading-snug line-clamp-2">{deal.name}</p>
                          <p className="text-[10px] text-text-muted mt-0.5">{deal.company}</p>
                        </div>
                      </div>

                      {/* Contact */}
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <div className="w-5 h-5 rounded-full bg-surface-bg-alt flex items-center justify-center text-[7px] font-bold text-text-secondary">
                          {deal.contact?.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-[10px] text-text-secondary font-medium">{deal.contact?.name}</span>
                      </div>

                      {/* Key Metrics Row */}
                      <div className="flex items-center justify-between text-[11px] font-bold mb-2">
                        <span className="text-text-primary">₹{(deal.value / 1000).toFixed(1)}K</span>
                        <span className={winProbColor(deal.winProb)}>{deal.winProb}%</span>
                      </div>

                      {/* AI Health + Age */}
                      <div className="flex items-center justify-between">
                        <HealthBadge status={deal.aiHealthStatus} />
                        <span className="text-[9px] text-text-muted font-medium flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" /> {deal.ageDays}d
                        </span>
                      </div>

                      {/* WhatsApp Status */}
                      {deal.lastWhatsApp && (
                        <div className="mt-2 pt-2 border-t border-border-default/50 flex items-center justify-between text-[9px]">
                          <span className="flex items-center gap-1 text-text-muted">
                            <MessageSquare className="w-2.5 h-2.5" /> {deal.lastWhatsApp}
                          </span>
                          <span className={`font-semibold ${deal.customerReplied ? 'text-success' : 'text-warning'}`}>
                            {deal.customerReplied ? 'Replied' : 'Pending'}
                          </span>
                        </div>
                      )}

                      {/* AI Coaching - visible on hover */}
                      {hoveredDeal === deal.id && deal.aiCoaching && (
                        <div className="mt-2 pt-2 border-t border-border-default/50">
                          <div className="flex items-start gap-1.5">
                            <Bot className="w-3 h-3 text-accent shrink-0 mt-0.5" />
                            <p className="text-[9px] text-accent font-medium leading-relaxed">{deal.aiCoaching}</p>
                          </div>
                        </div>
                      )}

                      {/* Quick Actions - visible on hover */}
                      {hoveredDeal === deal.id && (
                        <div className="mt-2 pt-2 border-t border-border-default/50 flex items-center gap-1">
                          <button className="flex-1 text-[9px] font-semibold text-text-secondary hover:text-accent bg-surface-bg-alt/50 hover:bg-accent/10 rounded-md py-1 transition-colors">
                            <Phone className="w-2.5 h-2.5 mx-auto" />
                          </button>
                          <button className="flex-1 text-[9px] font-semibold text-text-secondary hover:text-accent bg-surface-bg-alt/50 hover:bg-accent/10 rounded-md py-1 transition-colors">
                            <MessageSquare className="w-2.5 h-2.5 mx-auto" />
                          </button>
                          <button className="flex-1 text-[9px] font-semibold text-text-secondary hover:text-accent bg-surface-bg-alt/50 hover:bg-accent/10 rounded-md py-1 transition-colors">
                            <Mail className="w-2.5 h-2.5 mx-auto" />
                          </button>
                          <button className="flex-1 text-[9px] font-semibold text-text-secondary hover:text-accent bg-surface-bg-alt/50 hover:bg-accent/10 rounded-md py-1 transition-colors">
                            <Calendar className="w-2.5 h-2.5 mx-auto" />
                          </button>
                          <button className="flex-1 text-[9px] font-semibold text-accent bg-accent/10 hover:bg-accent/20 rounded-md py-1 transition-colors">
                            <ArrowRight className="w-2.5 h-2.5 mx-auto" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Smart Empty State */}
                  {deals.length === 0 && (
                    <div className="border border-dashed border-border-default rounded-[10px] p-4 text-center space-y-1.5">
                      <p className="text-[10px] font-medium text-text-muted">No deals yet</p>
                      <p className="text-[9px] text-text-muted/60">Conversion from previous stage: ~{stage.probability - (stageConfigs[Math.max(0, stageConfigs.indexOf(stage) - 1)]?.probability || 0)}%</p>
                    </div>
                  )}
                </div>
              </div>
            );
          }))}
        </div>

        {/* Right: Pipeline Analytics Panel */}
        {showAnalytics && (
          <div className="w-64 shrink-0 bg-surface-card border border-border-default rounded-[12px] flex flex-col overflow-hidden">
            <div className="p-3.5 border-b border-border-default flex items-center justify-between">
              <h3 className="text-xs font-bold text-text-primary">Pipeline Analytics</h3>
              <button onClick={() => setShowAnalytics(false)} className="text-text-muted hover:text-text-primary">
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar p-3.5 space-y-4">
              {/* Revenue Forecast */}
              <div>
                <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Revenue Forecast</h4>
                <div className="bg-surface-bg-alt rounded-lg p-3 space-y-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-text-secondary">Likely</span>
                    <span className="font-bold text-text-primary">₹18.2L</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-text-secondary">Best Case</span>
                    <span className="font-bold text-success">₹25.7L</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-text-secondary">Worst Case</span>
                    <span className="font-bold text-warning">₹11.3L</span>
                  </div>
                </div>
                <div className="h-1.5 bg-surface-bg-alt rounded-full mt-2 overflow-hidden">
                  <div className="h-full w-[55%] bg-accent rounded-full" />
                </div>
              </div>

              {/* Deal Velocity */}
              <div>
                <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Deal Velocity</h4>
                <div className="bg-surface-bg-alt rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-text-primary">24</div>
                  <div className="text-[10px] text-text-muted">Avg sales cycle (days)</div>
                </div>
              </div>

              {/* Stage Conversion */}
              <div>
                <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Stage Conversion</h4>
                <div className="space-y-2">
                  {[
                    { label: 'Lead → Meeting', value: 68 },
                    { label: 'Meeting → Proposal', value: 54 },
                    { label: 'Proposal → Negotiation', value: 41 },
                    { label: 'Negotiation → Won', value: 35 },
                  ].map((conv) => (
                    <div key={conv.label}>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-text-secondary">{conv.label}</span>
                        <span className="font-semibold text-text-primary">{conv.value}%</span>
                      </div>
                      <div className="h-1 bg-surface-bg-alt rounded-full overflow-hidden">
                        <div className="h-full bg-accent rounded-full" style={{ width: `${conv.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Recommendation */}
              <div className="bg-accent/[0.03] border border-accent/10 rounded-lg p-3 space-y-1">
                <div className="flex items-center gap-1.5">
                  <Bot className="w-3 h-3 text-accent" />
                  <span className="text-[10px] font-semibold text-text-primary">AI Recommendation</span>
                </div>
                <p className="text-[10px] text-text-muted leading-relaxed">Focus on negotiation stage deals. 2 deals at risk need immediate attention.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useStore } from '@/lib/store';
import {
  Globe,
  LayoutDashboard,
  MessageSquare,
  UserPlus,
  Users,
  Building2,
  DollarSign,
  CheckSquare,
  Calendar,
  Phone,
  Bot,
  Workflow,
  BarChart3,
  Puzzle,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Volume2,
  X,
  PhoneOff,
  Moon,
  Sun,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Info,
  Menu,
  Lightbulb,
  Target,
  Inbox,
  Zap
} from 'lucide-react';

import DashboardView from '@/components/console/DashboardView';
import LeadManagementView from '@/components/console/LeadManagementView';
import SalesPipelineView from '@/components/console/SalesPipelineView';
import WhatsAppCRMView from '@/components/console/WhatsAppCRMView';
import TelephonyView from '@/components/console/TelephonyView';
import AICopilotView from '@/components/console/AICopilotView';
import WorkflowBuilderView from '@/components/console/WorkflowBuilderView';
import AnalyticsView from '@/components/console/AnalyticsView';
import TasksActivitiesView from '@/components/console/TasksActivitiesView';
import MeetingsView from '@/components/console/MeetingsView';
import SettingsView from '@/components/console/SettingsView';
import CompaniesView from '@/components/console/CompaniesView';
import LeadInsightsView from '@/components/console/LeadInsightsView';
import FollowUpSuggestionsView from '@/components/console/FollowUpSuggestionsView';

function SidebarNavItem({ icon: Icon, label, isActive, collapsed, onClick, badge }: {
  icon: any; label: string; isActive?: boolean; collapsed?: boolean; onClick: () => void; badge?: string | number;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all duration-150 group ${
        isActive
          ? 'bg-sidebar-hover text-white'
          : 'text-sidebar-text/80 hover:text-white hover:bg-sidebar-hover/60'
      }`}
      title={collapsed ? label : undefined}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-accent rounded-full" />
      )}
      <Icon className="w-3.5 h-3.5 shrink-0" />
      {!collapsed && (
        <>
          <span className="truncate">{label}</span>
          {badge !== undefined && (
            <span className="ml-auto text-[9px] font-semibold bg-accent/15 text-accent/90 px-1.5 py-0.5 rounded">
              {badge}
            </span>
          )}
        </>
      )}
    </button>
  );
}

function SidebarGroup({ icon: Icon, label, defaultOpen, collapsed, children }: {
  icon: any; label: string; defaultOpen?: boolean; collapsed?: boolean; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen ?? true);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-all duration-150 text-sidebar-text-muted/70 hover:text-sidebar-text hover:bg-sidebar-hover/40 ${
          collapsed ? 'justify-center' : ''
        }`}
        title={collapsed ? label : undefined}
      >
        <Icon className="w-3 h-3 shrink-0" />
        {!collapsed && (
          <>
            <span className="truncate">{label}</span>
            <ChevronDown className={`w-3 h-3 ml-auto transition-transform duration-200 ${open ? 'rotate-0' : '-rotate-90'}`} />
          </>
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-150 ease-in-out ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className={collapsed ? '' : 'pl-3 space-y-px mt-0.5'}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function ConsolePage() {
  const { 
    activeTab, 
    setActiveTab, 
    copilotOpen, 
    toggleCopilot, 
    copilotMessages, 
    sendCopilotMessage,
    globalDialerOpen, 
    closeDialer, 
    activeCallNumber, 
    activeCallName, 
    activeCallState, 
    callDuration, 
    callSentiment, 
    callTranscript, 
    tickCallDuration,
    isMobileFrame,
    toggleMobileFrame
  } = useStore();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [copilotInput, setCopilotInput] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const [stats, setStats] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [stages, setStages] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Toast notifications
  const [toasts, setToasts] = useState<Array<{id: string; type: 'success' | 'error' | 'info'; message: string}>>([]);

  const addToast = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, leadsRes, dealsRes, stagesRes, actRes, wfRes, intRes] = await Promise.all([
        fetch('/api/crm'),
        fetch('/api/crm?collection=leads'),
        fetch('/api/crm?collection=deals'),
        fetch('/api/crm?collection=stages'),
        fetch('/api/crm?collection=activities'),
        fetch('/api/crm?collection=workflows'),
        fetch('/api/crm?collection=integrations'),
      ]);
      setStats(await statsRes.json());
      setLeads(await leadsRes.json());
      setDeals(await dealsRes.json());
      setStages(await stagesRes.json());
      setActivities(await actRes.json());
      setWorkflows(await wfRes.json());
      setIntegrations(await intRes.json());
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    let timer: any;
    if (activeCallState === 'connected') {
      timer = setInterval(() => tickCallDuration(), 1000);
    }
    return () => clearInterval(timer);
  }, [activeCallState, tickCallDuration]);

  const handleCopilotSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotInput.trim()) return;
    sendCopilotMessage(copilotInput);
    setCopilotInput('');
  };

  const toggleDark = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const navigate = (tab: string) => {
    setActiveTab(tab);
    if (isMobileFrame) toggleMobileFrame();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-surface-bg text-text-primary">
      
      {/* Skip to content */}
      <a href="#main-content" className="skip-link" aria-label="Skip to main content">
        Skip to content
      </a>

      {/* Mobile sidebar backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden animate-fadeIn"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        role="navigation"
        aria-label="Main navigation"
        className={`bg-sidebar text-white border-r border-sidebar-hover flex flex-col transition-all duration-300 z-30 shrink-0 ${
          sidebarCollapsed ? 'w-16' : 'w-56 lg:w-60'
        } ${
          mobileSidebarOpen ? 'fixed inset-y-0 left-0 w-56 z-30' : 'hidden lg:flex'
        }`}
      >
        {/* Logo */}
        <div className="h-12 border-b border-sidebar-hover/30 px-3 flex items-center justify-between shrink-0">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center text-white">
                <Globe className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-sm tracking-tight text-white/90">
                LeadSphere
              </span>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center text-white mx-auto">
              <Globe className="w-3.5 h-3.5" />
            </div>
          )}
          <button
            onClick={() => { setSidebarCollapsed(!sidebarCollapsed); if (mobileSidebarOpen) setMobileSidebarOpen(false); }}
            className="p-1 hover:bg-sidebar-hover/50 rounded text-sidebar-text-muted/50 hover:text-sidebar-text-muted hidden md:block transition-colors"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2.5 px-2 space-y-px no-scrollbar">
          
          {/* Dashboard */}
          <SidebarNavItem
            icon={LayoutDashboard}
            label="Dashboard"
            isActive={activeTab === 'dashboard'}
            collapsed={sidebarCollapsed}
            onClick={() => navigate('dashboard')}
          />

          {/* WhatsApp */}
          <SidebarNavItem
            icon={MessageSquare}
            label="WhatsApp"
            isActive={activeTab === 'whatsapp'}
            collapsed={sidebarCollapsed}
            onClick={() => navigate('whatsapp')}
            badge={3}
          />

          <div className="my-1.5 border-t border-sidebar-hover/30" />

          {/* Flat pipeline items */}
          <SidebarNavItem
            icon={Users}
            label="Leads"
            isActive={activeTab === 'leads'}
            collapsed={sidebarCollapsed}
            onClick={() => navigate('leads')}
          />
          <SidebarNavItem
            icon={Building2}
            label="Companies"
            isActive={activeTab === 'accounts'}
            collapsed={sidebarCollapsed}
            onClick={() => navigate('accounts')}
          />
          <SidebarNavItem
            icon={DollarSign}
            label="Deals"
            isActive={activeTab === 'deals'}
            collapsed={sidebarCollapsed}
            onClick={() => navigate('deals')}
          />

          <div className="my-1.5 border-t border-sidebar-hover/30" />

          <SidebarNavItem
            icon={CheckSquare}
            label="Tasks"
            isActive={activeTab === 'tasks'}
            collapsed={sidebarCollapsed}
            onClick={() => navigate('tasks')}
          />
          <SidebarNavItem
            icon={Calendar}
            label="Meetings"
            isActive={activeTab === 'meetings'}
            collapsed={sidebarCollapsed}
            onClick={() => navigate('meetings')}
          />
          <div className="my-2 border-t border-sidebar-hover/50" />

          {/* AI Group */}
          <SidebarGroup
            icon={Bot}
            label="AI"
            defaultOpen={true}
            collapsed={sidebarCollapsed}
          >
            <SidebarNavItem
              icon={Sparkles}
              label="Copilot"
              isActive={activeTab === 'copilot'}
              collapsed={sidebarCollapsed}
              onClick={() => navigate('copilot')}
            />
            <SidebarNavItem
              icon={Lightbulb}
              label="Lead Insights"
              isActive={activeTab === 'lead-insights'}
              collapsed={sidebarCollapsed}
              onClick={() => navigate('lead-insights')}
            />
            <SidebarNavItem
              icon={Target}
              label="Follow-up Suggestions"
              isActive={activeTab === 'followup-suggestions'}
              collapsed={sidebarCollapsed}
              onClick={() => navigate('followup-suggestions')}
            />
          </SidebarGroup>

          <div className="my-2 border-t border-sidebar-hover/50" />

          {/* Reports */}
          <SidebarNavItem
            icon={BarChart3}
            label="Reports"
            isActive={activeTab === 'reports'}
            collapsed={sidebarCollapsed}
            onClick={() => navigate('reports')}
          />

          {/* Settings (with Integrations inside) */}
          <SidebarNavItem
            icon={Settings}
            label="Settings"
            isActive={activeTab === 'settings'}
            collapsed={sidebarCollapsed}
            onClick={() => navigate('settings')}
          />
        </nav>

        {/* User */}
        <div className="px-3 py-2.5 border-t border-sidebar-hover/50 flex items-center gap-2.5 shrink-0">
          <div className="w-6 h-6 rounded-md bg-sidebar-hover text-sidebar-text-muted font-semibold flex items-center justify-center text-[9px] shrink-0">
            SC
          </div>
          {!sidebarCollapsed && (
            <div className="overflow-hidden min-w-0">
              <div className="text-xs font-medium text-white/90 truncate">Sarah Connor</div>
              <div className="text-[10px] text-sidebar-text-muted/60 truncate">Admin</div>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Top Navbar */}
        <header className="h-12 border-b border-border-default/60 bg-surface-card px-4 lg:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-1.5 -ml-1.5 text-text-secondary hover:text-text-primary rounded-md transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold text-text-primary truncate hidden sm:inline">
              {stats?.organizationName || 'Acme Manufacturing Corp'}
            </span>
            <div className="h-3 w-px bg-border-default/40 hidden sm:block" />
            <span className="text-xs text-text-muted font-medium capitalize truncate">
              {activeTab === 'dashboard' ? 'Dashboard' : activeTab}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => navigate('leads')}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium text-text-secondary hover:text-text-primary hover:bg-surface-bg-alt transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>New Lead</span>
            </button>
            <button
              onClick={() => navigate('deals')}
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium text-text-secondary hover:text-text-primary hover:bg-surface-bg-alt transition-colors"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>New Deal</span>
            </button>
            <button
              onClick={() => navigate('whatsapp')}
              className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium text-text-secondary hover:text-text-primary hover:bg-surface-bg-alt transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Send WhatsApp</span>
            </button>

            <div className="w-px h-4 bg-border-default mx-1 hidden sm:block" />

            <button
              onClick={toggleDark}
              className="p-1.5 rounded-md text-icon hover:text-text-primary hover:bg-surface-bg-alt transition-colors"
              title="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={toggleCopilot}
              className="bg-accent hover:bg-accent-hover text-white px-2.5 py-1.5 rounded-md text-[11px] font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Sparkles className="w-3 h-3" />
              <span className="hidden sm:inline">AI Copilot</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main id="main-content" className="flex-1 overflow-y-auto p-4 lg:p-6 no-scrollbar">
          {loading ? (
            <div className="space-y-5">
              <div className="h-8 w-48 animate-shimmer rounded-lg" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="rounded-xl border border-border-default p-5 space-y-3">
                    <div className="h-4 w-20 animate-shimmer rounded" />
                    <div className="h-8 w-28 animate-shimmer rounded" />
                    <div className="h-4 w-16 animate-shimmer rounded" />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 rounded-xl border border-border-default p-5 space-y-4">
                  <div className="h-5 w-36 animate-shimmer rounded" />
                  <div className="h-64 animate-shimmer rounded" />
                </div>
                <div className="rounded-xl border border-border-default p-5 space-y-4">
                  <div className="h-5 w-28 animate-shimmer rounded" />
                  <div className="h-48 animate-shimmer rounded" />
                </div>
              </div>
            </div>
          ) : (
            <div key={activeTab} className="page-enter">
              {activeTab === 'dashboard' && <DashboardView stats={stats} leads={leads} />}
              {activeTab === 'whatsapp' && <WhatsAppCRMView addToast={addToast} />}
              {activeTab === 'leads' && <LeadManagementView leads={leads} refetchLeads={fetchData} />}
              {activeTab === 'accounts' && <CompaniesView />}
              {activeTab === 'deals' && <SalesPipelineView stages={stages} deals={deals} refetchDeals={fetchData} addToast={addToast} />}
              {activeTab === 'tasks' && <TasksActivitiesView />}
              {activeTab === 'meetings' && <MeetingsView />}
              {activeTab === 'calls' && <TelephonyView activities={activities} />}
              {activeTab === 'copilot' && <AICopilotView />}
              {activeTab === 'lead-insights' && <LeadInsightsView />}
              {activeTab === 'followup-suggestions' && <FollowUpSuggestionsView />}
              {activeTab === 'reports' && <AnalyticsView />}
              {activeTab === 'settings' && <SettingsView integrations={integrations} />}
            </div>
          )}
        </main>

        {/* Floating AI Assistant */}
        {!copilotOpen && (
          <button
            onClick={toggleCopilot}
            className="fixed bottom-6 right-6 z-30 w-12 h-12 rounded-2xl bg-accent hover:bg-accent-hover text-white shadow-modal flex items-center justify-center transition-all hover:scale-105 active:scale-95 animate-fadeIn"
            aria-label="Open AI Assistant"
          >
            <Bot className="w-5 h-5" />
          </button>
        )}

        {/* VoIP Dialer */}
        {globalDialerOpen && (
          <div className="absolute bottom-6 right-6 w-96 bg-surface-card border border-border-default rounded-2xl shadow-modal z-40 overflow-hidden text-xs flex flex-col">
            <div className="bg-sidebar text-white px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-accent animate-pulse" />
                <span className="font-bold text-sm">Outbound Call</span>
              </div>
              <button onClick={closeDialer} className="text-sidebar-text-muted hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-text-primary text-base">{activeCallName}</h5>
                  <p className="text-text-secondary mt-1 font-semibold">{activeCallNumber}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                  activeCallState === 'connected' ? 'badge-success' : 'badge-info'
                }`}>
                  {activeCallState.toUpperCase()}
                </span>
              </div>
              {activeCallState === 'connected' && (
                <div className="bg-surface-bg-alt p-3 rounded-lg border border-border-default text-center font-bold text-text-primary">
                  Call Connected: {Math.floor(callDuration / 60)}:{(callDuration % 60).toString().padStart(2, '0')}
                </div>
              )}
              <div className="border border-border-default rounded-lg p-3 h-44 overflow-y-auto space-y-1.5 no-scrollbar bg-surface-bg-alt/50">
                {callTranscript.map((t, idx) => (
                  <p key={idx} className="font-semibold leading-relaxed text-text-secondary">{t}</p>
                ))}
              </div>
            </div>
            <div className="border-t border-border-default p-3 flex justify-between items-center bg-surface-bg-alt/30">
              <span className={`text-[10px] font-bold ${
                callSentiment === 'POSITIVE' ? 'text-success' : 'text-text-secondary'
              }`}>
                Sentiment: {callSentiment}
              </span>
              <button onClick={closeDialer} className="bg-error hover:bg-error/90 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                <PhoneOff className="w-3.5 h-3.5" /> End Call
              </button>
            </div>
          </div>
        )}

        {/* Toast Notifications */}
        <div className="fixed top-4 right-4 z-[60] space-y-2 pointer-events-none" aria-live="polite" role="status">
          {toasts.map((toast) => {
            const Icon = toast.type === 'success' ? CheckCircle : toast.type === 'error' ? AlertCircle : Info;
            const color = toast.type === 'success' ? 'text-success' : toast.type === 'error' ? 'text-error' : 'text-info';
            const bg = toast.type === 'success' ? 'bg-success-light border-success-border' : toast.type === 'error' ? 'bg-error-light border-error-border' : 'bg-info-light border-info-border';
            return (
              <div
                key={toast.id}
                className={`pointer-events-auto toast-enter flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-dropdown ${bg} max-w-sm`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${color}`} />
                <span className="text-xs font-medium text-text-primary flex-1">{toast.message}</span>
                <button onClick={() => removeToast(toast.id)} className="text-text-muted hover:text-text-primary p-0.5">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* AI Copilot Drawer */}
        {copilotOpen && (
          <div className="absolute top-0 right-0 bottom-0 w-96 bg-surface-card border-l border-border-default shadow-dropdown z-40 flex flex-col text-xs">
            <div className="p-4 border-b border-border-default flex justify-between items-center bg-surface-bg">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-white shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-text-primary">AI Copilot</h4>
                  <p className="text-[10px] text-text-muted font-medium">Ask anything about your CRM</p>
                </div>
              </div>
              <button onClick={toggleCopilot} className="text-icon hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {copilotMessages.map((msg, i) => (
                <div key={i} className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'ml-auto' : 'mr-auto'}`}>
                  <div className={`p-3 rounded-2xl leading-relaxed whitespace-pre-line font-semibold ${
                    msg.sender === 'user' 
                      ? 'bg-accent text-white rounded-tr-none' 
                      : 'bg-surface-bg-alt text-text-primary rounded-tl-none border border-border-default'
                  }`}>
                    {msg.text}
                  </div>
                  <span className={`text-[8px] text-text-muted mt-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.time}
                  </span>
                </div>
              ))}
            </div>
            <form onSubmit={handleCopilotSend} className="p-3 border-t border-border-default flex gap-2">
              <input
                type="text"
                placeholder="Ask anything..."
                value={copilotInput}
                onChange={(e) => setCopilotInput(e.target.value)}
                className="flex-1 bg-surface-bg border border-border-default rounded-[var(--radius)] px-3 py-2.5 outline-none focus:border-accent font-medium text-text-primary"
              />
              <button type="submit" className="bg-accent hover:bg-accent-hover text-white px-3 rounded-[var(--radius)] font-bold">
                Send
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}

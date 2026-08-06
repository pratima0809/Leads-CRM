'use client';

import React, { useState } from 'react';
import {
  Building2, Users, Database, Shield, Puzzle, MessageSquare,
  BrainCircuit, Zap, Globe, Lock, Upload, Download,
  ChevronDown, ChevronRight, CheckCircle2, AlertTriangle, XCircle,
  Phone, Calendar, Bell, Mail, UserCheck, Target, Sliders,
  Eye, FileText, Clock, ToggleLeft, ToggleRight, RefreshCw,
  Plus, Search, Settings, Sparkles, CreditCard, DollarSign, TrendingUp,
  Palette,
} from 'lucide-react';
import AppearanceSettings from './appearance/AppearanceSettings';
import ProfileSection from './settings/ProfileSection';
import NotificationsSection from './settings/NotificationsSection';
import WhatsAppSection from './settings/WhatsAppSection';
import AISection from './settings/AISection';
import SecuritySection from './settings/SecuritySection';
import PrivacySection from './settings/PrivacySection';
import CRMSection from './settings/CRMSection';
import IntegrationsSection from './settings/IntegrationsSection';
import ImportExportSection from './settings/ImportExportSection';
import SystemSection from './settings/SystemSection';
import AccessibilitySection from './settings/AccessibilitySection';
import BrandingSection from './settings/BrandingSection';
import BusinessSection from './settings/BusinessSection';
import OrganizationSection from './settings/OrganizationSection';
import PipelineSection from './settings/PipelineSection';
import WhatsAppContentSection from './settings/WhatsAppContentSection';
import CommunicationSection from './settings/CommunicationSection';
import AutomationSection from './settings/AutomationSection';
import AuditLogSection from './settings/AuditLogSection';
import DataRetentionSection from './settings/DataRetentionSection';
import BillingSection from './settings/BillingSection';

/* ---- Navigation Data ---- */

const navGroups = [
  {
    label: 'Workspace', icon: Building2,
    items: [
      { id: 'org-profile', label: 'Organization Profile', icon: Building2 },
      { id: 'branding', label: 'Branding', icon: Eye },
      { id: 'appearance', label: 'Chat Appearance', icon: Palette },
      { id: 'business-settings', label: 'Business Settings', icon: Sliders },
    ],
  },
  {
    label: 'Users & Teams', icon: Users,
    items: [
      { id: 'team-members', label: 'Team Members', icon: Users },
      { id: 'roles', label: 'Roles & Permissions', icon: Shield },
      { id: 'departments', label: 'Departments', icon: Building2 },
      { id: 'territories', label: 'Territories', icon: Globe },
    ],
  },
  {
    label: 'CRM Configuration', icon: Database,
    items: [
      { id: 'pipelines', label: 'Pipelines', icon: Target },
      { id: 'lead-stages', label: 'Lead Stages', icon: Sliders },
      { id: 'lead-sources', label: 'Lead Sources', icon: FileText },
      { id: 'win-loss', label: 'Win/Loss Reasons', icon: FileText },
      { id: 'custom-fields', label: 'Custom Fields', icon: FileText },
      { id: 'tags', label: 'Tags', icon: Puzzle },
      { id: 'record-layouts', label: 'Record Layouts', icon: Database },
      { id: 'crm', label: 'CRM Settings', icon: Settings },
    ],
  },
  {
    label: 'WhatsApp', icon: MessageSquare,
    items: [
      { id: 'whatsapp', label: 'WhatsApp Business', icon: MessageSquare },
      { id: 'wa-templates', label: 'Templates', icon: FileText },
      { id: 'wa-auto-replies', label: 'Auto Replies', icon: Zap },
      { id: 'wa-campaigns', label: 'Campaign Settings', icon: Target },
      { id: 'wa-routing', label: 'Routing Rules', icon: Sliders },
    ],
  },
  {
    label: 'AI Configuration', icon: BrainCircuit,
    items: [
      { id: 'ai-scoring', label: 'AI Lead Scoring', icon: Target },
      { id: 'ai-followup', label: 'AI Follow-Up Suggestions', icon: Zap },
      { id: 'ai-copilot', label: 'AI Copilot', icon: BrainCircuit },
      { id: 'ai-call', label: 'AI Call Intelligence', icon: Phone },
      { id: 'ai-email', label: 'AI Email Generation', icon: Mail },
      { id: 'ai-whatsapp', label: 'AI WhatsApp Generation', icon: MessageSquare },
      { id: 'ai-forecast', label: 'AI Forecasting', icon: TrendingUp },
    ],
  },
  {
    label: 'Automation', icon: Zap,
    items: [
      { id: 'workflows', label: 'Workflow Builder', icon: Zap },
      { id: 'auto-assignment', label: 'Auto Assignment Rules', icon: UserCheck },
      { id: 'reminders', label: 'Reminder Rules', icon: Bell },
      { id: 'escalations', label: 'Escalation Rules', icon: AlertTriangle },
      { id: 'sla', label: 'SLA Policies', icon: Clock },
    ],
  },
  {
    label: 'Communication', icon: Mail,
    items: [
      { id: 'email', label: 'Email Accounts', icon: Mail },
      { id: 'calling', label: 'Telephony', icon: Phone },
      { id: 'meeting-scheduler', label: 'Meeting Scheduler', icon: Calendar },
      { id: 'notifications', label: 'Notifications', icon: Bell },
    ],
  },
  {
    label: 'Integrations', icon: Puzzle,
    items: [
      { id: 'int-whatsapp', label: 'WhatsApp', icon: MessageSquare },
      { id: 'int-gmail', label: 'Gmail', icon: Mail },
      { id: 'int-outlook', label: 'Outlook', icon: Mail },
      { id: 'int-slack', label: 'Slack', icon: Puzzle },
      { id: 'int-razorpay', label: 'Razorpay', icon: Globe },
      { id: 'int-stripe', label: 'Stripe', icon: Globe },
      { id: 'int-tally', label: 'Tally', icon: Database },
      { id: 'int-sap', label: 'SAP', icon: Database },
      { id: 'int-odoo', label: 'Odoo', icon: Database },
    ],
  },
  {
    label: 'Security', icon: Shield,
    items: [
      { id: 'audit-logs', label: 'Audit Logs', icon: FileText },
      { id: 'mfa', label: 'MFA', icon: Lock },
      { id: 'sessions', label: 'Session Management', icon: Clock },
      { id: 'sso', label: 'SSO', icon: Globe },
      { id: 'ip-restrictions', label: 'IP Restrictions', icon: Shield },
      { id: 'privacy', label: 'Privacy', icon: Lock },
    ],
  },
  {
    label: 'Data Management', icon: Database,
    items: [
      { id: 'import', label: 'Import Data', icon: Upload },
      { id: 'export', label: 'Export Data', icon: Download },
      { id: 'backup', label: 'Backup & Restore', icon: RefreshCw },
      { id: 'retention', label: 'Data Retention', icon: Clock },
    ],
  },
  {
    label: 'System', icon: Settings,
    items: [
      { id: 'system', label: 'System', icon: Settings },
      { id: 'accessibility', label: 'Accessibility', icon: Eye },
    ],
  },
  {
    label: 'Billing', icon: CreditCard,
    items: [
      { id: 'subscription', label: 'Subscription', icon: CreditCard },
      { id: 'invoices', label: 'Invoices', icon: FileText },
      { id: 'usage-limits', label: 'Usage Limits', icon: Sliders },
      { id: 'payment-methods', label: 'Payment Methods', icon: CreditCard },
    ],
  },
];

/* ---- Mock Data ---- */

const workspaceHealth = {
  score: 92,
  maxScore: 100,
  items: [
    { label: 'WhatsApp Connected', status: 'ok' as const },
    { label: 'Email Connected', status: 'ok' as const },
    { label: 'Pipelines Configured', status: 'ok' as const },
    { label: 'Security Score: 78/100', status: 'partial' as const, detail: '2 users without MFA' },
    { label: 'Backup Configured', status: 'warn' as const, detail: 'Last backup: 3 days ago' },
  ],
};

export default function SettingsView({ integrations: _integrations }: { integrations: any[] }) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Workspace', 'AI Configuration']);
  const [activeCategory, setActiveCategory] = useState('Workspace');
  const [activeSection, setActiveSection] = useState('org-profile');

  const toggleGroup = (label: string) => {
    setExpandedGroups(prev =>
      prev.includes(label) ? prev.filter(g => g !== label) : [...prev, label]
    );
  };

  const navigateTo = (groupLabel: string, sectionId: string) => {
    setActiveCategory(groupLabel);
    setActiveSection(sectionId);
    if (!expandedGroups.includes(groupLabel)) {
      setExpandedGroups(prev => [...prev, groupLabel]);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'org-profile': return <ProfileSection />;
      case 'branding': return <BrandingSection />;
      case 'appearance': return <AppearanceSettings />;
      case 'business-settings': return <BusinessSection />;
      case 'team-members': case 'roles': case 'departments': case 'territories': return <OrganizationSection />;
      case 'pipelines': case 'lead-stages': case 'lead-sources': case 'win-loss': case 'custom-fields': case 'tags': case 'record-layouts': return <PipelineSection />;
      case 'whatsapp': return <WhatsAppSection />;
      case 'wa-templates': case 'wa-auto-replies': case 'wa-campaigns': case 'wa-routing': return <WhatsAppContentSection />;
      case 'email': case 'calling': case 'meeting-scheduler': return <CommunicationSection />;
      case 'notifications': return <NotificationsSection />;
      case 'ai-scoring': case 'ai-followup': case 'ai-copilot': case 'ai-call': case 'ai-message': case 'ai-email': case 'ai-whatsapp': case 'ai-forecast': return <AISection />;
      case 'workflows': case 'auto-assignment': case 'sla': case 'escalations': case 'reminders': return <AutomationSection />;
      case 'audit-logs': return <AuditLogSection />;
      case 'mfa': case 'sessions': case 'sso': case 'ip-restrictions': return <SecuritySection />;
      case 'privacy': return <PrivacySection />;
      case 'crm': return <CRMSection />;
      case 'import': case 'export': case 'backup': return <ImportExportSection />;
      case 'retention': return <DataRetentionSection />;
      case 'subscription': case 'invoices': case 'usage-limits': case 'payment-methods': return <BillingSection />;
      case 'system': return <SystemSection />;
      case 'accessibility': return <AccessibilitySection />;
      default: {
        if (activeSection.startsWith('int-')) return <IntegrationsSection />;
        return <ProfileSection />;
      }
    }
  };

  return (
    <div className="h-full overflow-hidden flex flex-col gap-4">
      {/* Workspace Health Overview */}
      <div className="bg-surface-card border border-border-default rounded-[12px] p-4 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative w-14 h-14">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--surface-bg-alt)" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--accent)" strokeWidth="3"
                  strokeDasharray={`${workspaceHealth.score / workspaceHealth.maxScore * 100} 100`}
                  strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-text-primary">{workspaceHealth.score}</span>
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-text-primary">Workspace Health</div>
              <div className="text-[9px] text-text-muted">{workspaceHealth.score}/{workspaceHealth.maxScore} · All systems nominal</div>
            </div>
          </div>
          <div className="flex gap-4 flex-1">
            {workspaceHealth.items.map(item => (
              <div key={item.label} className="flex items-center gap-1.5 text-[9px] font-medium">
                {item.status === 'ok' && <CheckCircle2 className="w-3 h-3 text-success" />}
                {item.status === 'partial' && <AlertTriangle className="w-3 h-3 text-warning" />}
                {item.status === 'warn' && <XCircle className="w-3 h-3 text-error" />}
                <span className="text-text-secondary">{item.label}</span>
                {item.detail && <span className="text-text-muted">({item.detail})</span>}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[9px] text-text-muted">{workspaceHealth.items.filter(i => i.status === 'ok').length} of {workspaceHealth.items.length} healthy</span>
          </div>
        </div>
      </div>

      {/* Main: Left Nav + Content */}
      <div className="flex-1 flex gap-4 overflow-hidden min-h-0">
        {/* Left Navigation */}
        <div className="w-56 shrink-0 bg-surface-card border border-border-default rounded-[12px] overflow-y-auto no-scrollbar p-2">
          {navGroups.map(group => {
            const Icon = group.icon;
            const isExpanded = expandedGroups.includes(group.label);
            const isActive = activeCategory === group.label;
            return (
              <div key={group.label} className="mb-0.5">
                <button
                  onClick={() => toggleGroup(group.label)}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-colors ${
                    isActive ? 'bg-accent/10 text-accent' : 'text-text-secondary hover:bg-surface-bg-alt hover:text-text-primary'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="flex-1 text-left">{group.label}</span>
                  {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </button>
                {isExpanded && (
                  <div className="ml-3 mt-0.5 space-y-0.5 border-l border-border-default/50 pl-2">
                    {group.items.map(item => {
                      const ItemIcon = item.icon;
                      const isItemActive = activeSection === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => navigateTo(group.label, item.id)}
                          className={`w-full flex items-center gap-2 px-2 py-1 rounded-lg text-[9px] font-medium transition-colors ${
                            isItemActive
                              ? 'bg-accent/10 text-accent'
                              : 'text-text-secondary hover:text-text-primary hover:bg-surface-bg-alt/50'
                          }`}
                        >
                          <ItemIcon className="w-3 h-3" />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-surface-card border border-border-default rounded-[12px] overflow-y-auto no-scrollbar p-5">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}


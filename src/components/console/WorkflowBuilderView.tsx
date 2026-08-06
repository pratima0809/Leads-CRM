'use client';

import React, { useState } from 'react';
import {
  Workflow, Plus, Play, Pause, Settings, Trash2, Check,
  X, Zap, Sparkles, MessageSquare, UserPlus, Calendar,
  Mail, Globe, GitFork, ArrowDown, ArrowRight, ChevronRight,
  Copy, GripVertical, Clock, Bell, Tag, RefreshCw
} from 'lucide-react';

type NodeType = 'trigger' | 'action';
type StepType = 'assign' | 'whatsapp' | 'task' | 'email' | 'webhook' | 'condition';

type FlowNode = {
  id: string;
  type: NodeType;
  stepType?: StepType;
  label: string;
  description: string;
  config: Record<string, any>;
};

type WorkflowItem = {
  id: string;
  name: string;
  trigger: string;
  active: boolean;
  nodes: FlowNode[];
};

const initialWorkflows: WorkflowItem[] = [
  {
    id: 'wf-1',
    name: 'New Lead Onboarding',
    trigger: 'Lead Created',
    active: true,
    nodes: [
      { id: 'n1', type: 'trigger', label: 'New Lead is Created', description: 'Triggers when a lead enters via form, WhatsApp, or API', config: { source: 'Any' } },
      { id: 'n2', type: 'action', stepType: 'assign', label: 'Assign Salesperson', description: 'Route to available rep via Round Robin', config: { method: 'Round Robin', team: ['Alex M.', 'Sarah C.', 'Mike R.'] } },
      { id: 'n3', type: 'action', stepType: 'whatsapp', label: 'Send WhatsApp Message', description: 'Welcome template with 2-min delay', config: { template: 'welcome_onboarding', delay: '2 min' } },
      { id: 'n4', type: 'action', stepType: 'task', label: 'Create Follow-up Task', description: 'High priority: Qualify lead within 24h', config: { priority: 'High', due: '24 hours', assignee: 'Assigned rep' } },
    ],
  },
  {
    id: 'wf-2',
    name: 'Deal Won Celebration',
    trigger: 'Deal Won',
    active: false,
    nodes: [
      { id: 'n1', type: 'trigger', label: 'Deal Status Changes to Won', description: 'Triggers when a deal is marked as Closed Won', config: {} },
      { id: 'n2', type: 'action', stepType: 'whatsapp', label: 'Send Congratulations Message', description: 'Celebration template to customer', config: { template: 'deal_won_celebration' } },
      { id: 'n3', type: 'action', stepType: 'task', label: 'Create Handover Task', description: 'Assign to customer success team', config: { priority: 'Medium', due: '48 hours', assignee: 'CS Team' } },
      { id: 'n4', type: 'action', stepType: 'email', label: 'Send Invoice Email', description: 'Auto-generate and send invoice', config: { template: 'invoice_template' } },
    ],
  },
  {
    id: 'wf-3',
    name: 'Stale Deal Alert',
    trigger: 'No Activity (7 days)',
    active: false,
    nodes: [
      { id: 'n1', type: 'trigger', label: 'Deal Stale for 7 Days', description: 'Triggers when no activity logged on an open deal for 7 days', config: { days: 7 } },
      { id: 'n2', type: 'action', stepType: 'whatsapp', label: 'Send Follow-up WhatsApp', description: 'Gentle check-in template', config: { template: 'stale_deal_followup' } },
      { id: 'n3', type: 'action', stepType: 'task', label: 'Notify Sales Rep', description: 'Create alert task for assigned rep', config: { priority: 'Medium', due: 'Same day' } },
    ],
  },
];

const availableTriggers = [
  { icon: Zap, label: 'Lead Created', color: 'text-info', desc: 'New lead enters the system' },
  { icon: Zap, label: 'Deal Won/Lost', color: 'text-success', desc: 'Deal status changes' },
  { icon: Zap, label: 'Message Received', color: 'text-accent', desc: 'New WhatsApp message' },
  { icon: Zap, label: 'Form Submitted', color: 'text-warning', desc: 'Website form submission' },
  { icon: Zap, label: 'Call Completed', color: 'text-error', desc: 'VoIP call ends' },
];

const availableActions = [
  { icon: UserPlus, label: 'Assign Salesperson', color: 'text-info', stepType: 'assign' as StepType, desc: 'Route to team member' },
  { icon: MessageSquare, label: 'Send WhatsApp Message', color: 'text-accent', stepType: 'whatsapp' as StepType, desc: 'Send from template' },
  { icon: Calendar, label: 'Create Task', color: 'text-warning', stepType: 'task' as StepType, desc: 'Add follow-up task' },
  { icon: Mail, label: 'Send Email', color: 'text-success', stepType: 'email' as StepType, desc: 'Auto-email notification' },
  { icon: Globe, label: 'Webhook Call', color: 'text-text-secondary', stepType: 'webhook' as StepType, desc: 'POST to external URL' },
];

function nodeConfig(node: FlowNode): string {
  if (node.stepType === 'assign') return `Method: ${node.config.method || 'Round Robin'}`;
  if (node.stepType === 'whatsapp') return `Template: ${node.config.template || '—'}`;
  if (node.stepType === 'task') return `${node.config.priority || 'Medium'} priority • Due: ${node.config.due || '—'}`;
  if (node.stepType === 'email') return `Template: ${node.config.template || '—'}`;
  if (node.stepType === 'webhook') return `POST to external URL`;
  return node.description;
}

function FlowNodeCard({ node, index, onRemove, onDuplicate, total }: {
  node: FlowNode; index: number; onRemove: () => void; onDuplicate: () => void; total: number;
}) {
  const isTrigger = node.type === 'trigger';
  const icon = isTrigger ? Zap :
    node.stepType === 'assign' ? UserPlus :
    node.stepType === 'whatsapp' ? MessageSquare :
    node.stepType === 'task' ? Calendar :
    node.stepType === 'email' ? Mail :
    Globe;
  const color = isTrigger ? 'text-info' :
    node.stepType === 'assign' ? 'text-info' :
    node.stepType === 'whatsapp' ? 'text-accent' :
    node.stepType === 'task' ? 'text-warning' :
    node.stepType === 'email' ? 'text-success' :
    'text-text-secondary';
  const bgColor = isTrigger ? 'bg-info-light' :
    node.stepType === 'assign' ? 'bg-info-light' :
    node.stepType === 'whatsapp' ? 'bg-accent-light' :
    node.stepType === 'task' ? 'bg-warning-light' :
    node.stepType === 'email' ? 'bg-success-light' :
    'bg-surface-bg-alt';
  const borderColor = isTrigger ? 'border-info' :
    node.stepType === 'assign' ? 'border-info' :
    node.stepType === 'whatsapp' ? 'border-accent' :
    node.stepType === 'task' ? 'border-warning' :
    node.stepType === 'email' ? 'border-success' :
    'border-border-default';

  const Icon = icon;

  return (
    <div className="relative flex items-start gap-4">
      {/* Connection line */}
      {index > 0 && (
        <div className="absolute -top-8 left-6 flex flex-col items-center">
          <ArrowDown className="w-4 h-4 text-border-divider" />
        </div>
      )}

      {/* Step number badge */}
      <div className="flex flex-col items-center shrink-0">
        <div className={`w-12 h-12 rounded-xl ${bgColor} border-2 ${borderColor} flex items-center justify-center relative z-10`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        {index < total - 1 && (
          <div className="w-0.5 h-8 bg-border-divider" />
        )}
      </div>

      {/* Node card */}
      <div className={`flex-1 bg-surface-card border ${borderColor} rounded-xl p-4 shadow-card hover:shadow-card-hov transition-shadow relative group ${isTrigger ? 'border-l-4' : ''}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[9px] font-bold uppercase tracking-wider ${color}`}>
                {isTrigger ? 'TRIGGER' : 'ACTION'}
              </span>
              <span className="text-[9px] font-medium text-text-muted bg-surface-bg-alt px-1.5 py-0.5 rounded">
                Step {index + 1}
              </span>
            </div>
            <h5 className="text-sm font-bold text-text-primary">{node.label}</h5>
            <p className="text-xs text-text-secondary mt-1">{nodeConfig(node)}</p>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button onClick={onDuplicate} className="p-1.5 hover:bg-surface-bg-alt rounded-lg text-icon transition-colors" title="Duplicate">
              <Copy className="w-3.5 h-3.5" />
            </button>
            {!isTrigger && (
              <button onClick={onRemove} className="p-1.5 hover:bg-error-light rounded-lg text-error transition-colors" title="Remove">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Config chips */}
        {!isTrigger && (
          <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border-default">
            {node.stepType === 'assign' && (
              <div className="flex items-center gap-1.5 text-[10px] text-text-secondary bg-surface-bg-alt px-2 py-1 rounded-md">
                <UserPlus className="w-3 h-3 text-info" />
                {node.config.team?.join(', ')}
              </div>
            )}
            {node.stepType === 'whatsapp' && (
              <>
                <div className="flex items-center gap-1.5 text-[10px] text-text-secondary bg-surface-bg-alt px-2 py-1 rounded-md">
                  <MessageSquare className="w-3 h-3 text-accent" />
                  {node.config.template}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-text-secondary bg-surface-bg-alt px-2 py-1 rounded-md">
                  <Clock className="w-3 h-3 text-warning" />
                  Delay: {node.config.delay}
                </div>
              </>
            )}
            {node.stepType === 'task' && (
              <>
                <div className={`flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-md ${
                  node.config.priority === 'High' ? 'bg-error-light text-error' : 'bg-surface-bg-alt text-text-secondary'
                }`}>
                  <Bell className="w-3 h-3" />
                  {node.config.priority}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-text-secondary bg-surface-bg-alt px-2 py-1 rounded-md">
                  <Clock className="w-3 h-3" />
                  Due: {node.config.due}
                </div>
              </>
            )}
            {node.stepType === 'email' && (
              <div className="flex items-center gap-1.5 text-[10px] text-text-secondary bg-surface-bg-alt px-2 py-1 rounded-md">
                <Mail className="w-3 h-3 text-success" />
                {node.config.template}
              </div>
            )}
          </div>
        )}

        {/* Configure button */}
        <button className="absolute top-3 right-3 w-6 h-6 rounded-md bg-surface-bg-alt opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-accent-light">
          <Settings className="w-3 h-3 text-icon" />
        </button>
      </div>
    </div>
  );
}

function EmptyCanvas({ onAddTrigger, onAddAction }: { onAddTrigger: () => void; onAddAction: () => void }) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-4 max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-accent-light flex items-center justify-center mx-auto">
          <Workflow className="w-8 h-8 text-accent" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-text-primary">Create Your First Automation</h3>
          <p className="text-xs text-text-secondary mt-1">Start with a trigger, then add actions. No coding required.</p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button onClick={onAddTrigger} className="bg-accent hover:bg-accent-hover text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            Add Trigger
          </button>
          <button onClick={onAddAction} className="bg-surface-card border border-border-default text-text-secondary hover:text-text-primary text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            Add Action
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WorkflowBuilderView({ workflows: _workflows }: { workflows: any[] }) {
  const [items, setItems] = useState<WorkflowItem[]>(initialWorkflows);
  const [activeId, setActiveId] = useState<string>('wf-1');
  const [showTriggers, setShowTriggers] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const active = items.find(w => w.id === activeId) || items[0];

  const toggleActive = (id: string) => {
    setItems(prev => prev.map(w => w.id === id ? { ...w, active: !w.active } : w));
  };

  const removeNode = (nodeId: string) => {
    setItems(prev => prev.map(w => w.id === activeId ? { ...w, nodes: w.nodes.filter(n => n.id !== nodeId) } : w));
  };

  const duplicateNode = (nodeId: string) => {
    setItems(prev => prev.map(w => {
      if (w.id !== activeId) return w;
      const idx = w.nodes.findIndex(n => n.id === nodeId);
      if (idx === -1) return w;
      const original = w.nodes[idx];
      const clone: FlowNode = { ...original, id: `${original.id}-copy-${Date.now()}`, label: `${original.label} (copy)` };
      const nodes = [...w.nodes];
      nodes.splice(idx + 1, 0, clone);
      return { ...w, nodes };
    }));
  };

  const addNode = (stepType: StepType, label: string) => {
    const configMap: Record<string, any> = {
      assign: { method: 'Round Robin', team: ['Alex M.', 'Sarah C.', 'Mike R.'] },
      whatsapp: { template: 'welcome_onboarding', delay: '2 min' },
      task: { priority: 'Medium', due: '24 hours', assignee: 'Assigned rep' },
      email: { template: 'notification_template' },
      webhook: { url: 'https://', method: 'POST' },
    };
    const descMap: Record<string, string> = {
      assign: 'Route to available team member',
      whatsapp: 'Send from approved template',
      task: 'Create a follow-up task',
      email: 'Send auto-email notification',
      webhook: 'POST data to external URL',
    };
    const newNode: FlowNode = {
      id: `n-${Date.now()}`,
      type: 'action',
      stepType,
      label,
      description: descMap[stepType] || '',
      config: configMap[stepType] || {},
    };
    setItems(prev => prev.map(w => w.id === activeId ? { ...w, nodes: [...w.nodes, newNode] } : w));
    setShowActions(false);
  };

  const addTrigger = (label: string) => {
    const triggerMap: Record<string, string> = {
      'Lead Created': 'Triggers when a lead enters via form, WhatsApp, or API',
      'Deal Won/Lost': 'Triggers when deal status changes',
      'Message Received': 'Triggers on new WhatsApp message',
      'Form Submitted': 'Triggers on website form submission',
      'Call Completed': 'Triggers when VoIP call ends',
    };
    const newTrigger: FlowNode = {
      id: `n-${Date.now()}`,
      type: 'trigger',
      label: `${label}`,
      description: triggerMap[label] || '',
      config: {},
    };
    setItems(prev => prev.map(w => {
      if (w.id !== activeId) return w;
      const hasTrigger = w.nodes.some(n => n.type === 'trigger');
      if (hasTrigger) return { ...w, nodes: [...w.nodes, newTrigger] };
      return { ...w, nodes: [newTrigger, ...w.nodes] };
    }));
    setShowTriggers(false);
  };

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] -m-4 lg:-m-6">
      {/* Left Panel */}
      <div className="w-72 border-r border-border-default bg-surface-card flex flex-col shrink-0">
        <div className="p-4 border-b border-border-default">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <Workflow className="w-4 h-4 text-accent" />
              Automations
            </h3>
            <button className="w-7 h-7 rounded-lg bg-accent text-white flex items-center justify-center hover:bg-accent-hover transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search automations..."
              className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-1.5 text-xs outline-none focus:border-accent text-text-primary placeholder:text-text-muted"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-2">
          {items.map((wf) => (
            <div
              key={wf.id}
              onClick={() => setActiveId(wf.id)}
              className={`p-3 rounded-xl cursor-pointer transition-all border ${
                activeId === wf.id
                  ? 'bg-accent-light border-accent/20'
                  : 'bg-surface-card border-border-default hover:bg-surface-bg-alt'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-bold ${activeId === wf.id ? 'text-accent' : 'text-text-primary'}`}>
                  {wf.name}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleActive(wf.id); }}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    wf.active
                      ? 'bg-success-light text-success'
                      : 'bg-surface-bg-alt text-text-muted'
                  }`}
                >
                  {wf.active ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${
                  wf.active ? 'bg-success-light text-success' : 'bg-surface-bg-alt text-text-muted'
                }`}>
                  {wf.active ? 'Active' : 'Draft'}
                </span>
                <span className="text-[10px] text-text-muted">Trigger: {wf.trigger}</span>
              </div>
              <div className="flex items-center gap-1 mt-2">
                {wf.nodes.map((n, i) => (
                  <React.Fragment key={n.id}>
                    <div className={`w-5 h-5 rounded ${n.type === 'trigger' ? 'bg-info-light' : 'bg-accent-light'} flex items-center justify-center`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${n.type === 'trigger' ? 'bg-info' : 'bg-accent'}`} />
                    </div>
                    {i < wf.nodes.length - 1 && <div className="w-3 h-0.5 bg-border-divider" />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Add */}
        <div className="p-3 border-t border-border-default space-y-2">
          <div className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Available Triggers</div>
          <div className="flex flex-wrap gap-1.5">
            {availableTriggers.slice(0, 3).map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.label}
                  onClick={() => addTrigger(t.label)}
                  className="flex items-center gap-1 text-[10px] font-medium bg-surface-bg-alt text-text-secondary px-2 py-1 rounded-lg hover:bg-accent-light hover:text-accent transition-colors"
                >
                  <Icon className="w-3 h-3" />
                  {t.label}
                </button>
              );
            })}
          </div>
          <div className="text-[10px] font-bold text-text-secondary uppercase tracking-wider pt-1">Actions</div>
          <div className="flex flex-wrap gap-1.5">
            {availableActions.map((a) => {
              const Icon = a.icon;
              return (
                <button
                  key={a.label}
                  onClick={() => addNode(a.stepType, a.label)}
                  className="flex items-center gap-1 text-[10px] font-medium bg-surface-bg-alt text-text-secondary px-2 py-1 rounded-lg hover:bg-accent-light hover:text-accent transition-colors"
                >
                  <Icon className="w-3 h-3" />
                  {a.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Flow Canvas */}
      <div className="flex-1 flex flex-col bg-surface-bg/50 overflow-hidden">
        {/* Canvas Header */}
        <div className="px-6 py-3 border-b border-border-default bg-surface-card flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${active.active ? 'bg-success animate-pulse' : 'bg-text-muted'}`} />
              <h2 className="text-sm font-bold text-text-primary">{active.name}</h2>
            </div>
            <span className="text-[10px] font-medium text-text-muted bg-surface-bg-alt px-2 py-0.5 rounded">
              Trigger: {active.trigger}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleActive(active.id)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                active.active
                  ? 'bg-warning-light text-warning hover:bg-warning/20'
                  : 'bg-success-light text-success hover:bg-success/20'
              }`}
            >
              {active.active ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {active.active ? 'Pause' : 'Activate'}
            </button>
            <button className="bg-accent hover:bg-accent-hover text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              Save
            </button>
          </div>
        </div>

        {/* Canvas Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {active.nodes.length === 0 ? (
            <EmptyCanvas
              onAddTrigger={() => setShowTriggers(true)}
              onAddAction={() => setShowActions(true)}
            />
          ) : (
            <div className="p-8 max-w-2xl mx-auto space-y-6">
              {/* Flow Summary Bar */}
              <div className="flex items-center gap-3 text-[10px] text-text-muted bg-surface-card border border-border-default rounded-xl px-4 py-2.5">
                <RefreshCw className="w-3.5 h-3.5 text-accent" />
                <span>{active.nodes.length} step{active.nodes.length > 1 ? 's' : ''}</span>
                <span className="w-1 h-1 rounded-full bg-border-divider" />
                <span>Runs on: {active.trigger}</span>
                <span className="w-1 h-1 rounded-full bg-border-divider" />
                <span className="text-accent font-medium">Active</span>
              </div>

              {active.nodes.map((node, index) => (
                <FlowNodeCard
                  key={node.id}
                  node={node}
                  index={index}
                  total={active.nodes.length}
                  onRemove={() => removeNode(node.id)}
                  onDuplicate={() => duplicateNode(node.id)}
                />
              ))}

              {/* Add Step Button */}
              <div className="flex justify-center pt-2">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                  <button
                    onClick={() => setShowActions(true)}
                    className="relative flex items-center gap-2 bg-surface-card border-2 border-dashed border-border-divider hover:border-accent/50 text-text-secondary hover:text-accent px-5 py-2.5 rounded-xl text-xs font-semibold transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Add Step
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Trigger Modal */}
      {showTriggers && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center animate-fadeIn"
          onClick={() => setShowTriggers(false)}
          onKeyDown={(e) => e.key === 'Escape' && setShowTriggers(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="trigger-modal-title"
        >
          <div className="bg-surface-card border border-border-default rounded-2xl shadow-modal w-full max-w-md p-6 space-y-4 animate-scaleIn" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 id="trigger-modal-title" className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Zap className="w-4 h-4 text-warning" />
                Choose a Trigger
              </h3>
              <button onClick={() => setShowTriggers(false)} aria-label="Close dialog" className="p-1 hover:bg-surface-bg-alt rounded text-icon">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-text-secondary">Select what starts this automation</p>
            <div className="space-y-2">
              {availableTriggers.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.label}
                    onClick={() => addTrigger(t.label)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-border-default hover:border-accent/30 hover:bg-accent-light/30 hover-lift transition-all text-left group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-surface-bg-alt flex items-center justify-center group-hover:bg-accent-light transition-colors">
                      <Icon className={`w-5 h-5 ${t.color}`} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-text-primary">{t.label}</div>
                      <div className="text-[10px] text-text-muted">{t.desc}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-text-muted ml-auto" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add Action Modal */}
      {showActions && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center animate-fadeIn"
          onClick={() => setShowActions(false)}
          onKeyDown={(e) => e.key === 'Escape' && setShowActions(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="action-modal-title"
        >
          <div className="bg-surface-card border border-border-default rounded-2xl shadow-modal w-full max-w-md p-6 space-y-4 animate-scaleIn" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 id="action-modal-title" className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Plus className="w-4 h-4 text-accent" />
                Add an Action
              </h3>
              <button onClick={() => setShowActions(false)} aria-label="Close dialog" className="p-1 hover:bg-surface-bg-alt rounded text-icon">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-text-secondary">Choose what happens when the trigger fires</p>
            <div className="space-y-2">
              {availableActions.map((a) => {
                const Icon = a.icon;
                return (
                  <button
                    key={a.label}
                    onClick={() => addNode(a.stepType, a.label)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-border-default hover:border-accent/30 hover:bg-accent-light/30 hover-lift transition-all text-left group"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-surface-bg-alt flex items-center justify-center group-hover:bg-accent-light transition-colors`}>
                      <Icon className={`w-5 h-5 ${a.color}`} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-text-primary">{a.label}</div>
                      <div className="text-[10px] text-text-muted">{a.desc}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-text-muted ml-auto" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Phone,
  MessageSquare,
  Mail,
  FileText,
  ChevronDown,
  ChevronRight,
  Bot,
  Users,
  Building2,
  Sun,
} from 'lucide-react';

interface Task {
  id: string; title: string; due: string; done: boolean; priority: string;
  company?: string; contact?: string; dealValue?: string; dealId?: string;
  aiRecommendation?: string; lastWhatsApp?: string; sentiment?: string;
  section: string;
}

const initialTasks: Task[] = [
  { id: 't1', title: 'Follow up on Bulk Steel Quote', company: 'ABC Metals & Forgings', contact: 'James Wilson', dealValue: '₹4.5L', dealId: 'D-1024', due: 'Today, 2:00 PM', done: false, priority: 'HIGH', aiRecommendation: 'Call before 3 PM — customer viewed proposal twice today', lastWhatsApp: '2h ago', sentiment: 'Positive', section: 'today' },
  { id: 't2', title: 'Send LMS Demo credentials', company: 'Apex Educational Solutions', contact: 'Neha Gupta', dealValue: '₹7.8L', dealId: 'D-1028', due: 'Today, 4:00 PM', done: false, priority: 'HIGH', aiRecommendation: 'Demo deck viewed 3 times — send follow-up immediately', lastWhatsApp: '5h ago', sentiment: 'Positive', section: 'today' },
  { id: 't3', title: 'Review medical compliance checklist', company: 'Sahyadri Healthcare', contact: 'Dr. Priya Sharma', dealValue: '₹6.8L', dealId: 'D-1031', due: 'Today, 5:00 PM', done: false, priority: 'MEDIUM', aiRecommendation: 'Compliance documents due EOW — escalate if not received', lastWhatsApp: '1d ago', sentiment: 'Neutral', section: 'today' },
  { id: 't4', title: 'Prepare enterprise license renewal', company: 'NovaTech Software', contact: 'Arun Nair', dealValue: '₹23L', dealId: 'D-1035', due: 'Tomorrow, 10:00 AM', done: false, priority: 'HIGH', aiRecommendation: 'CTO engagement high — premium support upsell opportunity', lastWhatsApp: '3h ago', sentiment: 'Positive', section: 'tomorrow' },
  { id: 't5', title: 'Draft property management proposal', company: 'Horizon Real Estate', contact: 'Emily Davis', dealValue: '₹9.5L', dealId: 'D-1026', due: 'Tomorrow, 2:00 PM', done: false, priority: 'MEDIUM', aiRecommendation: 'Board approval needed — include ROI comparison', lastWhatsApp: 'Yesterday', sentiment: 'Positive', section: 'tomorrow' },
  { id: 't6', title: 'Schedule quarterly business review', company: 'Horizon Real Estate', contact: 'John Smith', dealValue: '₹18.5L', dealId: 'D-1040', due: 'This Week, Fri 3:00 PM', done: false, priority: 'MEDIUM', aiRecommendation: 'QBR deck ready — highlight expansion metrics', lastWhatsApp: '3d ago', sentiment: 'Neutral', section: 'week' },
  { id: 't7', title: 'Negotiate payment terms for ERP upgrade', company: 'ABC Metals & Forgings', contact: 'Vikram Mehta', dealValue: '₹18.5L', dealId: 'D-1022', due: 'This Week, Thu 11:00 AM', done: false, priority: 'HIGH', aiRecommendation: 'Offer 60-day terms — competitor offering 90 days', lastWhatsApp: '1d ago', sentiment: 'Neutral', section: 'week' },
  { id: 't8', title: 'Follow up on IndiaMART inquiry', company: 'GreenLeaf Retail', contact: 'Sarah Lee', dealValue: '₹4.5L', dealId: 'D-1038', due: 'Overdue — Aug 12', done: false, priority: 'HIGH', aiRecommendation: 'Overdue 3 days — customer engaging with competitor', lastWhatsApp: '5d ago', sentiment: 'Negative', section: 'overdue' },
  { id: 't9', title: 'Send festive offer campaign', company: 'Multiple', contact: '—', dealValue: '—', dealId: '—', due: 'Overdue — Aug 10', done: false, priority: 'MEDIUM', aiRecommendation: 'Missed campaign window — reschedule for Onam', lastWhatsApp: '—', sentiment: '—', section: 'overdue' },
  { id: 't10', title: 'Horizon property site visit completed', company: 'Horizon Real Estate', contact: 'Emily Davis', dealValue: '₹9.5L', dealId: 'D-1026', due: 'Aug 10', done: true, priority: 'MEDIUM', aiRecommendation: '—', lastWhatsApp: '—', sentiment: '—', section: 'completed' },
  { id: 't11', title: 'NovaTech onboarding call done', company: 'NovaTech Software', contact: 'Meera Iyer', dealValue: '₹12L', dealId: 'D-1036', due: 'Aug 9', done: true, priority: 'LOW', aiRecommendation: '—', lastWhatsApp: '—', sentiment: '—', section: 'completed' },
  { id: 't12', title: 'Apex Edu proposal sent', company: 'Apex Educational Solutions', contact: 'Neha Gupta', dealValue: '₹7.8L', dealId: 'D-1028', due: 'Aug 8', done: true, priority: 'HIGH', aiRecommendation: '—', lastWhatsApp: '—', sentiment: '—', section: 'completed' },
];

function PriorityBadge({ priority }: { priority: string }) {
  const config: Record<string, { color: string }> = {
    HIGH: { color: 'badge-error' },
    MEDIUM: { color: 'badge-warning' },
    LOW: { color: 'badge-neutral' },
  };
  return (
    <span className={`${config[priority]?.color || 'badge-neutral'} text-[8px] font-bold px-1.5 py-0.5`}>
      {priority}
    </span>
  );
}

export default function TasksActivitiesView() {
  const [tasks, setTasks] = useState(initialTasks);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const sections = [
    { key: 'overdue', label: 'Overdue', icon: AlertTriangle },
    { key: 'today', label: 'Today', icon: Sun },
    { key: 'tomorrow', label: 'Tomorrow', icon: Clock },
    { key: 'week', label: 'This Week', icon: CalendarIcon },
    { key: 'completed', label: 'Completed', icon: CheckCircle2 },
  ];

  return (
    <div className="h-full flex gap-5 overflow-hidden">
      {/* Left: Task Workspace */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
        {/* Grouped Task Sections */}
        {sections.map((section) => {
          const sectionTasks = tasks.filter(t => t.section === section.key);
          if (sectionTasks.length === 0) return null;
          const isCollapsed = collapsedSections[section.key];
          const Icon = section.icon;

          return (
            <div key={section.key} className={`border-2 rounded-[12px] overflow-hidden transition-colors ${
              section.key === 'overdue' ? 'border-error/30 bg-error-light/5' :
              section.key === 'completed' ? 'border-success/30 bg-success-light/5' :
              'border-border-default bg-surface-card'
            }`}>
              <button
                onClick={() => toggleSection(section.key)}
                className={`w-full flex items-center justify-between px-4 py-3 border-b transition-colors ${
                  section.key === 'overdue' ? 'border-b-error/20 bg-error-light/20 hover:bg-error-light/30' :
                  section.key === 'completed' ? 'border-b-success/20 bg-success-light/20 hover:bg-success-light/30' :
                  'border-b-border-default/50 hover:bg-surface-bg-alt/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${
                    section.key === 'overdue' ? 'text-error' :
                    section.key === 'completed' ? 'text-success' :
                    'text-accent'
                  }`} />
                  <span className={`text-xs font-bold ${
                    section.key === 'overdue' ? 'text-error' :
                    section.key === 'completed' ? 'text-success' :
                    'text-text-primary'
                  }`}>{section.label}</span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                    section.key === 'overdue' ? 'bg-error/10 text-error' :
                    section.key === 'completed' ? 'bg-success/10 text-success' :
                    'text-text-muted bg-surface-bg-alt'
                  }`}>{sectionTasks.length}</span>
                </div>
                {isCollapsed ? <ChevronRight className="w-3.5 h-3.5 text-text-muted" /> : <ChevronDown className="w-3.5 h-3.5 text-text-muted" />}
              </button>
              {!isCollapsed && (
                <div className="p-3 space-y-2">
                  {sectionTasks.map((task) => (
                    <div
                      key={task.id}
                      onMouseEnter={() => setHoveredTask(task.id)}
                      onMouseLeave={() => setHoveredTask(null)}
                      className={`border-2 rounded-[10px] p-3.5 transition-all cursor-pointer relative group ${
                        section.key === 'overdue' ? 'border-error/25 bg-error-light/5 hover:bg-error-light/10' :
                        section.key === 'completed' ? 'border-success/25 bg-success-light/5 hover:bg-success-light/10' :
                        'border-border-default hover:bg-surface-bg-alt/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }}
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            task.done
                              ? section.key === 'completed'
                                ? 'bg-success border-success'
                                : 'bg-accent border-accent'
                              : task.priority === 'HIGH'
                                ? 'border-error'
                                : task.priority === 'MEDIUM'
                                  ? 'border-warning'
                                  : 'border-border-default'
                          }`}
                        >
                          {task.done && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <p className={`text-xs font-bold leading-snug ${
                                task.done
                                  ? section.key === 'completed'
                                    ? 'line-through text-success'
                                    : 'line-through text-text-muted'
                                  : section.key === 'overdue'
                                    ? 'text-error'
                                    : 'text-text-primary'
                              }`}>
                                {task.title}
                              </p>
                              {/* CRM Context */}
                              <div className="flex items-center gap-3 mt-1.5">
                                {task.company && (
                                  <span className="text-[10px] text-text-secondary flex items-center gap-1">
                                    <Building2 className="w-3 h-3 text-icon" />
                                    {task.company}
                                  </span>
                                )}
                                {task.contact && (
                                  <span className="text-[10px] text-text-secondary flex items-center gap-1">
                                    <Users className="w-3 h-3 text-icon" />
                                    {task.contact}
                                  </span>
                                )}
                                {task.dealValue && task.dealValue !== '—' && (
                                  <span className="text-[10px] font-semibold text-accent flex items-center gap-1">
                                    <DollarSign className="w-3 h-3" />
                                    {task.dealValue}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <PriorityBadge priority={task.priority} />
                              <span className={`text-[10px] font-medium flex items-center gap-1 ${
                                task.section === 'overdue' ? 'text-error' : 'text-text-muted'
                              }`}>
                                <Clock className="w-3 h-3" />
                                {task.due}
                              </span>
                            </div>
                          </div>

                          {/* AI Recommendation */}
                          {task.aiRecommendation && task.aiRecommendation !== '—' && (
                            <div className="mt-2 pt-2 border-t border-border-default/40">
                              <div className="flex items-start gap-1.5">
                                <Bot className="w-3 h-3 text-accent shrink-0 mt-0.5" />
                                <p className="text-[10px] text-accent font-medium leading-relaxed">{task.aiRecommendation}</p>
                              </div>
                            </div>
                          )}

                          {/* WhatsApp Status */}
                          {task.lastWhatsApp && task.lastWhatsApp !== '—' && (
                            <div className="mt-1.5 flex items-center gap-3 text-[9px] text-text-muted">
                              <span className="flex items-center gap-1">
                                <MessageSquare className="w-2.5 h-2.5" /> Last: {task.lastWhatsApp}
                              </span>
                              {task.sentiment && task.sentiment !== '—' && (
                                <span className={`flex items-center gap-1 font-medium ${
                                  task.sentiment === 'Positive' ? 'text-success' :
                                  task.sentiment === 'Negative' ? 'text-error' : 'text-warning'
                                }`}>
                                  Sentiment: {task.sentiment}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quick Actions on hover */}
                      {hoveredTask === task.id && !task.done && (
                        <div className="mt-2.5 pt-2.5 border-t border-border-default/40 flex items-center gap-1.5">
                          <button className="flex items-center gap-1 text-[9px] font-medium text-text-secondary hover:text-accent bg-surface-bg-alt/50 hover:bg-accent/10 rounded-md px-2 py-1 transition-colors">
                            <Phone className="w-3 h-3" /> Call
                          </button>
                          <button className="flex items-center gap-1 text-[9px] font-medium text-text-secondary hover:text-accent bg-surface-bg-alt/50 hover:bg-accent/10 rounded-md px-2 py-1 transition-colors">
                            <MessageSquare className="w-3 h-3" /> WhatsApp
                          </button>
                          <button className="flex items-center gap-1 text-[9px] font-medium text-text-secondary hover:text-accent bg-surface-bg-alt/50 hover:bg-accent/10 rounded-md px-2 py-1 transition-colors">
                            <Mail className="w-3 h-3" /> Email
                          </button>
                          <button className="flex items-center gap-1 text-[9px] font-medium text-text-secondary hover:text-accent bg-surface-bg-alt/50 hover:bg-accent/10 rounded-md px-2 py-1 transition-colors">
                            <FileText className="w-3 h-3" /> Note
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }}
                            className="flex items-center gap-1 text-[9px] font-medium text-success bg-success-light/50 hover:bg-success-light rounded-md px-2 py-1 transition-colors ml-auto"
                          >
                            <CheckCircle2 className="w-3 h-3" /> Done
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

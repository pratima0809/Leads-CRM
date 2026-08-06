'use client';

import React, { useState } from 'react';
import { 
  Bot, 
  Play, 
  Pause, 
  Settings, 
  TrendingUp, 
  BrainCircuit, 
  DollarSign, 
  Clock, 
  ShieldAlert,
  Sparkles,
  Zap
} from 'lucide-react';

type AIAgent = {
  id: string;
  name: string;
  type: string;
  status: 'ACTIVE' | 'PAUSED' | 'CONFIGURING';
  tasksCompleted: number;
  accuracy: number;
  hoursSaved: number;
  dollarSaved: number;
  description: string;
};

export default function AIAgentsView() {
  const [agents, setAgents] = useState<AIAgent[]>([
    { id: '1', name: 'Lead Qualification Bot', type: 'Lead Qualification Agent', status: 'ACTIVE', tasksCompleted: 482, accuracy: 94.5, hoursSaved: 120, dollarSaved: 4800, description: 'Analyzes incoming leads, logs intent indicators, scores them, and assigns tags.' },
    { id: '2', name: 'Smart Follow-Up Engine', type: 'Follow-Up Agent', status: 'ACTIVE', tasksCompleted: 1042, accuracy: 89.0, hoursSaved: 260, dollarSaved: 10400, description: 'Checks for stagnant conversations and drafts custom WhatsApp replies.' },
    { id: '3', name: 'Apex Meeting Scheduler', type: 'Meeting Scheduling Agent', status: 'ACTIVE', tasksCompleted: 120, accuracy: 98.2, hoursSaved: 40, dollarSaved: 1600, description: 'Interacts with leads to book calendar invites on Google/Outlook.' },
    { id: '4', name: 'Automated Proposal Draftsman', type: 'Proposal Agent', status: 'PAUSED', tasksCompleted: 64, accuracy: 92.0, hoursSaved: 32, dollarSaved: 1920, description: 'Generates custom commercial proposal drafts from call transcripts.' },
    { id: '5', name: 'KYC Document Processor', type: 'Document Processing Agent', status: 'CONFIGURING', tasksCompleted: 0, accuracy: 0, hoursSaved: 0, dollarSaved: 0, description: 'Performs OCR extraction and checks compliance limits.' },
  ]);

  const toggleAgentStatus = (id: string) => {
    setAgents(agents.map(agent => {
      if (agent.id === id) {
        const nextStatus = agent.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
        return { ...agent, status: nextStatus };
      }
      return agent;
    }));
  };

  // Calculate total ROI
  const totalHours = agents.reduce((sum, a) => sum + a.hoursSaved, 0);
  const totalSavings = agents.reduce((sum, a) => sum + a.dollarSaved, 0);

  return (
    <div className="space-y-6">
      
      {/* Overview Analytics dashboard (ROI Panel) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-surface-card dark:bg-sidebar text-text-primary dark:text-text-inverse p-6 border-0 rounded-xl relative overflow-hidden shadow-card">
        {/* flat dark card — no decorative gradient */}
        
        <div className="relative z-10 flex flex-col justify-between space-y-4 col-span-1 md:col-span-2">
          <div>
            <span className="text-[10px] font-bold text-accent uppercase tracking-widest flex items-center gap-1.5">
              <BrainCircuit className="w-4 h-4 animate-pulse" />
              AI Agent Hub & ROI Dashboard
            </span>
            <h3 className="font-extrabold text-xl mt-2 tracking-tight">Autonomous Revenue Agents</h3>
            <p className="text-xs text-text-muted mt-1 leading-relaxed max-w-lg">
              Deploy autonomous sales agents. They qualify leads, schedule meetings, draft proposals, and chase renewals around the clock.
            </p>
          </div>
          
          <div className="flex gap-8 text-xs font-semibold pt-4">
            <div>
              <span className="text-text-muted block">Total Rep Hours Saved</span>
              <span className="text-lg font-bold text-text-inverse flex items-center gap-1 mt-0.5">
                <Clock className="w-4.5 h-4.5 text-[#8B5CF6]" />
                {totalHours} hrs
              </span>
            </div>
            <div>
              <span className="text-text-muted block">Est. Revenue Impact</span>
              <span className="text-lg font-bold text-text-inverse flex items-center gap-1 mt-0.5">
                <DollarSign className="w-4.5 h-4.5 text-[#10B981]" />
                ${totalSavings.toLocaleString()} USD
              </span>
            </div>
          </div>
        </div>
 
        <div className="relative z-10 flex flex-col items-center justify-center bg-white/5 border border-white/10 p-5 rounded-xl text-center">
          <Zap className="w-8 h-8 text-[#8B5CF6] mb-2 fill-[#8B5CF6]/20" />
          <div className="text-[10px] text-text-muted uppercase tracking-wider font-bold">Workspace efficiency</div>
          <div className="text-2xl font-extrabold text-text-inverse mt-1">+34.8%</div>
          <span className="text-[9px] text-[#10B981] mt-1 font-bold">vs last month</span>
        </div>
      </div>
 
      {/* Agents Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="premium-card p-5 flex flex-col justify-between space-y-4">
            
            <div className="space-y-2">
              {/* Card top */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center shrink-0">
                    <Bot className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-text-primary text-sm">{agent.name}</h5>
                    <span className="text-[10px] text-text-muted block font-semibold">{agent.type}</span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold border ${
                  agent.status === 'ACTIVE' ? 'badge-success' :
                  agent.status === 'PAUSED' ? 'badge-warning' :
                  'badge-neutral'
                }`}>
                  {agent.status}
                </span>
              </div>

              <p className="text-xs text-text-secondary font-semibold leading-relaxed">
                {agent.description}
              </p>
            </div>

            {/* Performance info */}
            {agent.status !== 'CONFIGURING' ? (
              <div className="grid grid-cols-2 gap-3 text-center border-t border-border-default pt-3 text-[11px] font-bold text-text-primary">
                <div className="bg-surface-bg-alt p-2 rounded-lg border border-border-default">
                  <div className="text-[9px] text-text-muted">Accuracy</div>
                  <div className="mt-0.5">{agent.accuracy}%</div>
                </div>
                <div className="bg-surface-bg-alt p-2 rounded-lg border border-border-default">
                  <div className="text-[9px] text-text-muted">Tasks Run</div>
                  <div className="mt-0.5">{agent.tasksCompleted}</div>
                </div>
              </div>
            ) : (
              <div className="bg-surface-bg-alt/50 p-3 rounded-lg border border-dashed border-border-default text-center text-[10px] text-text-muted font-semibold">
                Setup triggers & credentials in Workspace settings first
              </div>
            )}

            {/* Action panel */}
            <div className="flex justify-between items-center border-t border-border-default pt-3">
              <span className="text-[10px] text-success font-bold">
                {agent.status === 'ACTIVE' && `Saved $${agent.dollarSaved}`}
              </span>
              
              <div className="flex gap-2">
                <button className="p-1.5 hover:bg-surface-bg-alt rounded border border-border-default text-icon">
                  <Settings className="w-3.5 h-3.5" />
                </button>
                {agent.status !== 'CONFIGURING' && (
                  <button
                    onClick={() => toggleAgentStatus(agent.id)}
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded transition-all border ${
                      agent.status === 'ACTIVE'
                        ? 'bg-warning-light text-warning border-warning-border hover:bg-warning-light'
                        : 'bg-success-light text-success border-success-border hover:bg-success-light'
                    }`}
                  >
                    {agent.status === 'ACTIVE' ? (
                      <>
                        <Pause className="w-3 h-3 fill-[var(--warning)]" /> Pause Agent
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 fill-[var(--success)]" /> Start Agent
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

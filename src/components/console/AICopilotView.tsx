'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Bot, Sparkles, Send, MessageSquare, Users, DollarSign,
  TrendingUp, AlertTriangle, Target, Phone, Calendar,
  BrainCircuit, Zap, CheckCircle2, Clock, ArrowRight,
  Lightbulb, ShieldAlert, BarChart3, UserCheck, X,
  Copy, ThumbsUp, ThumbsDown, ChevronRight
} from 'lucide-react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'lead_summary' | 'deal_summary' | 'next_action' | 'followup' | 'whatsapp_reply' | 'meeting_summary' | 'call_summary' | 'risk_prediction' | 'lead_scoring';
  data?: any;
  timestamp: Date;
};

const quickActions = [
  { id: 'lead_summary', label: 'Lead Summary', icon: Users, color: 'text-info' },
  { id: 'deal_summary', label: 'Deal Summary', icon: DollarSign, color: 'text-accent' },
  { id: 'next_action', label: 'Next Best Action', icon: Target, color: 'text-success' },
  { id: 'followup', label: 'Follow-up Suggestions', icon: Clock, color: 'text-warning' },
  { id: 'whatsapp_reply', label: 'WhatsApp Reply Generator', icon: MessageSquare, color: 'text-accent' },
  { id: 'meeting_summary', label: 'Meeting Summary', icon: Calendar, color: 'text-info' },
  { id: 'call_summary', label: 'Call Summary', icon: Phone, color: 'text-success' },
  { id: 'risk_prediction', label: 'Risk Prediction', icon: ShieldAlert, color: 'text-error' },
  { id: 'lead_scoring', label: 'Lead Scoring', icon: BarChart3, color: 'text-warning' },
];

const demoLeads = [
  { name: 'Rajesh Patel', company: 'Patel Steel Works', source: 'IndiaMART', score: 92, status: 'Hot', value: 45000 },
  { name: 'Priya Sharma', company: 'EduQuest Solutions', source: 'Website', score: 88, status: 'Hot', value: 24000 },
  { name: 'Amit Kumar', company: 'Kumar Logistics', source: 'WhatsApp', score: 75, status: 'Warm', value: 18000 },
  { name: 'Sunil Reddy', company: 'Reddy Constructions', source: 'JustDial', score: 62, status: 'Warm', value: 32000 },
  { name: 'Deepa Nair', company: 'Nair Healthcare', source: 'Referral', score: 45, status: 'Cold', value: 12000 },
];

const demoDeals = [
  { name: 'Apex Edu LMS', value: 24000, stage: 'Proposal', probability: 60, health: 'stuck', daysStale: 32 },
  { name: 'Patel Steel Supply', value: 45000, stage: 'Negotiation', probability: 80, health: 'hot', daysStale: 2 },
  { name: 'Reddy Construction Materials', value: 32000, stage: 'Qualified', probability: 40, health: 'warm', daysStale: 7 },
  { name: 'Nair Healthcare Setup', value: 12000, stage: 'New Lead', probability: 20, health: 'cold', daysStale: 1 },
];

function generateResponse(actionId: string): { text: string; type: Message['type']; data: any } {
  switch (actionId) {
    case 'lead_summary':
      return {
        type: 'lead_summary',
        data: { total: 48, hot: 12, warm: 24, cold: 12, leads: demoLeads, sources: { whatsapp: 42, website: 24, indiamart: 18, justdial: 10, referral: 6 } },
        text: 'Here is your lead summary. You have **48 active leads** — 12 hot, 24 warm, 12 cold. WhatsApp is your strongest source at 42%.'
      };
    case 'deal_summary':
      return {
        type: 'deal_summary',
        data: { total: 24, pipelineValue: 25400000, won: 8, lost: 3, deals: demoDeals },
        text: 'You have **24 active deals** worth ₹2.54Cr in pipeline. 8 deals closed won this quarter. Strongest stage: Negotiation.'
      };
    case 'next_action':
      return {
        type: 'next_action',
        data: { action: 'Follow up with Apex Edu LMS', reason: 'Proposal sent 32 days ago — no response', impact: 'High — ₹24,000 deal at risk', channel: 'WhatsApp template: Payment Terms & Timeline' },
        text: 'Your highest-impact next action: **Follow up with Apex Edu LMS**. Proposal has been stagnant for 32 days. Send the Payment Terms template via WhatsApp.'
      };
    case 'followup':
      return {
        type: 'followup',
        data: { lead: 'Rajesh Patel', context: 'Requested quote for steel plates 3 days ago', suggestions: ['Share delivery timeline & payment terms', 'Ask about required quantity for Q4', 'Offer volume discount for bulk order'] },
        text: 'Rajesh Patel requested a quote 3 days ago. Suggested follow-up:\n1. Share delivery timeline & payment terms\n2. Ask about Q4 quantity requirements\n3. Offer bulk volume discount'
      };
    case 'whatsapp_reply':
      return {
        type: 'whatsapp_reply',
        data: { incoming: 'Can you share the payment terms document?', reply: 'Sure Rajesh! Here are the payment terms for your quote:\n\n• 30% advance via UPI/RTGS\n• 70% on delivery (Net 30)\n• Early payment: 2% discount if paid within 7 days\n• Late payment: 1.5% monthly interest\n\nShould I share the detailed invoice?', tone: 'Professional & Warm' },
        text: 'Here is a suggested WhatsApp reply for **Rajesh Patel** who asked about payment terms.'
      };
    case 'meeting_summary':
      return {
        type: 'meeting_summary',
        data: { title: 'Product Demo — Reddy Constructions', date: 'Today, 11:00 AM', attendees: 'Sunil Reddy + Alex Mercer', duration: '35 min', keyPoints: ['Reviewed construction material catalog', 'Discussed bulk pricing for 6-month contract', 'Requested site visit for quality assessment'], nextSteps: ['Schedule site visit this Friday', 'Send bulk pricing proposal', 'Follow up in 3 days'] },
        text: 'Meeting summary for **Reddy Constructions demo** today. Key outcome: They want a site visit and bulk pricing for a 6-month contract.'
      };
    case 'call_summary':
      return {
        type: 'call_summary',
        data: { contact: 'Rajesh Patel', duration: '8:24', sentiment: 'Positive', keyPoints: ['Confirmed ASTM A36 plate availability', 'Discussed delivery timeline (next Tuesday)', 'Agreed on pricing range'], actionItems: ['Send formal proposal with delivery costs', 'Share UPI payment details', 'Schedule follow-up call post-delivery'] },
        text: 'Call summary with **Rajesh Patel** (8 min 24 sec). Sentiment: Positive. Key outcome: Pricing agreed, delivery confirmed for next Tuesday.'
      };
    case 'risk_prediction':
      return {
        type: 'risk_prediction',
        data: { atRisk: [{ deal: 'Apex Edu LMS', value: 24000, risk: 'High', reason: 'No activity in 32 days', recommendation: 'Send WhatsApp follow-up now' }, { deal: 'Nair Healthcare', value: 12000, risk: 'Medium', reason: 'Budget constraints flagged', recommendation: 'Offer phased payment plan' }], overallRisk: 'Moderate', healthScore: 72 },
        text: 'Risk analysis complete. **2 deals at risk** totaling ₹36,000. Overall pipeline health: **72%** — Moderate. Apex Edu LMS requires immediate attention.'
      };
    case 'lead_scoring':
      return {
        type: 'lead_scoring',
        data: { top: demoLeads.slice(0, 3), factors: ['WhatsApp engagement: +25 points', 'IndiaMART source: +15 points', 'Company size > 50: +10 points', 'Response within 1 hour: +20 points'], maxScore: 100 },
        text: 'Lead scoring analysis based on engagement, source quality, and response time. **Top 3 leads** all above 75 — ready for sales outreach.'
      };
    default:
      return { type: 'text', data: null, text: 'I can help you with lead analysis, deal summaries, risk prediction, and more. Select an action above or type your question.' };
  }
}

const welcomeMessage: Message = {
  id: 'welcome',
  role: 'assistant',
  content: 'Hello! I am your **AI Copilot**. I can analyze your CRM data, predict risks, generate WhatsApp replies, and help you close more deals.\n\nTry one of the quick actions below or ask me anything about your sales pipeline.',
  type: 'text',
  timestamp: new Date(),
  data: { suggestions: ['Show me my top leads', 'Which deals are at risk?', 'Summarize today\'s calls', 'Generate a WhatsApp reply'] }
};

function MessageBubble({ msg }: { msg: Message }) {
  if (msg.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%] bg-accent text-white rounded-2xl rounded-tr-sm px-4 py-2.5">
          <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center shrink-0 mt-0.5">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0 space-y-3">
        <div className="prose prose-sm max-w-none">
          <p className="text-sm text-text-primary leading-relaxed whitespace-pre-line">{msg.content}</p>
        </div>
        {msg.data?.suggestions && (
          <div className="flex flex-wrap gap-2">
            {msg.data.suggestions.map((s: string, i: number) => (
              <span key={i} className="text-xs font-medium text-accent bg-accent-light px-3 py-1.5 rounded-full border border-accent/20 cursor-pointer hover:bg-accent/10 transition-colors">
                {s}
              </span>
            ))}
          </div>
        )}
        {renderResponseCard(msg)}
      </div>
    </div>
  );
}

function renderResponseCard(msg: Message) {
  if (!msg.data || msg.type === 'text') return null;

  switch (msg.type) {
    case 'lead_summary':
      return <LeadSummaryCard data={msg.data} />;
    case 'deal_summary':
      return <DealSummaryCard data={msg.data} />;
    case 'next_action':
      return <NextActionCard data={msg.data} />;
    case 'followup':
      return <FollowUpCard data={msg.data} />;
    case 'whatsapp_reply':
      return <WhatsAppReplyCard data={msg.data} />;
    case 'meeting_summary':
      return <MeetingSummaryCard data={msg.data} />;
    case 'call_summary':
      return <CallSummaryCard data={msg.data} />;
    case 'risk_prediction':
      return <RiskPredictionCard data={msg.data} />;
    case 'lead_scoring':
      return <LeadScoringCard data={msg.data} />;
    default:
      return null;
  }
}

function LeadSummaryCard({ data }: { data: any }) {
  return (
    <div className="premium-card overflow-hidden">
      <div className="p-4 border-b border-border-default">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-info" />
          <span className="text-xs font-bold text-text-primary">Lead Overview</span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Total', value: data.total, color: 'text-text-primary' },
            { label: 'Hot', value: data.leads.filter((l: any) => l.status === 'Hot').length, color: 'text-error' },
            { label: 'Warm', value: data.leads.filter((l: any) => l.status === 'Warm').length, color: 'text-warning' },
            { label: 'Cold', value: data.leads.filter((l: any) => l.status === 'Cold').length, color: 'text-text-muted' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
              <div className="text-[10px] text-text-muted font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="divide-y divide-border-default">
        {data.leads.slice(0, 3).map((lead: any, i: number) => (
          <div key={i} className="px-4 py-2.5 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-text-primary">{lead.name}</div>
              <div className="text-[10px] text-text-muted">{lead.company} • {lead.source}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                lead.status === 'Hot' ? 'bg-error-light text-error' :
                lead.status === 'Warm' ? 'bg-warning-light text-warning' :
                'bg-surface-bg-alt text-text-muted'
              }`}>{lead.status}</span>
              <span className="text-xs font-bold text-text-primary">{lead.score}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DealSummaryCard({ data }: { data: any }) {
  return (
    <div className="premium-card p-4 space-y-4">
      <div className="flex items-center gap-2">
        <DollarSign className="w-4 h-4 text-accent" />
        <span className="text-xs font-bold text-text-primary">Pipeline Overview</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-2.5 bg-surface-bg-alt rounded-lg">
          <div className="text-lg font-bold text-text-primary">{data.total}</div>
          <div className="text-[10px] text-text-muted">Active Deals</div>
        </div>
        <div className="text-center p-2.5 bg-surface-bg-alt rounded-lg">
          <div className="text-lg font-bold text-accent">₹{(data.pipelineValue / 10000000).toFixed(1)}Cr</div>
          <div className="text-[10px] text-text-muted">Pipeline Value</div>
        </div>
        <div className="text-center p-2.5 bg-surface-bg-alt rounded-lg">
          <div className="text-lg font-bold text-success">{data.won}</div>
          <div className="text-[10px] text-text-muted">Closed Won</div>
        </div>
      </div>
      <div className="space-y-1.5">
        {data.deals.map((d: any, i: number) => (
          <div key={i} className="flex items-center justify-between py-1.5">
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${
                d.health === 'hot' ? 'bg-success' :
                d.health === 'warm' ? 'bg-warning' :
                d.health === 'stuck' ? 'bg-error' : 'bg-text-muted'
              }`} />
              <span className="text-xs text-text-primary font-medium">{d.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-text-muted">{d.stage}</span>
              <span className="text-xs font-semibold text-text-primary">₹{(d.value / 1000).toFixed(0)}k</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NextActionCard({ data }: { data: any }) {
  return (
    <div className="premium-card p-4 border-l-4 border-l-accent space-y-3">
      <div className="flex items-center gap-2">
        <Target className="w-4 h-4 text-accent" />
        <span className="text-xs font-bold text-text-primary">Recommended Action</span>
      </div>
      <div>
        <div className="text-sm font-bold text-text-primary">{data.action}</div>
        <div className="text-xs text-text-secondary mt-1">{data.reason}</div>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-warning">Impact: {data.impact}</span>
        <span className="flex items-center gap-1 text-accent font-medium">
          <MessageSquare className="w-3 h-3" /> {data.channel}
        </span>
      </div>
      <button className="w-full mt-1 bg-accent hover:bg-accent-hover text-white text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors">
        <Zap className="w-3.5 h-3.5" />
        Execute Now
      </button>
    </div>
  );
}

function FollowUpCard({ data }: { data: any }) {
  return (
    <div className="premium-card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-warning" />
        <span className="text-xs font-bold text-text-primary">Follow-up: {data.lead}</span>
      </div>
      <p className="text-xs text-text-secondary">{data.context}</p>
      <div className="space-y-2">
        {data.suggestions.map((s: string, i: number) => (
          <div key={i} className="flex items-start gap-2 p-2.5 bg-surface-bg-alt rounded-lg cursor-pointer hover:bg-accent-light transition-colors group">
            <Lightbulb className="w-3.5 h-3.5 text-warning shrink-0 mt-0.5" />
            <span className="text-xs text-text-primary flex-1">{s}</span>
            <Copy className="w-3 h-3 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

function WhatsAppReplyCard({ data }: { data: any }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="premium-card overflow-hidden">
      <div className="p-4 border-b border-border-default bg-accent-light/50">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="w-4 h-4 text-accent" />
          <span className="text-xs font-bold text-text-primary">Generated Reply</span>
          <span className="text-[10px] text-text-muted ml-auto">{data.tone}</span>
        </div>
        <p className="text-xs text-text-secondary italic">&ldquo;{data.incoming}&rdquo;</p>
      </div>
      <div className="p-4">
        <div className="bg-accent/5 rounded-lg p-3 border border-accent/10">
          <p className="text-sm text-text-primary leading-relaxed whitespace-pre-line">{data.reply}</p>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => { navigator.clipboard.writeText(data.reply); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            className="flex items-center gap-1.5 text-xs font-medium text-accent bg-accent-light px-3 py-1.5 rounded-lg hover:bg-accent/10 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button className="flex items-center gap-1.5 text-xs font-medium text-success bg-success-light px-3 py-1.5 rounded-lg hover:bg-success/10 transition-colors">
            <Send className="w-3.5 h-3.5" />
            Send via WhatsApp
          </button>
          <div className="flex items-center gap-1 ml-auto">
            <ThumbsUp className="w-3.5 h-3.5 text-text-muted cursor-pointer hover:text-success transition-colors" />
            <ThumbsDown className="w-3.5 h-3.5 text-text-muted cursor-pointer hover:text-error transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MeetingSummaryCard({ data }: { data: any }) {
  return (
    <div className="premium-card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-info" />
        <span className="text-xs font-bold text-text-primary">{data.title}</span>
      </div>
      <div className="flex items-center gap-3 text-[10px] text-text-muted">
        <span>{data.date}</span>
        <span>•</span>
        <span>{data.attendees}</span>
        <span>•</span>
        <span>{data.duration}</span>
      </div>
      <div>
        <div className="text-[10px] font-semibold text-text-secondary uppercase tracking-wide mb-1.5">Key Points</div>
        <div className="space-y-1">
          {data.keyPoints.map((p: string, i: number) => (
            <div key={i} className="flex items-start gap-2 text-xs text-text-primary">
              <CheckCircle2 className="w-3 h-3 text-success shrink-0 mt-0.5" />
              {p}
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-border-default pt-2">
        <div className="text-[10px] font-semibold text-text-secondary uppercase tracking-wide mb-1.5">Next Steps</div>
        <div className="flex flex-wrap gap-1.5">
          {data.nextSteps.map((s: string, i: number) => (
            <span key={i} className="text-[10px] font-medium bg-surface-bg-alt text-text-secondary px-2 py-1 rounded flex items-center gap-1">
              <ArrowRight className="w-2.5 h-2.5" />
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function CallSummaryCard({ data }: { data: any }) {
  return (
    <div className="premium-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-success" />
          <span className="text-xs font-bold text-text-primary">{data.contact}</span>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="text-text-muted">{data.duration}</span>
          <span className="bg-success-light text-success text-[9px] font-bold px-1.5 py-0.5 rounded">{data.sentiment}</span>
        </div>
      </div>
      <div>
        <div className="text-[10px] font-semibold text-text-secondary uppercase tracking-wide mb-1.5">Key Points</div>
        <div className="space-y-1">
          {data.keyPoints.map((p: string, i: number) => (
            <div key={i} className="flex items-start gap-2 text-xs text-text-primary">
              <CheckCircle2 className="w-3 h-3 text-success shrink-0 mt-0.5" />
              {p}
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-border-default pt-2">
        <div className="text-[10px] font-semibold text-text-secondary uppercase tracking-wide mb-1.5">Action Items</div>
        {data.actionItems.map((a: string, i: number) => (
          <div key={i} className="flex items-center gap-2 text-xs text-text-primary py-0.5">
            <div className="w-4 h-4 rounded border-2 border-warning flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-warning" />
            </div>
            {a}
          </div>
        ))}
      </div>
    </div>
  );
}

function RiskPredictionCard({ data }: { data: any }) {
  return (
    <div className="premium-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-error" />
          <span className="text-xs font-bold text-text-primary">Risk Assessment</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-text-muted">Health:</span>
          <div className="flex items-center gap-1">
            <div className="w-16 h-1.5 bg-surface-bg-alt rounded-full overflow-hidden">
              <div className="h-full bg-warning rounded-full" style={{ width: `${data.healthScore}%` }} />
            </div>
            <span className="text-[10px] font-bold text-warning">{data.healthScore}%</span>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {data.atRisk.map((r: any, i: number) => (
          <div key={i} className="p-3 bg-surface-bg-alt rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-primary">{r.deal}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                r.risk === 'High' ? 'bg-error-light text-error' : 'bg-warning-light text-warning'
              }`}>{r.risk} Risk</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-text-muted">Value: ₹{(r.value / 1000).toFixed(0)}k</span>
              <span className="text-text-muted">{r.reason}</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-accent font-medium">
              <Lightbulb className="w-3 h-3" />
              {r.recommendation}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeadScoringCard({ data }: { data: any }) {
  return (
    <div className="premium-card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-warning" />
        <span className="text-xs font-bold text-text-primary">Lead Scoring — Top Prospects</span>
      </div>
      <div className="space-y-2">
        {data.top.map((lead: any, i: number) => (
          <div key={i} className="flex items-center justify-between p-2.5 bg-surface-bg-alt rounded-lg">
            <div>
              <div className="text-xs font-semibold text-text-primary">{lead.name}</div>
              <div className="text-[10px] text-text-muted">{lead.company} • {lead.source}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-surface-bg-alt rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${lead.score >= 75 ? 'bg-success' : lead.score >= 50 ? 'bg-warning' : 'bg-text-muted'}`}
                  style={{ width: `${lead.score}%` }} />
              </div>
              <span className="text-xs font-bold text-text-primary">{lead.score}</span>
            </div>
          </div>
        ))}
      </div>
      <div>
        <div className="text-[10px] font-semibold text-text-secondary uppercase tracking-wide mb-1.5">Scoring Factors</div>
        <div className="space-y-1">
          {data.factors.map((f: string, i: number) => (
            <div key={i} className="flex items-center gap-2 text-[10px] text-text-secondary">
              <Zap className="w-3 h-3 text-warning" />
              {f}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AICopilotView() {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [input, setInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (role: 'user' | 'assistant', text: string, type?: Message['type'], data?: any) => {
    const msg: Message = { id: crypto.randomUUID(), role, content: text, type: type || 'text', data, timestamp: new Date() };
    setMessages((prev) => [...prev, msg]);
  };

  const handleAction = (actionId: string) => {
    const action = quickActions.find((a) => a.id === actionId);
    if (!action) return;
    addMessage('user', `Show me ${action.label}`, 'text');
    setLoading(true);
    setTimeout(() => {
      const response = generateResponse(actionId);
      addMessage('assistant', response.text, response.type, response.data);
      setLoading(false);
    }, 800);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    addMessage('user', input, 'text');
    setInput('');
    setLoading(true);

    const lower = input.toLowerCase();
    let actionId = '';
    if (lower.includes('lead') && (lower.includes('summary') || lower.includes('show'))) actionId = 'lead_summary';
    else if (lower.includes('deal') && (lower.includes('summary') || lower.includes('pipeline'))) actionId = 'deal_summary';
    else if (lower.includes('risk') || lower.includes('prediction')) actionId = 'risk_prediction';
    else if (lower.includes('score') || lower.includes('scoring')) actionId = 'lead_scoring';
    else if (lower.includes('whatsapp') || lower.includes('reply') || lower.includes('generate')) actionId = 'whatsapp_reply';
    else if (lower.includes('meeting')) actionId = 'meeting_summary';
    else if (lower.includes('call')) actionId = 'call_summary';
    else if (lower.includes('follow') || lower.includes('next')) actionId = 'next_action';

    setTimeout(() => {
      if (actionId) {
        const response = generateResponse(actionId);
        addMessage('assistant', response.text, response.type, response.data);
      } else {
        addMessage('assistant', 'I can help you with lead summaries, deal analysis, risk prediction, WhatsApp replies, and more. Try clicking one of the quick actions or ask me something specific about your CRM data.', 'text');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] gap-0 -m-4 lg:-m-6">
      
      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-3 px-6 py-3 border-b border-border-default bg-surface-card">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-1 text-text-secondary hover:text-text-primary">
            <ChevronRight className={`w-4 h-4 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
          <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center">
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-text-primary">AI Copilot</h2>
            <p className="text-[11px] text-text-muted">Ask anything about your CRM</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 no-scrollbar">
          {messages.map((msg, idx) => (
            <div key={msg.id} style={{ animationDelay: `${Math.min(idx * 30, 300)}ms` }} className="animate-fadeInUp">
              <MessageBubble msg={msg} />
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-surface-bg-alt flex items-center justify-center">
                <Bot className="w-4 h-4 text-text-muted" />
              </div>
              <div className="flex items-center gap-1.5 py-2">
                <span className="w-2 h-2 rounded-full bg-accent/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-accent/80 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="px-6 py-3 border-t border-border-default bg-surface-card">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 bg-surface-bg border border-border-default rounded-xl px-4 py-2.5 focus-within:border-accent transition-colors">
              <MessageSquare className="w-4 h-4 text-icon shrink-0" />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask: 'Which deals are at risk?' or click an action..."
                className="flex-1 bg-transparent border-0 outline-none text-sm text-text-primary placeholder:text-text-muted"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="w-10 h-10 bg-accent hover:bg-accent-hover disabled:bg-accent/40 text-white rounded-xl flex items-center justify-center transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Quick Actions Sidebar */}
      <div className={`${sidebarOpen ? 'w-60' : 'w-0'} border-l border-border-default bg-surface-card transition-all duration-200 overflow-hidden hidden lg:block`}>
        <div className="p-4 space-y-4">
          <div>
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Quick Actions</h3>
            <p className="text-[10px] text-text-muted mt-0.5">One-click insights</p>
          </div>
          <div className="space-y-1">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => handleAction(action.id)}
                  aria-label={`Get ${action.label}`}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-bg-alt transition-all group"
                >
                  <Icon className={`w-4 h-4 ${action.color}`} />
                  <span className="truncate">{action.label}</span>
                  <ChevronRight className="w-3 h-3 ml-auto text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-border-default">
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-2">Active Context</h3>
            <div className="bg-accent-light rounded-lg p-3">
              <div className="flex items-center gap-2 text-xs text-accent font-semibold mb-1">
                <BrainCircuit className="w-3.5 h-3.5" />
                Dashboard View
              </div>
              <p className="text-[10px] text-text-secondary leading-relaxed">
                I can see your CRM data. Ask me about leads, deals, or try a quick action.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <div className="flex items-center gap-2 text-[10px] text-text-muted">
              <ShieldAlert className="w-3 h-3" />
              <span>AI confidence: 94%</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

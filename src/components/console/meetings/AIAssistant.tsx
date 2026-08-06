'use client';

import { useMeetingStore, Meeting } from '@/lib/meetingStore';
import { Sparkles, Target, CheckCircle2, Zap, Bot, FileText, Mail, Calendar, ListTodo, MessageSquare, Loader2, Users, Plus } from 'lucide-react';
import React, { useState } from 'react';

function generateAgenda(title: string, company: string): string {
  const templates = [
    `1. Review current status with ${company || 'the team'}\n2. ${title} discussion\n3. Action items and next steps\n4. Timeline and milestones`,
    `1. Opening and context for ${title}\n2. Key metrics review\n3. ${company ? `${company} partnership update` : 'Project updates'}\n4. Risk and blocker discussion\n5. Next meeting scheduling`,
    `1. ${title} overview and objectives\n2. Progress review\n3. Challenges and solutions\n4. Resource planning\n5. Q&A and next steps`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

const mockAttendees: Record<string, string[]> = {
  client: ['Sarah Connor (Account Exec)', 'Rajesh Verma (Solutions)', 'Priya Sharma (Support)'],
  internal: ['Arun Patel (Engineering)', 'Neha Gupta (Product)', 'Vikram Mehta (Design)'],
};

const mockFollowUps = [
  'Send meeting recap and action items to all attendees',
  'Schedule follow-up review in 2 weeks',
  'Share relevant documentation and resources',
  'Update CRM with meeting notes and outcomes',
  'Assign ownership for each action item',
];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
}

export default function AIAssistant() {
  const { selectedMeetingId, meetings, addToast } = useMeetingStore();
  const meeting = meetings.find(m => m.id === selectedMeetingId);

  const [generatingAgenda, setGeneratingAgenda] = useState(false);
  const [generatedAgenda, setGeneratedAgenda] = useState('');

  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState('');

  const [generatingFollowUps, setGeneratingFollowUps] = useState(false);
  const [followUps, setFollowUps] = useState<string[]>([]);
  const [checkedFollowUps, setCheckedFollowUps] = useState<Set<number>>(new Set());

  const [suggestingAttendees, setSuggestingAttendees] = useState(false);
  const [suggestedAttendees, setSuggestedAttendees] = useState<string[]>([]);

  const [generatingActions, setGeneratingActions] = useState(false);
  const [actionItems, setActionItems] = useState<string[]>([]);

  const [suggestingDate, setSuggestingDate] = useState(false);
  const [suggestedDate, setSuggestedDate] = useState('');

  const [generatingRecap, setGeneratingRecap] = useState(false);
  const [recap, setRecap] = useState('');

  if (!meeting || !selectedMeetingId) return null;

  const handleGenerateAgenda = () => {
    setGeneratingAgenda(true);
    setGeneratedAgenda('');
    setTimeout(() => {
      setGeneratedAgenda(generateAgenda(meeting.title, meeting.company));
      setGeneratingAgenda(false);
    }, 1000);
  };

  const handleGenerateSummary = () => {
    setGeneratingSummary(true);
    setGeneratedSummary('');
    setTimeout(() => {
      const previous = meetings.filter(m => m.company === meeting.company && m.status === 'completed' && m.id !== meeting.id);
      const totalActions = previous.length * 3;
      const completed = Math.floor(totalActions * 0.6);
      const inProgress = totalActions - completed;
      setGeneratedSummary(
        `Found ${previous.length} previous meeting(s) with ${meeting.company || 'the team'}.\n` +
        `Action items: ${totalActions} total, ${completed} completed, ${inProgress} in progress.\n` +
        `Key outcomes: Project milestones on track, budget approved for next phase.`
      );
      setGeneratingSummary(false);
    }, 1200);
  };

  const handleSuggestFollowUps = () => {
    setGeneratingFollowUps(true);
    setFollowUps([]);
    setCheckedFollowUps(new Set());
    setTimeout(() => {
      setFollowUps(mockFollowUps);
      setGeneratingFollowUps(false);
    }, 800);
  };

  const handleToggleFollowUp = (idx: number) => {
    setCheckedFollowUps(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handleSuggestAttendees = () => {
    setSuggestingAttendees(true);
    setSuggestedAttendees([]);
    setTimeout(() => {
      const list = mockAttendees[meeting.type] || mockAttendees.internal;
      setSuggestedAttendees(list);
      setSuggestingAttendees(false);
    }, 600);
  };

  const handleAddSuggestedAttendee = (name: string) => {
    const plainName = name.split(' (')[0];
    if (!meeting.participants.includes(plainName)) {
      useMeetingStore.getState().updateMeeting(meeting.id, {
        participants: [...meeting.participants, plainName],
      });
      addToast(`${plainName} added to meeting`);
    }
  };

  const handleGenerateActionItems = () => {
    setGeneratingActions(true);
    setActionItems([]);
    setTimeout(() => {
      const items = [
        'Finalize meeting agenda and share with attendees',
        'Prepare presentation materials and demos',
        'Review previous meeting notes and action items',
        'Confirm attendee availability and send calendar invites',
        'Set up meeting recording and transcription',
      ];
      setActionItems(items);
      setGeneratingActions(false);
    }, 900);
  };

  const handleSuggestDate = () => {
    setSuggestingDate(true);
    setSuggestedDate('');
    setTimeout(() => {
      const d = new Date(meeting.startDate + 'T00:00:00');
      d.setDate(d.getDate() + 14);
      setSuggestedDate(formatDate(d.toISOString().split('T')[0]));
      setSuggestingDate(false);
    }, 500);
  };

  const handleCreateRecap = () => {
    setGeneratingRecap(true);
    setRecap('');
    setTimeout(() => {
      const text = [
        `Meeting Recap: ${meeting.title}`,
        `Date: ${formatDate(meeting.startDate)}`,
        `Duration: ${meeting.duration}`,
        `Attendees: ${meeting.participants.join(', ')}`,
        ``,
        `Agenda:`,
        meeting.agenda || 'No agenda',
        ``,
        `Key Discussion Points:`,
        `- Reviewed current status and progress`,
        `- Discussed next steps and action items`,
        `- Aligned on timeline and milestones`,
        ``,
        `Action Items:`,
        `1. Follow up on action items within 1 week`,
        `2. Schedule next review meeting`,
        `3. Share documentation with the team`,
      ].join('\n');
      setRecap(text);
      setGeneratingRecap(false);
    }, 1100);
  };

  const handleEmailSummary = async () => {
    const text = [
      `Subject: Meeting Summary - ${meeting.title}`,
      ``,
      `Hi team,`,
      ``,
      `Here is a summary of our meeting on ${formatDate(meeting.startDate)}:`,
      ``,
      `Agenda:`,
      meeting.agenda || 'No agenda',
      ``,
      `Duration: ${meeting.duration}`,
      `Attendees: ${meeting.participants.join(', ')}`,
      ``,
      `Next steps will be shared shortly.`,
      ``,
      `Best regards`,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      addToast('Email summary copied to clipboard');
    } catch {
      addToast('Failed to copy', 'error');
    }
  };

  const btnBase = 'flex items-center gap-1.5 w-full text-[9px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors';

  return (
    <div className="bg-gradient-to-br from-surface-card to-surface-bg-alt dark:from-sidebar dark:to-sidebar-hover border border-border-default dark:border-sidebar-hover rounded-[12px] p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl -translate-y-1/4 translate-x-1/4 pointer-events-none" />
      <div className="relative z-10 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-accent/20 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-accent" />
          </div>
          <h3 className="text-xs font-bold text-text-primary dark:text-white">AI Meeting Assistant</h3>
        </div>

        {/* Suggested Agenda */}
        <div className="bg-white/5 dark:bg-white/5 border border-white/10 rounded-lg p-2.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Target className="w-3 h-3 text-accent" />
              <span className="text-[10px] font-semibold text-text-primary dark:text-slate-100">Suggested Agenda</span>
            </div>
            <button onClick={handleGenerateAgenda} disabled={generatingAgenda} className="text-[8px] font-semibold text-accent hover:underline disabled:opacity-40">
              {generatingAgenda ? 'Generating...' : 'Generate Agenda'}
            </button>
          </div>
          {generatingAgenda && (
            <div className="flex items-center gap-2 text-[10px] text-text-muted">
              <Loader2 className="w-3 h-3 animate-spin" />
              Generating agenda...
            </div>
          )}
          {generatedAgenda && (
            <p className="text-[10px] text-text-secondary dark:text-sidebar-text leading-relaxed whitespace-pre-wrap">{generatedAgenda}</p>
          )}
        </div>

        {/* Summarize Previous Meetings */}
        <div className="bg-white/5 dark:bg-white/5 border border-white/10 rounded-lg p-2.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Bot className="w-3 h-3 text-info" />
              <span className="text-[10px] font-semibold text-text-primary dark:text-slate-100">Meeting Summary</span>
            </div>
            <button onClick={handleGenerateSummary} disabled={generatingSummary} className="text-[8px] font-semibold text-accent hover:underline disabled:opacity-40">
              {generatingSummary ? 'Generating...' : 'Generate Summary'}
            </button>
          </div>
          {generatingSummary && (
            <div className="flex items-center gap-2 text-[10px] text-text-muted">
              <Loader2 className="w-3 h-3 animate-spin" />
              Analyzing previous meetings...
            </div>
          )}
          {generatedSummary && (
            <p className="text-[10px] text-text-secondary dark:text-sidebar-text leading-relaxed whitespace-pre-wrap">{generatedSummary}</p>
          )}
        </div>

        {/* Follow-up Suggestions */}
        <div className="bg-white/5 dark:bg-white/5 border border-white/10 rounded-lg p-2.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-warning" />
              <span className="text-[10px] font-semibold text-text-primary dark:text-slate-100">Follow-up Suggestions</span>
            </div>
            <button onClick={handleSuggestFollowUps} disabled={generatingFollowUps} className="text-[8px] font-semibold text-accent hover:underline disabled:opacity-40">
              {generatingFollowUps ? 'Suggesting...' : 'Suggest Follow-ups'}
            </button>
          </div>
          {generatingFollowUps && (
            <div className="flex items-center gap-2 text-[10px] text-text-muted">
              <Loader2 className="w-3 h-3 animate-spin" />
              Generating follow-ups...
            </div>
          )}
          {followUps.length > 0 && (
            <div className="space-y-1">
              {followUps.map((item, idx) => (
                <label key={idx} className="flex items-start gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={checkedFollowUps.has(idx)} onChange={() => handleToggleFollowUp(idx)} className="mt-0.5 w-3 h-3 accent-accent rounded" />
                  <span className={`text-[9px] ${checkedFollowUps.has(idx) ? 'line-through text-text-muted' : 'text-text-secondary dark:text-sidebar-text'}`}>{item}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Suggest Attendees */}
        <div className="bg-white/5 dark:bg-white/5 border border-white/10 rounded-lg p-2.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Users className="w-3 h-3 text-accent" />
              <span className="text-[10px] font-semibold text-text-primary dark:text-slate-100">Suggest Attendees</span>
            </div>
            <button onClick={handleSuggestAttendees} disabled={suggestingAttendees} className="text-[8px] font-semibold text-accent hover:underline disabled:opacity-40">
              {suggestingAttendees ? 'Suggesting...' : 'Suggest Attendees'}
            </button>
          </div>
          {suggestingAttendees && (
            <div className="flex items-center gap-2 text-[10px] text-text-muted">
              <Loader2 className="w-3 h-3 animate-spin" />
              Analyzing meeting context...
            </div>
          )}
          {suggestedAttendees.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {suggestedAttendees.map((name) => (
                <div key={name} className="flex items-center gap-1 bg-accent/10 text-accent text-[9px] font-medium px-2 py-0.5 rounded-full">
                  <span>{name}</span>
                  <button onClick={() => handleAddSuggestedAttendee(name)} className="hover:text-accent-hover">
                    <Plus className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Generate Action Items */}
        <div className="bg-white/5 dark:bg-white/5 border border-white/10 rounded-lg p-2.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ListTodo className="w-3 h-3 text-success" />
              <span className="text-[10px] font-semibold text-text-primary dark:text-slate-100">Action Items</span>
            </div>
            <button onClick={handleGenerateActionItems} disabled={generatingActions} className="text-[8px] font-semibold text-accent hover:underline disabled:opacity-40">
              {generatingActions ? 'Generating...' : 'Generate Action Items'}
            </button>
          </div>
          {generatingActions && (
            <div className="flex items-center gap-2 text-[10px] text-text-muted">
              <Loader2 className="w-3 h-3 animate-spin" />
              Generating action items...
            </div>
          )}
          {actionItems.length > 0 && (
            <ol className="list-decimal list-inside space-y-0.5">
              {actionItems.map((item, idx) => (
                <li key={idx} className="text-[9px] text-text-secondary dark:text-sidebar-text">{item}</li>
              ))}
            </ol>
          )}
        </div>

        {/* Suggest Next Meeting Date */}
        <div className="bg-white/5 dark:bg-white/5 border border-white/10 rounded-lg p-2.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-info" />
              <span className="text-[10px] font-semibold text-text-primary dark:text-slate-100">Next Meeting Date</span>
            </div>
            <button onClick={handleSuggestDate} disabled={suggestingDate} className="text-[8px] font-semibold text-accent hover:underline disabled:opacity-40">
              {suggestingDate ? 'Suggesting...' : 'Suggest Date'}
            </button>
          </div>
          {suggestingDate && (
            <div className="flex items-center gap-2 text-[10px] text-text-muted">
              <Loader2 className="w-3 h-3 animate-spin" />
              Calculating optimal date...
            </div>
          )}
          {suggestedDate && (
            <p className="text-[10px] text-text-secondary dark:text-sidebar-text">Suggested follow-up: <span className="font-semibold text-text-primary">{suggestedDate}</span></p>
          )}
        </div>

        {/* Create Recap & Email Summary */}
        <div className="bg-white/5 dark:bg-white/5 border border-white/10 rounded-lg p-2.5 space-y-1.5">
          <div className="flex items-center gap-1.5">
            <FileText className="w-3 h-3 text-accent" />
            <span className="text-[10px] font-semibold text-text-primary dark:text-slate-100">Recap & Email</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleCreateRecap} disabled={generatingRecap} className={`${btnBase} bg-accent/10 text-accent hover:bg-accent/20 disabled:opacity-40`}>
              {generatingRecap ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileText className="w-3 h-3" />}
              Create Recap
            </button>
            <button onClick={handleEmailSummary} className={`${btnBase} bg-info/10 text-info hover:bg-info/20`}>
              <Mail className="w-3 h-3" /> Email Summary
            </button>
          </div>
          {generatingRecap && (
            <div className="flex items-center gap-2 text-[10px] text-text-muted">
              <Loader2 className="w-3 h-3 animate-spin" />
              Generating recap...
            </div>
          )}
          {recap && (
            <p className="text-[10px] text-text-secondary dark:text-sidebar-text leading-relaxed whitespace-pre-wrap bg-surface-bg/50 rounded p-2 max-h-24 overflow-y-auto">{recap}</p>
          )}
        </div>

        <div className="text-[8px] text-text-muted dark:text-sidebar-text-muted text-center pt-1 border-t border-white/5">
          AI-powered suggestions • Accuracy may vary
        </div>
      </div>
    </div>
  );
}

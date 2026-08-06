'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  MessageSquare, Send, Bot, Sparkles, User, Search, Filter,
  Check, CheckCheck, Paperclip, Phone, Calendar, MoreHorizontal,
  Star, UserPlus, Link2, FileText, Clock, ChevronDown,
  ChevronRight, Circle, Mic, Smile, Image, Hash, Plus,
  ArrowUpRight, ShieldAlert, Users, Layout, Tag, X,
  Copy, ThumbsUp, ThumbsDown, PanelRightOpen, PanelRightClose,
  ListTodo, MessagesSquare, BarChart3, Megaphone, BookTemplate,
  ReplyAll,   CircleCheck, UserCheck, Mail, Loader2
} from 'lucide-react';
import { useStore } from '@/lib/store';
import LinkLeadModal from './QuickActions/LinkLeadModal';
import CreateContactModal from './QuickActions/CreateContactModal';
import ScheduleMeetingModal from './QuickActions/ScheduleMeetingModal';
import AddNoteModal from './QuickActions/AddNoteModal';
import { useAppearance } from '@/hooks/useAppearance';

const teamMembers = [
  { id: 'u1', name: 'Alex Mercer', initials: 'AM', color: 'bg-info' },
  { id: 'u2', name: 'Sarah Connor', initials: 'SC', color: 'bg-accent' },
  { id: 'u3', name: 'Unassigned', initials: '?', color: 'bg-text-muted' },
];

const filters = [
  { id: 'all', label: 'All Chats', icon: MessagesSquare },
  { id: 'unread', label: 'Unread', icon: Circle },
  { id: 'assigned', label: 'Assigned', icon: UserCheck },
  { id: 'unassigned', label: 'Unassigned', icon: UserPlus },
];

const mockChats = [
  {
    id: 'chat-1',
    contactName: 'Rajesh Patel',
    phone: '+91 98765 43210',
    unreadCount: 2,
    lastMessage: 'Can you share the steel plate specifications PDF?',
    lastMessageTime: '10:42 AM',
    assignee: 'u1',
    source: 'IndiaMART',
    score: 92,
    dealValue: 45000,
    dealStage: 'Negotiation',
    status: 'hot',
    tags: ['Bulk Order', 'Manufacturing'],
    messages: [
      { sender: 'client', text: 'Hi, I saw your catalog on IndiaMART. Interested in the structural carbon steel plates.', time: '10:30 AM' },
      { sender: 'bot', text: 'Hello Rajesh! Thanks for reaching out. One of our reps will be with you shortly. What size plates are you looking for?', time: '10:31 AM' },
      { sender: 'client', text: 'We need 50 tons of ASTM A36 plates. Thickness: 12mm.', time: '10:35 AM' },
      { sender: 'agent', text: 'Hello Rajesh, this is Alex from Acme. I see you need 50 tons of 12mm ASTM A36. I can prepare a quote right away.', time: '10:40 AM' },
      { sender: 'client', text: 'Can you share the steel plate specifications PDF and delivery lead time?', time: '10:42 AM' },
    ],
  },
  {
    id: 'chat-2',
    contactName: 'Priya Sharma',
    phone: '+91 99887 76655',
    unreadCount: 1,
    lastMessage: 'Thank you for the quote. When can we expect delivery?',
    lastMessageTime: '11:15 AM',
    assignee: 'u1',
    source: 'Website',
    score: 88,
    dealValue: 24000,
    dealStage: 'Proposal',
    status: 'hot',
    tags: ['Education', 'SaaS'],
    messages: [
      { sender: 'client', text: 'Hi, I am evaluating LMS platforms for our institute.', time: '9:00 AM' },
      { sender: 'agent', text: 'Hello Priya! Great to hear from EduQuest. I can show you a demo of our LMS platform.', time: '9:05 AM' },
      { sender: 'client', text: 'We have about 2,000 students. Need something scalable.', time: '9:15 AM' },
      { sender: 'agent', text: 'Perfect, our enterprise plan supports unlimited users. I will send you a custom quote.', time: '9:20 AM' },
      { sender: 'bot', text: 'Quote #Q-8029 has been sent to Priya via email and WhatsApp.', time: '9:30 AM' },
      { sender: 'client', text: 'Thank you for the quote. When can we expect delivery?', time: '11:15 AM' },
    ],
  },
  {
    id: 'chat-3',
    contactName: 'Amit Kumar',
    phone: '+91 87654 32100',
    unreadCount: 0,
    lastMessage: 'Will check the pricing page.',
    lastMessageTime: 'Yesterday',
    assignee: null,
    source: 'WhatsApp',
    score: 75,
    dealValue: 18000,
    dealStage: 'Qualified',
    status: 'warm',
    tags: ['Logistics'],
    messages: [
      { sender: 'client', text: 'Are your WhatsApp APIs globally compliant?', time: 'Yesterday' },
      { sender: 'bot', text: 'Yes Amit, we support standard Meta WhatsApp Cloud APIs with global compliance.', time: 'Yesterday' },
      { sender: 'client', text: 'Will check the pricing page.', time: 'Yesterday' },
    ],
  },
  {
    id: 'chat-4',
    contactName: 'Sunil Reddy',
    phone: '+91 76543 21098',
    unreadCount: 0,
    lastMessage: 'Demo was excellent. Please send onboarding docs.',
    lastMessageTime: '2:30 PM',
    assignee: 'u2',
    source: 'JustDial',
    score: 82,
    dealValue: 32000,
    dealStage: 'Negotiation',
    status: 'hot',
    tags: ['Construction', 'Site Visit'],
    messages: [
      { sender: 'client', text: 'Need construction materials for a 6-month project.', time: '1:00 PM' },
      { sender: 'agent', text: 'Hello Sunil! We can supply all materials. Let me schedule a product demo.', time: '1:05 PM' },
      { sender: 'client', text: 'Demo was excellent. Please send the onboarding docs.', time: '2:30 PM' },
    ],
  },
  {
    id: 'chat-5',
    contactName: 'Deepa Nair',
    phone: '+91 65432 10987',
    unreadCount: 0,
    lastMessage: 'Budget is tight right now. Will revisit next quarter.',
    lastMessageTime: '3:45 PM',
    assignee: null,
    source: 'Referral',
    score: 45,
    dealValue: 12000,
    dealStage: 'New Lead',
    status: 'cold',
    tags: ['Healthcare'],
    messages: [
      { sender: 'client', text: 'Looking for a clinic management system.', time: '3:00 PM' },
      { sender: 'agent', text: 'Hi Deepa! We have a solution tailored for healthcare clinics.', time: '3:10 PM' },
      { sender: 'client', text: 'Budget is tight right now. Will revisit next quarter.', time: '3:45 PM' },
    ],
  },
];

const quickReplies = [
  { id: 'qr1', label: 'Share Quote', text: 'Sure! Here is the quote you requested. Let me know if you have any questions.' },
  { id: 'qr2', label: 'Schedule Demo', text: 'I would love to show you a demo. Are you free this Thursday at 2 PM or Friday at 11 AM?' },
  { id: 'qr3', label: 'Payment Follow-up', text: 'Just a gentle reminder about the payment. Let me know if you need the invoice re-sent.' },
  { id: 'qr4', label: 'Thank You', text: 'Thank you for your time! Let me know if you need anything else.' },
  { id: 'qr5', label: 'Request Info', text: 'Could you share more details about your requirements so I can prepare the best solution?' },
];

const templates = [
  { id: 't1', name: 'Welcome Onboarding', category: 'Onboarding', content: 'Hi {{name}}, welcome to Acme! Here is your onboarding checklist...', conversion: '20%' },
  { id: 't2', name: 'Festive Discount', category: 'Promotions', content: 'Hi {{name}}, festive offer! Get 15% off on all orders above ₹50,000...', conversion: '12%' },
  { id: 't3', name: 'Proposal Follow-up', category: 'Sales', content: 'Hi {{name}}, just checking if you had a chance to review the proposal...', conversion: '42%' },
  { id: 't4', name: 'Payment Reminder', category: 'Finance', content: 'Hi {{name}}, this is a reminder that your payment of {{amount}} is due...', conversion: '68%' },
];

const recentBroadcasts = [
  { id: 'b1', name: 'Festive Season Offer', sent: 48, delivered: 46, read: 38, replied: 12, date: 'Today, 9:00 AM' },
  { id: 'b2', name: 'Product Launch Alert', sent: 120, delivered: 118, read: 92, replied: 28, date: 'Yesterday' },
];

function StatusDot({ status }: { status: string }) {
  return (
    <span className={`w-2 h-2 rounded-full shrink-0 ${
      status === 'hot' ? 'bg-success animate-pulse' :
      status === 'warm' ? 'bg-warning' :
      'bg-text-muted'
    }`} />
  );
}

function AssigneeAvatar({ assignee }: { assignee: string | null }) {
  const member = teamMembers.find(m => m.id === assignee);
  if (!member) {
    return <div className="w-5 h-5 rounded-full bg-surface-bg-alt flex items-center justify-center text-[8px] font-bold text-text-muted border border-border-default">?</div>;
  }
  return (
    <div className={`w-5 h-5 rounded-full ${member.color} flex items-center justify-center text-[8px] font-bold text-white`}>
      {member.initials}
    </div>
  );
}

function ChatBubble({ msg }: { msg: { sender: string; text: string; time: string } }) {
  const isClient = msg.sender === 'client';
  const isBot = msg.sender === 'bot';
  return (
    <div className={`flex flex-col max-w-[80%] animate-fadeInUp ${isClient ? 'mr-auto' : 'ml-auto'}`}>
      <div className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
        isClient
          ? 'bg-surface-card border border-border-default text-text-primary rounded-tl-none'
          : isBot
            ? 'bg-accent-light/50 border border-accent/20 text-text-primary rounded-tr-none'
            : 'bg-accent text-white rounded-tr-none'
      }`}>
        {isBot && (
          <span className="flex items-center gap-1 text-[9px] font-bold text-accent uppercase tracking-wider mb-1">
            <Bot className="w-3 h-3" />
            AI Agent
          </span>
        )}
        <p>{msg.text}</p>
      </div>
      <div className={`flex items-center gap-1 mt-1 ${isClient ? '' : 'justify-end'}`}>
        {!isClient && <CheckCheck className="w-3 h-3 text-accent" />}
        <span className="text-[9px] text-text-muted">{msg.time}</span>
      </div>
    </div>
  );
}

function InboxPanel({ chats, selectedChatId, onSelectChat }: {
  chats: typeof mockChats; selectedChatId: string | null; onSelectChat: (id: string) => void;
}) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = chats.filter(c => {
    const matchesSearch = c.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery);
    if (activeFilter === 'unread') return matchesSearch && c.unreadCount > 0;
    if (activeFilter === 'assigned') return matchesSearch && c.assignee !== null;
    if (activeFilter === 'unassigned') return matchesSearch && c.assignee === null;
    return matchesSearch;
  });

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border-default space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-accent" />
            Inbox
          </h3>
          <span className="text-[10px] font-medium bg-accent-light text-accent px-2 py-0.5 rounded-md">
            {chats.reduce((s, c) => s + c.unreadCount, 0)} new
          </span>
        </div>
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-icon" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-bg border border-border-default rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none focus:border-accent text-text-primary placeholder:text-text-muted"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap no-scrollbar px-2 py-1">
          {filters.map((f) => {
            const Icon = f.icon;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                aria-pressed={activeFilter === f.id}
                className={`h-9 px-4 rounded-full flex items-center justify-center whitespace-nowrap flex-shrink-0 transition-all duration-200 text-xs font-medium gap-1.5 ${
                  activeFilter === f.id
                    ? 'bg-accent text-white shadow-sm'
                    : 'bg-transparent text-text-secondary hover:bg-surface-bg-alt border border-border-default/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {f.label}
                {f.id === 'unread' && <span className="ml-0.5">({chats.reduce((s, c) => s + c.unreadCount, 0)})</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-border-default">
        {filtered.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`w-full text-left p-3 hover:bg-surface-bg-alt transition-colors relative hover-lift ${
              selectedChatId === chat.id ? 'bg-accent-light/30' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full bg-surface-bg-alt flex items-center justify-center text-sm font-bold text-text-primary border border-border-default">
                  {chat.contactName.split(' ').map(n => n[0]).join('')}
                </div>
                <StatusDot status={chat.status} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs truncate ${chat.unreadCount > 0 ? 'font-bold text-text-primary' : 'font-semibold text-text-primary'}`}>
                    {chat.contactName}
                  </span>
                  <span className="text-[9px] text-text-muted shrink-0">{chat.lastMessageTime}</span>
                </div>
                <p className={`text-[11px] mt-0.5 truncate ${chat.unreadCount > 0 ? 'font-medium text-text-primary' : 'text-text-secondary'}`}>
                  {chat.lastMessage}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[9px] font-medium text-text-muted bg-surface-bg-alt px-1.5 py-0.5 rounded">{chat.source}</span>
                  {chat.assignee && <AssigneeAvatar assignee={chat.assignee} />}
                </div>
              </div>
              {chat.unreadCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-accent text-white text-[9px] font-bold flex items-center justify-center shrink-0 mt-1">
                  {chat.unreadCount}
                </span>
              )}
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="flex items-center justify-center h-32 text-xs text-text-muted">No conversations found</div>
        )}
      </div>

      <div className="p-3 border-t border-border-default bg-surface-bg">
        <div className="flex items-center gap-2 text-[10px] text-text-muted">
          <Users className="w-3 h-3" />
          <span>Team: {chats.filter(c => c.assignee).length} assigned</span>
          <span className="ml-auto">{chats.length} conversations</span>
        </div>
      </div>
    </div>
  );
}

function ChatWindow({ chat }: { chat: typeof mockChats[0] }) {
  const { sendWhatsAppMessage } = useStore();
  const { activeWallpaper, wallpaperBackgroundLayer, containerClass, doodleOverlay, isDefault } = useAppearance();
  const [inputText, setInputText] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [showAssignDropdown, setShowAssignDropdown] = useState(false);
  const [localMessages, setLocalMessages] = useState(chat.messages);
  const [assignee, setAssignee] = useState(chat.assignee);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalMessages(chat.messages);
    setAssignee(chat.assignee);
  }, [chat.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const newMsg = { sender: 'agent' as const, text: inputText, time: 'Just now' };
    setLocalMessages(prev => [...prev, newMsg]);
    sendWhatsAppMessage(chat.id, inputText, 'agent');
    setInputText('');
    setTimeout(() => {
      setLocalMessages(prev => [...prev, { sender: 'client' as const, text: 'Got it, thanks! Let me discuss with my team.', time: 'Just now' }]);
    }, 2000);
  };

  const handleQuickReply = (text: string) => {
    const newMsg = { sender: 'agent' as const, text, time: 'Just now' };
    setLocalMessages(prev => [...prev, newMsg]);
    sendWhatsAppMessage(chat.id, text, 'agent');
    setShowQuickReplies(false);
  };

  const getStatusColor = (s: string) => {
    switch(s) {
      case 'hot': return 'text-success';
      case 'warm': return 'text-warning';
      case 'cold': return 'text-text-muted';
      default: return 'text-text-muted';
    }
  };

  const lastMsg = localMessages[localMessages.length - 1];
  const aiSuggestions = lastMsg?.sender === 'client' ? [
    'Share product catalog PDF',
    'Send pricing & delivery timeline',
    'Ask for project requirements',
  ] : null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border-default bg-surface-card flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-surface-bg-alt flex items-center justify-center text-sm font-bold text-text-primary">
              {chat.contactName.split(' ').map(n => n[0]).join('')}
            </div>
            <StatusDot status={chat.status} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-text-primary">{chat.contactName}</span>
              <span className={`text-[10px] font-bold uppercase ${getStatusColor(chat.status)}`}>{chat.status}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-text-muted">
              <span>{chat.phone}</span>
              <span>•</span>
              <span>₹{chat.dealValue.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowAssignDropdown(!showAssignDropdown)}
              aria-expanded={showAssignDropdown}
              aria-haspopup="listbox"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium border border-border-default text-text-secondary hover:bg-surface-bg-alt transition-colors"
            >
              <AssigneeAvatar assignee={assignee} />
              {teamMembers.find(m => m.id === assignee)?.name || 'Assign'}
              <ChevronDown className="w-3 h-3" />
            </button>
            {showAssignDropdown && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-surface-card border border-border-default rounded-lg shadow-dropdown z-10 py-1" role="listbox">
                {teamMembers.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { setAssignee(m.id); setShowAssignDropdown(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-surface-bg-alt transition-colors ${assignee === m.id ? 'text-accent font-semibold' : 'text-text-secondary'}`}
                  >
                    <div className={`w-4 h-4 rounded-full ${m.color} flex items-center justify-center text-[6px] font-bold text-white`}>{m.initials}</div>
                    {m.name}
                    {assignee === m.id && <Check className="w-3 h-3 ml-auto" />}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="p-2 hover:bg-surface-bg-alt rounded-lg text-icon transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar relative ${isDefault ? '' : containerClass}`}
        style={{ background: isDefault ? undefined : 'transparent' }}>
        {wallpaperBackgroundLayer.show && (
          <div style={wallpaperBackgroundLayer.style} />
        )}
        {doodleOverlay && <div style={doodleOverlay} />}
        {localMessages.map((msg, i) => (
          <ChatBubble key={i} msg={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* AI Suggestions */}
      {aiSuggestions && (
        <div className="px-4 py-2.5 bg-accent-light/30 border-t border-border-default">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span className="text-[10px] font-bold text-accent">AI Suggested Replies</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {aiSuggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleQuickReply(s)}
                className="text-[10px] font-medium bg-surface-card border border-border-default text-text-primary px-2.5 py-1.5 rounded-lg hover:bg-accent-light hover:border-accent/30 hover:text-accent transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Replies Panel */}
      {showQuickReplies && (
        <div className="px-4 py-2.5 border-t border-border-default bg-surface-card max-h-40 overflow-y-auto no-scrollbar">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-text-primary uppercase tracking-wider">Quick Replies</span>
            <button onClick={() => setShowQuickReplies(false)}><X className="w-3 h-3 text-icon" /></button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickReplies.map((qr) => (
              <button
                key={qr.id}
                onClick={() => handleQuickReply(qr.text)}
                className="text-[10px] bg-surface-bg border border-border-default text-text-secondary px-2.5 py-1.5 rounded-lg hover:bg-surface-bg-alt transition-colors"
              >
                {qr.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSend} className="px-4 py-3 border-t border-border-default bg-surface-card flex items-center gap-2">
        <button type="button" onClick={() => setShowQuickReplies(!showQuickReplies)} className="p-2 hover:bg-surface-bg-alt rounded-lg text-icon transition-colors" title="Quick Replies">
          <ReplyAll className="w-4 h-4" />
        </button>
        <button type="button" className="p-2 hover:bg-surface-bg-alt rounded-lg text-icon transition-colors" title="Attach file">
          <Paperclip className="w-4 h-4" />
        </button>
        <div className="flex-1 flex items-center gap-2 bg-surface-bg border border-border-default rounded-xl px-3 py-2 focus-within:border-accent transition-colors">
          <input
            type="text"
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-transparent border-0 outline-none text-xs text-text-primary placeholder:text-text-muted"
          />
          <Smile className="w-4 h-4 text-icon cursor-pointer" />
        </div>
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="w-9 h-9 bg-accent hover:bg-accent-hover disabled:bg-accent/40 text-white rounded-xl flex items-center justify-center transition-colors shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

function ContactPanel({ chat, onAction, activitySummaries }: {
  chat: typeof mockChats[0];
  onAction: (action: 'link-lead' | 'create-contact' | 'schedule-meeting' | 'add-note') => void;
  activitySummaries: Array<{ icon: any; desc: string; time: string }>;
}) {
  const [collapsed, setCollapsed] = useState(false);
  if (collapsed) {
    return (
      <button onClick={() => setCollapsed(false)} className="p-2 hover:bg-surface-bg-alt text-icon border-l border-border-default transition-colors">
        <PanelRightOpen className="w-4 h-4" />
      </button>
    );
  }
  return (
    <div className="border-l border-border-default bg-surface-card flex flex-col h-full w-72">
      <div className="p-3 border-b border-border-default flex items-center justify-between">
        <span className="text-xs font-bold text-text-primary">Contact Info</span>
        <button onClick={() => setCollapsed(true)} className="p-1 hover:bg-surface-bg-alt rounded text-icon">
          <PanelRightClose className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Profile */}
        <div className="p-4 text-center border-b border-border-default">
          <div className="w-14 h-14 rounded-full bg-surface-bg-alt flex items-center justify-center text-xl font-bold text-text-primary mx-auto border-2 border-accent/20">
            {chat.contactName.split(' ').map(n => n[0]).join('')}
          </div>
          <h4 className="text-sm font-bold text-text-primary mt-2">{chat.contactName}</h4>
          <p className="text-[10px] text-text-muted">{chat.phone}</p>
          <div className="flex items-center justify-center gap-1.5 mt-1.5">
            {chat.tags.map((t, i) => (
              <span key={i} className="text-[9px] font-medium bg-surface-bg-alt text-text-secondary px-2 py-0.5 rounded">{t}</span>
            ))}
          </div>
        </div>

        {/* Lead Info */}
        <div className="p-4 space-y-3 border-b border-border-default">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Lead Details</span>
            <button className="text-[10px] text-accent font-medium hover:underline">Edit</button>
          </div>
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            {[
              { label: 'Source', value: chat.source },
              { label: 'Score', value: `${chat.score}/100`, highlight: chat.score >= 75 ? 'text-success' : chat.score >= 50 ? 'text-warning' : 'text-text-muted' },
              { label: 'Deal Value', value: `₹${chat.dealValue.toLocaleString()}`, highlight: 'text-text-primary' },
              { label: 'Stage', value: chat.dealStage },
            ].map((item, i) => (
              <div key={i} className="bg-surface-bg p-2 rounded-lg">
                <div className="text-[9px] text-text-muted">{item.label}</div>
                <div className={`font-semibold mt-0.5 ${item.highlight || 'text-text-primary'}`}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 space-y-1.5 border-b border-border-default">
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-2">Quick Actions</span>
          {[
            { key: 'link-lead', icon: Link2, label: 'Link to Lead', color: 'text-info' },
            { key: 'create-contact', icon: UserPlus, label: 'Create Contact', color: 'text-accent' },
            { key: 'schedule-meeting', icon: Calendar, label: 'Schedule Meeting', color: 'text-warning' },
            { key: 'add-note', icon: FileText, label: 'Add Note', color: 'text-text-secondary' },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.key}
                onClick={() => onAction(action.key as any)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-text-secondary hover:bg-surface-bg-alt hover:text-text-primary transition-colors"
              >
                <Icon className={`w-4 h-4 ${action.color}`} />
                {action.label}
                <ChevronRight className="w-3 h-3 ml-auto text-text-muted" />
              </button>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="p-4 space-y-2">
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-2">Recent Activity</span>
          {activitySummaries.length === 0 && (
            <p className="text-[10px] text-text-muted text-center py-4">No recent activity</p>
          )}
          {activitySummaries.map((act, i) => {
            const Icon = act.icon;
            return (
              <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-surface-bg-alt transition-colors cursor-pointer">
                <div className="w-7 h-7 rounded-lg bg-surface-bg-alt flex items-center justify-center text-icon">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-medium text-text-primary">{act.desc}</div>
                  <div className="text-[9px] text-text-muted">{act.time}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function WhatsAppCRMView({ addToast }: {
  addToast?: (type: 'success' | 'error' | 'info', msg: string) => void;
} = {}) {
  const [chats] = useState(mockChats);
  const [selectedChatId, setSelectedChatId] = useState('chat-1');
  const [view, setView] = useState<'inbox' | 'broadcast' | 'templates'>('inbox');
  const [activeModal, setActiveModal] = useState<'link-lead' | 'create-contact' | 'schedule-meeting' | 'add-note' | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const activeChat = chats.find(c => c.id === selectedChatId) || chats[0];

  const fetchActivities = useCallback(async (chatId: string) => {
    try {
      const res = await fetch(`/api/activities?chatId=${chatId}`);
      if (res.ok) setActivities(await res.json());
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    fetchActivities(selectedChatId);
  }, [selectedChatId, fetchActivities]);

  const activityIcons: Record<string, any> = {
    MEETING: Calendar,
    NOTE: FileText,
    SYSTEM: Link2,
    CALL: Phone,
    EMAIL: Mail,
    MESSAGE: MessageSquare,
  };

  const activitySummaries = activities.slice(0, 5).map(a => ({
    icon: activityIcons[a.type] || MessageSquare,
    desc: a.content || a.subject,
    time: new Date(a.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
  }));

  const handleActionSuccess = (msg: string) => {
    setActiveModal(null);
    addToast?.('success', msg);
    fetchActivities(selectedChatId);
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-3.5rem)] -m-4 lg:-m-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border-default bg-surface-card shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-accent" />
            WhatsApp CRM
          </h2>
          <div className="h-4 w-px bg-border-light" />
          <div className="flex items-center gap-1 bg-surface-bg rounded-lg p-0.5">
            {[
              { id: 'inbox', label: 'Inbox', icon: MessagesSquare },
              { id: 'broadcast', label: 'Broadcast', icon: Megaphone },
              { id: 'templates', label: 'Templates', icon: BookTemplate },
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setView(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors ${
                    view === tab.id
                      ? 'bg-surface-card text-accent shadow-card'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-text-muted flex items-center gap-1">
            <CircleCheck className="w-3 h-3 text-success" />
            API Connected
          </span>
          <button className="text-xs font-medium text-accent bg-accent-light px-3 py-1.5 rounded-lg hover:bg-accent/10 transition-colors">
            <Plus className="w-3.5 h-3.5 inline mr-1" />
            New Broadcast
          </button>
        </div>
      </div>

      {view === 'inbox' && (
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Inbox */}
          <div className="w-80 border-r border-border-default bg-surface-card shrink-0">
            <InboxPanel chats={chats} selectedChatId={selectedChatId} onSelectChat={setSelectedChatId} />
          </div>

          {/* Middle: Chat */}
          <div className="flex-1 flex flex-col min-w-0">
            <ChatWindow chat={activeChat} />
          </div>

          {/* Right: Contact Panel */}
          <ContactPanel chat={activeChat} onAction={setActiveModal as any} activitySummaries={activitySummaries} />
        </div>
      )}

      {view === 'broadcast' && (
        <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
          <div className="max-w-3xl mx-auto space-y-6">
            <div>
              <h3 className="text-sm font-bold text-text-primary">Broadcast Campaigns</h3>
              <p className="text-xs text-text-secondary mt-0.5">Send bulk WhatsApp messages using approved templates</p>
            </div>

            <div className="premium-card p-5 space-y-4">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">New Broadcast</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-medium text-text-secondary">Campaign Name</label>
                  <input type="text" placeholder="e.g. Festive Season Offer" className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-medium text-text-secondary">Template</label>
                  <select className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary">
                    {templates.map(t => <option key={t.id}>{t.name} ({t.conversion} conv.)</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-medium text-text-secondary">Audience Segment</label>
                  <select className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary">
                    <option>All Active Leads</option>
                    <option>Hot Leads Only</option>
                    <option>Warm Leads</option>
                    <option>Custom Segment</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-medium text-text-secondary">Schedule</label>
                  <select className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary">
                    <option>Send Now</option>
                    <option>Schedule for Later</option>
                  </select>
                </div>
              </div>
              <div className="bg-accent-light/30 rounded-lg p-3 border border-accent/10">
                <div className="text-[10px] font-medium text-text-secondary mb-1">Preview:</div>
                <p className="text-xs text-text-primary">&ldquo;Hi {`{`}name{`}`}, festive offer! Get 15% off on all orders above ₹50,000. Limited time only!&rdquo;</p>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-[10px] text-text-muted">Will be sent to ~48 contacts</span>
                <button className="bg-accent hover:bg-accent-hover text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
                  <Send className="w-3.5 h-3.5 inline mr-1.5" />
                  Send Broadcast
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">Recent Campaigns</h4>
              {recentBroadcasts.map((b) => (
                <div key={b.id} className="premium-card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-xs font-bold text-text-primary">{b.name}</span>
                      <span className="text-[10px] text-text-muted ml-2">{b.date}</span>
                    </div>
                    <span className="text-[10px] font-medium text-success bg-success-light px-2 py-0.5 rounded">{((b.replied / b.sent) * 100).toFixed(0)}% replied</span>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: 'Sent', value: b.sent, color: 'text-text-primary' },
                      { label: 'Delivered', value: b.delivered, color: 'text-text-primary' },
                      { label: 'Read', value: b.read, color: 'text-accent' },
                      { label: 'Replied', value: b.replied, color: 'text-success' },
                    ].map((s, i) => (
                      <div key={i} className="text-center bg-surface-bg rounded-lg p-2">
                        <div className={`text-sm font-bold ${s.color}`}>{s.value}</div>
                        <div className="text-[9px] text-text-muted">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {view === 'templates' && (
        <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-text-primary">Message Templates</h3>
                <p className="text-xs text-text-secondary mt-0.5">Pre-approved WhatsApp message templates</p>
              </div>
              <button className="text-xs font-medium text-accent bg-accent-light px-3 py-1.5 rounded-lg hover:bg-accent/10 transition-colors">
                <Plus className="w-3.5 h-3.5 inline mr-1" /> New Template
              </button>
            </div>
            <div className="grid gap-3">
              {templates.map((t) => (
                <div key={t.id} className="premium-card p-4 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center shrink-0">
                    <BookTemplate className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-text-primary">{t.name}</span>
                        <span className="text-[9px] font-medium text-text-muted ml-2 bg-surface-bg-alt px-1.5 py-0.5 rounded">{t.category}</span>
                      </div>
                      <span className="text-[10px] font-medium text-success">{t.conversion} conversion</span>
                    </div>
                    <p className="text-[11px] text-text-secondary mt-1.5 leading-relaxed">&ldquo;{t.content}&rdquo;</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button className="text-[10px] font-medium text-accent hover:underline">Edit</button>
                      <button className="text-[10px] font-medium text-text-secondary hover:underline">Preview</button>
                      <button className="text-[10px] font-medium text-text-secondary hover:underline">Duplicate</button>
                      <button className="ml-auto text-[10px] font-medium bg-accent text-white px-3 py-1 rounded-lg hover:bg-accent-hover transition-colors">
                        Use Template
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Action Modals */}
      {activeModal === 'link-lead' && (
        <LinkLeadModal
          chatId={selectedChatId}
          onClose={() => setActiveModal(null)}
          onLinked={(lead) => handleActionSuccess(`Linked to ${lead.firstName} ${lead.lastName}`)}
        />
      )}
      {activeModal === 'create-contact' && (
        <CreateContactModal
          chatId={selectedChatId}
          phone={activeChat.phone}
          onClose={() => setActiveModal(null)}
          onCreated={(contact) => handleActionSuccess(`Contact "${contact.name}" created`)}
        />
      )}
      {activeModal === 'schedule-meeting' && (
        <ScheduleMeetingModal
          chatId={selectedChatId}
          onClose={() => setActiveModal(null)}
          onScheduled={(meeting) => handleActionSuccess(`Meeting scheduled for ${meeting.date}`)}
        />
      )}
      {activeModal === 'add-note' && (
        <AddNoteModal
          chatId={selectedChatId}
          onClose={() => setActiveModal(null)}
          onAdded={() => handleActionSuccess('Note added')}
        />
      )}
    </div>
  );
}

import { create } from 'zustand';

export type DashboardWidget = {
  id: string;
  title: string;
  type: 'kpi_revenue' | 'kpi_growth' | 'kpi_leads' | 'kpi_conversion' | 'chart_revenue' | 'chart_funnel' | 'ai_insights' | 'team_performance';
  visible: boolean;
};

interface AppState {
  activeTab: string;
  selectedContactId: string | null;
  selectedLeadId: string | null;
  
  // Call Dialer
  globalDialerOpen: boolean;
  activeCallNumber: string | null;
  activeCallName: string | null;
  activeCallState: 'idle' | 'calling' | 'connected' | 'completed';
  callDuration: number;
  callSentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  callTranscript: string[];
  
  // WhatsApp CRM
  selectedChatId: string | null;
  whatsAppChats: Array<{
    id: string;
    contactName: string;
    phone: string;
    unreadCount: number;
    lastMessage: string;
    lastMessageTime: string;
    messages: Array<{ sender: 'client' | 'agent' | 'bot'; text: string; time: string; suggestions?: string[] }>;
  }>;

  // AI Copilot
  copilotOpen: boolean;
  copilotMessages: Array<{ sender: 'user' | 'ai'; text: string; time: string; data?: any }>;
  
  // Mobile UI Frame Toggle
  isMobileFrame: boolean;
  
  // Dashboard Widget Configurations (Draggable / Orderable)
  dashboardWidgets: DashboardWidget[];

  // Actions
  setActiveTab: (tab: string) => void;
  setSelectedContactId: (id: string | null) => void;
  setSelectedLeadId: (id: string | null) => void;
  
  // Dialer actions
  openDialer: (phone: string, name: string) => void;
  closeDialer: () => void;
  setCallState: (state: 'idle' | 'calling' | 'connected' | 'completed') => void;
  tickCallDuration: () => void;
  resetCallDuration: () => void;
  triggerMockCallLifecycle: (phone: string, name: string) => void;
  
  // WhatsApp Actions
  setSelectedChatId: (id: string | null) => void;
  sendWhatsAppMessage: (chatId: string, text: string, sender?: 'client' | 'agent' | 'bot') => void;
  addWhatsAppSuggestion: (chatId: string, text: string) => void;
  
  // Copilot actions
  toggleCopilot: () => void;
  setCopilotOpen: (open: boolean) => void;
  sendCopilotMessage: (text: string) => void;
  
  // Mobile frame action
  toggleMobileFrame: () => void;
  
  // Widget ordering actions
  setDashboardWidgets: (widgets: DashboardWidget[]) => void;
  reorderWidgets: (startIndex: number, endIndex: number) => void;
}

export const useStore = create<AppState>((set, get) => ({
  activeTab: 'dashboard',
  selectedContactId: null,
  selectedLeadId: null,
  
  // Call Dialer
  globalDialerOpen: false,
  activeCallNumber: null,
  activeCallName: null,
  activeCallState: 'idle',
  callDuration: 0,
  callSentiment: 'POSITIVE',
  callTranscript: [],

  // WhatsApp mock messages setup
  selectedChatId: 'chat-1',
  whatsAppChats: [
    {
      id: 'chat-1',
      contactName: 'James Wilson',
      phone: '+91 98765 43210',
      unreadCount: 2,
      lastMessage: 'Can you share the steel plate specifications PDF?',
      lastMessageTime: '10:42 AM',
      messages: [
        { sender: 'client', text: 'Hi, I saw your catalog on IndiaMART. Interested in the structural carbon steel plates.', time: '10:30 AM' },
        { sender: 'bot', text: 'Hello James! Thanks for reaching out to Acme Manufacturing. One of our reps will be with you shortly. In the meantime, what size plates are you looking for?', time: '10:31 AM' },
        { sender: 'client', text: 'We need 50 tons of ASTM A36 plates. Thickness: 12mm.', time: '10:35 AM' },
        { sender: 'agent', text: 'Hello James, this is Alex from Acme. I see you need 50 tons of 12mm ASTM A36. I can prepare a quote right away.', time: '10:40 AM' },
        { sender: 'client', text: 'Can you share the steel plate specifications PDF and delivery lead time?', time: '10:42 AM', suggestions: ['Share ASTM A36 Specs PDF', 'Send Quote #Q-8029', 'Ask for shipping address'] }
      ]
    },
    {
      id: 'chat-2',
      contactName: 'Jane Smith',
      phone: '+1 555 5678',
      unreadCount: 0,
      lastMessage: 'Great, see you on Thursday for the LMS demo.',
      lastMessageTime: 'Yesterday',
      messages: [
        { sender: 'agent', text: 'Hi Jane, scheduling a call for the Apex LMS demo on Thursday at 2 PM. Works?', time: 'Yesterday' },
        { sender: 'client', text: 'Great, see you on Thursday for the LMS demo.', time: 'Yesterday' }
      ]
    },
    {
      id: 'chat-3',
      contactName: 'Carlos Gomez',
      phone: '+52 55 1234 5678',
      unreadCount: 0,
      lastMessage: 'Will check out the pricing page API.',
      lastMessageTime: '2 days ago',
      messages: [
        { sender: 'client', text: 'Are your WhatsApp APIs globally compliant?', time: '2 days ago' },
        { sender: 'bot', text: 'Yes Carlos, we support standard Meta WhatsApp Cloud APIs with global compliance hosting.', time: '2 days ago' },
        { sender: 'client', text: 'Will check out the pricing page API.', time: '2 days ago' }
      ]
    }
  ],

  // AI Copilot Messages
  copilotOpen: false,
  copilotMessages: [
    { sender: 'ai', text: 'Hello! I am your LeadSphere Copilot. I can list contacts, check deal status, draft proposals, create reminders or search integrations. What can I do for you?', time: 'Just now' }
  ],

  isMobileFrame: false,

  dashboardWidgets: [
    { id: 'widget-1', title: 'Total Revenue', type: 'kpi_revenue', visible: true },
    { id: 'widget-2', title: 'Growth Rate', type: 'kpi_growth', visible: true },
    { id: 'widget-3', title: 'Active Leads', type: 'kpi_leads', visible: true },
    { id: 'widget-4', title: 'Conversion Rate', type: 'kpi_conversion', visible: true },
    { id: 'widget-5', title: 'Monthly Revenue Pipeline', type: 'chart_revenue', visible: true },
    { id: 'widget-6', title: 'Conversion Funnel Stages', type: 'chart_funnel', visible: true },
    { id: 'widget-7', title: 'Executive AI Insights', type: 'ai_insights', visible: true },
    { id: 'widget-8', title: 'Team Closing Leaderboard', type: 'team_performance', visible: true }
  ],

  setActiveTab: (activeTab) => set({ activeTab }),
  setSelectedContactId: (selectedContactId) => set({ selectedContactId }),
  setSelectedLeadId: (selectedLeadId) => set({ selectedLeadId }),
  
  openDialer: (phone, name) => set({
    globalDialerOpen: true,
    activeCallNumber: phone,
    activeCallName: name,
    activeCallState: 'calling',
    callDuration: 0,
    callSentiment: 'NEUTRAL',
    callTranscript: ['[System] Outbound call initiated to ' + name + ' at ' + phone]
  }),
  
  closeDialer: () => set({
    globalDialerOpen: false,
    activeCallNumber: null,
    activeCallName: null,
    activeCallState: 'idle',
    callDuration: 0
  }),
  
  setCallState: (activeCallState) => set({ activeCallState }),
  tickCallDuration: () => set((state) => ({ callDuration: state.callDuration + 1 })),
  resetCallDuration: () => set({ callDuration: 0 }),
  
  triggerMockCallLifecycle: (phone, name) => {
    const { openDialer } = get();
    openDialer(phone, name);

    // Call connected simulation (after 2s)
    setTimeout(() => {
      set({
        activeCallState: 'connected',
        callTranscript: [
          '[System] Connected to network.',
          `Alex (Rep): Hello ${name}, this is Alex from Acme. I am calling regarding your steel specification inquiry.`,
          `${name}: Ah yes, hi Alex. We wanted to confirm if you have ASTM A36 plates ready in stock.`,
        ]
      });

      // Simulation continues
      setTimeout(() => {
        set((state) => ({
          callTranscript: [
            ...state.callTranscript,
            'Alex (Rep): Yes, we have 100 tons ready in our regional warehouse. We can deliver it by next Tuesday.',
            `${name}: Perfect! That timeline works for us. Please send a proposal detailing delivery costs.`,
            'Alex (Rep): Will do right away. I will draft the proposal and WhatsApp you the invoice link.'
          ],
          callSentiment: 'POSITIVE'
        }));

        // Finalize call
        setTimeout(() => {
          set((state) => ({
            activeCallState: 'completed',
            callTranscript: [
              ...state.callTranscript,
              `[System] Call disconnected by peer. Duration: ${state.callDuration}s.`,
              '[AI Summary] Customer confirmed timeline and requested proposal for ASTM A36 steel plates. Highly positive sentiment. Action item created: Send proposal.'
            ]
          }));
        }, 6000);

      }, 4000);

    }, 2000);
  },

  setSelectedChatId: (id) => set({ selectedChatId: id }),
  sendWhatsAppMessage: (chatId, text, sender = 'agent') => set((state) => ({
    whatsAppChats: state.whatsAppChats.map((c) => {
      if (c.id === chatId) {
        return {
          ...c,
          lastMessage: text,
          lastMessageTime: 'Just now',
          messages: [
            ...c.messages,
            { sender, text, time: 'Just now' }
          ]
        };
      }
      return c;
    })
  })),
  addWhatsAppSuggestion: (chatId, text) => set((state) => ({
    whatsAppChats: state.whatsAppChats.map((c) => {
      if (c.id === chatId) {
        const lastMsgIndex = c.messages.length - 1;
        if (lastMsgIndex >= 0) {
          const updatedMessages = [...c.messages];
          updatedMessages[lastMsgIndex] = {
            ...updatedMessages[lastMsgIndex],
            suggestions: updatedMessages[lastMsgIndex].suggestions?.filter(s => s !== text) || []
          };
          return {
            ...c,
            messages: updatedMessages
          };
        }
      }
      return c;
    })
  })),

  toggleCopilot: () => set((state) => ({ copilotOpen: !state.copilotOpen })),
  setCopilotOpen: (copilotOpen) => set({ copilotOpen }),
  
  sendCopilotMessage: (text) => set((state) => {
    const newMessages = [...state.copilotMessages, { sender: 'user' as const, text, time: 'Just now' }];
    
    // Simple mock NLP responses to demonstrate AI capabilities in CRM context
    let aiResponse = "I can see the CRM database. Try asking: 'Show leads', 'Which deals are at risk?', or 'Draft a proposal'.";
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('leads') || lowerText.includes('follow-up')) {
      aiResponse = "Here are the leads needing follow-up:\n1. James Wilson (India Manufacturing) - Score: 85 (WhatsApp)\n2. Priyah Sharma (EduQuest) - Score: 95 (Website)\nI have drafted a task for Alex to reach out to JamesWilson.";
    } else if (lowerText.includes('at risk') || lowerText.includes('risk') || lowerText.includes('stuck')) {
      aiResponse = "I found 2 deals at risk/stuck:\n1. **Apex Edu LMS** ($24k) - Stage: Proposal Sent. Status: STUCK (last activity 4 days ago).\n2. **Apex Health Call Center** ($85k) - Stage: Negotiation. Status: AT_RISK (sentiment on last call was negative/budget concerns).";
    } else if (lowerText.includes('proposal') || lowerText.includes('generate')) {
      aiResponse = "Draft proposal for **ABC Manufacturing** ($45,000 supply order):\n\n- Product: ASTM A36 Structural Carbon Steel Plates\n- Quantity: 50 Tons\n- Price: $900/Ton\n- Delivery Cost: Included\n- SLA: 2 weeks shipping\n\nI have generated the proposal PDF draft and copied it to the WhatsApp Shared Inbox. You can review and click 'Send Template' there.";
    } else if (lowerText.includes('task') || lowerText.includes('create task')) {
      aiResponse = "Task created: **Follow up on Call Center Proposal** with Robert Johnson scheduled for tomorrow morning 9:00 AM. Syncing with Google Calendar/Outlook...";
    } else if (lowerText.includes('summarize') || lowerText.includes('today')) {
      aiResponse = "Call summary for today:\n- **James Wilson (ABC Metals)**: Call completed successfully. Lead scored 85. Requested delivery quote.\n- Sentiment score: 8.5/10 (highly positive).";
    }

    return {
      copilotMessages: [...newMessages, { sender: 'ai' as const, text: aiResponse, time: 'Just now' }]
    };
  }),

  toggleMobileFrame: () => set((state) => ({ isMobileFrame: !state.isMobileFrame })),
  
  setDashboardWidgets: (dashboardWidgets) => set({ dashboardWidgets }),
  reorderWidgets: (startIndex, endIndex) => set((state) => {
    const list = [...state.dashboardWidgets];
    const [removed] = list.splice(startIndex, 1);
    list.splice(endIndex, 0, removed);
    return { dashboardWidgets: list };
  })
}));

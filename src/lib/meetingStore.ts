'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Attachment {
  id: string; name: string; type: string; size: number; url: string; uploadedAt: string;
}

export interface MeetingNote {
  id: string; meetingId: string; content: string; author: string; createdAt: string; updatedAt: string;
}

export interface Meeting {
  id: string;
  title: string;
  description: string;
  location: string;
  type: 'client' | 'internal';
  meetingType: 'zoom' | 'google_meet' | 'teams' | 'in_person' | 'phone' | 'custom';
  startDate: string;
  startTime: string;
  endTime: string;
  duration: string;
  participants: string[];
  company: string;
  lead: string;
  deal: string;
  priority: 'high' | 'medium' | 'low';
  color: string;
  reminder: number;
  timezone: string;
  repeat: 'none' | 'daily' | 'weekly' | 'biweekly' | 'monthly';
  agenda: string;
  notes: string;
  attachments: Attachment[];
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  outcome: string;
  link: string;
  meetingId: string;
  password: string;
  hostUrl: string;
  recording: string;
  isRecurring: boolean;
  recurringParentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarIntegration {
  id: string; name: string; type: 'google' | 'outlook' | 'apple' | 'zoom' | 'teams' | 'google_meet';
  status: 'connected' | 'disconnected'; connectedAt: string | null; email?: string;
}

export type ViewMode = 'day' | 'week' | 'month';

function generateId() { return Math.random().toString(36).substring(2, 11); }

const sampleMeetings: Meeting[] = [
  { id: 'm1', title: 'Q3 Enterprise Agreement Review', description: 'Review enterprise license renewal terms, discuss support SLA, and plan Q4 expansion.', location: 'Zoom', type: 'client', meetingType: 'zoom', startDate: '2026-07-18', startTime: '10:00', endTime: '11:00', duration: '1 hr', participants: ['Arun Nair', 'Sarah Connor', 'Rajesh Verma'], company: 'NovaTech Software', lead: 'NovaTech-Q3', deal: 'NovaTech-Deal-001', priority: 'high', color: '#0F766E', reminder: 15, timezone: 'Asia/Kolkata', repeat: 'none', agenda: '1. Renewal terms review\n2. Support SLA discussion\n3. Q4 expansion planning', notes: '', attachments: [], status: 'scheduled', outcome: '', link: 'https://zoom.us/j/123456789', meetingId: '123456789', password: '123456', hostUrl: 'https://zoom.us/s/123456789', recording: '', isRecurring: false, recurringParentId: null, createdAt: '2026-07-10T00:00:00Z', updatedAt: '2026-07-10T00:00:00Z' },
  { id: 'm2', title: 'ABC Metals — ERP Demo', description: 'Live demo of ERP integration module.', location: 'Google Meet', type: 'client', meetingType: 'google_meet', startDate: '2026-07-18', startTime: '14:00', endTime: '14:45', duration: '45 min', participants: ['Vikram Mehta', 'Priya Sharma'], company: 'ABC Metals & Forgings', lead: 'ABC-Metals', deal: 'ABC-ERP-001', priority: 'high', color: '#2563EB', reminder: 30, timezone: 'Asia/Kolkata', repeat: 'none', agenda: '1. ERP module demo\n2. Inventory features\n3. Supply chain integration', notes: '', attachments: [], status: 'scheduled', outcome: '', link: 'https://meet.google.com/abc-defg-hij', meetingId: '', password: '', hostUrl: '', recording: '', isRecurring: false, recurringParentId: null, createdAt: '2026-07-10T00:00:00Z', updatedAt: '2026-07-10T00:00:00Z' },
  { id: 'm3', title: 'Weekly Sales Standup', description: 'Weekly team standup.', location: '', type: 'internal', meetingType: 'in_person', startDate: '2026-07-18', startTime: '09:00', endTime: '09:30', duration: '30 min', participants: ['Sarah Connor', 'Arun Patel', 'Priya Sharma', 'Rajesh Verma'], company: '', lead: '', deal: '', priority: 'medium', color: '#7C3AED', reminder: 5, timezone: 'Asia/Kolkata', repeat: 'weekly', agenda: '1. Pipeline review\n2. Blocker discussion\n3. Priority alignment', notes: '', attachments: [], status: 'scheduled', outcome: '', link: '', meetingId: '', password: '', hostUrl: '', recording: '', isRecurring: true, recurringParentId: null, createdAt: '2026-07-10T00:00:00Z', updatedAt: '2026-07-10T00:00:00Z' },
  { id: 'm4', title: 'Horizon Property — QBR Prep', description: 'Prepare quarterly business review.', location: 'Microsoft Teams', type: 'client', meetingType: 'teams', startDate: '2026-07-19', startTime: '11:00', endTime: '12:00', duration: '1 hr', participants: ['Emily Davis', 'Sarah Connor'], company: 'Horizon Real Estate', lead: 'Horizon-QBR', deal: 'Horizon-2026-Q3', priority: 'high', color: '#DC2626', reminder: 60, timezone: 'Asia/Kolkata', repeat: 'none', agenda: '', notes: '', attachments: [], status: 'scheduled', outcome: '', link: 'https://teams.microsoft.com/meet/123', meetingId: '987654321', password: '', hostUrl: '', recording: '', isRecurring: false, recurringParentId: null, createdAt: '2026-07-10T00:00:00Z', updatedAt: '2026-07-10T00:00:00Z' },
  { id: 'm5', title: 'Sahyadri Healthcare — Compliance Review', description: 'Review medical compliance documentation.', location: 'Zoom', type: 'client', meetingType: 'zoom', startDate: '2026-07-20', startTime: '15:00', endTime: '15:45', duration: '45 min', participants: ['Dr. Priya Sharma'], company: 'Sahyadri Healthcare', lead: 'Sahyadri-Comp', deal: '', priority: 'medium', color: '#D97706', reminder: 15, timezone: 'Asia/Kolkata', repeat: 'none', agenda: '', notes: '', attachments: [], status: 'scheduled', outcome: '', link: '', meetingId: '', password: '', hostUrl: '', recording: '', isRecurring: false, recurringParentId: null, createdAt: '2026-07-10T00:00:00Z', updatedAt: '2026-07-10T00:00:00Z' },
  { id: 'm6', title: 'Product Roadmap Sync', description: 'Q3 product roadmap sync.', location: '', type: 'internal', meetingType: 'in_person', startDate: '2026-07-21', startTime: '10:30', endTime: '11:30', duration: '1 hr', participants: ['Product Team', 'Sarah Connor'], company: '', lead: '', deal: '', priority: 'medium', color: '#059669', reminder: 30, timezone: 'Asia/Kolkata', repeat: 'monthly', agenda: '', notes: '', attachments: [], status: 'scheduled', outcome: '', link: '', meetingId: '', password: '', hostUrl: '', recording: '', isRecurring: true, recurringParentId: null, createdAt: '2026-07-10T00:00:00Z', updatedAt: '2026-07-10T00:00:00Z' },
  { id: 'm7', title: 'Apex Edu — Platform Onboarding', description: 'Walk through platform features.', location: 'Google Meet', type: 'client', meetingType: 'google_meet', startDate: '2026-07-22', startTime: '13:00', endTime: '14:30', duration: '1.5 hr', participants: ['Neha Gupta', 'Arun Patel'], company: 'Apex Educational Solutions', lead: 'Apex-Onboard', deal: '', priority: 'low', color: '#DB2777', reminder: 60, timezone: 'Asia/Kolkata', repeat: 'none', agenda: '', notes: '', attachments: [], status: 'scheduled', outcome: '', link: 'https://meet.google.com/xyz-uvw-rst', meetingId: '', password: '', hostUrl: '', recording: '', isRecurring: false, recurringParentId: null, createdAt: '2026-07-10T00:00:00Z', updatedAt: '2026-07-10T00:00:00Z' },
];

const defaultIntegrations: CalendarIntegration[] = [
  { id: 'int-1', name: 'Google Calendar', type: 'google', status: 'connected', connectedAt: '2026-06-01T00:00:00Z', email: 'sarah@leadsphere.io' },
  { id: 'int-2', name: 'Outlook Calendar', type: 'outlook', status: 'connected', connectedAt: '2026-06-01T00:00:00Z', email: 'sarah@outlook.com' },
  { id: 'int-3', name: 'Apple Calendar', type: 'apple', status: 'disconnected', connectedAt: null, email: '' },
  { id: 'int-4', name: 'Zoom', type: 'zoom', status: 'connected', connectedAt: '2026-06-01T00:00:00Z', email: '' },
  { id: 'int-5', name: 'Microsoft Teams', type: 'teams', status: 'disconnected', connectedAt: null, email: '' },
  { id: 'int-6', name: 'Google Meet', type: 'google_meet', status: 'connected', connectedAt: '2026-06-01T00:00:00Z', email: '' },
];

export interface NotificationToast {
  id: string; message: string; type: 'success' | 'error' | 'info'; visible: boolean;
}

interface MeetingStore {
  meetings: Meeting[];
  integrations: CalendarIntegration[];
  notes: MeetingNote[];
  viewMode: ViewMode;
  selectedDate: string;
  selectedMeetingId: string | null;
  searchQuery: string;
  filters: { type: string; priority: string; status: string };
  toasts: NotificationToast[];
  calendarMonth: number;
  calendarYear: number;

  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setSelectedDate: (date: string) => void;
  setSelectedMeetingId: (id: string | null) => void;
  setSearchQuery: (q: string) => void;
  setFilter: (key: string, value: string) => void;
  clearFilters: () => void;
  calendarPrevMonth: () => void;
  calendarNextMonth: () => void;
  calendarToday: () => void;

  addMeeting: (meeting: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateMeeting: (id: string, data: Partial<Meeting>) => void;
  deleteMeeting: (id: string) => void;
  duplicateMeeting: (id: string) => void;
  completeMeeting: (id: string) => void;
  cancelMeeting: (id: string) => void;
  rescheduleMeeting: (id: string, startDate: string, startTime: string, endTime: string, duration: string, participants: string[]) => void;

  addNote: (meetingId: string, content: string, author: string) => void;
  updateNote: (noteId: string, content: string) => void;
  deleteNote: (noteId: string) => void;

  addAttachment: (meetingId: string, attachment: Omit<Attachment, 'id' | 'uploadedAt'>) => void;
  deleteAttachment: (meetingId: string, attachmentId: string) => void;

  toggleIntegration: (type: CalendarIntegration['type']) => void;
  createPlatformMeeting: (platformType: string) => { url: string; meetingId: string; password: string };
  verifyPlatformConnection: (platformType: string) => Promise<boolean>;
  setPlatformMeeting: (meetingId: string, platform: string, url: string, meetingIdStr: string, password: string) => void;

  addRecurringInstance: (meeting: Meeting, date: string) => void;
}

export const useMeetingStore = create<MeetingStore>()(
  persist(
    (set, get) => ({
      meetings: sampleMeetings,
      integrations: defaultIntegrations,
      notes: [],
      viewMode: 'day',
      selectedDate: '2026-07-18',
      selectedMeetingId: 'm1',
      searchQuery: '',
      filters: { type: '', priority: '', status: '' },
      toasts: [],
      calendarMonth: 7,
      calendarYear: 2026,

      addToast: (message, type = 'success') => {
        const id = generateId();
        set((s) => ({ toasts: [...s.toasts, { id, message, type, visible: true }] }));
        setTimeout(() => get().removeToast(id), 4000);
      },
      removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

      setViewMode: (mode) => set({ viewMode: mode }),
      setSelectedDate: (date) => set({ selectedDate: date }),
      setSelectedMeetingId: (id) => set({ selectedMeetingId: id }),
      setSearchQuery: (q) => set({ searchQuery: q }),
      setFilter: (key, value) => set((s) => ({ filters: { ...s.filters, [key]: value } })),
      clearFilters: () => set({ filters: { type: '', priority: '', status: '' } }),
      calendarPrevMonth: () => set((s) => {
        const m = s.calendarMonth - 1;
        return m < 1 ? { calendarMonth: 12, calendarYear: s.calendarYear - 1 } : { calendarMonth: m };
      }),
      calendarNextMonth: () => set((s) => {
        const m = s.calendarMonth + 1;
        return m > 12 ? { calendarMonth: 1, calendarYear: s.calendarYear + 1 } : { calendarMonth: m };
      }),
      calendarToday: () => {
        const now = new Date();
        set({ calendarMonth: now.getMonth() + 1, calendarYear: now.getFullYear(), selectedDate: now.toISOString().split('T')[0] });
      },

      addMeeting: (data) => {
        const id = generateId();
        const now = new Date().toISOString();
        const meeting: Meeting = { ...data, id, createdAt: now, updatedAt: now };
        set((s) => ({ meetings: [...s.meetings, meeting] }));
        get().addToast('Meeting created successfully');
        return id;
      },
      updateMeeting: (id, data) => set((s) => ({
        meetings: s.meetings.map((m) => m.id === id ? { ...m, ...data, updatedAt: new Date().toISOString() } : m),
      })),
      deleteMeeting: (id) => {
        set((s) => ({ meetings: s.meetings.filter((m) => m.id !== id), selectedMeetingId: s.selectedMeetingId === id ? null : s.selectedMeetingId }));
        get().addToast('Meeting deleted', 'info');
      },
      duplicateMeeting: (id) => {
        const original = get().meetings.find((m) => m.id === id);
        if (!original) return;
        const now = new Date().toISOString();
        const { ...data } = original;
        const copy: Meeting = { ...data, id: generateId(), title: `${original.title} (Copy)`, createdAt: now, updatedAt: now };
        set((s) => ({ meetings: [...s.meetings, copy] }));
        get().addToast('Meeting duplicated');
      },
      completeMeeting: (id) => {
        set((s) => ({ meetings: s.meetings.map((m) => m.id === id ? { ...m, status: 'completed', updatedAt: new Date().toISOString() } : m) }));
        get().addToast('Meeting marked as completed');
      },
      cancelMeeting: (id) => {
        set((s) => ({ meetings: s.meetings.map((m) => m.id === id ? { ...m, status: 'cancelled', updatedAt: new Date().toISOString() } : m) }));
        get().addToast('Meeting cancelled', 'info');
      },
      rescheduleMeeting: (id, startDate, startTime, endTime, duration, participants) => {
        set((s) => ({
          meetings: s.meetings.map((m) => m.id === id ? {
            ...m, startDate, startTime, endTime, duration, participants,
            status: m.status === 'cancelled' ? 'scheduled' : m.status,
            updatedAt: new Date().toISOString(),
          } : m),
        }));
        get().addToast('Meeting rescheduled');
      },

      addNote: (meetingId, content, author) => {
        const now = new Date().toISOString();
        set((s) => ({
          notes: [...s.notes, { id: generateId(), meetingId, content, author, createdAt: now, updatedAt: now }],
        }));
        get().addToast('Note added');
      },
      updateNote: (noteId, content) => set((s) => ({
        notes: s.notes.map((n) => n.id === noteId ? { ...n, content, updatedAt: new Date().toISOString() } : n),
      })),
      deleteNote: (noteId) => set((s) => ({ notes: s.notes.filter((n) => n.id !== noteId) })),

      addAttachment: (meetingId, data) => {
        const now = new Date().toISOString();
        const attachment: Attachment = { ...data, id: generateId(), uploadedAt: now };
        set((s) => ({
          meetings: s.meetings.map((m) => m.id === meetingId ? { ...m, attachments: [...m.attachments, attachment], updatedAt: now } : m),
        }));
        get().addToast('Attachment uploaded');
      },
      deleteAttachment: (meetingId, attachmentId) => set((s) => ({
        meetings: s.meetings.map((m) => m.id === meetingId ? { ...m, attachments: m.attachments.filter((a) => a.id !== attachmentId), updatedAt: new Date().toISOString() } : m),
      })),

      toggleIntegration: (type) => set((s) => ({
        integrations: s.integrations.map((i) => i.type === type ? {
          ...i,
          status: i.status === 'connected' ? 'disconnected' as const : 'connected' as const,
          connectedAt: i.status === 'disconnected' ? new Date().toISOString() : null,
          email: i.status === 'disconnected' ? 'user@example.com' : '',
        } : i),
      })),

      createPlatformMeeting: (platformType) => {
        const r = (n: number) => Math.random().toString(36).substring(2, 2 + n);
        let url = '';
        let meetingId = '';
        let password = '';
        switch (platformType) {
          case 'zoom':
            meetingId = String(Math.floor(100000000 + Math.random() * 900000000));
            password = String(Math.floor(100000 + Math.random() * 900000));
            url = `https://zoom.us/j/${meetingId}`;
            break;
          case 'google_meet':
            url = `https://meet.google.com/${r(3)}-${r(3)}-${r(3)}`;
            break;
          case 'teams':
            meetingId = r(8);
            url = `https://teams.microsoft.com/meet/${meetingId}`;
            break;
        }
        return { url, meetingId, password };
      },

      verifyPlatformConnection: async (platformType) => {
        await new Promise(r => setTimeout(r, 800));
        const int = get().integrations.find(i => i.type === platformType);
        return int?.status === 'connected';
      },

      setPlatformMeeting: (meetingId, platform, url, meetingIdStr, password) => set((s) => ({
        meetings: s.meetings.map((m) => m.id === meetingId ? {
          ...m,
          meetingType: platform as Meeting['meetingType'],
          link: url,
          meetingId: meetingIdStr,
          password,
          updatedAt: new Date().toISOString(),
        } : m),
      })),

      addRecurringInstance: (meeting, date) => {
        const now = new Date().toISOString();
        const instance: Meeting = {
          ...meeting, id: generateId(), startDate: date, isRecurring: false,
          recurringParentId: meeting.id, createdAt: now, updatedAt: now,
        };
        set((s) => ({ meetings: [...s.meetings, instance] }));
      },
    }),
    { name: 'leadsphere-meetings' }
  )
);

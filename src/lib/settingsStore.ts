'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ProfileSettings {
  avatar: string;
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  company: string;
  timezone: string;
  language: string;
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  compactMode: boolean;
  sidebarCollapsed: boolean;
  density: 'comfortable' | 'compact' | 'cozy';
  animations: boolean;
  borderRadius: 'small' | 'medium' | 'large';
}

export interface NotificationSettings {
  desktop: boolean;
  email: boolean;
  whatsapp: boolean;
  taskReminders: boolean;
  meetingReminders: boolean;
  dealUpdates: boolean;
  leadAssignments: boolean;
  aiAlerts: boolean;
  reminderTime: number;
}

export interface WhatsAppSettings {
  autoReplies: boolean;
  businessHours: boolean;
  businessHoursStart: string;
  businessHoursEnd: string;
  greetingMessage: string;
  awayMessage: string;
  typingIndicator: boolean;
  readReceipts: boolean;
  signature: string;
  defaultTemplate: string;
  chatBackground: string;
}

export interface AISettings {
  enableCopilot: boolean;
  autoSuggestions: boolean;
  replyTone: 'professional' | 'casual' | 'friendly' | 'formal';
  creativityLevel: number;
  responseLength: 'short' | 'medium' | 'long';
  autoSummarizeChats: boolean;
  smartFollowUp: boolean;
  leadScoringAI: boolean;
}

export interface SecuritySettings {
  currentPassword: string;
  newPassword: string;
  twoFactorEnabled: boolean;
  loginAlerts: boolean;
  sessionTimeout: number;
  sessions: Array<{ id: string; device: string; location: string; lastActive: string; current: boolean }>;
}

export interface PrivacySettings {
  onlineStatus: 'everyone' | 'contacts' | 'nobody';
  lastSeen: 'everyone' | 'contacts' | 'nobody';
  profileVisibility: 'public' | 'team' | 'private';
  readReceipts: boolean;
  analyticsSharing: boolean;
  diagnosticData: boolean;
  cookiePreferences: 'all' | 'essential' | 'none';
}

export interface CRMSettings {
  defaultCurrency: string;
  numberFormat: string;
  dateFormat: string;
  fiscalYear: string;
  timezone: string;
  leadStages: string[];
  dealStages: string[];
  pipelineName: string;
  defaultOwner: string;
}

export interface IntegrationSettings {
  googleCalendar: boolean;
  outlook: boolean;
  slack: boolean;
  zoom: boolean;
  gmail: boolean;
  whatsappBusiness: boolean;
}

export interface ImportExportSettings {
  lastBackup: string | null;
}

export interface SystemSettings {
  appVersion: string;
  lastUpdateCheck: string | null;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  reduceMotion: boolean;
  fontScaling: number;
  keyboardShortcuts: boolean;
  screenReader: boolean;
}

export interface BrandingSettings {
  logo: string;
  primaryColor: string;
  companyTagline: string;
  favicon: string;
}

export interface OrganizationSettings {
  teamMembers: Array<{ id: string; name: string; email: string; role: string; status: string }>;
  roles: Array<{ id: string; name: string; permissions: string[] }>;
  departments: string[];
  territories: string[];
}

export interface BusinessSettingsData {
  businessType: string;
  registrationNumber: string;
  taxId: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export interface PipelineConfig {
  pipelines: Array<{ id: string; name: string; stages: string[]; active: boolean }>;
  leadStages: string[];
  leadSources: string[];
  winLossReasons: string[];
  customFields: Array<{ id: string; label: string; type: string; required: boolean }>;
  tags: string[];
  recordLayouts: Array<{ id: string; name: string; sections: string[] }>;
}

export interface WhatsAppContentSettings {
  templates: Array<{ id: string; name: string; body: string; category: string }>;
  autoReplies: Array<{ id: string; keyword: string; response: string; active: boolean }>;
  campaigns: Array<{ id: string; name: string; status: string }>;
  routingRules: Array<{ id: string; name: string; condition: string; action: string; active: boolean }>;
}

export interface CommunicationSettings {
  emailAccounts: Array<{ id: string; email: string; provider: string; active: boolean }>;
  callingProvider: string;
  callingApiKey: string;
  meetingProvider: string;
  meetingLinkPrefix: string;
}

export interface AutomationSettings {
  workflows: Array<{ id: string; name: string; trigger: string; actions: string[]; active: boolean }>;
  autoAssignment: boolean;
  assignmentRules: Array<{ id: string; name: string; criteria: string; assignee: string }>;
  slaPolicies: Array<{ id: string; name: string; responseTime: number; resolutionTime: number }>;
  escalationRules: Array<{ id: string; name: string; condition: string; target: string }>;
  reminderDefaults: { leadFollowUp: number; dealFollowUp: number; taskDefault: number };
}

export interface AuditLogSettings {
  retention: number;
  logLevel: string;
  trackApiCalls: boolean;
}

export interface DataRetentionSettings {
  leadRetention: number;
  dealRetention: number;
  activityRetention: number;
  communicationRetention: number;
  archiveAfter: number;
}

export interface BillingSettings {
  plan: string;
  status: string;
  nextBilling: string;
  invoices: Array<{ id: string; date: string; amount: string; status: string }>;
  usageLimits: { users: number; storage: string; apiCalls: number };
  paymentMethods: Array<{ id: string; type: string; last4: string; expiry: string; default: boolean }>;
}

export interface AllSettings {
  profile: ProfileSettings;
  appearance: AppearanceSettings;
  notifications: NotificationSettings;
  whatsapp: WhatsAppSettings;
  ai: AISettings;
  security: SecuritySettings;
  privacy: PrivacySettings;
  crm: CRMSettings;
  integrations: IntegrationSettings;
  importExport: ImportExportSettings;
  system: SystemSettings;
  accessibility: AccessibilitySettings;
  branding: BrandingSettings;
  business: BusinessSettingsData;
  organization: OrganizationSettings;
  pipeline: PipelineConfig;
  whatsAppContent: WhatsAppContentSettings;
  communication: CommunicationSettings;
  automation: AutomationSettings;
  auditLog: AuditLogSettings;
  dataRetention: DataRetentionSettings;
  billing: BillingSettings;
}

const defaultProfile: ProfileSettings = {
  avatar: '',
  fullName: 'Sarah Connor',
  email: 'sarah@leadsphere.io',
  phone: '+91 98765 43210',
  jobTitle: 'Sales Manager',
  company: 'LeadSphere CRM',
  timezone: 'Asia/Kolkata',
  language: 'English',
};

const defaultAppearance: AppearanceSettings = {
  theme: 'system',
  accentColor: '#0F766E',
  fontSize: 'medium',
  compactMode: false,
  sidebarCollapsed: false,
  density: 'comfortable',
  animations: true,
  borderRadius: 'medium',
};

const defaultNotifications: NotificationSettings = {
  desktop: true, email: true, whatsapp: true, taskReminders: true, meetingReminders: true,
  dealUpdates: true, leadAssignments: true, aiAlerts: true, reminderTime: 15,
};

const defaultWhatsApp: WhatsAppSettings = {
  autoReplies: true, businessHours: true, businessHoursStart: '09:00', businessHoursEnd: '18:00',
  greetingMessage: 'Hello! Thank you for reaching out to {{company}}. How can we help you today?',
  awayMessage: 'Thank you for your message. We are currently away and will respond during business hours.',
  typingIndicator: true, readReceipts: true, signature: 'Best regards,\n{{name}}\n{{company}}',
  defaultTemplate: 'welcome', chatBackground: 'default',
};

const defaultAI: AISettings = {
  enableCopilot: true, autoSuggestions: true, replyTone: 'professional', creativityLevel: 50,
  responseLength: 'medium', autoSummarizeChats: false, smartFollowUp: true, leadScoringAI: true,
};

const defaultSecurity: SecuritySettings = {
  currentPassword: '', newPassword: '', twoFactorEnabled: false, loginAlerts: true, sessionTimeout: 30,
  sessions: [
    { id: '1', device: 'Chrome on macOS', location: 'Mumbai, India', lastActive: 'Active now', current: true },
    { id: '2', device: 'Safari on iPhone', location: 'Mumbai, India', lastActive: '2 hours ago', current: false },
    { id: '3', device: 'Firefox on Windows', location: 'Delhi, India', lastActive: '3 days ago', current: false },
  ],
};

const defaultPrivacy: PrivacySettings = {
  onlineStatus: 'everyone', lastSeen: 'everyone', profileVisibility: 'team',
  readReceipts: true, analyticsSharing: true, diagnosticData: false, cookiePreferences: 'all',
};

const defaultCRM: CRMSettings = {
  defaultCurrency: 'INR', numberFormat: '1,234.56', dateFormat: 'DD/MM/YYYY', fiscalYear: 'April-March',
  timezone: 'Asia/Kolkata', leadStages: ['New', 'Contacted', 'Qualified', 'Proposal'], dealStages: ['Discovery', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'],
  pipelineName: 'Sales Pipeline', defaultOwner: 'Sarah Connor',
};

const defaultIntegrations: IntegrationSettings = {
  googleCalendar: true, outlook: false, slack: false, zoom: true, gmail: true, whatsappBusiness: true,
};

const defaultSystem: SystemSettings = { appVersion: '2.4.1', lastUpdateCheck: null };

const defaultAccessibility: AccessibilitySettings = {
  highContrast: false, reduceMotion: false, fontScaling: 100, keyboardShortcuts: true, screenReader: false,
};

const defaultBranding: BrandingSettings = {
  logo: '', primaryColor: '#0F766E', companyTagline: 'Empowering Sales Teams', favicon: '',
};

const defaultBusiness: BusinessSettingsData = {
  businessType: 'Private Limited', registrationNumber: 'U72900MH2020PTC123456', taxId: 'GSTIN-27AABCU1234D1Z1',
  address: '42, Tech Park, Andheri East', city: 'Mumbai', state: 'Maharashtra', country: 'India', pincode: '400093',
};

const defaultOrganization: OrganizationSettings = {
  teamMembers: [
    { id: '1', name: 'Sarah Connor', email: 'sarah@leadsphere.io', role: 'Admin', status: 'Active' },
    { id: '2', name: 'John Doe', email: 'john@leadsphere.io', role: 'Manager', status: 'Active' },
  ],
  roles: [
    { id: '1', name: 'Admin', permissions: ['All'] },
    { id: '2', name: 'Manager', permissions: ['Read', 'Write', 'Delete'] },
  ],
  departments: ['Sales', 'Marketing', 'Support', 'Operations'],
  territories: ['India', 'APAC', 'EMEA', 'Americas'],
};

const defaultPipeline: PipelineConfig = {
  pipelines: [{ id: '1', name: 'Sales Pipeline', stages: ['Discovery', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'], active: true }],
  leadStages: ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Closed'],
  leadSources: ['Website', 'Referral', 'LinkedIn', 'WhatsApp', 'Email', 'Phone Call', 'Event'],
  winLossReasons: ['Price', 'Competitor', 'Timing', 'Budget', 'Feature Gap', 'Other'],
  customFields: [{ id: '1', label: 'Company Size', type: 'text', required: false }],
  tags: ['VIP', 'Hot Lead', 'Cold Lead', 'Follow Up', 'Priority'],
  recordLayouts: [{ id: '1', name: 'Default Lead Layout', sections: ['Contact Info', 'Company Details'] }],
};

const defaultWhatsAppContent: WhatsAppContentSettings = {
  templates: [
    { id: '1', name: 'Welcome', body: 'Hello {{name}}, welcome to {{company}}!', category: 'Marketing' },
  ],
  autoReplies: [{ id: '1', keyword: 'hello', response: 'Hi! How can we help you?', active: true }],
  campaigns: [{ id: '1', name: 'Q3 Outreach', status: 'Active' }],
  routingRules: [{ id: '1', name: 'Sales Team', condition: 'tag == hot', action: 'assign:team_sales', active: true }],
};

const defaultCommunication: CommunicationSettings = {
  emailAccounts: [{ id: '1', email: 'hello@leadsphere.io', provider: 'Gmail', active: true }],
  callingProvider: 'Twilio', callingApiKey: '', meetingProvider: 'Google Meet', meetingLinkPrefix: 'https://meet.google.com/',
};

const defaultAutomation: AutomationSettings = {
  workflows: [{ id: '1', name: 'New Lead Onboarding', trigger: 'lead.created', actions: ['Assign Rep', 'Send Welcome'], active: true }],
  autoAssignment: true,
  assignmentRules: [{ id: '1', name: 'Round Robin', criteria: 'lead.created', assignee: 'auto' }],
  slaPolicies: [{ id: '1', name: 'Standard', responseTime: 4, resolutionTime: 24 }],
  escalationRules: [{ id: '1', name: 'Missed SLA', condition: 'sla_breached', target: 'manager' }],
  reminderDefaults: { leadFollowUp: 24, dealFollowUp: 48, taskDefault: 24 },
};

const defaultAuditLog: AuditLogSettings = { retention: 90, logLevel: 'info', trackApiCalls: true };

const defaultDataRetention: DataRetentionSettings = {
  leadRetention: 365, dealRetention: 365, activityRetention: 180, communicationRetention: 90, archiveAfter: 730,
};

const defaultBilling: BillingSettings = {
  plan: 'Enterprise', status: 'Active', nextBilling: '2026-08-01',
  invoices: [{ id: 'INV-001', date: '2026-06-01', amount: '$499', status: 'Paid' }],
  usageLimits: { users: 50, storage: '500 GB', apiCalls: 100000 },
  paymentMethods: [{ id: '1', type: 'Visa', last4: '4242', expiry: '12/28', default: true }],
};

interface SettingsStore extends AllSettings {
  updateProfile: (data: Partial<ProfileSettings>) => void;
  updateAppearance: (data: Partial<AppearanceSettings>) => void;
  updateNotifications: (data: Partial<NotificationSettings>) => void;
  updateWhatsApp: (data: Partial<WhatsAppSettings>) => void;
  updateAI: (data: Partial<AISettings>) => void;
  updateSecurity: (data: Partial<SecuritySettings>) => void;
  updatePrivacy: (data: Partial<PrivacySettings>) => void;
  updateCRM: (data: Partial<CRMSettings>) => void;
  updateIntegrations: (data: Partial<IntegrationSettings>) => void;
  updateImportExport: (data: Partial<ImportExportSettings>) => void;
  updateSystem: (data: Partial<SystemSettings>) => void;
  updateAccessibility: (data: Partial<AccessibilitySettings>) => void;
  updateBranding: (data: Partial<BrandingSettings>) => void;
  updateBusiness: (data: Partial<BusinessSettingsData>) => void;
  updateOrganization: (data: Partial<OrganizationSettings>) => void;
  updatePipeline: (data: Partial<PipelineConfig>) => void;
  updateWhatsAppContent: (data: Partial<WhatsAppContentSettings>) => void;
  updateCommunication: (data: Partial<CommunicationSettings>) => void;
  updateAutomation: (data: Partial<AutomationSettings>) => void;
  updateAuditLog: (data: Partial<AuditLogSettings>) => void;
  updateDataRetention: (data: Partial<DataRetentionSettings>) => void;
  updateBilling: (data: Partial<BillingSettings>) => void;
  resetAll: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      profile: { ...defaultProfile },
      appearance: { ...defaultAppearance },
      notifications: { ...defaultNotifications },
      whatsapp: { ...defaultWhatsApp },
      ai: { ...defaultAI },
      security: { ...defaultSecurity },
      privacy: { ...defaultPrivacy },
      crm: { ...defaultCRM },
      integrations: { ...defaultIntegrations },
      importExport: { lastBackup: null },
      system: { ...defaultSystem },
      accessibility: { ...defaultAccessibility },
      branding: { ...defaultBranding },
      business: { ...defaultBusiness },
      organization: { ...defaultOrganization },
      pipeline: { ...defaultPipeline },
      whatsAppContent: { ...defaultWhatsAppContent },
      communication: { ...defaultCommunication },
      automation: { ...defaultAutomation },
      auditLog: { ...defaultAuditLog },
      dataRetention: { ...defaultDataRetention },
      billing: { ...defaultBilling },

      updateProfile: (data) => set((s) => ({ profile: { ...s.profile, ...data } })),
      updateAppearance: (data) => set((s) => ({ appearance: { ...s.appearance, ...data } })),
      updateNotifications: (data) => set((s) => ({ notifications: { ...s.notifications, ...data } })),
      updateWhatsApp: (data) => set((s) => ({ whatsapp: { ...s.whatsapp, ...data } })),
      updateAI: (data) => set((s) => ({ ai: { ...s.ai, ...data } })),
      updateSecurity: (data) => set((s) => ({ security: { ...s.security, ...data } })),
      updatePrivacy: (data) => set((s) => ({ privacy: { ...s.privacy, ...data } })),
      updateCRM: (data) => set((s) => ({ crm: { ...s.crm, ...data } })),
      updateIntegrations: (data) => set((s) => ({ integrations: { ...s.integrations, ...data } })),
      updateImportExport: (data) => set((s) => ({ importExport: { ...s.importExport, ...data } })),
      updateSystem: (data) => set((s) => ({ system: { ...s.system, ...data } })),
      updateAccessibility: (data) => set((s) => ({ accessibility: { ...s.accessibility, ...data } })),
      updateBranding: (data) => set((s) => ({ branding: { ...s.branding, ...data } })),
      updateBusiness: (data) => set((s) => ({ business: { ...s.business, ...data } })),
      updateOrganization: (data) => set((s) => ({ organization: { ...s.organization, ...data } })),
      updatePipeline: (data) => set((s) => ({ pipeline: { ...s.pipeline, ...data } })),
      updateWhatsAppContent: (data) => set((s) => ({ whatsAppContent: { ...s.whatsAppContent, ...data } })),
      updateCommunication: (data) => set((s) => ({ communication: { ...s.communication, ...data } })),
      updateAutomation: (data) => set((s) => ({ automation: { ...s.automation, ...data } })),
      updateAuditLog: (data) => set((s) => ({ auditLog: { ...s.auditLog, ...data } })),
      updateDataRetention: (data) => set((s) => ({ dataRetention: { ...s.dataRetention, ...data } })),
      updateBilling: (data) => set((s) => ({ billing: { ...s.billing, ...data } })),
      resetAll: () => set({
        profile: { ...defaultProfile }, appearance: { ...defaultAppearance },
        notifications: { ...defaultNotifications }, whatsapp: { ...defaultWhatsApp },
        ai: { ...defaultAI }, security: { ...defaultSecurity }, privacy: { ...defaultPrivacy },
        crm: { ...defaultCRM }, integrations: { ...defaultIntegrations },
        importExport: { lastBackup: null }, system: { ...defaultSystem },
        accessibility: { ...defaultAccessibility }, branding: { ...defaultBranding },
        business: { ...defaultBusiness }, organization: { ...defaultOrganization },
        pipeline: { ...defaultPipeline }, whatsAppContent: { ...defaultWhatsAppContent },
        communication: { ...defaultCommunication }, automation: { ...defaultAutomation },
        auditLog: { ...defaultAuditLog }, dataRetention: { ...defaultDataRetention },
        billing: { ...defaultBilling },
      }),
    }),
    { name: 'leadsphere-settings' }
  )
);

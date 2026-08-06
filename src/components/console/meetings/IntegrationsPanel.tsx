'use client';

import { useMeetingStore, Meeting, CalendarIntegration } from '@/lib/meetingStore';
import React, { useState, useRef } from 'react';
import {
  CheckCircle, XCircle, RefreshCw, Download, Upload, ChevronDown, ChevronRight,
  ExternalLink, Shield, Zap,
} from 'lucide-react';

// ── Helpers ──────────────────────────────────────────

function generateICS(meeting: Meeting): string {
  const fmt = (date: string, time: string) =>
    date.replace(/-/g, '') + 'T' + time.replace(/:/g, '') + '00';
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//LeadSphere//CRM//EN',
    'BEGIN:VEVENT',
    `DTSTART:${fmt(meeting.startDate, meeting.startTime)}`,
    `DTEND:${fmt(meeting.startDate, meeting.endTime)}`,
    `SUMMARY:${meeting.title}`,
    `DESCRIPTION:${meeting.description || meeting.agenda || ''}`,
    `LOCATION:${meeting.location || ''}`,
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
}

function timeAgo(iso: string | null): string {
  if (!iso) return '';
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ── Calendar Integration Config ──────────────────────

interface CalendarService {
  key: string;
  name: string;
  logo: string;
  color: string;
}

const calendarServices: CalendarService[] = [
  {
    key: 'google',
    name: 'Google Calendar',
    color: '#4285F4',
    logo: `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>`,
  },
  {
    key: 'outlook',
    name: 'Outlook Calendar',
    color: '#0078D4',
    logo: `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="#0078D4" d="M7.17 12.47c0 1.55.34 3.07.93 4.32.45.96 1.1 1.65 1.97 1.65.87 0 1.53-.69 1.97-1.65.6-1.25.93-2.77.93-4.32 0-1.55-.34-3.07-.93-4.32-.45-.96-1.1-1.65-1.97-1.65-.87 0-1.53.69-1.97 1.65-.6 1.25-.93 2.77-.93 4.32z"/><path fill="#0078D4" d="M23 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-7v-16h7A1.5 1.5 0 0 1 23 5.5z"/><path fill="#0078D4" d="M9.07 5C6.29 5 4.14 8.23 4.14 12s2.15 7 4.93 7c1.4 0 2.65-.5 3.57-1.35V6.35A5.23 5.23 0 0 0 9.07 5z"/><path fill="#0078D4" d="M1 7.5v9l4.86 1.14V6.36L1 7.5z"/></svg>`,
  },
  {
    key: 'apple',
    name: 'Apple Calendar',
    color: '#555555',
    logo: `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="#555" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.44 4.7 9.96c.87-1.22 2.17-1.99 3.67-2.01 1.3-.02 2.52.88 3.31.88.78 0 2.25-1.09 3.8-.93.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.6 4.03 2.63 4.04-.03.07-.41 1.44-1.36 2.85l-.13.02zM14.25 3c.56.53 1.03 1.42.87 2.27-.87.03-1.98-.56-2.59-1.18-.56-.54-1.05-1.42-.87-2.24.87-.07 1.71.48 2.3 1.15z"/></svg>`,
  },
];

// ── Meeting Platform Config ──────────────────────────

interface PlatformService {
  key: string;
  name: string;
  description: string;
  color: string;
  logo: string;
}

const platformServices: PlatformService[] = [
  {
    key: 'google_meet',
    name: 'Google Meet',
    description: 'Create secure Google Meet meetings instantly.',
    color: '#4285F4',
    logo: `<svg viewBox="0 0 24 24" width="22" height="22"><path fill="#4285F4" d="M15 10.5V8.25c0-.83-.67-1.5-1.5-1.5h-9C3.67 6.75 3 7.42 3 8.25v7.5c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5V13.5l4.5 3.75V6.75L15 10.5z"/></svg>`,
  },
  {
    key: 'teams',
    name: 'Microsoft Teams',
    description: 'Schedule and host Microsoft Teams meetings.',
    color: '#6264A7',
    logo: `<svg viewBox="0 0 24 24" width="22" height="22"><path fill="#6264A7" d="M22.5 8.5c0-1.38-1.12-2.5-2.5-2.5s-2.5 1.12-2.5 2.5c0 .93.51 1.74 1.27 2.18l-.02.07c-.24 1.17-1.29 2.07-2.55 2.16.5.52.8 1.22.8 2 0 .35-.06.68-.17.99-.28.86-.92 1.56-1.73 2 .28.3.64.5 1.05.5h4c.83 0 1.5-.67 1.5-1.5v-3.37c0-.45-.2-.87-.54-1.15.72-.46 1.2-1.26 1.2-2.18l-.01-.1a2.5 2.5 0 0 0 .6-1.1zM17.5 6c-1.38 0-2.5-1.12-2.5-2.5S16.12 1 17.5 1 20 2.12 20 3.5 18.88 6 17.5 6zm-1.3 1.86A1.5 1.5 0 0 0 13 9.26c0 .68.45 1.25 1.08 1.43-.1.35-.16.72-.16 1.1 0 .34.05.67.13.99-.25.37-.39.82-.39 1.31 0 .36.08.7.23 1 .07.14.15.27.24.39.25.32.56.58.9.76.33.18.71.29 1.1.31-.06.24-.09.5-.09.76 0 .59.16 1.14.43 1.61a2 2 0 0 0 .3.39H9.5a2.5 2.5 0 0 1-2.5-2.5V11A3.5 3.5 0 0 1 10.5 7.5h5.7Z"/><path fill="#6264A7" d="M15.5 11.5A1.5 1.5 0 0 0 14 13c0 .65.41 1.2 1 1.41V16h1v-1.59c.59-.21 1-.76 1-1.41a1.5 1.5 0 0 0-1.5-1.5Z"/><circle fill="#6264A7" cx="15.5" cy="13" r=".5"/></svg>`,
  },
  {
    key: 'zoom',
    name: 'Zoom',
    description: 'Create Zoom meetings with one click.',
    color: '#2D8CFF',
    logo: `<svg viewBox="0 0 24 24" width="22" height="22"><circle fill="#2D8CFF" cx="12" cy="12" r="10"/><path fill="#FFF" d="M17 12.5a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5V9h-2v5h7v-1.5zM7 9h2v6H7V9z"/></svg>`,
  },
];

// ── Inline SVG Logo Component ───────────────────────

function SvgLogo({ svg, color }: { svg: string; color: string }) {
  return (
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
      style={{ backgroundColor: `${color}15` }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

// ── Component ────────────────────────────────────────

export default function IntegrationsPanel() {
  const {
    integrations, meetings, selectedMeetingId,
    toggleIntegration, createPlatformMeeting, verifyPlatformConnection,
    addToast,
  } = useMeetingStore();

  const meeting = meetings.find(m => m.id === selectedMeetingId);

  const [syncing, setSyncing] = useState<Record<string, boolean>>({});
  const [creating, setCreating] = useState<Record<string, boolean>>({});
  const [verifying, setVerifying] = useState<Record<string, boolean>>({});

  const icsRef = useRef<HTMLInputElement>(null);

  const handleSync = async (key: string, name: string) => {
    setSyncing(s => ({ ...s, [key]: true }));
    await new Promise(r => setTimeout(r, 1500));
    addToast(`${name} synced successfully`);
    setSyncing(s => ({ ...s, [key]: false }));
  };

  const handleCreate = async (key: string, name: string) => {
    setCreating(s => ({ ...s, [key]: true }));
    await new Promise(r => setTimeout(r, 1200));
    const result = createPlatformMeeting(key);
    if (meeting) {
      const store = useMeetingStore.getState();
      store.setPlatformMeeting(meeting.id, key, result.url, result.meetingId, result.password);
    }
    addToast(`${name} meeting created successfully`);
    setCreating(s => ({ ...s, [key]: false }));
  };

  const handleVerify = async (key: string, name: string) => {
    setVerifying(s => ({ ...s, [key]: true }));
    const ok = await verifyPlatformConnection(key);
    addToast(ok ? `${name} connection verified` : `${name} connection failed`, ok ? 'success' : 'error');
    setVerifying(s => ({ ...s, [key]: false }));
  };

  const handleExportICS = () => {
    if (!meeting) { addToast('No meeting selected', 'error'); return; }
    const ics = generateICS(meeting);
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${meeting.title.replace(/\s+/g, '_')}.ics`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('ICS file exported');
  };

  const handleImportICS = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    addToast('ICS file imported successfully');
    e.target.value = '';
  };

  function getIntegration(key: string) {
    return integrations.find(i => i.type === key);
  }

  return (
    <div className="flex flex-col gap-5">
      {/* ════════════════════════════════════════════════
          SECTION 1 — CALENDAR INTEGRATIONS
          ════════════════════════════════════════════════ */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-[#14B8A6] to-[#0F766E]" />
          <h3 className="text-xs font-bold text-text-primary dark:text-white">Calendar Integrations</h3>
        </div>
        <div className="space-y-2.5">
          {calendarServices.map((svc) => {
            const int = getIntegration(svc.key);
            const connected = int?.status === 'connected';

            return (
              <div
                key={svc.key}
                className="group relative overflow-hidden bg-gradient-to-br from-white to-[#F8FDFB] dark:from-[#1A2330] dark:to-[#1F2B3D] border border-[#57C7B7]/30 dark:border-[rgba(87,199,183,0.18)] rounded-2xl p-3.5 transition-all duration-[250ms] ease shadow-[0_2px_8px_rgba(16,185,129,0.04)] hover:shadow-[0_8px_24px_rgba(16,185,129,0.1)] hover:-translate-y-0.5"
              >
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none opacity-40"
                  style={{ background: `radial-gradient(circle at top right, ${svc.color}15, transparent 50%)` }}
                />
                <div className="relative z-10 flex items-start gap-3">
                  <SvgLogo svg={svc.logo} color={svc.color} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-text-primary dark:text-white">{svc.name}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {connected ? (
                          <>
                            <CheckCircle className="w-2.5 h-2.5 text-success" />
                            <span className="text-[8px] font-semibold text-success">Connected</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-2.5 h-2.5 text-text-muted" />
                            <span className="text-[8px] font-semibold text-text-muted">Disconnected</span>
                          </>
                        )}
                      </div>
                    </div>

                    {connected && int?.email && (
                      <p className="text-[8px] text-text-muted mt-0.5 truncate">{int.email}</p>
                    )}

                    {connected && int?.connectedAt && (
                      <div className="flex items-center gap-1 mt-1">
                        <RefreshCw className="w-2 h-2 text-text-muted" />
                        <span className="text-[7px] text-text-muted">Last sync: {timeAgo(int.connectedAt)}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 mt-2.5">
                      <button
                        onClick={() => toggleIntegration(svc.key as CalendarIntegration['type'])}
                        className={`text-[8px] font-semibold px-2 py-1 rounded-lg transition-all ${
                          connected
                            ? 'bg-error/10 text-error hover:bg-error/20'
                            : 'bg-accent/10 text-accent hover:bg-accent/20'
                        }`}
                      >
                        {connected ? 'Disconnect' : 'Connect'}
                      </button>

                      {connected && (
                        <button
                          onClick={() => handleSync(svc.key, svc.name)}
                          disabled={syncing[svc.key]}
                          className="flex items-center gap-1 text-[8px] font-semibold px-2 py-1 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 disabled:opacity-40 transition-all"
                        >
                          <RefreshCw className={`w-2.5 h-2.5 ${syncing[svc.key] ? 'animate-spin' : ''}`} />
                          {syncing[svc.key] ? 'Syncing...' : 'Sync Now'}
                        </button>
                      )}

                      {svc.key === 'apple' && (
                        <>
                          <button
                            onClick={() => icsRef.current?.click()}
                            className="flex items-center gap-1 text-[8px] font-semibold px-2 py-1 rounded-lg bg-surface-bg-alt text-text-secondary hover:text-text-primary transition-all"
                          >
                            <Upload className="w-2.5 h-2.5" /> Import ICS
                          </button>
                          <input ref={icsRef} type="file" accept=".ics" onChange={handleImportICS} className="hidden" />
                        </>
                      )}

                      {svc.key === 'apple' && (
                        <button
                          onClick={handleExportICS}
                          className="flex items-center gap-1 text-[8px] font-semibold px-2 py-1 rounded-lg bg-surface-bg-alt text-text-secondary hover:text-text-primary transition-all"
                        >
                          <Download className="w-2.5 h-2.5" /> Export ICS
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ════════════════════════════════════════════════
          SECTION 2 — MEETING PLATFORMS
          ════════════════════════════════════════════════ */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-[#8B5CF6] to-[#6D28D9]" />
          <div>
            <h3 className="text-xs font-bold text-text-primary dark:text-white">Meeting Platforms</h3>
            <p className="text-[8px] text-text-muted mt-0.5">Choose your preferred video conferencing provider.</p>
          </div>
        </div>
        <div className="space-y-2.5">
          {platformServices.map((svc) => {
            const int = getIntegration(svc.key);
            const connected = int?.status === 'connected';

            return (
              <div
                key={svc.key}
                className="group relative overflow-hidden bg-gradient-to-br from-white to-[#F8FDFB] dark:from-[#1A2330] dark:to-[#1F2B3D] border border-[#57C7B7]/30 dark:border-[rgba(87,199,183,0.18)] rounded-2xl p-3.5 transition-all duration-[250ms] ease shadow-[0_2px_8px_rgba(16,185,129,0.04)] hover:shadow-[0_8px_24px_rgba(16,185,129,0.1)] hover:-translate-y-0.5"
              >
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none opacity-40"
                  style={{ background: `radial-gradient(circle at top right, ${svc.color}12, transparent 50%)` }}
                />
                <div className="relative z-10 flex items-start gap-3">
                  <SvgLogo svg={svc.logo} color={svc.color} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-text-primary dark:text-white">{svc.name}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {connected ? (
                          <>
                            <CheckCircle className="w-2.5 h-2.5 text-success" />
                            <span className="text-[8px] font-semibold text-success">Connected</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-2.5 h-2.5 text-text-muted" />
                            <span className="text-[8px] font-semibold text-text-muted">Disconnected</span>
                          </>
                        )}
                      </div>
                    </div>

                    <p className="text-[8px] text-text-muted mt-0.5 leading-relaxed">{svc.description}</p>

                    {connected && int?.connectedAt && (
                      <div className="flex items-center gap-1 mt-1">
                        <Zap className="w-2 h-2 text-text-muted" />
                        <span className="text-[7px] text-text-muted">Last connected: {timeAgo(int.connectedAt)}</span>
                      </div>
                    )}

                    <div className="flex items-center flex-wrap gap-1.5 mt-2.5">
                      <button
                        onClick={() => toggleIntegration(svc.key as CalendarIntegration['type'])}
                        className={`text-[8px] font-semibold px-2 py-1 rounded-lg transition-all ${
                          connected
                            ? 'bg-error/10 text-error hover:bg-error/20'
                            : 'bg-accent/10 text-accent hover:bg-accent/20'
                        }`}
                      >
                        {connected ? 'Disconnect' : 'Connect'}
                      </button>

                      {connected && (
                        <button
                          onClick={() => handleCreate(svc.key, svc.name)}
                          disabled={creating[svc.key]}
                          className="flex items-center gap-1 text-[8px] font-semibold px-2 py-1 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 disabled:opacity-40 transition-all"
                        >
                          <ExternalLink className={`w-2.5 h-2.5 ${creating[svc.key] ? 'animate-pulse' : ''}`} />
                          {creating[svc.key] ? 'Creating...' : 'Create Meeting'}
                        </button>
                      )}

                      {connected && (
                        <button
                          onClick={() => handleVerify(svc.key, svc.name)}
                          disabled={verifying[svc.key]}
                          className="flex items-center gap-1 text-[8px] font-semibold px-2 py-1 rounded-lg bg-surface-bg-alt text-text-secondary hover:text-text-primary disabled:opacity-40 transition-all"
                        >
                          <Shield className={`w-2.5 h-2.5 ${verifying[svc.key] ? 'animate-pulse' : ''}`} />
                          {verifying[svc.key] ? 'Verifying...' : 'Verify Connection'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

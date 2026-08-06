'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useMeetingStore, Meeting } from '@/lib/meetingStore';
import { X, Plus, Trash2 } from 'lucide-react';

const MEETING_TYPES = [
  { value: 'zoom', label: 'Zoom', icon: `<svg viewBox="0 0 24 24" width="16" height="16"><circle fill="#2D8CFF" cx="12" cy="12" r="10"/><path fill="#FFF" d="M17 12.5a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5V9h-2v5h7v-1.5zM7 9h2v6H7V9z"/></svg>` },
  { value: 'google_meet', label: 'Google Meet', icon: `<svg viewBox="0 0 24 24" width="16" height="16"><path fill="#4285F4" d="M15 10.5V8.25c0-.83-.67-1.5-1.5-1.5h-9C3.67 6.75 3 7.42 3 8.25v7.5c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5V13.5l4.5 3.75V6.75L15 10.5z"/></svg>` },
  { value: 'teams', label: 'Microsoft Teams', icon: `<svg viewBox="0 0 24 24" width="16" height="16"><path fill="#6264A7" d="M22.5 8.5c0-1.38-1.12-2.5-2.5-2.5s-2.5 1.12-2.5 2.5c0 .93.51 1.74 1.27 2.18l-.02.07c-.24 1.17-1.29 2.07-2.55 2.16.5.52.8 1.22.8 2 0 .35-.06.68-.17.99-.28.86-.92 1.56-1.73 2 .28.3.64.5 1.05.5h4c.83 0 1.5-.67 1.5-1.5v-3.37c0-.45-.2-.87-.54-1.15.72-.46 1.2-1.26 1.2-2.18l-.01-.1a2.5 2.5 0 0 0 .6-1.1zM17.5 6c-1.38 0-2.5-1.12-2.5-2.5S16.12 1 17.5 1 20 2.12 20 3.5 18.88 6 17.5 6zm-1.3 1.86A1.5 1.5 0 0 0 13 9.26c0 .68.45 1.25 1.08 1.43-.1.35-.16.72-.16 1.1 0 .34.05.67.13.99-.25.37-.39.82-.39 1.31 0 .36.08.7.23 1 .07.14.15.27.24.39.25.32.56.58.9.76.33.18.71.29 1.1.31-.06.24-.09.5-.09.76 0 .59.16 1.14.43 1.61a2 2 0 0 0 .3.39H9.5a2.5 2.5 0 0 1-2.5-2.5V11A3.5 3.5 0 0 1 10.5 7.5h5.7Z"/><path fill="#6264A7" d="M15.5 11.5A1.5 1.5 0 0 0 14 13c0 .65.41 1.2 1 1.41V16h1v-1.59c.59-.21 1-.76 1-1.41a1.5 1.5 0 0 0-1.5-1.5Z"/><circle fill="#6264A7" cx="15.5" cy="13" r=".5"/></svg>` },
  { value: 'in_person', label: 'In Person', icon: null },
  { value: 'phone', label: 'Phone Call', icon: null },
  { value: 'custom', label: 'Custom URL', icon: null },
];

const PRIORITIES = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const COLOR_SWATCHES = [
  '#0F766E', '#2563EB', '#7C3AED', '#DC2626',
  '#D97706', '#059669', '#DB2777', '#1D4ED8',
];

const REMINDERS = [
  { value: 5, label: '5 min' },
  { value: 10, label: '10 min' },
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 60, label: '1 hour' },
  { value: 1440, label: '1 day' },
];

const TIMEZONES = [
  'UTC', 'Asia/Kolkata', 'America/New_York', 'America/Chicago',
  'America/Los_Angeles', 'Europe/London', 'Europe/Berlin',
  'Asia/Dubai', 'Asia/Singapore', 'Asia/Tokyo',
];

const REPEATS = [
  { value: 'none', label: 'None' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Biweekly' },
  { value: 'monthly', label: 'Monthly' },
];

interface NewMeetingModalProps {
  onClose: () => void;
  editMeeting?: Meeting;
}

function generateMeetingLink(type: string): string {
  const r = (n: number) => Math.random().toString(36).substring(2, 2 + n);
  switch (type) {
    case 'zoom':
      return `https://zoom.us/j/${Math.floor(100000000 + Math.random() * 900000000)}`;
    case 'google_meet':
      return `https://meet.google.com/${r(3)}-${r(3)}-${r(3)}`;
    case 'teams':
      return `https://teams.microsoft.com/meet/${r(8)}`;
    default:
      return '';
  }
}

function calculateDuration(startTime: string, endTime: string): string {
  if (!startTime || !endTime) return '';
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  const startMin = sh * 60 + sm;
  let endMin = eh * 60 + em;
  if (endMin <= startMin) endMin += 1440;
  const diff = endMin - startMin;
  const hrs = Math.floor(diff / 60);
  const mins = diff % 60;
  if (hrs > 0 && mins > 0) return `${hrs} hr ${mins} min`;
  if (hrs > 0) return `${hrs} hr`;
  if (mins > 0) return `${mins} min`;
  return '';
}

function formatDateForInput(d: Date): string {
  return d.toISOString().split('T')[0];
}

function formatTimeForInput(d: Date): string {
  return d.toTimeString().split(' ')[0].substring(0, 5);
}

export default function NewMeetingModal({ onClose, editMeeting }: NewMeetingModalProps) {
  const { addMeeting, updateMeeting, addToast, integrations } = useMeetingStore();

  const todayStr = formatDateForInput(new Date());
  const nowTime = formatTimeForInput(new Date());

  const isEdit = !!editMeeting;

  const [title, setTitle] = useState(editMeeting?.title || '');
  const [description, setDescription] = useState(editMeeting?.description || '');
  const [location, setLocation] = useState(editMeeting?.location || '');
  const [meetingType, setMeetingType] = useState(editMeeting?.meetingType || 'zoom');
  const [startDate, setStartDate] = useState(editMeeting?.startDate || todayStr);
  const [startTime, setStartTime] = useState(editMeeting?.startTime || nowTime);
  const [endTime, setEndTime] = useState(editMeeting?.endTime || '');
  const [participants, setParticipants] = useState<string[]>(editMeeting?.participants || []);
  const [participantInput, setParticipantInput] = useState('');
  const [company, setCompany] = useState(editMeeting?.company || '');
  const [lead, setLead] = useState(editMeeting?.lead || '');
  const [deal, setDeal] = useState(editMeeting?.deal || '');
  const [priority, setPriority] = useState(editMeeting?.priority || 'medium');
  const [color, setColor] = useState(editMeeting?.color || '#0F766E');
  const [reminder, setReminder] = useState(editMeeting?.reminder ?? 15);
  const [timezone, setTimezone] = useState(editMeeting?.timezone || 'Asia/Kolkata');
  const [repeat, setRepeat] = useState(editMeeting?.repeat || 'none');
  const [notes, setNotes] = useState(editMeeting?.notes || '');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const titleRef = useRef<HTMLInputElement>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (endTime && startTime && endTime <= startTime) {
      setErrors((prev) => ({ ...prev, endTime: 'End time must be after start time' }));
    } else {
      setErrors((prev) => {
        const { endTime: _, ...rest } = prev;
        return rest;
      });
    }
  }, [startTime, endTime]);

  useEffect(() => {
    if (!isEdit && startDate && startDate < todayStr) {
      setErrors((prev) => ({ ...prev, startDate: 'Start date must not be in the past' }));
    } else {
      setErrors((prev) => {
        const { startDate: _, ...rest } = prev;
        return rest;
      });
    }
  }, [startDate, todayStr, isEdit]);

  const handleAddParticipant = () => {
    const name = participantInput.trim();
    if (name && !participants.includes(name)) {
      setParticipants([...participants, name]);
    }
    setParticipantInput('');
  };

  const handleRemoveParticipant = (name: string) => {
    setParticipants(participants.filter((p) => p !== name));
  };

  const handleParticipantKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddParticipant();
    }
  };

  const duration = calculateDuration(startTime, endTime);

  const isIntegrationConnected = (type: string): boolean => {
    const integrationMap: Record<string, string> = {
      zoom: 'zoom',
      google_meet: 'google_meet',
      teams: 'teams',
    };
    const intType = integrationMap[type];
    if (!intType) return false;
    return integrations.some((i: { type: string; status: string }) => i.type === intType && i.status === 'connected');
  };

  const [generatedLink, setGeneratedLink] = useState(editMeeting?.link || '');

  useEffect(() => {
    if (meetingType === 'zoom' || meetingType === 'google_meet' || meetingType === 'teams') {
      if (isIntegrationConnected(meetingType) && !editMeeting) {
        setGeneratedLink(generateMeetingLink(meetingType));
      } else if (editMeeting?.link) {
        setGeneratedLink(editMeeting.link);
      } else {
        setGeneratedLink(generateMeetingLink(meetingType));
      }
    } else {
      setGeneratedLink('');
    }
  }, [meetingType]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!title.trim() || title.trim().length < 3) {
      errs.title = 'Title is required (min 3 characters)';
    }
    if (!startDate) {
      errs.startDate = 'Start date is required';
    } else if (!isEdit && startDate < todayStr) {
      errs.startDate = 'Start date must not be in the past';
    }
    if (!startTime) {
      errs.startTime = 'Start time is required';
    }
    if (!endTime) {
      errs.endTime = 'End time is required';
    } else if (startTime && endTime <= startTime) {
      errs.endTime = 'End time must be after start time';
    }

    setErrors(errs);

    if (errs.title && titleRef.current) {
      titleRef.current?.focus();
    } else if (errs.startDate && startDateRef.current) {
      startDateRef.current?.focus();
    } else if (errs.startTime && startTimeRef.current) {
      startTimeRef.current?.focus();
    } else if (errs.endTime && endTimeRef.current) {
      endTimeRef.current?.focus();
    }

    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const isPlatform = meetingType === 'zoom' || meetingType === 'google_meet' || meetingType === 'teams';
    const link = isPlatform ? (generatedLink || generateMeetingLink(meetingType)) : '';

    let meetingIdStr = editMeeting?.meetingId || '';
    let password = editMeeting?.password || '';
    if (isPlatform && !editMeeting) {
      const result = useMeetingStore.getState().createPlatformMeeting(meetingType);
      meetingIdStr = result.meetingId;
      password = result.password;
    }

    const baseData = {
      title: title.trim(),
      description,
      location,
      type: (meetingType === 'in_person' || meetingType === 'phone' ? 'internal' : 'client') as 'client' | 'internal',
      meetingType: meetingType as Meeting['meetingType'],
      startDate,
      startTime,
      endTime,
      duration,
      participants,
      company,
      lead,
      deal,
      priority: priority as Meeting['priority'],
      color,
      reminder,
      timezone,
      repeat: repeat as Meeting['repeat'],
      agenda: '',
      notes,
      attachments: [],
      status: 'scheduled' as Meeting['status'],
      outcome: '',
      link,
      meetingId: meetingIdStr,
      password,
      hostUrl: isPlatform ? link : '',
      recording: '',
      isRecurring: repeat !== 'none',
      recurringParentId: null,
    };

    if (isEdit && editMeeting) {
      updateMeeting(editMeeting.id, baseData);
      addToast('Meeting updated successfully');
    } else {
      addMeeting(baseData);
      addToast('Meeting created successfully');
    }

    onClose();
  };

  const inputBase = (hasError: boolean) =>
    `w-full bg-surface-bg border rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary placeholder:text-text-muted ${
      hasError ? 'border-error' : 'border-border-default'
    }`;

  const labelClass = 'text-[10px] font-medium text-text-muted block mb-1';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-surface-card border border-border-default rounded-[14px] w-full max-w-lg max-h-[90vh] shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-default shrink-0">
          <h3 className="text-sm font-bold text-text-primary">
            {isEdit ? 'Edit Meeting' : 'New Meeting'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-surface-bg-alt text-text-secondary"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
          <div>
            <label className={labelClass}>Title *</label>
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Q3 Enterprise Agreement Review"
              className={inputBase(!!errors.title)}
            />
            {errors.title && (
              <p className="text-[9px] text-error mt-0.5">{errors.title}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Meeting description..."
              rows={3}
              className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary placeholder:text-text-muted resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Room / address"
                className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary placeholder:text-text-muted"
              />
            </div>
            <div>
              <label className={labelClass}>Meeting Type *</label>
              <select
                value={meetingType}
                onChange={(e) => setMeetingType(e.target.value as typeof meetingType)}
                className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary"
              >
                {MEETING_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              {meetingType !== 'in_person' && meetingType !== 'phone' && meetingType !== 'custom' && generatedLink && (
                <div className="mt-1.5 flex items-center gap-1.5 bg-accent/5 rounded-lg px-2 py-1.5">
                  <div
                    className="w-4 h-4 shrink-0"
                    dangerouslySetInnerHTML={{ __html: MEETING_TYPES.find(t => t.value === meetingType)?.icon || '' }}
                  />
                  <span className="text-[9px] text-accent font-medium truncate">{generatedLink}</span>
                  <button
                    type="button"
                    onClick={() => { navigator.clipboard.writeText(generatedLink); addToast('Link copied'); }}
                    className="ml-auto text-[8px] text-accent hover:underline shrink-0"
                  >
                    Copy
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Start Date *</label>
              <input
                ref={startDateRef}
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={inputBase(!!errors.startDate)}
              />
              {errors.startDate && (
                <p className="text-[9px] text-error mt-0.5">{errors.startDate}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Start Time *</label>
              <input
                ref={startTimeRef}
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={inputBase(!!errors.startTime)}
              />
              {errors.startTime && (
                <p className="text-[9px] text-error mt-0.5">{errors.startTime}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>End Time *</label>
              <input
                ref={endTimeRef}
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className={inputBase(!!errors.endTime)}
              />
              {errors.endTime && (
                <p className="text-[9px] text-error mt-0.5">{errors.endTime}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Duration</label>
              <input
                type="text"
                value={duration}
                readOnly
                className="w-full bg-surface-bg/50 border border-border-default rounded-lg px-3 py-2 text-xs text-text-muted cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Participants</label>
            <div className="flex flex-wrap gap-1.5 mb-1.5">
              {participants.map((p) => (
                <span
                  key={p}
                  className="inline-flex items-center gap-1 bg-accent/10 text-accent text-[10px] font-medium px-2 py-0.5 rounded-full"
                >
                  {p}
                  <button
                    type="button"
                    onClick={() => handleRemoveParticipant(p)}
                    className="hover:text-accent-hover"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-1">
              <input
                type="text"
                value={participantInput}
                onChange={(e) => setParticipantInput(e.target.value)}
                onKeyDown={handleParticipantKeyDown}
                placeholder="Type name and press Enter or comma"
                className="flex-1 bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary placeholder:text-text-muted"
              />
              <button
                type="button"
                onClick={handleAddParticipant}
                className="bg-accent hover:bg-accent-hover text-white rounded-lg px-2.5 py-2 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Company</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company name"
                className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary placeholder:text-text-muted"
              />
            </div>
            <div>
              <label className={labelClass}>Lead</label>
              <input
                type="text"
                value={lead}
                onChange={(e) => setLead(e.target.value)}
                placeholder="Lead name"
                className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary placeholder:text-text-muted"
              />
            </div>
            <div>
              <label className={labelClass}>Deal</label>
              <input
                type="text"
                value={deal}
                onChange={(e) => setDeal(e.target.value)}
                placeholder="Deal name"
                className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary placeholder:text-text-muted"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as typeof priority)}
                className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary"
              >
                {PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Color</label>
              <div className="flex items-center gap-2">
                {COLOR_SWATCHES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                      color === c
                        ? 'border-accent scale-110'
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Reminder</label>
              <select
                value={reminder}
                onChange={(e) => setReminder(Number(e.target.value))}
                className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary"
              >
                {REMINDERS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Repeat</label>
              <select
                value={repeat}
                onChange={(e) => setRepeat(e.target.value as typeof repeat)}
                className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary"
              >
                {REPEATS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Meeting Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Meeting notes, action items..."
              rows={3}
              className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary placeholder:text-text-muted resize-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-border-default shrink-0">
          <button
            onClick={onClose}
            className="border border-border-default text-text-secondary hover:text-text-primary text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-accent hover:bg-accent-hover text-white text-xs font-semibold px-5 py-2 rounded-lg transition-colors flex items-center gap-1.5"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

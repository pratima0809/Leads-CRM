'use client';

import { useMeetingStore, Meeting } from '@/lib/meetingStore';
import { Calendar, Clock, Building2, Users, FileText, Paperclip, ExternalLink, MapPin, Flag, Tag, Video, Trash2, Download, Edit3, Copy, CheckCircle2, XCircle, RotateCcw, Share2, Printer, ArrowUpRight, Plus, MessageSquare, Link2 } from 'lucide-react';
import React, { useState, useRef } from 'react';

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

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(time: string): string {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
}

function formatDateTime(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function getFileIcon(type: string) {
  if (type.includes('pdf')) return FileText;
  return Paperclip;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function MeetingDetailPanel() {
  const {
    selectedMeetingId, meetings, notes: allNotes,
    updateMeeting, deleteMeeting, completeMeeting, cancelMeeting,
    duplicateMeeting, rescheduleMeeting, addNote, updateNote, deleteNote,
    addAttachment, deleteAttachment, addToast, setSelectedMeetingId,
  } = useMeetingStore();

  const meeting = meetings.find(m => m.id === selectedMeetingId);

  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteContent, setEditingNoteContent] = useState('');
  const [showAddNote, setShowAddNote] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showReschedule, setShowReschedule] = useState(false);
  const [resDate, setResDate] = useState('');
  const [resStartTime, setResStartTime] = useState('');
  const [resEndTime, setResEndTime] = useState('');
  const [resParticipants, setResParticipants] = useState<string[]>([]);
  const [resParticipantInput, setResParticipantInput] = useState('');

  if (!meeting || !selectedMeetingId) return null;

  const meetingNotes = allNotes.filter(n => n.meetingId === meeting.id);

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    addNote(meeting.id, newNote.trim(), 'Current User');
    setNewNote('');
    setShowAddNote(false);
  };

  const handleEditNote = (noteId: string, content: string) => {
    setEditingNoteId(noteId);
    setEditingNoteContent(content);
  };

  const handleSaveEditNote = (noteId: string) => {
    if (!editingNoteContent.trim()) return;
    updateNote(noteId, editingNoteContent.trim());
    setEditingNoteId(null);
    setEditingNoteContent('');
  };

  const handleDeleteNote = (noteId: string) => {
    deleteNote(noteId);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    addAttachment(meeting.id, {
      name: file.name,
      type: file.type || file.name.split('.').pop() || 'unknown',
      size: file.size,
      url: URL.createObjectURL(file),
    });
    e.target.value = '';
  };

  const handleDeleteAttachment = (attachmentId: string) => {
    deleteAttachment(meeting.id, attachmentId);
  };

  const handleExportText = () => {
    const text = [
      `Meeting: ${meeting.title}`,
      `Date: ${formatDate(meeting.startDate)}`,
      `Time: ${formatTime(meeting.startTime)} - ${formatTime(meeting.endTime)}`,
      `Duration: ${meeting.duration}`,
      `Location: ${meeting.location || 'N/A'}`,
      `Company: ${meeting.company || 'N/A'}`,
      `Priority: ${meeting.priority}`,
      `Status: ${meeting.status}`,
      ``,
      `Agenda:`,
      meeting.agenda || 'No agenda',
      ``,
      `Participants:`,
      meeting.participants.join(', ') || 'None',
    ].join('\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${meeting.title.replace(/\s+/g, '_')}_summary.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const text = `Meeting: ${meeting.title}\nDate: ${formatDate(meeting.startDate)}\nTime: ${formatTime(meeting.startTime)} - ${formatTime(meeting.endTime)}\nLink: ${meeting.link || 'No link'}`;
    try {
      await navigator.clipboard.writeText(text);
      addToast('Meeting details copied to clipboard');
    } catch {
      addToast('Failed to copy', 'error');
    }
  };

  const handleCopyLink = async () => {
    if (!meeting.link) { addToast('No meeting link available', 'error'); return; }
    try {
      await navigator.clipboard.writeText(meeting.link);
      addToast('Meeting link copied to clipboard');
    } catch {
      addToast('Failed to copy', 'error');
    }
  };

  const handleOpenReschedule = () => {
    setResDate(meeting.startDate);
    setResStartTime(meeting.startTime);
    setResEndTime(meeting.endTime);
    setResParticipants([...meeting.participants]);
    setResParticipantInput('');
    setShowReschedule(true);
  };

  const handleRescheduleSave = () => {
    const duration = calculateDuration(resStartTime, resEndTime);
    rescheduleMeeting(meeting.id, resDate, resStartTime, resEndTime, duration, resParticipants);
    setShowReschedule(false);
    addToast('Meeting rescheduled');
  };

  const handleAddResParticipant = () => {
    const name = resParticipantInput.trim();
    if (name && !resParticipants.includes(name)) {
      setResParticipants([...resParticipants, name]);
    }
    setResParticipantInput('');
  };

  const handleRemoveResParticipant = (name: string) => {
    setResParticipants(resParticipants.filter(p => p !== name));
  };

  return (
    <div className="h-full flex flex-col gap-4 overflow-y-auto no-scrollbar">
      {/* Meeting Header */}
      <div className="bg-surface-card border border-border-default rounded-[12px] p-4">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-lg font-bold text-text-primary leading-tight">{meeting.title}</h2>
          <button
            onClick={() => setSelectedMeetingId(null)}
            className="p-1 rounded-md hover:bg-surface-bg-alt text-text-secondary"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="flex items-center gap-1 text-[10px] text-text-secondary">
            <Calendar className="w-3 h-3 text-icon" />
            {formatDate(meeting.startDate)}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-text-secondary">
            <Clock className="w-3 h-3 text-icon" />
            {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-text-secondary">
            <Clock className="w-3 h-3 text-icon" />
            {meeting.duration}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
            meeting.type === 'client' ? 'bg-accent/10 text-accent' : 'bg-info/10 text-info'
          }`}>{meeting.type}</span>
          <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
            meeting.priority === 'high' ? 'bg-error/10 text-error' :
            meeting.priority === 'medium' ? 'bg-warning/10 text-warning' :
            'bg-success/10 text-success'
          }`}>{meeting.priority}</span>
          <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
            meeting.status === 'scheduled' ? 'bg-info/10 text-info' :
            meeting.status === 'completed' ? 'bg-success/10 text-success' :
            'bg-error/10 text-error'
          }`}>{meeting.status}</span>
        </div>
      </div>

      {/* Meeting Details */}
      <div className="bg-surface-card border border-border-default rounded-[12px] p-4 space-y-2.5">
        <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Meeting Details</h3>
        {meeting.location && (
          <div className="flex items-center gap-2 text-[10px]">
            <MapPin className="w-3 h-3 text-icon shrink-0" />
            {meeting.link ? (
              <a href={meeting.link} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline flex items-center gap-1">
                {meeting.location}
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            ) : (
              <span className="text-text-secondary">{meeting.location}</span>
            )}
          </div>
        )}
        {meeting.company && (
          <div className="flex items-center gap-2 text-[10px]">
            <Building2 className="w-3 h-3 text-icon shrink-0" />
            <span className="text-text-secondary">{meeting.company}</span>
          </div>
        )}
        {meeting.lead && (
          <div className="flex items-center gap-2 text-[10px]">
            <Flag className="w-3 h-3 text-icon shrink-0" />
            <span className="text-text-secondary">{meeting.lead}</span>
          </div>
        )}
        {meeting.deal && (
          <div className="flex items-center gap-2 text-[10px]">
            <Tag className="w-3 h-3 text-icon shrink-0" />
            <span className="text-text-secondary">{meeting.deal}</span>
          </div>
        )}
        {meeting.participants.length > 0 && (
          <div>
            <span className="text-[10px] font-medium text-text-muted flex items-center gap-1 mb-1.5">
              <Users className="w-3 h-3 text-icon" />
              Participants ({meeting.participants.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {meeting.participants.map((p) => (
                <div key={p} className="flex items-center gap-1.5 bg-surface-bg-alt rounded-full px-2 py-1">
                  <div className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="text-[7px] font-bold text-accent">{p.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="text-[9px] font-medium text-text-secondary">{p}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {meeting.link && (
          <div className="flex items-center gap-2">
            <a
              href={meeting.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-accent/10 text-accent hover:bg-accent/20 text-[10px] font-semibold px-3 py-1.5 rounded-lg transition-colors"
            >
              <Video className="w-3 h-3" />
              Join Meeting
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
            {(meeting.meetingId || meeting.password) && (
              <div className="text-[9px] text-text-muted">
                {meeting.meetingId && <span>ID: {meeting.meetingId}</span>}
                {meeting.password && <span> | Pass: {meeting.password}</span>}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Agenda */}
      <div className="bg-surface-card border border-border-default rounded-[12px] p-4">
        <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1">
          <FileText className="w-3 h-3 text-icon" />
          Agenda
        </h3>
        {meeting.agenda ? (
          <p className="text-[11px] text-text-secondary leading-relaxed whitespace-pre-wrap">{meeting.agenda}</p>
        ) : (
          <p className="text-[10px] text-text-muted italic">No agenda added</p>
        )}
      </div>

      {/* Actions Row */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => { if (meeting.link) window.open(meeting.link, '_blank'); }}
          disabled={!meeting.link}
          title={!meeting.link ? 'No meeting link available' : 'Join meeting'}
          className="flex items-center justify-center gap-1.5 bg-accent/10 text-accent hover:bg-accent/20 disabled:opacity-40 disabled:cursor-not-allowed text-[10px] font-semibold rounded-lg py-2 transition-colors"
        >
          <Video className="w-3.5 h-3.5" /> Join
        </button>
        <button
          onClick={handleOpenReschedule}
          className="flex items-center justify-center gap-1.5 bg-surface-bg-alt text-text-secondary hover:text-text-primary text-[10px] font-semibold rounded-lg py-2 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reschedule
        </button>
        <button
          onClick={() => completeMeeting(meeting.id)}
          disabled={meeting.status === 'completed'}
          className="flex items-center justify-center gap-1.5 bg-success/10 text-success hover:bg-success/20 disabled:opacity-40 disabled:cursor-not-allowed text-[10px] font-semibold rounded-lg py-2 transition-colors"
        >
          <CheckCircle2 className="w-3.5 h-3.5" /> Mark Complete
        </button>
        <button
          onClick={() => cancelMeeting(meeting.id)}
          disabled={meeting.status === 'cancelled'}
          className="flex items-center justify-center gap-1.5 bg-error/10 text-error hover:bg-error/20 disabled:opacity-40 disabled:cursor-not-allowed text-[10px] font-semibold rounded-lg py-2 transition-colors"
        >
          <XCircle className="w-3.5 h-3.5" /> Cancel
        </button>
      </div>

      {/* Notes */}
      <div className="bg-surface-card border border-border-default rounded-[12px] p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
            <MessageSquare className="w-3 h-3 text-icon" />
            Notes ({meetingNotes.length})
          </h3>
          {!showAddNote && (
            <button
              onClick={() => setShowAddNote(true)}
              className="text-[9px] font-semibold text-accent hover:underline flex items-center gap-0.5"
            >
              <Plus className="w-3 h-3" /> Add Note
            </button>
          )}
        </div>
        {showAddNote && (
          <div className="space-y-2">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Write a note..."
              rows={3}
              className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-[11px] outline-none focus:border-accent text-text-primary placeholder:text-text-muted resize-none"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                className="bg-accent hover:bg-accent-hover disabled:opacity-40 text-white text-[9px] font-semibold px-3 py-1.5 rounded-lg transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => { setShowAddNote(false); setNewNote(''); }}
                className="text-[9px] font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {meetingNotes.length === 0 && !showAddNote && (
          <p className="text-[10px] text-text-muted italic">No notes yet</p>
        )}
        {meetingNotes.map((note) => (
          <div key={note.id} className="bg-surface-bg-alt rounded-lg p-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-[8px] font-bold text-accent">{note.author.charAt(0).toUpperCase()}</span>
                </div>
                <span className="text-[10px] font-semibold text-text-primary">{note.author}</span>
                <span className="text-[8px] text-text-muted">{formatDateTime(note.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleEditNote(note.id, note.content)}
                  className="p-1 rounded hover:bg-surface-card text-text-muted hover:text-text-primary transition-colors"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="p-1 rounded hover:bg-surface-card text-text-muted hover:text-error transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
            {editingNoteId === note.id ? (
              <div className="space-y-1.5">
                <textarea
                  value={editingNoteContent}
                  onChange={(e) => setEditingNoteContent(e.target.value)}
                  rows={3}
                  className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-[11px] outline-none focus:border-accent text-text-primary placeholder:text-text-muted resize-none"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSaveEditNote(note.id)}
                    disabled={!editingNoteContent.trim()}
                    className="bg-accent hover:bg-accent-hover disabled:opacity-40 text-white text-[9px] font-semibold px-3 py-1 rounded-lg transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingNoteId(null)}
                    className="text-[9px] font-medium text-text-secondary hover:text-text-primary transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-text-secondary leading-relaxed">{note.content}</p>
            )}
          </div>
        ))}
      </div>

      {/* Attachments */}
      <div className="bg-surface-card border border-border-default rounded-[12px] p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
            <Paperclip className="w-3 h-3 text-icon" />
            Attachments ({meeting.attachments.length})
          </h3>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-[9px] font-semibold text-accent hover:underline flex items-center gap-0.5"
          >
            <Plus className="w-3 h-3" /> Add Attachment
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.xlsx,.pptx,.png,.jpg,.jpeg,.zip"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        {meeting.attachments.length === 0 && (
          <p className="text-[10px] text-text-muted italic">No attachments</p>
        )}
        {meeting.attachments.map((att) => {
          const Icon = getFileIcon(att.type);
          return (
            <div key={att.id} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-surface-bg-alt transition-colors">
              <div className="flex items-center gap-2 min-w-0">
                <Icon className="w-4 h-4 text-icon shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-medium text-text-primary truncate">{att.name}</p>
                  <p className="text-[8px] text-text-muted">{formatFileSize(att.size)}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <a
                  href={att.url}
                  download={att.name}
                  className="p-1 rounded hover:bg-surface-card text-text-muted hover:text-text-primary transition-colors"
                >
                  <Download className="w-3 h-3" />
                </a>
                <button
                  onClick={() => handleDeleteAttachment(att.id)}
                  className="p-1 rounded hover:bg-surface-card text-text-muted hover:text-error transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-surface-card border border-border-default rounded-[12px] p-4 space-y-2">
        <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => duplicateMeeting(meeting.id)}
            className="flex items-center justify-center gap-1.5 bg-surface-bg-alt text-text-secondary hover:text-text-primary text-[10px] font-semibold rounded-lg py-2 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" /> Duplicate
          </button>
          <button
            onClick={handleExportText}
            className="flex items-center justify-center gap-1.5 bg-surface-bg-alt text-text-secondary hover:text-text-primary text-[10px] font-semibold rounded-lg py-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export Text
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-1.5 bg-surface-bg-alt text-text-secondary hover:text-text-primary text-[10px] font-semibold rounded-lg py-2 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-1.5 bg-surface-bg-alt text-text-secondary hover:text-text-primary text-[10px] font-semibold rounded-lg py-2 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-1.5 bg-surface-bg-alt text-text-secondary hover:text-text-primary text-[10px] font-semibold rounded-lg py-2 transition-colors"
          >
            <Link2 className="w-3.5 h-3.5" /> Copy Link
          </button>
        </div>
      </div>

      {/* Reschedule Modal */}
      {showReschedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowReschedule(false)}>
          <div className="bg-surface-card border border-border-default rounded-[14px] w-full max-w-sm shadow-xl p-5 space-y-3" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-bold text-text-primary">Reschedule Meeting</h3>
            <div>
              <label className="text-[10px] font-medium text-text-muted block mb-1">Date</label>
              <input type="date" value={resDate} onChange={(e) => setResDate(e.target.value)} className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-medium text-text-muted block mb-1">Start Time</label>
                <input type="time" value={resStartTime} onChange={(e) => setResStartTime(e.target.value)} className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary" />
              </div>
              <div>
                <label className="text-[10px] font-medium text-text-muted block mb-1">End Time</label>
                <input type="time" value={resEndTime} onChange={(e) => setResEndTime(e.target.value)} className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-medium text-text-muted block mb-1">Duration</label>
              <input type="text" value={calculateDuration(resStartTime, resEndTime)} readOnly className="w-full bg-surface-bg/50 border border-border-default rounded-lg px-3 py-2 text-xs text-text-muted cursor-not-allowed" />
            </div>
            <div>
              <label className="text-[10px] font-medium text-text-muted block mb-1">Participants</label>
              <div className="flex flex-wrap gap-1 mb-1.5">
                {resParticipants.map((p) => (
                  <span key={p} className="inline-flex items-center gap-1 bg-accent/10 text-accent text-[10px] font-medium px-2 py-0.5 rounded-full">
                    {p}
                    <button onClick={() => handleRemoveResParticipant(p)} className="hover:text-accent-hover"><XCircle className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-1">
                <input type="text" value={resParticipantInput} onChange={(e) => setResParticipantInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); handleAddResParticipant(); } }} placeholder="Add participant" className="flex-1 bg-surface-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-text-primary placeholder:text-text-muted" />
                <button onClick={handleAddResParticipant} className="bg-accent hover:bg-accent-hover text-white rounded-lg px-2.5 py-2 transition-colors"><Plus className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-default">
              <button onClick={() => setShowReschedule(false)} className="border border-border-default text-text-secondary hover:text-text-primary text-xs font-semibold px-4 py-2 rounded-lg transition-colors">Cancel</button>
              <button onClick={handleRescheduleSave} className="bg-accent hover:bg-accent-hover text-white text-xs font-semibold px-5 py-2 rounded-lg transition-colors">Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

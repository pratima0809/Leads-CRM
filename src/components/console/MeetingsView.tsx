'use client';

import React, { useState, useMemo } from 'react';
import {
  Calendar, Clock, Plus, Search, Users, Building2, Sparkles,
  ChevronLeft, ChevronRight, AlertTriangle,
  CheckCircle2, X, Filter,
} from 'lucide-react';
import { useMeetingStore } from '@/lib/meetingStore';
import CalendarViews from './meetings/CalendarViews';
import NewMeetingModal from './meetings/NewMeetingModal';

export default function MeetingsView() {
  const {
    meetings, viewMode, selectedDate, selectedMeetingId, searchQuery, filters,
    toasts, calendarMonth, calendarYear,
    setViewMode, setSelectedDate, setSelectedMeetingId, setSearchQuery, setFilter, clearFilters,
    calendarPrevMonth, calendarNextMonth, calendarToday, removeToast,
  } = useMeetingStore();

  const [showNewModal, setShowNewModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filteredMeetings = useMemo(() => {
    let list = [...meetings];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.company.toLowerCase().includes(q) ||
        m.lead.toLowerCase().includes(q) ||
        m.deal.toLowerCase().includes(q) ||
        m.location.toLowerCase().includes(q) ||
        m.participants.some(p => p.toLowerCase().includes(q))
      );
    }
    if (filters.type) {
      list = list.filter(m => m.type === filters.type);
    }
    if (filters.priority) {
      list = list.filter(m => m.priority === filters.priority);
    }
    if (filters.status) {
      if (filters.status === 'upcoming') list = list.filter(m => m.status === 'scheduled');
      else list = list.filter(m => m.status === filters.status);
    }
    return list;
  }, [meetings, searchQuery, filters]);

  const dateMeetings = useMemo(() => {
    if (!selectedDate) return [];
    return filteredMeetings.filter(m => m.startDate === selectedDate);
  }, [filteredMeetings, selectedDate]);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayMeetings = meetings.filter(m => m.startDate === todayStr && m.status === 'scheduled');
  const weekStart = new Date(selectedDate);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const weekMeetings = meetings.filter(m => {
    const d = new Date(m.startDate);
    return d >= weekStart && d <= weekEnd && m.status === 'scheduled';
  });
  const clientCount = meetings.filter(m => m.type === 'client' && m.status === 'scheduled').length;

  const kpiData = [
    { icon: Calendar, label: 'Meetings Today', value: String(todayMeetings.length), color: 'text-accent' },
    { icon: Clock, label: 'Meetings This Week', value: String(weekMeetings.length), color: 'text-info' },
    { icon: Users, label: 'Upcoming Client Meetings', value: String(clientCount), color: 'text-warning' },
  ];

  const filterOptions = [
    { key: 'status', value: 'upcoming', label: 'Upcoming', icon: Clock },
    { key: 'status', value: 'completed', label: 'Completed', icon: CheckCircle2 },
    { key: 'status', value: 'cancelled', label: 'Cancelled', icon: X },
    { key: 'type', value: 'internal', label: 'Internal', icon: Users },
    { key: 'type', value: 'client', label: 'Client', icon: Building2 },
    { key: 'priority', value: 'high', label: 'High Priority', icon: AlertTriangle },
  ];

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-accent" />
            <h1 className="text-lg font-bold text-text-primary">Meetings</h1>
          </div>
          <div className="relative max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-icon" />
            <input
              type="text"
              placeholder="Search by title, company, person, date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56 bg-surface-bg border border-border-default rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none focus:border-accent text-text-primary placeholder:text-text-muted"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`bg-surface-bg border ${activeFilterCount > 0 ? 'border-accent' : 'border-border-default'} text-text-secondary hover:text-text-primary px-2.5 py-1.5 rounded-lg text-[10px] font-semibold flex items-center gap-1.5 transition-colors`}
            >
              <Filter className="w-3.5 h-3.5" />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-accent text-white text-[8px] font-bold flex items-center justify-center">{activeFilterCount}</span>
              )}
            </button>
            {showFilters && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-surface-card border border-border-default rounded-xl p-2 shadow-modal z-20">
                <div className="flex items-center justify-between mb-1.5 px-1">
                  <span className="text-[10px] font-bold text-text-primary">Filters</span>
                  {activeFilterCount > 0 && (
                    <button onClick={clearFilters} className="text-[9px] text-accent hover:underline">Clear</button>
                  )}
                </div>
                {filterOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isActive = filters[opt.key as keyof typeof filters] === opt.value;
                  return (
                    <button
                      key={`${opt.key}-${opt.value}`}
                      onClick={() => setFilter(opt.key, isActive ? '' : opt.value)}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] font-medium transition-colors ${
                        isActive ? 'bg-accent/10 text-accent' : 'text-text-secondary hover:bg-surface-bg'
                      }`}
                    >
                      <Icon className={`w-3 h-3 ${isActive ? 'text-accent' : 'text-icon'}`} />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-surface-bg border border-border-default rounded-lg p-0.5">
            {(['day', 'week', 'month'] as const).map(m => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`text-[10px] font-semibold px-2.5 py-1 rounded-md capitalize transition-colors ${
                  viewMode === m ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary'
                }`}
              >{m}</button>
            ))}
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            className="bg-accent hover:bg-accent-hover text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> New Meeting
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-3 shrink-0">
        {kpiData.map((kpi) => (
          <div key={kpi.label} className="bg-surface-card border border-border-default rounded-[12px] px-4 py-3 hover:shadow-[var(--shadow-card-hov)] transition-shadow">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider">{kpi.label}</span>
              <kpi.icon className={`w-3.5 h-3.5 ${kpi.color}`} />
            </div>
            <div className="text-lg font-bold text-text-primary">{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Main Layout: 70/30 */}
      <div className="flex-1 flex gap-5 overflow-hidden min-h-0">
        {/* Left: Calendar + Meeting List */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          {/* Calendar */}
          <div className="bg-surface-card border border-border-default rounded-[12px] p-4 shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={calendarPrevMonth}
                  className="p-1 rounded-md hover:bg-surface-bg-alt text-text-secondary"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-bold text-text-primary">
                  {new Date(calendarYear, calendarMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
                <button
                  onClick={calendarNextMonth}
                  className="p-1 rounded-md hover:bg-surface-bg-alt text-text-secondary"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={calendarToday}
                className="text-[10px] font-medium text-accent hover:underline"
              >
                Today
              </button>
            </div>
            <CalendarViews />
          </div>

          {/* Meeting List */}
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
            {dateMeetings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-text-muted">
                <Calendar className="w-10 h-10 mb-2 opacity-30" />
                <p className="text-xs font-medium">No meetings on this day</p>
                <button
                  onClick={() => setShowNewModal(true)}
                  className="mt-2 text-[10px] text-accent hover:underline font-semibold"
                >
                  Schedule a meeting
                </button>
              </div>
            ) : (
              dateMeetings.map((meeting) => {
                const isSelected = selectedMeetingId === meeting.id;
                return (
                  <button
                    key={meeting.id}
                    onClick={() => setSelectedMeetingId(meeting.id)}
                    className={`w-full text-left border rounded-[10px] p-3.5 transition-all hover:shadow-[var(--shadow-card-hov)] ${
                      isSelected
                        ? 'border-accent bg-accent/5'
                        : meeting.type === 'client'
                          ? 'border-border-default bg-surface-card'
                          : 'border-border-default/60 bg-surface-bg-alt/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-0.5 h-12 rounded-full shrink-0 ${
                        meeting.type === 'client' ? 'bg-accent' :
                        meeting.type === 'internal' ? 'bg-info' : 'bg-warning'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-1.5">
                              {meeting.meetingType === 'google_meet' && (
                                <svg viewBox="0 0 24 24" width="14" height="14" className="shrink-0"><path fill="#4285F4" d="M15 10.5V8.25c0-.83-.67-1.5-1.5-1.5h-9C3.67 6.75 3 7.42 3 8.25v7.5c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5V13.5l4.5 3.75V6.75L15 10.5z"/></svg>
                              )}
                              {meeting.meetingType === 'teams' && (
                                <svg viewBox="0 0 24 24" width="14" height="14" className="shrink-0"><path fill="#6264A7" d="M22.5 8.5c0-1.38-1.12-2.5-2.5-2.5s-2.5 1.12-2.5 2.5c0 .93.51 1.74 1.27 2.18l-.02.07c-.24 1.17-1.29 2.07-2.55 2.16.5.52.8 1.22.8 2 0 .35-.06.68-.17.99-.28.86-.92 1.56-1.73 2 .28.3.64.5 1.05.5h4c.83 0 1.5-.67 1.5-1.5v-3.37c0-.45-.2-.87-.54-1.15.72-.46 1.2-1.26 1.2-2.18l-.01-.1a2.5 2.5 0 0 0 .6-1.1zM17.5 6c-1.38 0-2.5-1.12-2.5-2.5S16.12 1 17.5 1 20 2.12 20 3.5 18.88 6 17.5 6zm-1.3 1.86A1.5 1.5 0 0 0 13 9.26c0 .68.45 1.25 1.08 1.43-.1.35-.16.72-.16 1.1 0 .34.05.67.13.99-.25.37-.39.82-.39 1.31 0 .36.08.7.23 1 .07.14.15.27.24.39.25.32.56.58.9.76.33.18.71.29 1.1.31-.06.24-.09.5-.09.76 0 .59.16 1.14.43 1.61a2 2 0 0 0 .3.39H9.5a2.5 2.5 0 0 1-2.5-2.5V11A3.5 3.5 0 0 1 10.5 7.5h5.7Z"/><path fill="#6264A7" d="M15.5 11.5A1.5 1.5 0 0 0 14 13c0 .65.41 1.2 1 1.41V16h1v-1.59c.59-.21 1-.76 1-1.41a1.5 1.5 0 0 0-1.5-1.5Z"/><circle fill="#6264A7" cx="15.5" cy="13" r=".5"/></svg>
                              )}
                              {meeting.meetingType === 'zoom' && (
                                <svg viewBox="0 0 24 24" width="14" height="14" className="shrink-0"><circle fill="#2D8CFF" cx="12" cy="12" r="10"/><path fill="#FFF" d="M17 12.5a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5V9h-2v5h7v-1.5zM7 9h2v6H7V9z"/></svg>
                              )}
                              <p className="text-xs font-bold text-text-primary">{meeting.title}</p>
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              {meeting.company && (
                                <span className="text-[10px] text-text-secondary flex items-center gap-1">
                                  <Building2 className="w-3 h-3 text-icon" />
                                  {meeting.company}
                                </span>
                              )}
                              {meeting.participants.length > 0 && (
                                <span className="text-[10px] text-text-secondary flex items-center gap-1">
                                  <Users className="w-3 h-3 text-icon" />
                                  {meeting.participants[0]}
                                  {meeting.participants.length > 1 && ` +${meeting.participants.length - 1}`}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-text-primary shrink-0">{meeting.startTime}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5 text-[9px] text-text-muted">
                          <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{meeting.duration}</span>
                          <span className={`px-1.5 py-0.5 rounded font-medium ${
                            meeting.type === 'client' ? 'bg-accent/10 text-accent' :
                            meeting.type === 'internal' ? 'bg-info/10 text-info' : 'bg-warning/10 text-warning'
                          }`}>{meeting.type}</span>
                          {meeting.status !== 'scheduled' && (
                            <span className={`px-1.5 py-0.5 rounded font-medium ${
                              meeting.status === 'completed' ? 'bg-success/10 text-success' :
                              meeting.status === 'cancelled' ? 'bg-error/10 text-error' :
                              'bg-warning/10 text-warning'
                            }`}>{meeting.status}</span>
                          )}
                          {meeting.priority === 'high' && (
                            <span className="flex items-center gap-0.5 text-error">
                              <AlertTriangle className="w-2.5 h-2.5" />High
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* New Meeting Modal */}
      {showNewModal && (
        <NewMeetingModal onClose={() => setShowNewModal(false)} />
      )}

      {/* Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-modal text-xs font-semibold animate-fadeIn ${
              toast.type === 'success' ? 'bg-success text-white' :
              toast.type === 'error' ? 'bg-error text-white' :
              'bg-accent text-white'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
            {toast.type === 'error' && <AlertTriangle className="w-4 h-4 shrink-0" />}
            {toast.type === 'info' && <Sparkles className="w-4 h-4 shrink-0" />}
            <span>{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="opacity-70 hover:opacity-100 ml-2">&times;</button>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

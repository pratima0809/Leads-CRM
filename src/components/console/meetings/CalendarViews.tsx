'use client';

import React, { useMemo } from 'react';
import { useMeetingStore, Meeting, ViewMode } from '@/lib/meetingStore';
import {
  ChevronLeft, ChevronRight, Clock, Users, Building2, Video, MoreHorizontal,
} from 'lucide-react';
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, addMonths, subMonths, isSameMonth, isSameDay,
  isToday, parseISO, getHours, getMinutes, addDays, subWeeks, addWeeks,
} from 'date-fns';

function parseDurationToMinutes(duration: string): number {
  const parts = duration.split(' ');
  if (parts.length < 2) return 60;
  const val = parseFloat(parts[0]);
  const unit = parts[1];
  if (unit.startsWith('hr')) return val * 60;
  if (unit.startsWith('min')) return val;
  return 60;
}

function getTimeValue(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h + m / 60;
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 17 }, (_, i) => i + 6);

export default function CalendarViews() {
  const {
    viewMode, selectedDate, calendarMonth, calendarYear, meetings,
    setSelectedDate, setSelectedMeetingId, calendarPrevMonth,
    calendarNextMonth, calendarToday, setViewMode, rescheduleMeeting,
    addMeeting,
  } = useMeetingStore();

  const selectedDateObj = parseISO(selectedDate);
  const monthDate = new Date(calendarYear, calendarMonth - 1, 1);

  const monthMeetings = useMemo(() =>
    meetings.filter(m => {
      const d = parseISO(m.startDate);
      return d.getFullYear() === calendarYear && d.getMonth() + 1 === calendarMonth;
    }),
    [meetings, calendarMonth, calendarYear],
  );

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(monthDate));
    const end = endOfWeek(endOfMonth(monthDate));
    const days = eachDayOfInterval({ start, end });
    const weeks: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
    return weeks;
  }, [calendarMonth, calendarYear]);

  const weekDays = useMemo(() => {
    const start = startOfWeek(selectedDateObj);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [selectedDate]);

  const getMeetingsForDate = (date: Date) =>
    monthMeetings.filter(m => isSameDay(parseISO(m.startDate), date));

  const getMeetingsForDateAll = (date: Date) =>
    meetings.filter(m => isSameDay(parseISO(m.startDate), date));

  const handleDragStart = (e: React.DragEvent, meetingId: string) => {
    e.dataTransfer.setData('text/plain', meetingId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDropOnDay = (e: React.DragEvent, date: Date) => {
    e.preventDefault();
    const meetingId = e.dataTransfer.getData('text/plain');
    if (!meetingId) return;
    const meeting = meetings.find(m => m.id === meetingId);
    if (!meeting) return;
    const newDate = format(date, 'yyyy-MM-dd');
    rescheduleMeeting(meetingId, newDate, meeting.startTime, meeting.endTime, meeting.duration, meeting.participants);
  };

  const handleDropOnHour = (e: React.DragEvent, date: Date, hour: number) => {
    e.preventDefault();
    const meetingId = e.dataTransfer.getData('text/plain');
    if (!meetingId) return;
    const meeting = meetings.find(m => m.id === meetingId);
    if (!meeting) return;
    const newStartTime = `${hour.toString().padStart(2, '0')}:00`;
    const durMinutes = parseDurationToMinutes(meeting.duration);
    const endH = hour + Math.floor(durMinutes / 60);
    const endM = durMinutes % 60;
    const newEndTime = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;
    const newDate = format(date, 'yyyy-MM-dd');
    rescheduleMeeting(meetingId, newDate, newStartTime, newEndTime, meeting.duration, meeting.participants);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDayDoubleClick = (date: Date, hour?: number) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const timeStr = hour !== undefined ? `${hour.toString().padStart(2, '0')}:00` : '09:00';
    const endHour = hour !== undefined ? hour + 1 : 10;
    addMeeting({
      title: 'New Meeting',
      description: '',
      location: '',
      type: 'internal',
      meetingType: 'in_person',
      startDate: dateStr,
      startTime: timeStr,
      endTime: `${endHour.toString().padStart(2, '0')}:00`,
      duration: '1 hr',
      participants: [],
      company: '',
      lead: '',
      deal: '',
      priority: 'medium',
      color: '#2563EB',
      reminder: 15,
      timezone: 'UTC',
      repeat: 'none',
      agenda: '',
      notes: '',
      attachments: [],
      status: 'scheduled',
      outcome: '',
      link: '',
      meetingId: '',
      password: '',
      hostUrl: '',
      recording: '',
      isRecurring: false,
      recurringParentId: null,
    });
  };

  const currentTimeValue = new Date().getHours() + new Date().getMinutes() / 60;
  const timeIndicatorTop = Math.max(0, (currentTimeValue - 6) * 48);

  return (
    <div className="bg-surface-card border border-border-default rounded-[12px] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
        <div className="flex items-center gap-2">
          <button
            onClick={calendarPrevMonth}
            className="p-1.5 rounded-md hover:bg-surface-bg-alt text-text-secondary hover:text-text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold text-text-primary min-w-[120px] text-center">
            {format(monthDate, 'MMMM yyyy')}
          </span>
          <button
            onClick={calendarNextMonth}
            className="p-1.5 rounded-md hover:bg-surface-bg-alt text-text-secondary hover:text-text-primary transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={calendarToday}
            className="ml-2 text-[10px] font-semibold text-accent hover:text-accent-hover px-2.5 py-1 rounded-md border border-accent/30 hover:border-accent transition-colors"
          >
            Today
          </button>
        </div>
        <div className="flex items-center bg-surface-bg border border-border-default rounded-lg p-0.5">
          {(['day', 'week', 'month'] as const).map(m => (
            <button
              key={m}
              onClick={() => setViewMode(m)}
              className={`text-[10px] font-semibold px-2.5 py-1 rounded-md capitalize transition-colors ${
                viewMode === m ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {viewMode === 'month' && (
        <MonthView
          weeks={calendarDays}
          monthDate={monthDate}
          selectedDateObj={selectedDateObj}
          getMeetingsForDate={getMeetingsForDate}
          handleDragStart={handleDragStart}
          handleDropOnDay={handleDropOnDay}
          handleDragOver={handleDragOver}
          handleDayClick={(d) => setSelectedDate(format(d, 'yyyy-MM-dd'))}
          handleMeetingClick={setSelectedMeetingId}
        />
      )}

      {viewMode === 'week' && (
        <WeekView
          weekDays={weekDays}
          selectedDateObj={selectedDateObj}
          getMeetingsForDate={getMeetingsForDateAll}
          handleDragStart={handleDragStart}
          handleDropOnDay={handleDropOnDay}
          handleDragOver={handleDragOver}
          handleDayClick={(d) => setSelectedDate(format(d, 'yyyy-MM-dd'))}
          handleMeetingClick={setSelectedMeetingId}
        />
      )}

      {viewMode === 'day' && (
        <DayView
          date={selectedDateObj}
          meetings={getMeetingsForDateAll(selectedDateObj)}
          handleDragStart={handleDragStart}
          handleDropOnHour={handleDropOnHour}
          handleDragOver={handleDragOver}
          handleMeetingClick={setSelectedMeetingId}
          handleDayDoubleClick={handleDayDoubleClick}
          timeIndicatorTop={timeIndicatorTop}
        />
      )}
    </div>
  );
}

function MonthView({
  weeks, monthDate, selectedDateObj, getMeetingsForDate,
  handleDragStart, handleDropOnDay, handleDragOver,
  handleDayClick, handleMeetingClick,
}: {
  weeks: Date[][];
  monthDate: Date;
  selectedDateObj: Date;
  getMeetingsForDate: (d: Date) => Meeting[];
  handleDragStart: (e: React.DragEvent, id: string) => void;
  handleDropOnDay: (e: React.DragEvent, d: Date) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDayClick: (d: Date) => void;
  handleMeetingClick: (id: string) => void;
}) {
  const today = new Date();
  return (
    <div className="p-3 select-none">
      <div className="grid grid-cols-7 gap-px">
        {DAY_NAMES.map(d => (
          <div key={d} className="text-[9px] font-bold text-text-muted uppercase text-center py-1.5">
            {d}
          </div>
        ))}
        {weeks.map((week, wi) =>
          week.map((day) => {
            const isCurrentMonth = isSameMonth(day, monthDate);
            const isTodayDate = isSameDay(day, today);
            const isSelected = isSameDay(day, selectedDateObj);
            const dayMeetings = getMeetingsForDate(day);
            const visibleMeetings = dayMeetings.slice(0, 2);
            const extraCount = dayMeetings.length - 2;
            const isWeekend = day.getDay() === 0 || day.getDay() === 6;

            return (
              <div
                key={day.toISOString()}
                onClick={() => handleDayClick(day)}
                onDrop={(e) => handleDropOnDay(e, day)}
                onDragOver={handleDragOver}
                className={`min-h-[72px] p-1 border-b border-border-default/30 cursor-pointer relative transition-colors ${
                  !isCurrentMonth
                    ? 'bg-surface-bg/40'
                    : isWeekend
                      ? 'bg-surface-bg-alt/20'
                      : 'bg-surface-card'
                } ${isSelected ? 'ring-2 ring-accent ring-inset bg-accent/5' : ''} hover:bg-surface-bg-alt/40`}
              >
                <div className="flex items-center justify-center mb-0.5">
                  <span className={`text-[10px] font-semibold w-5 h-5 flex items-center justify-center ${
                    isTodayDate
                      ? 'bg-accent text-white rounded-full'
                      : isCurrentMonth
                        ? 'text-text-primary'
                        : 'text-text-muted'
                  }`}>
                    {day.getDate()}
                  </span>
                </div>
                <div className="space-y-0.5">
                  {visibleMeetings.map(m => (
                    <div
                      key={m.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, m.id)}
                      onClick={(e) => { e.stopPropagation(); handleMeetingClick(m.id); }}
                      className="flex items-center gap-1 px-1 py-0.5 rounded-sm cursor-pointer hover:opacity-80 transition-opacity truncate"
                      style={{ backgroundColor: m.color + '18' }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: m.color }} />
                      <span className="text-[8px] font-medium text-text-secondary truncate leading-tight">
                        {m.startTime}
                      </span>
                    </div>
                  ))}
                  {extraCount > 0 && (
                    <div className="flex items-center gap-0.5 px-1">
                      <MoreHorizontal className="w-2.5 h-2.5 text-text-muted" />
                      <span className="text-[7px] text-text-muted font-medium">+{extraCount}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function WeekView({
  weekDays, selectedDateObj, getMeetingsForDate,
  handleDragStart, handleDropOnDay, handleDragOver,
  handleDayClick, handleMeetingClick,
}: {
  weekDays: Date[];
  selectedDateObj: Date;
  getMeetingsForDate: (d: Date) => Meeting[];
  handleDragStart: (e: React.DragEvent, id: string) => void;
  handleDropOnDay: (e: React.DragEvent, d: Date) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDayClick: (d: Date) => void;
  handleMeetingClick: (id: string) => void;
}) {
  const today = new Date();
  return (
    <div className="grid grid-cols-7 gap-px bg-border-default/30 select-none">
      {weekDays.map((day) => {
        const isTodayDate = isSameDay(day, today);
        const isSelected = isSameDay(day, selectedDateObj);
        const dayMeetings = getMeetingsForDate(day);

        return (
          <div
            key={day.toISOString()}
            onClick={() => handleDayClick(day)}
            onDrop={(e) => handleDropOnDay(e, day)}
            onDragOver={handleDragOver}
            className={`min-h-[420px] bg-surface-card border-r border-border-default/30 last:border-r-0 transition-colors ${
              isSelected ? 'ring-2 ring-accent ring-inset bg-accent/[0.04]' : ''
            } ${isTodayDate ? 'bg-accent/[0.03]' : ''}`}
          >
            <div className={`text-center py-2.5 border-b border-border-default/30 ${
              isTodayDate ? 'bg-accent/10' : ''
            }`}>
              <div className="text-[9px] font-bold text-text-muted uppercase tracking-wider">
                {format(day, 'EEE')}
              </div>
              <div className={`text-base font-bold mt-0.5 leading-none ${
                isTodayDate ? 'text-accent' : 'text-text-primary'
              }`}>
                {day.getDate()}
              </div>
            </div>
            <div className="p-1.5 space-y-1 overflow-y-auto max-h-[380px] no-scrollbar">
              {dayMeetings.length === 0 && (
                <p className="text-[9px] text-text-muted text-center py-6">No meetings</p>
              )}
              {dayMeetings.map(m => (
                <div
                  key={m.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, m.id)}
                  onClick={(e) => { e.stopPropagation(); handleMeetingClick(m.id); }}
                  className="border-l-[3px] rounded-r-md px-2 py-1.5 cursor-pointer hover:shadow-sm transition-shadow"
                  style={{ borderLeftColor: m.color, backgroundColor: m.color + '0d' }}
                >
                  <p className="text-[10px] font-bold text-text-primary truncate leading-tight">{m.title}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Clock className="w-2.5 h-2.5 text-icon shrink-0" />
                    <span className="text-[8px] text-text-secondary font-medium">{formatTimeDisplay(m.startTime)}</span>
                  </div>
                  {m.company && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <Building2 className="w-2.5 h-2.5 text-icon shrink-0" />
                      <span className="text-[8px] text-text-secondary truncate">{m.company}</span>
                    </div>
                  )}
                  {m.participants.length > 0 && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <Users className="w-2.5 h-2.5 text-icon shrink-0" />
                      <span className="text-[8px] text-text-secondary">{m.participants.length}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function formatTimeDisplay(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
}

function DayView({
  date, meetings, handleDragStart, handleDropOnHour, handleDragOver,
  handleMeetingClick, handleDayDoubleClick, timeIndicatorTop,
}: {
  date: Date;
  meetings: Meeting[];
  handleDragStart: (e: React.DragEvent, id: string) => void;
  handleDropOnHour: (e: React.DragEvent, d: Date, h: number) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleMeetingClick: (id: string) => void;
  handleDayDoubleClick: (d: Date, h?: number) => void;
  timeIndicatorTop: number;
}) {
  const today = new Date();
  const isTodayDate = isSameDay(date, today);
  const nowMinutes = today.getHours() * 60 + today.getMinutes();

  return (
    <div className="flex overflow-auto max-h-[600px] select-none">
      <div className="w-14 shrink-0 border-r border-border-default/30">
        {HOURS.map(h => (
          <div key={h} className="h-12 flex items-start justify-end pr-2 pt-0">
            <span className="text-[9px] font-medium text-text-muted -mt-2">
              {h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`}
            </span>
          </div>
        ))}
      </div>
      <div className="flex-1 relative">
        <div className={`text-center py-2 border-b border-border-default/30 sticky top-0 bg-surface-card z-10 ${
          isTodayDate ? 'bg-accent/10' : ''
        }`}>
          <div className="text-[9px] font-bold text-text-muted uppercase tracking-wider">
            {format(date, 'EEE')}
          </div>
          <div className={`text-base font-bold leading-none mt-0.5 ${
            isTodayDate ? 'text-accent' : 'text-text-primary'
          }`}>
            {date.getDate()}
          </div>
        </div>
        <div className="relative">
          {HOURS.map(h => (
            <div
              key={h}
              className="h-12 border-t border-border-default/20 relative group"
              onDoubleClick={() => handleDayDoubleClick(date, h)}
              onDrop={(e) => handleDropOnHour(e, date, h)}
              onDragOver={handleDragOver}
            >
              <div className="absolute inset-0 hover:bg-accent/[0.03] transition-colors cursor-pointer" />
              <div className="absolute left-0 right-0 top-0 h-px bg-border-default/10" />
              {(h >= 6 && h < 18) && (
                <div className="absolute left-0 right-0 top-[24px] h-px bg-border-default/5" />
              )}
            </div>
          ))}
          {isTodayDate && timeIndicatorTop >= 0 && (
            <div
              className="absolute left-0 right-0 z-20 pointer-events-none"
              style={{ top: timeIndicatorTop }}
            >
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-red-500 ml-[-4px]" />
                <div className="flex-1 h-px bg-red-500" />
              </div>
            </div>
          )}
          {meetings.map(m => {
            const startValue = getTimeValue(m.startTime);
            const durMinutes = parseDurationToMinutes(m.duration);
            const top = (startValue - 6) * 48;
            const height = Math.max(24, (durMinutes / 60) * 48);
            const [sh, sm] = m.startTime.split(':').map(Number);
            const meetingStartMinutes = sh * 60 + sm;
            const meetingEndMinutes = meetingStartMinutes + durMinutes;

            return (
              <div
                key={m.id}
                draggable
                onDragStart={(e) => handleDragStart(e, m.id)}
                onClick={() => handleMeetingClick(m.id)}
                className="absolute left-1 right-1 rounded-md px-2 py-1 cursor-pointer hover:shadow-md transition-shadow z-10 overflow-hidden border-l-[3px]"
                style={{
                  top,
                  height,
                  borderLeftColor: m.color,
                  backgroundColor: m.color + '14',
                  minHeight: 24,
                }}
              >
                <p className="text-[10px] font-bold text-text-primary truncate leading-tight">{m.title}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Clock className="w-2.5 h-2.5 text-icon shrink-0" />
                  <span className="text-[8px] text-text-secondary font-medium">
                    {formatTimeDisplay(m.startTime)} - {formatTimeDisplay(m.endTime)}
                  </span>
                </div>
                {height > 40 && m.company && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Building2 className="w-2.5 h-2.5 text-icon shrink-0" />
                    <span className="text-[8px] text-text-secondary truncate">{m.company}</span>
                  </div>
                )}
              </div>
            );
          })}
          {meetings.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-[10px] text-text-muted font-medium">No meetings scheduled for this day</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

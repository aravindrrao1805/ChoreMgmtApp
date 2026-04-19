import {
  addDays, addWeeks, addMonths, getDay, setDate,
  isAfter, isBefore, parseISO,
} from 'date-fns';
import type { Member, EnrichedChore, CalendarEvent } from '../types';
import { getMemberColor } from './colors';

function parseDate(str: string): Date {
  return parseISO(str + (str.length === 10 ? 'T00:00:00' : ''));
}

function inRange(d: Date, start: Date, end: Date): boolean {
  return !isBefore(d, start) && !isAfter(d, end);
}

function makeEvent(chore: EnrichedChore, date: Date, members: Member[]): CalendarEvent {
  const start = new Date(date);
  const end = new Date(date);

  if (chore.startTime) {
    const [sh, sm] = chore.startTime.split(':').map(Number);
    start.setHours(sh, sm, 0, 0);
    if (chore.endTime) {
      const [eh, em] = chore.endTime.split(':').map(Number);
      end.setHours(eh, em, 0, 0);
    } else {
      end.setHours(sh + 1 < 24 ? sh + 1 : 23, sm, 0, 0);
    }
  } else {
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  }

  return {
    title: chore.title,
    start,
    end,
    allDay: !chore.startTime,
    resource: {
      choreId: chore.id,
      chore,
      color: getMemberColor(chore.assigneeId, members),
    },
  };
}

export function expandChore(
  chore: EnrichedChore,
  rangeStart: Date,
  rangeEnd: Date,
  members: Member[]
): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const choreStart = parseDate(chore.startDate);
  const choreEnd = chore.endDate ? parseDate(chore.endDate) : null;

  const effectiveEnd = choreEnd && isBefore(choreEnd, rangeEnd) ? choreEnd : rangeEnd;

  const { type } = chore.recurrence;

  if (type === 'none') {
    if (inRange(choreStart, rangeStart, rangeEnd)) {
      events.push(makeEvent(chore, choreStart, members));
    }
    return events;
  }

  if (type === 'weekly') {
    const days = new Set(chore.recurrence.days);
    let d = isBefore(choreStart, rangeStart) ? new Date(rangeStart) : new Date(choreStart);
    d.setHours(0, 0, 0, 0);
    while (!isAfter(d, effectiveEnd)) {
      if (days.has(getDay(d))) {
        events.push(makeEvent(chore, d, members));
      }
      d = addDays(d, 1);
    }
    return events;
  }

  if (type === 'monthly') {
    const dom = chore.recurrence.dayOfMonth;
    let base = new Date(isBefore(choreStart, rangeStart) ? rangeStart : choreStart);
    base = setDate(base, 1);
    base.setHours(0, 0, 0, 0);
    while (!isAfter(base, effectiveEnd)) {
      const occurrence = setDate(new Date(base), dom);
      occurrence.setHours(0, 0, 0, 0);
      if (inRange(occurrence, rangeStart, effectiveEnd) && !isBefore(occurrence, choreStart)) {
        events.push(makeEvent(chore, occurrence, members));
      }
      base = addMonths(base, 1);
    }
    return events;
  }

  if (type === 'custom') {
    const { interval, unit } = chore.recurrence;
    let d = new Date(choreStart);
    d.setHours(0, 0, 0, 0);
    while (!isAfter(d, effectiveEnd)) {
      if (inRange(d, rangeStart, effectiveEnd)) {
        events.push(makeEvent(chore, d, members));
      }
      d = unit === 'months' ? addMonths(d, interval) : addWeeks(d, interval);
    }
    return events;
  }

  return events;
}

export function expandAll(
  chores: EnrichedChore[],
  rangeStart: Date,
  rangeEnd: Date,
  members: Member[]
): CalendarEvent[] {
  return chores.flatMap((c) => expandChore(c, rangeStart, rangeEnd, members));
}

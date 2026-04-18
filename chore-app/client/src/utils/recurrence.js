import {
  addDays, addWeeks, addMonths, getDay, setDate,
  isAfter, isBefore, isEqual, parseISO,
} from 'date-fns';
import { getMemberColor } from './colors';

function parseDate(str) {
  // Parse YYYY-MM-DD in local time to avoid UTC offset shifting
  return parseISO(str + (str.length === 10 ? 'T00:00:00' : ''));
}

function inRange(d, start, end) {
  return !isBefore(d, start) && !isAfter(d, end);
}

function makeEvent(chore, date, members) {
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

export function expandChore(chore, rangeStart, rangeEnd, members) {
  const events = [];
  const choreStart = parseDate(chore.startDate);
  const choreEnd = chore.endDate ? parseDate(chore.endDate) : null;

  const effectiveEnd = choreEnd && isBefore(choreEnd, rangeEnd) ? choreEnd : rangeEnd;

  const { type } = chore.recurrence || {};

  if (!type || type === 'none') {
    if (inRange(choreStart, rangeStart, rangeEnd)) {
      events.push(makeEvent(chore, choreStart, members));
    }
    return events;
  }

  if (type === 'weekly') {
    const days = new Set(chore.recurrence.days || []);
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
    const dom = chore.recurrence.dayOfMonth || 1;
    // Start from the month of choreStart (or rangeStart if later)
    let base = new Date(isBefore(choreStart, rangeStart) ? rangeStart : choreStart);
    base = setDate(base, 1); // first of that month
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
    const { interval = 1, unit = 'weeks' } = chore.recurrence;
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

export function expandAll(chores, rangeStart, rangeEnd, members) {
  return chores.flatMap((c) => expandChore(c, rangeStart, rangeEnd, members));
}

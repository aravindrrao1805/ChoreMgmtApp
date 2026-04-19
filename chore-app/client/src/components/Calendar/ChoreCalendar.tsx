import { useMemo, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import type { SlotInfo, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addMonths, subMonths } from 'date-fns';
import { enUS } from 'date-fns/locale';
import type { Chore, Member, CalendarEvent, EnrichedChore } from '../../types';
import { expandAll } from '../../utils/recurrence';
import ChoreEventChip from './ChoreEventChip';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales: { 'en-US': enUS },
});

interface ChoreCalendarProps {
  chores: Chore[];
  members: Member[];
  onSelectSlot: (slotInfo: SlotInfo) => void;
  onSelectEvent: (event: CalendarEvent) => void;
}

export default function ChoreCalendar({ chores, members, onSelectSlot, onSelectEvent }: ChoreCalendarProps) {
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());

  const enriched = useMemo<EnrichedChore[]>(() =>
    chores.map((c) => ({
      ...c,
      assigneeName: c.assigneeId
        ? (members.find((m) => m.id === c.assigneeId)?.name ?? null)
        : null,
    })),
    [chores, members]
  );

  const rangeStart = subMonths(date, 3);
  const rangeEnd = addMonths(date, 3);

  const events = useMemo(
    () => expandAll(enriched, rangeStart, rangeEnd, members),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [enriched, members, date]
  );

  function eventPropGetter(event: CalendarEvent): { style: React.CSSProperties } {
    return {
      style: {
        backgroundColor: event.resource.color,
        border: 'none',
        borderRadius: 4,
        padding: 0,
      },
    };
  }

  return (
    <Calendar<CalendarEvent>
      localizer={localizer}
      events={events}
      view={view}
      date={date}
      onView={setView}
      onNavigate={setDate}
      selectable
      onSelectSlot={onSelectSlot}
      onSelectEvent={onSelectEvent}
      eventPropGetter={eventPropGetter}
      components={{ event: ChoreEventChip }}
      style={{ height: '100%' }}
    />
  );
}

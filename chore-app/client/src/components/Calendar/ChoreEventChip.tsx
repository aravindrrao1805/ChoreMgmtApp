import type { EventProps } from 'react-big-calendar';
import type { CalendarEvent } from '../../types';

export default function ChoreEventChip({ event }: EventProps<CalendarEvent>) {
  const { chore, color } = event.resource;
  return (
    <div
      style={{
        backgroundColor: color,
        borderRadius: 4,
        padding: '1px 6px',
        color: '#fff',
        fontSize: 12,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        height: '100%',
        fontWeight: 500,
      }}
      title={event.title}
    >
      {chore.assigneeName && (
        <span style={{ opacity: 0.85, marginRight: 4 }}>{chore.assigneeName}:</span>
      )}
      {event.title}
    </div>
  );
}

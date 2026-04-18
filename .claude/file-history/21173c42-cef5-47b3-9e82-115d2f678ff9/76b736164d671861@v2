export default function ChoreEventChip({ event }) {
  const { chore, color } = event.resource;
  return (
    <div
      style={{
        backgroundColor: color,
        borderRadius: 4,
        padding: '1px 5px',
        color: '#fff',
        fontSize: 12,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        height: '100%',
      }}
      title={event.title}
    >
      {chore.assigneeName ? (
        <span style={{ opacity: 0.85, marginRight: 4 }}>{chore.assigneeName}:</span>
      ) : null}
      {event.title}
    </div>
  );
}

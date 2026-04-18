const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function RecurrenceFields({ recurrence, onChange }) {
  const { type } = recurrence;

  if (type === 'none') return null;

  if (type === 'weekly') {
    const days = recurrence.days || [];
    function toggleDay(d) {
      const next = days.includes(d) ? days.filter((x) => x !== d) : [...days, d].sort();
      onChange({ ...recurrence, days: next });
    }
    return (
      <div className="field">
        <label>Repeat on</label>
        <div className="day-checkboxes">
          {DAY_LABELS.map((label, i) => (
            <label key={i} className="day-check">
              <input
                type="checkbox"
                checked={days.includes(i)}
                onChange={() => toggleDay(i)}
              />
              {label}
            </label>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'monthly') {
    return (
      <div className="field">
        <label>Day of month</label>
        <input
          type="number"
          min={1}
          max={28}
          value={recurrence.dayOfMonth || 1}
          onChange={(e) => onChange({ ...recurrence, dayOfMonth: Number(e.target.value) })}
        />
      </div>
    );
  }

  if (type === 'custom') {
    return (
      <div className="field-row">
        <div className="field">
          <label>Every</label>
          <input
            type="number"
            min={1}
            max={52}
            value={recurrence.interval || 1}
            onChange={(e) => onChange({ ...recurrence, interval: Number(e.target.value) })}
          />
        </div>
        <div className="field">
          <label>Unit</label>
          <select
            value={recurrence.unit || 'weeks'}
            onChange={(e) => onChange({ ...recurrence, unit: e.target.value })}
          >
            <option value="weeks">Weeks</option>
            <option value="months">Months</option>
          </select>
        </div>
      </div>
    );
  }

  return null;
}

import { useState } from 'react';
import { getDay, parseISO } from 'date-fns';
import RecurrenceFields from './RecurrenceFields';

function defaultEndTime(startTime) {
  if (!startTime) return '';
  const [h, m] = startTime.split(':').map(Number);
  const endH = h + 1;
  return `${String(endH < 24 ? endH : 23).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function defaultState(chore, prefillDate, prefillTime) {
  if (chore) {
    return {
      title: chore.title,
      assigneeId: chore.assigneeId || '',
      startDate: chore.startDate,
      startTime: chore.startTime || '',
      endTime: chore.endTime || '',
      endDate: chore.endDate || '',
      recurrence: chore.recurrence || { type: 'none' },
    };
  }
  return {
    title: '',
    assigneeId: '',
    startDate: prefillDate || '',
    startTime: prefillTime || '',
    endTime: defaultEndTime(prefillTime),
    endDate: '',
    recurrence: { type: 'none' },
  };
}

export default function ChoreForm({ chore, prefillDate, prefillTime, members, onSubmit, onDelete, onClose }) {
  const [form, setForm] = useState(() => defaultState(chore, prefillDate, prefillTime));

  function set(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.startDate) return;
    onSubmit({
      title: form.title.trim(),
      assigneeId: form.assigneeId || null,
      startDate: form.startDate,
      startTime: form.startTime || null,
      endTime: form.endTime || null,
      endDate: form.endDate || null,
      recurrence: form.recurrence,
    });
  }

  function handleRecurrenceTypeChange(e) {
    const t = e.target.value;
    // Default weekly days to the startDate's day-of-week so the event
    // recurs on the same day the user clicked, not always Monday.
    const defaultDay = form.startDate
      ? getDay(parseISO(form.startDate + 'T00:00:00'))
      : 1;
    const defaults = {
      none: { type: 'none' },
      weekly: { type: 'weekly', days: [defaultDay] },
      monthly: { type: 'monthly', dayOfMonth: 1 },
      custom: { type: 'custom', interval: 1, unit: 'weeks' },
    };
    set('recurrence', defaults[t]);
  }

  function handleStartTimeChange(e) {
    const val = e.target.value;
    setForm((f) => {
      const autoEnd = defaultEndTime(val);
      return {
        ...f,
        startTime: val,
        endTime: (!f.endTime || f.endTime <= val) ? autoEnd : f.endTime,
      };
    });
  }

  return (
    <form onSubmit={handleSubmit} className="chore-form">
      <div className="field">
        <label>Title *</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="e.g. Clean kitchen"
          autoFocus
          required
        />
      </div>

      <div className="field">
        <label>Assign to</label>
        <select value={form.assigneeId} onChange={(e) => set('assigneeId', e.target.value)}>
          <option value="">Unassigned</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      <div className="field-row">
        <div className="field">
          <label>Start date *</label>
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => set('startDate', e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label>End date</label>
          <input
            type="date"
            value={form.endDate}
            onChange={(e) => set('endDate', e.target.value)}
          />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label>Start time</label>
          <input
            type="time"
            value={form.startTime}
            onChange={handleStartTimeChange}
          />
        </div>
        <div className="field">
          <label>End time</label>
          <input
            type="time"
            value={form.endTime}
            onChange={(e) => set('endTime', e.target.value)}
          />
        </div>
      </div>

      <div className="field">
        <label>Recurrence</label>
        <select value={form.recurrence.type} onChange={handleRecurrenceTypeChange}>
          <option value="none">One-time</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="custom">Custom interval</option>
        </select>
      </div>

      <RecurrenceFields
        recurrence={form.recurrence}
        onChange={(r) => set('recurrence', r)}
      />

      <div className="form-actions">
        {chore && (
          <button type="button" className="btn-danger" onClick={() => onDelete(chore.id)}>
            Delete
          </button>
        )}
        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn-primary">
          {chore ? 'Save changes' : 'Add chore'}
        </button>
      </div>
    </form>
  );
}

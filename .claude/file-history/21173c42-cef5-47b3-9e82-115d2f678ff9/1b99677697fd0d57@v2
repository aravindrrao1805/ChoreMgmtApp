import { useState } from 'react';
import RecurrenceFields from './RecurrenceFields';

function defaultState(chore, prefillDate) {
  if (chore) {
    return {
      title: chore.title,
      assigneeId: chore.assigneeId || '',
      startDate: chore.startDate,
      endDate: chore.endDate || '',
      recurrence: chore.recurrence || { type: 'none' },
    };
  }
  return {
    title: '',
    assigneeId: '',
    startDate: prefillDate || '',
    endDate: '',
    recurrence: { type: 'none' },
  };
}

export default function ChoreForm({ chore, prefillDate, members, onSubmit, onDelete, onClose }) {
  const [form, setForm] = useState(() => defaultState(chore, prefillDate));

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
      endDate: form.endDate || null,
      recurrence: form.recurrence,
    });
  }

  function handleRecurrenceTypeChange(e) {
    const t = e.target.value;
    const defaults = {
      none: { type: 'none' },
      weekly: { type: 'weekly', days: [1] },
      monthly: { type: 'monthly', dayOfMonth: 1 },
      custom: { type: 'custom', interval: 1, unit: 'weeks' },
    };
    set('recurrence', defaults[t]);
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

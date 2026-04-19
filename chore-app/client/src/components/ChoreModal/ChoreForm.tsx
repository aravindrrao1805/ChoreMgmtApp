import { useState } from 'react';
import { getDay, parseISO } from 'date-fns';
import type { Chore, Member, ChoreFormState, RecurrenceConfig } from '../../types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import RecurrenceFields from './RecurrenceFields';

function defaultEndTime(startTime: string): string {
  if (!startTime) return '';
  const [h, m] = startTime.split(':').map(Number);
  const endH = h + 1;
  return `${String(endH < 24 ? endH : 23).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function defaultState(chore: Chore | null, prefillDate: string, prefillTime: string): ChoreFormState {
  if (chore) {
    return {
      title: chore.title,
      assigneeId: chore.assigneeId ?? '',
      startDate: chore.startDate,
      startTime: chore.startTime ?? '',
      endTime: chore.endTime ?? '',
      endDate: chore.endDate ?? '',
      recurrence: chore.recurrence,
    };
  }
  return {
    title: '',
    assigneeId: '',
    startDate: prefillDate,
    startTime: prefillTime,
    endTime: defaultEndTime(prefillTime),
    endDate: '',
    recurrence: { type: 'none' },
  };
}

interface ChoreFormProps {
  chore: Chore | null;
  prefillDate: string;
  prefillTime: string;
  members: Member[];
  onSubmit: (data: Omit<Chore, 'id'>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onClose: () => void;
}

export default function ChoreForm({ chore, prefillDate, prefillTime, members, onSubmit, onDelete, onClose }: ChoreFormProps) {
  const [form, setForm] = useState<ChoreFormState>(() => defaultState(chore, prefillDate, prefillTime));

  function set<K extends keyof ChoreFormState>(key: K, val: ChoreFormState[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.startDate) return;
    void onSubmit({
      title: form.title.trim(),
      assigneeId: form.assigneeId || null,
      startDate: form.startDate,
      startTime: form.startTime || null,
      endTime: form.endTime || null,
      endDate: form.endDate || null,
      recurrence: form.recurrence,
    });
  }

  function handleRecurrenceTypeChange(t: string) {
    const defaultDay = form.startDate ? getDay(parseISO(form.startDate + 'T00:00:00')) : 1;
    const defaults: Record<string, RecurrenceConfig> = {
      none: { type: 'none' },
      weekly: { type: 'weekly', days: [defaultDay] },
      monthly: { type: 'monthly', dayOfMonth: 1 },
      custom: { type: 'custom', interval: 1, unit: 'weeks' },
    };
    set('recurrence', defaults[t]);
  }

  function handleStartTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setForm((f) => ({
      ...f,
      startTime: val,
      endTime: (!f.endTime || f.endTime <= val) ? defaultEndTime(val) : f.endTime,
    }));
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          type="text"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="e.g. Clean kitchen"
          autoFocus
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Assign to</Label>
        <Select value={form.assigneeId} onValueChange={(val) => set('assigneeId', val)}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Unassigned" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Unassigned</SelectItem>
            {members.map((m) => (
              <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-3">
        <div className="flex flex-col gap-1.5 flex-1">
          <Label htmlFor="startDate">Start date *</Label>
          <Input
            id="startDate"
            type="date"
            value={form.startDate}
            onChange={(e) => set('startDate', e.target.value)}
            required
            className="h-9"
          />
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <Label htmlFor="endDate">End date</Label>
          <Input
            id="endDate"
            type="date"
            value={form.endDate}
            onChange={(e) => set('endDate', e.target.value)}
            className="h-9"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex flex-col gap-1.5 flex-1">
          <Label htmlFor="startTime">Start time</Label>
          <Input
            id="startTime"
            type="time"
            value={form.startTime}
            onChange={handleStartTimeChange}
            className="h-9"
          />
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <Label htmlFor="endTime">End time</Label>
          <Input
            id="endTime"
            type="time"
            value={form.endTime}
            onChange={(e) => set('endTime', e.target.value)}
            className="h-9"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Recurrence</Label>
        <Select value={form.recurrence.type} onValueChange={handleRecurrenceTypeChange}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">One-time</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="custom">Custom interval</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <RecurrenceFields
        recurrence={form.recurrence}
        onChange={(r) => set('recurrence', r)}
      />

      <div className="flex justify-end gap-2 pt-1">
        {chore && (
          <Button
            type="button"
            variant="destructive"
            className="mr-auto"
            onClick={() => void onDelete(chore.id)}
          >
            Delete
          </Button>
        )}
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit">{chore ? 'Save changes' : 'Add chore'}</Button>
      </div>
    </form>
  );
}

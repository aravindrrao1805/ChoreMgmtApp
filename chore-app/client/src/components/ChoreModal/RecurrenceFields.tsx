import type { RecurrenceConfig } from '../../types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface RecurrenceFieldsProps {
  recurrence: RecurrenceConfig;
  onChange: (r: RecurrenceConfig) => void;
}

export default function RecurrenceFields({ recurrence, onChange }: RecurrenceFieldsProps) {
  const { type } = recurrence;

  if (type === 'none') return null;

  if (type === 'weekly') {
    const days = recurrence.days;
    function toggleDay(d: number) {
      const next = days.includes(d) ? days.filter((x) => x !== d) : [...days, d].sort((a, b) => a - b);
      onChange({ type: 'weekly', days: next });
    }
    return (
      <div className="flex flex-col gap-1.5">
        <Label>Repeat on</Label>
        <div className="flex flex-wrap gap-2">
          {DAY_LABELS.map((label, i) => (
            <label key={i} className="flex items-center gap-1.5 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                className="accent-primary w-3.5 h-3.5"
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
      <div className="flex flex-col gap-1.5">
        <Label>Day of month</Label>
        <Input
          type="number"
          min={1}
          max={28}
          value={recurrence.dayOfMonth}
          onChange={(e) => onChange({ ...recurrence, dayOfMonth: Number(e.target.value) })}
          className="h-9"
        />
      </div>
    );
  }

  if (type === 'custom') {
    return (
      <div className="flex gap-3">
        <div className="flex flex-col gap-1.5 flex-1">
          <Label>Every</Label>
          <Input
            type="number"
            min={1}
            max={52}
            value={recurrence.interval}
            onChange={(e) => onChange({ ...recurrence, interval: Number(e.target.value) })}
            className="h-9"
          />
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <Label>Unit</Label>
          <Select
            value={recurrence.unit}
            onValueChange={(val) => onChange({ ...recurrence, unit: val as 'weeks' | 'months' })}
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weeks">Weeks</SelectItem>
              <SelectItem value="months">Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  return null;
}

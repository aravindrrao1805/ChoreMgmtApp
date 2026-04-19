export interface Member {
  id: string;
  name: string;
}

export type RecurrenceConfig =
  | { type: 'none' }
  | { type: 'weekly'; days: number[] }
  | { type: 'monthly'; dayOfMonth: number }
  | { type: 'custom'; interval: number; unit: 'weeks' | 'months' };

export interface Chore {
  id: string;
  title: string;
  assigneeId: string | null;
  startDate: string;
  startTime?: string | null;
  endTime?: string | null;
  endDate?: string | null;
  recurrence: RecurrenceConfig;
}

export interface EnrichedChore extends Chore {
  assigneeName: string | null;
}

export interface CalendarEventResource {
  choreId: string;
  chore: EnrichedChore;
  color: string;
}

export interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  resource: CalendarEventResource;
}

export interface ChoreFormState {
  title: string;
  assigneeId: string;
  startDate: string;
  startTime: string;
  endTime: string;
  endDate: string;
  recurrence: RecurrenceConfig;
}

export interface ModalState {
  open: boolean;
  chore: Chore | null;
  prefillDate: string;
  prefillTime: string;
}

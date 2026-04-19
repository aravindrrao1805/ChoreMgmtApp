import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import type { SlotInfo } from 'react-big-calendar';
import type { Chore, CalendarEvent, ModalState } from './types';
import { useMembers } from './hooks/useMembers';
import { useChores } from './hooks/useChores';
import { Button } from '@/components/ui/button';
import ChoreCalendar from './components/Calendar/ChoreCalendar';
import ChoreModal from './components/ChoreModal/ChoreModal';
import MemberPanel from './components/Members/MemberPanel';

const CLOSED_MODAL: ModalState = { open: false, chore: null, prefillDate: '', prefillTime: '' };

export default function App() {
  const { members, addMember, removeMember } = useMembers();
  const { chores, addChore, updateChore, removeChore } = useChores();
  const [modalState, setModalState] = useState<ModalState>(CLOSED_MODAL);

  const openCreate = useCallback((prefillDate = '', prefillTime = '') => {
    setModalState({ open: true, chore: null, prefillDate, prefillTime });
  }, []);

  const openEdit = useCallback((chore: Chore) => {
    setModalState({ open: true, chore, prefillDate: '', prefillTime: '' });
  }, []);

  const closeModal = useCallback(() => setModalState(CLOSED_MODAL), []);

  const handleSave = useCallback(async (data: Omit<Chore, 'id'>) => {
    if (modalState.chore) {
      await updateChore(modalState.chore.id, data);
    } else {
      await addChore(data);
    }
    closeModal();
  }, [modalState.chore, updateChore, addChore, closeModal]);

  const handleDelete = useCallback(async (id: string) => {
    await removeChore(id);
    closeModal();
  }, [removeChore, closeModal]);

  const handleSelectSlot = useCallback((slotInfo: SlotInfo) => {
    const start = slotInfo.start as Date;
    const date = format(start, 'yyyy-MM-dd');
    const h = start.getHours();
    const m = start.getMinutes();
    const time = (h !== 0 || m !== 0)
      ? `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
      : '';
    openCreate(date, time);
  }, [openCreate]);

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    openEdit(event.resource.chore);
  }, [openEdit]);

  return (
    <div className="flex flex-col h-screen bg-slate-100">
      <header className="flex items-center justify-between px-5 py-3 bg-white border-b border-border shrink-0 shadow-sm">
        <h1 className="text-xl font-bold text-slate-800">Office Chores</h1>
        <Button onClick={() => openCreate()}>+ Add Chore</Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <MemberPanel members={members} onAdd={addMember} onRemove={removeMember} />

        <main className="flex flex-1 flex-col p-4 overflow-hidden">
          <div className="flex-1 bg-white rounded-lg border border-border p-3 overflow-hidden shadow-sm">
            <ChoreCalendar
              chores={chores}
              members={members}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
            />
          </div>
        </main>
      </div>

      <ChoreModal
        modalState={modalState}
        members={members}
        onSave={handleSave}
        onDelete={handleDelete}
        onClose={closeModal}
      />
    </div>
  );
}

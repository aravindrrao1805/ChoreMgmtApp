import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import { useMembers } from './hooks/useMembers';
import { useChores } from './hooks/useChores';
import ChoreCalendar from './components/Calendar/ChoreCalendar';
import ChoreModal from './components/ChoreModal/ChoreModal';
import MemberPanel from './components/Members/MemberPanel';
import './index.css';

const CLOSED_MODAL = { open: false, chore: null, prefillDate: '' };

export default function App() {
  const { members, addMember, removeMember } = useMembers();
  const { chores, addChore, updateChore, removeChore } = useChores();
  const [modalState, setModalState] = useState(CLOSED_MODAL);

  const openCreate = useCallback((prefillDate = '') => {
    setModalState({ open: true, chore: null, prefillDate });
  }, []);

  const openEdit = useCallback((chore) => {
    setModalState({ open: true, chore, prefillDate: '' });
  }, []);

  const closeModal = useCallback(() => setModalState(CLOSED_MODAL), []);

  const handleSave = useCallback(async (data) => {
    if (modalState.chore) {
      await updateChore(modalState.chore.id, data);
    } else {
      await addChore(data);
    }
    closeModal();
  }, [modalState.chore, updateChore, addChore, closeModal]);

  const handleDelete = useCallback(async (id) => {
    await removeChore(id);
    closeModal();
  }, [removeChore, closeModal]);

  // react-big-calendar slot click gives a { start } object
  const handleSelectSlot = useCallback(({ start }) => {
    openCreate(format(start, 'yyyy-MM-dd'));
  }, [openCreate]);

  const handleSelectEvent = useCallback((event) => {
    openEdit(event.resource.chore);
  }, [openEdit]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Office Chores</h1>
        <button className="btn-primary" onClick={() => openCreate()}>+ Add Chore</button>
      </header>

      <div className="app-body">
        <MemberPanel members={members} onAdd={addMember} onRemove={removeMember} />

        <main className="calendar-area">
          <div className="calendar-wrapper">
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

import ChoreForm from './ChoreForm';

export default function ChoreModal({ modalState, members, onSave, onDelete, onClose }) {
  if (!modalState.open) return null;
  const { chore, prefillDate, prefillTime } = modalState;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{chore ? 'Edit Chore' : 'Add Chore'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <ChoreForm
          chore={chore}
          prefillDate={prefillDate}
          prefillTime={prefillTime}
          members={members}
          onSubmit={onSave}
          onDelete={onDelete}
          onClose={onClose}
        />
      </div>
    </div>
  );
}

import type { Chore, Member, ModalState } from '../../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ChoreForm from './ChoreForm';

interface ChoreModalProps {
  modalState: ModalState;
  members: Member[];
  onSave: (data: Omit<Chore, 'id'>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onClose: () => void;
}

export default function ChoreModal({ modalState, members, onSave, onDelete, onClose }: ChoreModalProps) {
  return (
    <Dialog open={modalState.open} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{modalState.chore ? 'Edit Chore' : 'Add Chore'}</DialogTitle>
        </DialogHeader>
        {modalState.open && (
          <ChoreForm
            chore={modalState.chore}
            prefillDate={modalState.prefillDate}
            prefillTime={modalState.prefillTime}
            members={members}
            onSubmit={onSave}
            onDelete={onDelete}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

import type { Member } from '../../types';
import MemberItem from './MemberItem';
import AddMemberForm from './AddMemberForm';

interface MemberPanelProps {
  members: Member[];
  onAdd: (name: string) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
}

export default function MemberPanel({ members, onAdd, onRemove }: MemberPanelProps) {
  return (
    <aside className="flex flex-col w-60 shrink-0 border-r border-border bg-white">
      {/* Pinned heading */}
      <div className="px-3 pt-4 pb-2 shrink-0">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Team Members
        </h3>
      </div>

      {/* Scrollable member list — only this section scrolls */}
      <div className="flex-1 overflow-y-auto px-3 py-1 flex flex-col gap-1">
        {members.length === 0 && (
          <p className="text-xs text-muted-foreground">No members yet</p>
        )}
        {members.map((m) => (
          <MemberItem key={m.id} member={m} members={members} onRemove={onRemove} />
        ))}
      </div>

      {/* Pinned add form — always visible at bottom */}
      <div className="px-3 py-3 shrink-0 border-t border-border">
        <AddMemberForm onAdd={onAdd} />
      </div>
    </aside>
  );
}

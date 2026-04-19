import { X } from 'lucide-react';
import type { Member } from '../../types';
import { Button } from '@/components/ui/button';
import { getMemberColor } from '../../utils/colors';

interface MemberItemProps {
  member: Member;
  members: Member[];
  onRemove: (id: string) => Promise<void>;
}

export default function MemberItem({ member, members, onRemove }: MemberItemProps) {
  const color = getMemberColor(member.id, members);
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-slate-50 group">
      <span
        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="flex-1 text-sm truncate">{member.name}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
        onClick={() => void onRemove(member.id)}
        aria-label={`Remove ${member.name}`}
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

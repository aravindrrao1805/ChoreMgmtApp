import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AddMemberFormProps {
  onAdd: (name: string) => Promise<void>;
}

export default function AddMemberForm({ onAdd }: AddMemberFormProps) {
  const [name, setName] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    void onAdd(name.trim());
    setName('');
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-1.5">
      <Input
        type="text"
        placeholder="Member name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="h-8 text-sm"
      />
      <Button type="submit" size="sm" className="h-8 shrink-0 px-3">
        Add
      </Button>
    </form>
  );
}

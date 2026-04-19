import { useState, useEffect, useCallback } from 'react';
import type { Member } from '../types';
import { getMembers, postMember, deleteMember } from '../utils/api';
import { useServerEvents } from './useServerEvents';

interface UseMembersResult {
  members: Member[];
  addMember: (name: string) => Promise<void>;
  removeMember: (id: string) => Promise<void>;
}

export function useMembers(): UseMembersResult {
  const [members, setMembers] = useState<Member[]>([]);

  const load = useCallback(async () => {
    const data = await getMembers();
    setMembers(data);
  }, []);

  useEffect(() => { load(); }, [load]);
  useServerEvents(load);

  const addMember = useCallback(async (name: string) => {
    await postMember(name);
    await load();
  }, [load]);

  const removeMember = useCallback(async (id: string) => {
    await deleteMember(id);
    await load();
  }, [load]);

  return { members, addMember, removeMember };
}

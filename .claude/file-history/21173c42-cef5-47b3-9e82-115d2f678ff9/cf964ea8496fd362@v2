import { useState, useEffect, useCallback } from 'react';
import { getMembers, postMember, deleteMember } from '../utils/api';

export function useMembers() {
  const [members, setMembers] = useState([]);

  const load = useCallback(async () => {
    const data = await getMembers();
    setMembers(data);
  }, []);

  useEffect(() => { load(); }, [load]);

  const addMember = useCallback(async (name) => {
    await postMember(name);
    await load();
  }, [load]);

  const removeMember = useCallback(async (id) => {
    await deleteMember(id);
    await load();
  }, [load]);

  return { members, addMember, removeMember };
}

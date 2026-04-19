import { useState, useEffect, useCallback } from 'react';
import type { Chore } from '../types';
import { getChores, postChore, putChore, deleteChore } from '../utils/api';
import { useServerEvents } from './useServerEvents';

interface UseChoresResult {
  chores: Chore[];
  addChore: (chore: Omit<Chore, 'id'>) => Promise<void>;
  updateChore: (id: string, chore: Omit<Chore, 'id'>) => Promise<void>;
  removeChore: (id: string) => Promise<void>;
}

export function useChores(): UseChoresResult {
  const [chores, setChores] = useState<Chore[]>([]);

  const load = useCallback(async () => {
    const data = await getChores();
    setChores(data);
  }, []);

  useEffect(() => { load(); }, [load]);
  useServerEvents(load);

  const addChore = useCallback(async (chore: Omit<Chore, 'id'>) => {
    await postChore(chore);
    await load();
  }, [load]);

  const updateChore = useCallback(async (id: string, chore: Omit<Chore, 'id'>) => {
    await putChore(id, chore);
    await load();
  }, [load]);

  const removeChore = useCallback(async (id: string) => {
    await deleteChore(id);
    await load();
  }, [load]);

  return { chores, addChore, updateChore, removeChore };
}

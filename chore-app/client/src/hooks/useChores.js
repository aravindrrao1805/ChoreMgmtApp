import { useState, useEffect, useCallback } from 'react';
import { getChores, postChore, putChore, deleteChore } from '../utils/api';
import { useServerEvents } from './useServerEvents';

export function useChores() {
  const [chores, setChores] = useState([]);

  const load = useCallback(async () => {
    const data = await getChores();
    setChores(data);
  }, []);

  useEffect(() => { load(); }, [load]);
  useServerEvents(load);

  const addChore = useCallback(async (chore) => {
    await postChore(chore);
    await load();
  }, [load]);

  const updateChore = useCallback(async (id, chore) => {
    await putChore(id, chore);
    await load();
  }, [load]);

  const removeChore = useCallback(async (id) => {
    await deleteChore(id);
    await load();
  }, [load]);

  return { chores, addChore, updateChore, removeChore };
}

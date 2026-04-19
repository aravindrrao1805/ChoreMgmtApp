import type { Chore, Member } from '../types';

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch('/api' + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json() as Promise<T>;
}

export const getMembers = () => apiFetch<Member[]>('/members');
export const postMember = (name: string) =>
  apiFetch<Member>('/members', { method: 'POST', body: JSON.stringify({ name }) });
export const deleteMember = (id: string) =>
  apiFetch<{ ok: boolean }>(`/members/${id}`, { method: 'DELETE' });

export const getChores = () => apiFetch<Chore[]>('/chores');
export const postChore = (chore: Omit<Chore, 'id'>) =>
  apiFetch<Chore>('/chores', { method: 'POST', body: JSON.stringify(chore) });
export const putChore = (id: string, chore: Omit<Chore, 'id'>) =>
  apiFetch<Chore>(`/chores/${id}`, { method: 'PUT', body: JSON.stringify(chore) });
export const deleteChore = (id: string) =>
  apiFetch<{ ok: boolean }>(`/chores/${id}`, { method: 'DELETE' });

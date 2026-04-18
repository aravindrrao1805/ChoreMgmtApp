async function apiFetch(path, options = {}) {
  const res = await fetch('/api' + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export const getMembers = () => apiFetch('/members');
export const postMember = (name) => apiFetch('/members', { method: 'POST', body: JSON.stringify({ name }) });
export const deleteMember = (id) => apiFetch(`/members/${id}`, { method: 'DELETE' });

export const getChores = () => apiFetch('/chores');
export const postChore = (chore) => apiFetch('/chores', { method: 'POST', body: JSON.stringify(chore) });
export const putChore = (id, chore) => apiFetch(`/chores/${id}`, { method: 'PUT', body: JSON.stringify(chore) });
export const deleteChore = (id) => apiFetch(`/chores/${id}`, { method: 'DELETE' });

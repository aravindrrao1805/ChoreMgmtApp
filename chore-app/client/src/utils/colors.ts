import type { Member } from '../types';

export const PALETTE: readonly string[] = [
  '#4f86c6', '#e07b54', '#6abf69', '#c97bbf',
  '#e6b655', '#5bbfbf', '#c46a6a', '#7b9ec4',
];

export function getMemberColor(memberId: string | null | undefined, members: Member[]): string {
  if (!memberId) return '#aaaaaa';
  const idx = members.findIndex((m) => m.id === memberId);
  return idx === -1 ? '#aaaaaa' : PALETTE[idx % PALETTE.length];
}

import type { Member } from './types';

/** FNV-1a 32-bit hash — gives a stable, non-sequential number from a UUID. */
function fnv32(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Returns members in a stable-shuffled order (based on each member's UUID),
 * with referees (Alan + Kate) always pinned to the end.
 */
export function sortMembers(members: Member[]): Member[] {
  const guests   = members.filter((m) => !m.is_referee);
  const referees = members.filter((m) =>  m.is_referee);
  guests.sort((a, b) => fnv32(a.id) - fnv32(b.id));
  return [...guests, ...referees];
}

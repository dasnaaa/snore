import type { Exercise } from './program';
export type Session = { items: Exercise[]; index: number; remaining: number; running: boolean; skipped: boolean };
export function tick(s: Session | null): Session | null {
  return s?.running ? { ...s, remaining: Math.max(0, s.remaining - 1) } : s;
}
export function advance(s: Session, skipped = false): Session {
  const next = s.index + 1;
  if (next >= s.items.length) return { ...s, remaining: 0, running: true, skipped: s.skipped || skipped };
  return { ...s, index: next, remaining: s.items[next].seconds, running: false, skipped: s.skipped || skipped };
}

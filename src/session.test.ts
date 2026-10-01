import { describe, expect, it } from 'vitest';
import { sessionFor } from './program';
import { advance, tick, type Session } from './session';
const items = sessionFor(1, 0);
const session: Session = { items, index: 0, remaining: 2, running: true, skipped: false };
describe('session transitions', () => {
  it('ticks running sessions without negative time', () => {
    expect(tick(session)?.remaining).toBe(1);
    expect(tick({ ...session, remaining: 0 })?.remaining).toBe(0);
  });
  it('does not tick after pause or close', () => {
    expect(tick({ ...session, running: false })?.remaining).toBe(2);
    expect(tick(null)).toBeNull();
  });
  it('pauses before the next instruction', () => {
    expect(advance(session)).toMatchObject({ index: 1, remaining: items[1].seconds, running: false, skipped: false });
  });
  it('preserves skipped status through the final exercise', () => {
    const skipped = advance(session, true);
    expect(advance({ ...skipped, index: items.length - 1 })).toMatchObject({ skipped: true, remaining: 0 });
  });
  it('can complete a session without skipping', () => {
    expect(advance({ ...session, index: items.length - 1 })).toMatchObject({ skipped: false, remaining: 0 });
  });
});

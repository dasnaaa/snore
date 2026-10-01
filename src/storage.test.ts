import { afterEach, describe, expect, it, vi } from 'vitest';
import { dateAt, dayNumber, initialState, sanitizeState, saveState, streak } from './storage';
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });
describe('local progress', () => {
  it('keeps yesterday’s streak until today is completed', () => {
    vi.useFakeTimers(); vi.setSystemTime(new Date('2026-09-27T12:00:00'));
    expect(streak(['2026-09-25', '2026-09-26'])).toBe(2);
    expect(streak(['2026-09-25', '2026-09-26', '2026-09-27'])).toBe(3);
    expect(streak(['2026-09-25'])).toBe(0);
  });
  it('counts calendar days over daylight-saving changes', () => {
    vi.useFakeTimers(); vi.setSystemTime(new Date('2026-03-30T12:00:00'));
    expect(dayNumber({ ...initialState, startedAt: '2026-03-28' })).toBe(3);
    expect(dateAt('2026-03-28', 2)).toBe('2026-03-30');
  });
  it('validates corrupted stored data', () => {
    const s = sanitizeState({ completed: 'oops', ratings: null, startedAt: '2026-02-31', theme: 'pink', reminderTime: '77:00' });
    expect(s.completed).toEqual([]); expect(s.ratings).toEqual({});
    expect(s.theme).toBe('system'); expect(s.reminderTime).toBe('20:30');
  });
  it('deduplicates completion dates', () => {
    expect(sanitizeState({ startedAt: '2026-01-01', completed: ['2026-01-01', '2026-01-01', 'bad'] }).completed).toEqual(['2026-01-01']);
  });
  it('does not crash when storage is full or blocked', () => {
    vi.stubGlobal('localStorage', { setItem: () => { throw new Error('Quota'); } });
    expect(saveState(initialState)).toBe(false);
  });
});

import { describe, expect, it } from 'vitest';
import { allExercises, phaseForWeek, sessionFor, totalSeconds, weeks } from './program';

describe('12-week program', () => {
  it('has 12 weeks with a progression phase each', () => {
    expect(weeks).toHaveLength(12);
    expect(weeks.every((w) => w.phase)).toBe(true);
  });

  it('keeps every daily session close to 8-12 minutes', () => {
    for (let week = 1; week <= 12; week++) {
      for (let day = 0; day < 7; day++) {
        const seconds = totalSeconds(sessionFor(week, day));
        expect(seconds).toBeGreaterThanOrEqual(360);
        expect(seconds).toBeLessThanOrEqual(780);
      }
    }
  });

  it('increases intensity across phases', () => {
    expect(phaseForWeek(1).factor).toBeLessThan(phaseForWeek(12).factor);
  });

  it('exposes the full evidence-based exercise catalog', () => {
    expect(allExercises.length).toBeGreaterThanOrEqual(5);
  });

  it('clamps out-of-range weeks', () => {
    expect(sessionFor(0, 0)).toEqual(sessionFor(1, 0));
    expect(sessionFor(99, 0)).toEqual(sessionFor(12, 0));
  });
});

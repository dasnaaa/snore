export type Theme = 'system' | 'light' | 'dark';

export type DayRating = { snore: number | null; backPosition: boolean | null };

export type AppState = {
  startedAt: string;
  completed: string[];
  reminderEnabled: boolean;
  reminderTime: string;
  onboarded: boolean;
  theme: Theme;
  haptics: boolean;
  sound: boolean;
  ratings: Record<string, DayRating>;
};

const KEY = 'leise-state-v2';

export const initialState: AppState = {
  startedAt: todayKey(),
  completed: [],
  reminderEnabled: false,
  reminderTime: '20:30',
  onboarded: false,
  theme: 'system',
  haptics: true,
  sound: true,
  ratings: {},
};

export function todayKey(d = new Date()): string {
  return d.toLocaleDateString('sv-SE');
}

function migrateLegacy(): Partial<AppState> {
  try {
    const legacy = JSON.parse(localStorage.getItem('leise-state-v1') || 'null');
    if (!legacy) return {};
    return { ...legacy, theme: 'system', haptics: true, sound: true, ratings: {} };
  } catch {
    return {};
  }
}

export function loadState(): AppState {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) || 'null');
    return sanitizeState(stored ?? migrateLegacy());
  } catch {
    return initialState;
  }
}

export function sanitizeState(value: unknown): AppState {
  const s = value && typeof value === 'object' ? value as Partial<AppState> : {};
  const validDate = (v: unknown): v is string => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v;
  const startedAt = validDate(s.startedAt) && s.startedAt <= todayKey() ? s.startedAt : todayKey();
  const completed = Array.isArray(s.completed) ? [...new Set(s.completed.filter(d => validDate(d) && d >= startedAt && d <= todayKey()))].slice(0, 84) : [];
  const ratings: AppState['ratings'] = {};
  if (s.ratings && typeof s.ratings === 'object') for (const [date, r] of Object.entries(s.ratings)) {
    if (validDate(date) && r && typeof r === 'object') ratings[date] = { snore: Number.isInteger(r.snore) && r.snore! >= 1 && r.snore! <= 5 ? r.snore : null, backPosition: typeof r.backPosition === 'boolean' ? r.backPosition : null };
  }
  return { ...initialState, startedAt, completed, ratings,
    theme: ['system', 'light', 'dark'].includes(s.theme ?? '') ? s.theme! : 'system',
    onboarded: s.onboarded === true, reminderEnabled: s.reminderEnabled === true,
    reminderTime: typeof s.reminderTime === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(s.reminderTime) ? s.reminderTime : '20:30',
    haptics: s.haptics !== false, sound: s.sound !== false };
}

export function saveState(state: AppState) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); return true; } catch { return false; }
}

export function dateAt(start: string, offset: number): string {
  const d = new Date(start + 'T12:00:00');
  d.setDate(d.getDate() + offset);
  return todayKey(d);
}

export function dayNumber(state: AppState): number {
  const start = new Date(state.startedAt + 'T12:00:00Z');
  const now = new Date(todayKey() + 'T12:00:00Z');
  return Math.max(1, Math.min(84, Math.floor((now.getTime() - start.getTime()) / 86400000) + 1));
}

export function streak(completed: string[]): number {
  let count = 0;
  const d = new Date();
  if (!completed.includes(todayKey(d))) d.setDate(d.getDate() - 1);
  while (completed.includes(todayKey(d))) {
    count++;
    d.setDate(d.getDate() - 1);
  }
  return count;
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', theme);
}

export function haptic(state: AppState, style: 'light' | 'medium' = 'light') {
  if (!state.haptics || !('vibrate' in navigator)) return;
  navigator.vibrate(style === 'light' ? 12 : 25);
}

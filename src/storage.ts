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
    if (stored) return { ...initialState, ...stored };
    return { ...initialState, ...migrateLegacy() };
  } catch {
    return initialState;
  }
}

export function saveState(state: AppState) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function dayNumber(state: AppState): number {
  const start = new Date(state.startedAt + 'T12:00:00');
  const now = new Date(todayKey() + 'T12:00:00');
  return Math.max(1, Math.min(84, Math.floor((now.getTime() - start.getTime()) / 86400000) + 1));
}

export function streak(completed: string[]): number {
  let count = 0;
  const d = new Date();
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

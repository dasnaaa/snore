export type Visual = 'tongue-up' | 'tongue-slide' | 'cheek-press' | 'vowel' | 'swallow' | 'jaw';

export type ExerciseBase = {
  id: string;
  title: string;
  short: string;
  seconds: number;
  reps: number;
  cue: string;
  steps: string[];
  benefit: string;
  visual: Visual;
};

export type Exercise = ExerciseBase & { reps: number; seconds: number };

const library: Record<string, ExerciseBase> = {
  suction: {
    id: 'suction',
    title: 'Zunge ansaugen',
    short: 'Zunge flächig an den Gaumen saugen.',
    seconds: 90,
    reps: 8,
    cue: 'Die ganze Zunge liegt breit am Gaumen.',
    steps: [
      'Lippen locker schließen, Kiefer entspannt.',
      'Zunge flächig an den Gaumen ansaugen.',
      'Kurz halten, dann bewusst lösen und wiederholen.',
    ],
    benefit: 'Kräftigt den vorderen Zungenrücken und den Gaumenkontakt.',
    visual: 'tongue-up',
  },
  slide: {
    id: 'slide',
    title: 'Zungenspitze nach hinten ziehen',
    short: 'Zungenspitze hinter die Schneidezähne, Zunge nach hinten führen.',
    seconds: 90,
    reps: 8,
    cue: 'Langsam und kontrolliert – der Kiefer bleibt ruhig.',
    steps: [
      'Zungenspitze hinter die oberen Schneidezähne legen.',
      'Mit sanftem Druck am Gaumen entlang nach hinten gleiten.',
      'Vorne neu ansetzen und wiederholen.',
    ],
    benefit: 'Trainiert die rückwärtige Zungenmuskulatur, die den Rachen offen hält.',
    visual: 'tongue-slide',
  },
  lowerPress: {
    id: 'lowerPress',
    title: 'Zungenrücken absenken',
    short: 'Zungenspitze unten, hinteren Zungenbereich nach unten drücken.',
    seconds: 90,
    reps: 8,
    cue: 'Die Zungenspitze bleibt unten, nur der hintere Bereich bewegt sich.',
    steps: [
      'Zungenspitze hinter die unteren Schneidezähne legen.',
      'Den hinteren Zungenbereich bewusst nach unten drücken.',
      'Kurz halten, entspannen, wiederholen.',
    ],
    benefit: 'Verbessert die Kontrolle über den hinteren Zungenbereich am Rachen.',
    visual: 'tongue-up',
  },
  vowels: {
    id: 'vowels',
    title: 'Weichen Gaumen aktivieren',
    short: '„Aaaah“ deutlich und kontrolliert sprechen.',
    seconds: 90,
    reps: 10,
    cue: 'Deutlich artikulieren, nicht schreien oder pressen.',
    steps: [
      'Aufrecht sitzen und ruhig einatmen.',
      'Ein kräftiges, gehaltenes „Aaaah“ sprechen.',
      'Den weichen Gaumen dabei bewusst anheben spüren.',
    ],
    benefit: 'Aktiviert und kräftigt den weichen Gaumen.',
    visual: 'vowel',
  },
  swallow: {
    id: 'swallow',
    title: 'Bewusst schlucken',
    short: 'Mit der Zunge am Gaumen schlucken.',
    seconds: 120,
    reps: 6,
    cue: 'Die Zungenspitze bleibt oben; Lippen entspannt.',
    steps: [
      'Einen kleinen Schluck Wasser nehmen oder trocken schlucken.',
      'Zungenspitze am Gaumen positionieren.',
      'Schlucken, ohne die Lippen zusammenzupressen.',
    ],
    benefit: 'Koordiniert Zunge, Gaumen und Rachenmuskulatur beim Schluckvorgang.',
    visual: 'swallow',
  },
  jaw: {
    id: 'jaw',
    title: 'Kiefer stabilisieren',
    short: 'Unterkiefer kontrolliert nach vorn führen.',
    seconds: 90,
    reps: 8,
    cue: 'Kleine Bewegung, kein Knacken erzwingen.',
    steps: [
      'Mund leicht öffnen.',
      'Unterkiefer langsam gerade nach vorn führen.',
      'Kurz halten und kontrolliert zurückführen.',
    ],
    benefit: 'Ergänzt die Rachenmuskulatur um eine stabile Kieferführung.',
    visual: 'jaw',
  },
};

export const allExercises: ExerciseBase[] = [
  library.suction,
  library.slide,
  library.lowerPress,
  library.vowels,
  library.swallow,
  library.jaw,
];

const allIds = allExercises.map((e) => e.id);

export type Phase = { name: string; factor: number; range: [number, number] };

export const phases: Phase[] = [
  { name: 'Technik lernen', factor: 1, range: [1, 2] },
  { name: 'Wiederholungen steigern', factor: 1.1, range: [3, 4] },
  { name: 'Volumen & Haltezeit erhöhen', factor: 1.2, range: [5, 8] },
  { name: 'Volle Routine & Festigung', factor: 1.3, range: [9, 12] },
];

export function phaseForWeek(week: number): Phase {
  const w = Math.min(12, Math.max(1, week));
  return phases.find((p) => w >= p.range[0] && w <= p.range[1]) ?? phases[phases.length - 1];
}

const weekFocus = [
  'Basis & Wahrnehmung',
  'Zungenkraft',
  'Gaumenkontakt',
  'Wangen & Koordination',
  'Ausdauer',
  'Schluckmuster',
  'Stabilität',
  'Präzision',
  'Ausdauer plus',
  'Alltagstransfer',
  'Konsolidierung',
  'Festigen',
];

export const weeks = weekFocus.map((name, i) => ({ week: i + 1, name, phase: phaseForWeek(i + 1) }));

const COUNT = 5;

function idsForDay(day: number): string[] {
  const start = ((day % allIds.length) + allIds.length) % allIds.length;
  const ids: string[] = [];
  for (let i = 0; i < COUNT; i++) ids.push(allIds[(start + i) % allIds.length]);
  return ids;
}

export function sessionFor(week: number, day: number): Exercise[] {
  const phase = phaseForWeek(week);
  return idsForDay(day).map((id) => {
    const base = library[id];
    const seconds = Math.round((base.seconds * phase.factor) / 5) * 5;
    const reps = Math.round(base.reps * phase.factor);
    return { ...base, seconds, reps };
  });
}

export function totalSeconds(xs: Exercise[]): number {
  return xs.reduce((n, x) => n + x.seconds, 0);
}

import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Bell,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Flame,
  Home,
  Moon,
  Pause,
  Play,
  RotateCcw,
  Settings,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Sun,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { allExercises, sessionFor, totalSeconds, weeks, type Exercise } from './program';
import { configureReminder } from './notifications';
import { chime } from './sound';
import {
  applyTheme,
  dayNumber,
  haptic,
  loadState,
  saveState,
  streak,
  todayKey,
  type AppState,
  type Theme,
} from './storage';
import { Illustration } from './illustrations';

type Tab = 'home' | 'exercises' | 'progress' | 'plan' | 'settings';
type Session = { items: Exercise[]; index: number; remaining: number; running: boolean };
type InstallEvent = Event & { prompt: () => void; userChoice: Promise<{ outcome: string }> };

const fmt = (n: number) => `${Math.floor(n / 60)}:${String(n % 60).padStart(2, '0')}`;

const ONBOARDING_STEPS = [
  {
    icon: <Activity />,
    title: 'Was du trainierst',
    body: 'Leise führt dich durch gezielte Übungen für Zunge, weichen Gaumen und Rachenmuskulatur – die Muskeln, die im Schlaf erschlaffen und Schnarchen begünstigen können.',
  },
  {
    icon: <Flame />,
    title: 'Warum täglich zählt',
    body: 'Muskeltraining wirkt durch Wiederholung. Zehn Minuten am Tag sind wirkungsvoller als eine lange Einheit pro Woche. Verpasste Tage sind kein Problem – mach einfach weiter.',
  },
  {
    icon: <CalendarDays />,
    title: 'Dein 12-Wochen-Ziel',
    body: 'Das Programm steigert Wiederholungen und Haltezeit über zwölf Wochen hinweg – von den Grundlagen bis zur vollen Routine. Fortschritt und Daten bleiben dabei nur auf deinem Gerät.',
  },
] as const;

function Disclaimer({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Schließen">
          <X />
        </button>
        <ShieldCheck className="modal-icon" />
        <h2>Trainiere achtsam</h2>
        <p>
          Leise begleitet ein allgemeines Training der Mund- und Rachenmuskulatur. Die App ist kein
          Medizinprodukt, stellt keine Diagnose und ersetzt keine ärztliche Beratung oder Behandlung.
          Ein Nutzen kann nicht garantiert werden.
        </p>
        <h3>Bitte medizinisch abklären</h3>
        <p>
          Beobachtete Atempausen, ausgeprägte Tagesmüdigkeit, morgendliche Kopfschmerzen, nächtliches
          Luftschnappen oder Erstickungsgefühl sowie Bluthochdruck können auf eine Schlafapnoe hinweisen.
          Wende dich damit zeitnah an eine Ärztin oder einen Arzt.
        </p>
        <p>Beende eine Übung sofort bei Schmerzen, Schwindel, Atemnot oder Kieferbeschwerden.</p>
        <button className="primary" onClick={onClose}>
          Verstanden
        </button>
      </section>
    </div>
  );
}

function Onboarding({ state, onFinish }: { state: AppState; onFinish: (s: AppState) => void }) {
  const [step, setStep] = useState(0);
  const [time, setTime] = useState(state.reminderTime);
  const [enableReminder, setEnableReminder] = useState(true);
  const total = ONBOARDING_STEPS.length + 1;
  const isLast = step === total - 1;

  const finish = async () => {
    const ok = enableReminder ? await configureReminder(true, time) : false;
    onFinish({ ...state, onboarded: true, reminderTime: time, reminderEnabled: ok });
  };

  return (
    <div className="onboarding">
      <div className="onboarding-progress">
        {Array.from({ length: total }, (_, i) => (
          <i key={i} className={i <= step ? 'filled' : ''} />
        ))}
      </div>
      {!isLast ? (
        <section className="onboarding-card">
          <div className="onboarding-icon">{ONBOARDING_STEPS[step].icon}</div>
          <h1>{ONBOARDING_STEPS[step].title}</h1>
          <p>{ONBOARDING_STEPS[step].body}</p>
        </section>
      ) : (
        <section className="onboarding-card">
          <div className="onboarding-icon">
            <Bell />
          </div>
          <h1>Erinnerung einstellen</h1>
          <p>Wann passt dein tägliches Training am besten? Du kannst das jederzeit in den Einstellungen ändern.</p>
          <label className="setting-row onboarding-time">
            <span>
              <CalendarDays />
              <b>Uhrzeit</b>
            </span>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </label>
          <label className="setting-row">
            <span>
              <Bell />
              <b>Tägliche Erinnerung aktivieren</b>
            </span>
            <input
              type="checkbox"
              checked={enableReminder}
              onChange={(e) => setEnableReminder(e.target.checked)}
            />
          </label>
          <p className="onboarding-disclaimer">
            Diese App ist ein Trainingswerkzeug und kein Medizinprodukt. Schnarchen kann ein Zeichen einer
            obstruktiven Schlafapnoe sein – bei Warnzeichen bitte ärztlich abklären lassen.
          </p>
        </section>
      )}
      <footer className="onboarding-footer">
        {step > 0 ? (
          <button className="icon-btn" onClick={() => setStep((s) => s - 1)} aria-label="Zurück">
            <ChevronLeft />
          </button>
        ) : (
          <button className="text-btn" onClick={() => onFinish({ ...state, onboarded: true })}>
            Überspringen
          </button>
        )}
        <button className="primary" onClick={() => (isLast ? finish() : setStep((s) => s + 1))}>
          {isLast ? 'Los geht’s' : 'Weiter'} <ChevronRight />
        </button>
      </footer>
    </div>
  );
}

export default function App() {
  const [state, setState] = useState<AppState>(loadState);
  const [tab, setTab] = useState<Tab>('home');
  const [session, setSession] = useState<Session | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [installEvent, setInstallEvent] = useState<InstallEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => saveState(state), [state]);
  useEffect(() => applyTheme(state.theme), [state.theme]);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as InstallEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    if (window.matchMedia('(display-mode: standalone)').matches) setInstalled(true);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  useEffect(() => {
    if (!session?.running) return;
    const id = setInterval(() => setSession((s) => (s ? { ...s, remaining: Math.max(0, s.remaining - 1) } : s)), 1000);
    return () => clearInterval(id);
  }, [session?.running]);

  useEffect(() => {
    if (session?.remaining !== 0 || !session.running) return;
    chime(state.sound);
    haptic(state, 'medium');
    if (session.index < session.items.length - 1) {
      const next = session.index + 1;
      setSession({ ...session, index: next, remaining: session.items[next].seconds, running: false });
    } else {
      setSession(null);
      setState((s) => ({ ...s, completed: [...new Set([...s.completed, todayKey()])] }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const day = dayNumber(state);
  const week = Math.ceil(day / 7);
  const dayIn = (day - 1) % 7;
  const items = useMemo(() => sessionFor(week, dayIn), [week, dayIn]);
  const done = state.completed.includes(todayKey());
  const progress = Math.round((state.completed.length / 84) * 100);
  const todayRating = state.ratings[todayKey()] ?? { snore: null, backPosition: null };

  const start = () => {
    haptic(state);
    setSession({ items, index: 0, remaining: items[0].seconds, running: true });
  };

  const rate = (patch: Partial<{ snore: number | null; backPosition: boolean | null }>) => {
    setState((s) => ({
      ...s,
      ratings: { ...s.ratings, [todayKey()]: { ...todayRating, ...patch } },
    }));
  };

  const promptInstall = async () => {
    if (!installEvent) return;
    installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
  };

  if (!state.onboarded) {
    return <Onboarding state={state} onFinish={setState} />;
  }

  if (session) {
    const ex = session.items[session.index];
    const elapsed = ex.seconds - session.remaining;
    const pct = Math.round((elapsed / ex.seconds) * 100);
    return (
      <main className="session-screen">
        <header>
          <button className="icon-btn" onClick={() => setSession(null)} aria-label="Training schließen">
            <X />
          </button>
          <span>
            Übung {session.index + 1} von {session.items.length}
          </span>
          <span>{fmt(session.remaining)}</span>
        </header>
        <section className="session-card">
          <div className="timer-ring" style={{ '--progress': `${pct * 3.6}deg` } as React.CSSProperties}>
            <div>
              {fmt(session.remaining)}
              <small>ruhig atmen</small>
            </div>
          </div>
          <Illustration kind={ex.visual} />
          <div>
            <p className="eyebrow">
              JETZT · {ex.reps}×
            </p>
            <h1>{ex.title}</h1>
            <p className="cue">{ex.cue}</p>
            <ol>
              {ex.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </div>
        </section>
        <footer className="session-controls">
          <button
            className="icon-btn"
            onClick={() => setSession({ ...session, remaining: ex.seconds, running: false })}
            aria-label="Übung neu starten"
          >
            <RotateCcw />
          </button>
          <button className="play" onClick={() => setSession({ ...session, running: !session.running })}>
            {session.running ? <Pause /> : <Play />}
          </button>
          <button
            className="icon-btn"
            onClick={() => {
              const next = session.index + 1;
              if (next >= session.items.length) setSession({ ...session, remaining: 0, running: true });
              else setSession({ ...session, index: next, remaining: session.items[next].seconds, running: true });
            }}
            aria-label="Weiter"
          >
            <ChevronRight />
          </button>
        </footer>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <main className="content">
        {tab === 'home' && (
          <>
            <header className="top">
              <div className="brand">
                <div className="logo">~</div>
                <b>Leise</b>
              </div>
              <button className="avatar" aria-label="Profil">
                {week}
              </button>
            </header>
            <section className="greeting">
              <p className="eyebrow">
                WOCHE {week} · TAG {dayIn + 1}
              </p>
              <h1>Guten Abend.</h1>
              <p>Heute stärken wir deine Zunge und trainieren ruhige, kontrollierte Bewegungen.</p>
            </section>
            <section className="today-card">
              <div className="today-top">
                <span className={done ? 'status done' : 'status'}>
                  {done ? (
                    <>
                      <Check /> erledigt
                    </>
                  ) : (
                    <>
                      <Sparkles /> heute
                    </>
                  )}
                </span>
                <span>≈ {Math.round(totalSeconds(items) / 60)} Min.</span>
              </div>
              <div className="orb">
                <div className="orb-inner">
                  <span>{items.length}</span>
                  <small>Übungen</small>
                </div>
              </div>
              <h2>{done ? 'Training geschafft' : 'Deine tägliche Session'}</h2>
              <p>{done ? 'Gut gemacht. Erholung gehört zum Training.' : 'Geführte Übungen mit Timer und klaren Hinweisen.'}</p>
              <button className="primary" onClick={start}>
                {done ? 'Noch einmal trainieren' : 'Training starten'} <ChevronRight />
              </button>
            </section>
            <section className="stats">
              <article>
                <Flame />
                <span>
                  <b>{streak(state.completed)}</b> Tage
                  <small>Aktuelle Serie</small>
                </span>
              </article>
              <article>
                <CalendarDays />
                <span>
                  <b>{progress}%</b>
                  <small>Gesamtfortschritt</small>
                </span>
              </article>
            </section>
            {!state.reminderEnabled && (
              <button
                className="notice"
                onClick={async () => {
                  const ok = await configureReminder(true, state.reminderTime);
                  setState((s) => ({ ...s, reminderEnabled: ok }));
                }}
              >
                <Bell />
                <span>
                  <b>Erinnerung aktivieren</b>
                  <small>Täglich um {state.reminderTime} Uhr erinnert werden</small>
                </span>
                <ChevronRight />
              </button>
            )}
            <button className="notice" onClick={() => setShowInfo(true)}>
              <ShieldCheck />
              <span>
                <b>Gut zu wissen</b>
                <small>Sicher trainieren & medizinischer Hinweis</small>
              </span>
              <ChevronRight />
            </button>
          </>
        )}

        {tab === 'exercises' && (
          <>
            <header className="page-head">
              <div>
                <p className="eyebrow">GRUNDLAGEN</p>
                <h1>Übungen</h1>
              </div>
            </header>
            <div className="exercise-list">
              {allExercises.map((ex) => (
                <article className="exercise-card" key={ex.id}>
                  <Illustration kind={ex.visual} className="exercise-illustration" />
                  <div>
                    <h3>{ex.title}</h3>
                    <p className="exercise-short">{ex.short}</p>
                    <p className="exercise-benefit">{ex.benefit}</p>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {tab === 'progress' && (
          <>
            <header className="page-head">
              <div>
                <p className="eyebrow">DEIN VERLAUF</p>
                <h1>Fortschritt</h1>
              </div>
            </header>
            <section className="stats stats-triple">
              <article>
                <Flame />
                <span>
                  <b>{streak(state.completed)}</b>
                  <small>Serie (Tage)</small>
                </span>
              </article>
              <article>
                <Dumbbell />
                <span>
                  <b>{state.completed.length}</b>
                  <small>Sessions gesamt</small>
                </span>
              </article>
              <article>
                <CalendarDays />
                <span>
                  <b>{week}/12</b>
                  <small>Woche</small>
                </span>
              </article>
            </section>
            <section className="settings-card">
              <div className="setting-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
                <span>
                  <Sparkles />
                  <b>Wie stark hast du letzte Nacht geschnarcht?</b>
                </span>
                <div className="rating-scale">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      className={todayRating.snore === n ? 'rating-dot active' : 'rating-dot'}
                      onClick={() => rate({ snore: n })}
                      aria-label={`${n} von 5`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div className="setting-row">
                <span>
                  <Moon />
                  <b>Überwiegend in Rückenlage geschlafen?</b>
                </span>
                <div className="toggle-pair">
                  <button
                    className={todayRating.backPosition === true ? 'pill active' : 'pill'}
                    onClick={() => rate({ backPosition: true })}
                  >
                    Ja
                  </button>
                  <button
                    className={todayRating.backPosition === false ? 'pill active' : 'pill'}
                    onClick={() => rate({ backPosition: false })}
                  >
                    Nein
                  </button>
                </div>
              </div>
            </section>
            <p className="privacy">Angaben sind freiwillig, rein subjektiv und dienen nur deiner eigenen Übersicht.</p>
          </>
        )}

        {tab === 'plan' && (
          <>
            <header className="page-head">
              <div>
                <p className="eyebrow">DEIN WEG</p>
                <h1>12 Wochen</h1>
              </div>
              <span>{state.completed.length}/84 Tage</span>
            </header>
            <div className="week-grid">
              {weeks.map((w) => (
                <article className={w.week === week ? 'week active' : w.week < week ? 'week passed' : 'week'} key={w.week}>
                  <div>
                    <span>W{w.week}</span>
                    {w.week < week && <Check />}
                  </div>
                  <h3>{w.name}</h3>
                  <p className="week-phase">{w.phase.name}</p>
                  <div className="dots">
                    {Array.from({ length: 7 }, (_, i) => {
                      const n = (w.week - 1) * 7 + i;
                      return <i key={i} className={n < day - 1 ? 'filled' : n === day - 1 ? 'current' : ''} />;
                    })}
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {tab === 'settings' && (
          <>
            <header className="page-head">
              <div>
                <p className="eyebrow">ANPASSEN</p>
                <h1>Einstellungen</h1>
              </div>
            </header>
            <section className="settings-card">
              <label className="setting-row">
                <span>
                  <Bell />
                  <b>Tägliche Erinnerung</b>
                  <small>Auf Android zuverlässig lokal geplant</small>
                </span>
                <input
                  type="checkbox"
                  checked={state.reminderEnabled}
                  onChange={async (e) => {
                    const ok = await configureReminder(e.target.checked, state.reminderTime);
                    setState({ ...state, reminderEnabled: ok && e.target.checked });
                  }}
                />
              </label>
              <label className="setting-row">
                <span>
                  <CalendarDays />
                  <b>Uhrzeit</b>
                  <small>Wann passt dein Training?</small>
                </span>
                <input
                  type="time"
                  value={state.reminderTime}
                  onChange={async (e) => {
                    const time = e.target.value;
                    setState({ ...state, reminderTime: time });
                    if (state.reminderEnabled) await configureReminder(true, time);
                  }}
                />
              </label>
            </section>
            <section className="settings-card">
              <label className="setting-row">
                <span>
                  <Smartphone />
                  <b>Haptik</b>
                  <small>Kurzes Feedback bei Start & Übungswechsel</small>
                </span>
                <input
                  type="checkbox"
                  checked={state.haptics}
                  onChange={(e) => setState({ ...state, haptics: e.target.checked })}
                />
              </label>
              <label className="setting-row">
                <span>
                  {state.sound ? <Volume2 /> : <VolumeX />}
                  <b>Ton</b>
                  <small>Signal bei Übungswechsel</small>
                </span>
                <input
                  type="checkbox"
                  checked={state.sound}
                  onChange={(e) => setState({ ...state, sound: e.target.checked })}
                />
              </label>
            </section>
            <section className="settings-card">
              <div className="setting-row">
                <span>
                  <Sun />
                  <b>Erscheinungsbild</b>
                  <small>System, hell oder dunkel</small>
                </span>
              </div>
              <div className="theme-picker">
                {(['system', 'light', 'dark'] as Theme[]).map((t) => (
                  <button
                    key={t}
                    className={state.theme === t ? 'pill active' : 'pill'}
                    onClick={() => setState({ ...state, theme: t })}
                  >
                    {t === 'system' ? 'System' : t === 'light' ? 'Hell' : 'Dunkel'}
                  </button>
                ))}
              </div>
            </section>
            <section className="settings-card">
              {!installed && (
                <button
                  className="text-row"
                  onClick={installEvent ? promptInstall : () => setShowInfo(false)}
                >
                  <Smartphone />
                  <span>
                    <b>App installieren</b>
                    <small>
                      {installEvent
                        ? 'Auf dem Homescreen hinzufügen'
                        : 'Im Browser-Menü „Zum Startbildschirm hinzufügen“ wählen'}
                    </small>
                  </span>
                  <ChevronRight />
                </button>
              )}
              <button className="text-row" onClick={() => setShowInfo(true)}>
                <ShieldCheck />
                <span>
                  <b>Gesundheit & Sicherheit</b>
                  <small>Hinweise zum Training</small>
                </span>
                <ChevronRight />
              </button>
              <button
                className="text-row danger"
                onClick={() =>
                  confirm('Fortschritt wirklich zurücksetzen?') &&
                  setState({ ...state, startedAt: todayKey(), completed: [], ratings: {} })
                }
              >
                <RotateCcw />
                <span>
                  <b>Fortschritt zurücksetzen</b>
                  <small>Lokale Trainingsdaten löschen</small>
                </span>
              </button>
            </section>
            <p className="privacy">Kein Konto. Keine Cloud. Deine Trainingsdaten bleiben auf diesem Gerät.</p>
          </>
        )}
      </main>
      <nav>
        <button className={tab === 'home' ? 'active' : ''} onClick={() => setTab('home')}>
          <Home />
          Heute
        </button>
        <button className={tab === 'exercises' ? 'active' : ''} onClick={() => setTab('exercises')}>
          <Dumbbell />
          Übungen
        </button>
        <button className={tab === 'progress' ? 'active' : ''} onClick={() => setTab('progress')}>
          <Activity />
          Verlauf
        </button>
        <button className={tab === 'plan' ? 'active' : ''} onClick={() => setTab('plan')}>
          <CalendarDays />
          Programm
        </button>
        <button className={tab === 'settings' ? 'active' : ''} onClick={() => setTab('settings')}>
          <Settings />
          Mehr
        </button>
      </nav>
      {showInfo && <Disclaimer onClose={() => setShowInfo(false)} />}
    </div>
  );
}

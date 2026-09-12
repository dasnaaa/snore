# Leise – Schnarchtraining

Mobile-first PWA für ein vorsichtig formuliertes, zwölfwöchiges Training der Mund- und Rachenmuskulatur. Die App speichert Fortschritt und Einstellungen ausschließlich lokal und benötigt kein Konto.

## Funktionsumfang

- **Onboarding** (3 Infoscreens + Erinnerungszeit) beim ersten Start
- **Heute**: tägliche Session, Streak, Gesamtfortschritt, Reminder-Hinweis
- **Training**: geführte Session mit Timer, Fortschrittsring, Schritt-für-Schritt-Anleitung, eigenen SVG-Illustrationen (Zungenposition, Bewegungsrichtung, Zielbereich) sowie Ton-/Haptik-Feedback
- **Übungen**: Katalog aller evidenzbasierten Übungen mit Kurzbeschreibung und Trainingsziel
- **Verlauf**: Streak, Gesamt-Sessions, Wochenstand sowie optionale subjektive Tagesabfrage (Schnarchintensität 1–5, Rückenlage)
- **Programm**: 12-Wochen-Plan mit vier Progressionsphasen (Technik → Wiederholungen → Volumen/Haltezeit → volle Routine)
- **Einstellungen**: Reminder (Uhrzeit/An-Aus), Haptik, Ton, Erscheinungsbild (System/Hell/Dunkel), PWA-Installationshinweis, Fortschritt zurücksetzen, Gesundheitshinweis
- Vollständig **offlinefähig** (Service Worker), **installierbar** auf Android/Desktop, **Dark Mode**

## Lokal starten

```bash
npm install
npm run dev
```

Qualitätschecks und Produktions-Build:

```bash
npm run lint
npm test
npm run build
```

## Cloudflare Deployment

Das Projekt ist als git-verbundenes **Workers**-Projekt (Workers Builds, mit Static Assets) bei Cloudflare eingerichtet:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy` (Standard, nutzt `wrangler.jsonc`)
- Node.js: `22`

`wrangler.jsonc` konfiguriert den statischen Asset-Ordner (`./dist`) inkl. SPA-Fallback (`not_found_handling: single-page-application`). `_headers` liefert zusätzliche Sicherheits-Header und Cache-Regeln für `/assets/*`.

Nach dem ersten erfolgreichen Deploy kann `snore.wrkt.at` unter dem Worker-Projekt als **Custom Domain** hinzugefügt werden (Cloudflare Dashboard → Workers & Pages → snore → Settings → Domains & Routes); DNS wird automatisch in der `wrkt.at`-Zone angelegt.

Wichtig: Das Production-Branch-Mapping im Projekt bestimmt, welcher Git-Branch deployt wird — für Live-Traffic sollte das der `main`-Branch nach Merge des Feature-PRs sein.

## Android via Capacitor (optional)

Android Studio/JDK vorausgesetzt:

```bash
npm run android:add
npm run android:sync
npm run android:open
```

Native lokale Benachrichtigungen sind eingebunden. Vor einem Store-Build sollten Android-App-Icon/Splash über die Capacitor Assets Pipeline erzeugt, die Notification-Berechtigung auf realen Geräten geprüft und Signing/Store-Metadaten konfiguriert werden.

## Gesundheitlicher Hinweis

Leise ist kein Medizinprodukt und ersetzt keine Diagnose oder Behandlung. Bei beobachteten Atempausen, ausgeprägter Tagesmüdigkeit, nächtlichem Luftschnappen, morgendlichen Kopfschmerzen oder Herz-Kreislauf-Erkrankungen sollte eine mögliche Schlafapnoe ärztlich abgeklärt werden.

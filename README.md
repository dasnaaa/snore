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

## Cloudflare Pages

- Build command: `npm run build`
- Build output directory: `dist`
- Node.js: `22`

`wrangler.jsonc`, `_headers` und der SPA-Fallback sind vorbereitet. Nach dem ersten Pages-Deployment kann `snore.wrkt.at` im Pages-Projekt unter **Custom domains** verbunden werden; DNS wird in der zugehörigen Cloudflare-Zone bestätigt.

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

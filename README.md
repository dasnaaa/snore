# Leise – Schnarchtraining

Mobile-first PWA für ein vorsichtig formuliertes, zwölfwöchiges Training der Mund- und Rachenmuskulatur. Die App speichert Fortschritt und Einstellungen ausschließlich lokal und benötigt kein Konto.

## Funktionsumfang

- **Onboarding** (3 Infoscreens + Erinnerungszeit) beim ersten Start
- **Heute**: tägliche Session, Streak, Gesamtfortschritt, Reminder-Hinweis
- **Training**: geführte Session mit Timer, Fortschrittsring, Schritt-für-Schritt-Anleitung, eigenen SVG-Illustrationen (Zungenposition, Bewegungsrichtung, Zielbereich) sowie Ton-/Haptik-Feedback
- **Übungen**: Katalog der Trainingsübungen mit Kurzbeschreibung und Trainingsziel
- **Verlauf**: Streak, Gesamt-Sessions, Wochenstand sowie optionale subjektive Tagesabfrage (Schnarchintensität 1–5, Rückenlage)
- **Programm**: 12-Wochen-Plan mit vier Progressionsphasen (Technik → Wiederholungen → Volumen/Haltezeit → volle Routine)
- **Einstellungen**: Reminder (Uhrzeit/An-Aus), Haptik, Ton, Erscheinungsbild (System/Hell/Dunkel), PWA-Installationshinweis, Fortschritt zurücksetzen, Gesundheitshinweis
- Vollständig **offlinefähig** (Service Worker), **installierbar** auf Android/Desktop, **Dark Mode**

## Lokal starten

```bash
npm ci
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
npm run android:sync
npm run android:open
```

Das Android-Projekt ist eingecheckt. Native lokale Benachrichtigungen mit Kanal und Statusprüfung sind eingebunden. Vor einem Store-Build müssen Android-App-Icon/Splash finalisiert, Benachrichtigungen auf realen Geräten (inkl. Neustart und Energiesparen) geprüft und Signing/Store-Metadaten konfiguriert werden. JDK 21 und Android SDK erforderlich. `android:sync` prüft keinen APK-Build.

### Erinnerungen und lokale Daten

Die Web-Version hat keinen Push-Server und plant keine Benachrichtigungen bei geschlossenem Browser. Sie zeigt diese Einschränkung ausdrücklich an; eine Browser-Berechtigung wird nicht mit einem geplanten Reminder gleichgesetzt. Als Alternative den Geräte-Kalender nutzen. Android plant lokal, die tatsächliche Zustellung unterliegt Berechtigungen und Energiesparregeln.

Fortschritt zählt nur vollständig absolvierte Sessions, nicht übersprungene Übungen. Der Timer startet pro Übung manuell und pausiert beim App-Wechsel. Die Serie bleibt erhalten, solange gestern trainiert wurde. Der Wochenplan markiert nur tatsächliche Abschlüsse. Subjektive Einträge der letzten 14 erfassten Tage erscheinen im Verlauf. Browserdaten können vom Betriebssystem oder Nutzer gelöscht werden; es gibt keinen Cloud-Backup. Android-Backup ist deaktiviert.

### Qualitätssicherung

`npm run lint`, `npm test`, `npm run build`, `npm run android:sync`.
Regressionstests decken Kalender-/Sommerzeitgrenzen, Serie, ungültige gespeicherte Daten, Speicherfehler und Session-/Skip-/Pause-Übergänge ab. Ein echter Android-Build und Geräteprüfung sind separat erforderlich.

Die PWA kann alternativ auf Cloudflare Pages bereitgestellt werden: Build `npm run build`, Ausgabe `dist`, keine Server-Bindings nötig. Das bestehende Live-Projekt verwendet Workers Static Assets. Die Domain ist bereits eingerichtet; ein Feature-PR muss für den regulären Produktions-Build nach `main` gemergt werden.

### Medizinische Einordnung

Die konkrete Übungsauswahl und Progression sind kein klinisch validiertes Behandlungsprotokoll. Begrenzte Evidenz ist kein Heilversprechen: [Cochrane-Übersicht](https://www.cochrane.org/evidence/CD013449_myofunctional-therapy-oropharyngeal-mouth-and-throat-exercises-people-obstructive-sleep-apnoea). Warnzeichen richten sich nach [NHLBI](https://www.nhlbi.nih.gov/health/sleep-apnea/symptoms). Verordnete Therapien nicht ersetzen.

## Gesundheitlicher Hinweis

Leise ist kein Medizinprodukt und ersetzt keine Diagnose oder Behandlung. Bei beobachteten Atempausen, ausgeprägter Tagesmüdigkeit, nächtlichem Luftschnappen, morgendlichen Kopfschmerzen oder Herz-Kreislauf-Erkrankungen sollte eine mögliche Schlafapnoe ärztlich abgeklärt werden.

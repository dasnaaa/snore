# Leise – Schnarchtraining

Mobile-first PWA für ein vorsichtig formuliertes, zwölfwöchiges Training der Mund- und Rachenmuskulatur. Die App speichert Fortschritt und Einstellungen ausschließlich lokal und benötigt kein Konto.

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

# NOVO ACADEMY — Claude Handoff & Project Memory

> **Wichtig für jede Claude-Instanz:** Halte diese Datei aktuell. Nach jeder bedeutenden Änderung (neue Features, Bugfixes, neue Kurse, Deployment-Änderungen, Supabase-Schema-Änderungen) wird diese Datei sofort aktualisiert, damit die nächste Instanz — auf jedem Computer — nahtlos weiterarbeiten kann.

---

## ⚠️ GRUNDREGELN — VERBINDLICH FÜR ALLE (Mensch & KI)

**Dies ist ein LIVE-System mit echten, registrierten Nutzern.** Jede dieser Regeln gilt ohne Ausnahme. Im Zweifel: **nichts tun und nachfragen.**

1. **Keine Datenschutz- oder Security-Risiken öffnen.**
   - Keine Nutzerdaten (E-Mails, Namen, Fortschritt) leaken, in Logs/URLs/Query-Strings schreiben oder an externe Endpunkte senden.
   - Der **`service_role`-Key** gehört NIEMALS ins Frontend, ins Repo oder in diese Datei. Nur der **Anon-Key** ins Frontend.
   - **RLS-Policies** nie lockern oder deaktivieren. Keine Tabelle/keinen Endpunkt öffentlich lesbar machen.
   - Keine Secrets committen (`.env*` bleibt in `.gitignore`).

2. **Die Funktion bestehender Nutzer NIEMALS zerstören.**
   - Keine Änderung darf dazu führen, dass registrierte Nutzer ihren **Login, ihre Kurse, ihren Fortschritt oder ihre Zertifikate** verlieren.
   - **Kein Hard-Delete** von `auth.users` / `profiles` / `user_progress` — ausschließlich Soft-Delete (`deleted_at`).
   - **`uid` (Kurs-UUID) und `course_uid` NIE ändern** — daran hängt der gespeicherte Fortschritt. Ändern = Nutzer verlieren ihre Kurse.
   - Keine Breaking-Changes am Supabase-Schema ohne abwärtskompatible Migration. Auth-Flow (Email + Google) nie brechen.

3. **Nichts Unfertiges live stellen.**
   - Ein Push auf `main` = **sofortiger Live-Deploy**. Auf `main` kommt nur **fertiges, getestetes** (vorher lokal `npm run build`).
   - **Einzige Ausnahme: Videos.** Fehlende Videos sind ok — sie zeigen automatisch „VIDEO COMING SOON". Platzhalter erlaubt.
   - Alles andere Unfertige → **eigener Branch + Pull Request**, niemals direkt auf `main`.

4. **Diese `CLAUDE.md` ist Pflicht-Doku — laufend aktuell halten.**
   - Nach JEDER bedeutenden Änderung sofort aktualisieren: Changelog (Abschnitt 15) + betroffene Abschnitte. Neue Regeln/Konventionen ebenfalls hier eintragen.
   - Eine Änderung pushen, ohne `CLAUDE.md` zu aktualisieren, verstößt gegen die Grundregeln.

---

## 1. Projektübersicht

**NOVO ACADEMY** ist die offizielle Trainingsplattform von Novogenia GmbH.  
- 22 Kurse auf **Deutsch** + 22 Kurse auf **Englisch** (44 total)
- Themen: Genetik-Beratung, Gewicht, Ernährung, Sport, Detox, Burnout, Biologisches Alter, Supplements, Beauty, Pharmakogenetik, Werbrecht
- Nutzer können sich registrieren, Kurse absolvieren, Tests bestehen und ein **Zertifikat als PDF** herunterladen
- Admin-Panel für Nutzerverwaltung und Statistiken

**Live-URL:** https://academy.novopilot.com  (Custom Domain via GitHub Pages, „Enforce HTTPS" aktiv)
**GitHub-Repo:** https://github.com/Novogenia-AG/novo-academy  (Org-Repo; das alte `Novogenia/novo-academy` leitet per HTTP 301 weiter → `git push origin main` funktioniert weiterhin und triggert den Deploy)
**Lokaler Dev-Server:** http://localhost:5181/ (Port fix in vite.config.js; Dev-Base ist `/`)
**Production-Base:** `/` (Root, weil Custom Domain — gesetzt über `VITE_BASE_PATH=/` im Deploy-Workflow; NICHT mehr `/novo-academy/`)

---

## 2. Tech Stack

| Was | Womit |
|---|---|
| Frontend | React 18 + Vite 5 |
| Auth & DB | Supabase (eu-central-1, Projekt-Ref: `whjxtrrztfzhjqtsyqqf`) |
| Certificate PDF | pdf-lib + @pdf-lib/fontkit (Montserrat TTF) |
| Deployment | GitHub Pages via GitHub Actions |
| Fonts | Montserrat (@fontsource + lokale TTFs in /public/fonts/) |

---

## 3. Lokale Entwicklung

```bash
# Abhängigkeiten installieren
npm install

# .env.local anlegen (NICHT in Git committen!)
cp .env.example .env.local
# Dann .env.local befüllen (siehe Abschnitt 5)

# Dev-Server starten
npm run dev
# → http://localhost:5181/

# Produktions-Build
npm run build
```

**Ohne .env.local** fällt die App auf einen lokalen Mock-Auth (localStorage) zurück — UI ist voll nutzbar zum Entwickeln, aber kein echtes Supabase.

---

## 4. Dateistruktur

```
app/
├── src/
│   ├── App.jsx          — Haupt-App: alle Seiten, Routing, Komponenten
│   ├── data.js          — Deutsche Kursinhalte + i18n-Strings (t(lang, key))
│   ├── data.en.js       — Englische Kursinhalte (COURSES_EN, CATEGORIES_EN)
│   ├── auth.js          — Supabase Auth + Progress-Speicherung (mit Mock-Fallback)
│   ├── generateCert.js  — Zertifikat-PDF-Generator (pdf-lib)
│   └── styles.css       — Design-System (CSS-Variablen, alle Komponenten)
├── public/
│   ├── course-materials/  — PDFs, PPTX pro Kurs
│   ├── thumbnails/        — Kurs-Vorschaubilder
│   ├── fonts/             — Montserrat-TTFs (Light/Regular/Medium/SemiBold/Bold)
│   ├── cert-template.pdf  — Leeres Zertifikat-Design (wird mit pdf-lib befüllt)
│   ├── novogenia-logo.png — Logo für Zertifikat-Vorschau
│   └── signature.png      — Unterschrift für Zertifikat
├── supabase/
│   └── admin-schema.sql   — Vollständiges DB-Schema (profiles, RLS, Trigger, is_admin())
├── .github/workflows/
│   └── deploy.yml         — GitHub Actions: Build + Deploy auf GitHub Pages
├── .env.local             — ⚠️ NICHT in Git! Supabase-Keys (lokal anlegen)
├── .env.example           — Vorlage für .env.local
├── vite.config.js         — Vite-Konfig (base: /novo-academy/, port: 5181)
└── CLAUDE.md              — Diese Datei (Projekt-Gedächtnis)
```

---

## 5. Umgebungsvariablen (.env.local)

```
VITE_SUPABASE_URL=https://whjxtrrztfzhjqtsyqqf.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indoanh0cnJ6dGZ6aGpxdHN5cXFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNTk1MjQsImV4cCI6MjA5NTczNTUyNH0.aTklTt_kQqzyMCjx24XZvI1YZ0XMlUdxAsXegXfPXoo
```

> Der Anon-Key ist ein **Public Key** — er ist im Frontend-Bundle sichtbar und absichtlich so designed. Niemals den `service_role`-Key ins Frontend!

**GitHub Secrets** (für Deploy-Pipeline, bereits konfiguriert):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## 6. Supabase-Schema

Das vollständige Schema liegt in `supabase/admin-schema.sql`. Zusammenfassung:

### Tabellen

**`profiles`** — spiegelt `auth.users`, erweitert um App-Felder:
```sql
id          uuid PRIMARY KEY (= auth.users.id)
email       text
name        text        -- Anzeigename (User kann setzen)
lang        text        -- 'de' | 'en'
is_admin    boolean     DEFAULT false
created_at  timestamptz
last_seen_at timestamptz
deleted_at  timestamptz -- Soft-Delete (NULL = aktiv)
```

**`user_progress`** — ein Row pro User pro Kurs:
```sql
user_id     uuid (→ auth.users.id)
course_uid  text        -- eindeutige Kurs-ID aus data.js / data.en.js
watched     boolean
progress    integer
test_passed boolean
test_score  integer
updated_at  timestamptz
UNIQUE(user_id, course_uid)
```

### Trigger & Funktionen
- `handle_new_user()` — Trigger: legt automatisch ein `profiles`-Row bei jedem Signup an
- `is_admin()` — Security-Definer-Funktion: gibt `true` zurück wenn der aktuelle User Admin ist (für RLS)

### RLS-Policies
- User liest/schreibt nur eigene Rows
- Admin (via `is_admin()`) liest/schreibt alle Rows
- Soft-Delete: `deleted_at IS NOT NULL` = gelöschter User (kein Hard-Delete)

### Admin-User
```sql
UPDATE profiles SET is_admin = true WHERE email = 'evolutionnext696@gmail.com';
```

---

## 7. Architektur-Entscheidungen (wichtig zu verstehen)

### Asset-Pfade (GitHub Pages Subpath)
Die App läuft unter `/novo-academy/` (nicht Root). Alle Assets brauchen dieses Präfix.
- **`assetUrl(path)`** in `data.js` — für einzelne Asset-Pfade: `assetUrl('/signature.png')`
- **`prefixAssetPaths(obj)`** in `data.js` — walkt COURSES/HOME und prefixiert alle Asset-Strings
- **`_BASE`** in `generateCert.js` — für Font- und Template-URLs im PDF-Generator

### Sprachsystem
- **`LangContext`** + **`useLang()`** Hook in `App.jsx` — Sprache wird durch die ganze App propagiert
- **`t(lang, key)`** + i18n-Dictionary in `data.js` — alle UI-Strings übersetzt (60+ Keys)
- **`updateMyLang(lang)`** in `auth.js` — persistiert Sprache in Supabase profiles
- Kurse haben separates `lang`-Feld: `COURSES` (DE) in `data.js`, `COURSES_EN` in `data.en.js`

### Auth-Fallback
`auth.js` prüft via `USE_REAL`-Flag ob Supabase-Env-Vars gesetzt sind. Wenn nicht → localStorage-Mock. Das erlaubt lokales Entwickeln ohne Supabase-Account.

### Zertifikat (Multi-Page)
- Max. 16 Kurse pro Seite (`MAX_MODULES_PER_PAGE = 16`)
- Bei >16 Kursen: `pdf-lib` kopiert die Template-Seite mehrfach via `copyPages()`
- `drawCertPage()` zeichnet den jeweiligen Kurs-Slice auf jede Seite

### Namen aus E-Mail
- `prettyNameFromEmail(email)` — leitet lesbaren Namen aus E-Mail ab (z.B. `john.doe@...` → `John Doe`)
- `bestDisplayName(name, email)` — nimmt `name` wenn gesetzt, sonst `prettyNameFromEmail(email)`

---

## 8. Kurs-Struktur

### Deutsche Kurse (`src/data.js`)
22 Kurse in 10 Kategorien. Kurse haben folgende Felder:
- `id`, `uid` (UUID, stabil), `lang: 'de'`
- `youtubeId` (Single-Video) **oder** `videoSegments[]` (Multi-Video)
- `questions[]` (Multiple-Choice-Test)
- `documents[]` (downloadbare PDFs/PPTX)
- `contentType: 'course' | 'faq' | 'training'`

### Englische Kurse (`src/data.en.js`)
22 Kurse, spiegelbildlich zu DE, mit `lang: 'en'` und eigenen UUIDs.

### Videos — Aktueller Stand (Stand: 2026-06-03)

**Vorhandene EN-Videos:**

| Kurs | YouTube-ID |
|---|---|
| The Gene-Diet: Scientific Basis | p02EmbTNRqE |
| Eat Healthy by Your Genes: Scientific Basis | pRU2p2Banno |
| Athletic Performance: Scientific Basis | cdsMJEPUv5A |
| Detoxification: Scientific Basis | DbRx4Kjqkes |
| Healthy Skin & Appearance: Scientific Basis | IgNeWJ6tTng |
| Personalized Supplementation: Scientific Basis (`supp-sci-en`) | TIHnA7J6EP4 *(2026-06-02 ergänzt)* |
| Drug Intolerance / Pharmacogenetics: Scientific Basis (`pharma-sci-en`) | SgzAZyUIx-0 *(2026-06-02 ergänzt)* |
| Gene-Diet Consultation Training | 12 Segmente (siehe data.en.js) |
| Nutrition Consultation Training | 22 Segmente (siehe data.en.js) |
| Detox Consultation Training | 4 Segmente (aus Nutrition-Serie) |

**Fehlende EN-Videos (noch nicht aufgenommen → zeigen „VIDEO COMING SOON"):**
- Biological Age: Scientific Basis (`ba-sci-en`) — *falsches Video `udTodouyDsA` am 2026-06-02 entfernt, wartet auf richtiges*
- Burnout & Stress: Scientific Basis (`bo-sci-en`)
- Burnout & Stress: Consultation Training (`bo-report-en`)
- Biological Age: Consultation Training (`ba-report-en`)

### Long-Form-Quellvideos (für Heygen-Übersetzung)
Die englischen Analyseberatungs-Videos (4K) liegen lokal in zwei Ordnern (OneDrive, NICHT im Repo):
- Quelle: `…\SOME DANIEL - Dokumente\General\A - VIDEO AND REEL FOLDER\LONG FORM ENG\`
- Heygen-Eingang: `…\EXTERNAL MATERIAL - Dokumente\General\LONG FORM VIDEOS ENG\`
(34 Teile: Weight Management 1–11+36, Nutrition 12–33; Download via `yt-dlp` aus dem „10X Health"-Channel.)

---

## 9. Admin-Panel

Erreichbar über das Zahnrad-Icon (nur für `is_admin = true` User sichtbar).

### Features
- **Dashboard** — Nutzer-Statistiken: Gesamt, Aktiv (≥1 Kurs), Wachstum, Zertifikate, Sprach-Split
- **Nutzerliste** — alle User mit Details, Kurs-Status-Toggles
- **User-Aktionen** (Dropdown-Menü pro User):
  - Alle Fortschritte zurücksetzen
  - Umbenennen
  - Admin-Status vergeben/entziehen
  - Soft-Delete / Wiederherstellen
  - „Gelöschte anzeigen"-Toggle in der Toolbar

### Admin-Accounts
- `evolutionnext696@gmail.com` (Daniel Wallerstorfer) — Haupt-Admin

---

## 10. Deployment

### GitHub Actions (`.github/workflows/deploy.yml`)
- Trigger: Push auf `main`
- Build: `npm run build` mit Supabase-Secrets aus GitHub Repository Secrets
- Deploy: `peaceiris/actions-gh-pages` auf Branch `gh-pages`

### Manuell deployen
```bash
git add .
git commit -m "feat: beschreibung"
git push origin main
# → GitHub Actions baut automatisch und deployed
```

### GitHub Pages Einstellungen
- Repo: `https://github.com/Novogenia-AG/novo-academy` (PUBLIC — Org auf Free-Plan)
- Branch: `gh-pages` (wird von Actions verwaltet)
- **Custom Domain:** `academy.novopilot.com` (in `public/CNAME`; DNS-CNAME → `novogenia-ag.github.io`; „Enforce HTTPS" aktiv)
- **Base URL:** `/` (Root, wegen Custom Domain) — Deploy setzt `VITE_BASE_PATH=/`
- ⚠️ **Cache-Falle:** GitHub Pages liefert `index.html` mit `max-age=600`. Nach einem Deploy zeigt ein zwischengespeicherter Browser bis zu 10 Min eine **weiße Seite** (alte index.html referenziert ein gelöschtes JS-Bundle → 404). Lösung für Tester: Hard-Reload (`Strg+Shift+R`).

---

## 11. Bekannte offene Punkte / TODOs

### Hoch-Priorität
- [ ] **9 große Download-Dateien (>100 MB) liefern live 404** — sie sind gitignored (GitHub lehnt >100 MB ab) und fehlen im CI-Build. Liste siehe `.gitignore` („Large assets"). Fix: nach **Supabase Storage** (oder R2) hochladen, öffentlich machen, Links in `data.js`/`data.en.js` umstellen. **Achtung:** Diese Dateien liegen NICHT im Repo, nur im lokalen OneDrive-Ordner.
- [ ] Fehlende EN-Videos aufnehmen (siehe Abschnitt 8)
- [ ] EN-Version der Werberichtlinie PDF (aktuell zeigt `legal-basics-en` keine Downloads)

### Mittel-Priorität
- [ ] Demo-Reports auf Englisch übersetzen (aktuell nur DE verfügbar; EN-Kurse zeigen keine Downloads)
- [ ] Save-Progress Debounce (Race Condition bei schnellem Klicken)
- [ ] `loadProgress`-Race-Condition beim initialen Load

### Niedrig-Priorität
- [ ] `confirm()` / `alert()` durch schönere Modal-UX ersetzen
- [ ] Aria-Labels auf Englisch für Screen-Reader (`scroll-btn`, `FullVideo`)
- [ ] Hard-Delete von `auth.users` (bräuchte Edge Function mit `service_role`-Key; aktuell nur Soft-Delete)

---

## 12. Wichtige Muster (Code-Konventionen)

### Neuen DE-Kurs hinzufügen
1. Objekt in `COURSES`-Array in `src/data.js` einfügen
2. `uid` muss eine eindeutige UUID sein (nie doppelt verwenden)
3. `initialWatched: false, initialTestPassed: false` immer setzen
4. Assets mit `assetUrl('/pfad/zur/datei')` referenzieren

### Neuen EN-Kurs hinzufügen
1. Objekt in `COURSES_EN`-Array in `src/data.en.js` einfügen
2. Gleiche Regeln wie DE, `lang: 'en'` setzen
3. Wenn kein Video vorhanden: `youtubeId` weglassen (App zeigt automatisch "VIDEO COMING SOON")

### Neuen i18n-String hinzufügen
1. Key zum Dictionary in `data.js` (Funktion `t()`) hinzufügen
2. Beide Sprachen (`de` + `en`) befüllen
3. Im Code: `const tl = useT(); tl('meinKey')` oder `t(lang, 'meinKey')`

### CSS-Variablen (Design-System)
```css
--wine: #5e0047       /* Hauptfarbe Novogenia */
--wine-soft: #f5e9ef  /* Heller Hover-Hintergrund */
--border: #e0d8df
--text: #1a1a1a
--muted: #8a7a88
```

---

## 13. Supabase Dashboard

- URL: https://supabase.com/dashboard/project/whjxtrrztfzhjqtsyqqf
- Region: eu-central-1 (Frankfurt)
- Auth-Anbieter: Email/Passwort + Google OAuth
- Google OAuth Callback: `https://whjxtrrztfzhjqtsyqqf.supabase.co/auth/v1/callback`
- Site URL: `https://academy.novopilot.com` (in Supabase Auth → URL Configuration; Redirect-URLs ebenfalls)

---

## 14. Google OAuth (Supabase)

- Google Cloud Console Projekt: `novo-academy-497920`
- OAuth-Client konfiguriert für: `https://whjxtrrztfzhjqtsyqqf.supabase.co/auth/v1/callback`
- Redirect URLs in Supabase: `https://academy.novopilot.com`
- OAuth-Consent-Screen „App name" = **NOVO ACADEMY** (In Produktion) → neue Nutzer sehen „Bei NOVO ACADEMY anmelden", nicht mehr die Supabase-URL

---

## 15. Änderungslog (neueste zuerst)

| Datum | Änderung |
|---|---|
| 2026-06-08 | **Security- & Code-Qualitäts-Review (ganze Academy)**: Systematischer Scan — keine gefährlichen Patterns (`dangerouslySetInnerHTML`/`innerHTML`/`eval`/`document.write` = 0), kein `message`-Listener (kein eingehender postMessage-XSS-Vektor), keine echten Secrets in getrackten Dateien (nur der **public** Anon-Key, by-design), `npm audit prod` = 0 Vulns (die 2 moderate esbuild/vite betreffen nur den Dev-Server, nicht den Static-Build), CI `deploy.yml` least-privilege + Secrets korrekt. **1 Härtung umgesetzt:** YouTube-`postMessage` von Wildcard `'*'` auf exakte Origin `https://www.youtube.com` umgestellt (`App.jsx` `ytUnmuteOnLoad`) — Player-Befehle gehen nicht mehr an beliebige Fenster. CSP/Security-Header (`index.html`), Rate-Limiter, Input-Validierung, RLS-geschützte Admin-Queries und Soft-Delete-`is_admin`-Reset wurden geprüft = bereits solide, keine Änderung nötig. |
| 2026-06-08 | **Senior-QA-Pass (ganze Academy)**: Vollständiger Defekt-Scan über `data.js` + `data.en.js` — 90 YouTube-Videos (alle abrufbar), 46 Download-Dokumente (alle OK), alle Thumbnails/Cover, keine doppelten UIDs, 168 i18n-Keys mit DE+EN-Parität, alle 132 genutzten `t`-Keys vorhanden, kein zertifizierbarer Kurs ohne Test → **0 Datendefekte**. Code-Review `App.jsx`: **1 HIGH-Bug gefixt** — bei Vor/Zurück-Navigation auf einen nach einem Deploy entfernten/umbenannten `courseId` lieferte `courseById()` `undefined` → ungeschützter Zugriff → **Weißer-Bildschirm-Crash der ganzen SPA**. Fix: 4 Guards in den Kurs-Render-Branches (ungültiger Kurs → Fallback auf Home). Zusätzlich **globaler `ErrorBoundary`** (`src/ErrorBoundary.jsx`, in `main.jsx` um `<App/>`) als Schutznetz — jeder unvorhergesehene Render-Fehler zeigt jetzt einen freundlichen DE/EN-Fallback statt weißer Seite; Fortschritt bleibt gespeichert. |
| 2026-06-08 | **Beauty-Wissenschaftsvideo repariert**: eingebettetes `8RVq0Qp4r64` (Modul „Gesunde Haut → Wissenschaftliche Basis") war **vom Kanal gelöscht** → Modul live kaputt. Per Kanal-Inventur (215 Videos) korrektes Video gefunden: `5A5XoWH7XKk` „BEAUTY. Die 9 Faktoren des Alterns" (30:31, public; exakter Datei-/Titel-Abgleich mit `LONG FORM GER\BEAUTY…mp4`). ID ersetzt. **Tooling:** `Temp\yt_inventory.py` (listet Kanal + Privacy), Dump in `Temp\yt_inventory.json`. |
| 2026-06-08 | **#3b DE-Supplements-Video gelöst**: Aus „Gesund oder ungesund?" (`79MPy6BFqu8`) den Supplements-Teil (13:23–Ende) per yt-dlp herausgeschnitten → eigenes Video, **public** auf YouTube hochgeladen (`WV2pfawe6zI`, Titel „Personalisierte Nahrungsergänzung – Wissenschaftliche Basis", Kanal Dr. Daniel Wallerstorfer) → in DE-Modul `supp-sci` eingebunden. Vollvideo zusätzlich in `LONG FORM GER\Personalisierte Nahrungsergaenzung.mp4` abgelegt. |
| 2026-06-05 | **#5 Schreibweise final**: letzte Bindestrich-Variante „Genetics-Coach" (`landing_feature_certs_d`) korrigiert. Konvention: **DE „Genetik Coach", EN „Genetics Coach"** (bewusst sprachabhängig; Zertifikat schon korrekt). Re-Test (Sandra, 5.6.) bestätigt #1/#3/#4/#7 erledigt. Offen: #2 Downloads (Release noch nicht publiziert), #3b DE-Supplements-Video, #6 Zert-Umfang (Entscheidung). |
| 2026-06-03 | **#7 FAQ-Cover vereinheitlicht**: Die 5 generischen FAQ-Thumbnails (wm/nut/pg/bo/supp-faq) durch gebrandete „?"-Cover ersetzt (Stil wie ba-faq/beauty-faq). Per HTML-Template + Headless-Chrome gerendert → `public/thumbnails/*-faq-cover.jpg`. |
| 2026-06-03 | **QA-Fixes (Sandras Testbericht)**: #1 Fortschritt zählt nur noch zertifizierbare Module (100 % erreichbar); #3 DE `supp-sci` falsches Video (n9pkNybj1LU = Ernährung) entfernt → Platzhalter; #4 Test-Erfolgsmeldung klargestellt (zertifiziert erst nach Training-Abschluss); #5 DE-Marketing „Genetics Coach" → „Genetik Coach" (neuer i18n-Key `brand_coach`). Offen: #2 Downloads (Hosting), #6 Zert-Umfang (pharma braucht Test), #7 FAQ-Thumbnails. |
| 2026-06-03 | **SOP „Schulungen anlegen"** ergänzt (Abschnitt 18): Video → YouTube-Transkript → MC-Fragen aus Transkript, aktiv nach Zusatzmaterial fragen, Modulstruktur (Wissenschaft → Beratung → FAQ), Material-Fallback Englisch, Test-Fragen an übersetztes Video anpassen (keine 1:1-Übersetzung) |
| 2026-06-03 | **Verbindliche Grundregeln** ergänzt (siehe ganz oben): Live-System-Schutz — keine Datenschutz/Security-Risiken, Funktion bestehender Nutzer nie zerstören, nichts Unfertiges live (außer Videos), CLAUDE.md-Pflicht. Gilt für neue Mitarbeiter. |
| 2026-06-03 | 34 englische Analyseberatungs-Videos (4K) via yt-dlp heruntergeladen → `LONG FORM ENG` + Kopie nach `EXTERNAL MATERIAL\…\LONG FORM VIDEOS ENG` (Heygen-Quellen) |
| 2026-06-03 | **Zurück/Vorwärts-Navigation** via History API (Browser-/Handy-Zurück funktioniert im SPA-Router) |
| 2026-06-03 | **Fix: weiße Seite am Handy** — `.app.no-sidebar { flex-direction: column }`. `.app` war flex-`row`, der `<footer>` als Flex-Geschwister verdrängte `<main>` auf 0px Breite. (Ausgelöst durch das `overflow-x:hidden` aus dem Responsive-Pass.) |
| 2026-06-03 | **Responsive Mobile-Pass** (styles.css): Swipe-Kacheln, ausgeblendete Scroll-Buttons, getrimmte Paddings/Typo, 4K-Zertifikat skaliert, 16px-Inputs gegen iOS-Zoom |
| 2026-06-02 | EN-Videos: Supplements (`TIHnA7J6EP4`) + Pharmacogenetics (`SgzAZyUIx-0`) ergänzt; Biological Age falsches Video (`udTodouyDsA`) entfernt → Platzhalter |
| 2026-06-02 | **Custom Domain** `academy.novopilot.com` + „Enforce HTTPS"; **Repo-Migration** `Novogenia` → Org `Novogenia-AG`; `VITE_BASE_PATH=/` (Base von `/novo-academy/` auf `/`) |
| 2026-06-02 | **TDZ-Bugfix** (weiße Seite): ein `useEffect` referenzierte `lang` vor dessen `const`-Deklaration → „Cannot access 'lang' before initialization". `useEffect` hinter die Deklaration verschoben |
| 2026-06-01 | `prettyNameFromEmail()` + `bestDisplayName()` — Namen aus E-Mail werden kapitalisiert für Zertifikat-Vorschlag |
| 2026-06-01 | Admin: Soft-Delete / Undelete, Rename, Admin-Promote, Progress-Reset (User-Actions-Menü) |
| 2026-06-01 | Multi-Page Zertifikat: >16 Kurse splitten auf mehrere PDF-Seiten |
| 2026-06-01 | Admin-Panel: Dashboard (Statistiken + Sparkline) + Nutzerliste + Kurs-Toggles |
| 2026-06-01 | Fix: Neue Signups starten ohne vorzertifizierte Kurse (`buildInitialState()` gibt immer false) |
| 2026-06-01 | Supabase-Integration: Auth, Fortschritt, Profile, RLS, is_admin() |
| 2026-06-01 | GitHub Pages Deployment + Google OAuth |
| 2026-06-01 | EN-Übersetzung: alle UI-Strings, LangContext, t()-Dictionary |
| 2026-06-01 | Asset-Pfad-Fix: assetUrl() + prefixAssetPaths() für /novo-academy/ Subpath |
| 2026-06-01 | Englische Kursinhalte (data.en.js) mit korrekten Video-IDs |

---

## 16. Hinweis für die nächste Claude-Instanz

Bitte halte **diese Datei aktuell** nach jeder bedeutenden Änderung:
- Neue Features → Abschnitt 15 (Changelog) + ggf. Abschnitt 7/8/9
- Neue Kurse oder Videos → Abschnitt 8
- Schema-Änderungen → Abschnitt 6
- Neue TODOs → Abschnitt 11
- Deployment-Änderungen → Abschnitt 10

Ziel: Wer diese Datei liest + Zugriff auf den Ordner hat, kann sofort auf jedem Computer weiterarbeiten — ohne diese Konversation zu kennen.

---

## 17. Onboarding für neue Mitarbeiter / weitere Computer

> **Wichtigste Regel:** Der **Code** kommt aus **GitHub**, NICHT aus dem geteilten OneDrive-Ordner.
> OneDrive + `.git` + `node_modules` führt zu Sync-Konflikten und kaputten Builds. Der OneDrive-Ordner
> ist nur für die großen **Medien-Assets** (Videos, Master-Dateien) sinnvoll, die nicht im Repo liegen.

### Voraussetzungen (auf dem neuen Rechner installieren)
- **Git** — https://git-scm.com
- **Node.js LTS** (v20+; getestet mit v24) + npm — https://nodejs.org
- **Claude Code** (CLI) — damit diese `CLAUDE.md` automatisch gelesen wird
- Ein **GitHub-Account**

### Was der Repo-Owner (Daniel) einmalig tun muss
1. **GitHub-Zugriff geben:** github.com/Novogenia-AG/novo-academy → *Settings → Collaborators* (bzw. Org *People → Teams*) → den Kollegen mit **Write**-Rolle einladen. (Repo ist public, also *lesen/klonen* geht ohne Einladung — zum **Pushen** braucht er Write.)
2. **`.env.local` sicher übermitteln** (NICHT über Git/öffentlich): die zwei Zeilen aus Abschnitt 5. Der Anon-Key ist public-by-design, aber sauber ist es, ihn direkt zu schicken (z.B. 1Password/Teams-DM).
3. *(Optional)* Den OneDrive-Medienordner (`SOME DANIEL` / `EXTERNAL MATERIAL`) für die Videos teilen — nur falls der Kollege an den Long-Form-Videos arbeitet.
4. *(Optional, nur bei DB-Arbeit)* Supabase-Projekt-Zugriff einladen (supabase.com/dashboard → Project → *Team*). Für reine Frontend-Arbeit nicht nötig.

### Was der Kollege zum Vorbereiten tut
```bash
# 1. Repo an einen LOKALEN Ort klonen (NICHT in einen OneDrive-Ordner!)
git clone https://github.com/Novogenia-AG/novo-academy.git
cd novo-academy

# 2. .env.local anlegen (Inhalt von Daniel, siehe Abschnitt 5)
#    Windows PowerShell: New-Item .env.local ; dann Inhalt einfügen

# 3. Abhängigkeiten installieren
npm install

# 4. Dev-Server starten
npm run dev        # → http://localhost:5181/

# 5. Änderung committen + deployen (löst automatisch den Live-Deploy aus)
git add .
git commit -m "feat: beschreibung"
git push origin main
```
Ohne `.env.local` läuft die App im **Mock-Modus** (localStorage statt Supabase) — gut zum UI-Entwickeln, aber ohne echte Logins/Daten.

### Wichtige Regeln für die Zusammenarbeit
- **Diese `CLAUDE.md` nach jeder bedeutenden Änderung aktualisieren** (Changelog Abschnitt 15).
- **`.env.local` niemals committen** (steht in `.gitignore`).
- **`service_role`-Key niemals ins Frontend / Repo.**
- Auf `main` pushen = sofortiger Live-Deploy. Für größere Experimente einen **Branch** nutzen und per Pull Request mergen.
- Vor dem Pushen lokal `npm run build` laufen lassen (fängt Build-Fehler ab, bevor der Deploy rot wird).

---

## 18. Schulungen anlegen — Standard-Ablauf (SOP)

**Wenn ein neues Schulungsvideo + Thema geliefert wird, läuft IMMER genau dieser Ablauf ab.**
Ziel: konsistente, korrekt strukturierte Kurse — auf jedem Computer, in jeder Sprache, ohne Rückfragen zur Struktur.

### A. Pro Video (geliefert wird: Video-Link + Thema + Sprache)
1. **Video einbetten wie gewohnt** — `youtubeId` (Einzelvideo) bzw. `videoSegments[]` (Mehrteiler) in das passende Kurs-Objekt der Sprachdatei (`data.js` = DE, `data.en.js` = EN, weitere Sprachen analog).
2. **Transkript von YouTube holen** — das Transkript/die Untertitel des gelieferten Videos sind die **inhaltliche Quelle der Wahrheit** (z. B. `yt-dlp --write-auto-subs --write-subs --sub-langs <lang> --skip-download <url>`). Kein Transkript verfügbar → nachfragen.
3. **Multiple-Choice-Test aus dem Transkript erstellen** — im Stil der bestehenden Tests: **5–7 Fragen**, je 4 Optionen, genau eine korrekt (`questions[]` mit `q` / `options` / `correct`). Die Fragen müssen den **tatsächlichen Video-Inhalt** prüfen, nicht Allgemeinwissen.
4. **Aktiv nach Zusatzmaterial fragen** — den Lieferanten um Dokumente bitten (Folien-PPTX, Demo-Berichte, Science-PDFs) für `documents[]`. (Große Dateien >100 MB → nicht ins Repo, separates Hosting, siehe Asset-Regeln.)

### B. Kursstruktur pro Thema (die „Form" der Schulung)
Jedes Thema bekommt — soweit Material vorhanden — diese Module, immer in dieser Reihenfolge:

| Modul | `contentType` | Wann |
|---|---|---|
| **Wissenschaftliche Basis** | `course` (Einzelvideo + Test) | **immer** |
| **Beratungsschulung** | `course` (`videoSegments[]` + ggf. Test) | **wenn verfügbar** |
| **Häufige Fragen (FAQ)** | `faq` (Accordion) | **wenn verfügbar** |

### C. Mehrsprachigkeit (wichtig für künftige Sprach-Videos)
- Jede Sprache hat **eigene Kurs-Objekte** mit eigenen `uid`s und `lang`-Feld.
- **Material-Fallback:** Solange es für eine Sprache **keine eigenen Materialien** (Dokumente/Demo-Berichte) gibt → die **englischen Materialien** verwenden (Englisch ist der Fallback, nicht Deutsch). Sobald sprach-eigene Materialien geliefert werden → ersetzen.
- **Test-Fragen bei übersetzten / lip-synced Videos:** Die Fragen werden aus dem Transkript der **jeweiligen Sprachversion** generiert und an deren **tatsächlichen Inhalt angepasst** — **KEINE 1:1-Übersetzung** der Original-Fragen. (Übersetzte Videos weichen inhaltlich oft leicht ab; die Fragen müssen zum tatsächlich gesprochenen Video passen.)
- Fehlt ein Video in einer Sprache → `youtubeId` weglassen → zeigt automatisch „VIDEO COMING SOON".

### D. Abschluss jeder neuen Schulung
- `uid` neu & eindeutig (nie wiederverwenden); `initialWatched: false`, `initialTestPassed: false`.
- Assets über die bestehenden Pfad-Helfer referenzieren.
- **`CLAUDE.md` aktualisieren** (Abschnitt 8 Video-Stand + Changelog Abschnitt 15).
- Lokal `npm run build` testen → dann committen/pushen (Unfertiges nur per Branch + PR — siehe Grundregeln).

# NOVO ACADEMY — Content-Verzeichnis

Dieses Verzeichnis enthält die **Quelldaten** für alle Kurse der NOVO ACADEMY.

Jeder Kurs ist ein eigenständiger Ordner unter `content/courses/<course-id>/`.
Daraus speist sich beim Build die zentrale `src/data.js`.

---

## Workflow mit Claude Cowork

Für neue Kurse:

1. **Cowork beauftragen** — z. B.:
   *„Mach mir einen neuen Kurs zu Schlaf und Genetik. ID = sleep-sci."*
2. Cowork erstellt automatisch:
   `content/courses/sleep-sci/` mit allen Template-Dateien
3. Du **füllst die Texte aus** und **legst die Asset-Dateien** (PPTX, PDFs) in
   `documents/` ab
4. **Build neu starten** — der neue Kurs erscheint automatisch in der Plattform

---

## Ordner-Schema pro Kurs

```
content/courses/<course-id>/
├── course.json          ← Pflicht — Metadaten (ID, Kategorie, Topic, Tags)
├── article.md           ← Optional — Texteinhalte für `training`-Kurse
├── questions.json       ← Optional — Test-Fragen für zertifizierbare Kurse
├── faqs.json            ← Optional — Q&A-Paare für `faq`-Kurse
└── documents/
    ├── powerpoint.pptx
    ├── demo-bericht.pdf
    └── ...
```

---

## `course.json` — Pflicht-Felder

```jsonc
{
  "id": "sleep-sci",                              // einzigartig, Kebab-Case
  "category": "Schlaf und Erholung",              // Section-Title
  "topic": "Wissenschaftliche Basis",             // "Wissenschaftliche Basis" | "Beratungsschulung" | "Häufige Fragen"
  "contentType": "course",                        // "course" | "training" | "faq" | "supplementary"
  "description": "Kurze Tile-Beschreibung",
  "longDescription": "Ausführlicher Text für die Detail-Seite.",
  "bullets": [
    "Was Schlaf-Genetik wirklich aussagt",
    "PER3, CLOCK, BMAL1 — die wichtigsten Gene",
    "Praktische Schlaf-Empfehlungen"
  ],
  "thumbnail": "/thumbnails/course-sleep.jpg",
  "youtubeId": "ABC123XYZ",                       // Optional
  "coverImage": "/thumbnails/sleep-sci-cover.jpg", // Optional, wenn YT-Thumb nicht verfügbar
  "introQuestionsHeader": "In dieser Schulung lernst du:",
  "introQuestions": [
    "Wie steuern Gene meinen Schlaf?",
    "Bin ich Lerche oder Eule — und kann ich das ändern?"
  ],
  "postVideoText": "Mit diesem Hintergrund...",
  "hasDownload": true,
  "hasText": false,
  "documents": [
    {
      "title": "NovoAcademy Folien - Schlaf und Erholung",
      "size": "78 MB",
      "type": "pptx",
      "thumbnail": "/thumbnails/pptx-template.jpg",
      "url": "/course-materials/sleep/Schulungsfolien_Sleep.pptx"
    }
  ]
}
```

---

## Naming-Konvention für Dokumente

| Typ | Deutsch | Englisch |
|---|---|---|
| PowerPoint | `NovoAcademy Folien - <Titel>` | `NovoAcademy Slides - <title>` |
| Demo-Bericht | `NovoAcademy Demo Bericht - <Titel>` | `NovoAcademy Demo Report - <title>` |
| Science PDF | `NovoAcademy Science PDF - <Titel>` | `NovoAcademy Science PDF - <title>` |
| FAQ PDF | `NovoAcademy FAQ PDF - <Titel>` | `NovoAcademy FAQ PDF - <title>` |

---

## `questions.json` — Test-Fragen

```jsonc
[
  {
    "q": "Welches Gen steuert den circadianen Rhythmus?",
    "options": ["MTHFR", "PER3", "CYP1A2", "FTO"],
    "correct": 1
  }
]
```

Mindestens **5 Fragen** pro Test. `correct` ist 0-basiert (Index der richtigen Option).

---

## `faqs.json` — Q&A-Paare

```jsonc
[
  {
    "title": "Grundlagen — Schlaf-Genetik",
    "items": [
      { "q": "Was ist circadianer Rhythmus?", "a": "Der ~24h-Zyklus..." },
      { "q": "Bin ich Lerche oder Eule?", "a": "Genetisch wird das hauptsächlich..." }
    ]
  },
  {
    "title": "Praktische Tipps",
    "items": [...]
  }
]
```

---

## `article.md` — Texteinhalte (für `training`-Kurse ohne Video)

Standard-Markdown. Wird in `articleSections` umgewandelt: jede `## Section`
wird zu einer eigenen Sektion. Spezielle Direktiven:

```markdown
## Werben mit Bluttests

Bluttests sind weit verbreitet.

- {safe} „Wir testen Blut."
- {safe} „Wir diagnostizieren Mängel."
- {critical} „Wir heilen deine Krankheit."
- {caveat} „Wir geben Empfehlungen — siehe Disclaimer."

> {safe} Beispiel-Callout: „Trägt zu normaler Haut bei" — zulässiger Health Claim.
```

`{safe}` / `{critical}` / `{caveat}` werden in farbcodierte Bullets/Callouts
übersetzt (grün / rot / orange).

---

## Asset-Dateien (PowerPoints, PDFs)

Liegen in `public/course-materials/<topic>/<filename>` — dort referenziert
die `url` in `course.json` direkt darauf. Cowork legt beim Anlegen eines
neuen Kurses einen passenden Topic-Ordner an und du lädst die Files dort hoch.

---

## Kurs ausblenden

Über das **Admin-Panel** in der Plattform (Zahnrad rechts oben, Passwort `Novosapiens`).
Visibility-Flags werden im Browser-localStorage gespeichert — die Kurs-Definition
bleibt in `content/` unverändert.

---

## Bestehende Kurse als Vorlage

Schau in `src/data.js` — alle aktuell 21 Kurse sind dort definiert. Jeder
folgt dem gleichen Schema, das oben dokumentiert ist. Cowork kann diese
Vorlagen direkt referenzieren bei der Generierung eines neuen Kurses.

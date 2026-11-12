# Arbeits-Vault

Journal, Wiki (PARA) und Planung in einem Obsidian-Vault. Nur Core-Plugins, alles reine Markdown-Dateien.

## Auf einem neuen Rechner aufsetzen

Voraussetzungen: Obsidian, Node.js ab Version 18 (nur für die Skripte), optional git.

1. Ordner an den gewünschten Ort kopieren (oder `git clone`).
2. In Obsidian: "Ordner als Vault öffnen" und diesen Ordner wählen.
3. Einstellungen → Core-Plugins aktivieren: **Tägliche Notizen**, **Vorlagen**, **Bases**, **Rückverweise**, **Suche**.
4. Prüfen, ob die mitgelieferte Konfiguration aus `.obsidian/` übernommen wurde. Falls nicht, von Hand eintragen:
   - Tägliche Notizen → Datumsformat: `YYYY/YYYY-MM/YYYY-MM-DD`
   - Tägliche Notizen → Speicherort: `journal`
   - Tägliche Notizen → Vorlage: `templates/daily`
   - Tägliche Notizen → "Beim Start öffnen": **aus**
   - Vorlagen → Ordner: `templates`
5. `Start.md` öffnen. Die Übersichten sind leer, aber ohne Fehlermeldung.
6. Skripte testen: `node scripts/collect-todos.mjs` muss "0 offene Todos" melden.
7. Nur für Azure DevOps: `scripts/ado.config.json` ausfüllen und `AZDO_PAT` setzen (siehe unten). Der Token liegt nie im Vault und muss auf jedem Rechner neu gesetzt werden.

Zum Mitnehmen zwischen Rechnern reicht der Ordner. Mit git: `git init`, committen, auf dem anderen Rechner klonen; `.gitignore` schließt die rechnerabhängigen Fensterlayouts aus.

## Struktur

```
Start.md                    Einstieg: aktive Projekte, Termine, Todos

journal/2026/2026-11/       Zeitachse, ein Ordner pro Monat
  2026-11.md                Monatsplanung (Template "month")
  2026-11-12.md             Daily, nur wenn du eine anlegst
meetings/                   eine Seite pro Besprechung
termine/                    Termine und Deadlines als Seiten

1-projekte/                 hat ein Ergebnis und ein Zieldatum
2-bereiche/                 dauerhafte Verantwortung
  karriere/                 Karriereplan, 12-Monats-Ziele
3-ressourcen/               Wissen, Nachschlagbares
4-archiv/                   Abgeschlossenes

bases/                      Übersichten (Bases)
templates/                  Vorlagen
scripts/                    Auswertungen (Node, ohne Abhängigkeiten)
_generated/                 Ausgabe der Skripte, nicht von Hand bearbeiten
metrics/                    Azure-DevOps-Auswertungen
AGENTS.md                   Regeln für den Assistenten
```

Journal, Meetings und Termine sind nach Zeit sortiert und bleiben außerhalb von PARA. Die Verbindung läuft über Properties: ein Meeting trägt `projekt: "[[Projektname]]"` und erscheint dann auf der Projektseite.

## Erste Schritte

1. `2-bereiche/karriere/karriereplan.md` und `12-monats-ziele.md` ausfüllen.
2. Für jedes laufende Vorhaben eine Seite in `1-projekte/` anlegen, Vorlage `projekt`.
3. Für jede dauerhafte Verantwortung eine Seite in `2-bereiche/`, Vorlage `bereich`.

## Im Alltag

| Was | Wie |
|---|---|
| Daily | Kalender-Symbol links oder Befehl "Heutige tägliche Notiz öffnen" |
| Meeting | neue Notiz in `meetings/`, Name `YYYY-MM-DD Titel`, Vorlage `meeting`, `projekt` eintragen |
| Projekt | neue Notiz in `1-projekte/`, Vorlage `projekt`, `ziel` und `zieldatum` setzen |
| Wissensseite | neue Notiz in `3-ressourcen/`, Vorlage `note` |
| Termin | neue Notiz in `termine/`, Name `YYYY-MM-DD Titel`, Vorlage `termin` |
| Neuer Monat | Ordner `journal/YYYY/YYYY-MM/`, darin `YYYY-MM.md`, Vorlage `month` |
| Projekt abschließen | `status: abgeschlossen` setzen, Seite nach `4-archiv/` ziehen |
| Todo | `- [ ] Text @2026-11-20 #thema` an beliebiger Stelle; abhaken an der Originalstelle |

Vorlage einfügen: Befehlspalette (Strg/Cmd+P) → "Vorlage einfügen".

Bereich oder Ressource? Trägst du dafür Verantwortung, ist es ein Bereich. Interessiert es dich nur, eine Ressource. Im Zweifel Ressource.

## Todo-Übersicht

```
node scripts/collect-todos.mjs
```

Schreibt `_generated/offene-todos.md`, sortiert nach Fälligkeit. Bei Bedarf zeitgesteuert, z. B. per cron oder Windows-Aufgabenplanung:

```
30 7 * * 1-5 cd /pfad/zum/vault && node scripts/collect-todos.mjs
```

`Start.md` enthält zusätzlich eine Live-Suche über alle offenen Checkboxen, unsortiert und ohne Fälligkeiten. Eine Base kann das nicht, weil Bases nur Properties liest.

## Kennzahlen aus Azure DevOps

Läuft nur, wenn du es startest.

1. In Azure DevOps einen Personal Access Token anlegen, nur lesend: **Code (Read)**, **Build (Read)**, **Work Items (Read)**.
2. `scripts/ado.config.json` ausfüllen: `baseUrl` (z. B. `https://dev.azure.com/meine-org`) und `project`.
3. Token als Umgebungsvariable `AZDO_PAT` setzen und starten:

```
node scripts/ado-metrics.mjs                 # laufender Monat
node scripts/ado-metrics.mjs --monat 2026-10
```

Ergebnis: `metrics/YYYY-MM.md` (Übersicht, verlinkt auf die Monatsdatei) und Rohdaten in `metrics/raw/`.

| Einstellung | Bedeutung |
|---|---|
| `scope` | `mine` = PRs, die du erstellt oder reviewt hast. `all` = alle PRs im Projekt. |
| `namen` | `false` = andere Personen erscheinen als stabiles Kürzel (`P-1a2b3`), du als "ich". `true` = Klarnamen. |
| `repositories` | Liste von Repo-Namen; leer = alle. |
| `inProgressStates` | Status, die als "in Bearbeitung" zählen. An euren Prozess anpassen. |
| `doneStates`, `bugTypes`, `areaPath` | Für die Bug-Zählung; `areaPath` grenzt auf euren Bereich ein. |

Hinter einem Firmen-Proxy: Node ab Version 24 mit `NODE_USE_ENV_PROXY=1` starten, damit `HTTPS_PROXY` beachtet wird.

Skript erweitern: Neue PR-Kennzahlen kommen als Feld in `prRecord` dazu, neue Work-Item-Kennzahlen in `workItemRecord`; die Markdown-Ausgabe steht am Ende der Datei.

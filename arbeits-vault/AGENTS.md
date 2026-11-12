# Regeln für den Assistenten

Dieses Vault ist das Arbeitsjournal und Wiki von Chris. Du liest und schreibst hier Markdown-Dateien direkt.

## Aufbau

Zwei Achsen: Zeit (Journal, Meetings, Termine) und Handlungsbezug (PARA).

| Ordner | Inhalt | `type` |
|---|---|---|
| `journal/YYYY/YYYY-MM/YYYY-MM.md` | Monatsplanung | `month` |
| `journal/YYYY/YYYY-MM/YYYY-MM-DD.md` | Daily | `journal` |
| `meetings/YYYY-MM-DD Titel.md` | Besprechung | `meeting` |
| `termine/YYYY-MM-DD Titel.md` | Termin oder Deadline | `termin` |
| `1-projekte/` | hat ein Ergebnis und ein Zieldatum | `projekt` |
| `2-bereiche/` | dauerhafte Verantwortung; `karriere/` enthält Karriereplan und 12-Monats-Ziele | `bereich`, `goal` |
| `3-ressourcen/` | Wissen und Nachschlagbares ohne Verpflichtung | `note` |
| `4-archiv/` | abgeschlossene Projekte, inaktive Bereiche | wie zuvor |
| `metrics/` | Azure-DevOps-Auswertungen | `metric` |
| `_generated/` | Skript-Ausgaben | `generated` |
| `Start.md` | Einstiegsseite mit Übersichten | `start` |

Nicht jeder Tag hat eine Daily. Fehlende Tage sind normal und kein Fehler; lege keine Dailies rückwirkend an.

## PARA-Regeln

- **Projekt:** endet irgendwann und hat ein benennbares Ergebnis. Properties `status` (`aktiv`, `pausiert`, `abgeschlossen`), `bereich`, `ziel`, `zieldatum`.
- **Bereich:** läuft dauerhaft, Chris trägt dafür Verantwortung.
- **Ressource:** alles andere Wissenswerte. Im Zweifel hierhin.
- **Archivieren:** `status: abgeschlossen` setzen und die Seite nach `4-archiv/` verschieben. Nichts löschen.
- Meetings, Dailies und Termine werden nie in PARA-Ordner einsortiert. Sie verweisen per Property auf ihr Projekt: `projekt: "[[Projektname]]"`.
- Ein Projekt ist eine Datei. Wächst es, wird daraus ein Ordner gleichen Namens mit der Projektseite darin.
- Was aktiv ist, steht in `1-projekte/` mit `status: aktiv`. Das ist die Grundlage für jede Planung.

## Konventionen

- Jede Seite hat Frontmatter mit mindestens `type`. Datumswerte immer `YYYY-MM-DD`.
- Meetings und Termine verweisen über `journal: "[[YYYY-MM-DD]]"` auf ihren Tag, Dailies über `monat: "[[YYYY-MM]]"` auf ihren Monat.
- Todo-Zeile: `- [ ] Text @YYYY-MM-DD #thema`. `@Datum` (Fälligkeit) und `#thema` sind optional.
- Bezug auf ein Ziel: Tag `#ziel/<kürzel>`, die Kürzel stehen in `2-bereiche/karriere/12-monats-ziele.md`.
- Ein Todo existiert genau einmal. Übersichten verlinken auf die Quelle, sie kopieren keine Checkboxen.
- Links als Wikilinks `[[Seitenname]]`. Seitennamen sind im ganzen Vault eindeutig.

## Was du ändern darfst

- **Frei:** Dateien in `_generated/` und `metrics/`.
- **Nur anhängen:** in Dailies unter `## Log` und `## Todos`, in Monatsdateien unter `## Rückblick`, in Projektseiten unter `## Log`.
- **Nur nach Rückfrage:** alles in `2-bereiche/karriere/`, bestehenden Text umschreiben oder löschen, Seiten verschieben oder archivieren, neue Projekte anlegen.
- Die Abschnittsüberschriften der Templates bleiben unverändert, Skripte verlassen sich darauf.

## Fokus-Routine

Bei "plane meinen Tag" oder "plane meine Woche":

1. Lies `2-bereiche/karriere/12-monats-ziele.md`, die aktiven Projekte in `1-projekte/`, die aktuelle Monatsdatei, die letzten fünf vorhandenen Dailies und `_generated/offene-todos.md`.
2. Schlage höchstens drei Fokusthemen vor. Mindestens eines muss auf ein 12-Monats-Ziel einzahlen; nenne das Ziel und das Projekt.
3. Nenne überfällige Todos und Termine der nächsten sieben Tage.
4. Sag offen, wenn ein Ziel seit mehr als zwei Wochen in keiner Daily und keinem Meeting vorkommt (`#ziel/<kürzel>` suchen), wenn ein aktives Projekt kein Zieldatum hat oder es überschritten ist, oder wenn mehr als fünf Projekte aktiv sind. Nicht beschönigen.
5. Frag nach, bevor du den Vorschlag in die Daily schreibst.

Bei "Monatsrückblick": Fortschritt je Ziel und je aktivem Projekt anhand der Dailies und Meetings des Monats belegen (mit Links), offene Punkte nennen, Kandidaten fürs Archiv nennen, Vorschlag für den Fokus des nächsten Monats.

## Auswertungen aus Azure DevOps

- `scripts/ado-metrics.mjs` wird von Chris von Hand gestartet. Starte es nicht selbst, außer er bittet darum.
- Es schreibt je Monat `metrics/YYYY-MM.md` und Rohdaten nach `metrics/raw/` (`prs-YYYY-MM.json`, `workitems-YYYY-MM.json`). Felder der Rohdaten: siehe Skript, Funktionen `prRecord` und `workItemRecord`.
- Im Mittelpunkt stehen Chris' eigene Zahlen ("ich") und der Prozess: Durchlaufzeiten, Zeit bis zum Approve, Build-Läufe und Fehlschläge, Zeit in Bearbeitung.
- Andere Personen erscheinen als Kürzel `P-xxxxx`, solange `namen` in `scripts/ado.config.json` auf `false` steht. Versuche nicht, Kürzel Personen zuzuordnen, und erstelle keine Ranglisten oder Leistungsprofile einzelner Kolleginnen und Kollegen.
- Bei Analysen: Vergleiche mehrere Monate, nenne die Fallzahl, und ziehe aus weniger als fünf PRs keine Schlüsse.

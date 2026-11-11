Willkommen in deinem Vault 🧠

## Struktur
- [[Tasks-Übersicht]] – vollständige Todo-Liste über Journal/Projects/Areas, sortiert
  nach Priorität und Fälligkeit (die Journal-Tagesseiten zeigen nur noch "Heute
  fällig")
- `Inbox/` – schnelle, unsortierte Notizen
- `Journal/` – tägliche, wöchentliche, monatliche und jährliche Notizen
  (Kalender-Widget zur Navigation, Periodic Notes)
- `Projects/` – laufende Projekte mit Ziel/Deadline
- `Areas/` – wiederkehrende Verantwortungsbereiche
- `Resources/` – Referenzwissen, inkl. `entities/`, `concepts/`, `comparisons/`
- `Archive/` – abgeschlossenes / inaktives
- `_kb/` – Wiki-Maschinerie (Schema, Index, Log, Rohquellen) — bewusst versteckt,
  siehe `CONTEXT.md` für die technischen Details

**Für die genaue Funktionsweise (Todo-Konventionen, Sync-Trigger, Plugin-Setup,
agentenneutrale Konventionen) siehe [[CONTEXT]] — das ist das technische Handbuch,
auch für andere Agents/CLIs gedacht.**

## Täglicher Ablauf
1. Heutige Notiz öffnen → „Planung heute": Termine, Meetings, Überfälliges und Fälliges lesen, Top 3 festlegen.
2. Meeting mitschreiben mit der Vorlage `meeting` (im passenden Projekt-/Bereichsordner).
3. Freitags Wochenrückblick, am Monatsanfang/-ende Monatsplanung/-rückblick (Monatsnotiz).

## Faustregel: Wo schreibe ich rein?

**Schreib einfach in die PARA-Ordner, ohne über "das Wiki" nachzudenken:**
- Spontaner Gedanke, unsortiert → `Inbox/`
- Laufendes Vorhaben mit Ziel/Deadline → `Projects/`
- Wiederkehrender Verantwortungsbereich → `Areas/`
- Nachschlagbares Wissen (Person, Tool, Konzept) → `Resources/`
- Tagesgeschehen → `Journal/` (über "heutige Notiz öffnen")
- Erledigt/nicht mehr relevant → `Archive/`

Das ist die einzige Entscheidung, die du beim Schreiben triffst — klassisches PARA.

**`_kb/` (Index, Log, Rohquellen) ist keine Hintergrund-Automatik.** Es ist eine
Konvention, die *ich* (der Agent) befolge, wenn ich für dich Seiten anlege oder
Quellen einarbeite — nicht ein Dienst, der von selbst mitläuft. Legst du selbst direkt
in Obsidian eine neue Resources-Seite an, taucht sie nicht automatisch in
`_kb/index.md` auf, bis du mich bittest, sie nachzutragen (oder ich es bei einem
Lint-Check bemerke). Das Wiki-Zeug wird erst relevant, wenn:
1. du mich bittest, eine externe Quelle einzuarbeiten ("ingest") — dann pflege ich
   Seite, Index und Log konsistent, oder
2. du einen Lint/Health-Check willst, der prüft, was seit deinen manuellen Änderungen
   aus dem Ruder gelaufen ist.

Kurz: **PARA ist dein täglicher Wortschatz. Das Wiki ist die Buchhaltung im
Hintergrund, die nur läuft, wenn ich sie führe.**

## Benötigte Plugins (Desktop/iPad)
- Periodic Notes
- Dataview
- Templater

**Wichtig:** Je nach Sync-Lösung werden `.obsidian/`-Einstellungen (Plugin-Configs) nicht
zwischen Geräten übertragen. Nach der Installation eines Plugins auf einem neuen Gerät
prüfst du die Einstellungen unten und trägst sie bei Bedarf **einmalig manuell** ein. Die
Werte stehen hier als Referenz.

### Periodic Notes — Einstellungen → Community-Plugins → Periodic Notes

Flache Struktur seit 2026-09-03: alle drei Notiz-Typen liegen direkt in `Journal/`,
kein Verschachteln nach Jahr/Monat mehr — der Dateiname selbst (ISO-Datum/-Monat/-Jahr)
sorgt für korrekte chronologische Sortierung in der Dateiliste.

**Kein eigener Weekly-Notiz-Typ** (seit 2026-09-04) — Wochen sind stattdessen
Abschnitte innerhalb der jeweiligen Monthly-Notiz, siehe `CONTEXT.md` "Monthly /
Yearly Journal pages".

**Daily Notes**
| Feld | Wert |
|---|---|
| Format | `YYYY-MM-DD` |
| Folder | `Journal` |
| Template | `Journal/_templates/daily.md` |

**Monthly Notes**
| Feld | Wert |
|---|---|
| Format | `YYYY-MM` |
| Folder | `Journal` |
| Template | `Journal/_templates/monthly.md` |

**Yearly Notes**
| Feld | Wert |
|---|---|
| Format | `YYYY` |
| Folder | `Journal` |
| Template | `Journal/_templates/yearly.md` |

Alle drei müssen im Plugin einzeln aktiviert werden (Toggle je Notiz-Typ) — nicht nur
Daily. Die Formate müssen exakt so eingetragen werden, sonst passt die Vor-/Zurück-
Navigation im jeweiligen Template nicht zum tatsächlichen Dateinamen.

### Dataview
Keine manuelle Konfiguration nötig — Standardeinstellungen reichen, die Queries stehen
direkt im Template.

### Templater — Einstellungen → Community-Plugins → Templater
| Feld | Wert |
|---|---|
| Template folder location | `Journal/_templates` |
| Trigger Templater on new file creation | An (Schalter, wird nicht in `data.json` gespeichert → pro Gerät setzen) |

### Excluded Files (Obsidian-Bordmittel, kein Plugin)
Einstellungen → Dateien und Links → Ausgeschlossene Dateien → hinzufügen: `_kb`

## iPhone
Bewusst als reines Erfassungsgerät gedacht (Inbox, Journal-Text, Checkboxen abhaken) —
Dataview ist auf iOS unzuverlässig.

## Sync
Vault-Ordner in OneDrive (Firmen-Tenant) ablegen oder als git-Repo mit freigegebenem Remote führen, nicht beides. Siehe `CONTEXT.md`, Abschnitt „Sync".

## Nächste Schritte
- [ ] Auf allen Geräten: Periodic Notes, Dataview, Templater installieren und aktivieren
- [ ] Erste eigene Journal-Notiz über "heutige Notiz öffnen" erstellen

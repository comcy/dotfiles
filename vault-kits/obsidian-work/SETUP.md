# Obsidian-Arbeits-Vault (PARA + Journal + Planung)

Neutrale Vorlage für einen Arbeits-Vault: PARA, Tages-/Wochen-/Monatsplanung,
Task-Tracking mit Fälligkeiten, Meeting-Notizen mit Verweisen. Läuft mit **drei
Community-Plugins aus dem Obsidian-Store**: Dataview, Templater, Periodic Notes.
Nur mit Bordmitteln geht das nicht (siehe `../README.md`).

## Was drin ist

```
vault/
├── CONTEXT.md  Willkommen.md  Tasks-Übersicht.md
├── Inbox/  Projects/  Areas/  Resources/{entities,concepts,comparisons,learnings}/  Archive/
├── Journal/_templates/   daily, monthly (mit Wochenabschnitten), yearly, meeting,
│                         project, area, entity, concept, comparison, learning
├── _kb/  (SCHEMA.md, index.md, log.md, raw/, queries/, prompts/)
├── docs/adr/
└── .obsidian/  Einstellungen der drei Plugins (ohne Plugin-Dateien)
```

| Anforderung | Wo |
|---|---|
| PARA | Ordner `Projects/ Areas/ Resources/ Archive/` + `Inbox/` |
| Journal mit Task-Tracking | `daily.md`: Tasks mit `[due:: …] [priority:: 1-3] [scope:: [[…]]]` |
| Anstehende Termine + offene Todos im Journal | Tagesnotiz: „Termine", „Meetings heute", „Überfällig", „Heute fällig", „Diese Woche fällig", „Priorität 1" |
| Seiten verlinken bei Meeting-Notizen | `meeting.md`: Projekt/Bereich/Teilnehmer als `[[Wikilinks]]`, Aufgaben mit `scope::` |
| Kompakte Monatsübersicht (wie Confluence-Tabelle) | Monatsnotiz: „Monatsübersicht (Tabelle)" von Hand + „Übersicht aus den Tagesnotizen (automatisch)" |
| Tägliche Morgenplanung | Tagesnotiz „Planung heute" (Top 3, Zeitblöcke) |
| Wochen-/Monatsplanung | Monatsnotiz: je Woche „Planung (Montag)", „Fällig diese Woche", „Meetings dieser Woche", „Rückblick (Freitag)"; dazu „Monatsplanung" und „Monatsrückblick" |

## Einrichten

1. `cp -a vault/. "<ZIEL>/"` — `<ZIEL>` im OneDrive-Ordner (Firmen-Tenant) oder in einem
   git-Repo mit freigegebenem Remote, **nicht beides**.
2. In Obsidian als Vault öffnen. Einstellungen → Community-Plugins → „Restricted mode"
   aus, dann **Dataview, Templater, Periodic Notes** aus dem Store installieren und
   aktivieren. Die `data.json`-Einstellungen im Kit werden dabei übernommen.
3. Templater → „Trigger Templater on new file creation" **an** (Schalter steht nicht in
   `data.json`, laut Plugin-Code).
4. Einstellungen → Dateien und Links → Ausgeschlossene Dateien → `_kb`.
5. Test: „Heutige Notiz öffnen" → Tagesnotiz ohne sichtbare `<% … %>`-Tags; die
   Dataview-Blöcke zeigen Ergebnisse oder „No results". Dann Monatsnotiz öffnen und prüfen,
   dass die Wochenabschnitte erzeugt wurden. **Nicht in einem echten Obsidian getestet** —
   die Abfragen sind nach Dataview-Syntax geschrieben, aber nur statisch geprüft.

## Termine aus Outlook

- **Einfach:** morgens in der Tagesnotiz unter „Termine" von Hand eintragen.
- **Mit M365 Copilot:** „Liste meine heutigen Termine als Markdown im Format
  `- HH:MM — Titel [time:: HH:MM]`" und einfügen. Kein Setup nötig, ein Handgriff pro Tag.
- **Automatisch:** ein Power-Automate-Flow könnte täglich eine Termin-Datei in den
  OneDrive-Vault schreiben. Ob das bei dir erlaubt ist, muss die IT klären; nicht
  ausprobiert.

## Meeting-Notizen

Neue Notiz im passenden Projekt-/Bereichsordner, Vorlage `meeting` einfügen. `date`
im Frontmatter bestimmt, in welcher Tagesnotiz sie unter „Meetings heute" erscheint.
Aufgaben im Abschnitt „Aufgaben" erscheinen automatisch in den Journal-Blöcken.

## Monatsübersicht als Tabelle

- **Von Hand:** Die Monatsnotiz enthält eine Tabelle `Datum | Thema | Zusätzliche Notizen |
  Aufgaben | Status` mit einer Zeile je Tag. Weitere Einträge am selben Tag: Zeile darunter
  einfügen, Datumszelle leer lassen; `<br>` für Zeilenumbrüche. Spaltennamen sind frei
  änderbar.
- **Automatisch:** Einträge in der Tagesnotiz als `- [thema:: Kundentermin] [status:: offen]
  Notiz …` schreiben, offene Aufgaben eingerückt darunter (`  - [ ] …`). Die Dataview-Tabelle
  der Monatsnotiz sammelt sie. Ungetestet: ob `item.text` die Inline-Felder im Notizen-Text
  mit anzeigt, und ob die Aufgaben-Spalte wie gewünscht gefüllt wird.

## Grenzen

- Kalender wird nicht synchronisiert (siehe oben).
- Dataview arbeitet nur am Rechner zuverlässig, auf dem iPhone nicht; hier irrelevant,
  weil nur am Rechner gearbeitet wird.
- Plugin-Dateien sind nicht im Kit (kommen aus dem Store); Version der Einstellungen:
  Dataview, Templater 2.x, Periodic Notes.

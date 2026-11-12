# Logseq-Arbeits-Graph (PARA + Journal + Planung)

Neutrale Vorlage für einen Arbeits-Graph, die **ohne Plugins** auskommt: Aufgaben, Fristen
und Journal-Abfragen sind in Logseq eingebaut. **Nicht in einer echten Logseq-Installation
getestet** — die Konfiguration und die Abfragen sind nach der Logseq-Dokumentation aus dem
Gedächtnis geschrieben. Zuerst auf einem Testgraph ausprobieren.

## Inhalt

```
graph/
├── logseq/config.edn     Einstellungen (Markdown, TODO/DOING, ISO-Datum, Standardvorlage,
│                         Journal-Abfragen "Offen" und "Anstehend", 14 Tage Fristenvorschau)
├── pages/
│   ├── Vorlagen.md       Tagesplanung, Meeting, Wochenplanung, Monatsplanung, Projekt, Bereich
│   └── PARA.md  Projekte.md  Bereiche.md  Ressourcen.md  Archiv.md   (Abfrage je type::)
├── journals/             leer
└── .gitignore
```

## Einrichten

1. `cp -a graph/. "<ZIEL>/"` — `<ZIEL>` im OneDrive-Ordner oder in einem git-Repo mit
   freigegebenem Remote, nicht beides.
2. In Logseq „Add graph" → `<ZIEL>`. Vor dem ersten Start des Graphen prüfen, dass das
   Datumsformat zu `config.edn` passt: Einstellungen → Allgemein → „Preferred date format"
   = `yyyy-MM-dd`. Die Journal-Dateinamen sind dann `journals/2026-11-11.md`.
   (Das Format nur in einem neuen Graph ändern, sonst passen alte Journale nicht mehr.)
3. Testen: Das heutige Journal öffnen. Wird die Vorlage „Tagesplanung" nicht automatisch
   eingefügt, in einen leeren Block `/Template` tippen und sie wählen.

## Arbeiten

| Aufgabe | In Logseq |
|---|---|
| Aufgabe | `TODO` / `DOING` / `DONE` am Zeilenanfang |
| Frist | `DEADLINE: <2026-11-18 Wed>` (Befehl `/deadline`), erscheint im Journal der Tage davor |
| Priorität | `[#A]`, `[#B]`, `[#C]` |
| Projekt-/Bereichs-Bezug | Seitenverweis im Text: `TODO Bericht [[Projekt X]]` |
| Meeting | Vorlage „Meeting". `date:: <% today %>` verweist auf das Journal des Tages, deshalb erscheint die Meeting-Seite dort automatisch unter „Linked References" |
| Verweise | `[[Seite]]` für Seiten, `((Block-ID))` für einzelne Blöcke (Rechtsklick auf den Bullet → Copy block ref) |
| Morgenplanung | Tagesplanung-Vorlage im heutigen Journal |
| Wochenplanung | Seite `2026-W46` anlegen, Vorlage „Wochenplanung" einfügen |
| Monatsplanung | Seite `2026-11` anlegen, Vorlage „Monatsplanung" einfügen |

## Kompakte Monatsübersicht (statt Confluence-Tabelle)

- **Eintragen:** im Tages-Journal die Vorlage „Tageseintrag" einfügen: ein Block mit dem Thema,
  `status::` und `notiz::` als Eigenschaften, offene Aufgaben als `TODO`-Unterblöcke.
- **Ansehen:** Seite `2026-11` anlegen, Vorlage „Monatsübersicht" einfügen und `JJJJ-MM`
  durch Jahr und Monat ersetzen (Datumsgrenzen von Hand, Vorlagen sind statisch). Das
  Ergebnis ist eine Tabelle mit den Spalten Thema (Block), Seite (= Tag), Notiz, Status.
- **Grenzen:** Die Aufgaben-Spalte gibt es nicht, die `TODO`-Unterblöcke stehen in den Tages-
  Journalen. Die Tabelle ist nur eine Ansicht; bearbeitet wird in den Blöcken, soweit ich
  weiß nicht in der Tabelle selbst. `(property status)` ohne Wert, `query-table::` und
  `query-properties::` sind nach der Dokumentation geschrieben und ungeprüft.

## Termine aus Outlook

Wie beim Obsidian-Kit: abtippen oder M365 Copilot bitten („Liste meine heutigen Termine als
Markdown, Format: - HH:MM Titel") und unter „Termine" einfügen. Automatisch nur über Power
Automate nach OneDrive, falls die IT das erlaubt — nicht ausprobiert.

## Grenzen (gegenüber dem Obsidian-Kit)

- **Vorlagen sind statisch.** Keine berechnete Navigation, Wochen- und Monatsseiten legst du
  von Hand an. Das war auch ein Grund, warum Logseq in einem früheren Test verworfen wurde.
- **PARA über Eigenschaften, nicht über Ordner:** Logseq legt alle Seiten flach in `pages/`.
  Die Zuordnung steht in `type::` und die Übersichtsseiten fragen sie ab.
- **Abfragen:** `(between today +6d)` und `(page-property type project)` sind
  Standardsyntax, aber hier ungeprüft. Falls eine Abfrage nichts liefert, die
  Logseq-Dokumentation zu „Queries" für die genaue Schreibweise der installierten Version
  ansehen.
- Der Outliner (alles ist ein Bullet) passt gut zu Notizen und Meetings, weniger zu langen
  Fließtexten.

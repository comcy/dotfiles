# vault-kits

Neutrale Starter-Vorlagen für einen **Arbeits-Wissensspeicher** mit PARA-Struktur,
Journal (Tag/Woche/Monat), Task-Tracking mit Fristen und Meeting-Notizen mit Verweisen.
Zwei Varianten zum Vergleichen:

| | `obsidian-work/` | `logseq-work/` |
|---|---|---|
| Plugins | Dataview, Templater, Periodic Notes (aus dem Obsidian-Store) | keine |
| PARA | echte Ordner | Seiten-Eigenschaft `type::` + Übersichtsseiten |
| Tasks mit Frist im Journal | Dataview-Abfragen: überfällig, heute, diese Woche, Priorität 1 | eingebaut (`DEADLINE`, `SCHEDULED`) + Standard-Abfragen |
| Wochen-/Monatsplanung | berechnete Wochenabschnitte in der Monatsnotiz | Seiten von Hand anlegen, statische Vorlagen |
| Meeting-Notizen | Vorlage mit `[[Wikilinks]]`, Auflistung im Tagesjournal | Vorlage mit `date:: <% today %>`, Auftauchen unter "Linked References" |
| Reifegrad | statisch geprüft, nicht in Obsidian getestet | nicht in Logseq getestet |

Wahl: sind Community-Plugins erlaubt, ist Obsidian die vollständigere Lösung (berechnete
Navigation und Planungsabschnitte). Sind nur Bordmittel erlaubt, ist Logseq besser, weil
Aufgaben, Fristen und Journal-Abfragen eingebaut sind.

Beide Kits sind frei von persönlichen Inhalten und Zugangsdaten. Anleitung je Kit in
`SETUP.md`. Sync: Vault-/Graph-Ordner in OneDrive **oder** git mit freigegebenem Remote,
nicht beides.

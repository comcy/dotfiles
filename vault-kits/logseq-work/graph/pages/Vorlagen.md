- Vorlagen für diesen Graph. Einfügen: in einen leeren Block `/Template` tippen und den Namen wählen. Die Vorlage "Tagesplanung" wird per `:default-templates` in neue Tages-Journale gesetzt.
- Tagesplanung
  template:: Tagesplanung
  template-including-parent:: false
  - ## Planung heute
    - Top 3
      - TODO 
      - TODO 
      - TODO 
    - Zeitblöcke / Fokus
      -
  - ## Termine
    - Outlook abtippen oder M365 Copilot: "Liste meine heutigen Termine als Markdown, Format: - HH:MM Titel" und hier einfügen
      -
  - ## Priorität A (offen)
    - {{query (and (task TODO DOING) (priority a))}}
  - ## Journal
    -
- Meeting
  template:: Meeting
  template-including-parent:: false
  - type:: meeting
    date:: <% today %>
    projekt:: [[]]
    bereich:: [[]]
    teilnehmer:: [[]], [[]]
  - ## Agenda
    -
  - ## Notizen
    -
  - ## Entscheidungen
    -
  - ## Aufgaben
    - TODO  [[Projekt]] DEADLINE: <JJJJ-MM-TT>
- Wochenplanung
  template:: Wochenplanung
  template-including-parent:: false
  - ## Planung (Montag)
    - Ziele und Prioritäten dieser Woche
      -
  - ## Offen und anstehend
    - {{query (and (task TODO DOING) (between today +6d))}}
  - ## Meetings dieser Woche
    - Meeting-Seiten verlinken, die diese Woche stattfinden (Eigenschaft `date::` verweist auf das Journal des Tages)
      -
  - ## Rückblick (Freitag)
    - Gut gelaufen
      -
    - Offen
      -
    - Mitnehmen
      -
- Monatsplanung
  template:: Monatsplanung
  template-including-parent:: false
  - ## Ziele und Meilensteine
    -
  - ## Große Termine
    -
  - ## Rückblick (Monatsende)
    - Erreicht
      -
    - Mitnehmen
      -
- Projekt
  template:: Projekt
  template-including-parent:: false
  - type:: project
    status:: active
    ziel::
    due::
  - ## Ziel und Ergebnis
    -
  - ## Aufgaben
    - TODO 
  - ## Meetings und Notizen
    -
- Bereich
  template:: Bereich
  template-including-parent:: false
  - type:: area
    verantwortung::
  - ## Standard und Zuständigkeit
    -
  - ## Laufende Aufgaben
    - TODO 

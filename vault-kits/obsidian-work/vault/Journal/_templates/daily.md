---
title: <% tp.file.title %>
created: <% tp.file.creation_date("YYYY-MM-DD") %>
updated: <% tp.file.creation_date("YYYY-MM-DD") %>
type: journal
tags: [journal]
---
<%*
const prevDate = moment(tp.file.title, "YYYY-MM-DD").subtract(1, "day").format("YYYY-MM-DD");
const nextDate = moment(tp.file.title, "YYYY-MM-DD").add(1, "day").format("YYYY-MM-DD");
tR += `⬅️ [[${prevDate}]] · ➡️ [[${nextDate}]]`;
%>

# <% tp.file.title %>

## Planung heute
<!-- Morgens, ca. 5 Minuten: erst die Blöcke darunter lesen (Termine, Meetings, überfällig,
     fällig), dann die drei wichtigsten Dinge festlegen. -->
**Top 3**
- [ ] 
- [ ] 
- [ ] 

**Zeitblöcke / Fokus**
- 

## Termine
<!-- Bullet-Format: "- HH:MM — Text [time:: HH:MM]". Das time::-Feld ist Pflicht, wenn der
     Termin in der Wochen-/Monatsübersicht auftauchen soll.
     Aus Outlook: entweder abtippen oder M365 Copilot fragen: "Liste meine heutigen Termine
     als Markdown, Format: - HH:MM — Titel [time:: HH:MM]" und hier einfügen. -->


### Meetings heute
<!-- Auto: Meeting-Notizen (type: meeting) mit dem Datum dieses Tages. -->
```dataview
LIST
FROM "Projects" OR "Areas"
WHERE type = "meeting" AND date = this.file.day
SORT file.name ASC
```

## Überfällig
```dataview
TASK
FROM "Journal" OR "Projects" OR "Areas"
WHERE !completed AND due AND due < this.file.day
SORT priority asc, due asc
```

## Heute fällig
```dataview
TASK
FROM "Journal" OR "Projects" OR "Areas"
WHERE !completed AND due AND due = this.file.day
SORT priority asc
```

## Diese Woche fällig
```dataview
TASK
FROM "Journal" OR "Projects" OR "Areas"
WHERE !completed AND due AND due > this.file.day AND due <= this.file.day + dur(7 days)
SORT due asc, priority asc
```

## Priorität 1 (offen)
```dataview
TASK
FROM "Journal" OR "Projects" OR "Areas"
WHERE !completed AND priority = 1
SORT due asc
```

## Journal
<!-- Eintrag für die Monatsübersicht: "- [thema:: Thema] [status:: offen] Notizen". Aufgaben
     dazu eingerückt darunter: "  - [ ] Text [due:: YYYY-MM-DD]". -->


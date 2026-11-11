<%*
const cur = moment(tp.file.title, "YYYY");
const prevYear = cur.clone().subtract(1, "year").format("YYYY");
const nextYear = cur.clone().add(1, "year").format("YYYY");
const navLine = `⬅️ [[${prevYear}]] · ➡️ [[${nextYear}]]`;

const periodStart = cur.clone().startOf("year").format("YYYY-MM-DD");
const periodEnd = cur.clone().endOf("year").format("YYYY-MM-DD");
%>---
title: <% tp.file.title %>
created: <% tp.file.creation_date("YYYY-MM-DD") %>
updated: <% tp.file.creation_date("YYYY-MM-DD") %>
type: journal-yearly
tags: [journal, yearly]
period_start: <% periodStart %>
period_end: <% periodEnd %>
---
<% navLine %>

# <% tp.file.title %>

## Fokus des Jahres
-

## Termine
<!-- Manual, wie bei den Daily-Seiten. -->
-

### Termine aus den Tagesseiten
<!-- Auto: Journal-Termine-Listenpunkte mit einem `[time:: HH:MM]`-Feld (siehe
     _kb/SCHEMA.md "Termine list items"), deren Seiten-Datum in dieses Jahr fällt.
     Gleiche Query wie bei Weekly/Monthly, nur mit den Jahresgrenzen aus
     period_start/period_end. Per `type = "journal"` auf Daily-Seiten eingegrenzt
     (flache Journal-Struktur seit 2026-09-03, alle Periodentypen liegen im
     selben Ordner). -->
```dataview
LIST dateformat(file.day, "EEE dd.MM.") + " — " + item.text
FROM "Journal" AND !"Journal/_templates"
FLATTEN file.lists AS item
WHERE type = "journal" AND item.time AND file.day >= date(this.period_start) AND file.day <= date(this.period_end)
SORT file.day ASC, item.time ASC
```

## Notizen
<!-- Freitext, optional. -->

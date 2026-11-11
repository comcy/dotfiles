<%*
const cur = moment(tp.file.title, "YYYY-MM");
const prevMonth = cur.clone().subtract(1, "month");
const nextMonth = cur.clone().add(1, "month");
const navLine = `⬅️ [[${prevMonth.format("YYYY-MM")}]] · ➡️ [[${nextMonth.format("YYYY-MM")}]]`;

const periodStart = cur.clone().startOf("month").format("YYYY-MM-DD");
const periodEnd = cur.clone().endOf("month").format("YYYY-MM-DD");

const monthStart = cur.clone().startOf("month");
const monthEnd = cur.clone().endOf("month");
let wStart = monthStart.clone().startOf("isoWeek");
if (wStart.isBefore(monthStart)) {
  wStart = wStart.add(1, "week");
}
const weeks = [];
while (wStart.isSameOrBefore(monthEnd)) {
  weeks.push(wStart.clone());
  wStart = wStart.clone().add(1, "week");
}

const weekSections = weeks.map(ws => {
  const we = ws.clone().endOf("isoWeek");
  const label = ws.format("GGGG-[W]WW");
  const rangeLabel = `${ws.format("DD.MM.")}–${we.format("DD.MM.")}`;
  const pStart = ws.format("YYYY-MM-DD");
  const pEnd = we.format("YYYY-MM-DD");
  const dayList = Array.from({length: 7}, (_, i) => `"${ws.clone().add(i, "days").format("MM-DD")}"`).join(", ");
  const dayLinks = Array.from({length: 7}, (_, i) => `[[${ws.clone().add(i, "days").format("YYYY-MM-DD")}]]`).join(" · ");
  return [
    `## Woche ${label} (${rangeLabel})`,
    "",
    "**Planung (Montag)** — Ziele und Prioritäten dieser Woche",
    "-",
    "",
    "**Termine**",
    "-",
    "",
    "*Termine aus den Tagesseiten:*",
    "```dataview",
    "LIST dateformat(file.day, \"EEE dd.MM.\") + \" — \" + item.text",
    "FROM \"Journal\" AND !\"Journal/_templates\"",
    "FLATTEN file.lists AS item",
    `WHERE type = "journal" AND item.time AND file.day >= date("${pStart}") AND file.day <= date("${pEnd}")`,
    "SORT file.day ASC, item.time ASC",
    "```",
    "",
    "*Fällig diese Woche:*",
    "```dataview",
    "TASK",
    "FROM \"Journal\" OR \"Projects\" OR \"Areas\"",
    `WHERE !completed AND due AND due >= date("${pStart}") AND due <= date("${pEnd}")`,
    "SORT due asc, priority asc",
    "```",
    "",
    "*Meetings dieser Woche:*",
    "```dataview",
    "LIST",
    "FROM \"Projects\" OR \"Areas\"",
    `WHERE type = "meeting" AND date >= date("${pStart}") AND date <= date("${pEnd}")`,
    "SORT date asc",
    "```",
    "",
    "**Rückblick (Freitag)** — gut gelaufen / offen / mitnehmen",
    "-",
    "",
    `**Tage:** ${dayLinks}`,
  ].join("\n");
}).join("\n\n---\n\n");
%>---
title: <% tp.file.title %>
created: <% tp.file.creation_date("YYYY-MM-DD") %>
updated: <% tp.file.creation_date("YYYY-MM-DD") %>
type: journal-monthly
tags: [journal, monthly]
period_start: <% periodStart %>
period_end: <% periodEnd %>
---
<% navLine %>

# <% tp.file.title %>

## Fokus des Monats
<!-- Für Dinge, die den ganzen Monat betreffen -- wochenspezifisches gehört in die
     jeweilige Wochen-Section weiter unten. -->
-

## Monatsplanung
<!-- Zu Monatsbeginn: Ziele, Meilensteine, große Termine. -->
-

**Fällig in diesem Monat**
```dataview
TASK
FROM "Journal" OR "Projects" OR "Areas"
WHERE !completed AND due AND due >= date(this.period_start) AND due <= date(this.period_end)
SORT due asc, priority asc
```

## Termine
-

<% weekSections %>

## Monatsrückblick
<!-- Am Monatsende: Was wurde erreicht? Was nehme ich mit? -->
-

## Notizen
<!-- Freitext, optional. -->

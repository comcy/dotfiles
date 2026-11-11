---
title: Tasks-Übersicht
type: system-doc
updated: 2026-09-03
---

# Tasks-Übersicht

```dataview
TASK
FROM "Journal" OR "Projects" OR "Areas"
WHERE !completed
SORT priority asc, due asc
```

## Nach Scope gruppiert

```dataview
TASK
FROM "Journal" OR "Projects" OR "Areas"
WHERE !completed AND scope
GROUP BY scope
```

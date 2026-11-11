---
title: Vault Context
type: system-doc
audience: agents (Claude Code, other CLI agents, local models, or any future agent operating on this vault) and humans who want the precise mechanics
updated: 2026-11-11
---

# Vault — Agent & System Context

This file is the machine-readable handbook for this vault. Read this before performing
any automated action here (creating notes, running the daily-summary trigger, ingesting
sources). `Willkommen.md` is the human-facing welcome page; this file is the precise
reference for how the system actually works.

## What this vault is

A single Obsidian vault combining PARA-organised personal/work notes, daily journaling,
and a Karpathy-style LLM-wiki knowledge base — all in one place, cross-linkable.

## Top-level structure

```
vault/
├── Willkommen.md          Human welcome page
├── Tasks-Übersicht.md     Full open-task Dataview aggregation (root-level utility
│                          page, not a PARA folder — see "Daily Journal" below)
├── CONTEXT.md             This file
├── Inbox/                 Quick, unsorted capture
├── Journal/               Daily/Monthly/Yearly notes (Periodic Notes), see
│   │                      "Daily Journal" and "Monthly/Yearly Journal" below. Weeks
│   │                      are NOT a separate note type — they're sections inside the
│   │                      Monthly note, see "Week sections inside Monthly".
│   │                      FLAT since 2026-09-03 — all types live directly here, no
│   │                      year/month subfolders. ISO-prefixed filenames sort
│   │                      correctly on their own (2026.md, 2026-09.md, 2026-09-03.md,
│   │                      ...), so nesting adds no value.
│   └── _templates/        daily.md, monthly.md, yearly.md
├── Projects/              PARA: active efforts with a goal/deadline
├── Areas/                 PARA: ongoing responsibilities
├── Resources/             PARA: reference material — ALSO the LLM-wiki's Layer 2
│   ├── entities/          People, orgs, tools, models — one page each
│   ├── concepts/          Topics/concepts, mostly howto/technique — one page each
│   ├── comparisons/       Side-by-side analyses
│   └── learnings/         Generalizable lessons/insights that happened to surface
│                          inside one project but aren't specific to it (project-
│                          agnostic takeaways, debugging heuristics, "what we'd do
│                          differently") — cross-link to the originating Project page
│                          rather than duplicating the incident narrative there
├── Archive/                PARA: completed / inactive
└── _kb/                    Wiki machinery — hidden from the Obsidian sidebar via
    │                       Settings → Files & Links → Excluded files (pattern: _kb)
    │                       Note: excluded files still show in the raw file explorer
    │                       tree by default in some Obsidian versions; if it still
    │                       shows, right-click → this is expected, exclusion mainly
    │                       affects search/quick-switcher, not the tree itself.
    ├── SCHEMA.md            Tag taxonomy, page thresholds, conventions
    ├── index.md             Catalog of Projects/Areas/Resources/Archive pages
    │                        (NOT individual Journal days — the Periodic Notes
    │                        calendar handles that navigation instead)
    ├── log.md               Chronological log of ALL actions, including Journal
    │                        note creation
    ├── raw/                 Immutable ingested source material
    └── queries/             Filed query results worth keeping
```

## Required plugins

**Desktop / iPad:**
- **Periodic Notes** — required for the separate Daily/Monthly/Yearly note types (each
  configured and toggled on independently — see `Willkommen.md` for the exact
  settings). Obsidian's built-in Daily Notes plugin can't do Monthly/Yearly at all.
- **Dataview** — required for all task aggregation and querying used throughout this
  vault (daily todo blocks, meeting lists, `index.md`-adjacent lookups, etc.)
- **Templater** — required for every period template's dynamic previous/next-period
  linking and conditional content, including the Monthly template's per-week loop (see
  "Week sections inside Monthly" below) — the most complex Templater logic in the
  vault, generates several week sections with their own baked-in query parameters at
  creation time.

**iPhone (deliberate limitation):**
- Dataview is known to be unreliable on iOS (plugin frequently fails to load; see
  upstream issue tracker). The iPhone is treated as a capture-only device: Inbox quick
  notes, journal free text, checking off existing checkboxes. Full Dataview query
  views (todo aggregation, index views) are a Desktop/iPad activity by design.
- No additional plugin requirement beyond whatever sync solution you use.

**Hiding `_kb/` from the sidebar:**
Settings → Files and Links → Excluded files → add `_kb`. This is a stock Obsidian
setting, no extra plugin. It excludes from search and quick-switcher; it does not fully
remove the folder from the raw file tree in all Obsidian versions, but keeps daily
workflows from surfacing it. No dedicated hider plugin is used (deliberate — see
SCHEMA.md rationale, minimal-dependency preference).

## Task (todo) conventions

Tasks are inline Markdown checkboxes, written anywhere in Journal, Projects, or Areas
files (NOT restricted to a single "task file"). Dataview queries aggregate across all
three locations.

**Syntax:**
```
- [ ] Plain task text
- [ ] Task with a due date [due:: 2026-08-20]
- [ ] Task someone else must do [due:: 2026-08-20] [assignee:: [[Person Name]]]
- [ ] Task that concerns [[Person Name]] but you do it — just link them in the text,
      no special field needed
```

- **`due::`** — Dataview inline field, ISO date. Optional per task; add when a real
  deadline exists.
- **`assignee::`** — Dataview inline field, only set when someone OTHER than you owns
  the task. Omitted = you are the implicit assignee.
- **`scope::`** — Dataview inline field, a wikilink to the Project/Area/Resource page
  the task belongs to (e.g. `[scope:: [[Projektname]]]`). Optional; omit for
  tasks with no clear project/area association. See SCHEMA.md for the full rationale
  and how it relates to the page-level scope tag.
- **`priority::`** — Dataview inline field, integer 1 (highest) to 3 (lowest). Optional;
  drives sort order on [[Tasks-Übersicht]].
- **Person references that don't need an assignee field** (things that concern a
  person but that you're doing yourself) — just use a plain `[[Wikilink]]` to their
  entity page in the task text. No `concerns::` field exists; add one later only if a
  concrete need for structured group-by-person filtering on non-assignee tasks
  actually arises (see SCHEMA.md — don't pre-build fields you don't have a use for
  yet).
- Person entity pages live in `Resources/entities/` so `[[Person Name]]` resolves to a
  real page and appears in the graph.

**Resolving a task that carries real context (a decision, an open question, a
clarification with someone) — not a routine action item:**
```
- [x] Original task text — stays verbatim, never rewritten or summarized away.
  - **Resolved (2026-09-03):** what was decided/found, in a sentence or two,
    linking to the full detail (e.g. a Journal entry) rather than duplicating it.
```
The task line itself is never edited beyond flipping `[ ]` to `[x]` — the original
question must stay reconstructable on its own, with the resolution visually
subordinate (indented sub-bullet) rather than overwriting or merging into it. No
`resolved::` Dataview field for this — it's prose, not something queried/sorted on.
Don't add an empty "Resolved:" placeholder when a task is first written — most tasks
(errands, reminders) never need one; add the sub-bullet only at resolve-time, only for
tasks where losing the "why" would actually hurt later.

## Daily Journal

**Location:** `Journal/{{date:YYYY-MM-DD}}.md` (flat, no year/month subfolders — see
"Top-level structure" above), created from `Journal/_templates/daily.md` via Periodic
Notes + Templater when you open "today's note" (manually triggered by opening the
note — not cron-generated).

**What the template auto-populates (live, via Dataview, no agent run required):**
- **"Planung heute"** — manual, morning ritual: Top 3 plus time blocks. Read the blocks
  below first, then decide.
- **"Termine"** — manual (`- HH:MM — Text [time:: HH:MM]`); source is Outlook, copied by
  hand or pasted from an M365 Copilot answer (see `SETUP.md`).
- **"Meetings heute"** — auto, all `type: meeting` notes under `Projects/`/`Areas/`
  whose `date` is this day.
- **"Überfällig"** (`due < today`), **"Heute fällig"** (`due = today`), **"Diese Woche
  fällig"** (next 7 days) and **"Priorität 1 (offen)"** — auto, tasks from Journal,
  Projects and Areas. Every `due`-comparison has a `due` truthy-guard (see SCHEMA.md,
  Dataview gotcha).
- Link to previous/next day (Templater)

**Full task aggregation lives on [[Tasks-Übersicht]]** (vault root, not part of the
daily template), not in each daily note — one Dataview query across Journal + Projects
+ Areas, sorted by `priority::` then `due::`, plus a `GROUP BY scope` view. This page
used to be embedded fresh in every daily note; that was moved out on 2026-09-03 because
it made every journal page grow indefinitely for no benefit (the full list is the same
regardless of which day you open it from).

**"Nothing day" behaviour:** A day with no meaningful journal entry stays thin — no
forced content is written for it.

**Historical note:** the template used to have a `## Fokus heute` section (manual,
free-text, meant for the day's most important items) above "Heute fällig". Removed
2026-09-04 — in practice, every Fokus-heute entry ever written also carried its own
`due:: <today>` (an explicit earlier decision, so it would surface in "Heute fällig"
too), making the section a pure duplicate of what "Heute fällig" already showed, just
positioned higher on the page. `priority:: 1` on a "Heute fällig" task now serves the
"this is the actual priority, not just something due" signal instead — one mechanism
instead of two. Tasks that would have gone under "Fokus heute" just get written
inline wherever they fit in `## Journal`, same as any other task with a `due::`.

## Monthly / Yearly Journal pages

Added 2026-09-03, alongside the existing Daily notes. Same PARA-adjacent idea as Daily
but for coarser horizons — capturing focus and appointments that don't belong to one
specific day. **Deliberately no task/todo aggregation on these pages** (unlike Daily's
"Heute fällig") — the user explicitly asked to leave that out for now; `[[Tasks-Übersicht]]`
remains the only place for cross-cutting task aggregation.

**No separate Weekly note type** (there was one, briefly, 2026-09-03 to 2026-09-04 —
removed before any instance was ever created). Weeks are instead sections *within* the
Monthly note — the user's call: thinking in months with a week-level breakdown
underneath, rather than jumping between separate week files. See "Week sections inside
Monthly" below for the mechanics.

All period types (Daily included) share the same flat `Journal/` folder — see
`Willkommen.md` for the exact Periodic Notes plugin settings to enter per device.

| Type | Path | Template |
|---|---|---|
| Daily | `Journal/{{YYYY-MM-DD}}.md` | `_templates/daily.md` |
| Monthly | `Journal/{{YYYY-MM}}.md` | `_templates/monthly.md` |
| Yearly | `Journal/{{YYYY}}.md` | `_templates/yearly.md` |

Chronological ordering in a flat file listing comes entirely from the ISO-prefixed
filenames themselves (`2026.md` < `2026-09.md` < `2026-09-03.md` when string-sorted) —
no folder nesting needed.

Both templates have the same frontmatter fields `period_start`/`period_end`
(`YYYY-MM-DD`, computed once by Templater at creation time — the period's actual
calendar boundaries) and the same top-level sections:
- **`## Fokus des Monats/des Jahres`** — manual free-text entry, for the handful of
  things that matter across the whole period rather than one specific day or week.
  (Daily's own "Fokus heute" equivalent was removed 2026-09-04 — see "Daily Journal"
  above — but the period-level versions here were kept; the redundancy argument that
  applied to Daily, where every Fokus entry duplicated a `due::` task, doesn't apply
  the same way at month/year granularity.)
- **`## Termine`** — manual, same free-entry style as Daily's "Termine", for
  appointments that belong to the whole period rather than one specific day/week.
## Week sections inside Monthly

Templater, at Monthly-note creation time, computes every ISO week whose **Monday**
falls within that calendar month (usually 4–5, occasionally 6) and generates one
`## Woche GGGG-[W]WW (DD.MM.–DD.MM.)` section per week, in order, appended after the
month-level "Fokus"/"Termine". A week whose Monday is in this month but that runs into
the next month still shows **all 7 days** (chosen 2026-09-04: a week stays a complete
unit, like a wall calendar showing month-boundary bleed-over, rather than truncating to
only the days that fall in this specific month).

Each week section has its own:
- **Planung (Montag)** / **Termine** — manual, same free-entry style as everywhere else.
- **"Termine aus den Tagesseiten"** — auto. Uses
  `FLATTEN file.lists AS item`, filtered by
  `item.time` (see SCHEMA.md "Termine list items") and `file.day` against that
  particular week's start/end. Unlike the old Weekly note, these dates can't come from
  `this.period_start`/`period_end` (that frontmatter now describes the whole *month*,
  and one page has several week sections) — Templater bakes each week's own start/end
  directly into that section's query as literal date strings instead, at creation time.
- **"Fällig diese Woche"** and **"Meetings dieser Woche"** — auto, task and meeting
  queries with the week's start/end baked in as literal dates at creation time.
- **"Rückblick (Freitag)"** — manual, three prompts: what went well, what is open, what
  to carry over.
- **"Tage"** — a plain list of wikilinks to that week's 7 Daily notes, in order. Not
  embeds — just navigation, so the Monthly page doesn't balloon with duplicated Daily
  content.

Every query in every week section filters `WHERE type = "journal"` (each template's
frontmatter `type::` distinguishes Daily from Monthly/Yearly) and excludes
`Journal/_templates` from `FROM` — defense in depth so a week section can never pick up
its own page's or a sibling page's manual Termine as if it were a Daily entry, even
though in practice only Daily pages ever populate `time::`.

**Not verifiable from the CLI** — Dataview/Templater only render inside Obsidian, so
after creating a new Monthly/Yearly note, open it in Obsidian once to confirm the nav
links and every week section's two auto-blocks actually render as expected (this
Templater loop is the most complex generation logic in the vault so far — worth a
closer look the first time a new Monthly note is created).

## Sync

Work setup: single desktop machine. The vault folder lives in a **OneDrive** folder
(company tenant) **or** is a git repo with an approved company remote — not both on the same
folder (OneDrive and `.git` do not mix well). `.gitignore` excludes `.trash/`,
`workspace*.json` and `.DS_Store`. Commit and push manually at checkpoints; no agent
should push automatically or on a schedule.

## Meeting notes

Created from `Journal/_templates/meeting.md` (Templater "Insert template" or a new note
with that template). Frontmatter `type: meeting` and `date: YYYY-MM-DD` drive the "Meetings
heute / dieser Woche" queries. Store each meeting note in the project or area it belongs to
(`Projects/<name>/` or `Areas/<name>/`) — never in `Journal/`. Reference everything with
wikilinks: project/area page, attendees (`Resources/entities/`), related notes. Tasks that
come out of a meeting are written in the note's "Aufgaben" section with the usual fields
(`due::`, `scope::`, `assignee::`), so they appear in the Journal blocks automatically.

## Planning rhythm

- **Daily:** open today's note, fill "Planung heute" from the auto-blocks.
- **Weekly:** Monday — fill "Planung (Montag)" in the current week section of the Monthly
  note; Friday — fill "Rückblick (Freitag)".
- **Monthly:** at the start fill "Monatsplanung", at the end "Monatsrückblick".

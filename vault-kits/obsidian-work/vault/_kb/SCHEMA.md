---
title: Wiki Schema
type: system-doc
updated: 2026-11-11
---

# Wiki Schema

## Domain

Personal + work knowledge base, combined with PARA task/project organisation and daily
journaling. Not a single-topic research wiki — spans whatever the user is working on or
learning about, professionally or personally.

## Conventions

- File names: descriptive, spaces allowed (matches existing vault style — this is a
  personal vault, not a code repo, so filenames prioritise readability over
  machine-parsing).
- Every `Resources/`, `Projects/`, and `Areas/` page starts with YAML frontmatter (see
  below). Journal pages use the frontmatter Periodic Notes/Templater generates.
- Use `[[wikilinks]]` to link between pages. Minimum 2 outbound links per
  `Resources/entities` or `Resources/concepts` page (per the LLM-wiki pattern) — not
  enforced on Journal or Inbox pages, which are allowed to stand alone.
- When updating a page, bump the `updated` date in frontmatter.
- Every new `Resources/`, `Projects/`, or `Areas/` page is added to `_kb/index.md`
  under the correct section. Journal pages are NOT added to the index (the Periodic
  Notes calendar handles that navigation).
- Every action (page created/updated, source ingested, query filed, journal note
  created) is appended to `_kb/log.md`.
- **Provenance markers:** on `Resources/` pages synthesising 3+ sources, append
  `^[_kb/raw/articles/source-file.md]` at the end of paragraphs whose claims come from
  a specific source.
- **Scope tags (Areas/Projects only):** every `Areas/` or `Projects/` page gets an
  additional tag identifying its scope, so pages belonging together can be found via
  the tag pane without a separate linking field:
  - Page lives in a subfolder shared with other pages (e.g. `Areas/steuern/`,
    `Projects/hausbau/`) → tag = subfolder name, verbatim.
  - Standalone page, no subfolder (e.g. `Projects/Umzug.md`) → tag = the page's
    own name, slugified (lowercase, spaces/special chars → hyphens).
  - If a project ever grows to more than one file, give it a subfolder (don't tag
    multiple top-level files with a shared ad-hoc tag) — keeps the tag mechanically
    derivable from the folder structure, no separate mapping to maintain.
  - **Not applied to `Resources/`** — `type: entity | concept | comparison` in
    frontmatter already identifies the sub-category, a scope tag would just duplicate
    it.

## Frontmatter

```yaml
---
title: Page Title
created: YYYY-MM-DD
updated: YYYY-MM-DD
type: entity | concept | comparison | query | project | area | resource | meeting
tags: [from taxonomy below]
sources: [_kb/raw/articles/source-name.md]   # Resources pages only, when applicable
# Optional quality signals (Resources pages):
confidence: high | medium | low
contested: true
contradictions: [other-page-slug]
# PARA-specific (Projects only):
status: active | on-hold | done
due: YYYY-MM-DD
# Meeting notes only:
date: YYYY-MM-DD
---
```

### `raw/` frontmatter

```yaml
---
source_url: https://example.com/article
ingested: YYYY-MM-DD
sha256: <hex digest of the raw content below the frontmatter>
---
```

## Tag taxonomy

Every tag on a page must appear here. Add new tags here BEFORE using them — this
prevents tag sprawl.

- **Life areas:** work, private, health, finance, family
- **Content type:** person, company, tool, model, technique, howto
- **Meta:** comparison, timeline, controversy, prediction, journal

Rule: if a needed tag doesn't fit any of the above, add it to this list first, then use
it.

**Exception — scope tags:** the per-page scope tag described above (subfolder name or
page-name-slug) is exempt from pre-registration here. It's mechanically derived from
the file path, not a free-form category, so there's nothing to standardise in advance —
every `Areas/`/`Projects/` page just gets its own.

## Page thresholds

- **Create a `Resources/` page** when an entity/concept appears in 2+ sources OR is
  central to one source, OR when the user explicitly wants a reference page for a
  person/tool/company they interact with regularly (independent of "2+ sources" — this
  vault also tracks people/tools the user works with directly, not just research
  subjects).
- **Add to an existing page** when a source mentions something already covered.
- **Don't create a page** for passing mentions or things outside current relevance.
- **Split a page** when it exceeds ~200 lines.
- **Archive a page** when fully superseded — move to `Archive/`, remove from
  `_kb/index.md`.

## Task metadata fields (Dataview inline fields)

- `due:: YYYY-MM-DD` — optional, add when a real deadline exists.
- `assignee:: [[Person]]` — only when someone other than the user owns the task. Omit
  = user is the implicit assignee.
- No `concerns::` field exists yet. A plain `[[Wikilink]]` in the task text is enough
  to associate a task with a person the user is acting on behalf of / about. Only add
  a structured field later if a concrete filtering/grouping need for that specific
  case actually comes up — don't pre-build fields without a use case.
- `scope:: [[Project/Area/Resource page]]` — optional, links a task (wherever it's
  written, typically in a Journal entry) to the Project/Area/Resource/entity it
  belongs to. Always a wikilink to the actual page, never a raw text tag — a link
  gives clickable navigation, automatic backlinks on the target page ("Linked
  mentions"), and is groupable in Dataview (`GROUP BY scope`) without a second,
  duplicate tagging mechanism. Complements the page-level scope tag above: task →
  page (`scope::`), page → category (the page's own scope tag). Omit when a task has
  no clear project/area association (e.g. purely personal tasks).
- `priority:: N` — optional, integer 1 (highest) to 3 (lowest). Drives sort order on
  [[Tasks-Übersicht]] (`SORT priority asc, due asc`). Omit when a task has no
  meaningful priority relative to others — unprioritised tasks sort after prioritised
  ones (Dataview puts missing/null values last in ascending sort), so omitting is safe
  and doesn't hide the task.
- `captured:: YYYY-MM-DD` — optional, the date a task was first written down, when
  that's earlier than the Journal page it ends up living on (e.g. transcribed from a
  paper notebook days after the fact). Set once, never updated — pairs with `due::` to
  make lead time computable later (`due`/completion − `captured`) without needing a
  full per-change migration log. Same field name/meaning as the `captured::` field
  used on Inbox quick-capture notes, also valid on
  tasks. Omit when a task is captured the same day it's written — `created`-equivalent
  info is then already implicit in which Journal page it's on.
- `emotion:: Text` — optional, free-text mood/emotional-state note attached to a task
  or Journal note.

**Dataview gotcha — `<=`/`>=` on an optional field silently matches missing values.**
Dataview's total ordering defines `null < number < string < boolean < link < date <
duration < array < object`, so a task with no `due::` at all evaluates as `null`, and
`null <= <any date>` is `true`. A `WHERE due <= this.file.day` clause (no other guard)
therefore also matches every task that has NO due date whatsoever, not just overdue
ones — found live when "Heute fällig" (see Daily Journal below) started
showing far more tasks than expected after switching from `=` to `<=`. Always add an
explicit `due` truthy-guard before any `<=`/`>=` comparison on an optional field:
`WHERE !completed AND due AND due <= this.file.day`. Equality (`due = this.file.day`)
doesn't have this problem — `null = <date>` is `false` — so this only bites range
comparisons.

**Dataview gotcha — `sum(rows.item.X)` breaks with "No implementation found for
'array + null'" when a `GROUP BY` mixes structurally different list items.**
If a query groups list items (`FLATTEN file.lists AS item ... GROUP BY item.<key>`) and
sums a field that is entirely absent on some of the grouped items, the sum fails. Guard
on the summed field too, not just the grouping field:
`WHERE item.<key> AND item.<summed field> AND ...`.

## Termine list items (non-task, `## Termine` sections)

Unlike task metadata fields above, `Termine` entries are plain list items, not
checkboxes — `- HH:MM — Text`, no `- [ ]`. One Dataview inline field applies here:

- `time:: HH:MM` — required if this Termin should show up in the Weekly/Monthly/Yearly
  "Termine aus den Tagesseiten" aggregation (see "Weekly / Monthly / Yearly Journal
  pages" in CONTEXT.md); omit for Termine that don't need to surface there. Redundant
  with the time already written in the visible bullet text on purpose — same pattern as
  `due::` tasks, which also repeat the date/time in prose (readability) alongside the
  machine-readable field.
- The aggregation query uses `FLATTEN file.lists AS item` + `WHERE item.time` to reach
  individual list items across Journal pages — the one place in this vault that queries
  below page-level. Only `Journal/*` daily pages should ever populate `time::`; the
  Weekly/Monthly/Yearly pages themselves are explicitly excluded from that query's
  `FROM` clause (`AND !"Journal/Weekly" AND !"Journal/Monthly" AND !"Journal/Yearly"`)
  so their own manual Termine bullets never get picked up as if they were Daily
  entries.

## Update policy (contradictions)

When new information conflicts with existing content:
1. Check dates — newer sources generally supersede older ones.
2. If genuinely contradictory, note both positions with dates and sources.
3. Mark the contradiction in frontmatter: `contradictions: [page-name]`.
4. Flag for user review in the next lint report.

## Deliberately minimal dependencies

This vault avoids adding plugins purely for cosmetic/organisational convenience when a
built-in Obsidian setting achieves an acceptable result (e.g. `_kb/` is hidden via the
stock "Excluded files" setting, not a dedicated folder-hiding plugin). iPhone is a
capture-only device because Dataview is unreliable on iOS.

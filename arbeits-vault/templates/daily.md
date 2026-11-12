---
type: journal
date: {{date:YYYY-MM-DD}}
monat: "[[{{date:YYYY-MM}}]]"
---

## Fokus

- 

## Termine

- 

## Todos

- [ ] 

## Log

- 

## Besprechungen heute

```base
filters:
  and:
    - 'type == "meeting"'
    - file.hasLink(this.file)
views:
  - type: list
    name: Meetings
    order:
      - file.name
```

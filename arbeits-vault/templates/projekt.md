---
type: projekt
status: aktiv
bereich: 
ziel: 
start: {{date:YYYY-MM-DD}}
zieldatum: 
---

## Ergebnis

Was liegt vor, wenn das Projekt fertig ist?

## Nächste Schritte

- [ ] 

## Notizen

- 

## Meetings

```base
filters:
  and:
    - 'type == "meeting"'
    - file.hasLink(this.file)
views:
  - type: table
    name: Meetings
    order:
      - file.name
      - date
      - thema
```

## Log

- 

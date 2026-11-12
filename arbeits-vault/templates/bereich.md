---
type: bereich
---

## Verantwortung

Wofür stehe ich hier dauerhaft ein, und woran merke ich, dass es gut läuft?

## Projekte in diesem Bereich

```base
filters:
  and:
    - 'type == "projekt"'
    - file.hasLink(this.file)
views:
  - type: table
    name: Projekte
    order:
      - file.name
      - status
      - zieldatum
```

## Notizen

- 

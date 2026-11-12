---
type: month
monat: {{date:YYYY-MM}}
---

## Ziele diesen Monat

Je Ziel: welches 12-Monats-Ziel es voranbringt und woran du erkennst, dass es erreicht ist.

- 

## Fokusthemen

- 

## Wichtige Termine

![[termine.base#Kommend]]

## Dailies und Meetings

```base
filters:
  and:
    - file.hasLink(this.file)
views:
  - type: table
    name: Diesen Monat
    order:
      - file.name
      - type
```

## Rückblick

- 

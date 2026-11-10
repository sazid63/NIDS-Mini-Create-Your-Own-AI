# Design: NIDS Mini guide ("a small exhibition")

Written by hand from the built site (the automated documenter was not run).

## World
A gallery you walk through: six rooms (Start, Data, Brain, Training, Testing, Launch). The frame is loud and colourful; the reading column stays calm.

## Colour
- Ground `#F3F4F8` (cool gallery white), ink `#161A33`, secondary ink `#454B6E`, hairline `#D8DBE8`, cards white.
- Wall colours, one per room, set with `data-room` (`--wall`, `--on-wall`): Start navy `#1E2A78` (white text), Data amber `#FFB627` (ink), Brain violet `#6D4DEB` (white), Training coral `#FF6B57` (ink), Testing teal `#12B5A6` (ink), Launch blue `#1F5FE0` (white).
- Eight code-part colours (`.part-0` to `.part-7`) tint a part's code and its explanation chips.

## Type
Bricolage Grotesque (display: room titles, numerals, part headings), Atkinson Hyperlegible Next (reading, 17px, 68ch measure), JetBrains Mono (code only). Self-hosted through @fontsource packages.

## Components
Opener band in the wall colour with a big numeral; visitor-map rail (top bar with a Map button on phones); plate (hand-built SVG, flat colour, one per room); wall-label cards for glossary words; numbered step markers; command card (ink bar + copy button + plain explanation); code breakdown (numbered colour parts, code then explanation, key lines as chips); "You should see" screen block; "Stuck?" note tinted from the wall colour.

## Motion
One moment: the numeral and plate settle into place on entering a room (transform only; off under reduced motion).

## Known gaps
No "Plate N" caption plaques. Final reviewer verdict round not run after the fixes.

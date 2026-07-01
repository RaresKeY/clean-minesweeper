# Architecture

## Shape

The application is a static web app:

| Path | Role |
|------|------|
| `public/index.html` | Browser entry point and semantic structure. |
| `public/styles.css` | Layout, responsive rendering, tile states, and focus styles. |
| `public/src/game.js` | Pure game engine with no DOM dependency. |
| `public/src/app.js` | DOM rendering, input wiring, persistence-free session state, and UI commands. |
| `public/assets/` | Generated PNG assets and favicon files consumed by the page. |
| `scripts/` | Local generation helpers; not required at runtime. |
| `tests/` | Node-based verification; not required at runtime. |

## Dependency Boundary

- Runtime must work with only browser-native HTML, CSS, and JavaScript.
- Tests must use Node built-ins only.
- Asset generation may use Python standard library where practical, but committed assets are the source used by the app.

## Module Contract

- `game.js` owns board data, mine placement, reveal flood-fill, flag cycling, win/loss status, and stats.
- `app.js` owns DOM state, event translation, timer display, responsive board CSS variables, keyboard navigation, touch long-press, and reset/difficulty controls.
- Rendering must derive from engine state rather than duplicating gameplay rules in DOM code.

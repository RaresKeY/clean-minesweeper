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
| `tests/` | Node-based verification; not required at runtime. |
| `package.json` | Local scripts and ESM test configuration with no dependencies. |
| `.github/workflows/deploy-pages.yml` | Publishes only `public/` to GitHub Pages after updates reach `main`. |

## Dependency Boundary

- Runtime must work with only browser-native HTML, CSS, and JavaScript.
- Tests must use Node built-ins only.
- Committed PNG assets are the source used by the app; local generation helpers are intentionally excluded from Git.

## Module Contract

- `game.js` owns board data, mine placement, reveal flood-fill, flag cycling, win/loss status, and stats.
- `app.js` owns DOM state, event translation, timer display, responsive board CSS variables, keyboard navigation, touch long-press and flag mode, session-only theme state, and the nested reset/difficulty menu.
- Rendering must derive from engine state rather than duplicating gameplay rules in DOM code.

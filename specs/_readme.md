# Clean Minesweeper Document Map

Clean Minesweeper is a browser-only static web Minesweeper game. The deployable surface lives in `public/` and must not require outside runtime dependencies.

## Active Specs

| Spec | Subsystem | Purpose |
|------|-----------|---------|
| [Architecture](architecture.md) | Project structure | Defines the static app shape, dependency boundary, and module responsibilities. |
| [Gameplay Engine](gameplay_engine.md) | Game rules | Defines board generation, reveal, flagging, win/loss, timer, and difficulty behavior. |
| [Input And Accessibility](input_accessibility.md) | Interaction | Defines mouse, keyboard, touch, focus, and screen-reader behavior. |
| [Visual Assets](visual_assets.md) | Assets | Defines generated tile images, favicon, sizing, and number rendering rules. |
| [Deployment](deployment.md) | Hosting | Defines static hosting assumptions and browser-only runtime constraints. |
| [Verification](verification.md) | Testing | Defines local checks and expected manual smoke coverage. |

## Current Boundaries

- No network calls, analytics, ads, CDN fonts, package imports, or third-party runtime dependencies.
- Generated raster assets are committed under `public/assets/`.
- Numbers are rendered with CSS and text, not pre-rendered into tile images.
- The public GitHub Pages workflow deploys only `public/`; configuration and state for other hosting providers stay local-only.

## Volatile State To Re-check

| Topic | Re-check When |
|-------|---------------|
| GitHub remote | Before pushing or changing repo visibility. |
| GitHub Pages | When its workflow, action versions, permissions, public URL, or publishing behavior changes. |
| Other hosting providers | Before deployment; their configuration and state stay local-only. |
| Browser behavior | When changing input handling, layout sizing, or tile assets. |

## Spec Update Rule

When implementation changes behavior, assets, deployment, or verification commands, update the nearest relevant spec and this map if a spec is added or moved.

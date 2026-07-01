# Clean Minesweeper

A clean, dependency-free Minesweeper game that runs entirely in the browser.

Live site: https://clean-minesweeper.web.app

## Features

- Classic beginner, intermediate, and expert boards
- First-click-safe mine placement
- Mouse, keyboard, and touchscreen controls
- Locally generated PNG tile/icon assets
- No runtime dependencies, accounts, analytics, ads, or network API calls

## Run Locally

```bash
python3 -m http.server 8080 --directory public
```

Then open `http://localhost:8080`.

## Verify

```bash
node tests/game.test.mjs
```

If Node is not installed, Deno can run the same test file:

```bash
deno run tests/game.test.mjs
```

## Deploy

Firebase Hosting is configured with `public/` as the deploy root.

```bash
firebase deploy --only hosting --project clean-minesweeper
```

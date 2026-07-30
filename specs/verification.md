# Verification

## Automated

Run:

```bash
npm test
```

or, without npm:

```bash
node tests/game.test.mjs
```

If Node is unavailable, use Deno's Node-compatible standard imports:

```bash
deno run tests/game.test.mjs
```

The automated test suite covers core engine behavior with built-in runtime APIs only.

The GitHub Pages workflow publishes only after changes reach `main`. Its deployment must finish successfully before treating the public URL as updated.

## Manual Smoke

After UI changes:

- Serve with `python3 -m http.server 8080 --directory public`.
- Verify beginner, intermediate, and expert reset correctly.
- Verify the `MENU` button opens the board and theme submenus, marks the active choices, and closes after a selection.
- Verify dark is the initial theme and the light theme updates the whole HUD, board, menu, and browser theme color.
- Verify mouse reveal, right-click flagging, and chording.
- Verify keyboard arrows, `Space`/`Enter`, `F`, `R`, `M`/`O`, and `Escape`.
- Verify touch tap, long-press, and menu-controlled flag mode on a touchscreen or browser device emulator.
- Verify native-style block numbers, counter glyphs, gold focused-cell outline, centered board, and responsive board scrolling in dark and light themes. In particular, `2` and `3` must show complete top, middle, and bottom bars.
- Verify focusing and clicking cells does not flash or rebuild unchanged cells, and that counters rebuild only when their displayed value changes.
- Verify the page does not make network requests beyond its own static files.
- After deployment changes merge, verify the Pages workflow succeeds and `https://rareskey.github.io/clean-minesweeper/` serves the expected app and static assets.

# Verification

## Automated

Run:

```bash
node tests/game.test.mjs
```

The automated test suite covers core engine behavior with Node built-ins only.

## Manual Smoke

After UI changes:

- Serve with `python3 -m http.server 8080 --directory public`.
- Verify beginner, intermediate, and expert reset correctly.
- Verify mouse reveal, right-click flagging, and chording.
- Verify keyboard arrows, `Space`/`Enter`, `F`, and `R`.
- Verify touch tap and long-press on a touchscreen or browser device emulator.
- Verify the page does not make network requests beyond its own static files.

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

## Manual Smoke

After UI changes:

- Serve with `python3 -m http.server 8080 --directory public`.
- Verify beginner, intermediate, and expert reset correctly.
- Verify mouse reveal, right-click flagging, and chording.
- Verify keyboard arrows, `Space`/`Enter`, `F`, and `R`.
- Verify touch tap and long-press on a touchscreen or browser device emulator.
- Verify the page does not make network requests beyond its own static files.

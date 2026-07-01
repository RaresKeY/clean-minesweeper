# Clean Minesweeper

A dependency-free static Minesweeper game for local play and later Firebase Hosting deployment.

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

## Deploy Later

The project includes `firebase.json` with `public/` as the hosting root. After choosing a Firebase project:

```bash
firebase login
firebase init hosting
firebase deploy
```

Use the existing `public` directory when prompted.

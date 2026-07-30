# Deployment

## Static Hosting

The deployable app is the `public/` directory:

- Hosting root: `public/`
- Static asset cache should be long-lived for PNG, ICO, and web manifest files.
- HTML/CSS/JS cache should be short-lived or revalidated for simple updates during iteration.

## Public Site

The public site is deployed at `https://rareskey.github.io/clean-minesweeper/` and linked from [README.md](../README.md).

## GitHub Pages

- `.github/workflows/deploy-pages.yml` deploys after a push to `main` and supports manual dispatch.
- The workflow uploads only `public/` as the Pages artifact; repository metadata, tests, specs, and local files are excluded.
- The deployment job uses the `github-pages` environment with `contents: read`, `pages: write`, and `id-token: write`.
- Concurrent deployments are serialized without cancelling a deployment already in progress.

## Browser-only Runtime

The game must not depend on provider SDKs, remote APIs, analytics, cookies, accounts, or server state. Hosting is only a static file target.

## Provider Config

The committed GitHub Pages workflow is public release infrastructure. Configuration, project IDs, generated deployment caches, and login state for other hosting providers stay local and ignored.

# Deployment

## Static Hosting

The deployable app is the `public/` directory:

- Hosting root: `public/`
- Static asset cache should be long-lived for PNG, ICO, and web manifest files.
- HTML/CSS/JS cache should be short-lived or revalidated for simple updates during iteration.

## Public Site

The public URL is listed in [README.md](../README.md).

## Browser-only Runtime

The game must not depend on provider SDKs, remote APIs, analytics, cookies, accounts, or server state. Hosting is only a static file target.

## Provider Config

Provider-specific config, project IDs, generated deployment caches, and login state should stay local unless a future public release needs them.

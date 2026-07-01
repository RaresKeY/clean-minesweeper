# Deployment

## Firebase Hosting

The repository includes `firebase.json` configured for Firebase Hosting:

- Hosting root: `public/`
- Static asset cache: long-lived for PNG, ICO, and web manifest files.
- HTML/CSS/JS cache: no-cache for simple updates during iteration.

## Current Deployment

- Firebase project ID: `clean-minesweeper`
- Default Hosting site: `clean-minesweeper`
- Public URL: `https://clean-minesweeper.web.app`
- Alternate Firebase URL: `https://clean-minesweeper.firebaseapp.com`

## Local-only Runtime

The game must not depend on Firebase SDKs, remote APIs, analytics, cookies, accounts, or server state. Firebase is only a static hosting target.

## Project ID

`.firebaserc` remains ignored because the deploy target can be selected with `--project clean-minesweeper`.

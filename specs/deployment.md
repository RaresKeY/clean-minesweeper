# Deployment

## Firebase Hosting

The repository includes `firebase.json` configured for Firebase Hosting:

- Hosting root: `public/`
- Static asset cache: long-lived for PNG, ICO, and web manifest files.
- HTML/CSS/JS cache: no-cache for simple updates during iteration.

## Local-only Runtime

The game must not depend on Firebase SDKs, remote APIs, analytics, cookies, accounts, or server state. Firebase is only a static hosting target.

## Project ID

Do not commit `.firebaserc` until a Firebase project is selected. The file is ignored by default.

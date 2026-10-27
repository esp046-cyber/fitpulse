# FitPulse PWA
## Run locally
`npm install && npm start` then open http://localhost:8080 (localhost counts as secure, so install and push work).
Generate your own push keys for production: `npx web-push generate-vapid-keys`, then set VAPID_PUBLIC / VAPID_PRIVATE / VAPID_SUBJECT.
## Deploy with HTTPS (needed for install and push)
- Render: push this repo, then New > Blueprint (uses render.yaml, HTTPS included, 1 GB disk keeps subscriptions). Any Docker host works with the Dockerfile.
- Static-only hosts (Netlify, GitHub Pages) serve the app over HTTPS and work offline, but server push needs the Node server; the app falls back to in-app reminders.
## Checks
`npm test` unit, `npm run e2e` Playwright flow + screenshots (baselines are created on first run; commit tests/*-snapshots), `npm run lhci` Lighthouse.

Files: index.html, manifest.json, service-worker.js, app.js, styles.css, icons/, src/ (data.js, muscles.js), public/offline.html, server/.
Accessibility: skip link, focus moves to each screen heading, labelled controls, 44px+ targets, light/dark/high-contrast themes, reduced-motion support; axe WCAG A/AA checks run in CI.

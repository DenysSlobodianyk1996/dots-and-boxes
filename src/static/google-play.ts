// The Android app's Google Play listing (SV-9). Welcome links to it and the web build's JSON-LD
// names it, but only once the app is in production: turn GOOGLE_PLAY_LIVE on then
// (docs/store/publishing-checklist.md). No app imports here: vite.config.ts loads this file too.

/** The Play listing of the Android app (`app.dotsandboxes`). */
export const GOOGLE_PLAY_URL = 'https://play.google.com/store/apps/details?id=app.dotsandboxes'

/** Whether the Android app is in production on Google Play, so the web game may link to it. */
export const GOOGLE_PLAY_LIVE: boolean = false

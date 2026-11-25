// The prerendered English Welcome in the Pages build's index.html (SV-2, SV-6) shows only where
// the app opens Welcome: the root page with no saved game. A load that ends on another screen (a
// saved game, a reload of /game, /settings or /privacy-policy, 404.html) hides it before the first
// paint, so Welcome doesn't flash up and jump away. Crawlers (no storage, the root page, or no
// JavaScript at all) still see it. No app imports here: vite.config.ts loads this file too.
import { CURRENT_GAME } from './storage-keys'

/** Set on `<html>` by the pre-paint script when the prerendered Welcome must not show. */
export const PRERENDER_HIDDEN = 'data-prerender-hidden'

/** Marks the prerendered content inside `#app`. */
export const PRERENDERED = 'data-prerendered'

/** The rule that hides the prerendered content once the script marked `<html>`. */
export const PRERENDER_HIDDEN_CSS = `[${PRERENDER_HIDDEN}] [${PRERENDERED}] { display: none }`

/** The pre-paint script for Vite's `base` (`/dots-and-boxes/` on Pages). */
export function prerenderedWelcomeScript(base: string): string {
  const root = base.endsWith('/') ? base : `${base}/`
  const rootPaths = [root, `${root}index.html`, root.slice(0, -1) || '/']
  return `(function () {
  var saved = null
  try { saved = localStorage.getItem(${JSON.stringify(CURRENT_GAME)}) } catch (e) {}
  if (saved !== null || ${JSON.stringify(rootPaths)}.indexOf(location.pathname) < 0) {
    document.documentElement.setAttribute(${JSON.stringify(PRERENDER_HIDDEN)}, '')
  }
})()`
}

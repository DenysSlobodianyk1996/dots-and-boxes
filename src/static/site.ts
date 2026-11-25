// The web game's public address, for every absolute link search engines and link previews read:
// canonical, Open Graph, JSON-LD, the sitemap and the static privacy page (SV-4, SV-5). Only the
// Pages build uses it; dev and the Android app need no absolute URLs. No app imports here:
// vite.config.ts loads this file too.

/** GitHub Pages' host for the repository owner. */
export const SITE_ORIGIN = 'https://denysslobodianyk1996.github.io'

/** The root page's absolute URL for Vite's `base` (`/dots-and-boxes/` on Pages), ending in `/`. */
export function siteUrl(base: string): string {
  return new URL(base, SITE_ORIGIN).href
}

/** The link preview image: the English Play feature graphic, copied to `public/`. */
export const PREVIEW_IMAGE = { file: 'og-image.png', width: 1024, height: 500 } as const

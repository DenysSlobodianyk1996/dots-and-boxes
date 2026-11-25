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

/**
 * Google Search Console's HTML-tag verification token for the URL-prefix property of the root page
 * (SV-8). Public by design: Google reads it from the page. Removing it unverifies the property.
 */
export const GOOGLE_SITE_VERIFICATION = 'jFybgwwGyr9yepRC53WaJmZYPZGWPFwLZD000UJpGIg'

/** The link preview image: the English Play feature graphic, which the Pages build emits. */
export const PREVIEW_IMAGE = { file: 'og-image.png', width: 1024, height: 500 } as const

export interface StructuredDataInput {
  /** The root page's absolute URL (`siteUrl(base)`). */
  site: string
  title: string
  description: string
  /** Every language the game speaks, as codes. */
  languages: readonly string[]
  /** The Play listing while the Android app is in production (SV-9), else null. */
  googlePlayUrl: string | null
}

/**
 * The root page's JSON-LD (SV-4): the web game as a free WebApplication in every language and,
 * once the Android app is in production, that app as a MobileApplication on Google Play (SV-9).
 */
export function structuredData({
  site,
  title,
  description,
  languages,
  googlePlayUrl,
}: StructuredDataInput): object {
  const context = { '@context': 'https://schema.org' }
  const shared = {
    name: title,
    description,
    applicationCategory: 'GameApplication',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    inLanguage: 'en',
    availableLanguage: [...languages],
  }
  const webApplication = {
    ...context,
    '@type': 'WebApplication',
    ...shared,
    url: site,
    operatingSystem: 'Web',
  }
  if (!googlePlayUrl) return webApplication
  const androidApp = {
    ...context,
    '@type': 'MobileApplication',
    ...shared,
    url: googlePlayUrl,
    installUrl: googlePlayUrl,
    operatingSystem: 'Android',
  }
  return [webApplication, androidApp]
}

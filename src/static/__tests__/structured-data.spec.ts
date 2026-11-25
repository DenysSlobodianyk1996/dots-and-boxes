/**
 * The JSON-LD the Pages build puts in the root page (SV-4, SV-9): the web game as a free
 * WebApplication in six languages, plus the Android app once it's in production on Google Play.
 */
import { describe, expect, it } from 'vitest'
import { structuredData } from '@/static/site'

const SITE = 'https://denysslobodianyk1996.github.io/dots-and-boxes/'
const LISTING = 'https://play.google.com/store/apps/details?id=app.dotsandboxes'
const GAME = {
  site: SITE,
  title: 'Dots and Boxes',
  description: 'Draw lines, close squares.',
  languages: ['en', 'uk'],
}

const WEB_APPLICATION = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Dots and Boxes',
  description: 'Draw lines, close squares.',
  url: SITE,
  applicationCategory: 'GameApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  inLanguage: 'en',
  availableLanguage: ['en', 'uk'],
}

describe('structured data', () => {
  it('describes only the web game while the Android app is not in production', () => {
    expect(structuredData({ ...GAME, googlePlayUrl: null })).toEqual(WEB_APPLICATION)
  })

  it('adds the Android app on Google Play once it is live (SV-9)', () => {
    expect(structuredData({ ...GAME, googlePlayUrl: LISTING })).toEqual([
      WEB_APPLICATION,
      {
        '@context': 'https://schema.org',
        '@type': 'MobileApplication',
        name: 'Dots and Boxes',
        description: 'Draw lines, close squares.',
        url: LISTING,
        installUrl: LISTING,
        applicationCategory: 'GameApplication',
        operatingSystem: 'Android',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        inLanguage: 'en',
        availableLanguage: ['en', 'uk'],
      },
    ])
  })
})

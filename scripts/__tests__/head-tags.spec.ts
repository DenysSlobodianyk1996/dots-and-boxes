/**
 * The built page's head tags for search engines and link previews (SV-4, SV-5): canonical, Open
 * Graph, Twitter and a JSON-LD WebApplication, all from the English locale, on the Pages build
 * only. The Android app's build carries none of them.
 */
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { build } from 'vite'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

// vitest.config.ts runs from the repo root
const root = process.cwd()
const SITE = 'https://denysslobodianyk1996.github.io/dots-and-boxes/'
const TITLE = 'Dots and Boxes'
const DESCRIPTION = 'The classic dots and boxes game: draw lines, close squares, beat the computer.'

async function buildInto(mode: string, base: string): Promise<string> {
  const outDir = mkdtempSync(join(tmpdir(), `head-tags-${mode}-`))
  await build({ root, mode, base, logLevel: 'silent', build: { outDir, emptyOutDir: true } })
  return outDir
}

function parse(html: string): Document {
  return new DOMParser().parseFromString(html, 'text/html')
}

const meta = (doc: Document, key: string) =>
  doc.querySelector(`meta[property="${key}"], meta[name="${key}"]`)?.getAttribute('content')

describe('the Pages build', () => {
  let outDir = ''
  let doc: Document

  beforeAll(async () => {
    outDir = await buildInto('production', '/dots-and-boxes/')
    doc = parse(readFileSync(join(outDir, 'index.html'), 'utf8'))
  }, 180_000)

  afterAll(() => rmSync(outDir, { recursive: true, force: true }))

  it('names the root page as canonical', () => {
    expect(doc.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(SITE)
  })

  it('has the Open Graph and Twitter tags for a link preview', () => {
    expect(meta(doc, 'og:type')).toBe('website')
    expect(meta(doc, 'og:title')).toBe(TITLE)
    expect(meta(doc, 'og:description')).toBe(DESCRIPTION)
    expect(meta(doc, 'og:url')).toBe(SITE)
    expect(meta(doc, 'og:image')).toBe(`${SITE}og-image.png`)
    expect(meta(doc, 'og:image:width')).toBe('1024')
    expect(meta(doc, 'og:image:height')).toBe('500')
    expect(meta(doc, 'og:locale')).toBe('en_US')
    expect(meta(doc, 'og:site_name')).toBe(TITLE)
    expect(meta(doc, 'twitter:card')).toBe('summary_large_image')
  })

  it('serves the preview image, left out of the offline precache', () => {
    expect(existsSync(join(outDir, 'og-image.png'))).toBe(true)
    expect(readFileSync(join(outDir, 'sw.js'), 'utf8')).not.toContain('og-image.png')
  })

  it('describes the game as a free web application in six languages', () => {
    const blocks = doc.querySelectorAll('script[type="application/ld+json"]')
    expect(blocks).toHaveLength(1)
    const data = JSON.parse(blocks[0]?.textContent ?? '')
    expect(data).toEqual({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: TITLE,
      description: DESCRIPTION,
      url: SITE,
      applicationCategory: 'GameApplication',
      operatingSystem: 'Web, Android',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      inLanguage: 'en',
      availableLanguage: ['en', 'uk', 'de', 'fr', 'it', 'es'],
    })
  })
})

describe("the Android app's build", () => {
  let outDir = ''
  let doc: Document

  beforeAll(async () => {
    outDir = await buildInto('capacitor', '/')
    doc = parse(readFileSync(join(outDir, 'index.html'), 'utf8'))
  }, 180_000)

  afterAll(() => rmSync(outDir, { recursive: true, force: true }))

  it('has no canonical, link preview tags or structured data', () => {
    expect(doc.querySelector('link[rel="canonical"]')).toBeNull()
    expect(doc.querySelector('meta[property^="og:"], meta[name^="twitter:"]')).toBeNull()
    expect(doc.querySelector('script[type="application/ld+json"]')).toBeNull()
  })
})

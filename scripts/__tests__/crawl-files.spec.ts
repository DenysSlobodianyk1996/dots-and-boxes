/**
 * The crawl files and the static privacy page's search tags (SV-4): the Pages build lists its two
 * indexable pages in sitemap.xml, names it in robots.txt, and the privacy page describes itself
 * and names its canonical address. The Android app's build has no crawl files.
 */
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { build } from 'vite'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

// vitest.config.ts runs from the repo root
const root = process.cwd()
const SITE = 'https://denysslobodianyk1996.github.io/dots-and-boxes/'
const PRIVACY_DESCRIPTION =
  'The app does not collect any personal data. It does not send data to any server, store data remotely or share data with anyone.'

async function buildInto(mode: string, base: string): Promise<string> {
  const outDir = mkdtempSync(join(tmpdir(), `crawl-files-${mode}-`))
  await build({ root, mode, base, logLevel: 'silent', build: { outDir, emptyOutDir: true } })
  return outDir
}

function parse(html: string, type: DOMParserSupportedType = 'text/html'): Document {
  return new DOMParser().parseFromString(html, type)
}

describe('the Pages build', () => {
  let outDir = ''

  beforeAll(async () => {
    outDir = await buildInto('production', '/dots-and-boxes/')
  }, 180_000)

  afterAll(() => rmSync(outDir, { recursive: true, force: true }))

  it('lists the root and the privacy page in the sitemap', () => {
    const sitemap = parse(readFileSync(join(outDir, 'sitemap.xml'), 'utf8'), 'application/xml')
    expect(sitemap.documentElement.namespaceURI).toBe('http://www.sitemaps.org/schemas/sitemap/0.9')
    const urls = [...sitemap.getElementsByTagName('loc')].map((loc) => loc.textContent)
    expect(urls).toEqual([SITE, `${SITE}privacy/`])
  })

  it('allows every crawler and names the sitemap in robots.txt', () => {
    const robots = readFileSync(join(outDir, 'robots.txt'), 'utf8').split('\n')
    expect(robots).toContain('User-agent: *')
    expect(robots).toContain('Allow: /')
    expect(robots).toContain(`Sitemap: ${SITE}sitemap.xml`)
  })

  it('gives the privacy page a description and its canonical address', () => {
    const page = parse(readFileSync(join(outDir, 'privacy/index.html'), 'utf8'))
    expect(page.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
      PRIVACY_DESCRIPTION,
    )
    expect(page.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      `${SITE}privacy/`,
    )
  })
})

describe("the Android app's build", () => {
  let outDir = ''

  beforeAll(async () => {
    outDir = await buildInto('capacitor', '/')
  }, 180_000)

  afterAll(() => rmSync(outDir, { recursive: true, force: true }))

  it('has no sitemap or robots file', () => {
    expect(existsSync(join(outDir, 'sitemap.xml'))).toBe(false)
    expect(existsSync(join(outDir, 'robots.txt'))).toBe(false)
  })

  it('gives the privacy page a description but no canonical address', () => {
    const page = parse(readFileSync(join(outDir, 'privacy/index.html'), 'utf8'))
    expect(page.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
      PRIVACY_DESCRIPTION,
    )
    expect(page.querySelector('link[rel="canonical"]')).toBeNull()
  })
})

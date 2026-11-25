/**
 * The root page's first HTML, before any JavaScript runs: the Pages build carries an English
 * Welcome for search engines (SV-2, SV-3), which the app replaces when it mounts (SV-6). The
 * Android app's build has none: Capacitor loads it from the device, where nobody crawls it.
 */
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { build } from 'vite'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

// vitest.config.ts runs from the repo root
const root = process.cwd()

const STEPS = [
  'Tap two neighboring dots to draw a line.',
  'Players take turns. Each new line starts from a dot that already has a line.',
  "Draw a square's fourth side and it's yours.",
  'After every line, the turn passes to the other player.',
  'Keep going until every square is claimed.',
  'Board full: most squares wins!',
]

/** Builds the app in `mode` and returns the built root page's mount point. */
async function builtMountPoint(mode: string, outDirs: string[]): Promise<HTMLElement> {
  const outDir = mkdtempSync(join(tmpdir(), 'prerendered-welcome-'))
  outDirs.push(outDir)
  await build({ root, mode, logLevel: 'silent', build: { outDir, emptyOutDir: true } })
  const html = readFileSync(join(outDir, 'index.html'), 'utf8')
  const app = new DOMParser().parseFromString(html, 'text/html').getElementById('app')
  if (!app) throw new Error(`The ${mode} build's index.html has no #app`)
  return app
}

const text = (element: Element | null | undefined) =>
  element?.textContent?.replace(/\s+/g, ' ').trim()

describe('the prerendered Welcome', () => {
  const outDirs: string[] = []
  let pages: HTMLElement
  let android: HTMLElement

  beforeAll(async () => {
    pages = await builtMountPoint('production', outDirs)
    android = await builtMountPoint('capacitor', outDirs)
  }, 240_000)

  afterAll(() => {
    for (const dir of outDirs) rmSync(dir, { recursive: true, force: true })
  })

  it('names the game in the header (SV-2)', () => {
    expect(text(pages.querySelector('header'))).toBe('Dots and Boxes')
  })

  it('has exactly one h1, the welcome heading (SV-3)', () => {
    expect([...pages.querySelectorAll('h1')].map(text)).toEqual(['Welcome to Dots and Boxes'])
  })

  it('states the goal and the six how-to-play steps (SV-2)', () => {
    expect(text(pages)).toContain('Whoever owns more squares when the board is full wins.')
    expect(text(pages.querySelector('h2'))).toBe('How to play')
    // each step after its number
    expect([...pages.querySelectorAll('ol > li')].map(text)).toEqual(
      STEPS.map((step, index) => `${index + 1}${step}`),
    )
  })

  it('is not in the Android build', () => {
    expect(android.innerHTML.trim()).toBe('')
  })
})

import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { LANGUAGE_CODES } from '../../src/i18n/languages.ts'
import { MESSAGES } from '../../src/i18n/messages.ts'
import { parseListing } from '../store-listing.ts'

const listingOf = (lang: string) =>
  parseListing(readFileSync(`${process.cwd()}/docs/store/${lang}/listing.md`, 'utf8'))

describe('parseListing', () => {
  it('reads each block with its stated count and limit, counting characters as Play does', () => {
    const listing = parseListing(
      '# Listing\n\n## Title (5 / 30)\n\n```text\nKäse😀\n```\n\n## Short description (2 / 80)\n\n```text\nab\n```\n',
    )

    expect(listing.title).toEqual({ text: 'Käse😀', stated: 5, limit: 30, length: 5 })
    expect(listing.short).toEqual({ text: 'ab', stated: 2, limit: 80, length: 2 })
    expect(listing.full).toBeUndefined()
  })
})

// LG-19, LG-20: a listing that is complete, fits Play's limits and states its real counts
describe.each(LANGUAGE_CODES)('the %s store listing', (lang) => {
  const listing = listingOf(lang)

  it('fits the limits of 30, 80 and 4000 characters', () => {
    expect(listing.title?.limit).toBe(30)
    expect(listing.short?.limit).toBe(80)
    expect(listing.full?.limit).toBe(4000)
    expect(listing.title?.length).toBeLessThanOrEqual(30)
    expect(listing.short?.length).toBeLessThanOrEqual(80)
    expect(listing.full?.length).toBeLessThanOrEqual(4000)
  })

  it('states the real length of every block', () => {
    for (const block of Object.values(listing)) expect(block.stated).toBe(block.length)
  })

  it('is titled with the app name in that language', () => {
    expect(listing.title?.text).toBe(MESSAGES[lang].app.title)
  })

  it("has the app's description in that language as its short description (SV-1, SV-7)", () => {
    expect(MESSAGES[lang].app.description).toBe(listing.short?.text)
  })

  it('names all six languages in the full description', () => {
    // each language's own word for the six, so a listing can't keep the old two-language line
    const names: Record<string, string[]> = {
      en: ['English', 'Ukrainian', 'German', 'French', 'Italian', 'Spanish'],
      uk: ['англійська', 'українська', 'німецька', 'французька', 'італійська', 'іспанська'],
      de: ['Englisch', 'Ukrainisch', 'Deutsch', 'Französisch', 'Italienisch', 'Spanisch'],
      fr: ['anglais', 'ukrainien', 'allemand', 'français', 'italien', 'espagnol'],
      it: ['inglese', 'ucraino', 'tedesco', 'francese', 'italiano', 'spagnolo'],
      es: ['inglés', 'ucraniano', 'alemán', 'francés', 'italiano', 'español'],
    }
    for (const name of names[lang] ?? []) {
      expect(listing.full?.text.toLowerCase()).toContain(name.toLowerCase())
    }
  })
})

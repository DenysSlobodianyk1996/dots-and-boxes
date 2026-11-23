import { afterEach, describe, expect, it, vi } from 'vitest'
import { firstPaintScript } from '@/i18n/first-paint'
import { LANGUAGES, resolveLanguage } from '@/i18n/languages'
import { MESSAGES } from '@/i18n/messages'

describe('the language list', () => {
  it('lists each language with its key and own name, in menu order (LG-1, LG-2)', () => {
    expect(LANGUAGES.map(({ code, key, name }) => [code, key, name])).toEqual([
      ['en', 'EN', 'English'],
      ['uk', 'УК', 'Українська'],
      ['de', 'DE', 'Deutsch'],
      ['fr', 'FR', 'Français'],
      ['it', 'IT', 'Italiano'],
      ['es', 'ES', 'Español'],
    ])
  })

  it('names the app in each language (LG-12)', () => {
    expect(LANGUAGES.map(({ code }) => MESSAGES[code].app.title)).toEqual([
      'Dots and Boxes',
      'Крапки й квадрати',
      'Käsekästchen',
      'Pipopipette',
      'Punti e quadrati',
      'Puntos y cuadrados',
    ])
  })
})

describe('the header name (LG-11, LG-12)', () => {
  it.each(LANGUAGES.map(({ code }) => code))('in %s is the app name', (code) => {
    const { headerName, shortName } = MESSAGES[code].app
    expect(headerName.replace(/\u00ad/g, '')).toBe(shortName)
    expect(shortName).not.toContain('\u00ad')
  })

  it('can break the one-word German name on a 320 px phone', () => {
    expect(MESSAGES.de.app.headerName).toBe('Käse\u00adkästchen')
  })
})

describe('resolving the language', () => {
  it.each([
    [['uk-UA'], 'uk'],
    [['en-GB'], 'en'],
    [['pl-PL'], 'en'],
    [[], 'en'],
    [['pl-PL', 'uk-UA', 'en-US'], 'uk'],
    [['en-US', 'uk-UA'], 'en'],
    [['UK_ua'], 'uk'],
    [['de-AT'], 'de'],
    [['fr-CA'], 'fr'],
    [['it-IT'], 'it'],
    [['es-419'], 'es'],
    [['pl-PL', 'es-MX', 'de-DE'], 'es'],
  ])('device languages %j give %s (LG-6)', (device, expected) => {
    expect(resolveLanguage(null, device)).toBe(expected)
  })

  it('keeps a saved language over the device (LG-7)', () => {
    expect(resolveLanguage('uk', ['en-US'])).toBe('uk')
    expect(resolveLanguage('en', ['uk-UA'])).toBe('en')
  })

  it('ignores a saved value that is not on the list (LG-6)', () => {
    expect(resolveLanguage('pl', ['uk-UA'])).toBe('uk')
  })
})

describe('the first-paint script (LG-8)', () => {
  afterEach(() => {
    document.documentElement.lang = ''
    document.title = ''
  })

  function runOn(languages: string[]) {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(languages)
    new Function(firstPaintScript())()
  }

  it('sets the page language and title from the device', () => {
    runOn(['pl-PL', 'uk-UA'])

    expect(document.documentElement.lang).toBe('uk')
    expect(document.title).toBe('Крапки й квадрати')
  })

  it('prefers the saved language', () => {
    localStorage.setItem('LOCALE', 'en')
    runOn(['uk-UA'])

    expect(document.documentElement.lang).toBe('en')
    expect(document.title).toBe('Dots and Boxes')
  })

  it('still picks a language when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    runOn(['uk-UA'])

    expect(document.documentElement.lang).toBe('uk')
  })
})

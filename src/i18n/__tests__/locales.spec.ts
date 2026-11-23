import { describe, expect, it } from 'vitest'
import { LANGUAGE_CODES } from '@/i18n/languages'
import { MESSAGES } from '@/i18n/messages'

/** Every leaf message path, e.g. `setup.title`. */
function keysOf(messages: object, prefix = ''): string[] {
  return Object.entries(messages).flatMap(([key, value]) =>
    value && typeof value === 'object' ? keysOf(value, `${prefix}${key}.`) : [`${prefix}${key}`],
  )
}

function valueAt(messages: object, path: string) {
  return path
    .split('.')
    .reduce<unknown>((node, key) => (node as Record<string, unknown>)[key], messages)
}

/** The `{name}` placeholders of a message, sorted. */
function placeholdersOf(message: unknown) {
  return [...String(message).matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort()
}

describe.each(LANGUAGE_CODES)('the %s messages', (code) => {
  const messages = MESSAGES[code]

  it('have exactly the English message keys (I18N-1)', () => {
    expect(keysOf(messages).sort()).toEqual(keysOf(MESSAGES.en).sort())
  })

  it('have the English placeholders in every message (I18N-1)', () => {
    for (const path of keysOf(MESSAGES.en)) {
      expect([path, placeholdersOf(valueAt(messages, path))]).toEqual([
        path,
        placeholdersOf(valueAt(MESSAGES.en, path)),
      ])
    }
  })

  it('have no empty messages (I18N-1)', () => {
    const empty = keysOf(messages).filter((path) => {
      const value = valueAt(messages, path)
      return typeof value !== 'string' || value.trim() === ''
    })
    expect(empty).toEqual([])
  })
})

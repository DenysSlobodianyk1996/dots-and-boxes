/**
 * Welcome's "Get it on Google Play" link (SV-9): hidden until the Android app is in production,
 * then shown, translated, with the Play listing's address. The live flag is mocked, so both
 * states stay covered whatever the shipped flag says.
 */
import { afterEach, describe, expect, it, vi } from 'vitest'
import { openGamePage } from '@/test/game-page'

const play = vi.hoisted(() => ({ live: false }))

vi.mock('@/static/google-play', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/static/google-play')>()
  return {
    ...original,
    get GOOGLE_PLAY_LIVE() {
      return play.live
    },
  }
})

const LISTING = 'https://play.google.com/store/apps/details?id=app.dotsandboxes'

afterEach(() => {
  play.live = false
})

describe('Google Play link on Welcome (SV-9)', () => {
  it('is hidden while the Android app is not in production', async () => {
    const page = await openGamePage({ onWelcome: true })

    expect(page.googlePlayLink()).toBeNull()
  })

  it.each([
    ['en', 'Get it on Google Play'],
    ['uk', 'Доступно в Google Play'],
    ['de', 'Jetzt bei Google Play'],
    ['fr', 'Disponible sur Google Play'],
    ['it', 'Disponibile su Google Play'],
    ['es', 'Disponible en Google Play'],
  ])('leads to the Play listing in %s once it is live', async (LOCALE, text) => {
    play.live = true

    const page = await openGamePage({ onWelcome: true, storage: { LOCALE } })

    expect(page.googlePlayLink()).toEqual({ text, href: LISTING })
  })
})

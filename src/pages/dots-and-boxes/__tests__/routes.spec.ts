import { describe, expect, it } from 'vitest'
import { ANNA, BOHDAN, openGamePage, savedPlayer, startGame } from '@/test/game-page'

const savedGame = {
  player1: savedPlayer(ANNA),
  player2: savedPlayer(BOHDAN),
  size: 2,
  currentPlayerName: ANNA.name,
  status: 'playing',
}

// Each screen has its own address (WL-1..WL-3, WL-16)
describe('Screen addresses', () => {
  it('shows Welcome at /', async () => {
    const page = await openGamePage({ path: '/' })

    expect(page.isWelcomeShown).toBe(true)
    expect(page.path).toBe('/')
  })

  it('shows Settings at /settings, also after a reload', async () => {
    const page = await openGamePage({ path: '/settings' })

    expect(page.isWelcomeShown).toBe(false)
    expect(page.input('player1.name').exists()).toBe(true)
    expect(page.path).toBe('/settings')
  })

  it('moves the address with Start and Home', async () => {
    const page = await openGamePage({ path: '/' })

    await page.clickStart()
    expect(page.path).toBe('/settings')

    await page.clickHome()
    expect(page.path).toBe('/')
    expect(page.isWelcomeShown).toBe(true)
  })

  it('moves to /game when a game starts and to /settings when it is left', async () => {
    const page = await startGame()
    expect(page.path).toBe('/game')

    await page.stopGame()
    await page.openSettings()
    expect(page.path).toBe('/settings')
    expect(page.isWelcomeShown).toBe(false)
  })

  it.each(['/', '/settings', '/game'])('opens a saved game at /game from %s', async (path) => {
    const page = await openGamePage({ path, storage: { CURRENT_GAME: savedGame } })

    expect(page.path).toBe('/game')
    expect(page.isWelcomeShown).toBe(false)
  })

  it.each(['/game', '/no-such-page'])('leads %s to Welcome without a game', async (path) => {
    const page = await openGamePage({ path })

    expect(page.path).toBe('/')
    expect(page.isWelcomeShown).toBe(true)
  })

  // Start adds Settings to the browser history; going back to Welcome steps back instead of
  // adding Welcome again, so browser Back from Welcome doesn't reopen Settings (SP-6)
  it.each(['Home', 'Back'] as const)(
    '%s returns to Welcome without a new history entry',
    async (how) => {
      const page = await openGamePage({ path: '/' })
      await page.clickStart()
      const length = page.historyLength

      if (how === 'Home') await page.clickHome()
      else await page.clickSetupBack()

      expect(page.path).toBe('/')
      expect(page.historyLength).toBe(length)
      expect(page.canGoBack).toBe(false)
    },
  )

  it('replaces the address when Settings was opened directly and Home leads to Welcome', async () => {
    const page = await openGamePage({ path: '/settings' })
    const length = page.historyLength

    await page.clickHome()

    expect(page.path).toBe('/')
    expect(page.historyLength).toBe(length)
  })
})

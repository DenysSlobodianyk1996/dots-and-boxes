import { describe, expect, it, vi } from 'vitest'
import {
  ANNA,
  BOHDAN,
  openGamePage,
  savedPlayer,
  startGame,
  stubReducedMotion,
} from '@/test/game-page'

const savedGame = (status: 'playing' | 'finished') => ({
  player1: savedPlayer(ANNA),
  player2: savedPlayer(BOHDAN),
  size: 2,
  currentPlayerName: ANNA.name,
  status,
  finishReason: status === 'finished' ? 'stopped' : null,
})

const STEPS = [
  'Tap two neighboring dots to draw a line.',
  'Players take turns. Each new line starts from a dot that already has a line.',
  "Draw a square's fourth side and it's yours.",
  'After every line, the turn passes to the other player.',
  'Keep going until every square is claimed.',
  'Board full: most squares wins!',
]

describe('Welcome screen', () => {
  it('opens on a launch without a saved game, with the footer (WL-1, FT-1)', async () => {
    const page = await openGamePage({ onWelcome: true })

    expect(page.isWelcomeShown).toBe(true)
    expect(page.isSetupShown).toBe(false)
    expect(page.footerLinks()).toHaveLength(2)
    expect(page.hasHomeButton).toBe(false)
  })

  it('opens again on the next launch (WL-2)', async () => {
    const page = await openGamePage({ onWelcome: true })
    await page.clickPlay()

    const next = await page.reload({ onWelcome: true })

    expect(next.isWelcomeShown).toBe(true)
  })

  it.each(['playing', 'finished'] as const)(
    'is skipped for a restored %s game (WL-3)',
    async (status) => {
      const page = await openGamePage({
        onWelcome: true,
        storage: { CURRENT_GAME: savedGame(status) },
      })

      expect(page.isWelcomeShown).toBe(false)
      expect(page.dotCount).toBe(9)
      expect(page.footerLinks()).toBeNull()
    },
  )

  it('Play leads to Settings, where the footer and Home show (WL-11, WL-12)', async () => {
    const page = await openGamePage({ onWelcome: true })

    await page.clickPlay()

    expect(page.isWelcomeShown).toBe(false)
    expect(page.isSetupShown).toBe(true)
    expect(page.footerLinks()).toHaveLength(2)
    expect(page.homeButtonLabel()).toBe('Home')
  })

  it('Home goes from Settings back to Welcome (WL-12)', async () => {
    const page = await openGamePage({ onWelcome: true })
    await page.clickPlay()

    await page.clickHome()

    expect(page.isWelcomeShown).toBe(true)
    expect(page.hasHomeButton).toBe(false)
  })

  it('keeps what was filled in on Settings across Home and Play (WL-11, WL-12)', async () => {
    const page = await openGamePage({ onWelcome: true })
    await page.clickPlay()
    await page.chooseMode('twoPlayers')
    await page.input('player1.name').setValue('Anna')
    await page.input('player2.name').setValue('Bohdan')
    await page.pickSwatch(2, 'teal')
    await page.pickSwatch(1, 'coral')
    await page.input('size').setValue('7')

    await page.clickHome()
    await page.clickPlay()

    expect(page.selectedMode()).toBe('twoPlayers')
    expect(page.input('player1.name').element.value).toBe('Anna')
    expect(page.input('player2.name').element.value).toBe('Bohdan')
    expect(page.selectedSwatch(1)).toBe('coral')
    expect(page.selectedSwatch(2)).toBe('teal')
    expect(page.input('size').element.value).toBe('7')
  })

  it('keeps the difficulty chosen on Settings across Home and Play (WL-12)', async () => {
    const page = await openGamePage({ onWelcome: true })
    await page.clickPlay()
    await page.chooseDifficulty('easy')

    await page.clickHome()
    await page.clickPlay()

    expect(page.selectedDifficulty()).toBe('easy')
    expect(localStorage.getItem('DIFFICULTY')).toBeNull()
  })

  it('keeps the Settings draft through the privacy screen (WL-12, WL-15)', async () => {
    const page = await openGamePage({ onWelcome: true })
    await page.clickPlay()
    await page.input('player1.name').setValue('Anna')

    await page.openPrivacy()
    await page.closePrivacy()

    expect(page.input('player1.name').element.value).toBe('Anna')
  })

  it('forgets the Settings draft on a new launch (WL-2)', async () => {
    const page = await openGamePage({ onWelcome: true })
    await page.clickPlay()
    await page.input('player1.name').setValue('Anna')
    await page.clickHome()

    const next = await page.reload({ onWelcome: true })
    await next.clickPlay()

    expect(next.input('player1.name').element.value).toBe('')
  })

  it('opens Settings blank after a started game has used the draft (WL-12)', async () => {
    const page = await openGamePage({ onWelcome: true })
    await page.clickPlay()
    await page.clickHome()
    await page.clickPlay()
    await page.input('player1.name').setValue('Anna')
    await page.submitSetupForm()
    await page.stopGame()
    await page.openSettings()

    expect(page.input('player1.name').element.value).toBe('')
  })

  it('moves focus to the Settings heading on Play (WL-11)', async () => {
    const page = await openGamePage({ onWelcome: true })

    await page.clickPlay()

    expect(page.focusedHeading()).toBe('Settings')
  })

  it('moves focus to the Welcome heading on Home (WL-12)', async () => {
    const page = await openGamePage({ onWelcome: true })
    await page.clickPlay()

    await page.clickHome()

    expect(page.focusedHeading()).toBe('How to play')
  })

  it('leaves focus alone when the app opens (WL-1)', async () => {
    const page = await openGamePage({ onWelcome: true })

    expect(page.focusedHeading()).toBeNull()
  })

  it('has no Home button during a game', async () => {
    const page = await startGame()

    expect(page.hasHomeButton).toBe(false)
  })

  it('Settings no longer shows the goal or the How to play link (WL-13)', async () => {
    const page = await openGamePage()

    expect(page.isSetupShown).toBe(true)
    expect(page.hasSetupGoal).toBe(false)
    expect(page.text()).not.toContain('How to play')
  })

  it('keeps the rules panel available (WL-14)', async () => {
    const page = await openGamePage({ onWelcome: true })

    await page.openRules()

    expect(page.rulesPanelName()).toBe('How to play')
    expect(page.rulesPoints()).toHaveLength(5)
  })

  it('returns to Welcome from the privacy screen when it was left from there (WL-15)', async () => {
    const page = await openGamePage({ onWelcome: true })

    await page.openPrivacy()
    expect(page.hasHomeButton).toBe(false)
    await page.closePrivacy()

    expect(page.isWelcomeShown).toBe(true)
  })

  it('returns to Settings from the privacy screen when it was left from there (WL-15)', async () => {
    const page = await openGamePage({ onWelcome: true })
    await page.clickPlay()

    await page.openPrivacy()
    expect(page.hasHomeButton).toBe(false)
    await page.closePrivacy()

    expect(page.isWelcomeShown).toBe(false)
    expect(page.isSetupShown).toBe(true)
    expect(page.hasHomeButton).toBe(true)
  })

  it('leaves a restored finished game through Settings without Welcome (WL-16)', async () => {
    const page = await openGamePage({
      onWelcome: true,
      storage: { CURRENT_GAME: savedGame('finished') },
    })

    await page.openSettings()

    expect(page.isWelcomeShown).toBe(false)
    expect(page.isSetupShown).toBe(true)
  })

  it('shows the finished board and winning caption, still, under reduced motion (WL-17)', async () => {
    stubReducedMotion()
    const frame = vi.spyOn(window, 'requestAnimationFrame')

    const page = await openGamePage({ onWelcome: true })

    expect(page.welcomeCaption()).toBe('Board full: most squares wins!')
    expect(page.demoBoard()).toEqual({ lines: 12, coral: 3, teal: 1, winner: 'coral' })
    expect(frame).not.toHaveBeenCalled()
  })

  it('stops the animation when Welcome closes (spec: Demo rendering)', async () => {
    const cancel = vi.spyOn(window, 'cancelAnimationFrame')
    const page = await openGamePage({ onWelcome: true })

    await page.clickPlay()

    expect(cancel).toHaveBeenCalled()
  })

  it('gives screen readers every step once, as text (WL-18)', async () => {
    const page = await openGamePage({ onWelcome: true })

    expect(page.welcomeSteps()).toEqual(STEPS)
    expect(page.isDemoHiddenFromAssistiveTech()).toBe(true)
    expect(page.isWelcomeCaptionHiddenFromAssistiveTech()).toBe(true)
  })

  it('shows the steps in Ukrainian (WL-20)', async () => {
    const page = await openGamePage({ onWelcome: true, storage: { LOCALE: 'uk' } })

    expect(page.welcomeSteps()[0]).toBe('Торкніться двох сусідніх крапок, щоб провести лінію.')
    expect(page.button('Грати').exists()).toBe(true)
  })
})

import { describe, expect, it, vi } from 'vitest'
import {
  ANNA,
  BOHDAN,
  GamePage,
  openGamePage,
  savedPlayer,
  startGame,
  stubReducedMotion,
} from '@/test/game-page'
import { mountGamePage } from '@/test/mount-game-page'

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
    await page.clickStart()

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

  it('Start leads to Settings, where the footer and Home show (WL-11, WL-12)', async () => {
    const page = await openGamePage({ onWelcome: true })

    await page.clickStart()

    expect(page.isWelcomeShown).toBe(false)
    expect(page.isSetupShown).toBe(true)
    expect(page.footerLinks()).toHaveLength(2)
    expect(page.homeButtonLabel()).toBe('Home')
  })

  it('Home goes from Settings back to Welcome (WL-12)', async () => {
    const page = await openGamePage({ onWelcome: true })
    await page.clickStart()

    await page.clickHome()

    expect(page.isWelcomeShown).toBe(true)
    expect(page.hasHomeButton).toBe(false)
  })

  it('keeps what was filled in on Settings across Home and Start (WL-11, WL-12)', async () => {
    const page = await openGamePage({ onWelcome: true })
    await page.clickStart()
    await page.chooseMode('twoPlayers')
    await page.input('player1.name').setValue('Anna')
    await page.input('player2.name').setValue('Bohdan')
    await page.pickSwatch(2, 'teal')
    await page.pickSwatch(1, 'coral')
    await page.input('size').setValue('7')

    await page.clickHome()
    await page.clickStart()

    expect(page.selectedMode()).toBe('twoPlayers')
    expect(page.input('player1.name').element.value).toBe('Anna')
    expect(page.input('player2.name').element.value).toBe('Bohdan')
    expect(page.selectedSwatch(1)).toBe('coral')
    expect(page.selectedSwatch(2)).toBe('teal')
    expect(page.input('size').element.value).toBe('7')
  })

  it('Settings shows Back to the left of Play (SP-5)', async () => {
    const page = await openGamePage({ onWelcome: true })
    await page.clickStart()

    expect(page.setupButtons()).toEqual(['Back', 'Play'])
  })

  it('Back goes from Settings to Welcome without starting a game (SP-5, SP-6)', async () => {
    const page = await openGamePage({ onWelcome: true })
    await page.clickStart()

    await page.clickSetupBack()

    expect(page.isWelcomeShown).toBe(true)
    expect(page.isSetupShown).toBe(false)
    expect(localStorage.getItem('CURRENT_GAME')).toBeNull()
  })

  it('keeps what was filled in on Settings across Back and Start (SP-6)', async () => {
    const page = await openGamePage({ onWelcome: true })
    await page.clickStart()
    await page.chooseMode('twoPlayers')
    await page.input('player1.name').setValue('Anna')
    await page.input('player2.name').setValue('Bohdan')
    await page.input('size').setValue('7')

    await page.clickSetupBack()
    await page.clickStart()

    expect(page.selectedMode()).toBe('twoPlayers')
    expect(page.input('player1.name').element.value).toBe('Anna')
    expect(page.input('player2.name').element.value).toBe('Bohdan')
    expect(page.input('size').element.value).toBe('7')
  })

  it('moves focus to the Welcome heading on Back (SP-6)', async () => {
    const page = await openGamePage({ onWelcome: true })
    await page.clickStart()

    await page.clickSetupBack()

    expect(page.focusedHeading()).toBe('Welcome to Dots and Boxes')
  })

  it('keeps the difficulty chosen on Settings across Home and Start (WL-12)', async () => {
    const page = await openGamePage({ onWelcome: true })
    await page.clickStart()
    await page.chooseDifficulty('easy')

    await page.clickHome()
    await page.clickStart()

    expect(page.selectedDifficulty()).toBe('easy')
    expect(localStorage.getItem('DIFFICULTY')).toBeNull()
  })

  it('keeps the Settings draft through the privacy screen (WL-12, WL-15)', async () => {
    const page = await openGamePage({ onWelcome: true })
    await page.clickStart()
    await page.input('player1.name').setValue('Anna')

    await page.openPrivacy()
    await page.closePrivacy()

    expect(page.input('player1.name').element.value).toBe('Anna')
  })

  it('forgets the Settings draft on a new launch (WL-2)', async () => {
    const page = await openGamePage({ onWelcome: true })
    await page.clickStart()
    await page.input('player1.name').setValue('Anna')
    await page.clickHome()

    const next = await page.reload({ onWelcome: true })
    await next.clickStart()

    expect(next.input('player1.name').element.value).toBe('')
  })

  it('opens Settings blank after a started game has used the draft (WL-12)', async () => {
    const page = await openGamePage({ onWelcome: true })
    await page.clickStart()
    await page.clickHome()
    await page.clickStart()
    await page.input('player1.name').setValue('Anna')
    await page.submitSetupForm()
    await page.stopGame()
    await page.openSettings()

    expect(page.input('player1.name').element.value).toBe('')
  })

  it('moves focus to the Settings heading on Start (WL-11)', async () => {
    const page = await openGamePage({ onWelcome: true })

    await page.clickStart()

    expect(page.focusedHeading()).toBe('Settings')
  })

  it('moves focus to the Welcome heading on Home (WL-12)', async () => {
    const page = await openGamePage({ onWelcome: true })
    await page.clickStart()

    await page.clickHome()

    expect(page.focusedHeading()).toBe('Welcome to Dots and Boxes')
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

  it('repeats its demo and steps in the rules panel (WL-14, RL-1)', async () => {
    const page = await openGamePage({ onWelcome: true })

    await page.openRules()

    expect(page.rulesPanelName()).toBe('How to play')
    expect(page.hasRulesDemo).toBe(true)
    expect(page.rulesPoints()).toEqual(STEPS)
    expect(page.rulesHighlightedStepCount()).toBe(1)
  })

  it('welcomes the player by the game name (WL-10)', async () => {
    const page = await openGamePage({ onWelcome: true })

    await page.clickStart()
    await page.clickHome()

    expect(page.focusedHeading()).toBe('Welcome to Dots and Boxes')
  })

  it('lists every step and highlights only the current one (WL-10)', async () => {
    const page = await openGamePage({ onWelcome: true })

    expect(page.welcomeSteps()).toEqual(STEPS)
    expect(page.highlightedStepCount()).toBe(1)
    expect(page.welcomeCaption()).toBe(STEPS[0])
  })

  it.each([
    ['en', 'Whoever owns more squares when the board is full wins.'],
    ['uk', 'Перемагає той, у кого більше квадратів, коли поле заповниться.'],
  ])('shows the goal under the title in %s (WL-10)', async (LOCALE, goal) => {
    const page = await openGamePage({ onWelcome: true, storage: { LOCALE } })

    expect(page.welcomeGoal()).toBe(goal)
  })

  it('has a How to play heading above the steps (WL-10)', async () => {
    const page = await openGamePage({ onWelcome: true })

    expect(page.welcomeStepsTitle()).toBe('How to play')
  })

  it('titles Welcome in the current language (WL-10)', async () => {
    const page = await openGamePage({ onWelcome: true, storage: { LOCALE: 'de' } })

    await page.clickStart()
    await page.clickHome()

    expect(page.focusedHeading()).toBe('Willkommen bei Käsekästchen')
  })

  it('jumps to a chosen step (WL-10)', async () => {
    const page = await openGamePage({ onWelcome: true })

    await page.chooseWelcomeStep(4)

    expect(page.welcomeCaption()).toBe(STEPS[3])
    expect(page.highlightedStepCount()).toBe(1)
  })

  it('shows a chosen step as a still picture under reduced motion (WL-17)', async () => {
    stubReducedMotion()
    const frame = vi.spyOn(window, 'requestAnimationFrame')
    const page = await openGamePage({ onWelcome: true })

    await page.chooseWelcomeStep(3)

    expect(page.welcomeCaption()).toBe(STEPS[2])
    expect(page.demoBoard()).toMatchObject({ lines: 5, coral: 1, teal: 0, winner: null })
    expect(frame).not.toHaveBeenCalled()
  })

  it('jumps to a chosen step in the rules panel too (WL-10, RL-1)', async () => {
    const page = await openGamePage({ onWelcome: true })
    await page.openRules()

    await page.chooseRulesStep(5)

    expect(page.rulesCurrentStep()).toBe(STEPS[4])
    expect(page.rulesHighlightedStepCount()).toBe(1)
  })

  it('marks each claimed square with its player A or B (WL-20)', async () => {
    stubReducedMotion()

    const page = await openGamePage({ onWelcome: true })

    expect([...page.demoBoard().squareLetters].sort()).toEqual(['A', 'A', 'A', 'B'])
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
    await page.clickStart()

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
    expect(page.demoBoard()).toMatchObject({ lines: 12, coral: 3, teal: 1, winner: 'coral' })
    expect(frame).not.toHaveBeenCalled()
  })

  it('stops the animation when Welcome closes (spec: Demo rendering)', async () => {
    const cancel = vi.spyOn(window, 'cancelAnimationFrame')
    const page = await openGamePage({ onWelcome: true })

    await page.clickStart()

    expect(cancel).toHaveBeenCalled()
  })

  it('gives screen readers the steps as a list, not the picture (WL-18)', async () => {
    const page = await openGamePage({ onWelcome: true })

    expect(page.welcomeSteps()).toEqual(STEPS)
    expect(page.isDemoHiddenFromAssistiveTech()).toBe(true)
  })

  it('shows the steps in Ukrainian (WL-20)', async () => {
    const page = await openGamePage({ onWelcome: true, storage: { LOCALE: 'uk' } })

    expect(page.welcomeSteps()[0]).toBe('Торкніться двох сусідніх крапок, щоб провести лінію.')
    expect(page.button('Почати').exists()).toBe(true)
  })

  it.each([
    ['en', 'Back'],
    ['uk', 'Назад'],
    ['de', 'Zurück'],
    ['fr', 'Retour'],
    ['it', 'Indietro'],
    ['es', 'Atrás'],
  ])('in %s names the Settings Back button %s (SP-5)', async (locale, back) => {
    const page = new GamePage(await mountGamePage({ storage: { LOCALE: locale }, onWelcome: true }))
    await page.clickStart()

    expect(page.setupButtons()[0]).toBe(back)
  })

  // Start leads to Settings, and Settings' Play starts the game (SP-3, SP-4)
  it.each([
    ['en', 'Start', 'Play'],
    ['uk', 'Почати', 'Грати'],
    ['de', "Los geht's", 'Spielen'],
    ['fr', 'Commencer', 'Jouer'],
    ['it', 'Inizia', 'Gioca'],
    ['es', 'Empezar', 'Jugar'],
  ])(
    'in %s names the Welcome button %s and the Settings button %s (SP-3, SP-4)',
    async (locale, start, play) => {
      const page = new GamePage(
        await mountGamePage({ storage: { LOCALE: locale }, onWelcome: true }),
      )

      expect(page.startButtonLabel).toBe(start)
      await page.clickStart()
      expect(page.setupPlayLabel).toBe(play)
    },
  )
})

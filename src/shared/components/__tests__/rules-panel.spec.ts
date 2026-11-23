import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  ANNA,
  BOHDAN,
  COMPUTER,
  openGamePage,
  startComputerGame,
  startGame,
  YOUR_TURN,
} from '@/test/game-page'

const RULES_EN = [
  'Tap two neighboring dots to draw a line.',
  'Players take turns. Each new line starts from a dot that already has a line.',
  "Draw a square's fourth side and it's yours.",
  'After every line, the turn passes to the other player.',
  'Keep going until every square is claimed.',
  'Board full: most squares wins!',
]

describe('rules panel', () => {
  it('opens from the info button in the header on the setup screen (VR-23)', async () => {
    const page = await openGamePage()
    expect(page.isRulesOpen()).toBe(false)

    await page.openRules()

    expect(page.isRulesOpen()).toBe(true)
    expect(page.rulesPanelName()).toBe('How to play')
  })

  it('opens from the header during a game too (VR-23)', async () => {
    const page = await startGame()

    await page.openRules()

    expect(page.isRulesOpen()).toBe(true)
  })

  it('is closed by default on both screens, with no rules shown inline (VR-27, VR-28)', async () => {
    const page = await openGamePage()
    expect(page.isRulesOpen()).toBe(false)
    expect(page.hasInlineRules()).toBe(false)
    expect(page.hasButton('Show rules')).toBe(false)
    expect(page.text()).not.toContain(RULES_EN[0])

    await page.submitSetup({
      mode: 'twoPlayers',
      player1: ANNA,
      player2: BOHDAN,
      size: 2,
      first: 1,
    })
    expect(page.isSetupShown).toBe(false)
    expect(page.isRulesOpen()).toBe(false)
    expect(page.hasInlineRules()).toBe(false)
    expect(page.text()).not.toContain('How to play')
  })

  it.each(['button', 'backdrop', 'escape'] as const)('closes with %s (VR-26)', async (how) => {
    const page = await openGamePage()
    await page.openRules()

    await page.closeRules(how)

    expect(page.isRulesOpen()).toBe(false)
  })

  it('shows the same demo and steps as Welcome (RL-1)', async () => {
    const page = await openGamePage()

    await page.openRules()

    expect(page.rulesPoints()).toEqual(RULES_EN)
    expect(page.hasRulesDemo).toBe(true)
    expect(page.rulesHighlightedStepCount()).toBe(1)
  })

  it.each([
    ['en', 'Whoever owns more squares when the board is full wins.'],
    ['uk', 'Перемагає той, у кого більше квадратів, коли поле заповниться.'],
  ])('shows the goal under the heading in %s (RL-1)', async (LOCALE, goal) => {
    const page = await openGamePage({ storage: { LOCALE } })

    await page.openRules()

    expect(page.rulesGoal()).toBe(goal)
  })

  it('shows the rules in Ukrainian with a Ukrainian title (VR-30)', async () => {
    const page = await openGamePage({ storage: { LOCALE: 'uk' } })

    await page.openRules()

    expect(page.rulesPanelName()).toBe('Як грати')
    expect(page.rulesPoints()[0]).toBe('Торкніться двох сусідніх крапок, щоб провести лінію.')
  })
})

describe('rules panel for keyboard and screen reader (VR-29)', () => {
  it('the info button reports whether the panel is open', async () => {
    const page = await openGamePage()
    expect(page.rulesButtonState()).toEqual({ label: 'Rules', expanded: 'false' })

    await page.openRules()
    expect(page.rulesButtonState()).toEqual({ label: 'Rules', expanded: 'true' })

    await page.closeRules('button')
    expect(page.rulesButtonState()).toEqual({ label: 'Rules', expanded: 'false' })
  })

  it('moves focus into the panel on open and keeps it there on Tab and Shift+Tab', async () => {
    const page = await openGamePage()

    await page.openRules()
    expect(page.focus()).toBe('rules panel')

    await page.pressTab()
    expect(page.focus()).toBe('rules panel')
    await page.pressTab()
    expect(page.focus()).toBe('rules panel')
    await page.pressTab({ shift: true })
    expect(page.focus()).toBe('rules panel')
  })

  it.each(['button', 'backdrop', 'escape'] as const)(
    'returns focus to the info button after closing with %s',
    async (how) => {
      const page = await openGamePage()
      await page.openRules()

      await page.closeRules(how)

      expect(page.focus()).toBe('info button')
    },
  )
})

describe('info buttons (NG-9)', () => {
  it('has no info button of its own: only the header one opens the rules', async () => {
    const page = await openGamePage()

    expect(page.rulesInfoButtons()).toEqual(['header'])
  })
})

describe('rules panel on the computer turn (VR-31)', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it("the computer waits while the panel is open and moves after it's closed", async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    const page = await startComputerGame({ first: 2 })

    await page.openRules()
    await page.waitForComputer(5000)
    expect(page.lineCount).toBe(0)
    expect(page.turn()).toBe(COMPUTER)

    await page.closeRules('escape')
    expect(page.lineCount).toBe(0)
    await page.waitForComputer()
    expect(page.lineCount).toBe(1)
    expect(page.turn()).toBe(YOUR_TURN)
  })
})

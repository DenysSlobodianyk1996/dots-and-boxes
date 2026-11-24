import { afterEach, describe, expect, it, vi } from 'vitest'
import { fakeDemoClock, openGamePage, watchFollowedSteps } from '@/test/game-page'

const STEPS = [
  'Tap two neighboring dots to draw a line.',
  'Players take turns. Each new line starts from a dot that already has a line.',
  "Draw a square's fourth side and it's yours.",
  'After every line, the turn passes to the other player.',
  'Keep going until every square is claimed.',
  'Board full: most squares wins!',
]

describe('following the steps', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('keeps following the demo after a tap on a step (SP-10)', async () => {
    fakeDemoClock()
    const followed = watchFollowedSteps()
    const page = await openGamePage({ onWelcome: true })

    await page.tapWelcomeStep(2)
    await page.playWelcomeDemoTo(3)

    expect(followed[followed.length - 1]).toBe(STEPS[2])
  })

  it("pauses while the player scrolls, then catches up with the demo's step (SP-10)", async () => {
    fakeDemoClock()
    const followed = watchFollowedSteps()
    const page = await openGamePage({ onWelcome: true })

    await page.wheelWelcomeSteps()
    followed.length = 0
    await page.playWelcomeDemoTo(2)
    expect(followed).toEqual([])

    await page.playDemo(5000)
    expect(followed[0]).toBe(page.welcomeCaption())
  })

  it('brings the current step into view when the rules panel opens (SP-8)', async () => {
    const followed = watchFollowedSteps()
    const page = await openGamePage()

    await page.openRules()

    expect(followed[followed.length - 1]).toBe(page.rulesCurrentStep())
  })
})

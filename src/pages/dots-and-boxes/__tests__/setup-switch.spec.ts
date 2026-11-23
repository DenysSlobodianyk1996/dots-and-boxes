import { describe, expect, it } from 'vitest'
import { openGamePage } from '@/test/game-page'

// One highlight slides to the chosen option of a switch (VC-25)
describe('Switch highlight', () => {
  it('moves to the chosen option and back', async () => {
    const page = await openGamePage()

    await page.chooseMode('computer')
    expect(page.modeHighlightPosition()).toBe(0)

    await page.chooseMode('twoPlayers')
    expect(page.modeHighlightPosition()).toBe(1)

    await page.chooseMode('computer')
    expect(page.modeHighlightPosition()).toBe(0)
  })
})

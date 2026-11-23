import { describe, expect, it } from 'vitest'
import { openGamePage } from '@/test/game-page'

// A name's error goes as soon as typing makes the name valid (GS-6)
describe('Name error while typing', () => {
  it('clears the required error on the first valid keystroke, without leaving the field', async () => {
    const page = await openGamePage()
    await page.chooseMode('twoPlayers')
    await page.submitSetupForm()
    expect(page.nameError('player1.name')).not.toBe('')

    await page.typeName('player1.name', 'A')

    expect(page.nameError('player1.name')).toBe('')
  })

  it('shows the error again if the name is emptied right after', async () => {
    const page = await openGamePage()
    await page.chooseMode('twoPlayers')
    await page.submitSetupForm()
    await page.typeName('player1.name', 'A')

    await page.typeName('player1.name', '')

    expect(page.nameError('player1.name')).not.toBe('')
  })

  it("clears both players' errors when one name stops matching the other", async () => {
    const page = await openGamePage()
    await page.chooseMode('twoPlayers')
    await page.typeName('player1.name', 'Anna')
    await page.typeName('player2.name', 'Anna')
    await page.submitSetupForm()
    expect(page.nameError('player1.name')).not.toBe('')
    expect(page.nameError('player2.name')).not.toBe('')

    await page.typeName('player2.name', 'Bohdan')

    expect(page.nameError('player1.name')).toBe('')
    expect(page.nameError('player2.name')).toBe('')
  })
})

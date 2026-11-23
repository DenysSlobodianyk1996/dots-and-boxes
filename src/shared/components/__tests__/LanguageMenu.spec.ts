import { describe, expect, it } from 'vitest'
import { mountGamePage } from '@/test/mount-game-page'
import { GamePage, openGamePage, startGame } from '@/test/game-page'

async function openOn(deviceLanguage: string, storage: Record<string, string> = {}) {
  return new GamePage(await mountGamePage({ deviceLanguage, storage }))
}

describe('language menu', () => {
  it('is a closed menu button showing the current key (LG-1, LG-4)', async () => {
    const page = await openOn('uk-UA')

    expect(page.languageButtonState()).toEqual({
      text: 'УК',
      label: 'Мова: Українська',
      hasPopup: 'menu',
      expanded: 'false',
    })
    expect(page.languageMenu()).toBeNull()
    expect(document.title).toBe('Крапки й квадрати')
  })

  it('lists every language with its key and own name, the current one ticked (LG-1, LG-2)', async () => {
    const page = await openOn('uk-UA')

    await page.clickLanguageButton()

    expect(page.languageButtonState().expanded).toBe('true')
    expect(page.languageMenuLabel()).toBe('Мова')
    expect(page.languageMenu()).toEqual([
      { key: 'EN', name: 'English', nameLang: 'en', checked: false, ticked: false },
      { key: 'УК', name: 'Українська', nameLang: 'uk', checked: true, ticked: true },
      { key: 'DE', name: 'Deutsch', nameLang: 'de', checked: false, ticked: false },
      { key: 'FR', name: 'Français', nameLang: 'fr', checked: false, ticked: false },
      { key: 'IT', name: 'Italiano', nameLang: 'it', checked: false, ticked: false },
      { key: 'ES', name: 'Español', nameLang: 'es', checked: false, ticked: false },
    ])
  })

  it('applies a choice at once and closes (LG-3, APP-1, UP-15)', async () => {
    const page = await openOn('uk-UA')

    await page.clickLanguageButton()
    await page.chooseLanguageRow('EN')

    expect(page.languageMenu()).toBeNull()
    expect(page.text()).toContain('Settings')
    expect(document.documentElement.lang).toBe('en')
    expect(document.title).toBe('Dots and Boxes')
    expect(page.manifestHref()).toBe('/manifest.en.webmanifest')
    expect(page.languageButtonState().text).toBe('EN')
    expect(page.languageFocus()).toBe('button')
  })

  it('closes without a change on a tap outside (LG-3)', async () => {
    const page = await openOn('uk-UA')

    await page.clickLanguageButton()
    await page.tapOutsideLanguageMenu()

    expect(page.languageMenu()).toBeNull()
    expect(document.documentElement.lang).toBe('uk')
    expect(localStorage.getItem('LOCALE')).toBeNull()
  })

  it('closes on a second tap of the button (LG-3)', async () => {
    const page = await openOn('uk-UA')

    await page.clickLanguageButton()
    await page.clickLanguageButton()

    expect(page.languageMenu()).toBeNull()
  })

  it('keeps the chosen language after a reload (LG-7, I18N-4)', async () => {
    const page = await openOn('uk-UA')
    await page.switchLanguage('en')
    page.wrapper.unmount()

    const reloaded = await openOn('uk-UA')

    expect(reloaded.text()).toContain('Settings')
    expect(document.documentElement.lang).toBe('en')
    expect(reloaded.languageButtonState().text).toBe('EN')
  })

  it('shows the short name in the header in each language (HD-2, NG-1)', async () => {
    const page = await openOn('uk-UA')
    expect(page.headerTitle()).toBe('Крапки й квадрати')

    await page.switchLanguage('en')
    expect(page.headerTitle()).toBe('Dots and Boxes')

    await page.switchLanguage('de')
    expect(page.headerTitle()).toBe('Käsekästchen')

    await page.switchLanguage('fr')
    expect(page.headerTitle()).toBe('Pipopipette')

    await page.switchLanguage('it')
    expect(page.headerTitle()).toBe('Punti e quadrati')

    await page.switchLanguage('es')
    expect(page.headerTitle()).toBe('Puntos y cuadrados')
  })

  it('keeps the running game when the language changes (LG-5)', async () => {
    const page = await startGame()
    await page.clickDot([0, 0])
    await page.clickDot([0, 1])
    const before = localStorage.getItem('CURRENT_GAME')

    await page.switchLanguage('uk')

    expect(localStorage.getItem('CURRENT_GAME')).toBe(before)
    expect(page.text()).not.toContain('Налаштування гри')
    expect(document.documentElement.lang).toBe('uk')
  })
})

describe('language menu by keyboard (LG-4)', () => {
  it('opens on the current language', async () => {
    const page = await openOn('uk-UA')
    page.focusLanguageButton()

    await page.clickLanguageButton()

    expect(page.languageFocus()).toBe('УК')
  })

  it('opens with the arrow keys', async () => {
    const page = await openOn('uk-UA')
    page.focusLanguageButton()

    await page.pressKey('ArrowDown')

    expect(page.languageMenu()).not.toBeNull()
    expect(page.languageFocus()).toBe('УК')
  })

  it('moves with the arrows, wrapping, and with Home and End', async () => {
    const page = await openOn('en-US')
    page.focusLanguageButton()
    await page.clickLanguageButton()
    expect(page.languageFocus()).toBe('EN')

    await page.pressKey('ArrowDown')
    expect(page.languageFocus()).toBe('УК')
    await page.pressKey('ArrowUp')
    expect(page.languageFocus()).toBe('EN')
    await page.pressKey('ArrowUp')
    expect(page.languageFocus()).toBe('ES')
    await page.pressKey('ArrowDown')
    expect(page.languageFocus()).toBe('EN')
    await page.pressKey('End')
    expect(page.languageFocus()).toBe('ES')
    await page.pressKey('Home')
    expect(page.languageFocus()).toBe('EN')
  })

  it('Escape closes without a change and returns focus to the button', async () => {
    const page = await openOn('uk-UA')
    page.focusLanguageButton()
    await page.clickLanguageButton()

    await page.pressKey('Escape')

    expect(page.languageMenu()).toBeNull()
    expect(page.languageFocus()).toBe('button')
    expect(document.documentElement.lang).toBe('uk')
  })

  it('Tab closes the menu', async () => {
    const page = await openOn('uk-UA')
    page.focusLanguageButton()
    await page.clickLanguageButton()

    await page.pressKey('Tab')

    expect(page.languageMenu()).toBeNull()
  })
})

describe('first launch follows the device language', () => {
  it('picks Ukrainian on a uk-UA device (LG-6, AR-6)', async () => {
    const page = await openOn('uk-UA')

    expect(page.languageButtonState().text).toBe('УК')
    expect(document.documentElement.lang).toBe('uk')
    expect(document.title).toBe('Крапки й квадрати')
    expect(page.manifestHref()).toBe('/manifest.uk.webmanifest')
  })

  it.each(['en-US', 'pl-PL'])('picks English on a %s device (LG-6, AR-6)', async (language) => {
    const page = await openOn(language)

    expect(page.text()).toContain('Settings')
    expect(page.languageButtonState().text).toBe('EN')
    expect(document.documentElement.lang).toBe('en')
    expect(document.title).toBe('Dots and Boxes')
    expect(page.manifestHref()).toBe('/manifest.en.webmanifest')
  })

  it('uses the first device language on the list (LG-6)', async () => {
    const page = new GamePage(await mountGamePage({ deviceLanguages: ['pl-PL', 'uk-UA', 'en-US'] }))

    expect(document.documentElement.lang).toBe('uk')
    expect(page.languageButtonState().text).toBe('УК')
  })

  it('keeps a saved language over the device language (LG-7, AR-7)', async () => {
    const page = await openOn('en-US', { LOCALE: 'uk' })

    expect(page.languageButtonState().text).toBe('УК')
    expect(document.documentElement.lang).toBe('uk')
    expect(document.title).toBe('Крапки й квадрати')
  })
})

describe('install manifest', () => {
  it('swaps the manifest link when the language changes (VR-50, VR-51)', async () => {
    const page = await openGamePage()
    expect(page.manifestHref()).toBe('/manifest.en.webmanifest')

    await page.switchLanguage('uk')
    expect(page.manifestHref()).toBe('/manifest.uk.webmanifest')

    await page.switchLanguage('en')
    expect(page.manifestHref()).toBe('/manifest.en.webmanifest')
  })
})

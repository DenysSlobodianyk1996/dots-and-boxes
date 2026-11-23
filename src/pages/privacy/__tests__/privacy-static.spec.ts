import { describe, expect, it } from 'vitest'
import { renderPrivacyPage } from '@/privacy-static'
import { APP_VERSION, PRIVACY_UPDATED } from '@/static'

// the static page Google Play links to: the in-app screen's text, every language, no script (PV-4)
describe('static privacy page', () => {
  async function render() {
    const html = await renderPrivacyPage({
      stylesheet: '../assets/index-test.css',
      darkVars: '--wc-paper: #241c17 !important; ',
    })
    return new DOMParser().parseFromString(html, 'text/html')
  }

  it('shows the policy in all six languages, from the same content as the app', async () => {
    const doc = await render()

    const sections = [...doc.querySelectorAll('[data-privacy-content]')]
    expect(sections.map((s) => s.getAttribute('lang'))).toEqual([
      'en',
      'uk',
      'de',
      'fr',
      'it',
      'es',
    ])
    expect(sections.map((s) => s.querySelector('h1, h2')?.textContent?.trim())).toEqual([
      'Privacy policy',
      'Політика конфіденційності',
      'Datenschutz\u00aderklärung',
      'Politique de confidentialité',
      'Informativa sulla privacy',
      'Política de privacidad',
    ])
    expect(doc.querySelectorAll('h1')).toHaveLength(1)
    expect(
      [...doc.querySelectorAll('[data-privacy-author]')].map((a) => a.textContent?.trim()),
    ).toEqual([
      'Created by Denys Slobodianyk',
      'Створив Денис Слободяник',
      'Entwickelt von Denys Slobodianyk',
      'Créé par Denys Slobodianyk',
      'Creato da Denys Slobodianyk',
      'Creado por Denys Slobodianyk',
    ])
    expect([...doc.querySelectorAll('time')].map((time) => time.getAttribute('datetime'))).toEqual(
      Array(6).fill(PRIVACY_UPDATED),
    )
  })

  it("shows the app's version under the date, in every language (PV-5)", async () => {
    const doc = await render()

    expect(
      [...doc.querySelectorAll('[data-privacy-version]')].map((v) => v.textContent?.trim()),
    ).toEqual([
      `Version: ${APP_VERSION}`,
      `Версія: ${APP_VERSION}`,
      `Version: ${APP_VERSION}`,
      `Version\u00a0: ${APP_VERSION}`,
      `Versione: ${APP_VERSION}`,
      `Versión: ${APP_VERSION}`,
    ])
  })

  it('needs no JavaScript: no script, the app stylesheet, dark from the device', async () => {
    const doc = await render()

    expect(doc.querySelectorAll('script')).toHaveLength(0)
    expect(doc.querySelector('link[rel="stylesheet"]')?.getAttribute('href')).toBe(
      '../assets/index-test.css',
    )
    expect(doc.querySelector('style')?.textContent).toContain('@media (prefers-color-scheme: dark)')
    expect(doc.title).toBe('Privacy policy · Dots and Boxes')
  })

  it("has the app's header with the logo and the game's name, and no buttons", async () => {
    const doc = await render()

    const header = doc.querySelector('header')
    expect(header?.querySelector('[data-app-logo] svg')).not.toBeNull()
    expect(header?.querySelector('[data-app-title]')?.textContent?.trim()).toBe('Dots and Boxes')
    expect(header?.querySelectorAll('button')).toHaveLength(0)
  })

  it('links to all six languages at the top, each in its own name (LG-15)', async () => {
    const doc = await render()

    const links = [...doc.querySelectorAll('main nav a')]
    expect(links.map((link) => [link.getAttribute('href'), link.textContent?.trim()])).toEqual([
      ['#en', 'English'],
      ['#uk', 'Українська'],
      ['#de', 'Deutsch'],
      ['#fr', 'Français'],
      ['#it', 'Italiano'],
      ['#es', 'Español'],
    ])
    for (const link of links) {
      expect(doc.querySelector(link.getAttribute('href') as string)).not.toBeNull()
    }
  })

  it('links back to the game', async () => {
    const doc = await render()

    expect(doc.querySelector('[data-open-game]')?.getAttribute('href')).toBe('../')
  })
})

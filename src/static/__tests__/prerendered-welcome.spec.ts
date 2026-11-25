/**
 * The prerendered English Welcome in index.html (SV-2, SV-6) is for crawlers and first visits to
 * the root page. A load that ends on another screen (a saved game, a reload of /game, /settings or
 * /privacy-policy, GitHub Pages' 404.html) hides it before the first paint, so Welcome doesn't
 * flash up and jump away when the app mounts.
 */
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PRERENDER_HIDDEN, prerenderedWelcomeScript } from '@/static/prerendered-welcome'

const BASE = '/dots-and-boxes/'

function loadAt(path: string) {
  window.history.replaceState(null, '', path)
  new Function(prerenderedWelcomeScript(BASE))()
}

const isHidden = () => document.documentElement.hasAttribute(PRERENDER_HIDDEN)

describe('the prerendered Welcome before the app loads', () => {
  afterEach(() => {
    document.documentElement.removeAttribute(PRERENDER_HIDDEN)
    window.history.replaceState(null, '', '/')
    vi.restoreAllMocks()
  })

  it.each([BASE, '/dots-and-boxes', `${BASE}index.html`])(
    'stays visible on the root page %s with no saved game',
    (path) => {
      loadAt(path)
      expect(isHidden()).toBe(false)
    },
  )

  it.each([`${BASE}game`, `${BASE}settings`, `${BASE}privacy-policy`, `${BASE}nowhere`])(
    'is hidden on %s',
    (path) => {
      loadAt(path)
      expect(isHidden()).toBe(true)
    },
  )

  it('is hidden on the root page when a game is saved', () => {
    localStorage.setItem('CURRENT_GAME', '{}')
    loadAt(BASE)
    expect(isHidden()).toBe(true)
  })

  it('stays visible on the root page when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    loadAt(BASE)
    expect(isHidden()).toBe(false)
  })
})

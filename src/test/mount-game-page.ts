import { vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'

export interface MountGamePageOptions {
  // localStorage entries to seed before the app loads, e.g. { LOCALE: 'en', CURRENT_GAME: {...} };
  // objects are JSON-serialized, strings are stored as they are (like StorageService)
  storage?: Record<string, object | string>
  // the device language (`navigator.language`); jsdom's own is 'en-US'
  deviceLanguage?: string
  // the device's ordered languages (`navigator.languages`); defaults to just `deviceLanguage`
  deviceLanguages?: string[]
  // leave the launch on Welcome; by default the page starts past it, on setup or a restored game
  onWelcome?: boolean
  // the address the app is opened at; overrides `onWelcome`'s choice of / or /settings
  path?: string
}

// Mounts the whole app at /settings (at / with `onWelcome`) with the real router, i18n and localStorage, the way main.ts does.
// Modules are re-imported on every call, so i18n reads the seeded locale and a second call
// in the same test simulates a page reload from whatever is saved in localStorage.
export async function mountGamePage({
  storage = {},
  deviceLanguage,
  deviceLanguages = deviceLanguage ? [deviceLanguage] : undefined,
  onWelcome = false,
  path = onWelcome ? '/' : '/settings',
}: MountGamePageOptions = {}) {
  if (deviceLanguages) {
    // undone by vi.restoreAllMocks() in src/test/setup.ts
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(deviceLanguages)
    vi.spyOn(navigator, 'language', 'get').mockReturnValue(deviceLanguages[0] ?? 'en-US')
  }
  for (const [key, value] of Object.entries(storage)) {
    localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value)
  }

  vi.resetModules()
  window.history.replaceState({}, '', path)

  const [{ default: App }, { default: router }, { i18n }] = await Promise.all([
    import('@/App.vue'),
    import('@/router'),
    import('@/i18n'),
  ])
  await router.push(path)
  await router.isReady()

  const wrapper = mount(App, {
    attachTo: document.body,
    global: { plugins: [createPinia(), router, i18n] },
  })
  await flushPromises()
  return wrapper
}

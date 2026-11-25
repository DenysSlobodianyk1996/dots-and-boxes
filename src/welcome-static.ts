/**
 * Server-side entry for the prerendered Welcome: the English Welcome the Pages build writes into
 * index.html's #app, so a search engine that runs no JavaScript sees the game (SV-2, SV-3). The
 * app mounts over it, with no hydration, in the player's language (SV-6). vite.config.ts loads
 * this module through Vite (ssrLoadModule) for the build.
 */
import { createSSRApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { renderToString } from 'vue/server-renderer'
import { MESSAGES } from '@/i18n/messages'
import WelcomeStaticPage from '@/pages/dots-and-boxes/welcome/WelcomeStaticPage.vue'

/** The markup for #app. */
export async function renderWelcome(): Promise<string> {
  // its own i18n, always English: the app's (src/i18n) reads the device and localStorage
  const i18n = createI18n({ legacy: false, locale: 'en', fallbackLocale: 'en', messages: MESSAGES })
  return renderToString(createSSRApp(WelcomeStaticPage).use(i18n))
}

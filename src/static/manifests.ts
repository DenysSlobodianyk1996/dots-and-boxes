import type { AppLocale } from '../i18n/languages'

// One install manifest per language, so the installed app's name follows the language
// (VR-50, VR-51). vite.config.ts emits one for each listed language under Vite's base; the page
// links the current one.
export function manifestFile(locale: AppLocale): string {
  return `manifest.${locale}.webmanifest`
}

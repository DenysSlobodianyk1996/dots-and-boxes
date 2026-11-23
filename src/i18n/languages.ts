// The one ordered language list (LG-1). Messages, the menu, detection, the first-paint script,
// manifests, the privacy page and test loops all read it. No app imports here: vite.config.ts
// loads this file too.
export const LANGUAGES = [
  { code: 'en', key: 'EN', name: 'English' },
  { code: 'uk', key: 'УК', name: 'Українська' },
] as const

export type AppLocale = (typeof LANGUAGES)[number]['code']

export const LANGUAGE_CODES: readonly AppLocale[] = LANGUAGES.map(({ code }) => code)

// A saved language wins, then the first device language on the list, then the list's first
// language, English (LG-6, LG-7). The first-paint script inlines this function's source, so it
// must use nothing but its arguments.
export function pickLanguage(
  codes: readonly string[],
  saved: string | null,
  deviceLanguages: readonly string[],
): string {
  if (saved !== null && codes.indexOf(saved) !== -1) return saved
  for (let i = 0; i < deviceLanguages.length; i++) {
    const base = (deviceLanguages[i] as string).toLowerCase().split(/[-_]/)[0] as string
    if (codes.indexOf(base) !== -1) return base
  }
  return codes[0] as string
}

export function resolveLanguage(
  saved: string | null,
  deviceLanguages: readonly string[],
): AppLocale {
  return pickLanguage(LANGUAGE_CODES, saved, deviceLanguages) as AppLocale
}

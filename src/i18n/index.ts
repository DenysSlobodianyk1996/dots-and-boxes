import { configure } from 'vee-validate'
import { createI18n } from 'vue-i18n'
import { StorageService } from '@/services'
import { LOCALE, manifestFile } from '@/static'
import { resolveLanguage, type AppLocale } from './languages'
import { MESSAGES } from './messages'

export { LANGUAGES, LANGUAGE_CODES, type AppLocale } from './languages'

// the device's languages in preference order; some old WebViews only have navigator.language
const deviceLanguages = navigator.languages?.length ? navigator.languages : [navigator.language]

export const i18n = createI18n({
  legacy: false,
  // a saved choice wins, then the first listed device language, then English (LG-6, LG-7, AR-6, AR-7)
  locale: resolveLanguage(StorageService.getItem(LOCALE), deviceLanguages),
  fallbackLocale: 'en',
  messages: MESSAGES,
})

// the manifest link decides the installed app's name, so it follows the language (VR-50, VR-51)
// The Android app's build has no install manifest, so it links none (AR-1)
function linkManifest(locale: AppLocale) {
  if (__CAPACITOR_BUILD__) return
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="manifest"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'manifest'
    document.head.append(link)
  }
  link.setAttribute('href', `${import.meta.env.BASE_URL}${manifestFile(locale)}`)
}

// The built page carries the English description for crawlers; people who switch language get
// theirs (SV-1)
function describePage() {
  let meta = document.head.querySelector<HTMLMetaElement>('meta[name="description"]')
  if (!meta) {
    meta = document.createElement('meta')
    meta.name = 'description'
    document.head.append(meta)
  }
  meta.content = i18n.global.t('app.description')
}

function applyDocumentLocale(locale: AppLocale) {
  document.documentElement.lang = locale
  document.title = i18n.global.t('app.title')
  describePage()
  linkManifest(locale)
}

export function setLocale(locale: AppLocale) {
  i18n.global.locale.value = locale
  StorageService.setItem(LOCALE, locale)
  applyDocumentLocale(locale)
}

// validation messages are generated in the current language when a field validates (GS-1, I18N-6)
configure({
  generateMessage: ({ field, rule }) => {
    if (rule?.name === 'differentFromAll') return i18n.global.t('validation.differentNames')
    if (rule?.name === 'differentColor') return i18n.global.t('colors.taken')
    if (rule?.name === 'notComputerName') return i18n.global.t('validation.computerName')
    if (rule?.name === 'max') {
      // string rules pass params as a list: `max:15` → ['15']
      const [length] = Array.isArray(rule.params) ? rule.params : []
      return i18n.global.t('validation.maxLength', { field, length })
    }
    return i18n.global.t('validation.invalid', { field })
  },
})

applyDocumentLocale(i18n.global.locale.value as AppLocale)

import { LOCALE } from '../static/storage-keys'
import { LANGUAGE_CODES, pickLanguage } from './languages'
import { MESSAGES } from './messages'

// index.html's pre-paint script can't import app modules, so the build injects this one, holding
// the list and the same rule the app uses: the page has the right language and title before it
// paints (LG-8).
export function firstPaintScript(): string {
  const titles = Object.fromEntries(LANGUAGE_CODES.map((code) => [code, MESSAGES[code].app.title]))
  return `var saved = null
try { saved = localStorage.getItem(${JSON.stringify(LOCALE)}) } catch (e) {}
var titles = ${JSON.stringify(titles)}
var device = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language]
var language = (${pickLanguage.toString()})(${JSON.stringify(LANGUAGE_CODES)}, saved, device)
document.documentElement.lang = language
document.title = titles[language]`
}

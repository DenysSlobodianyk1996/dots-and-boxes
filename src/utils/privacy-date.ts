// The privacy policy's "Updated" date in each language (AR-15), spelled out here rather than with
// Intl, so the static page built in Node and the app print exactly the same words.

import type { AppLocale } from '@/i18n/languages'

const EN_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
// genitive, as in "19 листопада 2026 року"
const UK_MONTHS = [
  'січня',
  'лютого',
  'березня',
  'квітня',
  'травня',
  'червня',
  'липня',
  'серпня',
  'вересня',
  'жовтня',
  'листопада',
  'грудня',
]
const DE_MONTHS = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
]
const FR_MONTHS = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
]
const IT_MONTHS = [
  'gennaio',
  'febbraio',
  'marzo',
  'aprile',
  'maggio',
  'giugno',
  'luglio',
  'agosto',
  'settembre',
  'ottobre',
  'novembre',
  'dicembre',
]
const ES_MONTHS = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
]

/** A YYYY-MM-DD date as the policy prints it, e.g. "19 November 2026" or "19 листопада 2026 року". */
export function formatPrivacyDate(iso: string, lang: AppLocale): string {
  const [year, month, day] = iso.split('-').map(Number)
  const index = (month ?? 1) - 1
  return DATE_FORMATS[lang](day, index, year)
}

// a listed language without a format here fails type-check
const DATE_FORMATS: Record<
  AppLocale,
  (day: number | undefined, month: number, year: number | undefined) => string
> = {
  en: (day, month, year) => `${day} ${EN_MONTHS[month]} ${year}`,
  uk: (day, month, year) => `${day} ${UK_MONTHS[month]} ${year} року`,
  de: (day, month, year) => `${day}. ${DE_MONTHS[month]} ${year}`,
  // the first of the month is an ordinal in French and Italian
  fr: (day, month, year) => `${day === 1 ? '1er' : day} ${FR_MONTHS[month]} ${year}`,
  it: (day, month, year) => `${day === 1 ? '1º' : day} ${IT_MONTHS[month]} ${year}`,
  es: (day, month, year) => `${day} de ${ES_MONTHS[month]} de ${year}`,
}

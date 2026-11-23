import type { AppLocale } from './languages'
import en from './locales/en'
import uk from './locales/uk'

// every language on the list must have its messages (LG-1)
export const MESSAGES: Record<AppLocale, typeof en> = { en, uk }

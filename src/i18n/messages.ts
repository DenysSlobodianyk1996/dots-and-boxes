import type { AppLocale } from './languages'
import de from './locales/de'
import en from './locales/en'
import es from './locales/es'
import fr from './locales/fr'
import it from './locales/it'
import uk from './locales/uk'

// every language on the list must have its messages (LG-1)
export const MESSAGES: Record<AppLocale, typeof en> = { en, uk, de, fr, it, es }

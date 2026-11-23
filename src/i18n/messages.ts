import type { AppLocale } from './languages.ts'
import de from './locales/de.ts'
import en from './locales/en.ts'
import es from './locales/es.ts'
import fr from './locales/fr.ts'
import it from './locales/it.ts'
import uk from './locales/uk.ts'

// every language on the list must have its messages (LG-1)
export const MESSAGES: Record<AppLocale, typeof en> = { en, uk, de, fr, it, es }

/** Where each Play Store image goes, relative to `docs/store/` (LG-17). */
export type StoreDevice = 'phone' | 'tablet-7' | 'tablet-10'

export const deviceDir = (lang: string, device: StoreDevice) => `${lang}/${device}/`

export const screenshotPath = (lang: string, device: StoreDevice, index: number, screen: string) =>
  `${deviceDir(lang, device)}${String(index + 1).padStart(2, '0')}-${screen}.png`

export const featureGraphicPath = (lang: string) => `${lang}/feature-graphic.png`

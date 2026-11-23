import { existsSync } from 'node:fs'
import sharp from 'sharp'
import { describe, expect, it } from 'vitest'
import { LANGUAGE_CODES } from '../../src/i18n/languages.ts'
import { STORE_SCREENS } from '../store-paths.ts'

const store = `${process.cwd()}/docs/store`
const SHOTS = ['01-welcome', '02-setup', '03-game', '04-result', '05-rules', '06-dark']
const DEVICES = [
  ['phone', 1080, 1920],
  ['tablet-7', 1200, 1920],
  ['tablet-10', 1600, 2560],
] as const

// LG-18, LG-19: Welcome is the first shot, in every language on every device
describe('the store screens', () => {
  it('start with Welcome', () => {
    expect(STORE_SCREENS).toEqual(['welcome', 'setup', 'game', 'result', 'rules', 'dark'])
  })
})

describe.each(LANGUAGE_CODES)('the committed %s store images', (lang) => {
  it.each(DEVICES)('has every %s screenshot at %i×%i', async (device, width, height) => {
    for (const shot of SHOTS) {
      const path = `${store}/${lang}/${device}/${shot}.png`
      expect(existsSync(path), path).toBe(true)
      expect(await sharp(path).metadata()).toMatchObject({ width, height })
    }
  })

  it('has a 1024×500 feature graphic', async () => {
    const path = `${store}/${lang}/feature-graphic.png`
    expect(existsSync(path), path).toBe(true)
    expect(await sharp(path).metadata()).toMatchObject({ width: 1024, height: 500 })
  })
})

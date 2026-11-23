import { describe, expect, it } from 'vitest'
import { deviceDir, featureGraphicPath, screenshotPath } from '../store-paths.ts'

// LG-17: everything for one Play listing sits in docs/store/<lang>/
describe('store image paths', () => {
  it('puts a screenshot in its language and device folder, numbered from 01', () => {
    expect(screenshotPath('en', 'phone', 0, 'setup')).toBe('en/phone/01-setup.png')
    expect(screenshotPath('uk', 'tablet-7', 1, 'game')).toBe('uk/tablet-7/02-game.png')
    expect(screenshotPath('uk', 'tablet-10', 4, 'dark')).toBe('uk/tablet-10/05-dark.png')
  })

  it('names the device folder that a run clears, never the language folder', () => {
    expect(deviceDir('en', 'tablet-10')).toBe('en/tablet-10/')
  })

  it('puts the feature graphic in the language folder under a plain name', () => {
    expect(featureGraphicPath('uk')).toBe('uk/feature-graphic.png')
  })
})

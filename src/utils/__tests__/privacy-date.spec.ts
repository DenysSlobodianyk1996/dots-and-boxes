import { describe, expect, it } from 'vitest'
import { formatPrivacyDate } from '../privacy-date'

describe("the privacy policy's Updated date (AR-15)", () => {
  it('reads as a date in English and in Ukrainian', () => {
    expect(formatPrivacyDate('2026-11-19', 'en')).toBe('19 November 2026')
    expect(formatPrivacyDate('2026-11-19', 'uk')).toBe('19 листопада 2026 року')
    expect(formatPrivacyDate('2027-01-05', 'uk')).toBe('5 січня 2027 року')
  })

  it.each([
    ['de', '2026-11-19', '19. November 2026'],
    ['de', '2027-03-01', '1. März 2027'],
    ['fr', '2026-02-19', '19 février 2026'],
    ['fr', '2026-08-01', '1er août 2026'],
    ['it', '2026-12-19', '19 dicembre 2026'],
    ['it', '2026-06-01', '1º giugno 2026'],
    ['es', '2026-11-19', '19 de noviembre de 2026'],
    ['es', '2027-01-01', '1 de enero de 2027'],
  ] as const)('in %s, %s reads %s (LG-14)', (lang, iso, expected) => {
    expect(formatPrivacyDate(iso, lang)).toBe(expected)
  })
})

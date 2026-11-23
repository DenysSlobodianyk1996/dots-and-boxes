import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const stringsOf = (folder: string) =>
  readFileSync(`${process.cwd()}/android/app/src/main/res/${folder}/strings.xml`, 'utf8')

// LG-12: the Android launcher shows the app's name in the device's language
describe('Android app names', () => {
  it.each([
    ['values', 'Dots and Boxes'],
    ['values-uk', 'Крапки й квадрати'],
    ['values-de', 'Käsekästchen'],
    ['values-fr', 'Pipopipette'],
    ['values-it', 'Punti e quadrati'],
    ['values-es', 'Puntos y cuadrados'],
  ])('%s names the app %s', (folder, name) => {
    const strings = stringsOf(folder)
    expect(strings).toContain(`<string name="app_name">${name}</string>`)
    expect(strings).toContain(`<string name="title_activity_main">${name}</string>`)
  })
})

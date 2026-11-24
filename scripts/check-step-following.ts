/*
 * Real-layout check for following the steps (SP-8..SP-10): run with
 * `npm run check:step-following`. jsdom has no layout, so the unit specs only see that a step is
 * asked into view; this builds the app, serves it with `vite preview` and, in Chromium, plays the
 * demo through on Welcome and in the rules panel on small phones, portrait and landscape. Every
 * step the demo reaches must end fully visible: each corner of it is the topmost thing on screen
 * there, so it isn't scrolled away in any scroll area or under the pinned footer or Start.
 * It is not part of `npm test`; it exits non-zero when a step is hidden.
 */
import { fileURLToPath } from 'node:url'
import { chromium, type Browser, type Page } from 'playwright'
import { build, preview } from 'vite'

const root = fileURLToPath(new URL('../', import.meta.url))

const SCREENS = [
  { width: 320, height: 568 },
  { width: 360, height: 640 },
].flatMap(({ width, height }) => [
  { name: `${width}x${height} portrait`, width, height },
  { name: `${width}x${height} landscape`, width: height, height: width },
])

type Place = 'welcome' | 'rules'
const PLACES: Place[] = ['welcome', 'rules']

// how long a step has to come into view once the demo shows it; every step shows for over 2 s
const SETTLE_MS = 900
const STEPS = 6

async function open(browser: Browser, url: string, screen: (typeof SCREENS)[number], place: Place) {
  const context = await browser.newContext({
    viewport: { width: screen.width, height: screen.height },
    isMobile: true,
    hasTouch: true,
    locale: 'en-US',
    serviceWorkers: 'block',
  })
  await context.addInitScript(() => localStorage.setItem('LOCALE', 'en'))
  const page = await context.newPage()
  await page.goto(url)
  await page.locator('[data-welcome]').waitFor()
  await page.evaluate(() => document.fonts.ready)
  if (place === 'rules') {
    await page.getByRole('button', { name: 'Rules' }).click()
    await page.getByRole('dialog').waitFor()
  }
  return page
}

// The steps of the place under test, the highlighted one by its number (1-6).
function stepsOf(page: Page, place: Place) {
  const scope = place === 'rules' ? page.getByRole('dialog') : page.locator('[data-welcome]')
  return scope.locator('ol[data-demo-steps] > li > button')
}

// Whether the step is fully visible: points just inside its top and bottom edges, left and right
// (past the rounded corners, which hit testing leaves out), hit the step itself.
async function isFullyVisible(page: Page, place: Place, number: number) {
  return stepsOf(page, place)
    .nth(number - 1)
    .evaluate((step) => {
      const box = step.getBoundingClientRect()
      const radius = parseFloat(getComputedStyle(step).borderTopLeftRadius) || 0
      const inset = 1
      const left = box.left + radius + inset
      const right = box.right - radius - inset
      const corners = [
        [left, box.top + inset],
        [right, box.top + inset],
        [left, box.bottom - inset],
        [right, box.bottom - inset],
      ] as const
      return corners.every(([x, y]) => {
        const hit = document.elementFromPoint(x, y)
        return !!hit && step.contains(hit)
      })
    })
}

async function check(
  browser: Browser,
  url: string,
  screen: (typeof SCREENS)[number],
  place: Place,
) {
  const page = await open(browser, url, screen, place)
  const steps = stepsOf(page, place)
  const failures: string[] = []
  try {
    for (let number = 1; number <= STEPS; number++) {
      await steps
        .nth(number - 1)
        .and(page.locator('[aria-current="step"]'))
        .waitFor({
          timeout: 30_000,
        })
      await page.waitForTimeout(SETTLE_MS)
      if (!(await isFullyVisible(page, place, number))) {
        failures.push(`${screen.name}, ${place}: step ${number} is not fully visible`)
        await page.screenshot({
          path: `${root}node_modules/.tmp/step-following-${screen.width}x${screen.height}-${place}-${number}.png`,
        })
      }
    }
  } finally {
    await page.context().close()
  }
  console.log(`${failures.length ? 'FAIL' : 'ok  '} ${screen.name}, ${place}`)
  return failures
}

const outDir = `${root}node_modules/.tmp/step-following-build`
await build({ root, logLevel: 'warn', build: { outDir, emptyOutDir: true } })
const server = await preview({ root, build: { outDir }, preview: { port: 4318, strictPort: true } })
const url = server.resolvedUrls?.local[0]
if (!url) throw new Error('vite preview has no local URL')

const browser = await chromium.launch()
let failures: string[] = []
try {
  const runs = SCREENS.flatMap((screen) =>
    PLACES.map((place) => check(browser, url, screen, place)),
  )
  failures = (await Promise.all(runs)).flat()
} finally {
  await browser.close()
  await server.close()
}
if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}
console.log('every step the demo reaches ends fully visible')

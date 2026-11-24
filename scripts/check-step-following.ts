/*
 * Real-layout check for following the steps (SP-8..SP-10) and for Welcome fitting a small phone
 * (WL-19): run with `npm run check:step-following`. jsdom has no layout, so the unit specs only
 * see that a step is asked into view; this builds the app, serves it with `vite preview` and, in
 * Chromium, plays the demo through on Welcome and in the rules panel on small phones, portrait and
 * landscape, one screen after another. Every step the demo reaches must come fully visible: each
 * corner of it is the topmost thing on screen there, so it isn't scrolled away in any scroll area
 * or under the pinned footer. On Welcome, Start must stay fully visible too at every size (WL-19),
 * and following must never scroll the app shell or the document, which don't scroll.
 * It is not part of `npm test`; it exits non-zero when a check fails.
 */
import { fileURLToPath } from 'node:url'
import { chromium, type Browser, type Locator, type Page } from 'playwright'
import { build, preview } from 'vite'

const root = fileURLToPath(new URL('../', import.meta.url))

const SCREENS = [
  { width: 320, height: 568 },
  { width: 360, height: 640 },
].flatMap(({ width, height }) => [
  { name: `${width}x${height} portrait`, width, height },
  { name: `${width}x${height} landscape`, width: height, height: width },
])
type Screen = (typeof SCREENS)[number]

type Place = 'welcome' | 'rules'
const PLACES: Place[] = ['welcome', 'rules']

// how long a step may take to come into view once the demo shows it (a smooth scroll included);
// every step shows for over 2 s, so it is still the current one by then
const FOLLOW_TIMEOUT_MS = 1500
const POLL_MS = 100
const STEPS = 6

async function open(browser: Browser, url: string, screen: Screen, place: Place) {
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

// The steps of the place under test.
function stepsOf(page: Page, place: Place) {
  const scope = place === 'rules' ? page.getByRole('dialog') : page.locator('[data-welcome]')
  return scope.locator('ol[data-demo-steps] > li > button')
}

// Whether the element is fully visible: points just inside its top and bottom edges, left and
// right (past the rounded corners, which hit testing leaves out), hit the element itself.
async function isFullyVisible(element: Locator) {
  return element.evaluate((target) => {
    const box = target.getBoundingClientRect()
    const radius = parseFloat(getComputedStyle(target).borderTopLeftRadius) || 0
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
      return !!hit && target.contains(hit)
    })
  })
}

// Waits for the element to be fully visible, polling while a smooth scroll runs; false when it
// isn't by the deadline.
async function becomesFullyVisible(page: Page, element: Locator) {
  for (let waited = 0; waited <= FOLLOW_TIMEOUT_MS; waited += POLL_MS) {
    if (await isFullyVisible(element)) return true
    await page.waitForTimeout(POLL_MS)
  }
  return false
}

// The app shell and the document never scroll (MB-11): following must scroll <main> or the panel.
async function scrolledOutside(page: Page) {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-app-shell]')
    return (shell?.scrollTop ?? 0) + (document.scrollingElement?.scrollTop ?? 0) !== 0
  })
}

async function check(browser: Browser, url: string, screen: Screen, place: Place) {
  const page = await open(browser, url, screen, place)
  const steps = stepsOf(page, place)
  const start = page.locator('[data-welcome-start]')
  const failures: string[] = []
  const fail = async (what: string, number: number) => {
    failures.push(`${screen.name}, ${place}: ${what}`)
    await page.screenshot({
      path: `${root}node_modules/.tmp/step-following-${screen.width}x${screen.height}-${place}-${number}.png`,
    })
  }
  try {
    for (let number = 1; number <= STEPS; number++) {
      const step = steps.nth(number - 1)
      await step.and(page.locator('[aria-current="step"]')).waitFor({ timeout: 30_000 })
      if (!(await becomesFullyVisible(page, step))) {
        await fail(`step ${number} is not fully visible`, number)
      }
      // WL-19: following a step never pushes Start off screen, portrait or landscape
      if (place === 'welcome' && !(await isFullyVisible(start))) {
        await fail(`Start is not fully visible at step ${number} (WL-19)`, number)
      }
      if (await scrolledOutside(page)) {
        await fail(`the app shell or the document scrolled at step ${number}`, number)
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
const failures: string[] = []
try {
  // one screen at a time, so the demo's timing isn't starved by the others and one failure
  // doesn't close the browser under the rest
  for (const screen of SCREENS) {
    for (const place of PLACES) {
      try {
        failures.push(...(await check(browser, url, screen, place)))
      } catch (error) {
        failures.push(`${screen.name}, ${place}: ${String(error)}`)
        console.log(`FAIL ${screen.name}, ${place}`)
      }
    }
  }
} finally {
  await browser.close()
  await server.close()
}
if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}
console.log('every step the demo reaches comes fully visible, and Start stays on screen (WL-19)')

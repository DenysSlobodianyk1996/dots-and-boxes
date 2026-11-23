import { Dot, DotsAndBoxesGame, type Line, type Square } from '@/models'
import { SWATCHES } from '@/utils/swatches'

// The how-to-play demo on Welcome and in the rules panel (WL-4..WL-10, RL-1): a pure function of time, so it needs no timers to
// test. It is played on a real game, so a script that breaks the rules throws on load.

export const DEMO_SIZE = 2

export type DemoPlayer = 'coral' | 'teal'

// player names are the swatch keys, so a line's or square's owner is its swatch
export const DEMO_COLORS: Record<DemoPlayer, string> = {
  coral: SWATCHES.find(({ key }) => key === 'coral')!.hex,
  teal: SWATCHES.find(({ key }) => key === 'teal')!.hex,
}

// the letters on the score chips and inside claimed squares (WL-20)
export const DEMO_LETTERS: Record<DemoPlayer, string> = { coral: 'A', teal: 'B' }

export type DemoCaption =
  'drawLine' | 'startFromLine' | 'claimSquare' | 'turnPasses' | 'keepGoing' | 'mostSquaresWins'

// every step once, in the order the demo shows them: the list beside it (WL-10, WL-18)
export const DEMO_CAPTIONS: readonly DemoCaption[] = [
  'drawLine',
  'startFromLine',
  'claimSquare',
  'turnPasses',
  'keepGoing',
  'mostSquaresWins',
]

const dot = (row: number, col: number) => new Dot({ row, col })

// the turn passes after every line, even one that closes a square (TR-1); Coral wins 3 : 1
const MOVES: [Dot, Dot][] = [
  [dot(0, 0), dot(0, 1)],
  [dot(0, 0), dot(1, 0)],
  [dot(0, 1), dot(0, 2)],
  [dot(1, 0), dot(1, 1)],
  [dot(0, 1), dot(1, 1)], // Coral closes the first square
  [dot(0, 2), dot(1, 2)],
  [dot(1, 1), dot(1, 2)], // Coral closes the second
  [dot(1, 0), dot(2, 0)],
  [dot(1, 2), dot(2, 2)],
  [dot(2, 0), dot(2, 1)],
  [dot(1, 1), dot(2, 1)], // Coral closes the third
  [dot(2, 1), dot(2, 2)], // Teal closes the last
]

function captionOfMove(move: number): DemoCaption {
  if (move === 0) return 'drawLine'
  if (move <= 3) return 'startFromLine'
  if (move === 4) return 'claimSquare'
  if (move === 5) return 'turnPasses'
  return 'keepGoing'
}

// the first six lines teach, so they go slower than the rest (ms)
const INTRO = 500
const END_HOLD = 6000
// the extra time each step stays on screen before the next one, so it can be read (WL-10)
const STEP_HOLD = 2000
const SLOW = { tap: 260, grow: 460, rest: 620 }
const FAST = { tap: 120, grow: 260, rest: 300 }
const SLOW_MOVES = 6
const DRAW = 260
const CLAIM_PAUSE = 900

interface Step {
  start: number
  tapAt: number
  growAt: number
  drawnAt: number
  from: Dot
  to: Dot
  owner: DemoPlayer
  lines: Line[]
  squares: Square[]
  next: DemoPlayer
  caption: DemoCaption
}

function buildSteps() {
  const game = new DotsAndBoxesGame({
    player1: { name: 'coral', color: DEMO_COLORS.coral },
    player2: { name: 'teal', color: DEMO_COLORS.teal },
    size: DEMO_SIZE,
    currentPlayerName: 'coral',
  })
  let clock = INTRO
  const steps = MOVES.map(([from, to], index): Step => {
    if (!game.canDraw(from, to)) throw new Error(`Demo move ${index + 1} is not legal`)
    const owner = game.currentPlayerName as DemoPlayer
    const closedSquare = game.drawLine(from, to).length > 0
    const pace = index < SLOW_MOVES ? SLOW : FAST
    const start = clock
    const tapAt = start + pace.tap
    const growAt = tapAt + pace.grow
    const drawnAt = growAt + DRAW
    clock = drawnAt + pace.rest + (closedSquare ? CLAIM_PAUSE : 0)
    const endsCaption =
      index === MOVES.length - 1 || captionOfMove(index + 1) !== captionOfMove(index)
    if (endsCaption) clock += STEP_HOLD
    return {
      start,
      tapAt,
      growAt,
      drawnAt,
      from,
      to,
      owner,
      lines: [...game.lines],
      squares: [...game.dirtySquares],
      next: (game.currentPlayerName ?? owner) as DemoPlayer,
      caption: captionOfMove(index),
    }
  })
  return { steps, finishedAt: clock }
}

const { steps, finishedAt } = buildSteps()

export const DEMO_DURATION = finishedAt + END_HOLD

export interface DemoFrame {
  lines: Line[]
  squares: Square[]
  growing: { from: Dot; to: Dot; progress: number; owner: DemoPlayer } | null
  dot1: Dot | null
  tapped: Dot | null
  current: DemoPlayer
  coral: number
  teal: number
  finished: boolean
  caption: DemoCaption
}

// what the demo shows at a moment of its loop, in ms; any time wraps around
export function frameAt(time: number): DemoFrame {
  const t = ((time % DEMO_DURATION) + DEMO_DURATION) % DEMO_DURATION
  // the last step already started; a plain count, as findLastIndex is newer than AR-21's floor
  const index = steps.filter((candidate) => candidate.start <= t).length - 1
  const step = steps[index] ?? null
  const isDrawn = !!step && t >= step.drawnAt
  const shown = isDrawn ? step : (steps[index - 1] ?? null)
  const squares = shown?.squares ?? []
  const finished = t >= finishedAt
  return {
    lines: shown?.lines ?? [],
    squares,
    growing:
      step && !isDrawn && t >= step.growAt
        ? {
            from: step.from,
            to: step.to,
            progress: (t - step.growAt) / (step.drawnAt - step.growAt),
            owner: step.owner,
          }
        : null,
    dot1: step && !isDrawn && t >= step.tapAt ? step.from : null,
    tapped: step && !isDrawn && t >= step.growAt ? step.to : null,
    current: isDrawn ? step.next : (step?.owner ?? 'coral'),
    coral: squares.filter((square) => square.ownerName === 'coral').length,
    teal: squares.filter((square) => square.ownerName === 'teal').length,
    finished,
    caption: finished ? 'mostSquaresWins' : (step?.caption ?? 'drawLine'),
  }
}

// the still picture for reduced motion: the full board and the winning caption (WL-17)
export const FINISHED_FRAME = frameAt(finishedAt)

// when a step of the list begins: choosing it plays the demo on from here (WL-10)
export function demoStepStart(caption: DemoCaption) {
  if (caption === 'drawLine') return 0
  if (caption === 'mostSquaresWins') return finishedAt
  return steps.find((step) => step.caption === caption)!.start
}

// a step's last moment, with its lines drawn: its still picture under reduced motion (WL-17)
export function demoStepStill(caption: DemoCaption) {
  const next = DEMO_CAPTIONS[DEMO_CAPTIONS.indexOf(caption) + 1]
  return next ? demoStepStart(next) - 1 : finishedAt
}

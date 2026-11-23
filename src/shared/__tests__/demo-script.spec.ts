import { describe, expect, it } from 'vitest'
import {
  DEMO_CAPTIONS,
  DEMO_DURATION,
  demoStepStart,
  demoStepStill,
  FINISHED_FRAME,
  frameAt,
  type DemoFrame,
} from '@/shared/demo-script'

// every frame of one loop, 10 ms apart
function allFrames(): DemoFrame[] {
  const frames: DemoFrame[] = []
  for (let time = 0; time < DEMO_DURATION; time += 10) frames.push(frameAt(time))
  return frames
}

const lineKeys = (frame: DemoFrame) => frame.lines.map((line) => line.key)

describe('how-to-play demo script', () => {
  it('draws 12 lines, one at a time (WL-4)', () => {
    const counts = [...new Set(allFrames().map((frame) => frame.lines.length))]

    expect(counts).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  })

  it('shows two dots being picked before a line grows between them (WL-5)', () => {
    const frames = allFrames()
    const firstPick = frames.findIndex((frame) => frame.dot1 !== null)
    const firstGrowth = frames.findIndex((frame) => frame.growing !== null)

    expect(firstPick).toBeGreaterThan(-1)
    expect(firstGrowth).toBeGreaterThan(firstPick)
    expect(frames[firstGrowth]!.tapped).not.toBeNull()
  })

  it('starts every later line from a dot that already has a line (WL-6)', () => {
    const frames = allFrames()
    const growing = frames.filter((frame) => frame.growing && frame.lines.length > 0)

    expect(growing.length).toBeGreaterThan(0)
    for (const frame of growing) {
      const { row, col } = frame.growing!.from
      const touches = frame.lines.some(
        ({ from, to }) =>
          (from.row === row && from.col === col) || (to.row === row && to.col === col),
      )
      expect(touches).toBe(true)
    }
  })

  it('passes the turn after a line that claims a square (WL-7, WL-8, TR-1)', () => {
    const claimed = allFrames().find((frame) => frame.squares.length === 1)!

    expect(claimed.squares[0]!.ownerName).toBe('coral')
    expect(claimed.current).toBe('teal')
  })

  it('ends on a full board with Coral winning 3 : 1 (WL-9)', () => {
    expect(FINISHED_FRAME.finished).toBe(true)
    expect(FINISHED_FRAME.lines).toHaveLength(12)
    expect(FINISHED_FRAME.squares).toHaveLength(4)
    expect({ coral: FINISHED_FRAME.coral, teal: FINISHED_FRAME.teal }).toEqual({
      coral: 3,
      teal: 1,
    })
    expect(FINISHED_FRAME.caption).toBe('mostSquaresWins')
  })

  it('moves through the six captions in order (WL-10)', () => {
    const captions = allFrames()
      .map((frame) => frame.caption)
      .filter((caption, index, all) => caption !== all[index - 1])

    expect(captions).toEqual([
      'drawLine',
      'startFromLine',
      'claimSquare',
      'turnPasses',
      'keepGoing',
      'mostSquaresWins',
    ])
  })

  it('holds each step at least 2 seconds after its last line (WL-10)', () => {
    for (const caption of DEMO_CAPTIONS.slice(0, -1)) {
      const still = demoStepStill(caption)
      const heldFrom = still - 1999

      expect(frameAt(heldFrom).caption).toBe(caption)
      expect(frameAt(heldFrom).growing).toBeNull()
      expect(frameAt(heldFrom).lines).toEqual(frameAt(still).lines)
    }
  })

  it.each(DEMO_CAPTIONS)('can jump to the start and the still picture of %s (WL-10)', (caption) => {
    expect(frameAt(demoStepStart(caption)).caption).toBe(caption)
    expect(frameAt(demoStepStill(caption)).caption).toBe(caption)
  })

  it('loops back to the empty board (WL-4)', () => {
    expect(lineKeys(frameAt(DEMO_DURATION))).toEqual([])
    expect(frameAt(DEMO_DURATION - 1).finished).toBe(true)
  })
})

<template>
  <!-- only theme tokens and player colors; the only letters are the players' A and B (WL-20, WL-21) -->
  <svg data-demo-board :viewBox="`0 0 ${SIZE} ${SIZE + TOP}`" aria-hidden="true" focusable="false">
    <g v-for="chip in chips" :key="chip.player">
      <rect
        :x="chip.x"
        y="12"
        width="112"
        height="36"
        rx="18"
        :fill="chip.color"
        :fill-opacity="chip.active ? 0.22 : 0.07"
        :stroke="chip.active ? chip.color : 'var(--color-border)'"
        stroke-width="2"
      />
      <circle :cx="chip.x + 24" cy="30" r="13" :fill="chip.color" />
      <text
        :x="chip.x + 24"
        y="31"
        text-anchor="middle"
        dominant-baseline="central"
        font-size="16"
        font-weight="800"
        fill="var(--color-on-accent)"
      >
        {{ chip.letter }}
      </text>
      <text
        :data-demo-score="chip.player"
        :x="chip.x + 72"
        y="31"
        text-anchor="middle"
        dominant-baseline="central"
        font-size="20"
        font-weight="800"
        fill="var(--color-ink)"
      >
        {{ chip.isWinner ? `★ ${chip.score}` : chip.score }}
      </text>
    </g>
    <rect
      v-for="square in frame.squares"
      :key="`${square.row},${square.col}`"
      :x="at(square.col)"
      :y="TOP + at(square.row)"
      :width="CELL"
      :height="CELL"
      :fill="colorOf(square.ownerName)"
      fill-opacity="0.32"
    />
    <text
      v-for="square in frame.squares"
      :key="`letter-${square.row},${square.col}`"
      data-demo-square-letter
      :x="at(square.col) + CELL / 2"
      :y="TOP + at(square.row) + CELL / 2 + 1"
      text-anchor="middle"
      dominant-baseline="central"
      font-size="44"
      font-weight="800"
      :fill="colorOf(square.ownerName)"
    >
      {{ DEMO_LETTERS[square.ownerName as DemoPlayer] }}
    </text>
    <line
      v-for="line in frame.lines"
      :key="line.key"
      data-demo-line
      :x1="at(line.from.col)"
      :y1="TOP + at(line.from.row)"
      :x2="at(line.to.col)"
      :y2="TOP + at(line.to.row)"
      :stroke="colorOf(line.ownerName)"
      stroke-width="7"
      stroke-linecap="round"
    />
    <line
      v-if="frame.growing"
      :x1="at(frame.growing.from.col)"
      :y1="TOP + at(frame.growing.from.row)"
      :x2="between(frame.growing.from.col, frame.growing.to.col, frame.growing.progress)"
      :y2="TOP + between(frame.growing.from.row, frame.growing.to.row, frame.growing.progress)"
      :stroke="DEMO_COLORS[frame.growing.owner]"
      stroke-width="7"
      stroke-linecap="round"
    />
    <circle
      v-for="dot in DOTS"
      :key="dot.key"
      :cx="at(dot.col)"
      :cy="TOP + at(dot.row)"
      r="7"
      fill="var(--color-dot)"
    />
    <circle
      v-for="picked in pickedDots"
      :key="`${picked.row},${picked.col}`"
      :cx="at(picked.col)"
      :cy="TOP + at(picked.row)"
      r="17"
      :fill="DEMO_COLORS[frame.current]"
      fill-opacity="0.2"
      :stroke="DEMO_COLORS[frame.current]"
      stroke-width="3"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  DEMO_COLORS,
  DEMO_LETTERS,
  DEMO_SIZE,
  type DemoFrame,
  type DemoPlayer,
} from '@/shared/demo-script'

const SIZE = 300
const TOP = 56
const PAD = 40
const CELL = (SIZE - PAD * 2) / DEMO_SIZE
const DOTS = Array.from({ length: (DEMO_SIZE + 1) ** 2 }, (_, index) => {
  const row = Math.floor(index / (DEMO_SIZE + 1))
  const col = index % (DEMO_SIZE + 1)
  return { key: `${row},${col}`, row, col }
})

const props = defineProps<{ frame: DemoFrame }>()

const at = (index: number) => PAD + index * CELL
const between = (from: number, to: number, progress: number) =>
  at(from) + (at(to) - at(from)) * progress
const colorOf = (owner: string | null) => DEMO_COLORS[owner as DemoPlayer]

const pickedDots = computed(() =>
  [props.frame.dot1, props.frame.tapped].filter((dot) => dot !== null),
)

const chips = computed(() => {
  const { frame } = props
  return (['coral', 'teal'] as const).map((player, index) => {
    const other = player === 'coral' ? 'teal' : 'coral'
    const isWinner = frame.finished && frame[player] > frame[other]
    return {
      player,
      x: index === 0 ? 28 : 160,
      color: DEMO_COLORS[player],
      letter: DEMO_LETTERS[player],
      score: frame[player],
      active: frame.finished ? isWinner : frame.current === player,
      isWinner,
    }
  })
})
</script>

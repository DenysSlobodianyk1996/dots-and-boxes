<template>
  <!-- Welcome: the demo on the left, the steps on the right; phones stack them, and the steps
       scroll inside their own area so Start stays on screen (WL-10, WL-19). The rules panel is the
       same block, stacked and smaller (RL-1) -->
  <div
    ref="root"
    data-how-to-play
    class="flex min-h-0 flex-1 flex-col gap-3"
    :class="compact ? '' : 'sm:flex-row sm:items-center sm:justify-center sm:gap-5'"
  >
    <div
      class="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
      :class="
        compact
          ? 'mx-auto aspect-[300/356] w-full max-w-48 shrink-0'
          : 'min-h-24 flex-[1_1_42%] sm:aspect-[300/356] sm:h-full sm:max-h-136 sm:flex-none'
      "
    >
      <DemoBoard :frame="frame" class="block size-full" />
    </div>
    <div
      class="flex flex-col gap-1"
      :class="
        compact ? 'min-h-32 flex-1' : 'min-h-28 flex-[1_1_58%] sm:max-h-full sm:min-w-0 sm:flex-1'
      "
    >
      <!-- the rules panel has this heading already -->
      <h2 v-if="!compact" data-demo-steps-title class="shrink-0 px-2 text-base font-bold text-ink">
        {{ t('rules.title') }}
      </h2>
      <ol
        ref="stepList"
        data-demo-steps
        class="relative flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto"
        @pointerdown.self="pauseFollowing"
      >
        <li v-for="(caption, index) in DEMO_CAPTIONS" :key="caption" class="shrink-0">
          <!-- choosing a step shows that moment of the demo (WL-10) -->
          <button
            type="button"
            :aria-current="caption === frame.caption ? 'step' : undefined"
            class="flex min-h-11 w-full cursor-pointer items-center gap-2 rounded-lg border-2 px-2 py-1.5 text-left text-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-accent motion-reduce:transition-none sm:min-h-0"
            :class="
              caption === frame.caption
                ? 'border-accent bg-accent-tint font-semibold text-ink'
                : 'border-transparent text-ink-soft hover:bg-surface-muted'
            "
            @click="showStep(caption)"
          >
            <span
              aria-hidden="true"
              class="flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
              :class="caption === frame.caption ? 'bg-accent text-on-accent' : 'bg-surface-strong'"
            >
              {{ index + 1 }}
            </span>
            <span>{{ t(`welcome.captions.${caption}`) }}</span>
          </button>
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import DemoBoard from './DemoBoard.vue'
import { useRulesPanel } from '@/shared/composables/useRulesPanel'
import {
  DEMO_CAPTIONS,
  demoStepStart,
  demoStepStill,
  FINISHED_FRAME,
  frameAt,
  type DemoCaption,
} from '@/shared/demo-script'

// how long the player's own scrolling pauses the following of the demo (SP-10)
const FOLLOW_PAUSE_MS = 5000
// the screen's scroll area around the block: Welcome's <main> or the rules panel's content
const SCROLL_AREA = 'main, [data-rules-scroll]'
// the keys that scroll the area holding focus (SP-10)
const SCROLL_KEYS = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '])

const props = defineProps<{
  // the smaller, always stacked version for the rules panel (RL-1)
  compact?: boolean
}>()

const { t } = useI18n()
const rulesPanel = useRulesPanel()

// reduced motion shows the finished game, still (WL-17)
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
const isMotionReduced = ref(motionQuery.matches)

const time = ref(0)
// the step chosen under reduced motion, shown still
const stillCaption = ref<DemoCaption | null>(null)
const frame = computed(() => {
  if (!isMotionReduced.value) return frameAt(time.value)
  return stillCaption.value ? frameAt(demoStepStill(stillCaption.value)) : FINISHED_FRAME
})

const root = useTemplateRef<HTMLDivElement>('root')
const stepList = useTemplateRef<HTMLOListElement>('stepList')
// set while the player's own scrolling pauses the following (SP-10)
let pauseTimer: ReturnType<typeof setTimeout> | undefined

// the player's own scrolling (wheel, touch, keys, a drag of a scrollbar) of the list or the screen
// around it pauses the following; a tap or click on a step doesn't. When the pause ends, the view
// catches up at once (SP-10)
function pauseFollowing() {
  clearTimeout(pauseTimer)
  pauseTimer = setTimeout(() => {
    pauseTimer = undefined
    followStep()
  }, FOLLOW_PAUSE_MS)
}

// brings the highlighted step into view in every scroll area around it (the list, Welcome's
// <main>, the rules panel's content), with the least scrolling and only if it isn't fully in view
// already (SP-8, SP-9). The footer and Start sit outside those areas, so "in view" is clear of them
function followStep() {
  if (pauseTimer || isCovered.value) return
  const step = stepList.value?.querySelector<HTMLElement>('[aria-current="step"]')
  step?.scrollIntoView({
    block: 'nearest',
    inline: 'nearest',
    behavior: isMotionReduced.value ? 'auto' : 'smooth',
  })
}

// Welcome's block sits behind the open rules panel: it doesn't scroll there unseen, and catches
// up once the panel closes (SP-8)
const isCovered = computed(() => !props.compact && rulesPanel.isOpen.value)

watch(() => frame.value.caption, followStep, { flush: 'post' })
watch(isCovered, followStep, { flush: 'post' })

// the scroll area around the block, where the player's own scrolling is listened for (SP-10)
let scrollArea: HTMLElement | null = null

function onScrollAreaPointerDown(event: PointerEvent) {
  // on the area itself, not on what it holds: a drag of its scrollbar
  if (event.target === scrollArea) pauseFollowing()
}

function onKeyDown(event: KeyboardEvent) {
  if (!SCROLL_KEYS.has(event.key) || !scrollArea) return
  const target = event.target
  // keys scroll the area holding focus, or the page when nothing has it
  if (target !== document.body && !(target instanceof Node && scrollArea.contains(target))) return
  // Space presses a focused button or link instead of scrolling
  if (event.key === ' ' && target instanceof Element && target.closest('button, a, input')) return
  pauseFollowing()
}

// follows again once the layout settles: a ResizeObserver reports after the first layout (on
// mount, the rules panel opening and the reduced-motion still frame included) and whenever the
// block's size changes, e.g. when the screen turns (SP-10)
let resizeObserver: ResizeObserver | undefined

let frameId = 0
let startedAt = 0

function tick(now: number) {
  // a frame's timestamp can be just before startedAt: never step back, or a chosen step would
  // flicker to the one before it
  time.value = Math.max(time.value, now - startedAt)
  frameId = requestAnimationFrame(tick)
}

function play() {
  time.value = 0
  startedAt = performance.now()
  frameId = requestAnimationFrame(tick)
}

// jumps to a step; the demo plays on from there (WL-10, WL-17)
function showStep(caption: DemoCaption) {
  if (isMotionReduced.value) {
    stillCaption.value = caption
    return
  }
  time.value = demoStepStart(caption)
  startedAt = performance.now() - time.value
}

function onMotionChange({ matches }: MediaQueryListEvent) {
  isMotionReduced.value = matches
  cancelAnimationFrame(frameId)
  if (!matches) play()
}

onMounted(() => {
  motionQuery.addEventListener('change', onMotionChange)
  scrollArea = root.value?.closest<HTMLElement>(SCROLL_AREA) ?? root.value
  scrollArea?.addEventListener('wheel', pauseFollowing, { passive: true })
  scrollArea?.addEventListener('touchmove', pauseFollowing, { passive: true })
  scrollArea?.addEventListener('pointerdown', onScrollAreaPointerDown)
  document.addEventListener('keydown', onKeyDown)
  followStep()
  // jsdom has no ResizeObserver
  if (typeof ResizeObserver !== 'undefined' && root.value) {
    resizeObserver = new ResizeObserver(() => followStep())
    resizeObserver.observe(root.value)
  }
  if (!isMotionReduced.value) play()
})

onBeforeUnmount(() => {
  motionQuery.removeEventListener('change', onMotionChange)
  scrollArea?.removeEventListener('wheel', pauseFollowing)
  scrollArea?.removeEventListener('touchmove', pauseFollowing)
  scrollArea?.removeEventListener('pointerdown', onScrollAreaPointerDown)
  document.removeEventListener('keydown', onKeyDown)
  cancelAnimationFrame(frameId)
  clearTimeout(pauseTimer)
  resizeObserver?.disconnect()
})
</script>

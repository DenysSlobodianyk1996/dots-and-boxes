<template>
  <!-- Welcome: the demo on the left, the steps on the right; phones stack them, and the steps
       scroll inside their own area so Play stays on screen (WL-10, WL-19). The rules panel is the
       same block, stacked and smaller (RL-1) -->
  <div
    data-how-to-play
    class="flex min-h-0 flex-1 flex-col gap-3"
    :class="compact ? '' : 'sm:flex-row sm:items-center sm:justify-center sm:gap-5'"
  >
    <div
      class="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
      :class="
        compact
          ? 'mx-auto aspect-[300/356] w-full max-w-48 shrink-0'
          : 'min-h-40 flex-[1_1_42%] sm:aspect-[300/356] sm:h-full sm:max-h-136 sm:flex-none'
      "
    >
      <DemoBoard :frame="frame" class="block size-full" />
    </div>
    <div
      class="flex min-h-32 flex-col gap-1"
      :class="compact ? 'flex-1' : 'flex-[1_1_58%] sm:max-h-full sm:min-w-0 sm:flex-1'"
    >
      <!-- the rules panel has this heading already -->
      <h3 v-if="!compact" data-demo-steps-title class="shrink-0 px-2 text-base font-bold text-ink">
        {{ t('rules.title') }}
      </h3>
      <ol
        ref="stepList"
        data-demo-steps
        class="relative flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto"
        @pointerdown="pauseFollowing"
        @touchmove.passive="pauseFollowing"
        @wheel.passive="pauseFollowing"
      >
        <li v-for="(caption, index) in DEMO_CAPTIONS" :key="caption" class="shrink-0">
          <!-- choosing a step shows that moment of the demo (WL-10) -->
          <button
            type="button"
            :aria-current="caption === frame.caption ? 'step' : undefined"
            class="flex min-h-11 w-full cursor-pointer items-start gap-2 rounded-lg border-2 px-2 py-1.5 text-left text-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-accent motion-reduce:transition-none sm:min-h-0"
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
import {
  DEMO_CAPTIONS,
  demoStepStart,
  demoStepStill,
  FINISHED_FRAME,
  frameAt,
  type DemoCaption,
} from '@/shared/demo-script'

// how long the list leaves a player's own scrolling alone before following the demo again
const FOLLOW_PAUSE_MS = 5000

defineProps<{
  // the smaller, always stacked version for the rules panel (RL-1)
  compact?: boolean
}>()

const { t } = useI18n()

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

const stepList = useTemplateRef<HTMLOListElement>('stepList')
let followsAgainAt = 0

function pauseFollowing() {
  followsAgainAt = performance.now() + FOLLOW_PAUSE_MS
}

// where the steps scroll (phones), the highlighted one stays in view unless the player is reading
// another one (WL-10)
function followStep() {
  const list = stepList.value
  if (!list || list.scrollHeight <= list.clientHeight) return
  if (performance.now() < followsAgainAt) return
  const step = list.querySelector<HTMLElement>('[aria-current="step"]')
  if (step) list.scrollTop = step.offsetTop - (list.clientHeight - step.offsetHeight) / 2
}

watch(() => frame.value.caption, followStep, { flush: 'post' })

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
  followStep()
  if (!isMotionReduced.value) play()
})

onBeforeUnmount(() => {
  motionQuery.removeEventListener('change', onMotionChange)
  cancelAnimationFrame(frameId)
})
</script>

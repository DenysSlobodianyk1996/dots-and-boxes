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
    <ol
      ref="stepList"
      data-demo-steps
      class="relative flex min-h-32 flex-col gap-1 overflow-y-auto"
      :class="compact ? 'flex-1' : 'flex-[1_1_58%] sm:max-h-full sm:min-w-0 sm:flex-1'"
      @pointerdown="pauseFollowing"
      @touchmove.passive="pauseFollowing"
      @wheel.passive="pauseFollowing"
    >
      <li
        v-for="(caption, index) in DEMO_CAPTIONS"
        :key="caption"
        :aria-current="caption === frame.caption ? 'step' : undefined"
        class="flex shrink-0 items-start gap-2 rounded-lg border-2 px-2 py-1.5 text-sm transition-colors duration-200 motion-reduce:transition-none"
        :class="
          caption === frame.caption
            ? 'border-accent bg-accent-tint font-semibold text-ink'
            : 'border-transparent text-ink-soft'
        "
      >
        <span
          aria-hidden="true"
          class="flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
          :class="caption === frame.caption ? 'bg-accent text-on-accent' : 'bg-surface-strong'"
        >
          {{ index + 1 }}
        </span>
        <span>{{ t(`welcome.captions.${caption}`) }}</span>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import DemoBoard from './DemoBoard.vue'
import { DEMO_CAPTIONS, FINISHED_FRAME, frameAt } from '@/shared/demo-script'

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
const frame = computed(() => (isMotionReduced.value ? FINISHED_FRAME : frameAt(time.value)))

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
  // a frame's timestamp can be just before startedAt, which would wrap to the end of the loop
  time.value = Math.max(0, now - startedAt)
  frameId = requestAnimationFrame(tick)
}

function play() {
  startedAt = performance.now()
  frameId = requestAnimationFrame(tick)
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

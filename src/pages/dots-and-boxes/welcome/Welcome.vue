<template>
  <!-- fills the space between the header and the footer: the board gives way, so Play stays on
       screen on a 320 x 568 phone (WL-19) -->
  <div data-welcome class="mx-auto flex h-full max-w-sm flex-col gap-3">
    <!-- takes focus when Home opens this screen; a ring only for keyboard use -->
    <h2
      data-screen-heading
      tabindex="-1"
      class="shrink-0 rounded-lg text-center text-2xl font-extrabold focus-visible:outline-2 focus-visible:outline-accent"
    >
      {{ t('rules.title') }}
    </h2>
    <div
      class="flex max-h-136 min-h-48 flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
    >
      <DemoBoard :frame="frame" class="block min-h-0 w-full flex-1" />
      <!-- screen readers get the whole list below instead of a caption that keeps changing -->
      <p
        data-demo-caption
        aria-hidden="true"
        class="flex h-20 shrink-0 items-center justify-center px-3 text-center text-sm font-semibold text-ink"
      >
        {{ t(`welcome.captions.${frame.caption}`) }}
      </p>
    </div>
    <ol data-demo-steps class="sr-only">
      <li v-for="caption in DEMO_CAPTIONS" :key="caption">
        {{ t(`welcome.captions.${caption}`) }}
      </li>
    </ol>
    <BaseButton
      data-welcome-play
      type="button"
      color="primary"
      class="w-full shrink-0 py-3! text-base!"
      @click="emit('play')"
    >
      {{ t('welcome.play') }}
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseButton from '@/shared/components/BaseButton.vue'
import DemoBoard from './DemoBoard.vue'
import { DEMO_CAPTIONS, FINISHED_FRAME, frameAt } from './demo-script'

const emit = defineEmits<{ play: [] }>()
const { t } = useI18n()

// reduced motion shows the finished game, still (WL-17)
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
const isMotionReduced = ref(motionQuery.matches)

const time = ref(0)
const frame = computed(() => (isMotionReduced.value ? FINISHED_FRAME : frameAt(time.value)))

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
  if (!isMotionReduced.value) play()
})

onBeforeUnmount(() => {
  motionQuery.removeEventListener('change', onMotionChange)
  cancelAnimationFrame(frameId)
})
</script>

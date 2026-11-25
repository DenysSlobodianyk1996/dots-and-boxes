<template>
  <!-- The English Welcome the Pages build writes into index.html's #app, so a search engine that
       runs no JavaScript sees the game (SV-2, SV-3); the app replaces it when it mounts, in the
       player's language (SV-6). Text from the same message keys as Welcome; layout from App.vue,
       AppScreen, Welcome and HowToPlay, with room kept for what needs the app (the header's
       buttons, Start, the footer's links), so the swap barely moves anything. The pre-paint
       script hides it through data-prerendered where the app won't open Welcome
       (src/static/prerendered-welcome.ts) -->
  <div data-prerendered lang="en" class="flex h-app flex-col overflow-hidden p-safe-2">
    <!-- room for the app's three round buttons: theme, rules and language (App.vue) -->
    <AppHeader>
      <span v-for="n in 3" :key="n" aria-hidden="true" class="size-11 shrink-0 sm:size-9"></span>
    </AppHeader>
    <AppScreen>
      <div class="mx-auto flex h-full max-w-4xl flex-col gap-3">
        <div class="flex shrink-0 flex-col gap-0.5 text-center">
          <h1 class="text-xl font-extrabold sm:text-2xl">
            {{ t('welcome.title', { name: t('app.shortName') }) }}
          </h1>
          <p class="text-sm text-ink-soft sm:text-base">{{ t('welcome.goal') }}</p>
        </div>
        <div
          class="flex min-h-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-5"
        >
          <div
            class="min-h-24 flex-[1_1_42%] overflow-hidden rounded-2xl border border-border bg-surface shadow-sm sm:aspect-[300/356] sm:h-full sm:max-h-136 sm:flex-none"
          >
            <!-- the demo's first moment, where it starts playing; under reduced motion the
                 finished game, still, as HowToPlay shows it (WL-17) -->
            <DemoBoard :frame="FIRST_FRAME" class="block size-full motion-reduce:hidden" />
            <DemoBoard :frame="FINISHED_FRAME" class="hidden size-full motion-reduce:block" />
          </div>
          <div
            class="flex min-h-28 flex-[1_1_58%] flex-col gap-1 sm:max-h-full sm:min-w-0 sm:flex-1"
          >
            <h2 class="shrink-0 px-2 text-base font-bold text-ink">{{ t('rules.title') }}</h2>
            <ol class="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
              <li
                v-for="(caption, index) in DEMO_CAPTIONS"
                :key="caption"
                class="flex min-h-11 shrink-0 items-center gap-2 rounded-lg border-2 px-2 py-1.5 text-sm sm:min-h-0"
                :class="STEP_CLASSES[highlight(caption)]"
              >
                <span
                  aria-hidden="true"
                  class="flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                  :class="NUMBER_CLASSES[highlight(caption)]"
                  >{{ index + 1 }}</span
                >
                <span>{{ t(`welcome.captions.${caption}`) }}</span>
              </li>
            </ol>
          </div>
        </div>
        <!-- Start's room: the button needs the app -->
        <span aria-hidden="true" class="mx-auto block h-12 w-full shrink-0 sm:max-w-sm"></span>
      </div>
      <!-- the footer's line and room: its links need the app -->
      <template #footer>
        <div aria-hidden="true" class="mx-auto mt-2 w-full max-w-130 border-t border-border pt-1">
          <div class="min-h-11 sm:min-h-10"></div>
        </div>
      </template>
    </AppScreen>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppHeader from '@/shared/components/AppHeader.vue'
import AppScreen from '@/shared/components/AppScreen.vue'
import DemoBoard from '@/shared/components/DemoBoard.vue'
import { DEMO_CAPTIONS, FINISHED_FRAME, frameAt, type DemoCaption } from '@/shared/demo-script'

const { t } = useI18n()

// the demo's first moment, where the app's demo starts playing
const FIRST_FRAME = frameAt(0)

// which look a step has: highlighted at the first moment, under reduced motion (the finished
// game, WL-17), in both or in neither
type Highlight = 'none' | 'moving' | 'still' | 'both'
function highlight(caption: DemoCaption): Highlight {
  const moving = caption === FIRST_FRAME.caption
  const still = caption === FINISHED_FRAME.caption
  if (moving && still) return 'both'
  if (moving) return 'moving'
  return still ? 'still' : 'none'
}

// HowToPlay's highlighted and plain looks, switched by the motion setting; written out in full so
// Tailwind finds the classes
const STEP_CLASSES: Record<Highlight, string> = {
  none: 'border-transparent text-ink-soft',
  both: 'border-accent bg-accent-tint font-semibold text-ink',
  moving:
    'motion-safe:border-accent motion-safe:bg-accent-tint motion-safe:font-semibold motion-safe:text-ink motion-reduce:border-transparent motion-reduce:text-ink-soft',
  still:
    'motion-reduce:border-accent motion-reduce:bg-accent-tint motion-reduce:font-semibold motion-reduce:text-ink motion-safe:border-transparent motion-safe:text-ink-soft',
}
const NUMBER_CLASSES: Record<Highlight, string> = {
  none: 'bg-surface-strong',
  both: 'bg-accent text-on-accent',
  moving: 'motion-safe:bg-accent motion-safe:text-on-accent motion-reduce:bg-surface-strong',
  still: 'motion-reduce:bg-accent motion-reduce:text-on-accent motion-safe:bg-surface-strong',
}
</script>

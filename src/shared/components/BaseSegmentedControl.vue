<template>
  <div class="flex flex-col gap-2">
    <!-- the visible label; the group carries the same text as its accessible name -->
    <div aria-hidden="true" class="block text-sm font-medium text-ink-soft">{{ label }}</div>
    <div
      role="radiogroup"
      :aria-label="label"
      :aria-describedby="hint ? hintId : undefined"
      class="relative flex gap-0.5 rounded-md border border-border bg-surface p-0.5 shadow-sm"
    >
      <!-- one highlight that slides to the chosen option (VC-25) -->
      <span
        v-if="selectedIndex >= 0"
        data-switch-thumb
        :data-position="selectedIndex"
        aria-hidden="true"
        class="absolute inset-y-0.5 left-0.5 rounded-md bg-accent transition-transform duration-200 ease-out motion-reduce:transition-none"
        :style="thumbStyle"
      ></span>
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        role="radio"
        :aria-checked="model === option.value"
        class="relative min-h-11 min-w-0 flex-1 cursor-pointer rounded-md px-3 text-center text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-accent sm:min-h-8"
        :class="model === option.value ? 'text-on-accent' : 'text-ink-soft hover:bg-surface-muted'"
        @click="model = option.value"
      >
        {{ option.label }}
      </button>
    </div>
    <BaseHint v-if="hint" :id="hintId">{{ hint }}</BaseHint>
  </div>
</template>

<script setup lang="ts" generic="T extends string">
// A labelled full-width switch between a few options, styled like the language toggle
// (design: game mode and difficulty switches; CM-1, CM-5, CM-38), with an optional muted hint
// below it that describes the group (VC-26)
import { computed, useId } from 'vue'
import BaseHint from './BaseHint.vue'

// the group's padding and the gap between options (p-0.5, gap-0.5), in px
const INSET = 2

const props = defineProps<{
  label: string
  options: { value: T; label: string }[]
  hint?: string
}>()

const model = defineModel<T>({ required: true })
const hintId = useId()

const selectedIndex = computed(() =>
  props.options.findIndex((option) => option.value === model.value),
)

// options are equal width, so the highlight is one option wide and moves by whole options; a
// transform, as old WebViews lack the translate property (AR-21)
const thumbStyle = computed(() => {
  const count = props.options.length
  return {
    width: `calc((100% - ${INSET * (count + 1)}px) / ${count})`,
    transform: `translateX(calc(${selectedIndex.value} * (100% + ${INSET}px)))`,
  }
})
</script>

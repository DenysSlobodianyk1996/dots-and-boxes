<template>
  <!-- the header's language button and its dropdown, the menu-button pattern (LG-1..LG-4) -->
  <div ref="root" class="relative shrink-0" @keydown="onKeydown">
    <BaseIconButton
      ref="button"
      data-language-button
      aria-haspopup="menu"
      :aria-expanded="isOpen"
      :aria-controls="isOpen ? menuId : undefined"
      :aria-label="t('language.current', { name: current.name })"
      @click="toggle"
    >
      <span aria-hidden="true" class="text-sm font-bold">{{ current.key }}</span>
    </BaseIconButton>

    <div
      v-if="isOpen"
      :id="menuId"
      ref="menu"
      role="menu"
      :aria-label="t('language.list')"
      :style="{ maxHeight }"
      class="absolute top-full right-0 z-40 mt-2 flex w-48 flex-col overflow-y-auto rounded-2xl border border-border bg-surface p-1 shadow-lg"
    >
      <button
        v-for="language in LANGUAGES"
        :key="language.code"
        type="button"
        role="menuitemradio"
        tabindex="-1"
        :aria-checked="language.code === current.code"
        class="flex min-h-11 w-full shrink-0 cursor-pointer items-center gap-3 rounded-xl px-3 text-left text-sm text-ink transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-accent sm:min-h-9"
        :class="{ 'bg-surface-muted font-bold': language.code === current.code }"
        @click="choose(language.code)"
      >
        <span data-language-key aria-hidden="true" class="w-6 shrink-0 font-bold text-muted">{{
          language.key
        }}</span>
        <span data-language-name :lang="language.code" class="min-w-0 flex-1">{{
          language.name
        }}</span>
        <CheckIcon v-if="language.code === current.code" :size="18" class="shrink-0 text-accent" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale } from '@/i18n'
import { LANGUAGES, type AppLocale } from '@/i18n/languages'
import { useLanguageMenu } from '@/shared/composables/useLanguageMenu'
import CheckIcon from '@/shared/icons/CheckIcon.vue'
import BaseIconButton from './BaseIconButton.vue'

const { t, locale } = useI18n()

const root = useTemplateRef<HTMLElement>('root')
const button = useTemplateRef('button')
const menu = useTemplateRef<HTMLElement>('menu')
const menuId = useId()
const { isOpen, open: markOpen, close } = useLanguageMenu()
const maxHeight = ref<string>()

const current = computed(
  () => LANGUAGES.find(({ code }) => code === locale.value) ?? LANGUAGES[0],
)

const rows = () => [...(menu.value?.querySelectorAll<HTMLElement>('[role="menuitemradio"]') ?? [])]

// the room below the button, so a long list scrolls inside the safe area (LG-4)
function measure() {
  const bottom = button.value?.element?.getBoundingClientRect().bottom ?? 0
  maxHeight.value = `calc(${window.innerHeight - bottom - 16}px - env(safe-area-inset-bottom, 0px))`
}

async function open() {
  measure()
  markOpen(button.value?.element)
  await nextTick()
  rows()[LANGUAGES.indexOf(current.value)]?.focus()
}

function toggle() {
  if (isOpen.value) close({ returnFocus: true })
  else void open()
}

function choose(code: AppLocale) {
  setLocale(code)
  close({ returnFocus: true })
}

function moveFocus(key: string) {
  const items = rows()
  const index = items.indexOf(document.activeElement as HTMLElement)
  const next = {
    ArrowDown: (index + 1) % items.length,
    ArrowUp: (index - 1 + items.length) % items.length,
    Home: 0,
    End: items.length - 1,
  }[key]
  if (next !== undefined) items[next]?.focus()
}

function onKeydown(event: KeyboardEvent) {
  if (!isOpen.value) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      void open()
    }
    return
  }
  if (event.key === 'Escape') {
    event.preventDefault()
    event.stopPropagation()
    close({ returnFocus: true })
  } else if (event.key === 'Tab') {
    close({ returnFocus: false })
  } else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
    event.preventDefault()
    moveFocus(event.key)
  }
}

// a tap outside closes the menu without a change (LG-3)
function onPointerDown(event: Event) {
  if (isOpen.value && !root.value?.contains(event.target as Node)) {
    close({ returnFocus: false })
  }
}

function onResize() {
  if (isOpen.value) measure()
}

onMounted(() => {
  document.addEventListener('pointerdown', onPointerDown)
  window.addEventListener('resize', onResize)
})
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onPointerDown)
  window.removeEventListener('resize', onResize)
  close({ returnFocus: false })
})
</script>

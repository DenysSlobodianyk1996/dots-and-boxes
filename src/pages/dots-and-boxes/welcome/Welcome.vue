<template>
  <!-- fills the space between the header and the footer, so Start stays on screen on a 320 x 568
       phone (WL-19) -->
  <div data-welcome class="mx-auto flex h-full max-w-4xl flex-col gap-3">
    <!-- the page's only h1 (SV-3); takes focus when Home opens this screen; a ring only for
         keyboard use. WelcomeStaticPage.vue mirrors this block for the prerendered page (SV-2) -->
    <div class="flex shrink-0 flex-col gap-0.5 text-center">
      <h1
        data-screen-heading
        tabindex="-1"
        class="rounded-lg text-xl font-extrabold focus-visible:outline-2 focus-visible:outline-accent sm:text-2xl"
      >
        {{ t('welcome.title', { name: t('app.shortName') }) }}
      </h1>
      <!-- how to win, right under the title (WL-10) -->
      <p data-welcome-goal class="text-sm text-ink-soft sm:text-base">{{ t('welcome.goal') }}</p>
    </div>
    <HowToPlay />
    <BaseButton
      data-welcome-start
      type="button"
      color="primary"
      class="mx-auto w-full shrink-0 py-3! text-base! sm:max-w-sm"
      @click="emit('play')"
    >
      {{ t('welcome.start') }}
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import BaseButton from '@/shared/components/BaseButton.vue'
import HowToPlay from '@/shared/components/HowToPlay.vue'

const emit = defineEmits<{ play: [] }>()
const { t } = useI18n()
</script>

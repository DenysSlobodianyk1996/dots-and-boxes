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
    <!-- the Android app, once it's in production; never inside that app (SV-9) -->
    <a
      v-if="showGooglePlay"
      data-google-play
      :href="GOOGLE_PLAY_URL"
      target="_blank"
      rel="noopener"
      class="mx-auto inline-flex min-h-11 shrink-0 items-center px-1 text-sm font-bold text-muted underline underline-offset-3 hover:text-ink focus-visible:outline-2 focus-visible:outline-accent sm:min-h-10"
    >
      {{ t('welcome.googlePlay') }}
    </a>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import BaseButton from '@/shared/components/BaseButton.vue'
import HowToPlay from '@/shared/components/HowToPlay.vue'
import { GOOGLE_PLAY_LIVE, GOOGLE_PLAY_URL } from '@/static/google-play'

const emit = defineEmits<{ play: [] }>()
const { t } = useI18n()

// the Android app's own build never links to its store page
const showGooglePlay = GOOGLE_PLAY_LIVE && !__CAPACITOR_BUILD__
</script>

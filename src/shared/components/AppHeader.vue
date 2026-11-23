<template>
  <!-- the header's brand: logo and game name on the left, the tools on the right (VR-18). The app
       fills the tools (App.vue); the static privacy page shows the brand alone: no script (PV-4) -->
  <header class="mx-auto mb-4 flex w-full max-w-content items-center gap-1 sm:gap-2">
    <AppLogo />
    <!-- takes the room the round buttons leave: at most two lines on a 320 px phone (LG-11) -->
    <span
      data-app-title
      class="min-w-0 flex-1 text-sm leading-tight font-extrabold text-ink min-[400px]:text-lg"
      >{{ t('app.headerName') }}</span
    >
    <slot />
  </header>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppLogo from '@/shared/components/AppLogo.vue'

const { t } = useI18n()
</script>

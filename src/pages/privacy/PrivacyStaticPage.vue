<template>
  <!-- the static store page (privacy/index.html, PV-4): the app's header with the brand only
       (its buttons need JavaScript), then every listed language, no script -->
  <AppHeader />
  <main class="mx-auto flex max-w-2xl flex-col gap-6">
    <nav :aria-label="inEveryLanguage('language.list', ' / ')" class="flex flex-wrap gap-3">
      <a
        v-for="language in LANGUAGES"
        :key="language.code"
        :href="`#${language.code}`"
        :hreflang="language.code"
        :class="LINK_CLASS"
        >{{ language.name }}</a
      >
    </nav>
    <div v-for="(language, index) in LANGUAGES" :id="language.code" :key="language.code">
      <PrivacyContent :locale="language.code" :heading-level="index === 0 ? 1 : 2" />
    </div>
    <!-- the app sits one level up: <pages>/dots-and-boxes/ (the router opens the game) -->
    <a data-open-game href="../" :class="LINK_CLASS" class="self-start">
      {{ inEveryLanguage('privacy.openGame', ' · ') }}
    </a>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { LANGUAGES } from '@/i18n/languages'
import AppHeader from '@/shared/components/AppHeader.vue'
import PrivacyContent from '@/shared/components/PrivacyContent.vue'

const { t } = useI18n()

const LINK_CLASS = 'font-bold text-accent underline underline-offset-3 hover:text-accent-hover'

const inEveryLanguage = (key: string, separator: string) =>
  LANGUAGES.map(({ code }) => t(key, {}, { locale: code })).join(separator)
</script>

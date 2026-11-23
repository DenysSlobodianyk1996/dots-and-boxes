<template>
  <!-- the in-app privacy screen (PV-2): the policy in the interface language, then a way back -->
  <AppScreen>
    <div data-privacy-screen class="mx-auto flex max-w-2xl flex-col gap-4">
      <PrivacyContent :locale="currentLocale" />
      <BaseButton
        data-privacy-back
        color="secondary"
        type="button"
        class="min-h-11 w-full sm:min-h-0 sm:w-auto sm:self-start"
        @click="back"
      >
        {{ t('privacy.back') }}
      </BaseButton>
    </div>
  </AppScreen>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { AppLocale } from '@/i18n/languages'
import { leavePrivacy as back } from '@/router'
import AppScreen from '@/shared/components/AppScreen.vue'
import BaseButton from '@/shared/components/BaseButton.vue'
import PrivacyContent from '@/shared/components/PrivacyContent.vue'

const { t, locale } = useI18n()

const currentLocale = computed(() => locale.value as AppLocale)
</script>

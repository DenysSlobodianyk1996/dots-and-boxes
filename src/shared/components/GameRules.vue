<template>
  <section :aria-labelledby="titleId" class="flex min-h-0 flex-1 flex-col gap-3">
    <h2 :id="titleId" class="text-lg font-bold text-ink">{{ t('rules.title') }}</h2>
    <p data-rules-goal class="text-sm text-ink-soft">{{ t('welcome.goal') }}</p>
    <!-- the same demo and steps as Welcome, smaller (RL-1) -->
    <HowToPlay compact />
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import HowToPlay from './HowToPlay.vue'

// the rules panel labels itself with this title (VR-29)
defineProps<{ titleId: string }>()

const { t } = useI18n()
</script>

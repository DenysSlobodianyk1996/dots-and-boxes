<template>
  <!-- the content under the rules panel's header row; the panel's heading labels it (RL-4, SP-1) -->
  <div class="flex flex-col gap-3">
    <p data-rules-goal class="text-sm text-ink-soft">{{ t('welcome.goal') }}</p>
    <!-- the same demo and steps as Welcome, smaller (RL-1) -->
    <HowToPlay compact />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import HowToPlay from './HowToPlay.vue'

const { t } = useI18n()
</script>

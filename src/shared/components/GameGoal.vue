<template>
  <!-- the game's goal with its name in bold, for the rules panel (NG-7); the parent wraps it in
       its own paragraph -->
  <i18n-t keypath="rules.goal" scope="global">
    <template #name>
      <strong class="font-bold text-ink">{{ t('app.shortName') }}</strong>
    </template>
  </i18n-t>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

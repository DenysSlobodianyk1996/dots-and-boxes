<template>
  <AppScreen>
    <component
      :is="componentConfig.component"
      v-bind="componentConfig.props"
      v-on="componentConfig.listeners"
    >
    </component>
    <!-- Welcome and the setup screen end with Privacy and Contact, pinned below them; the game
         screen has no footer (FT-1, FT-2, MB-11) -->
    <template v-if="!dotsAndBoxesGame.isGameStarted" #footer><AppFooter /></template>
  </AppScreen>
</template>

<script setup lang="ts">
import { DotsAndBoxesGame, type GameSetupForm } from '@/models'
import { computed, onBeforeUnmount, reactive, watch, watchEffect } from 'vue'
import GameSetup from './game-setup/GameSetup.vue'
import Game from './Game.vue'
import Welcome from './welcome/Welcome.vue'
import { useWelcome } from '@/shared/composables/useWelcome'
import AppFooter from '@/shared/components/AppFooter.vue'
import AppScreen from '@/shared/components/AppScreen.vue'
import { StorageService } from '@/services/storage.service.ts'
import { CURRENT_GAME } from '@/static/storage-keys.ts'

const dotsAndBoxesGame = reactive<DotsAndBoxesGame>(new DotsAndBoxesGame())

const savedGame: Partial<DotsAndBoxesGame> | null = StorageService.getItem(CURRENT_GAME, {
  applyParse: true,
})
dotsAndBoxesGame.reset(savedGame)

// games saved before gameplay existed have no current player yet (PS-3)
if (
  dotsAndBoxesGame.isGameStarted &&
  !dotsAndBoxesGame.isFinished &&
  !dotsAndBoxesGame.currentPlayerName
) {
  dotsAndBoxesGame.start()
}

// a restored game, finished or not, goes straight to the board, and leaving it leads to Settings
// (WL-3, WL-16)
const welcome = useWelcome()
if (dotsAndBoxesGame.isGameStarted) welcome.close()

// the header's Home button shows on Settings only (WL-12)
watchEffect(() => welcome.setOnSetup(!dotsAndBoxesGame.isGameStarted && !welcome.isOpen.value))
onBeforeUnmount(() => welcome.setOnSetup(false))

// Play and Home remove the button that had focus, so it moves to the new screen's heading
// (WL-11, WL-12)
watch(welcome.isOpen, () => document.querySelector<HTMLElement>('[data-screen-heading]')?.focus(), {
  flush: 'post',
})

const componentConfig = computed(() => {
  if (dotsAndBoxesGame.isGameStarted) {
    return {
      component: Game,
      props: {
        dotsAndBoxesGame,
      },
      listeners: {},
    }
  }
  if (welcome.isOpen.value) {
    return {
      component: Welcome,
      props: {},
      listeners: {
        play: welcome.close,
      },
    }
  }
  return {
    component: GameSetup,
    props: {},
    listeners: {
      gameSetup,
    },
  }
})

// in Versus computer mode player2 is already the computer player (CM-9, ADR-0001)
function gameSetup({ gameMode, difficulty, player1, player2, size }: GameSetupForm) {
  dotsAndBoxesGame
    .setGameMode(gameMode, difficulty)
    .setPlayer1(player1)
    .setPlayer2(player2)
    .setSize(size)
    .start()
}
</script>

<style lang="scss" scoped></style>

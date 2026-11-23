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
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import GameSetup from './game-setup/GameSetup.vue'
import Game from './Game.vue'
import Welcome from './welcome/Welcome.vue'
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

const route = useRoute()
const router = useRouter()

// the game was left on this page, so /game is on its way to Settings, not Welcome (WL-16)
const hasLeftGame = ref(false)

// a started game always shows, whatever the address; otherwise the address picks (WL-1..WL-3)
const screen = computed(() => {
  if (dotsAndBoxesGame.isGameStarted) return 'game'
  if (route.name === 'settings' || (route.name === 'game' && hasLeftGame.value)) return 'settings'
  return 'welcome'
})

// keeps the address on the screen on show. Replacing, so browser Back doesn't bounce off a
// redirect. The privacy route is left alone: this page is on its way out
watch(
  [() => dotsAndBoxesGame.isGameStarted, () => route.name],
  ([isStarted, name], [wasStarted] = [false, undefined]) => {
    if (wasStarted && !isStarted) hasLeftGame.value = true
    if (isStarted && (name === 'welcome' || name === 'settings')) {
      void router.replace({ name: 'game' })
    } else if (!isStarted && name === 'game') {
      void router.replace({ name: hasLeftGame.value ? 'settings' : 'welcome' })
    }
  },
  { immediate: true },
)

// Play and Home remove the button that had focus, so it moves to the new screen's heading
// (WL-11, WL-12)
watch(
  screen,
  (now, before) => {
    if (now === 'game' || before === 'game') return
    document.querySelector<HTMLElement>('[data-screen-heading]')?.focus()
  },
  { flush: 'post' },
)

const componentConfig = computed(() => {
  if (screen.value === 'game') {
    return {
      component: Game,
      props: {
        dotsAndBoxesGame,
      },
      listeners: {},
    }
  }
  if (screen.value === 'welcome') {
    return {
      component: Welcome,
      props: {},
      listeners: {
        play: () => router.push({ name: 'settings' }),
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

import type { Difficulty, GameMode, GameSetupForm } from '@/models'

// what the form fields hold; the game mode and difficulty come from the switches
export type SetupFormValues = Omit<GameSetupForm, 'gameMode' | 'difficulty'>

export interface SetupDraft {
  values: SetupFormValues
  gameMode: GameMode
  difficulty: Difficulty
}

// What's filled in on Settings while the player visits Welcome (WL-11, WL-12). In memory only, so
// a new launch starts fresh, and starting a game uses it up.
let draft: SetupDraft | null = null

export function useSetupDraft() {
  return {
    read: () => draft,
    save: (next: SetupDraft) => (draft = next),
    clear: () => (draft = null),
  }
}

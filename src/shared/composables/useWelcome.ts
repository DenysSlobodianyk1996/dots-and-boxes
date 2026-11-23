import { readonly, ref } from 'vue'

// Whether Welcome is open (WL-1, WL-2): in memory only, so every launch opens it and the privacy
// screen, which keeps the app loaded, comes back to the screen it was opened from (WL-15).
const isOpen = ref(true)
// whether Settings is the screen on show: the header's Home button appears only there (WL-12)
const isOnSetup = ref(false)

export function useWelcome() {
  return {
    isOpen: readonly(isOpen),
    isOnSetup: readonly(isOnSetup),
    open: () => (isOpen.value = true),
    close: () => (isOpen.value = false),
    setOnSetup: (value: boolean) => (isOnSetup.value = value),
  }
}

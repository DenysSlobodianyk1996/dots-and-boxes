import { ref } from 'vue'

// Whether the header's language menu is open. One per app, like the rules panel, so the Android
// back button can close it (AR-3). Closed whenever the app loads; the state isn't saved.
const isOpen = ref(false)
let opener: HTMLElement | null = null

export function useLanguageMenu() {
  return {
    isOpen,
    open: (button: HTMLElement | null | undefined) => {
      opener = button ?? null
      isOpen.value = true
    },
    close: ({ returnFocus = true }: { returnFocus?: boolean } = {}) => {
      isOpen.value = false
      if (returnFocus) opener?.focus()
    },
  }
}

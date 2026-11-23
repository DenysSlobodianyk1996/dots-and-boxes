import { App } from '@capacitor/app'
import router, { leavePrivacy } from '@/router'
import { useLanguageMenu } from '@/shared/composables/useLanguageMenu'
import { useRulesPanel } from '@/shared/composables/useRulesPanel'
import { useStopDialog } from '@/shared/composables/useStopDialog'

// The Android back button closes what is open on top first and leaves the app only when nothing is
// (AR-3): the language menu, the rules panel, then the Stop dialog, then the privacy screen (back to the game, PV-3),
// then exit
export async function listenToBackButton() {
  const languageMenu = useLanguageMenu()
  const rulesPanel = useRulesPanel()
  const stopDialog = useStopDialog()
  await App.addListener('backButton', () => {
    if (languageMenu.isOpen.value) return languageMenu.close()
    if (rulesPanel.isOpen.value) return rulesPanel.close()
    if (stopDialog.isOpen.value) return stopDialog.close()
    if (router.currentRoute.value.name === 'privacy') return leavePrivacy()
    void App.exitApp()
  })
}

import { createRouter, createWebHistory } from 'vue-router'
import DotsAndBoxesGamePage from '@/pages/dots-and-boxes'
import PrivacyPage from '@/pages/privacy'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // one page owns the game and shows the screen for its address (WL-1..WL-3)
    { path: '/', name: 'welcome', component: DotsAndBoxesGamePage },
    { path: '/settings', name: 'settings', component: DotsAndBoxesGamePage },
    { path: '/game', name: 'game', component: DotsAndBoxesGamePage },
    // the in-app privacy screen (PV-2). Not /privacy: that folder is the static store page
    // (privacy/index.html), which the service worker serves itself (NOT_THE_APP_PAGES)
    {
      path: '/privacy-policy',
      name: 'privacy',
      component: PrivacyPage,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

// back to the screen the privacy page was opened from, or to the start on a direct visit, which
// leads to the game when there is one (PV-3, WL-15)
export function leavePrivacy() {
  if (window.history.state?.back) router.back()
  else void router.push({ name: 'welcome' })
}

// Settings back to Welcome (Home, Back and Android back; WL-12, SP-6, SP-7): a step back in the
// browser history when Start opened Settings from Welcome, otherwise in place of Settings, so
// browser Back from Welcome never reopens Settings
export function backToWelcome() {
  const welcome = router.resolve({ name: 'welcome' }).fullPath
  if (window.history.state?.back === welcome) router.back()
  else void router.replace({ name: 'welcome' })
}

export default router

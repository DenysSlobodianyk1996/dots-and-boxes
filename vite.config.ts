import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

import postcss from 'postcss'
import { createServer, defineConfig, type Plugin, type ResolvedConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA, type ManifestOptions } from 'vite-plugin-pwa'
import { lowerForOldWebView } from './scripts/css-floor'
import { manifestFile } from './src/static/manifests'
import { OLDEST_CHROME } from './src/static/oldest-chrome'
import { NOT_THE_APP_PAGES } from './src/static/service-worker'
import { GOOGLE_PLAY_LIVE, GOOGLE_PLAY_URL } from './src/static/google-play'
import { PREVIEW_IMAGE, siteUrl, structuredData } from './src/static/site'
import { PRERENDER_HIDDEN_CSS, prerenderedWelcomeScript } from './src/static/prerendered-welcome'
import { firstPaintScript } from './src/i18n/first-paint'
import { LANGUAGE_CODES, type AppLocale } from './src/i18n/languages'
import { MESSAGES } from './src/i18n/messages'
import { privacyUpdated } from './scripts/privacy-updated'
import { appVersion } from './scripts/app-version'

// The Android app's build (`vite build --mode capacitor`): Capacitor serves the bundled files from
// the root and they ship inside the app, so there is no service worker and no install manifest
// (AR-1, AR-2). The app reads it as __CAPACITOR_BUILD__ (defined below), a literal the build
// folds, so the web build drops the native-only code and Capacitor itself.
const CAPACITOR_MODE = 'capacitor'

// GitHub Pages serves the app under /<repo>/; the deploy workflow sets BASE_PATH
const base = process.env.BASE_PATH ?? '/'

// The web game's absolute address for search engines and link previews (SV-4, SV-5), or null
// where there is none to give: dev, the Android app, and a Pages build without BASE_PATH, whose
// base '/' would name the owner's user site rather than this game (that build warns instead)
function siteFor(config: ResolvedConfig): string | null {
  if (config.command !== 'build' || config.mode === CAPACITOR_MODE) return null
  return config.base === '/' ? null : siteUrl(config.base)
}

// The link preview image (SV-5): the English Play feature graphic, emitted only in the Pages build,
// so the Android app doesn't carry it
const PREVIEW_IMAGE_SOURCE = fileURLToPath(
  new URL('./docs/store/en/feature-graphic.png', import.meta.url),
)

// splash and status bar: the light --wc-paper from styles.css; index.html's theme-color metas
// add the dark (cocoa) one (VR-46)
const CREAM = '#fbf5ec'

// The first listed language's manifest comes from the PWA plugin, which links it in the page; the
// others are emitted beside it (extraPwaFiles)
const [PLUGIN_MANIFEST_LANGUAGE, ...EXTRA_MANIFEST_LANGUAGES] = LANGUAGE_CODES as [
  AppLocale,
  ...AppLocale[],
]

// Install manifest shared by all languages; only the names differ (VR-44..VR-46, VR-50, VR-51).
// short_name is the shorter launcher label, because launchers truncate the full name (UP-15).
// Icon paths are relative to the manifest, which sits at the base, so they work under any base.
function manifestFor(lang: AppLocale): Partial<ManifestOptions> {
  const { title, shortName, description } = MESSAGES[lang].app
  return {
    id: base,
    lang,
    name: title,
    short_name: shortName,
    // the install prompt describes the game in that language (SV-7)
    description,
    start_url: base,
    scope: base,
    display: 'standalone',
    orientation: 'any',
    background_color: CREAM,
    theme_color: CREAM,
    icons: [
      { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
      {
        src: 'maskable-icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}

// The PWA plugin emits the first language's manifest; this adds the other languages' and a
// 404.html copy of the page (GitHub Pages' deep-link fallback) so they all get precached.
function extraPwaFiles(): Plugin {
  return {
    name: 'dots-and-boxes:extra-pwa-files',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      for (const lang of EXTRA_MANIFEST_LANGUAGES) {
        this.emitFile({
          type: 'asset',
          fileName: manifestFile(lang),
          source: JSON.stringify(manifestFor(lang)),
        })
      }
      const page = bundle['index.html']
      if (page?.type === 'asset') {
        this.emitFile({ type: 'asset', fileName: '404.html', source: page.source })
      }
    },
  }
}

// The privacy policy's "Updated" date (AR-15): the built commit's date, or VITE_PRIVACY_UPDATED
// when set (scripts/privacy-updated.ts). Set here, so the app, the static page and Vitest all
// read the same import.meta.env.VITE_PRIVACY_UPDATED (src/static/privacy.ts).
process.env.VITE_PRIVACY_UPDATED = privacyUpdated({ given: process.env.VITE_PRIVACY_UPDATED })

// The app's version on the privacy pages (PV-5), the same in the web app and the Android app built
// from one commit: VITE_APP_VERSION when set, the Android release's ANDROID_VERSION_NAME, else the
// commit's own 1.0.<merges since 1.0.0> (scripts/app-version.ts). Read as APP_VERSION.
process.env.VITE_APP_VERSION = appVersion({
  given: process.env.VITE_APP_VERSION,
  androidVersionName: process.env.ANDROID_VERSION_NAME,
})

// vue-i18n esm-bundler feature flags: Composition API only, no devtools in production
const I18N_FLAGS = {
  __VUE_I18N_FULL_INSTALL__: true,
  __VUE_I18N_LEGACY_API__: false,
  __INTLIFY_PROD_DEVTOOLS__: false,
  __VUE_PROD_DEVTOOLS__: false,
}
// Rendering the static pages in Node: Vite bundles vue-i18n (with the flags above) rather than
// letting Node load its bundler build, which expects the flags to be defined
const SSR_BUNDLED = ['vue-i18n', /^@intlify\//]

const SRC = fileURLToPath(new URL('./src', import.meta.url))
const STYLES = `${SRC}/assets/styles.css`
const PRIVACY_ENTRY = '/src/privacy-static.ts'
// what src/privacy-static.ts exports (declared here: the Node tsconfig has no @/ alias for it)
type PrivacyStatic = {
  renderPrivacyPage(options: {
    stylesheet: string
    darkVars: string
    canonical?: string
  }): Promise<string>
}

const WELCOME_ENTRY = '/src/welcome-static.ts'
// what src/welcome-static.ts exports
type WelcomeStatic = { renderWelcome(): Promise<string> }

// Loads a server-side entry (the static pages' Vue components) through a throwaway Vite server,
// hands it to `use` and closes the server: the build's own server can't load modules
async function withSsrModule<M, R>(entry: string, use: (module: M) => Promise<R>): Promise<R> {
  const server = await createServer({
    configFile: false,
    root: fileURLToPath(new URL('.', import.meta.url)),
    logLevel: 'silent',
    appType: 'custom',
    server: { middlewareMode: true, hmr: false, ws: false },
    plugins: [vue()],
    resolve: { alias: { '@': SRC } },
    define: I18N_FLAGS,
    ssr: { noExternal: SSR_BUNDLED },
  })
  try {
    return await use((await server.ssrLoadModule(entry)) as M)
  } finally {
    await server.close()
  }
}

// the dark theme's custom properties from styles.css, for the static page's media query
function darkThemeVars(): string {
  let vars = ''
  postcss.parse(readFileSync(STYLES, 'utf8')).walkRules((rule) => {
    if (rule.selector.replace(/["']/g, '') !== ':root[data-theme=dark]') return
    rule.walkDecls((decl) => {
      // !important: the flattened layers (oldWebViewCss) give the app's :root rules a specificity
      // a plain :root here can't beat
      if (decl.prop.startsWith('--')) vars += `${decl.prop}: ${decl.value} !important; `
    })
  })
  if (!vars) throw new Error("styles.css has no :root[data-theme='dark'] rule for the privacy page")
  return vars
}

// The static privacy page, privacy/index.html: Google Play's privacy policy URL, which must work
// without JavaScript (AR-15, PV-4). It is the in-app screen's PrivacyContent rendered to HTML
// (src/privacy-static.ts) with the app's stylesheet. Both builds get it (Workbox precaches it on
// Pages); the dev server renders it at the same addresses. The Pages build also names its
// canonical address (SV-4); the Android app's copy isn't on the web, so it has none.
function privacyPage(): Plugin {
  let canonical: string | undefined
  return {
    name: 'dots-and-boxes:privacy-page',
    enforce: 'post',
    configResolved(config) {
      const site = siteFor(config)
      canonical = site ? `${site}privacy/` : undefined
    },
    async generateBundle(_options, bundle) {
      const css = Object.values(bundle).find(
        (file) => file.type === 'asset' && /^assets\/index-.*\.css$/.test(file.fileName),
      )
      if (!css) throw new Error('No app stylesheet for the privacy page')
      const source = await withSsrModule<PrivacyStatic, string>(PRIVACY_ENTRY, (page) =>
        page.renderPrivacyPage({
          stylesheet: `../${css.fileName}`,
          darkVars: darkThemeVars(),
          canonical,
        }),
      )
      this.emitFile({ type: 'asset', fileName: 'privacy/index.html', source })
    },
    // dev: the same addresses the service worker leaves to the page (NOT_THE_APP_PAGES)
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ?? ''
        if (!NOT_THE_APP_PAGES.some((page) => page.test(url))) return next()
        const path = url.split('?')[0] ?? ''
        if (path.endsWith('/privacy')) {
          res.writeHead(302, { Location: `${path}/` }).end()
          return
        }
        server
          .ssrLoadModule(PRIVACY_ENTRY)
          .then((module) =>
            (module as PrivacyStatic).renderPrivacyPage({
              stylesheet: `${server.config.base}src/assets/styles.css`,
              darkVars: darkThemeVars(),
            }),
          )
          .then((html) => {
            res.setHeader('Content-Type', 'text/html; charset=utf-8')
            res.end(html)
          })
          .catch(next)
      })
    },
  }
}

// The English Welcome in index.html's #app, for search engines that run no JavaScript (SV-2,
// SV-3): src/welcome-static.ts rendered to HTML. The app mounts over it (no hydration) in the
// player's language (SV-6). A pre-paint script hides it where the app won't open Welcome (a saved
// game, any other address, 404.html), so it doesn't flash up there (src/static/prerendered-
// welcome.ts). Only the Pages build: nobody crawls the Android app, and dev needn't.
const APP_MOUNT = '<div id="app"></div>'
function prerenderedWelcome(): Plugin {
  let appBase = '/'
  return {
    name: 'dots-and-boxes:prerendered-welcome',
    apply: 'build',
    configResolved(config) {
      appBase = config.base
    },
    transformIndexHtml: {
      order: 'post',
      async handler(html) {
        if (!html.includes(APP_MOUNT)) throw new Error(`index.html has no ${APP_MOUNT}`)
        const welcome = await withSsrModule<WelcomeStatic, string>(WELCOME_ENTRY, (page) =>
          page.renderWelcome(),
        )
        return {
          html: html.replace(APP_MOUNT, `<div id="app">${welcome}</div>`),
          tags: [
            { tag: 'style', children: PRERENDER_HIDDEN_CSS, injectTo: 'head' },
            { tag: 'script', children: prerenderedWelcomeScript(appBase), injectTo: 'head' },
          ],
        }
      },
    },
  }
}

// An old system WebView, such as a never-updated Samsung S8's (AR-21). Tailwind v4 puts its CSS in
// @layer (Chrome 99), which an older browser drops whole, leaving the app unstyled; and its
// var(--x,) empty fallbacks void the ring before Chrome ~105. This runs on the final, minified CSS
// files (so the minifier can't undo it), before Workbox hashes them for the precache.
function oldWebViewCss(): Plugin {
  return {
    name: 'dots-and-boxes:old-webview-css',
    apply: 'build',
    enforce: 'post',
    async generateBundle(_options, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type === 'asset' && file.fileName.endsWith('.css')) {
          file.source = await lowerForOldWebView(String(file.source))
        }
      }
    },
  }
}

// The page's description for search results, in English from the English locale so it can't drift
// from app.description (SV-1); setLocale() swaps it for people who switch language
function pageDescription(): Plugin {
  return {
    name: 'dots-and-boxes:page-description',
    transformIndexHtml: () => [
      {
        tag: 'meta',
        attrs: { name: 'description', content: MESSAGES.en.app.description },
        injectTo: 'head',
      },
    ],
  }
}

// Search engines and link previews (SV-4, SV-5): the canonical address, Open Graph and Twitter tags
// and a JSON-LD WebApplication (plus the Android app once it's live on Google Play, SV-9), in
// English from the English locale so they can't drift, and the preview image they name. Pages
// build only (see the plugin list); absolute URLs come from the site constant and Vite's base, and
// a build whose base is '/' gets none of them rather than wrong ones (siteFor).
function searchHeadTags(): Plugin {
  let site: string | null = null
  const property = (name: string, content: string | number) => ({
    tag: 'meta',
    attrs: { property: name, content: String(content) },
    injectTo: 'head' as const,
  })
  return {
    name: 'dots-and-boxes:search-head-tags',
    apply: 'build',
    configResolved(config) {
      site = siteFor(config)
      if (!site) {
        config.logger.warn(
          "Base '/': no canonical, link preview tags, structured data or crawl files, as their " +
            'absolute URLs would name the user site. Set BASE_PATH for a Pages build.',
        )
      }
    },
    generateBundle() {
      if (!site) return
      this.emitFile({
        type: 'asset',
        fileName: PREVIEW_IMAGE.file,
        source: readFileSync(PREVIEW_IMAGE_SOURCE),
      })
    },
    transformIndexHtml() {
      if (!site) return []
      const { title, description } = MESSAGES.en.app
      const jsonLd = structuredData({
        site,
        title,
        description,
        languages: LANGUAGE_CODES,
        googlePlayUrl: GOOGLE_PLAY_LIVE ? GOOGLE_PLAY_URL : null,
      })
      return [
        { tag: 'link', attrs: { rel: 'canonical', href: site }, injectTo: 'head' },
        property('og:type', 'website'),
        property('og:title', title),
        property('og:description', description),
        property('og:url', site),
        property('og:image', `${site}${PREVIEW_IMAGE.file}`),
        property('og:image:width', PREVIEW_IMAGE.width),
        property('og:image:height', PREVIEW_IMAGE.height),
        property('og:locale', 'en_US'),
        property('og:site_name', title),
        {
          tag: 'meta',
          attrs: { name: 'twitter:card', content: 'summary_large_image' },
          injectTo: 'head',
        },
        {
          tag: 'script',
          attrs: { type: 'application/ld+json' },
          // "<" escaped, so no text can close the script element
          children: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          injectTo: 'head',
        },
      ]
    },
  }
}

// The crawl files (SV-4), Pages build only: sitemap.xml lists the two indexable pages, the root and
// the static privacy page, and robots.txt allows everything and names it. Crawlers read robots.txt
// only from the host root, which a project site doesn't own, so it is advisory; the sitemap is
// submitted in Search Console (SV-8). Workbox's globPatterns leave both out of the precache.
function crawlFiles(): Plugin {
  let site: string | null = null
  return {
    name: 'dots-and-boxes:crawl-files',
    apply: 'build',
    configResolved(config) {
      site = siteFor(config)
    },
    generateBundle() {
      // base '/': no address to list (searchHeadTags warns)
      if (!site) return
      const urls = [site, `${site}privacy/`].map((url) => `  <url><loc>${url}</loc></url>`)
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...urls,
          '</urlset>',
          '',
        ].join('\n'),
      })
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: ['User-agent: *', 'Allow: /', '', `Sitemap: ${site}sitemap.xml`, ''].join('\n'),
      })
    },
  }
}

// The right language and tab title before the first paint (LG-8), in every build and in dev.
// Injected at the end of <head>, after <title>, so it updates that element.
function firstPaintLanguage(): Plugin {
  return {
    name: 'dots-and-boxes:first-paint-language',
    transformIndexHtml: () => [{ tag: 'script', children: firstPaintScript(), injectTo: 'head' }],
  }
}

// installable and offline (VR-44..VR-52): updates install silently and apply on the next
// launch; the game lives in localStorage, so an update never loses it (VR-48, VR-49)
function pwaPlugins() {
  return [
    VitePWA({
      registerType: 'autoUpdate',
      manifestFilename: manifestFile(PLUGIN_MANIFEST_LANGUAGE),
      manifest: manifestFor(PLUGIN_MANIFEST_LANGUAGE),
      // the icons are already matched by globPatterns, and the plugin precaches its own manifest
      includeManifestIcons: false,
      workbox: {
        // every built asset, incl. 404.html, the font and the icons, so it all works offline (VR-47)
        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,woff2}',
          ...EXTRA_MANIFEST_LANGUAGES.map(manifestFile),
        ],
        // the link preview image (SV-5) is for crawlers and chat apps and never shown in the app,
        // so it stays out of the offline precache
        globIgnores: [PREVIEW_IMAGE.file],
        navigateFallback: 'index.html',
        // the privacy policy is its own page (precached through privacy/index.html), not the app (AR-15)
        navigateFallbackDenylist: NOT_THE_APP_PAGES,
      },
    }),
    extraPwaFiles(),
  ]
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isCapacitor = mode === CAPACITOR_MODE
  return {
    base: isCapacitor ? '/' : base,
    define: {
      ...I18N_FLAGS,
      // true only in the Android app's build (see CAPACITOR_MODE)
      __CAPACITOR_BUILD__: isCapacitor,
    },
    // the dev server renders the static privacy page on the server side (privacyPage())
    ssr: { noExternal: SSR_BUNDLED },
    plugins: [
      vue(),
      vueDevTools(),
      tailwindcss(),
      firstPaintLanguage(),
      pageDescription(),
      oldWebViewCss(),
      // after oldWebViewCss: the page links the final stylesheet
      privacyPage(),
      ...(isCapacitor
        ? []
        : [prerenderedWelcome(), searchHeadTags(), crawlFiles(), ...pwaPlugins()]),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    // An old system WebView (AR-21): build the JS and CSS for OLDEST_CHROME; oldWebViewCss() then
    // lowers what the CSS minifier leaves too new
    build: {
      target: [`chrome${OLDEST_CHROME}`, 'edge107', 'firefox104', 'safari16'],
      cssTarget: [`chrome${OLDEST_CHROME}`, 'edge107', 'firefox104', 'safari16'],
    },
    server: {
      port: 4200,
    },
  }
})

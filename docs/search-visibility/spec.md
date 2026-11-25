# Search visibility: spec

Terms follow [GLOSSARY.md](../../GLOSSARY.md). User stories carry IDs **SV-n** for commits. Shipped rules this touches: WL-1..WL-21 (Welcome's heading level only) and LG-8 (first paint) in [requirements](../dots-and-boxes/requirements.md), PWA manifests, and the static privacy page (PV-1..PV-4).

**Status**: agreed in a grilling session on 2026-11-25. Not implemented. When it ships, fold SV-n into [requirements](../dots-and-boxes/requirements.md); where they differ from this spec, they win.

## Problem Statement

The web game at <https://denysslobodianyk1996.github.io/dots-and-boxes/> is nearly invisible to search engines:

- `index.html` has only `<title>Dots and Boxes</title>` and `lang="en"`. It has no meta description, canonical link, Open Graph or Twitter tags, and no structured data.
- The body is an empty `<div id="app">`, so a crawler gets no text until the JavaScript runs.
- Welcome has no `<h1>`. The game name in the header is a `<span>`, and "Welcome to Dots and Boxes" is an `<h2>`.
- There is no `robots.txt`, no `sitemap.xml` and no image for link previews, and the site isn't in Google Search Console.
- The app has no description text. Only the Play listings have one (`docs/store/<lang>/listing.md`).
- The static privacy page (`/privacy/`) has no description or canonical either.

## Solution

Make the root page rank for English searches such as "dots and boxes online". Visitors play in the browser, and once the Android app is in production, they can also get it from Google Play.

- **One English page**: Google indexes one page, the root. There are no language URLs and no hreflang. The app keeps choosing the language at runtime as it does now (LG-6).
- **Prerendered Welcome**: the build renders Welcome's English text into `index.html`, so crawlers see real content. It is always English for every visitor and is never hidden. The app replaces it when it loads.
- **Real heading**: Welcome's heading becomes the page's `<h1>`.
- **Description**: a new translated description, taken from each Play listing's short description.
- **Head tags**: canonical, Open Graph and Twitter tags, a preview image and a JSON-LD `WebApplication` block.
- **Crawl files**: `robots.txt` and `sitemap.xml`.
- **Search Console**: the property is verified by meta tag, and the sitemap is submitted.
- **Google Play link**: specified now, shown only once the app is in production.

## User Stories

### Being found

1. **SV-1**: As someone searching for the game in English, I want the result to show a clear title and description, so that I know it's a free Dots and Boxes game I can play in the browser.
2. **SV-2**: As a search engine, I want the root page's first HTML to contain the game name, the goal and the six how-to-play steps in English, so that I can index the page without running JavaScript.
3. **SV-3**: As a search engine, I want one `<h1>` naming the game on the root page, so that I know what the page is about.
4. **SV-4**: As a search engine, I want a canonical URL, a `robots.txt`, a `sitemap.xml` and a JSON-LD `WebApplication` block listing all six languages, so that I index the right page once and know the game exists in other languages.

### Sharing

5. **SV-5**: As someone sharing the link in a chat or on social media, I want a preview with the game's title, description and image, so that the link looks like what it leads to.

### Language

6. **SV-6**: As a player whose language isn't English, I want the app to keep opening in my language (saved choice, then device language), so that better search results don't change how the app behaves for me. Before the app loads I may briefly see the English text; that's accepted.
7. **SV-7**: As a player who installs the web app, I want its manifest to carry a description in my language, so that the install prompt describes the game.

### Measuring

8. **SV-8**: As the owner, I want the site verified in Google Search Console with the sitemap submitted, so that I can see how it's indexed and searched. No analytics: PV-1..PV-4 stay true.

### Google Play

9. **SV-9**: As a visitor, once the Android app is in production, I want a "Get it on Google Play" link on Welcome, so that I can install it. The link is hidden until production is live.

## Implementation Decisions

### Description (SV-1, SV-7)

- Add `app.description` to all six locales, equal to each language's Play short description in `docs/store/<lang>/listing.md`. English: "The classic dots and boxes game: draw lines, close squares, beat the computer."
- A test keeps every `app.description` equal to its `listing.md` short description.
- `manifestFor(lang)` in `vite.config.ts` adds `description`.
- `applyDocumentLocale()` (`src/i18n/index.ts`) also sets `<meta name="description">` when the language changes. This matters only for people, since crawlers get the English static tag.

### Head tags (SV-1, SV-4, SV-5)

- One site constant for the absolute URL (origin `https://denysslobodianyk1996.github.io` plus Vite's base), so that canonical, `og:url`, `og:image` and the sitemap agree. Built only into the Pages build. Dev and Capacitor builds don't need absolute URLs.
- `index.html` gets:
  - `<meta name="description">` with the English `app.description`.
  - `<link rel="canonical">` pointing at the root URL.
  - Open Graph: `og:type` website, `og:title`, `og:description`, `og:url`, `og:image`, `og:image:width`/`height`, `og:locale` `en_US`, `og:site_name`.
  - Twitter: `twitter:card` `summary_large_image`.
  - A JSON-LD `WebApplication` block: `name`, `description`, `url`, `applicationCategory` `GameApplication`, `operatingSystem` "Web, Android", `offers` with price 0, `inLanguage` `en`, and `availableLanguage` listing all six language codes.
- Take the English text from `src/i18n/locales/en.ts` at build time, not hand-copied into `index.html`, so it can't drift.
- The preview image is the English Play feature graphic (1024 × 500), copied into `public/` (for example `public/og-image.png`). It must match the precache `globPatterns` or be deliberately excluded. Excluding it is fine, since it's never shown offline.

### Prerendered Welcome (SV-2, SV-3, SV-6)

- The build renders a static English Welcome into `<div id="app">` in `index.html`: the game name, the welcome heading as `<h1>`, the goal sentence, "How to play" and the six steps (`welcome.captions`).
- Reuse the privacy page's mechanism (`privacyPage()` in `vite.config.ts`: Vue SSR through a throwaway Vite server) with its own entry and its own `createI18n({ locale: 'en' })`. Don't import `src/i18n/index.ts`, `Page.vue` or `HowToPlay.vue` as they stand: they touch `navigator`, `localStorage` and `matchMedia` during setup.
- A dedicated static component, as `PrivacyStaticPage.vue` is for privacy, is acceptable if rendering the real components needs too many guards. Either way, the text comes from the same message keys, so it can't diverge.
- The SPA mounts with `createApp(...).mount('#app')`, which replaces the prerendered content. No hydration.
- The static content is always English and is not hidden for other languages (decision from the grilling). The layout should be close enough to Welcome's that the swap doesn't jump much.
- Welcome's live heading becomes `<h1>` with no visual change. WL-12's focus on Welcome's heading still applies. The header's game-name `<span>` stays.
- `404.html` (deploy.yml and `extraPwaFiles()`) is a copy of `index.html` and so carries the same content and canonical. That's fine: `/settings` and `/game` are served with HTTP 404, so they aren't indexed.
- The prerender runs only in the Pages build, not in capacitor mode.

### Crawl files (SV-4)

- `robots.txt` allows everything and names the sitemap. It must sit at the host root to count, and `…github.io/robots.txt` belongs to the user site, not this repo. So it is only advisory unless a user-site repo serves it. The sitemap is submitted in Search Console anyway (SV-8).
- `sitemap.xml` at the base lists two URLs: the root and `/privacy/`.
- The static privacy page (`src/privacy-static.ts`) gets a meta description and a canonical to `…/privacy/`.

### Search Console (SV-8)

- The owner adds the URL-prefix property `https://denysslobodianyk1996.github.io/dots-and-boxes/` and gives the HTML-tag token. It goes into `index.html` as `<meta name="google-site-verification">`.
- After deploy, the owner submits `sitemap.xml` and requests indexing of the root.

### Google Play link (SV-9)

- One constant for the listing URL `https://play.google.com/store/apps/details?id=app.dotsandboxes` and one flag that it's live (`false` now).
- When the flag is on, Welcome shows a translated "Get it on Google Play" link (all six locales), and the JSON-LD adds a second `SoftwareApplication` (or `sameAs`) for the Android app.
- Hidden in the Android app itself.
- Turn the flag on when the app reaches production (see [publishing checklist](../store/publishing-checklist.md)).

## Testing Decisions

- **Unit (Vitest)**: each `app.description` matches its `listing.md` short description; `setLocale()` updates the meta description; every language's manifest has a `description`; Welcome's heading is an `<h1>`; the Play link is absent while the flag is off and present, translated, when it is on.
- **Build output** (a script spec like `scripts/__tests__/*`, or checking by hand with `BASE_PATH=/dots-and-boxes/ npm run build`): `dist/index.html` has the meta description, canonical, Open Graph tags, valid JSON-LD and the English Welcome text with one `<h1>`. `dist/sitemap.xml` and `dist/og-image.png` exist. `privacy/index.html` has its description and canonical. The capacitor-mode `dist/` has no prerendered content and no sitemap.
- **External checks after deploy**: Google's Rich Results Test (JSON-LD), a link-preview check (Open Graph), and Search Console's URL inspection, whose rendered HTML should show the text.

## Out of Scope

- URLs per language (`/uk/`, `/de/`, …) and hreflang.
- Hiding the prerendered English text for visitors in other languages.
- Longer rules or strategy pages written to rank.
- Analytics of any kind.
- A custom domain.
- Indexing `/settings`, `/game` or `/privacy-policy` (the in-app privacy route).

## Further Notes

- Nothing visible changes except the Play link (later) and possibly a brief English flash before the app loads. So the design canvas and store images need no update for SV-1..SV-8. SV-9 adds a visible link, so the canvas and store images get updated when it ships.
- The repo rename left no redirect from the old URL (see [short-name-and-goal](../short-name-and-goal/spec.md)). Search Console will show whether the old URL still gets traffic.

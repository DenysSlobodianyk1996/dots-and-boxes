# Welcome screen and six languages: spec

Terms follow [GLOSSARY.md](../../GLOSSARY.md). User stories carry IDs **WL-n** (Welcome) and **LG-n** (languages) for commits. Shipped rules this touches: RL-1, RL-2, NG-5, NG-6, NG-8, FT-1, FT-2, PS-2, PS-3, AR-3, AR-6, AR-10, AR-16, AR-17, I18N-2, I18N-3, I18N-5, PV-1..PV-4 and PWA-6 in [requirements](../dots-and-boxes/requirements.md).

**Status**: agreed in a grilling session and a prototype on 2026-11-23, not implemented. Issue #88, tickets #89–#95, review adjustments #98–#101. The chosen prototype is on branch [`prototype/welcome-how-to-play`](https://github.com/DenysSlobodianyk1996/dots-and-boxes/tree/prototype/welcome-how-to-play): `804a955` is variant A (chosen), `e77f653` also holds the rejected GIF variant. The language plan follows teach-clock's batch 28 (commit `d6d1091`).

## Problem Statement

New players still don't understand how to play. The app opens on Settings with one sentence about the goal, and the rules sit behind a button most people never open.

The game speaks only Ukrainian and English, in the app, on the privacy page and on Google Play. The header's one-tap language button can't offer more languages, and the store folder mixes language in filenames and folders, which won't scale to six.

## Solution

**Welcome** opens on every launch unless a saved game is being restored. It shows a short, watch-only how-to-play demo drawn live by the app, one caption that follows the demo, and a Play button that leads to Settings. A Home button in the header goes from Settings back to Welcome. The hint sentence and link leave Settings. The Rules panel doesn't change.

The game becomes available in **English, Ukrainian, German, French, Italian and Spanish**: every screen, the privacy policy, the installed app's name and the Play listing with its images. The header's language button opens a menu of the six. Store assets are grouped into one folder per language.

Welcome ships first, so its text is translated once and the store images are generated once from the final UI.

## User Stories

### Welcome

1. **WL-1**: As a new player, I want a Welcome screen when I open the app, so that I learn the game before choosing settings.
2. **WL-2**: As a returning player, I want Welcome on each launch, so that the way into the game is always the same.
3. **WL-3**: As a player with a saved game, finished or not, I want it restored directly, so that Welcome never gets between me and my game.
4. **WL-4**: As a player, I want to watch a short looping game without touching it, so that I see how a game goes with no effort.
5. **WL-5**: As a player, I want the demo to show picking two neighboring dots and the line being drawn, so that I know what to tap.
6. **WL-6**: As a player, I want the demo to show a later line starting from an existing line, so that I learn this game's house rule.
7. **WL-7**: As a player, I want to see a square's fourth side claim it, so that I understand how to score.
8. **WL-8**: As a player, I want to see the turn pass even after a square is claimed, so that I don't expect an extra turn (TR-1).
9. **WL-9**: As a player, I want the demo to end with a full board, a score and a marked winner, so that I know how to win.
10. **WL-10**: As a player, I want one short caption that changes with the demo, so that I know what I'm seeing.
11. **WL-11**: As a player, I want a clear Play button, so that I can go to Settings at any moment.
12. **WL-12**: As a player on Settings, I want a Home button in the header, so that I can go back to Welcome.
13. **WL-13**: As a player on Settings, I no longer want the goal sentence and "How to play" link, so that the screen is only about settings.
14. **WL-14**: As a player, I want the Rules panel to stay as it is, so that the full rules and pictures are still one tap away.
15. **WL-15**: As a player coming back from the privacy screen, I want to return to the screen I left, so that Welcome doesn't reappear.
16. **WL-16**: As a player leaving a finished game through Settings, I want to reach Settings directly, so that I don't watch Welcome again.
17. **WL-17**: As a player who prefers reduced motion, I want a still picture of the finished game with the winning caption, so that nothing moves.
18. **WL-18**: As a screen reader user, I want the demo's steps available as text, so that I get the same explanation.
19. **WL-19**: As a player on a 320 × 568 phone, I want Welcome to fit on one screen with Play visible, so that I never have to scroll to start.
20. **WL-20**: As a player using either theme or language, I want the demo to follow it at once, so that it always looks like the app.
21. **WL-21**: As the author, I want the demo to need no media files or regeneration, so that it stays right after every design change.

### Language choice

22. **LG-1**: As a player, I want the language button to open a list of languages in the order EN, УК, DE, FR, IT, ES, so that I can reach any of them.
23. **LG-2**: As a player, I want each row to show a key and the language's own name, with the current one ticked, so that I can find my language whatever the interface language is.
24. **LG-3**: As a player, I want choosing a language to apply at once and close the menu, and a tap outside to close it without a change, so that the menu is predictable.
25. **LG-4**: As a keyboard or screen reader user, I want to open, move through, choose from and Escape out of the menu, so that it works without touch.
26. **LG-5**: As a player mid-game, I want changing language to keep my game, so that I lose nothing.
27. **LG-6**: As a new player, I want the first device language that's on the list, otherwise English, so that I need no setup.
28. **LG-7**: As a returning player, I want my saved language kept, including existing English and Ukrainian choices, so that the update changes nothing for me.
29. **LG-8**: As a player, I want the right language from the first paint, so that the page doesn't flash another one.

### Six complete languages

30. **LG-9**: As a German, French, Italian or Spanish player, I want every screen, dialog, validation message and color name in my language, so that I can play without English.
31. **LG-10**: As a player, I want messages with numbers and names to read correctly, so that the game doesn't show bad grammar.
32. **LG-11**: As a player on a small phone, I want longer words to fit every screen and button, so that nothing is clipped.
33. **LG-12**: As a player, I want the app name in my language in the header, tab, installed web app and Android launcher, so that the name is consistent.
34. **LG-13**: As a player, I want accented letters and ß to match the rest of the text, so that the app looks finished.

### Privacy

35. **LG-14**: As a player, I want the in-app privacy screen and its date in the interface language, so that I can read it.
36. **LG-15**: As a visitor to the public privacy page, I want links to all six languages at the top, so that I can jump to mine.
37. **LG-16**: As the author, I want the public address unchanged and the page free of JavaScript, so that the Play Console link keeps working.

### Store

38. **LG-17**: As the author, I want one folder per language with plain filenames, so that everything for one listing is together.
39. **LG-18**: As the author, I want one command to regenerate all screenshots and feature graphics, so that a UI change needs no manual sorting.
40. **LG-19**: As a parent or player in a new language, I want a Play listing, screenshots and feature graphic in my language, so that I can decide whether to install.
41. **LG-20**: As the author, I want listings checked against Play's limits, so that an upload isn't rejected.
42. **LG-21**: As a tester, I want release notes in my language once its listing exists, so that I understand an update.
43. **LG-22**: As the author, I want a list of the phrases a native speaker should check first, so that a later review starts with what matters.

## Implementation Decisions

### Welcome (WL-1..WL-21)

- **Screens and addresses**: `/` is Welcome, `/settings` is `GameSetup`, `/game` is `Game`. A started game always shows at `/game`; `/game` without one leads to `/`, and leaving a finished game through Settings leads to `/settings`. **No new storage key.**
- **Footer**: Privacy and Contact show on Welcome and Settings, not during a game.
- **Home** is a `BaseIconButton` in the `App.vue` header, on Settings only, with a new inline SVG icon component and a translated label.
- **Settings draft**: what's filled in on Settings survives Home, Play and the privacy screen, in memory only (**no new storage key**). A new launch starts fresh, and starting a game clears it.
- **Focus**: Play and Home move focus to the new screen's heading, with a focus ring only for keyboard use.
- **Android back button** (AR-3): language menu, then rules panel, then Stop dialog, then exit. Home is the way from Settings to Welcome.
- **Demo script**: one 2 × 2 game of 12 lines, played on a real `DotsAndBoxesGame` so an illegal script throws. Coral wins 3 : 1. It's a pure function of time, as in the prototype's `timeline.ts`, and is tested without timers.
- **Demo rendering**: inline SVG in theme tokens. The players are A and B, on the score chips and inside claimed squares. The six steps are a list beside the demo (below it on phones), with the current one highlighted. The animation uses `requestAnimationFrame` and stops on unmount.
- **Reduced motion** renders the finished frame with the winning caption, with no loop.
- **Accessibility**: the SVG is `aria-hidden`. The six steps are a visible ordered list, with `aria-current` on the highlighted one.
- **Rules**: remove the goal and link from `GameSetup.vue` and `rules.howToPlay`. Changed after review: the Rules panel now repeats Welcome's demo and six steps in a smaller, stacked block, replacing its goal, five rules and storyboard.
- **Prototype**: #89 relies on `prototype/welcome-how-to-play` (`804a955`) as the reference for the demo script, timing, captions, layout and Home button. Its code is rewritten to project standards, not merged. When #89 is finished, delete the branch locally and on GitHub, and remove the references to it from this spec.

### Languages (LG-1..LG-13)

- **One ordered list**, EN, УК, DE, FR, IT, ES, drives messages, the menu, detection, the first-paint script, manifests, privacy output, store generation and test loops. `index.html`'s pre-paint script can't import app modules, so the build injects the list.
- **Language keys and own names** live once next to the list.
- **Detection** uses `navigator.languages`: first entry whose base language is listed, otherwise English. A saved `LOCALE` wins.
- **Language menu**: a dropdown from the existing round header button, replacing the toggle, using the menu-button pattern and staying inside the safe area.
- **Messages** stay statically bundled. Every locale is typed against `en.ts`. No plural system: strings with counts or names are worded to avoid agreement.
- **App names**: Dots and Boxes, Крапки й квадрати, Käsekästchen, Pipopipette, Punti e quadrati, Puntos y cuadrados. The German and French names are the games' traditional names. All four new names go on the native review list.
- **Android**: `values-de`, `values-fr`, `values-it` and `values-es` `strings.xml`.
- **Web manifests**: one per language, all emitted and precached.
- **Old WebViews**: follow AR-21. The feature graphic must embed the Latin Extended font subset where accented letters need it.
- **Translations** are drafted by Claude and shipped, with the review list as a follow-up check.

### Privacy (LG-14..LG-16)

- The in-app screen renders the interface language. The static page renders all six at the same address, with language links and no JavaScript.
- `formatPrivacyDate` keeps hand-written month tables, so Node and the browser print identical text.

### Store (LG-17..LG-22)

- **Tree**: `docs/store/<lang>/` holds `listing.md`, `feature-graphic.png`, `phone/`, `tablet-7/` and `tablet-10/`. The store root keeps `icon-512.png`, `play-console.md`, `publishing-checklist.md` and `tester-invite.md`. Existing files move with `git mv`.
- **Screenshots** add Welcome as the first shot, captured under the script's existing reduced-motion setting so it's the stable finished frame. Fixtures seed what they need to reach Settings.
- **Release notes**: `android-release.yml` adds the four new Play locales only after their listings exist in Play Console, because a release-notes locale without a listing may fail the upload.
- Listings and images are added in Play Console by hand.

### Delivery

- **One PR (#97)** for the app, store files and docs, merged once. The merge releases to Play closed testing.
- **Deferred**: the four new Play listings (#94) are added later by hand from the saved `docs/store/<lang>/` files. Their release notes (#95) follow only after that, so until then release notes stay in English and Ukrainian.

### Review adjustments

Changed on purpose after the first build, each tracked as a sub-ticket of #88:

- **#98, screen addresses** (WL-1..WL-3, WL-16): `/` is Welcome, `/settings` is Settings and `/game` is the game.
- **#99, name error** (GS-6): a name's error goes away as soon as typing makes the name valid.
- **#100, next-step hint** (END-8): the in-game hint is highlighted.
- **#101, one how-to-play block** (WL-10, WL-14, WL-17..WL-20, RL-1, RL-7): Welcome is titled with the game's name, with the demo beside a list of all six steps and the current one highlighted. Players are A and B. The rules panel shows the same block, smaller, and loses its goal sentence, five rules and storyboard. This replaces WL-14's original "the Rules panel stays as it is".

## Testing Decisions

- Tests check external behavior through `mountGamePage` and the page driver in `src/test/game-page.ts`, which stays the only place that knows the DOM. `mountGamePage` gets a way past Welcome so existing specs keep their intent.
- **Welcome**: first launch, restored and finished games, Play, Home, return from privacy, Settings from a finished game, reduced motion and hidden captions. The demo script is tested directly: legal, turn passes after a claimed square, ends 3 : 1.
- **Languages**: list order, device resolution, every locale having the same keys and placeholders, menu behavior, persistence, in-game switching. Specs that use German as the unsupported language move to Polish.
- **Generated output**: manifests, Android names, privacy page, listing limits.
- **By eye and build**: 320 × 568, 360 × 640 and tablet in all languages and themes, both build modes (`BASE_PATH=/dots-and-boxes/ npm run build`, `npm run build:capacitor`), and one debug APK on a real phone.

## Out of Scope

- Interactive or try-it tutorials, and video or GIF demos.
- Changes to the game rules.
- "Don't show again" for Welcome.
- Teach-clock's required-name change.
- Languages beyond the six, and a plural system.
- Automatic upload of store listings or images.
- Translated tester invitations.
- The native review itself.

## Further Notes

- After shipping, fold WL-n and LG-n into `requirements.md` and mark this spec shipped in `docs/README.md`.
- The workflow's design step applies: the Welcome and language menu boards go on the design canvas as part of their tickets, with the prototype as the visual reference.

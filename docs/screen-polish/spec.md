# Screen polish: spec

Terms follow [GLOSSARY.md](../../GLOSSARY.md). User stories carry IDs **SP-n** for commits. Shipped rules this changes: RL-1, RL-3, RL-4, WL-10, WL-11, WL-12, WL-19, GS-6, TH-1, HD-1 and FT-1 in [requirements](../dots-and-boxes/requirements.md), and AR-3 in the [Android release spec](../android-release/spec.md).

**Status**: agreed in a grilling session on 2026-11-24. Not implemented. When it ships, fold SP-n into [requirements](../dots-and-boxes/requirements.md); where they differ from this spec, they win.

## Problem Statement

A few rough edges remain after Welcome shipped:

- In the rules panel, the "How to play" heading sits on its own line under the ✕ button, so the panel spends a row on a lone ✕. When the panel scrolls, ✕ scrolls away with it.
- The buttons are named the wrong way round. Welcome's button says **Play** but only leads to Settings. Settings' button says **Save** but actually starts the game. The spec already calls it Start (GS-6, TH-1), so the code and spec disagree.
- Settings has no visible way back next to its main button. The only way back to Welcome is the icon-only Home button in the header. Android's own back button on Settings closes the app.
- On short screens, the step the demo is showing sometimes stays hidden. The list should scroll to it, but often doesn't. The follow logic only scrolls the step list. When the list doesn't overflow and the screen's main area or the rules panel scrolls instead, it does nothing. A tap on a step also stops following for 5 seconds, longer than a step lasts, and nothing catches up afterwards.

## Solution

- The rules panel gets one header row: the "How to play" heading on the left and ✕ on the right. The row stays put while the panel's content scrolls under it.
- Welcome's button becomes **Start**. Settings' button becomes **Play**, and a secondary **Back** button sits on its left and returns to Welcome. The header's Home button stays.
- Android's back button on Settings goes to Welcome. On Welcome it still exits the app.
- Wherever the steps scroll, the highlighted step is brought into view inside whichever area actually scrolls, and only when it's out of view. Only the player's own scrolling pauses this, and it catches up when the pause ends.

## User Stories

### Rules panel

1. **SP-1**: As a player, I want the rules panel's "How to play" heading on the same row as ✕, so that the panel's title and its close button read as one header.
2. **SP-2**: As a player reading the rules on a short screen, I want that header row to stay in place while the content scrolls, so that I can always see the title and close the panel.

### Button names

3. **SP-3**: As a player on Welcome, I want the button to say **Start** («Почати», «Los geht's», «Commencer», «Inizia», «Empezar»), so that it doesn't promise a game when it leads to Settings.
4. **SP-4**: As a player on Settings, I want the button that starts the game to say **Play** («Грати», «Spielen», «Jouer», «Gioca», «Jugar»), so that I know it starts the game rather than saving something.

### Back from Settings

5. **SP-5**: As a player on Settings, I want a **Back** button («Назад», «Zurück», «Retour», «Indietro», «Atrás») to the left of Play, so that the way back to Welcome is next to the way forward.
6. **SP-6**: As a player, I want Back to behave like the header's Home button: what I filled in stays, and focus moves to Welcome's heading, so that both ways back are the same.
7. **SP-7**: As a player on Android, I want the system back button on Settings to go to Welcome, and on Welcome to leave the app, so that back means back.

### Following the steps

8. **SP-8**: As a player on a short screen, I want the highlighted step brought into view wherever the steps scroll (inside the list, the screen or the rules panel), so that I can always see what the demo is showing.
9. **SP-9**: As a player, I want the view to move only when the highlighted step is out of view, so that the page doesn't jump when the step is already visible.
10. **SP-10**: As a player, I want only my own scrolling to pause the following, not a tap on a step, and the view to catch up to the current step when the pause ends, so that the view is never left behind.

## Implementation Decisions

### Rules panel (SP-1, SP-2)

- The header row holds the heading (still the dialog's label, RL-4) and ✕ (still 44 px and still focused on open, RL-3, RL-4).
- The goal sentence and the how-to-play block stay under the header. Only the area below the header scrolls, so the panel has one scroll area.
- In compact mode, `HowToPlay` keeps hiding its own heading.

### Button names (SP-3, SP-4)

- Welcome's label changes in all six locales. Settings' label key no longer says "save". The six Settings labels reuse Welcome's current texts.
- German Start is «Los geht's» rather than "Start", because German Home is already "Start".
- Rename "Start" to "Play" for the Settings button in GS-6 and TH-1. Rename "Play" to "Start" for the Welcome button in WL-11, WL-12 and WL-19.

### Back from Settings (SP-5..SP-7)

- Back is a secondary `BaseButton` on the same row as Play. Back is on the left, Play on the right, both equal width on phones. It is part of the form, not the footer, so FT-1 is unchanged.
- Back goes to Welcome exactly as Home does: the in-memory Settings draft is kept, and focus moves to Welcome's heading with a ring only for keyboard use (WL-12).
- The header's Home button (HD-1, HD-5) stays as it is.
- Android back order (AR-3): language menu, rules panel, Stop dialog, privacy screen, then **Settings to Welcome**, then exit.

### Following the steps (SP-8..SP-10)

- This replaces WL-10's last sentence ("Where the list scrolls, it keeps the highlighted step in view, unless the player has just scrolled it").
- When the highlighted step changes, bring it into view inside every scroll area around it (the step list, the screen's main area on Welcome, the rules panel's content). Scroll the least distance needed, and don't move if it's already fully visible.
- A step counts as visible only if it's clear of the pinned footer and the Start button.
- Taps and clicks on a step don't pause following. Wheel, touch and drag scrolling of the steps still pauses it for a short while. When the pause ends, follow the current step at once, without waiting for the next change.
- Follow again once layout settles on mount, including when the rules panel opens and in the reduced-motion still frame.

## Testing Decisions

- Tests check external behavior through `mountGamePage` and the page driver in `src/test/game-page.ts`, which stays the only place that knows the DOM.
- **Unit (jsdom)**: the panel's heading and ✕ in one header, the heading still labelling the dialog; the Start, Play and Back labels in all six languages; Back keeping the draft and moving focus to Welcome's heading; Android back on Settings going to Welcome (fake the Capacitor plugin with `vi.mock`, as now); a tap on a step not pausing following.
- **Real layout (Playwright)**: jsdom has no layout, so check SP-8..SP-10 in a real browser at 320 × 568 and 360 × 640, portrait and landscape, on Welcome and in the rules panel. Each step the demo reaches should end fully visible.
- **By eye**: both themes, all six languages (longest labels: Back and Play on one row at 320 px).

## Out of Scope

- Removing or restyling the header's Home button.
- Changing the demo script, its timing or the step texts.
- Changing the footer.

## Further Notes

- At the end of this scope, update the design canvas (local boards and the remote canvas) for the rules panel, Welcome and Settings, and regenerate the store images, as `CLAUDE.md` requires.
- `CLAUDE.md` described a `useWelcome()` composable that doesn't exist; Welcome is chosen from the route. Fixed together with this spec.

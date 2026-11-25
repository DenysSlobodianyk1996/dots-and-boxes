// Source of message keys; uk.ts must have exactly the same shape (I18N-1)
const en = {
  app: {
    title: 'Dots and Boxes',
    // header name, Welcome's title and the install manifest short_name (NG-1, WL-10)
    shortName: 'Dots and Boxes',
    // the header's name: the short name, with a soft hyphen where one long word needs it (LG-11)
    headerName: 'Dots and Boxes',
    // the game's one-line description: the Play short description (docs/store/<lang>/listing.md),
    // the install manifest's description and the page's meta description (SV-1, SV-7)
    description: 'The classic dots and boxes game: draw lines, close squares, beat the computer.',
  },
  // the language button's accessible name and its menu's (LG-4); each language's own name is in
  // src/i18n/languages.ts
  language: {
    current: 'Language: {name}',
    list: 'Language',
  },
  // the theme button names the theme it switches to (VR-16)
  theme: {
    light: 'Light theme',
    dark: 'Dark theme',
  },
  // the setup screen's footer (FT-1, FT-3)
  footer: {
    privacy: 'Privacy',
    contact: 'Contact',
  },
  // the privacy policy: the in-app screen and the static store page share it (AR-15, PV-1)
  privacy: {
    title: 'Privacy policy',
    updated: 'Updated:',
    // the app's version under the date (PV-5)
    version: 'Version:',
    noDataTitle: 'No personal data',
    noData:
      'The app does not collect any personal data. It does not send data to any server, store data remotely or share data with anyone.',
    onDeviceTitle: 'What stays on your device',
    onDevice:
      'To let you continue later, the app saves the current game, the language, the theme, the game mode and the difficulty on your device only. Removing the app or clearing its data deletes them.',
    noAdsTitle: 'No ads, analytics, accounts or permissions',
    noAds:
      'The app shows no ads, uses no analytics or tracking, needs no account and asks for no device permissions.',
    childrenTitle: 'Children',
    children:
      'The app is suitable for children. Because it collects nothing, it collects nothing from children either.',
    contactTitle: 'Contact',
    contactIntro: 'Questions about this policy or the app:',
    email: 'Email:',
    developerTitle: 'Developer',
    createdBy: 'Created by Denys Slobodianyk',
    back: 'Back to the game',
    openGame: 'Open the game',
  },
  setup: {
    title: 'Settings',
    player: 'Player {number}',
    playerName: 'Player {number} name',
    name: 'Name',
    color: 'Color',
    size: 'Size',
    sizeHint: 'From {min} to {max}',
    play: 'Play',
    back: 'Back',
    mode: 'Game mode',
    modeComputer: 'Versus computer',
    modeTwoPlayers: 'Two players',
    you: 'You',
    opponent: 'Opponent',
    difficulty: 'Difficulty',
    easy: 'Easy',
    normal: 'Normal',
    easyHint: 'The computer picks a random line.',
    normalHint: 'The computer takes squares whenever it can and tries not to give you any.',
  },
  colors: {
    coral: 'Coral',
    teal: 'Teal',
    sunflower: 'Sunflower',
    sky: 'Sky',
    lavender: 'Lavender',
    leaf: 'Leaf',
    berry: 'Berry',
    tangerine: 'Tangerine',
    // validation: the other player already has this swatch (VR-36)
    taken: 'This color is already taken',
  },
  players: {
    computer: 'Computer',
  },
  validation: {
    invalid: '{field} is not valid.',
    maxLength: '{field} can be at most {length} characters.',
    computerName: 'This name belongs to the computer',
    differentNames: 'Values must be different',
  },
  game: {
    hintFirstLine: 'Pick any dot to start the first line.',
    hintSelected:
      'Pick a highlighted neighbor to draw the line. Pick the selected dot again to cancel.',
    hintStart: 'Pick a highlighted dot to start a line.',
    dotLabel: 'Dot row {row}, column {col}',
  },
  status: {
    turn: 'Turn',
    yourTurn: 'Your turn',
    thinking: 'Thinking…',
    // announced politely after the computer's line (CM-37)
    computerDrew: 'Computer drew a line',
    computerClaimedOne: 'Computer drew a line and claimed a square',
    computerClaimedTwo: 'Computer drew a line and claimed two squares',
    score: 'Score',
    stop: 'Stop',
    stopTitle: 'Stop the game?',
    stopText: 'Whoever owns more squares now wins.',
    cancel: 'Cancel',
    stopGame: 'Stop game',
  },
  result: {
    title: 'Result',
    wins: '{name} wins',
    youWon: 'You won!',
    computerWon: 'Computer won',
    draw: 'Draw',
    completed: 'All squares are filled.',
    stopped: 'The game was stopped.',
    score: 'Score',
    settings: 'Settings',
    rematch: 'Rematch',
  },
  // the Welcome screen; one caption per stage of the how-to-play demo (WL-10, WL-12)
  welcome: {
    title: 'Welcome to {name}',
    goal: 'Whoever owns more squares when the board is full wins.',
    start: 'Start',
    googlePlay: 'Get it on Google Play',
    home: 'Home',
    captions: {
      drawLine: 'Tap two neighboring dots to draw a line.',
      startFromLine: 'Players take turns. Each new line starts from a dot that already has a line.',
      claimSquare: "Draw a square's fourth side and it's yours.",
      turnPasses: 'After every line, the turn passes to the other player.',
      keepGoing: 'Keep going until every square is claimed.',
      mostSquaresWins: 'Board full: most squares wins!',
    },
  },
  rules: {
    title: 'How to play',
    open: 'Rules',
    close: 'Close rules',
  },
}

export default en

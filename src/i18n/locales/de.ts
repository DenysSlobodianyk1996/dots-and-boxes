import type en from './en'

// Typed as the English messages, so a missing or extra key fails type-check (I18N-1)
const de: typeof en = {
  app: {
    title: 'Käsekästchen',
    shortName: 'Käsekästchen',
    headerName: 'Käse\u00adkästchen',
  },
  language: {
    current: 'Sprache: {name}',
    list: 'Sprache',
  },
  theme: {
    light: 'Helles Design',
    dark: 'Dunkles Design',
  },
  footer: {
    privacy: 'Datenschutz',
    contact: 'Kontakt',
  },
  privacy: {
    // a soft hyphen, so the long word can break on a 320 px screen (LG-11)
    title: 'Datenschutz­erklärung',
    updated: 'Aktualisiert:',
    version: 'Version:',
    noDataTitle: 'Keine personenbezogenen Daten',
    noData:
      'Die App erhebt keine personenbezogenen Daten. Sie sendet keine Daten an einen Server, speichert keine Daten extern und gibt keine Daten an andere weiter.',
    onDeviceTitle: 'Was auf deinem Gerät bleibt',
    onDevice:
      'Damit du später weiterspielen kannst, speichert die App das aktuelle Spiel, die Sprache, das Design, den Spielmodus und die Schwierigkeit nur auf deinem Gerät. Wenn du die App entfernst oder ihre Daten löschst, werden sie gelöscht.',
    noAdsTitle: 'Keine Werbung, Analyse, Konten oder Berechtigungen',
    noAds:
      'Die App zeigt keine Werbung, nutzt keine Analyse- oder Tracking-Dienste, braucht kein Konto und fragt nach keinen Geräteberechtigungen.',
    childrenTitle: 'Kinder',
    children:
      'Die App ist für Kinder geeignet. Da sie nichts erhebt, erhebt sie auch von Kindern nichts.',
    contactTitle: 'Kontakt',
    contactIntro: 'Fragen zu dieser Erklärung oder zur App:',
    email: 'E-Mail:',
    developerTitle: 'Entwickler',
    createdBy: 'Entwickelt von Denys Slobodianyk',
    back: 'Zurück zum Spiel',
    openGame: 'Spiel öffnen',
  },
  setup: {
    title: 'Einstellungen',
    player: 'Spieler {number}',
    playerName: 'Name von Spieler {number}',
    name: 'Name',
    color: 'Farbe',
    size: 'Größe',
    sizeHint: 'Von {min} bis {max}',
    save: 'Speichern',
    mode: 'Spielmodus',
    modeComputer: 'Gegen Computer',
    modeTwoPlayers: 'Zwei Spieler',
    you: 'Du',
    opponent: 'Gegner',
    difficulty: 'Schwierigkeit',
    easy: 'Leicht',
    normal: 'Normal',
    easyHint: 'Der Computer wählt eine zufällige Linie.',
    normalHint:
      'Der Computer holt sich Kästchen, wann immer er kann, und versucht, dir keine zu überlassen.',
  },
  colors: {
    coral: 'Koralle',
    teal: 'Türkis',
    sunflower: 'Sonnenblume',
    sky: 'Himmel',
    lavender: 'Lavendel',
    leaf: 'Blatt',
    berry: 'Beere',
    tangerine: 'Mandarine',
    taken: 'Diese Farbe ist schon vergeben',
  },
  players: {
    computer: 'Computer',
  },
  validation: {
    invalid: '{field} ist ungültig.',
    maxLength: '{field}: höchstens {length} Zeichen.',
    computerName: 'Dieser Name gehört dem Computer',
    differentNames: 'Die Namen müssen sich unterscheiden',
  },
  game: {
    hintFirstLine: 'Wähle einen beliebigen Punkt für die erste Linie.',
    hintSelected:
      'Wähle einen markierten Nachbarn, um die Linie zu ziehen. Wähle den gewählten Punkt noch einmal, um abzubrechen.',
    hintStart: 'Wähle einen markierten Punkt als Start der Linie.',
    dotLabel: 'Punkt Zeile {row}, Spalte {col}',
  },
  status: {
    turn: 'Am Zug',
    yourTurn: 'Du bist dran',
    thinking: 'Denkt nach…',
    computerDrew: 'Der Computer hat eine Linie gezogen',
    computerClaimedOne: 'Der Computer hat eine Linie gezogen und ein Kästchen geholt',
    computerClaimedTwo: 'Der Computer hat eine Linie gezogen und zwei Kästchen geholt',
    score: 'Punkte',
    stop: 'Stopp',
    stopTitle: 'Spiel beenden?',
    stopText: 'Wer jetzt mehr Kästchen hat, gewinnt.',
    cancel: 'Abbrechen',
    stopGame: 'Beenden',
  },
  result: {
    title: 'Ergebnis',
    wins: '{name} gewinnt',
    youWon: 'Du hast gewonnen!',
    computerWon: 'Der Computer hat gewonnen',
    draw: 'Unentschieden',
    completed: 'Alle Kästchen sind vergeben.',
    stopped: 'Das Spiel wurde beendet.',
    score: 'Punkte',
    settings: 'Einstellungen',
    rematch: 'Revanche',
  },
  welcome: {
    title: 'Willkommen bei {name}',
    goal: 'Wer die meisten Kästchen hat, wenn das Feld voll ist, gewinnt.',
    play: 'Spielen',
    home: 'Start',
    captions: {
      drawLine: 'Tippe auf zwei benachbarte Punkte, um eine Linie zu ziehen.',
      startFromLine:
        'Ihr seid abwechselnd dran. Jede neue Linie beginnt an einem Punkt, der schon eine Linie hat.',
      claimSquare: 'Zieh die vierte Seite eines Kästchens, und es gehört dir.',
      turnPasses: 'Nach jeder Linie ist der andere Spieler dran.',
      keepGoing: 'Spielt weiter, bis alle Kästchen vergeben sind.',
      mostSquaresWins: 'Feld voll: Die meisten Kästchen gewinnen!',
    },
  },
  rules: {
    title: 'So wird gespielt',
    open: 'Regeln',
    close: 'Regeln schließen',
  },
}

export default de

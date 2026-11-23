import type en from './en'

// Typed as the English messages, so a missing or extra key fails type-check (I18N-1)
// a no-break space stands before : ! ? and ; so the mark never starts a line
const fr: typeof en = {
  app: {
    title: 'Pipopipette',
    shortName: 'Pipopipette',
    headerName: 'Pipopipette',
  },
  language: {
    current: 'Langue : {name}',
    list: 'Langue',
  },
  theme: {
    light: 'Thème clair',
    dark: 'Thème sombre',
  },
  footer: {
    privacy: 'Confidentialité',
    contact: 'Contact',
  },
  privacy: {
    title: 'Politique de confidentialité',
    updated: 'Mise à jour :',
    version: 'Version :',
    noDataTitle: 'Aucune donnée personnelle',
    noData:
      'L’application ne collecte aucune donnée personnelle. Elle n’envoie aucune donnée à un serveur, ne stocke rien à distance et ne partage rien avec qui que ce soit.',
    onDeviceTitle: 'Ce qui reste sur votre appareil',
    onDevice:
      'Pour que vous puissiez reprendre plus tard, l’application enregistre la partie en cours, la langue, le thème, le mode de jeu et la difficulté uniquement sur votre appareil. Supprimer l’application ou effacer ses données les efface.',
    noAdsTitle: 'Ni publicité, ni statistiques, ni compte, ni autorisation',
    noAds:
      'L’application n’affiche aucune publicité, n’utilise ni statistiques ni suivi, ne demande aucun compte et aucune autorisation sur l’appareil.',
    childrenTitle: 'Enfants',
    children:
      'L’application convient aux enfants. Comme elle ne collecte rien, elle ne collecte rien non plus auprès des enfants.',
    contactTitle: 'Contact',
    contactIntro: 'Questions sur cette politique ou sur l’application :',
    email: 'E-mail :',
    developerTitle: 'Développeur',
    createdBy: 'Créé par Denys Slobodianyk',
    back: 'Retour au jeu',
    openGame: 'Ouvrir le jeu',
  },
  setup: {
    title: 'Paramètres',
    player: 'Joueur {number}',
    playerName: 'Nom du joueur {number}',
    name: 'Nom',
    color: 'Couleur',
    size: 'Taille',
    sizeHint: 'De {min} à {max}',
    save: 'Enregistrer',
    mode: 'Mode de jeu',
    modeComputer: 'Contre l’ordinateur',
    modeTwoPlayers: 'Deux joueurs',
    you: 'Vous',
    opponent: 'Adversaire',
    difficulty: 'Difficulté',
    easy: 'Facile',
    normal: 'Normal',
    easyHint: 'L’ordinateur choisit une ligne au hasard.',
    normalHint:
      'L’ordinateur prend les carrés dès qu’il le peut et essaie de ne pas vous en laisser.',
  },
  colors: {
    coral: 'Corail',
    teal: 'Turquoise',
    sunflower: 'Tournesol',
    sky: 'Ciel',
    lavender: 'Lavande',
    leaf: 'Feuille',
    berry: 'Baie',
    tangerine: 'Mandarine',
    taken: 'Cette couleur est déjà prise',
  },
  players: {
    computer: 'Ordinateur',
  },
  validation: {
    invalid: 'Valeur non valide : {field}.',
    maxLength: '{field} : {length} caractères maximum.',
    computerName: 'Ce nom appartient à l’ordinateur',
    differentNames: 'Les noms doivent être différents',
  },
  game: {
    hintFirstLine: 'Choisissez un point pour commencer la première ligne.',
    hintSelected:
      'Choisissez un voisin en surbrillance pour tracer la ligne. Choisissez à nouveau le point sélectionné pour annuler.',
    hintStart: 'Choisissez un point en surbrillance pour commencer une ligne.',
    dotLabel: 'Point ligne {row}, colonne {col}',
  },
  status: {
    turn: 'Tour',
    yourTurn: 'À vous',
    thinking: 'Réflexion…',
    computerDrew: 'L’ordinateur a tracé une ligne',
    computerClaimedOne: 'L’ordinateur a tracé une ligne et pris un carré',
    computerClaimedTwo: 'L’ordinateur a tracé une ligne et pris deux carrés',
    score: 'Score',
    stop: 'Arrêter',
    stopTitle: 'Arrêter la partie ?',
    stopText: 'Celui qui a le plus de carrés maintenant gagne.',
    cancel: 'Annuler',
    stopGame: 'Arrêter',
  },
  result: {
    title: 'Résultat',
    wins: '{name} gagne',
    youWon: 'Victoire !',
    computerWon: 'L’ordinateur gagne',
    draw: 'Égalité',
    completed: 'Tous les carrés sont pris.',
    stopped: 'La partie a été arrêtée.',
    score: 'Score',
    settings: 'Paramètres',
    rematch: 'Revanche',
  },
  welcome: {
    play: 'Jouer',
    home: 'Accueil',
    captions: {
      drawLine: 'Touchez deux points voisins pour tracer une ligne.',
      startFromLine:
        'Chacun joue à son tour. Chaque nouvelle ligne part d’un point qui a déjà une ligne.',
      claimSquare: 'Tracez le quatrième côté d’un carré et il est à vous.',
      turnPasses: 'Après chaque ligne, c’est au tour de l’autre joueur.',
      keepGoing: 'Continuez jusqu’à ce que tous les carrés soient pris.',
      mostSquaresWins: 'Grille pleine : le plus de carrés gagne !',
    },
  },
  rules: {
    title: 'Comment jouer',
    open: 'Règles',
    close: 'Fermer les règles',
  },
}

export default fr

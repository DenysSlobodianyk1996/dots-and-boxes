import type en from './en'

// Typed as the English messages, so a missing or extra key fails type-check (I18N-1)
const es: typeof en = {
  app: {
    title: 'Puntos y cuadrados',
    shortName: 'Puntos y cuadrados',
    headerName: 'Puntos y cuadrados',
  },
  language: {
    current: 'Idioma: {name}',
    list: 'Idioma',
  },
  theme: {
    light: 'Tema claro',
    dark: 'Tema oscuro',
  },
  footer: {
    privacy: 'Privacidad',
    contact: 'Contacto',
  },
  privacy: {
    title: 'Política de privacidad',
    updated: 'Actualización:',
    version: 'Versión:',
    noDataTitle: 'Ningún dato personal',
    noData:
      'La aplicación no recopila ningún dato personal. No envía datos a ningún servidor, no los guarda de forma remota y no los comparte con nadie.',
    onDeviceTitle: 'Lo que se queda en tu dispositivo',
    onDevice:
      'Para que puedas continuar más tarde, la aplicación guarda la partida actual, el idioma, el tema, el modo de juego y la dificultad solo en tu dispositivo. Al quitar la aplicación o borrar sus datos, se eliminan.',
    noAdsTitle: 'Sin anuncios, analítica, cuentas ni permisos',
    noAds:
      'La aplicación no muestra anuncios, no usa analítica ni seguimiento, no necesita una cuenta y no pide permisos del dispositivo.',
    childrenTitle: 'Menores',
    children:
      'La aplicación es apta para menores. Como no recopila nada, tampoco recopila nada de los menores.',
    contactTitle: 'Contacto',
    contactIntro: 'Preguntas sobre esta política o la aplicación:',
    email: 'Correo:',
    developerTitle: 'Desarrollador',
    createdBy: 'Creado por Denys Slobodianyk',
    back: 'Volver al juego',
    openGame: 'Abrir el juego',
  },
  setup: {
    title: 'Ajustes',
    player: 'Jugador {number}',
    playerName: 'Nombre del jugador {number}',
    name: 'Nombre',
    color: 'Color',
    size: 'Tamaño',
    sizeHint: 'De {min} a {max}',
    save: 'Guardar',
    mode: 'Modo de juego',
    modeComputer: 'Contra el ordenador',
    modeTwoPlayers: 'Dos jugadores',
    you: 'Tú',
    opponent: 'Rival',
    difficulty: 'Dificultad',
    easy: 'Fácil',
    normal: 'Normal',
    easyHint: 'El ordenador elige una línea al azar.',
    normalHint: 'El ordenador toma cuadrados siempre que puede e intenta no dejarte ninguno.',
  },
  colors: {
    coral: 'Coral',
    teal: 'Turquesa',
    sunflower: 'Girasol',
    sky: 'Cielo',
    lavender: 'Lavanda',
    leaf: 'Hoja',
    berry: 'Baya',
    tangerine: 'Mandarina',
    taken: 'Este color ya está elegido',
  },
  players: {
    computer: 'Ordenador',
  },
  validation: {
    invalid: 'Valor no válido: {field}.',
    maxLength: '{field}: máximo {length} caracteres.',
    computerName: 'Este nombre es del ordenador',
    differentNames: 'Los nombres deben ser distintos',
  },
  game: {
    hintFirstLine: 'Elige cualquier punto para empezar la primera línea.',
    hintSelected:
      'Elige un vecino resaltado para trazar la línea. Elige otra vez el punto seleccionado para cancelar.',
    hintStart: 'Elige un punto resaltado para empezar una línea.',
    dotLabel: 'Punto fila {row}, columna {col}',
  },
  status: {
    turn: 'Turno',
    yourTurn: 'Tu turno',
    thinking: 'Pensando…',
    computerDrew: 'El ordenador ha trazado una línea',
    computerClaimedOne: 'El ordenador ha trazado una línea y ha tomado un cuadrado',
    computerClaimedTwo: 'El ordenador ha trazado una línea y ha tomado dos cuadrados',
    score: 'Puntos',
    stop: 'Parar',
    stopTitle: '¿Parar la partida?',
    stopText: 'Gana quien tenga más cuadrados ahora.',
    cancel: 'Cancelar',
    stopGame: 'Parar',
  },
  result: {
    title: 'Resultado',
    wins: 'Gana {name}',
    youWon: '¡Has ganado!',
    computerWon: 'Ha ganado el ordenador',
    draw: 'Empate',
    completed: 'Todos los cuadrados están tomados.',
    stopped: 'La partida se ha parado.',
    score: 'Puntos',
    settings: 'Ajustes',
    rematch: 'Revancha',
  },
  welcome: {
    play: 'Jugar',
    home: 'Inicio',
    captions: {
      drawLine: 'Toca dos puntos vecinos para trazar una línea.',
      startFromLine:
        'Se juega por turnos. Cada línea nueva sale de un punto que ya tiene una línea.',
      claimSquare: 'Traza el cuarto lado de un cuadrado y será tuyo.',
      turnPasses: 'Después de cada línea, el turno pasa al otro jugador.',
      keepGoing: 'Sigue hasta que todos los cuadrados estén tomados.',
      mostSquaresWins: 'Tablero lleno: ¡gana quien tiene más cuadrados!',
    },
  },
  rules: {
    title: 'Cómo jugar',
    open: 'Reglas',
    close: 'Cerrar las reglas',
  },
}

export default es

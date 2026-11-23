# Native-speaker review list

What to check first in each language (LG-22). Claude drafted the German, French, Italian and Spanish texts, and no native speaker has reviewed them yet. Sources: `src/i18n/locales/<lang>.ts` (app and privacy text) and `docs/store/<lang>/listing.md`. A change to an app name must also go to `android/app/src/main/res/values-<lang>/strings.xml` and the listing's title.

## Decisions for all reviewers

| Question | Today | What to confirm |
|---|---|---|
| Form of address | Informal in DE (du), IT (tu), ES (tú); formal in FR (vous); UK uses «ви» | Does this suit a family game in each market? French children's games often use «tu», and the German privacy text addresses the reader as «du». |
| Spanish "computer" | **ordenador** (Spain) everywhere | Latin America says **computadora**. The one `es` locale and the `es-ES` listing serve every Spanish speaker. Decide whether that's acceptable or whether a separate `es-419` is worth adding later. |
| Spanish plural "you" | The listing's «pasaos» is Spain-only (vosotros) | If the listing should also read well in Latin America, reword it. |
| Generic masculine | Spieler, joueur, giocatore, jugador | Acceptable for a game UI? |

## German (de)

- **App name**: Käsekästchen. Is it the name players know, and does it read as this game?
- **Game terms**: Kästchen, Linie, Punkt, „Am Zug“, „Du bist dran“, „Stopp“, „Revanche“, „Unentschieden“, „Gegen Computer“.
- **Phrases**: „Die meisten Kästchen gewinnen“ (do boxes win, or players?), „holt sich Kästchen“, „Feld voll“, Home button „Start“, theme „Helles/Dunkles Design“.
- **Colors**: Koralle, Türkis, Sonnenblume, Himmel, Blatt, Beere, Mandarine.
- **Listing**: the heading „Die Verbindungsregel“, the short description.
- **Privacy**: „personenbezogene Daten“, „erhebt“, „Datenschutzerklärung“, and whether „du“ fits a legal text.

## French (fr)

- **App name**: Pipopipette. Is it known, or would « La pipopipette » or « Jeu des petits carrés » serve better?
- **Game terms**: carré, ligne, point, « Tour », « À vous », « Arrêter », « Revanche », « Égalité », « Contre l’ordinateur ».
- **Phrases**: « Le plus de carrés gagne » (the most natural wording?), « Celui qui a le plus de carrés », « Réflexion… », Home button « Accueil ».
- **Colors**: Corail, Turquoise, Tournesol, Ciel, Lavande, Feuille, Baie, Mandarine.
- **Listing**: « La règle de la chaîne », « à portée de doigt », « d’un seul geste »; no-break spaces before : ; ! ? and inside « ».
- **Privacy**: « Politique de confidentialité », « ne collecte aucune donnée », « autorisation ».

## Italian (it)

- **App name**: Punti e quadrati. Is it the usual name, or is "Gioco dei puntini" / "Punti e linee" more familiar?
- **Game terms**: quadrato, linea, punto, «Turno», «Tocca a te», «Ferma», «Rivincita», «Pareggio», «Contro il computer».
- **Phrases**: «un vicino evidenziato», «Griglia piena», «Sta pensando…», Home button «Home».
- **Colors**: Corallo, Turchese, Girasole, Cielo, Lavanda, Foglia, Bacca, Mandarino.
- **Listing**: «La regola della catena», «a un tocco di distanza», «da dove eri rimasto» (masculine only).
- **Privacy**: «Informativa sulla privacy», «non raccoglie alcun dato», «autorizzazioni».

## Spanish (es)

- **App name**: Puntos y cuadrados. Would "Timbiriche" (Mexico) or "Puntos y cajas" be more familiar in some markets?
- **Game terms**: cuadrado, línea, punto, «Turno», «Tu turno», «Parar», «Revancha», «Empate», «Contra el ordenador».
- **Phrases**: «un vecino resaltado», «tomar» a square, «Tablero lleno», Home button «Inicio», «Ajustes» (Latin America often says «Configuración»), «móvil» and «tableta» in the listing.
- **Colors**: Coral, Turquesa, Girasol, Cielo, Lavanda, Hoja, Baya, Mandarina.
- **Listing**: «La regla de la cadena», «pasaos», «a un toque».
- **Privacy**: «Política de privacidad», «no recopila», «Menores» for children.

## Ukrainian (uk)

Ukrainian was already live, so only these newer lines need a check:

- **Listing**: «Коротка анімована демонстрація під час запуску…» and «Шість мов: …».
- **Welcome**: the six captions (`welcome.captions`).

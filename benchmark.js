import { iterativeDeepening, playRandomMoves} from './bot.js';
import { iterativeDeepening2, playRandomMoves2} from './bot2.js';

// Une position de milieu de partie complexe (FEN)
function newBoard() {
return {
  pieces: new Int8Array([
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, -2, -1, 0, 0, 0,
    0, 0, 0, 0, -3, -2, -1, 0, 0,
    0, 0, 0, 0, 0, -3, -2, -1, 0,
    0, 2, 3, 0, 0, 0, -3, -2, 0,
    0, 1, 2, 3, 0, 0, 0, 0, 0,
    0, 0, 1, 2, 3, 0, 0, 0, 0,
    0, 0, 0, 1, 2, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0
    ]),
    turn: true
  };
}

// ON applique quelques coups aléatoires
const testBoard = playRandomMoves(newBoard(), 10); // Applique 10 coups aléatoires pour créer une position de milieu de partie

console.log("Démarrage du benchmark...");

// On simule une réflexion de 3 secondes (3000 ms)
const [evalScore, bestMove] = iterativeDeepening(testBoard, 10000);

console.log("Terminé!!")
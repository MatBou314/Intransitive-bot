import readline from 'readline';
import { iterativeDeepening } from './bot.js';


const colsName = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];

const pieceToChar = {
    1: 'R', // Red Rock
    2: 'P', // Red Paper
    3: 'S', // Red Scissors
    "-1": 'r', // Blue Rock
    "-2": 'p', // Blue Paper
    "-3": 's'  // Blue Scissors
}
function squareName(idx) {
  const col = colsName[idx % 9];
  const row = 9 - Math.floor(idx / 9);
  return `${col}${row}`;
}

function squareIdx(sqStr) {
  const col = colsName.indexOf(sqStr[0]);
  const row = parseInt(sqStr[1], 10);
  return (9 - row) * 9 + col;
}

function parseMoveStr(moveStr) {
  const clean = moveStr.replace(/^[RPSrps]/, '');
  const parts = clean.split(/[-x]/);
  return {
    from: squareIdx(parts[0]),
    to: squareIdx(parts[1])
  };
}

function moveStr(move) {
    const from = move >> 8;
    const to = move & 255;
    const {pieces} = currentBoard;
    const fromPiece = pieces[from];
    const toPiece = pieces[to];
    if (toPiece === 0) return `${pieceToChar[fromPiece]}${squareName(from)}-${squareName(to)}`;
    else return `${pieceToChar[fromPiece]}${squareName(from)}x${squareName(to)}`;
}

function parseFEN(fenString) {
  const parts = fenString.trim().split(' ');
  const pieceStr = parts[0];
  const sideStr = parts[1];

  const parsedPieces = new Int8Array(81);
  const ranks = pieceStr.split('/');

  // FEN ranks run from rank 1 (Blue home, bottom, indices 72-80) to rank 9 (top, indices 0-8)
  for (let r = 0; r < 9; r++) {
    const rankStr = ranks[r];
    let col = 0;
    for (let i = 0; i < rankStr.length; i++) {
      const char = rankStr[i];
      if (char >= '1' && char <= '9') {
        col += parseInt(char, 10);
      } else {
        let pieceVal = 0;
        if (char === 'R') pieceVal = 1;
        else if (char === 'P') pieceVal = 2;
        else if (char === 'S') pieceVal = 3;
        else if (char === 'r') pieceVal = -1;
        else if (char === 'p') pieceVal = -2;
        else if (char === 's') pieceVal = -3;
        
        // Map FEN rank r (0 = rank1) to board index (8-r)
        parsedPieces[(8 - r) * 9 + col] = pieceVal;
        col++;
      }
    }
  }
  return { pieces: parsedPieces, turn: sideStr === 'b' };
}

// ==========================================
// Reception
// ==========================================
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

let currentBoard = null;
let moves = [];

rl.on('line', (line) => {
  const words = line.trim().split(/\s+/);
  const cmd = words[0];
  if (!cmd) return;

  if (cmd === 'rpsi') {
    // Identification de ton bot
    console.log("id name MatBot-v1");
    console.log("id author MatBou314");
    console.log("protocol 1");
    console.log("mode V6");
    console.log("rpsiok");
  } 
  else if (cmd === 'isready') {
    console.log("readyok");
  } 
  else if (cmd === 'position') {
    const fenIdx = words.indexOf('fen');
    if (fenIdx !== -1) {
      // Reconstituer la chaîne FEN (pièces + côté à jouer)
      const fenString = `${words[fenIdx + 1]} ${words[fenIdx + 2]}`;
      currentBoard = parseFEN(fenString);
    }
  } 
  else if (cmd === 'legalmoves') {
    moves = words.slice(1);
  } 
  else if (cmd === 'go') {
    let rtime = 0, btime = 0, rinc = 0, binc = 0;
    for (let i = 1; i < words.length; i += 2) {
      if (words[i] === 'rtime') rtime = parseInt(words[i + 1], 10);
      if (words[i] === 'btime') btime = parseInt(words[i + 1], 10);
      if (words[i] === 'rinc') rinc = parseInt(words[i + 1], 10);
      if (words[i] === 'binc') binc = parseInt(words[i + 1], 10);
    }

    const inc = currentBoard.turn ? binc : rinc;
    const time = currentBoard.turn ? btime : rtime;
    // Leave some margin; use a fraction of remaining time + increment
    const maxTime = inc + Math.min(10000, time/20);

    const bestMove = iterativeDeepening(currentBoard, maxTime)[1];
    if (bestMove == null) console.log(`bestmove ${moves[0]}`);
    const bestStr = moveStr(bestMove);
    console.log(`bestmove ${bestStr}`);

  } 

  else if (cmd === 'quit') {
    process.exit(0);
  }
});
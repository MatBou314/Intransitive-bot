function getCaseContour(caseIdx) {
  let casesContour = [];
  const isLeft = ((caseIdx % 9) === 0);
  const isRight = ((caseIdx % 9) === 8);
  if (!isLeft) {
    casesContour.push(caseIdx - 10);
    casesContour.push(caseIdx - 1);
    casesContour.push(caseIdx + 8);
  }
  if (!isRight) {
    casesContour.push(caseIdx - 8);
    casesContour.push(caseIdx + 1);
    casesContour.push(caseIdx + 10);
  }
  casesContour.push(caseIdx - 9);
  casesContour.push(caseIdx + 9);
  return casesContour.filter(idx => (idx >= 0 && idx < 81));
}

const casesContour = Array(81);
for (let i = 0; i < 81; i++) {
    casesContour[i] = getCaseContour(i);
}

const memMoves = Array(128);
for (let i = 0; i < 128; i++) memMoves[i] = new Uint32Array(72);

function getMoves(moves) {
  let count = 0;
  if (turn) {
    for (let i = 0; i < blueRCount; i++) {
      const from = blueRocks[i];
      const contour = casesContour[from];
      for (let j = 0; j < contour.length; j++) {
        const to = contour[j];
        const toPiece = pieces[to];
        if (toPiece === 0 || toPiece === -3) moves[count++] = from << 8 | to;
      }
    }

    for (let i = 0; i < bluePCount; i++) {
      const from = bluePapers[i];
      const contour = casesContour[from];
      for (let j = 0; j < contour.length; j++) {
        const to = contour[j];
        const toPiece = pieces[to];
        if (toPiece === 0 || toPiece === -1) moves[count++] = from << 8 | to;
      }
    }

    for (let i = 0; i < blueSCount; i++) {
      const from = blueScissors[i];
      const contour = casesContour[from];
      for (let j = 0; j < contour.length; j++) {
        const to = contour[j];
        const toPiece = pieces[to];
        if (toPiece === 0 || toPiece === -2) moves[count++] = from << 8 | to;
      }
    }
  } else {
    for (let i = 0; i < redRCount; i++) {
      const from = redRocks[i];
      const contour = casesContour[from];
      for (let j = 0; j < contour.length; j++) {
        const to = contour[j];
        const toPiece = pieces[to];
        if (toPiece === 0 || toPiece === 3) moves[count++] = from << 8 | to;
      }
    }

    for (let i = 0; i < redPCount; i++) {
      const from = redPapers[i];
      const contour = casesContour[from];
      for (let j = 0; j < contour.length; j++) {
        const to = contour[j];
        const toPiece = pieces[to];
        if (toPiece === 0 || toPiece === 1) moves[count++] = from << 8 | to;
      }
    }

    for (let i = 0; i < redSCount; i++) {
      const from = redScissors[i];
      const contour = casesContour[from];
      for (let j = 0; j < contour.length; j++) {
        const to = contour[j];
        const toPiece = pieces[to];
        if (toPiece === 0 || toPiece === 2) moves[count++] = from << 8 | to;
      }
    }
  }
  return count;
}

function getMovesOrdered(moves, bestMove) {
  let count = 0;
  let score = 0;
  if (turn) {
    for (let i = 0; i < blueRCount; i++) {
      const from = blueRocks[i];
      const contour = casesContour[from];
      for (let j = 0; j < contour.length; j++) {
        const to = contour[j];
        const toPiece = pieces[to];
        if (toPiece === 0) {
            const move = from << 8 | to;
            score = move === bestMove ? 1024 : SQUAREVALUE[to];
            moves[count++] = score << 16 | move;
            
        } else if (toPiece === -3) {
          const move = from << 8 | to;
          score = move === bestMove ? 1024 : 50 - redSCount;
          moves[count++] = score << 16 | move;
        }
      }
    }

    for (let i = 0; i < bluePCount; i++) {
      const from = bluePapers[i];
      const contour = casesContour[from];
      for (let j = 0; j < contour.length; j++) {
        const to = contour[j];
        const toPiece = pieces[to];
        if (toPiece === 0) {
            const move = from << 8 | to;
            score = move === bestMove ? 1024 : SQUAREVALUE[to];
            moves[count++] = score << 16 | move;  
        } else if (toPiece === -1) {
          const move = from << 8 | to;
          score = move === bestMove ? 1024 : 50 - blueRCount;
          moves[count++] = score << 16 | move;
        }
      }
    }

    for (let i = 0; i < blueSCount; i++) {
      const from = blueScissors[i];
      const contour = casesContour[from];
      for (let j = 0; j < contour.length; j++) {
        const to = contour[j];
        const toPiece = pieces[to];
        if (toPiece === 0) {
            const move = from << 8 | to;
            score = move === bestMove ? 1024 : SQUAREVALUE[to];
            moves[count++] = score << 16 | move;

        } else if (toPiece === -2) {
          const move = from << 8 | to;
          score = move === bestMove ? 1024 : 50 - redPCount;
          moves[count++] = score << 16 | move;
        }
      }
    }
  } else {
    for (let i = 0; i < redRCount; i++) {
      const from = redRocks[i];
      const contour = casesContour[from];
      for (let j = 0; j < contour.length; j++) {
        const to = contour[j];
        const toPiece = pieces[to];
        if (toPiece === 0) {
            const move = from << 8 | to;
            score = move === bestMove ? 1024 : SQUAREVALUE[80 - to];
            moves[count++] = score << 16 | move;

        } else if (toPiece === 3) {
          const move = from << 8 | to;
          score = move === bestMove ? 1024 : 50 - blueSCount;
          moves[count++] = score << 16 | move;
        }
      }
    }

    for (let i = 0; i < redPCount; i++) {
      const from = redPapers[i];
      const contour = casesContour[from];
      for (let j = 0; j < contour.length; j++) {
        const to = contour[j];
        const toPiece = pieces[to];
        if (toPiece === 0) {
            const move = from << 8 | to;
            score = move === bestMove ? 1024 : SQUAREVALUE[80 - to];
            moves[count++] = score << 16 | move;
            
        } else if (toPiece === 1) {
          const move = from << 8 | to;
          score = move === bestMove ? 1024 : 50 - blueRCount;
          moves[count++] = score << 16 | move;
        }
      }
    }

    for (let i = 0; i < redSCount; i++) {
      const from = redScissors[i];
      const contour = casesContour[from];
      for (let j = 0; j < contour.length; j++) {
        const to = contour[j];
        const toPiece = pieces[to];
        if (toPiece === 0) {
            const move = from << 8 | to;
            score = move === bestMove ? 1024 : SQUAREVALUE[80 - to];
            moves[count++] = score << 16 | move;
            
        } else if (toPiece === 2) {
          const move = from << 8 | to;
          score = move === bestMove ? 1024 : 50 - bluePCount;
          moves[count++] = score << 16 | move;
        }
      }
    }
  }
  moves.subarray(0, count).sort()
  return count;
}

function isGameOverOpt() {
  return (bluePiecesCount <= 0) || (redPiecesCount <= 0) || (pieces[8] > 0) || (pieces[72] < 0);
}

function winner() {
  if (pieces[8] > 0) return true;
  if (pieces[72] < 0) return false;
  if (bluePiecesCount <= 0) return false;
  if (redPiecesCount <= 0) return true;
  return null;
}


function rand64() {
  const high = BigInt(Math.floor(Math.random() * 0xFFFFFFFF));
  const low = BigInt(Math.floor(Math.random() * 0xFFFFFFFF));
  return (high << 32n) | low;
}

const zobristPieces = new BigUint64Array(81 * 7);
for (let i = 0; i < 81 * 7; i++) zobristPieces[i] = rand64();

const zobristTurn = rand64();

function initialHash() {
  hash = 0n; // BigInt à 0

  for (let i = 0; i < 81; i++) {
    hash ^= zobristPieces[(i * 7) + pieces[i] + 3];
  }

  if (turn) {
    hash ^= zobristTurn;
  }
}

const memFromPiece = new Int8Array(128);
const memToPiece   = new Int8Array(128);
const memHash      = new BigUint64Array(128);
let movePtr = 0;

const pieces = new Int8Array(81);
let turn = true;
let hash = 0n;

const blueRocks = new Uint8Array(3);
let blueRCount = 3;
const bluePapers = new Uint8Array(4);
let bluePCount = 4;
const blueScissors = new Uint8Array(3);
let blueSCount = 3;

let bluePiecesCount = 10;

const redRocks = new Uint8Array(3);
let redRCount = 3;
const redPapers = new Uint8Array(4);
let redPCount = 4;
const redScissors = new Uint8Array(3);
let redSCount = 3;

let redPiecesCount = 10;

const blueRInfluence = new Uint8Array(81);
const bluePInfluence = new Uint8Array(81);
const blueSInfluence = new Uint8Array(81);

const redRInfluence = new Uint8Array(81);
const redPInfluence = new Uint8Array(81);
const redSInfluence = new Uint8Array(81);

function initState(board) {
  movePtr = 0;
  pieces.set(board.pieces);
  turn = board.turn;

  bluePiecesCount = 0;
  redPiecesCount = 0;
  blueRCount = 0;
  redRCount = 0;
  bluePCount = 0;
  redPCount = 0;
  blueSCount = 0;
  redSCount = 0;
  for (let i = 0; i < 81; i++) {
    const piece = pieces[i];
    if (piece > 0) {
      bluePiecesCount++;
      if (piece === 1) {
        blueRocks[blueRCount++] = i;
      }
      else if (piece === 2) bluePapers[bluePCount++] = i;
      else blueScissors[blueSCount++] = i;
    }
    else if (piece < 0) {
      redPiecesCount++;
      if (piece === -1) redRocks[redRCount++] = i;
      else if (piece === -2) redPapers[redPCount++] = i;
      else redScissors[redSCount++] = i;
    }
  }
  // influence 
  for (let i = 0; i < 81; i++) {
    const mult = 81 * i;

    let min = 10
    for (let j = 0; j < blueRCount; j++) {
        const dist = DIST_TABLE[mult + blueRocks[j]];
        if (dist < min) min = dist;
    }
    blueRInfluence[i] = min;

    min = 10
    for (let j = 0; j < bluePCount; j++) {
        const dist = DIST_TABLE[mult + bluePapers[j]];
        if (dist < min) min = dist;
    }
    bluePInfluence[i] = min;

    min = 10
    for (let j = 0; j < blueSCount; j++) {
        const dist = DIST_TABLE[mult + blueScissors[j]];
        if (dist < min) min = dist;
    }
    blueSInfluence[i] = min;


    min = 10
    for (let j = 0; j < redRCount; j++) {
        const dist = DIST_TABLE[mult + redRocks[j]];
        if (dist < min) min = dist;
    }
    redRInfluence[i] = min;

    min = 10
    for (let j = 0; j < redPCount; j++) {
        const dist = DIST_TABLE[mult + redPapers[j]];
        if (dist < min) min = dist;
    }
    redPInfluence[i] = min;

    min = 10
    for (let j = 0; j < redSCount; j++) {
        const dist = DIST_TABLE[mult + redScissors[j]];
        if (dist < min) min = dist;
    }
    redSInfluence[i] = min;
  }
  initialHash()
}


function updateInfluence(influenceList, piecesList, nPieces) {
    for (let i = 0; i < 81; i++) {
        const mult = i * 81;
        let min = 10;
        for (let j = 0; j < nPieces; j++) {
            const dist = DIST_TABLE[mult + piecesList[j]];
            if (dist < min) min = dist;
        }
        influenceList[i] = min;
    }
}

function playHash(from, to) {
  const toPiece = pieces[to];
  const fromPiece = pieces[from];

  const fromZorb = from * 7;
  const toZorb = to * 7;
  
  memFromPiece[movePtr] = fromPiece;
  memToPiece[movePtr] = toPiece;
  memHash[movePtr] = hash;
  movePtr++;

  pieces[from] = 0;
  hash ^= zobristPieces[fromZorb + fromPiece + 3]
  hash ^= zobristPieces[fromZorb + 3]

  pieces[to] = fromPiece;
  hash ^= zobristPieces[toZorb + toPiece + 3]
  hash ^= zobristPieces[toZorb + fromPiece + 3]

  if (toPiece > 0) {
      bluePiecesCount--;
      if (toPiece === 1) {
        const idx = blueRocks.indexOf(to);
        const lastPieceSquare = blueRocks[--blueRCount];
        blueRocks[idx] = lastPieceSquare;
        updateInfluence(blueRInfluence, blueRocks, blueRCount);
      }
      else if (toPiece === 2) {
        const idx = bluePapers.indexOf(to);
        const lastPieceSquare = bluePapers[--bluePCount];
        bluePapers[idx] = lastPieceSquare;
        updateInfluence(bluePInfluence, bluePapers, bluePCount);
      }
      else {
        const idx = blueScissors.indexOf(to);
        const lastPieceSquare = blueScissors[--blueSCount];
        blueScissors[idx] = lastPieceSquare;
        updateInfluence(blueSInfluence, blueScissors, blueSCount);
      }
  }
  else if (toPiece < 0) {
      redPiecesCount--;
      if (toPiece === -1) {
        const idx = redRocks.indexOf(to);
        const lastPieceSquare = redRocks[--redRCount];
        redRocks[idx] = lastPieceSquare;
        updateInfluence(redRInfluence, redRocks, redRCount);
      }
      else if (toPiece === -2) {
        const idx = redPapers.indexOf(to);
        const lastPieceSquare = redPapers[--redPCount];
        redPapers[idx] = lastPieceSquare;
        updateInfluence(redPInfluence, redPapers, redPCount);
      }
      else {
        const idx = redScissors.indexOf(to);
        const lastPieceSquare = redScissors[--redSCount];
        redScissors[idx] = lastPieceSquare;
        updateInfluence(redSInfluence, redScissors, redSCount);
      }
  }

  if (fromPiece === 1) {
        const idx = blueRocks.indexOf(from);
        blueRocks[idx] = to;
        updateInfluence(blueRInfluence, blueRocks, blueRCount);
  }
  else if (fromPiece === 2) {
    const idx = bluePapers.indexOf(from);
    bluePapers[idx] = to;
    updateInfluence(bluePInfluence, bluePapers, bluePCount);
  }
  else if (fromPiece === 3) {
    const idx = blueScissors.indexOf(from);
    blueScissors[idx] = to;
    updateInfluence(blueSInfluence, blueScissors, blueSCount);
  }
  else if (fromPiece === -1) {
        const idx = redRocks.indexOf(from);
        redRocks[idx] = to;
        updateInfluence(redRInfluence, redRocks, redRCount);
  }
  else if (fromPiece === -2) {
    const idx = redPapers.indexOf(from);
    redPapers[idx] = to;
    updateInfluence(redPInfluence, redPapers, redPCount);
  }
  else {
    const idx = redScissors.indexOf(from);
    redScissors[idx] = to;
    updateInfluence(redSInfluence, redScissors, redSCount);
  }

  hash ^= zobristTurn;
  turn = !turn;
}

function UndoHash(from, to) {
  movePtr--;
  const fromPiece = memFromPiece[movePtr];
  const toPiece = memToPiece[movePtr];
  const lastHash = memHash[movePtr];

  if (toPiece > 0) {
    bluePiecesCount++;
    if (toPiece === 1) {blueRocks[blueRCount++] = to; updateInfluence(blueRInfluence, blueRocks, blueRCount);}
    else if (toPiece === 2) {bluePapers[bluePCount++] = to; updateInfluence(bluePInfluence, bluePapers, bluePCount);}
    else {blueScissors[blueSCount++] = to;  updateInfluence(blueSInfluence, blueScissors, blueSCount);}
    
  }
  else if (toPiece < 0) {
    redPiecesCount++; 
    if (toPiece === -1) {redRocks[redRCount++] = to; updateInfluence(redRInfluence, redRocks, redRCount);}
    else if (toPiece === -2) {redPapers[redPCount++] = to; updateInfluence(redPInfluence, redPapers, redPCount);}
    else {redScissors[redSCount++] = to;  updateInfluence(redSInfluence, redScissors, redSCount);}
  }

  if (fromPiece === 1) {
        const idx = blueRocks.indexOf(to);
        blueRocks[idx] = from;
  }
  else if (fromPiece === 2) {
    const idx = bluePapers.indexOf(to);
    bluePapers[idx] = from;
  }
  else if (fromPiece === 3) {
    const idx = blueScissors.indexOf(to);
    blueScissors[idx] = from;
  }
  else if (fromPiece === -1) {
        const idx = redRocks.indexOf(to);
        redRocks[idx] = from;
  }
  else if (fromPiece === -2) {
    const idx = redPapers.indexOf(to);
    redPapers[idx] = from;
  }
  else {
    const idx = redScissors.indexOf(to);
    redScissors[idx] = from;
  }

  pieces[to] = toPiece;
  pieces[from] = fromPiece;
  turn = !turn;
  hash = lastHash;
}

export function getBoard() {
    return {
        pieces: pieces,
        turn: turn
    }
}
export function playRandomMoves(board, n) {
    initState(board);
    movePtr = 0;
    for (let i = 0; i < n; i++) {
        const moveCount = getMoves(memMoves[movePtr]);
        if (moveCount === 0) break;
        const moveIdx = Math.floor(Math.random() * moveCount);
        const move = memMoves[movePtr][moveIdx];
        const from = move >> 8;
        const to = move & 0xFF;
        playHash(from, to);
    }
    return getBoard();
}

function dist(idx1, idx2) {
  return Math.max(Math.abs((idx1 % 9) - (idx2 % 9)), Math.abs(Math.floor(idx1/9) - Math.floor(idx2/9)));
}

const DIST_TABLE = new Uint8Array(81 * 81);
for (let i = 0; i < 81; i++) {
  for (let j = 0; j < 81; j++) {
    DIST_TABLE[81 * i + j] = dist(i, j);
  }
}

const SQUAREVALUE = new Uint8Array(81);
for (let i = 0; i < 81; i++) {
  SQUAREVALUE[i] = 10 - DIST_TABLE[81 * i + 8];
}

const soloValue = [0, 8, 12, 14, 16]

function getMatchupAdvantage(bR, bP, bS, rR, rP, rS) {
  if (bR === rR && bP === rP && bS === rS) return 0;
  let score = 0;

  if (rP === 0) score += soloValue[bR];
  else score += bR/rP;

  if (rS === 0) score += soloValue[bP];
  else score += bP/rS;

  if (rR === 0) score += soloValue[bS];
  else score += bS/rR;

  if (bP === 0) score += soloValue[rR];
  else score -= rR/bP;

  if (bS === 0) score += soloValue[rP];
  else score -= rP/bS;

  if (bR === 0) score += soloValue[rS];
  else score -= rS/bR;
  return score * 100
}

function piecesProximityEncien(blueAtkFactor=2, redAtkFactor=2) {
  let blueAtkSum = 0, blueAtkCount = 0;
  let blueDefSum = 0, blueDefCount = 0;

  let redAtkSum = 0, redAtkCount = 0;
  let redDefSum = 0, redDefCount = 0;

  // ================= BLUE =================
  
  // Blue Rocks
  for (let i = 0; i < blueRCount; i++) {
    const sq = blueRocks[i] * 81;
    
    if (redSCount > 0) {
      let minAtk = 10;
      for (let j = 0; j < redSCount; j++) {
        const d = DIST_TABLE[sq + redScissors[j]];
        if (d < minAtk) minAtk = d;
      }
      blueAtkSum += 10 - minAtk;
      blueAtkCount++;
    }

    if (blueSCount > 0) {
      let minDef = 10;
      for (let j = 0; j < blueSCount; j++) {
        const d = DIST_TABLE[sq + blueScissors[j]];
        if (d < minDef) minDef = d;
      }
      blueDefSum += 10 - minDef;
      blueDefCount++;
    }
  }

  // Blue Papers
  for (let i = 0; i < bluePCount; i++) {
    const sq = bluePapers[i] * 81;

    if (redRCount > 0) {
      let minAtk = 10;
      for (let j = 0; j < redRCount; j++) {
        const d = DIST_TABLE[sq + redRocks[j]];
        if (d < minAtk) minAtk = d;
      }
      blueAtkSum += 10 - minAtk;
      blueAtkCount++;
    }

    if (blueRCount > 0) {
      let minDef = 10;
      for (let j = 0; j < blueRCount; j++) {
        const d = DIST_TABLE[sq + blueRocks[j]];
        if (d < minDef) minDef = d;
      }
      blueDefSum += 10 - minDef;
      blueDefCount++;
    }
  }

  // Blue Scissors
  for (let i = 0; i < blueSCount; i++) {
    const sq = blueScissors[i] * 81;

    if (redPCount > 0) {
      let minAtk = 10;
      for (let j = 0; j < redPCount; j++) {
        const d = DIST_TABLE[sq + redPapers[j]];
        if (d < minAtk) minAtk = d;
      }
      blueAtkSum += 10 - minAtk;
      blueAtkCount++;
    }

    if (bluePCount > 0) {
      let minDef = 10;
      for (let j = 0; j < bluePCount; j++) {
        const d = DIST_TABLE[sq + bluePapers[j]];
        if (d < minDef) minDef = d;
      }
      blueDefSum += 10 - minDef;
      blueDefCount++;
    }
  }

  // ================= RED =================

  // Red Rocks
  for (let i = 0; i < redRCount; i++) {
    const sq = redRocks[i] * 81;

    if (blueSCount > 0) {
      let minAtk = 10;
      for (let j = 0; j < blueSCount; j++) {
        const d = DIST_TABLE[sq + blueScissors[j]];
        if (d < minAtk) minAtk = d;
      }
      redAtkSum += 10 - minAtk;
      redAtkCount++;
    }

    if (redSCount > 0) {
      let minDef = 10;
      for (let j = 0; j < redSCount; j++) {
        const d = DIST_TABLE[sq + redScissors[j]];
        if (d < minDef) minDef = d;
      }
      redDefSum += 10 - minDef;
      redDefCount++;
    }
  }

  // Red Papers
  for (let i = 0; i < redPCount; i++) {
    const sq = redPapers[i] * 81;

    if (blueRCount > 0) {
      let minAtk = 10;
      for (let j = 0; j < blueRCount; j++) {
        const d = DIST_TABLE[sq + blueRocks[j]];
        if (d < minAtk) minAtk = d;
      }
      redAtkSum += 10 - minAtk;
      redAtkCount++;
    }

    if (redRCount > 0) {
      let minDef = 10;
      for (let j = 0; j < redRCount; j++) {
        const d = DIST_TABLE[sq + redRocks[j]];
        if (d < minDef) minDef = d;
      }
      redDefSum += 10 - minDef;
      redDefCount++;
    }
  }

  // Red Scissors
  for (let i = 0; i < redSCount; i++) {
    const sq = redScissors[i] * 81;

    if (bluePCount > 0) {
      let minAtk = 10;
      for (let j = 0; j < bluePCount; j++) {
        const d = DIST_TABLE[sq + bluePapers[j]];
        if (d < minAtk) minAtk = d;
      }
      redAtkSum += 10 - minAtk;
      redAtkCount++;
    }

    if (redPCount > 0) {
      let minDef = 10;
      for (let j = 0; j < redPCount; j++) {
        const d = DIST_TABLE[sq + redPapers[j]];
        if (d < minDef) minDef = d;
      }
      redDefSum += 10 - minDef;
      redDefCount++;
    }
  }

  const blueAvgAtk = blueAtkCount > 0 ? (blueAtkSum / blueAtkCount) : 0;
  const blueAvgDef = blueDefCount > 0 ? (blueDefSum / blueDefCount) : 0;

  const redAvgAtk  = redAtkCount > 0  ? (redAtkSum / redAtkCount)   : 0;
  const redAvgDef  = redDefCount > 0  ? (redDefSum / redDefCount)   : 0;

  const blueScore = (blueAvgAtk * 2 * blueAtkFactor + blueAvgDef)/(blueAtkFactor + 1);
  const redScore  = (redAvgAtk * 2 * redAtkFactor  + redAvgDef)/(redAtkFactor + 1);

  return blueScore - redScore;
}

function goalProximityEncien() {
  let blueSum = 0, blueCount = 0;
  let redSum = 0, redCount = 0;
  let min = 10;
  if (blueRCount > 0) {
    blueCount++;
    for (let i = 0; i < blueRCount; i++) {
      const d = DIST_TABLE[blueRocks[i] * 81 + 8];
      if (d < min) min = d;
      blueSum += d;
    }
    blueSum += min * 10;
  }

  min = 10;
  if (bluePCount > 0) {
    blueCount++;
    for (let i = 0; i < bluePCount; i++) {
      const d = DIST_TABLE[bluePapers[i] * 81 + 8];
      if (d < min) min = d;
      blueSum += d;
    }
    blueSum += min * 10;
  }

  min = 10;
  if (blueSCount > 0) {
    blueCount++;
    for (let i = 0; i < blueSCount; i++) {
      const d = DIST_TABLE[blueScissors[i] * 81 + 8];
      if (d < min) min = d;
      blueSum += d;
    }
    blueSum += min * 10;
  }

  min = 10;
  if (redRCount > 0) {
    redCount++;
    for (let i = 0; i < redRCount; i++) {
      const d = DIST_TABLE[redRocks[i] * 81 + 72];
      if (d < min) min = d;
      redSum += d;
    }
    redSum += min * 10;
  }

  min = 10;
  if (redPCount > 0) {
    redCount++;
    for (let i = 0; i < redPCount; i++) {
      const d = DIST_TABLE[redPapers[i] * 81 + 72];
      if (d < min) min = d;
      redSum += d;
    }
    redSum += min * 10;
  }

  min = 10;
  if (redSCount > 0) {
    redCount++;
    for (let i = 0; i < redSCount; i++) {
      const d = DIST_TABLE[redScissors[i] * 81 + 72];
      if (d < min) min = d;
      redSum += d;
    }
    redSum += min * 10;
  }
  return (redSum / redCount) - (blueSum / blueCount);
}

function goalProximity() {
    let score = 0;
    score -= blueRInfluence[8] - redPInfluence[8];
    score -= bluePInfluence[8] - redSInfluence[8];
    score -= blueSInfluence[8] - redRInfluence[8];

    score += redRInfluence[72] - bluePInfluence[72];
    score += redPInfluence[72] - blueSInfluence[72];
    score += redSInfluence[72] - blueRInfluence[72];
    return score;
}

function piecesProximity(atkB, atkR) {
    let score = 0;
    for (let i = 0; i < blueRCount; i++) {
        score += redPInfluence[blueRocks[i]];
    }

    for (let i = 0; i < bluePCount; i++) {
        score += redSInfluence[bluePapers[i]];
    }

    for (let i = 0; i < blueSCount; i++) {
        score += redRInfluence[blueScissors[i]];
    }


    for (let i = 0; i < redRCount; i++) {
        score -= bluePInfluence[redRocks[i]];
    }

    for (let i = 0; i < redPCount; i++) {
        score -= blueSInfluence[redPapers[i]];
    }

    for (let i = 0; i < redSCount; i++) {
        score -= blueRInfluence[redScissors[i]];
    }
    return score;
}

function evaluation() {
  return getMatchupAdvantage(blueRCount, bluePCount, blueSCount, redRCount, redPCount, redSCount) + piecesProximity() + goalProximity() * 15;
}


let memory = new Map();
let nodeCount = 0;
let timeLimit = 0;
let startTime = 0;

function minimaxMemory(depth, evalFunction, alpha = -Infinity, beta = Infinity) {
  if (depth <= 0) {
    if (memToPiece[movePtr-1] === 0) {
      nodeCount++;
      if ((nodeCount & 2047) === 0) {
        if (memory.size > 16770000) memory.clear();
        if (Date.now() - startTime > timeLimit) throw new Error("Timeout");
      }
      return evalFunction();
    }
  }
  if (isGameOverOpt()) {
    nodeCount++;
    if ((nodeCount & 2047) === 0) {
      if (Date.now() - startTime > timeLimit) throw new Error("Timeout");
    }
    return winner() ? 9999999 + depth : -9999999 - depth;
  }
  const boardMemory = memory.get(hash)
  let lastBestMove = null;
  if (boardMemory) {
    if (boardMemory.depth >= depth) {
      if (boardMemory.flag === "EXACT") return boardMemory.eval;
      if (boardMemory.flag === "LOWER" && boardMemory.eval >= beta) return boardMemory.eval;
      if (boardMemory.flag === "UPPER" && boardMemory.eval <= alpha) return boardMemory.eval;
    }
  lastBestMove = boardMemory.move;
  }
  let flag = "EXACT";
  const originAlpha = alpha;
  const originBeta = beta;

  if (turn) {
    let bestMove = null;
    let bestEval = -Infinity;
    const moves = memMoves[movePtr];
    const movesCount = getMovesOrdered(moves, lastBestMove);
    if (movesCount === 0) return turn ? -9999999 - depth : 9999999 + depth;
    for (let i = movesCount-1; i >= 0; i--) {
      const move = moves[i] & 0xFFFF;
      const from = move >> 8;
      const to = move & 255;
      playHash(from, to);
      let moveEval;
      if (i === movesCount-1) {
        moveEval = minimaxMemory(depth-1, evalFunction, alpha, beta);
      } else {
        moveEval = minimaxMemory(depth-1, evalFunction, alpha, alpha + 1);
      }
      if (moveEval > alpha && moveEval < beta) {
          moveEval = minimaxMemory(depth - 1, evalFunction, moveEval, beta);
      }
      UndoHash(from, to);
      if (moveEval > bestEval) {
        bestEval = moveEval;
        bestMove = move;
        if (bestEval > alpha) {
          alpha = bestEval;
        }
        if (beta <= alpha) {
          flag = "LOWER";
          break;
        }
      }
    }
    if (flag !== "LOWER" && bestEval <= originAlpha) {
      flag = "UPPER";
    }
    if (boardMemory) {
      boardMemory.eval = bestEval;
      boardMemory.move = bestMove;
      boardMemory.depth = depth;
      boardMemory.flag = flag;
    } else {
      memory.set(hash, {
        eval: bestEval,
        flag,
        move: bestMove,
        depth
      })
  }
    return bestEval;
  } else {
    let bestMove = null;
    let bestEval = Infinity;
    const moves = memMoves[movePtr];
    const movesCount = getMovesOrdered(moves, lastBestMove);
    if (movesCount === 0) return turn ? -9999999 - depth : 9999999 + depth;
    for (let i = movesCount-1; i >= 0; i--) {
      const move = moves[i] & 0xFFFF;
      const from = move >> 8;
      const to = move & 255; 
      playHash(from, to);
      let moveEval;
      if (i === movesCount-1) {
        moveEval = minimaxMemory(depth-1, evalFunction, alpha, beta);
      } else {
        moveEval = minimaxMemory(depth-1, evalFunction, beta - 1, beta);
      }
      if (moveEval < beta && moveEval > alpha) {
          moveEval = minimaxMemory(depth - 1, evalFunction, alpha, moveEval);
      }
      UndoHash(from, to);
      if (moveEval < bestEval) {
        bestEval = moveEval;
        bestMove = move;
        if (bestEval < beta) {
          beta = bestEval;
        }
        if (beta <= alpha) {
          flag = "UPPER"
          break;
        }
      }
    }
    if (flag !== "UPPER" && bestEval >= originBeta) {
      flag = "LOWER";
    }
    if (boardMemory) {
      boardMemory.eval = bestEval;
      boardMemory.move = bestMove;
      boardMemory.depth = depth;
      boardMemory.flag = flag;
    } else {
      memory.set(hash, {
        eval: bestEval,
        flag,
        move: bestMove,
        depth
      })
  }
  return bestEval;
  }  
}

function getMinimax(depth, evalFunction, lastBestMove, alpha = -Infinity, beta = Infinity) {
  if (turn) {
    let bestMove = null;
    let bestEval = -Infinity;
    const moves = memMoves[movePtr];
    const movesCount = getMovesOrdered(moves, lastBestMove);
    for (let i = movesCount-1; i >= 0; i--) {
      const move = moves[i] & 0xFFFF;
      const from = move >> 8;
      const to = move & 255;
      playHash(from, to);

      let moveEval;
      if (i === movesCount-1) {
        moveEval = minimaxMemory(depth-1, evalFunction, alpha, beta);
      } else {
        moveEval = minimaxMemory(depth-1, evalFunction, alpha, alpha+1);
      }
      if (moveEval > alpha && moveEval < beta) {
          moveEval = minimaxMemory(depth - 1, evalFunction, moveEval, beta);
      }

      UndoHash(from, to);
      if (moveEval > bestEval) {
        bestEval = moveEval;
        bestMove = move;
        alpha = Math.max(alpha, bestEval);
        if (beta <= alpha) {
          break;
        }
      }
    }
    return [bestEval, bestMove];
  } else {
    let bestMove = null;
    let bestEval = Infinity;
    const moves = memMoves[movePtr];
    const movesCount = getMovesOrdered(moves, lastBestMove);
    for (let i = movesCount-1; i >= 0; i--) {
      const move = moves[i] & 0xFFFF;
      const from = move >> 8;
      const to = move & 255; 
      playHash(from, to);
      let moveEval;
      if (i === movesCount-1) {
        moveEval = minimaxMemory(depth-1, evalFunction, alpha, beta);
      } else {
        moveEval = minimaxMemory(depth-1, evalFunction, beta - 1, beta);
      }
      if (moveEval < beta && moveEval > alpha) {
          moveEval = minimaxMemory(depth - 1, evalFunction, alpha, moveEval);
      }
      UndoHash(from, to);
      if (moveEval < bestEval) {
        bestEval = moveEval;
        bestMove = move;
        beta = Math.min(beta, bestEval);
        if (beta <= alpha) {
          break;
        }
      } 
    }
    return [bestEval, bestMove];
  }
}

function orderMoves(moves,  bestMove) {
  const idx = moves.indexOf(bestMove);
  const temp = moves[0];
  moves[0] = bestMove;
  moves[idx] = temp;
}

export function iterativeDeepening(board, maxTime, evalFunction = evaluation) {
  timeLimit = maxTime;
  startTime = Date.now();
  let bestMove = null;
  let bestEval = null;
  let reachedDepth = 0;
  initState(board);
  movePtr = 0;
  nodeCount = 0;
  try {
    for (let depth = 1; depth < 2048; depth++) {
      const [currentEval, currentMove] = getMinimax(depth, evalFunction, bestMove);
      bestEval = currentEval;
      bestMove = currentMove;
      reachedDepth = depth;
      if (bestEval >= 9999999 || bestEval <= -9999999) break;
    }
  } catch (error) {
      if (error.message !== "Timeout") throw error;
  }
  console.error(`Reached depth: ${reachedDepth}`);
  return [bestEval, bestMove];
}
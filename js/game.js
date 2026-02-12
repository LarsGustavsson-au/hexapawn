// HexaPawn — Game state, turn logic, and win detection

import {
  BOARD_SIZE, HUMAN, COMPUTER,
  HUMAN_PAWN, COMPUTER_PAWN, EMPTY,
  INITIAL_BOARD, DIRECTION,
} from './constants.js';

// ── Board State ─────────────────────────────────────────────────

export function createInitialBoard() {
  return INITIAL_BOARD.map(row => [...row]);
}

export function cloneBoard(board) {
  return board.map(row => [...row]);
}

// ── Legal Moves ─────────────────────────────────────────────────

function isInsideBoard(row, col) {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

function getPawnOwner(cell) {
  if (cell === HUMAN_PAWN) return HUMAN;
  if (cell === COMPUTER_PAWN) return COMPUTER;
  return null;
}

function getOpponent(player) {
  return player === HUMAN ? COMPUTER : HUMAN;
}

export function findLegalMovesForPiece(board, row, col, player) {
  const piece = board[row][col];
  if (getPawnOwner(piece) !== player) return [];

  const direction = DIRECTION[player];
  const forwardRow = row + direction;
  const moves = [];

  if (!isInsideBoard(forwardRow, col)) return [];

  // Forward move: one step to empty square
  if (board[forwardRow][col] === EMPTY) {
    moves.push({ toRow: forwardRow, toCol: col });
  }

  // Diagonal captures: left and right
  const opponent = getOpponent(player);
  for (const captureCol of [col - 1, col + 1]) {
    if (isInsideBoard(forwardRow, captureCol)) {
      if (getPawnOwner(board[forwardRow][captureCol]) === opponent) {
        moves.push({ toRow: forwardRow, toCol: captureCol });
      }
    }
  }

  return moves;
}

export function findAllLegalMoves(board, player) {
  const pawn = player === HUMAN ? HUMAN_PAWN : COMPUTER_PAWN;
  const allMoves = [];

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === pawn) {
        const pieceMoves = findLegalMovesForPiece(board, row, col, player);
        for (const move of pieceMoves) {
          allMoves.push({ fromRow: row, fromCol: col, ...move });
        }
      }
    }
  }

  return allMoves;
}

// ── Executing Moves ─────────────────────────────────────────────

export function executeMove(board, fromRow, fromCol, toRow, toCol) {
  const newBoard = cloneBoard(board);
  newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
  newBoard[fromRow][fromCol] = EMPTY;
  return newBoard;
}

// ── Win Detection ───────────────────────────────────────────────

function hasPawnsOnBoard(board, player) {
  const pawn = player === HUMAN ? HUMAN_PAWN : COMPUTER_PAWN;
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === pawn) return true;
    }
  }
  return false;
}

function hasPawnOnOppositeEnd(board, player) {
  const pawn = player === HUMAN ? HUMAN_PAWN : COMPUTER_PAWN;
  const goalRow = player === HUMAN ? 0 : BOARD_SIZE - 1;

  for (let col = 0; col < BOARD_SIZE; col++) {
    if (board[goalRow][col] === pawn) return true;
  }
  return false;
}

export function checkForWinner(board, currentPlayer = null) {
  // Win condition 1: A pawn reaches the opposite end
  if (hasPawnOnOppositeEnd(board, HUMAN)) return HUMAN;
  if (hasPawnOnOppositeEnd(board, COMPUTER)) return COMPUTER;

  // Win condition 2: All opponent's pieces are captured
  if (!hasPawnsOnBoard(board, HUMAN)) return COMPUTER;
  if (!hasPawnsOnBoard(board, COMPUTER)) return HUMAN;

  // Win condition 3: The current player has no legal moves
  if (currentPlayer !== null) {
    const legalMoves = findAllLegalMoves(board, currentPlayer);
    if (legalMoves.length === 0) {
      return getOpponent(currentPlayer);
    }
  }

  return null;
}

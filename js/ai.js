// HexaPawn — Matchbox learning AI

import {
  COMPUTER, AI_INITIAL_WEIGHT, AI_MIN_WEIGHT, AI_MAX_WEIGHT,
  AI_REWARD_AMOUNT, AI_PENALTY_AMOUNT, AI_MOVES_TO_LEARN,
} from './constants.js';
import { findAllLegalMoves } from './game.js';

// ── Board Serialization ─────────────────────────────────────────

function serializeBoard(board) {
  return board.map(row => row.map(cell => cell ?? '.').join(',')).join('|');
}

function serializeMove(move) {
  return `${move.fromRow},${move.fromCol}->${move.toRow},${move.toCol}`;
}

// ── Matchbox AI Factory ─────────────────────────────────────────

export function createMatchboxAI() {
  // Memory: maps serialized board state -> { moveKey: weight }
  const memory = {};

  function ensureBoardInMemory(board) {
    const boardKey = serializeBoard(board);
    if (memory[boardKey]) return boardKey;

    const legalMoves = findAllLegalMoves(board, COMPUTER);
    const weights = {};
    for (const move of legalMoves) {
      weights[serializeMove(move)] = AI_INITIAL_WEIGHT;
    }
    memory[boardKey] = weights;
    return boardKey;
  }

  function selectMove(board) {
    const legalMoves = findAllLegalMoves(board, COMPUTER);
    if (legalMoves.length === 0) return null;

    const boardKey = ensureBoardInMemory(board);
    const weights = memory[boardKey];

    // Weighted random selection
    const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
    let random = Math.random() * totalWeight;

    for (const move of legalMoves) {
      const moveKey = serializeMove(move);
      const weight = weights[moveKey] ?? AI_INITIAL_WEIGHT;
      random -= weight;
      if (random <= 0) return move;
    }

    // Fallback (shouldn't normally reach here)
    return legalMoves[legalMoves.length - 1];
  }

  function learnFromGame(moveHistory, didWin) {
    // Only learn from the last N moves
    const movesToLearn = moveHistory.slice(-AI_MOVES_TO_LEARN);
    const adjustment = didWin ? AI_REWARD_AMOUNT : -AI_PENALTY_AMOUNT;

    for (const { board, move } of movesToLearn) {
      const boardKey = ensureBoardInMemory(board);
      const moveKey = serializeMove(move);
      const weights = memory[boardKey];

      if (weights[moveKey] !== undefined) {
        weights[moveKey] = Math.max(
          AI_MIN_WEIGHT,
          Math.min(AI_MAX_WEIGHT, weights[moveKey] + adjustment)
        );
      }
    }
  }

  function getWeightsForBoard(board) {
    const boardKey = ensureBoardInMemory(board);
    return { ...memory[boardKey] };
  }

  return { selectMove, learnFromGame, getWeightsForBoard };
}

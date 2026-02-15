// HexaPawn — Matchbox learning AI

import {
  COMPUTER, AI_INITIAL_WEIGHT, AI_MIN_WEIGHT, AI_MAX_WEIGHT,
  AI_REWARD_AMOUNT, AI_PENALTY_AMOUNT,
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

    // If all moves have been eliminated (weight 0), pick randomly from legal moves
    if (totalWeight === 0) {
      return legalMoves[Math.floor(Math.random() * legalMoves.length)];
    }

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
    if (didWin) {
      // Reward all moves that contributed to the win
      for (const { board, move } of moveHistory) {
        const boardKey = ensureBoardInMemory(board);
        const moveKey = serializeMove(move);
        const weights = memory[boardKey];

        if (weights[moveKey] !== undefined) {
          weights[moveKey] = Math.min(AI_MAX_WEIGHT, weights[moveKey] + AI_REWARD_AMOUNT);
        }
      }
    } else {
      // Penalize only the last move — the one that directly led to the loss
      if (moveHistory.length > 0) {
        const { board, move } = moveHistory[moveHistory.length - 1];
        const boardKey = ensureBoardInMemory(board);
        const moveKey = serializeMove(move);
        const weights = memory[boardKey];

        if (weights[moveKey] !== undefined) {
          weights[moveKey] = Math.max(AI_MIN_WEIGHT, weights[moveKey] - AI_PENALTY_AMOUNT);
        }
      }
    }
  }

  function getWeightsForBoard(board) {
    const boardKey = ensureBoardInMemory(board);
    return { ...memory[boardKey] };
  }

  function getMemory() {
    return memory;
  }

  return { selectMove, learnFromGame, getWeightsForBoard, getMemory };
}

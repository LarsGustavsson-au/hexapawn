// HexaPawn — Entry point, game controller

import { HUMAN, COMPUTER, AI_INITIAL_WEIGHT } from './constants.js';
import { createInitialBoard, findAllLegalMoves, executeMove, checkForWinner, getWinReason } from './game.js';
import { renderBoard, setupBoardClickHandlers } from './board.js';
import { createMatchboxAI } from './ai.js';
import {
  showStartScreen, showGameOverScreen,
  showStatusMessage, showPlayAgainButton, renderStats,
} from './ui.js';

// ── State ───────────────────────────────────────────────────────

const app = document.getElementById('app');
const ai = createMatchboxAI();

let board = null;
let currentPlayer = null;
let isGameActive = false;
let computerMoveHistory = [];  // { board, move } entries for AI learning
let gameMoveLog = [];          // Full game move log: { player, move }

let firstPlayer = null;        // Who went first this game (for alternating)
let isFirstGame = true;
let lastQuip = null;           // Avoid repeating the same quip twice

const stats = {
  gamesPlayed: 0,
  humanWins: 0,
  computerWins: 0,
};

// ── Quips ───────────────────────────────────────────────────────

const QUIP_POOLS = {
  // Computer wins with a well-known move (high weight)
  confident: [
    'Got you \u2014 again!',
    'Are you getting tired?',
    'Just be happy we didn\'t play about money!',
  ],
  // Computer wins with a new/untested move (low/initial weight)
  surprised: [
    'Ha! I will try that again',
    'You\'re not so smart after all!',
    'OK. Now I\'m on to something!',
  ],
  // Computer loses to a move it's seen before (already penalized)
  frustrated: [
    'Bummer!',
    'Flaming Galah! Not again',
    'I see what you did there!',
  ],
  // Computer loses to something new (first time encountering this)
  curious: [
    'Interesting\u2026',
    'Pure luck',
    'I\'ll avoid that next time',
  ],
};

function pickQuip(pool) {
  const quips = QUIP_POOLS[pool];
  if (!quips || quips.length === 0) return null;

  // Avoid repeating the same quip twice in a row
  const available = quips.length > 1
    ? quips.filter(q => q !== lastQuip)
    : quips;

  const picked = available[Math.floor(Math.random() * available.length)];
  lastQuip = picked;
  return picked;
}

function selectQuip(winner, computerMoves) {
  if (winner === COMPUTER) {
    // Check weight BEFORE this game's reward — was this a known winning path?
    const lastMove = computerMoves[computerMoves.length - 1];
    if (lastMove) {
      const weights = ai.getWeightsForBoard(lastMove.board);
      const moveKey = `${lastMove.move.fromRow},${lastMove.move.fromCol}->${lastMove.move.toRow},${lastMove.move.toCol}`;
      const weight = weights[moveKey] ?? AI_INITIAL_WEIGHT;

      // Weight above initial means this move was rewarded in a previous game
      if (weight > AI_INITIAL_WEIGHT) {
        return pickQuip('confident');
      }
      return pickQuip('surprised');
    }
    return pickQuip('surprised');
  }

  // Computer lost — check weight BEFORE this game's penalty
  if (computerMoves.length > 0) {
    const lastMove = computerMoves[computerMoves.length - 1];
    const weights = ai.getWeightsForBoard(lastMove.board);
    const moveKey = `${lastMove.move.fromRow},${lastMove.move.fromCol}->${lastMove.move.toRow},${lastMove.move.toCol}`;
    const weight = weights[moveKey] ?? AI_INITIAL_WEIGHT;

    // Weight below initial means this move was already penalized in a previous game
    if (weight < AI_INITIAL_WEIGHT) {
      return pickQuip('frustrated');
    }
    return pickQuip('curious');
  }

  return pickQuip('curious');
}

// ── Game Flow ───────────────────────────────────────────────────

function startGame(whoGoesFirst) {
  board = createInitialBoard();
  currentPlayer = whoGoesFirst;
  firstPlayer = whoGoesFirst;
  isGameActive = true;
  computerMoveHistory = [];
  gameMoveLog = [];

  renderGameView();

  if (currentPlayer === COMPUTER) {
    doComputerTurn();
  } else {
    showStatusMessage(app, 'Your move');
  }
}

function renderGameView() {
  // Clear everything and re-render board + stats
  app.innerHTML = '';

  // Title
  const title = document.createElement('h1');
  title.className = 'text-2xl font-bold text-zinc-800 mb-4';
  title.textContent = 'HexaPawn';
  app.appendChild(title);

  renderBoard(app, board, HUMAN);
  setupBoardClickHandlers(app, board, HUMAN, onHumanMove);
  showStatusMessage(app, currentPlayer === HUMAN ? 'Your move' : 'Computer is thinking...');
  renderStats(app, stats);
}

function onHumanMove(move) {
  if (!isGameActive || currentPlayer !== HUMAN) return;

  gameMoveLog.push({ player: HUMAN, move });
  board = executeMove(board, move.fromRow, move.fromCol, move.toRow, move.toCol);

  const winner = checkForWinner(board, COMPUTER);
  if (winner) {
    endGame(winner, COMPUTER);
    return;
  }

  currentPlayer = COMPUTER;
  renderGameView();
  doComputerTurn();
}

function doComputerTurn() {
  if (!isGameActive) return;

  showStatusMessage(app, 'Computer is thinking...');

  // Brief delay so it doesn't feel instant
  setTimeout(() => {
    if (!isGameActive) return;

    const boardBeforeMove = board.map(row => [...row]);
    const move = ai.selectMove(board);

    if (!move) {
      // No legal moves — human wins
      endGame(HUMAN, COMPUTER);
      return;
    }

    computerMoveHistory.push({ board: boardBeforeMove, move });
    gameMoveLog.push({ player: COMPUTER, move });
    board = executeMove(board, move.fromRow, move.fromCol, move.toRow, move.toCol);

    const winner = checkForWinner(board, HUMAN);
    if (winner) {
      endGame(winner, HUMAN);
      return;
    }

    currentPlayer = HUMAN;
    renderGameView();
  }, 600);
}

function describeWinReason(reason, winner) {
  const loser = winner === HUMAN ? 'Computer' : 'You';
  const winnerLabel = winner === HUMAN ? 'Your' : "Computer's";

  if (reason === 'promotion') return `${winnerLabel} pawn reached the far side.`;
  if (reason === 'capture') return `All of ${loser.toLowerCase() === 'you' ? 'your' : "computer's"} pawns were captured.`;
  if (reason === 'no_moves') return `${loser} had no legal moves.`;
  return '';
}

function endGame(winner, nextPlayer) {
  isGameActive = false;

  // Select quip BEFORE learning — so weights reflect prior experience, not this game's result
  const quip = selectQuip(winner, computerMoveHistory);

  // AI learns from this game
  const computerWon = winner === COMPUTER;
  ai.learnFromGame(computerMoveHistory, computerWon);

  // Update stats
  stats.gamesPlayed++;
  if (winner === HUMAN) stats.humanWins++;
  if (winner === COMPUTER) stats.computerWins++;

  // Determine why the game ended
  const reason = getWinReason(board, nextPlayer);
  const reasonText = describeWinReason(reason, winner);

  // Render final board state so player can see the outcome
  renderGameView();

  // Brief pause so the player can see the final board before the modal
  const message = winner === HUMAN ? 'You win!' : 'Computer wins';
  setTimeout(() => {
    showGameOverScreen(app, message, reasonText, quip, onPlayAgain, () => {
      showPlayAgainButton(app, onPlayAgain);
    });
  }, 600);
}

function onPlayAgain() {
  // Alternate who goes first
  const nextFirst = firstPlayer === HUMAN ? COMPUTER : HUMAN;
  isFirstGame = false;
  startGame(nextFirst);
}

// ── Init ────────────────────────────────────────────────────────

function init() {
  renderStats(app, stats);
  showStartScreen(app, (choice) => {
    startGame(choice === 'human' ? HUMAN : COMPUTER);
  });
}

init();

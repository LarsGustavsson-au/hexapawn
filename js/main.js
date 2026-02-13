// HexaPawn — Entry point, game controller

import { HUMAN, COMPUTER } from './constants.js';
import { createInitialBoard, findAllLegalMoves, executeMove, checkForWinner, getWinReason } from './game.js';
import { renderBoard, setupBoardClickHandlers } from './board.js';
import { createMatchboxAI } from './ai.js';
import {
  showStartScreen, showGameOverScreen,
  showStatusMessage, renderStats,
} from './ui.js';

// ── State ───────────────────────────────────────────────────────

const app = document.getElementById('app');
const ai = createMatchboxAI();

let board = null;
let currentPlayer = null;
let isGameActive = false;
let computerMoveHistory = [];  // { board, move } entries for AI learning

let firstPlayer = null;        // Who went first this game (for alternating)
let isFirstGame = true;

const stats = {
  gamesPlayed: 0,
  humanWins: 0,
  computerWins: 0,
};

// ── Game Flow ───────────────────────────────────────────────────

function startGame(whoGoesFirst) {
  board = createInitialBoard();
  currentPlayer = whoGoesFirst;
  firstPlayer = whoGoesFirst;
  isGameActive = true;
  computerMoveHistory = [];

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
    showGameOverScreen(app, message, reasonText, onPlayAgain);
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

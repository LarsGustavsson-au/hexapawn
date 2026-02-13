// HexaPawn — Entry point (Phase 2 preview: board rendering + click interaction)

import { HUMAN } from './constants.js';
import { createInitialBoard, findAllLegalMoves, executeMove, checkForWinner } from './game.js';
import { renderBoard, setupBoardClickHandlers } from './board.js';

const app = document.getElementById('app');
let board = createInitialBoard();
const perspective = HUMAN;

function render() {
  renderBoard(app, board, perspective);
  setupBoardClickHandlers(app, board, HUMAN, onMoveSelected);
}

function onMoveSelected(move) {
  board = executeMove(board, move.fromRow, move.fromCol, move.toRow, move.toCol);
  render();
}

render();

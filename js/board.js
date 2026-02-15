// HexaPawn — Board rendering and click handling

import {
  BOARD_SIZE, HUMAN, COMPUTER,
  HUMAN_PAWN, COMPUTER_PAWN, EMPTY,
} from './constants.js';
import { findLegalMovesForPiece } from './game.js';

// ── SVG Paths ───────────────────────────────────────────────────

const PAWN_SVG = {
  [HUMAN_PAWN]:    'assets/pieces/pawn-light.svg',
  [COMPUTER_PAWN]: 'assets/pieces/pawn-dark.svg',
};

// ── Board Rotation ──────────────────────────────────────────────

// Maps data row/col to visual row/col based on whose perspective we're showing.
// Player's pieces always appear at the bottom of the board.

function toVisualRow(dataRow, perspective) {
  // HUMAN perspective: data row 2 (human home) → visual row 2 (bottom).
  // Data is already stored with computer at row 0, human at row 2.
  // So for HUMAN, no flip needed (visual = data).
  // For COMPUTER, flip: visual row = (BOARD_SIZE - 1) - data row.
  if (perspective === HUMAN) return dataRow;
  return (BOARD_SIZE - 1) - dataRow;
}

function toVisualCol(dataCol, perspective) {
  if (perspective === HUMAN) return dataCol;
  return (BOARD_SIZE - 1) - dataCol;
}

function toDataRow(visualRow, perspective) {
  if (perspective === HUMAN) return visualRow;
  return (BOARD_SIZE - 1) - visualRow;
}

function toDataCol(visualCol, perspective) {
  if (perspective === HUMAN) return visualCol;
  return (BOARD_SIZE - 1) - visualCol;
}

// ── Rendering ───────────────────────────────────────────────────

function isLightSquare(visualRow, visualCol) {
  return (visualRow + visualCol) % 2 === 0;
}

function createSquareElement(dataRow, dataCol, visualRow, visualCol, cell) {
  const square = document.createElement('div');
  square.dataset.square = '';
  square.dataset.row = dataRow;
  square.dataset.col = dataCol;
  square.classList.add('board-square');
  square.classList.add(isLightSquare(visualRow, visualCol) ? 'square-light' : 'square-dark');

  if (cell !== EMPTY && PAWN_SVG[cell]) {
    const img = document.createElement('img');
    img.src = PAWN_SVG[cell];
    img.alt = cell === HUMAN_PAWN ? 'Your pawn' : 'Computer pawn';
    img.dataset.piece = cell;
    img.classList.add('board-piece');
    img.draggable = false;
    square.appendChild(img);
  }

  return square;
}

// ── Coordinate Labels ────────────────────────────────────────────

const COL_LABELS = ['a', 'b', 'c'];

function visualRowToLabel(visualRow) {
  // Row 1 at the bottom (player's side), row 3 at the top
  return String(BOARD_SIZE - visualRow);
}

function visualColToLabel(visualCol) {
  return COL_LABELS[visualCol];
}

/**
 * Convert a data-coordinate move to a human-readable string like "b1-b2".
 * Perspective determines how data rows/cols map to visual labels.
 */
export function moveToCoord(move, perspective) {
  const fromVR = perspective === HUMAN ? move.fromRow : (BOARD_SIZE - 1) - move.fromRow;
  const fromVC = perspective === HUMAN ? move.fromCol : (BOARD_SIZE - 1) - move.fromCol;
  const toVR = perspective === HUMAN ? move.toRow : (BOARD_SIZE - 1) - move.toRow;
  const toVC = perspective === HUMAN ? move.toCol : (BOARD_SIZE - 1) - move.toCol;
  return `${visualColToLabel(fromVC)}${visualRowToLabel(fromVR)}-${visualColToLabel(toVC)}${visualRowToLabel(toVR)}`;
}

export function renderBoard(container, board, perspective) {
  // Clear existing board content
  const existingBoard = container.querySelector('.board-with-coords');
  if (existingBoard) existingBoard.remove();

  // Wrapper with coordinate labels
  const wrapper = document.createElement('div');
  wrapper.classList.add('board-with-coords');

  const grid = document.createElement('div');
  grid.classList.add('board-grid');

  for (let visualRow = 0; visualRow < BOARD_SIZE; visualRow++) {
    const rowEl = document.createElement('div');
    rowEl.classList.add('board-row');
    rowEl.dataset.visualRow = visualRow;

    for (let visualCol = 0; visualCol < BOARD_SIZE; visualCol++) {
      const dataRow = toDataRow(visualRow, perspective);
      const dataCol = toDataCol(visualCol, perspective);
      const cell = board[dataRow][dataCol];
      const square = createSquareElement(dataRow, dataCol, visualRow, visualCol, cell);
      rowEl.appendChild(square);
    }

    grid.appendChild(rowEl);
  }

  // Row labels (left side)
  const rowLabels = document.createElement('div');
  rowLabels.classList.add('board-row-labels');
  for (let visualRow = 0; visualRow < BOARD_SIZE; visualRow++) {
    const label = document.createElement('div');
    label.classList.add('board-coord-label');
    label.textContent = visualRowToLabel(visualRow);
    rowLabels.appendChild(label);
  }

  // Column labels (bottom)
  const colLabels = document.createElement('div');
  colLabels.classList.add('board-col-labels');
  // Spacer for row-label column
  const spacer = document.createElement('div');
  spacer.classList.add('board-coord-spacer');
  colLabels.appendChild(spacer);
  for (let visualCol = 0; visualCol < BOARD_SIZE; visualCol++) {
    const label = document.createElement('div');
    label.classList.add('board-coord-label-col');
    label.textContent = visualColToLabel(visualCol);
    colLabels.appendChild(label);
  }
  // Right-side spacer to balance left spacer for horizontal centering
  const colSpacerRight = document.createElement('div');
  colSpacerRight.classList.add('board-coord-spacer');
  colLabels.appendChild(colSpacerRight);

  const gridRow = document.createElement('div');
  gridRow.style.display = 'flex';
  gridRow.style.alignItems = 'flex-start';
  gridRow.appendChild(rowLabels);
  gridRow.appendChild(grid);
  // Right-side spacer to balance row labels for horizontal centering
  const gridRowSpacer = document.createElement('div');
  gridRowSpacer.classList.add('board-coord-spacer');
  gridRow.appendChild(gridRowSpacer);

  wrapper.appendChild(gridRow);
  wrapper.appendChild(colLabels);
  container.appendChild(wrapper);
}

// ── Move Animation ─────────────────────────────────────────────

/**
 * Animate a move on the existing board DOM. Returns a Promise that
 * resolves when the animation finishes and the DOM has been updated.
 *
 * @param {HTMLElement} container - The app container with the board
 * @param {object} move - { fromRow, fromCol, toRow, toCol } in data coords
 */
export function animateMove(container, move) {
  return new Promise(resolve => {
    const fromSquare = getSquareAt(container, move.fromRow, move.fromCol);
    const toSquare = getSquareAt(container, move.toRow, move.toCol);
    if (!fromSquare || !toSquare) { resolve(); return; }

    const piece = fromSquare.querySelector('.board-piece');
    if (!piece) { resolve(); return; }

    const capturedPiece = toSquare.querySelector('.board-piece');

    // Calculate pixel offset between squares
    const fromRect = fromSquare.getBoundingClientRect();
    const toRect = toSquare.getBoundingClientRect();
    const dx = toRect.left - fromRect.left;
    const dy = toRect.top - fromRect.top;

    // Start capture fade-out in parallel
    if (capturedPiece) {
      capturedPiece.classList.add('piece-captured');
    }

    // Slide the moving piece
    piece.classList.add('piece-moving');
    piece.style.transform = `translate(${dx}px, ${dy}px)`;

    piece.addEventListener('transitionend', function onEnd() {
      piece.removeEventListener('transitionend', onEnd);
      piece.classList.remove('piece-moving');
      piece.style.transform = '';

      // Move piece to destination square in the DOM
      if (capturedPiece) capturedPiece.remove();
      fromSquare.removeChild(piece);
      toSquare.appendChild(piece);

      // Update data attributes on squares
      toSquare.dataset.hasPiece = 'true';
      delete fromSquare.dataset.hasPiece;

      resolve();
    }, { once: true });
  });
}

// ── Click Handling ──────────────────────────────────────────────

function clearHighlights(container) {
  container.querySelectorAll('.square-selected').forEach(el => el.classList.remove('square-selected'));
  container.querySelectorAll('.square-legal-move').forEach(el => el.classList.remove('square-legal-move'));
}

function getSquareAt(container, dataRow, dataCol) {
  return container.querySelector(`[data-row="${dataRow}"][data-col="${dataCol}"]`);
}

function getPieceOwner(cell) {
  if (cell === HUMAN_PAWN) return HUMAN;
  if (cell === COMPUTER_PAWN) return COMPUTER;
  return null;
}

export function setupBoardClickHandlers(container, board, currentPlayer, onMoveSelected) {
  let selectedPiece = null; // { row, col }
  let legalMoves = [];      // [{ toRow, toCol }, ...]

  function handleClick(event) {
    const square = event.target.closest('[data-square]');
    if (!square) return;

    const clickedRow = parseInt(square.dataset.row, 10);
    const clickedCol = parseInt(square.dataset.col, 10);
    const clickedCell = board[clickedRow][clickedCol];

    // If a piece is selected and the click is on a legal destination → confirm move
    if (selectedPiece) {
      const isLegalDest = legalMoves.some(m => m.toRow === clickedRow && m.toCol === clickedCol);

      if (isLegalDest) {
        clearHighlights(container);
        const move = {
          fromRow: selectedPiece.row,
          fromCol: selectedPiece.col,
          toRow: clickedRow,
          toCol: clickedCol,
        };
        selectedPiece = null;
        legalMoves = [];
        onMoveSelected(move);
        return;
      }

      // Clicking the same piece → deselect
      if (clickedRow === selectedPiece.row && clickedCol === selectedPiece.col) {
        clearHighlights(container);
        selectedPiece = null;
        legalMoves = [];
        return;
      }

      // Clicking a different friendly piece → switch selection
      if (getPieceOwner(clickedCell) === currentPlayer) {
        clearHighlights(container);
        selectPiece(clickedRow, clickedCol);
        return;
      }

      // Clicking anything else → deselect
      clearHighlights(container);
      selectedPiece = null;
      legalMoves = [];
      return;
    }

    // No piece selected — try to select a friendly piece
    if (getPieceOwner(clickedCell) === currentPlayer) {
      selectPiece(clickedRow, clickedCol);
    }
  }

  function selectPiece(row, col) {
    selectedPiece = { row, col };
    legalMoves = findLegalMovesForPiece(board, row, col, currentPlayer);

    const square = getSquareAt(container, row, col);
    square.classList.add('square-selected');

    for (const move of legalMoves) {
      const destSquare = getSquareAt(container, move.toRow, move.toCol);
      if (destSquare) destSquare.classList.add('square-legal-move');
    }
  }

  // Use event delegation on the grid
  const grid = container.querySelector('.board-grid');
  if (grid) {
    grid.addEventListener('click', handleClick);
  }
}

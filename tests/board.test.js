// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import {
  BOARD_SIZE, HUMAN, COMPUTER,
  HUMAN_PAWN, COMPUTER_PAWN, EMPTY,
} from '../js/constants.js';
import { createInitialBoard } from '../js/game.js';
import {
  renderBoard,
  setupBoardClickHandlers,
} from '../js/board.js';
import { renderInfoLinks } from '../js/ui.js';

// ── Helper ──────────────────────────────────────────────────────

function setupContainer() {
  document.body.innerHTML = '<div id="app"></div>';
  return document.getElementById('app');
}

// ── Phase 2.2: Board Rendering ──────────────────────────────────

describe('renderBoard', () => {
  let container;

  beforeEach(() => {
    container = setupContainer();
  });

  it('should create a 3x3 grid of squares', () => {
    const board = createInitialBoard();
    renderBoard(container, board, HUMAN);
    const squares = container.querySelectorAll('[data-square]');
    expect(squares.length).toBe(BOARD_SIZE * BOARD_SIZE);
  });

  it('should place dark pawn images on computer squares', () => {
    const board = createInitialBoard();
    renderBoard(container, board, HUMAN);
    const darkPawns = container.querySelectorAll('[data-piece="computer"]');
    expect(darkPawns.length).toBe(3);
  });

  it('should place light pawn images on human squares', () => {
    const board = createInitialBoard();
    renderBoard(container, board, HUMAN);
    const lightPawns = container.querySelectorAll('[data-piece="human"]');
    expect(lightPawns.length).toBe(3);
  });

  it('should leave empty squares without piece images', () => {
    const board = createInitialBoard();
    renderBoard(container, board, HUMAN);
    const middleRow = container.querySelectorAll('[data-row="1"] [data-piece]');
    expect(middleRow.length).toBe(0);
  });

  it('should rotate the board so human pawns appear at the bottom (row 2 visually)', () => {
    const board = createInitialBoard();
    // Human is playing — human pawns (row 2 in data) should render at visual bottom (row 2)
    renderBoard(container, board, HUMAN);
    // Visual row 2 (bottom) should contain human pawns
    const bottomRow = container.querySelector('[data-visual-row="2"]');
    const humanPawns = bottomRow.querySelectorAll('[data-piece="human"]');
    expect(humanPawns.length).toBe(3);
  });

  it('should rotate the board so computer pawns appear at bottom when computer perspective', () => {
    const board = createInitialBoard();
    // Computer perspective — computer pawns (row 0 in data) at visual bottom
    renderBoard(container, board, COMPUTER);
    const bottomRow = container.querySelector('[data-visual-row="2"]');
    const computerPawns = bottomRow.querySelectorAll('[data-piece="computer"]');
    expect(computerPawns.length).toBe(3);
  });

  it('should use alternating square colours', () => {
    const board = createInitialBoard();
    renderBoard(container, board, HUMAN);
    const squares = container.querySelectorAll('[data-square]');
    const lightSquares = container.querySelectorAll('.square-light');
    const darkSquares = container.querySelectorAll('.square-dark');
    expect(lightSquares.length + darkSquares.length).toBe(9);
    // Checkerboard: 5 of one colour, 4 of the other
    expect(Math.abs(lightSquares.length - darkSquares.length)).toBe(1);
  });

  it('should update the board when called again with a new state', () => {
    const board = createInitialBoard();
    renderBoard(container, board, HUMAN);
    expect(container.querySelectorAll('[data-piece]').length).toBe(6);

    // Board after a capture — one less piece
    const boardAfterCapture = [
      [COMPUTER_PAWN, EMPTY,         COMPUTER_PAWN],
      [EMPTY,         COMPUTER_PAWN, EMPTY        ],
      [HUMAN_PAWN,    EMPTY,         HUMAN_PAWN   ],
    ];
    renderBoard(container, boardAfterCapture, HUMAN);
    expect(container.querySelectorAll('[data-piece]').length).toBe(5);
  });

  it('should store data coordinates on each square for click handling', () => {
    const board = createInitialBoard();
    renderBoard(container, board, HUMAN);
    const squares = container.querySelectorAll('[data-square]');
    squares.forEach(sq => {
      expect(sq.dataset.row).toBeDefined();
      expect(sq.dataset.col).toBeDefined();
    });
  });
});

// ── Phase 2.3: Click Interaction ────────────────────────────────

describe('setupBoardClickHandlers', () => {
  let container;

  beforeEach(() => {
    container = setupContainer();
  });

  it('should call onMoveSelected with from/to when a valid move sequence is made', () => {
    const board = createInitialBoard();
    renderBoard(container, board, HUMAN);

    let selectedMove = null;
    setupBoardClickHandlers(container, board, HUMAN, (move) => {
      selectedMove = move;
    });

    // Click a human pawn (row 2, col 1 in data)
    const pieceSquare = container.querySelector('[data-row="2"][data-col="1"]');
    pieceSquare.click();

    // Click a legal destination (row 1, col 1)
    const destSquare = container.querySelector('[data-row="1"][data-col="1"]');
    destSquare.click();

    expect(selectedMove).toEqual({
      fromRow: 2, fromCol: 1, toRow: 1, toCol: 1,
    });
  });

  it('should highlight selected piece square', () => {
    const board = createInitialBoard();
    renderBoard(container, board, HUMAN);
    setupBoardClickHandlers(container, board, HUMAN, () => {});

    const pieceSquare = container.querySelector('[data-row="2"][data-col="1"]');
    pieceSquare.click();

    expect(pieceSquare.classList.contains('square-selected')).toBe(true);
  });

  it('should highlight legal move destinations', () => {
    const board = createInitialBoard();
    renderBoard(container, board, HUMAN);
    setupBoardClickHandlers(container, board, HUMAN, () => {});

    // Select human pawn at (2, 1)
    const pieceSquare = container.querySelector('[data-row="2"][data-col="1"]');
    pieceSquare.click();

    // Row 1, col 1 should be a legal destination
    const destSquare = container.querySelector('[data-row="1"][data-col="1"]');
    expect(destSquare.classList.contains('square-legal-move')).toBe(true);
  });

  it('should deselect when clicking the same piece again', () => {
    const board = createInitialBoard();
    renderBoard(container, board, HUMAN);
    setupBoardClickHandlers(container, board, HUMAN, () => {});

    const pieceSquare = container.querySelector('[data-row="2"][data-col="1"]');
    pieceSquare.click(); // select
    pieceSquare.click(); // deselect

    expect(pieceSquare.classList.contains('square-selected')).toBe(false);
  });

  it('should deselect when clicking an empty non-legal square', () => {
    const board = createInitialBoard();
    renderBoard(container, board, HUMAN);
    setupBoardClickHandlers(container, board, HUMAN, () => {});

    const pieceSquare = container.querySelector('[data-row="2"][data-col="1"]');
    pieceSquare.click(); // select

    // Click an empty square that is NOT a legal destination (row 1, col 0 — also legal, so use row 0)
    // Actually from starting position, the human pawn at (2,1) can only go to (1,1).
    // So (1,0) is not a legal dest for that piece — click it to deselect
    const otherSquare = container.querySelector('[data-row="1"][data-col="0"]');
    // But wait: (1,0) is empty and not a legal move for pawn at (2,1)
    // Clicking there should deselect
    otherSquare.click();

    expect(pieceSquare.classList.contains('square-selected')).toBe(false);
  });

  it('should not allow selecting opponent pieces', () => {
    const board = createInitialBoard();
    renderBoard(container, board, HUMAN);
    setupBoardClickHandlers(container, board, HUMAN, () => {});

    // Try clicking a computer pawn
    const computerSquare = container.querySelector('[data-row="0"][data-col="1"]');
    computerSquare.click();

    expect(computerSquare.classList.contains('square-selected')).toBe(false);
  });

  it('should allow selecting a different friendly piece to switch selection', () => {
    const board = createInitialBoard();
    renderBoard(container, board, HUMAN);
    setupBoardClickHandlers(container, board, HUMAN, () => {});

    const piece1 = container.querySelector('[data-row="2"][data-col="0"]');
    const piece2 = container.querySelector('[data-row="2"][data-col="1"]');

    piece1.click(); // select first piece
    expect(piece1.classList.contains('square-selected')).toBe(true);

    piece2.click(); // switch to second piece
    expect(piece1.classList.contains('square-selected')).toBe(false);
    expect(piece2.classList.contains('square-selected')).toBe(true);
  });
});

// ── Info Links (enabled/disabled state) ─────────────────────────

describe('renderInfoLinks', () => {
  let container;

  beforeEach(() => {
    container = setupContainer();
  });

  it('should render enabled info links when isDisabled is false', () => {
    renderInfoLinks(container, false);
    const rules = container.querySelector('.info-link-rules');
    const about = container.querySelector('.info-link-about');
    expect(rules).not.toBeNull();
    expect(about).not.toBeNull();
    expect(rules.classList.contains('pointer-events-none')).toBe(false);
    expect(about.classList.contains('pointer-events-none')).toBe(false);
  });

  it('should render disabled info links when isDisabled is true', () => {
    renderInfoLinks(container, true);
    const rules = container.querySelector('.info-link-rules');
    const about = container.querySelector('.info-link-about');
    expect(rules.classList.contains('pointer-events-none')).toBe(true);
    expect(about.classList.contains('pointer-events-none')).toBe(true);
    expect(rules.classList.contains('opacity-40')).toBe(true);
  });

  it('should re-enable info links after being disabled (game over scenario)', () => {
    // Simulate: links disabled during computer turn
    renderInfoLinks(container, true);
    const rulesBefore = container.querySelector('.info-link-rules');
    expect(rulesBefore.classList.contains('pointer-events-none')).toBe(true);

    // Simulate: game ends, links re-enabled (isGameActive=false means isDisabled=false)
    renderInfoLinks(container, false);
    const rulesAfter = container.querySelector('.info-link-rules');
    expect(rulesAfter.classList.contains('pointer-events-none')).toBe(false);
    expect(rulesAfter.classList.contains('opacity-40')).toBe(false);
  });
});

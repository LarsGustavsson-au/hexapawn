import { describe, it, expect } from 'vitest';
import {
  BOARD_SIZE, HUMAN, COMPUTER,
  HUMAN_PAWN, COMPUTER_PAWN, EMPTY,
  INITIAL_BOARD,
} from '../js/constants.js';
import {
  createInitialBoard,
  cloneBoard,
  findLegalMovesForPiece,
  findAllLegalMoves,
  executeMove,
  checkForWinner,
} from '../js/game.js';

// ── Phase 1.3: Board State ──────────────────────────────────────

describe('createInitialBoard', () => {
  it('should return a 3x3 board', () => {
    const board = createInitialBoard();
    expect(board.length).toBe(BOARD_SIZE);
    board.forEach(row => expect(row.length).toBe(BOARD_SIZE));
  });

  it('should have computer pawns on row 0', () => {
    const board = createInitialBoard();
    board[0].forEach(cell => expect(cell).toBe(COMPUTER_PAWN));
  });

  it('should have human pawns on row 2', () => {
    const board = createInitialBoard();
    board[2].forEach(cell => expect(cell).toBe(HUMAN_PAWN));
  });

  it('should have empty squares in the middle row', () => {
    const board = createInitialBoard();
    board[1].forEach(cell => expect(cell).toBe(EMPTY));
  });
});

describe('cloneBoard', () => {
  it('should return a new board with identical contents', () => {
    const board = createInitialBoard();
    const clone = cloneBoard(board);
    expect(clone).toEqual(board);
  });

  it('should not be the same reference as the original', () => {
    const board = createInitialBoard();
    const clone = cloneBoard(board);
    expect(clone).not.toBe(board);
  });

  it('should not share row references with the original', () => {
    const board = createInitialBoard();
    const clone = cloneBoard(board);
    clone[1][1] = HUMAN_PAWN;
    expect(board[1][1]).toBe(EMPTY);
  });
});

// ── Phase 1.4: Legal Moves ──────────────────────────────────────

describe('findLegalMovesForPiece', () => {
  it('should allow a human pawn to move one step forward to an empty square', () => {
    const board = createInitialBoard();
    // Human pawn at row 2, col 1 — can move to row 1, col 1 (empty)
    const moves = findLegalMovesForPiece(board, 2, 1, HUMAN);
    expect(moves).toContainEqual({ toRow: 1, toCol: 1 });
  });

  it('should allow a computer pawn to move one step forward to an empty square', () => {
    const board = createInitialBoard();
    // Computer pawn at row 0, col 1 — can move to row 1, col 1 (empty)
    const moves = findLegalMovesForPiece(board, 0, 1, COMPUTER);
    expect(moves).toContainEqual({ toRow: 1, toCol: 1 });
  });

  it('should allow diagonal capture of opponent piece', () => {
    const board = [
      [COMPUTER_PAWN, EMPTY,         COMPUTER_PAWN],
      [EMPTY,         HUMAN_PAWN,    EMPTY        ],
      [HUMAN_PAWN,    EMPTY,         HUMAN_PAWN   ],
    ];
    // Computer pawn at row 0, col 0 — can capture human pawn at row 1, col 1
    const moves = findLegalMovesForPiece(board, 0, 0, COMPUTER);
    expect(moves).toContainEqual({ toRow: 1, toCol: 1 });
  });

  it('should not allow forward move into an occupied square', () => {
    const board = [
      [COMPUTER_PAWN, COMPUTER_PAWN, COMPUTER_PAWN],
      [EMPTY,         HUMAN_PAWN,    EMPTY        ],
      [HUMAN_PAWN,    EMPTY,         HUMAN_PAWN   ],
    ];
    // Human pawn at row 2, col 0 can move forward, but row 1 col 1 is occupied
    // Computer pawn at row 0, col 1 — row 1, col 1 is occupied by human, can't go forward
    const moves = findLegalMovesForPiece(board, 0, 1, COMPUTER);
    const forwardMove = moves.find(m => m.toRow === 1 && m.toCol === 1);
    expect(forwardMove).toBeUndefined();
  });

  it('should not allow backward moves', () => {
    const board = [
      [EMPTY,         EMPTY,         EMPTY        ],
      [EMPTY,         HUMAN_PAWN,    EMPTY        ],
      [HUMAN_PAWN,    EMPTY,         HUMAN_PAWN   ],
    ];
    // Human pawn at row 1, col 1 — should not be able to move to row 2
    const moves = findLegalMovesForPiece(board, 1, 1, HUMAN);
    const backwardMoves = moves.filter(m => m.toRow > 1);
    expect(backwardMoves).toHaveLength(0);
  });

  it('should not allow moves off the board', () => {
    const board = [
      [COMPUTER_PAWN, COMPUTER_PAWN, COMPUTER_PAWN],
      [EMPTY,         EMPTY,         EMPTY        ],
      [HUMAN_PAWN,    HUMAN_PAWN,    HUMAN_PAWN   ],
    ];
    // Human pawn at row 0 would try to move to row -1 — not allowed
    // But human pawns start at row 2, so let's set up a scenario
    const boardAdvanced = [
      [HUMAN_PAWN,    EMPTY,         EMPTY        ],
      [EMPTY,         EMPTY,         EMPTY        ],
      [EMPTY,         EMPTY,         COMPUTER_PAWN],
    ];
    // Human pawn at row 0 — can't move further forward (off the board)
    const moves = findLegalMovesForPiece(boardAdvanced, 0, 0, HUMAN);
    expect(moves).toHaveLength(0);
  });

  it('should not allow capturing own pieces diagonally', () => {
    const board = [
      [EMPTY,         EMPTY,         EMPTY        ],
      [HUMAN_PAWN,    EMPTY,         HUMAN_PAWN   ],
      [EMPTY,         HUMAN_PAWN,    EMPTY        ],
    ];
    // Human pawn at row 2, col 1 — diagonals are friendly pieces, cannot capture
    const moves = findLegalMovesForPiece(board, 2, 1, HUMAN);
    const diagonalMoves = moves.filter(m => m.toCol !== 1);
    expect(diagonalMoves).toHaveLength(0);
  });
});

describe('findAllLegalMoves', () => {
  it('should return all legal moves for human from starting position', () => {
    const board = createInitialBoard();
    const moves = findAllLegalMoves(board, HUMAN);
    // All 3 human pawns can move forward one step from starting position
    expect(moves).toHaveLength(3);
  });

  it('should return all legal moves for computer from starting position', () => {
    const board = createInitialBoard();
    const moves = findAllLegalMoves(board, COMPUTER);
    expect(moves).toHaveLength(3);
  });

  it('should include both forward and capture moves', () => {
    const board = [
      [COMPUTER_PAWN, EMPTY,         COMPUTER_PAWN],
      [EMPTY,         HUMAN_PAWN,    EMPTY        ],
      [HUMAN_PAWN,    EMPTY,         HUMAN_PAWN   ],
    ];
    // Computer pawn at (0,0): forward to (1,0) + capture (1,1) = 2 moves
    // Computer pawn at (0,2): forward to (1,2) + capture (1,1) = 2 moves
    const moves = findAllLegalMoves(board, COMPUTER);
    expect(moves.length).toBe(4);
  });

  it('should return empty array when player has no pieces', () => {
    const board = [
      [EMPTY,         EMPTY,         EMPTY        ],
      [EMPTY,         EMPTY,         EMPTY        ],
      [HUMAN_PAWN,    HUMAN_PAWN,    HUMAN_PAWN   ],
    ];
    const moves = findAllLegalMoves(board, COMPUTER);
    expect(moves).toHaveLength(0);
  });
});

// ── Phase 1.5: Executing Moves ──────────────────────────────────

describe('executeMove', () => {
  it('should move a piece to an empty square', () => {
    const board = createInitialBoard();
    const newBoard = executeMove(board, 2, 1, 1, 1);
    expect(newBoard[2][1]).toBe(EMPTY);
    expect(newBoard[1][1]).toBe(HUMAN_PAWN);
  });

  it('should capture an opponent piece', () => {
    const board = [
      [COMPUTER_PAWN, EMPTY,         COMPUTER_PAWN],
      [EMPTY,         HUMAN_PAWN,    EMPTY        ],
      [HUMAN_PAWN,    EMPTY,         HUMAN_PAWN   ],
    ];
    // Computer pawn at (0,0) captures human pawn at (1,1)
    const newBoard = executeMove(board, 0, 0, 1, 1);
    expect(newBoard[0][0]).toBe(EMPTY);
    expect(newBoard[1][1]).toBe(COMPUTER_PAWN);
  });

  it('should return a new board without modifying the original', () => {
    const board = createInitialBoard();
    const newBoard = executeMove(board, 2, 1, 1, 1);
    expect(board[2][1]).toBe(HUMAN_PAWN); // Original unchanged
    expect(board[1][1]).toBe(EMPTY);      // Original unchanged
    expect(newBoard).not.toBe(board);
  });
});

// ── Phase 1.6: Win Detection ────────────────────────────────────

describe('checkForWinner', () => {
  it('should detect human win when pawn reaches row 0', () => {
    const board = [
      [HUMAN_PAWN,    EMPTY,         COMPUTER_PAWN],
      [EMPTY,         EMPTY,         EMPTY        ],
      [EMPTY,         EMPTY,         EMPTY        ],
    ];
    expect(checkForWinner(board)).toBe(HUMAN);
  });

  it('should detect computer win when pawn reaches row 2', () => {
    const board = [
      [EMPTY,         EMPTY,         EMPTY        ],
      [EMPTY,         EMPTY,         EMPTY        ],
      [COMPUTER_PAWN, EMPTY,         HUMAN_PAWN   ],
    ];
    expect(checkForWinner(board)).toBe(COMPUTER);
  });

  it('should detect win when all opponent pieces are captured', () => {
    const board = [
      [EMPTY,         EMPTY,         EMPTY        ],
      [EMPTY,         COMPUTER_PAWN, EMPTY        ],
      [EMPTY,         EMPTY,         EMPTY        ],
    ];
    // No human pawns left — computer wins
    expect(checkForWinner(board)).toBe(COMPUTER);
  });

  it('should detect human win when all computer pieces are captured', () => {
    const board = [
      [EMPTY,         EMPTY,         EMPTY        ],
      [EMPTY,         HUMAN_PAWN,    EMPTY        ],
      [EMPTY,         EMPTY,         EMPTY        ],
    ];
    expect(checkForWinner(board)).toBe(HUMAN);
  });

  it('should detect win when opponent has no legal moves', () => {
    // Single computer pawn blocked directly — no diagonal captures possible
    const board = [
      [EMPTY,         EMPTY,         EMPTY        ],
      [EMPTY,         COMPUTER_PAWN, EMPTY        ],
      [EMPTY,         HUMAN_PAWN,    EMPTY        ],
    ];
    // Computer pawn at (1,1) is blocked by human pawn at (2,1)
    // No diagonal captures available — computer has no legal moves
    expect(checkForWinner(board, COMPUTER)).toBe(HUMAN);
  });

  it('should return null when the game is still in progress', () => {
    const board = createInitialBoard();
    expect(checkForWinner(board, HUMAN)).toBeNull();
  });
});

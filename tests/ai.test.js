import { describe, it, expect } from 'vitest';
import {
  HUMAN, COMPUTER, HUMAN_PAWN, COMPUTER_PAWN, EMPTY,
  AI_INITIAL_WEIGHT, AI_MIN_WEIGHT, AI_MAX_WEIGHT,
} from '../js/constants.js';
import { createInitialBoard } from '../js/game.js';
import { createMatchboxAI } from '../js/ai.js';

describe('createMatchboxAI', () => {
  it('should return an AI object with selectMove and learnFromGame methods', () => {
    const ai = createMatchboxAI();
    expect(typeof ai.selectMove).toBe('function');
    expect(typeof ai.learnFromGame).toBe('function');
  });
});

describe('ai.selectMove', () => {
  it('should return a valid legal move from the starting position', () => {
    const ai = createMatchboxAI();
    const board = createInitialBoard();
    const move = ai.selectMove(board);

    // From starting position, computer can move any of 3 pawns forward
    expect(move).toHaveProperty('fromRow');
    expect(move).toHaveProperty('fromCol');
    expect(move).toHaveProperty('toRow');
    expect(move).toHaveProperty('toCol');
    expect(move.fromRow).toBe(0);
    expect(move.toRow).toBe(1);
  });

  it('should return null when no legal moves are available', () => {
    const ai = createMatchboxAI();
    const board = [
      [EMPTY,         EMPTY,         EMPTY        ],
      [EMPTY,         COMPUTER_PAWN, EMPTY        ],
      [EMPTY,         HUMAN_PAWN,    EMPTY        ],
    ];
    const move = ai.selectMove(board);
    expect(move).toBeNull();
  });

  it('should assign equal initial weights to all legal moves', () => {
    const ai = createMatchboxAI();
    const board = createInitialBoard();
    const weights = ai.getWeightsForBoard(board);

    // 3 legal moves from starting position, all should have initial weight
    expect(Object.keys(weights).length).toBe(3);
    Object.values(weights).forEach(weight => {
      expect(weight).toBe(AI_INITIAL_WEIGHT);
    });
  });
});

describe('ai.learnFromGame', () => {
  it('should increase weights for moves when the computer wins', () => {
    const ai = createMatchboxAI();
    const board = createInitialBoard();

    // Force the AI to see this board state
    ai.selectMove(board);
    const weightsBefore = { ...ai.getWeightsForBoard(board) };

    // Simulate a game where the computer's last move was from this board state
    const moveHistory = [
      { board: board, move: { fromRow: 0, fromCol: 1, toRow: 1, toCol: 1 } },
    ];
    ai.learnFromGame(moveHistory, true); // computer won

    const weightsAfter = ai.getWeightsForBoard(board);
    const moveKey = '0,1->1,1';
    expect(weightsAfter[moveKey]).toBeGreaterThan(weightsBefore[moveKey]);
  });

  it('should decrease weights for moves when the computer loses', () => {
    const ai = createMatchboxAI();
    const board = createInitialBoard();

    // Force the AI to see this board state
    ai.selectMove(board);
    const weightsBefore = { ...ai.getWeightsForBoard(board) };

    const moveHistory = [
      { board: board, move: { fromRow: 0, fromCol: 1, toRow: 1, toCol: 1 } },
    ];
    ai.learnFromGame(moveHistory, false); // computer lost

    const weightsAfter = ai.getWeightsForBoard(board);
    const moveKey = '0,1->1,1';
    expect(weightsAfter[moveKey]).toBeLessThan(weightsBefore[moveKey]);
  });

  it('should only learn from the last 2 moves', () => {
    const ai = createMatchboxAI();

    // Create 3 different board states
    const board1 = createInitialBoard();
    const board2 = [
      [COMPUTER_PAWN, EMPTY,         COMPUTER_PAWN],
      [EMPTY,         COMPUTER_PAWN, EMPTY        ],
      [HUMAN_PAWN,    HUMAN_PAWN,    HUMAN_PAWN   ],
    ];
    const board3 = [
      [COMPUTER_PAWN, EMPTY,         COMPUTER_PAWN],
      [EMPTY,         EMPTY,         EMPTY        ],
      [HUMAN_PAWN,    COMPUTER_PAWN, HUMAN_PAWN   ],
    ];

    // Force AI to see all 3 board states
    ai.selectMove(board1);
    ai.selectMove(board2);
    ai.selectMove(board3);

    const weightsBefore1 = { ...ai.getWeightsForBoard(board1) };

    const moveHistory = [
      { board: board1, move: { fromRow: 0, fromCol: 1, toRow: 1, toCol: 1 } },
      { board: board2, move: { fromRow: 1, fromCol: 1, toRow: 2, toCol: 1 } },
      { board: board3, move: { fromRow: 0, fromCol: 0, toRow: 1, toCol: 0 } },
    ];
    ai.learnFromGame(moveHistory, false); // lost

    // Board1 was 3 moves ago — should NOT be penalized (only last 2)
    const weightsAfter1 = ai.getWeightsForBoard(board1);
    const moveKey1 = '0,1->1,1';
    expect(weightsAfter1[moveKey1]).toBe(weightsBefore1[moveKey1]);
  });

  it('should never let a weight drop below the minimum', () => {
    const ai = createMatchboxAI();
    const board = createInitialBoard();
    ai.selectMove(board);

    const moveHistory = [
      { board: board, move: { fromRow: 0, fromCol: 1, toRow: 1, toCol: 1 } },
    ];

    // Lose many times to drive weight down
    for (let i = 0; i < 20; i++) {
      ai.learnFromGame(moveHistory, false);
    }

    const weights = ai.getWeightsForBoard(board);
    const moveKey = '0,1->1,1';
    expect(weights[moveKey]).toBe(AI_MIN_WEIGHT);
  });

  it('should never let a weight rise above the maximum', () => {
    const ai = createMatchboxAI();
    const board = createInitialBoard();
    ai.selectMove(board);

    const moveHistory = [
      { board: board, move: { fromRow: 0, fromCol: 1, toRow: 1, toCol: 1 } },
    ];

    // Win many times to drive weight up
    for (let i = 0; i < 20; i++) {
      ai.learnFromGame(moveHistory, true);
    }

    const weights = ai.getWeightsForBoard(board);
    const moveKey = '0,1->1,1';
    expect(weights[moveKey]).toBe(AI_MAX_WEIGHT);
  });
});

describe('board state serialization', () => {
  it('should produce the same key for identical board states', () => {
    const ai = createMatchboxAI();
    const board1 = createInitialBoard();
    const board2 = createInitialBoard();

    ai.selectMove(board1);
    ai.selectMove(board2);

    const weights1 = ai.getWeightsForBoard(board1);
    const weights2 = ai.getWeightsForBoard(board2);
    expect(weights1).toEqual(weights2);
  });

  it('should produce different keys for different board states', () => {
    const ai = createMatchboxAI();
    const board1 = createInitialBoard();
    const board2 = [
      [COMPUTER_PAWN, EMPTY,         COMPUTER_PAWN],
      [EMPTY,         COMPUTER_PAWN, EMPTY        ],
      [HUMAN_PAWN,    HUMAN_PAWN,    HUMAN_PAWN   ],
    ];

    ai.selectMove(board1);
    ai.selectMove(board2);

    const weights1 = ai.getWeightsForBoard(board1);
    const weights2 = ai.getWeightsForBoard(board2);
    expect(weights1).not.toEqual(weights2);
  });
});

// HexaPawn — Shared constants and configuration

// Board dimensions
export const BOARD_SIZE = 3;

// Players
export const HUMAN = 'human';
export const COMPUTER = 'computer';

// Piece types on the board
export const EMPTY = null;
export const HUMAN_PAWN = 'human';
export const COMPUTER_PAWN = 'computer';

// Initial board layout (from computer's perspective: computer pawns on row 0, human on row 2)
// This is the "canonical" orientation — rendering will rotate as needed
export const INITIAL_BOARD = [
  [COMPUTER_PAWN, COMPUTER_PAWN, COMPUTER_PAWN],
  [EMPTY,         EMPTY,         EMPTY        ],
  [HUMAN_PAWN,    HUMAN_PAWN,    HUMAN_PAWN   ],
];

// Direction of movement (forward = toward opponent's home row)
export const DIRECTION = {
  [HUMAN]:    -1,  // Human pawns move upward (decreasing row index)
  [COMPUTER]:  1,  // Computer pawns move downward (increasing row index)
};

// AI learning parameters
export const AI_REWARD_AMOUNT = 2;       // Weight added to good moves on win
export const AI_PENALTY_AMOUNT = 5;      // Weight removed from bad moves on loss
export const AI_MAX_WEIGHT = 15;         // Maximum weight a move can have
export const AI_MIN_WEIGHT = 1;          // Minimum weight (always some small chance)
export const AI_INITIAL_WEIGHT = 5;      // Starting weight for all legal moves
export const AI_MOVES_TO_LEARN = Infinity; // Learn from all computer moves (games are short)

// Brand colours (for JS reference — CSS uses Tailwind classes where possible)
export const COLOURS = {
  primary:    '#047857',  // Emerald-700 — dark pieces
  secondary:  '#9f1239',  // Rose-800
  tertiary:   '#D1FAE5',  // Emerald-150 — light pieces
  text:       '#27272A',  // Zinc-800
  background: '#FFFBEB',  // Amber-50
  surface:    '#FFFFFF',  // White
};

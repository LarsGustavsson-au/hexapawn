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
export const AI_REWARD_AMOUNT = 1;       // Weight added to good moves on win
export const AI_PENALTY_AMOUNT = 1;      // Weight removed from bad moves on loss
export const AI_MAX_WEIGHT = 6;          // Maximum weight a move can have (+3 from starting 3)
export const AI_MIN_WEIGHT = 1;          // Minimum weight (always some chance)
export const AI_INITIAL_WEIGHT = 3;      // Starting weight for all legal moves
export const AI_MOVES_TO_LEARN = 2;      // How many of the last moves to reinforce/penalize

// Brand colours (for JS reference — CSS uses Tailwind classes where possible)
export const COLOURS = {
  primary:    '#047857',  // Emerald-700 — dark pieces
  secondary:  '#9f1239',  // Rose-800
  tertiary:   '#D1FAE5',  // Emerald-150 — light pieces
  text:       '#27272A',  // Zinc-800
  background: '#FFFBEB',  // Amber-50
  surface:    '#FFFFFF',  // White
};

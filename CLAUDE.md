# CLAUDE.md — HexaPawn Project

## Project Overview
HexaPawn: a browser-based implementation of the classic 3x3 pawn game where the computer learns from its own games using a matchbox-style reinforcement learning model. Built as a learning project for Lars, inspired by a 1988 high school assignment with Pa Soderstand.

## Tech Stack
- **Frontend**: Vanilla HTML + Tailwind CSS (CDN, no build step) + JavaScript ES Modules
- **No framework, no bundler** — keep it simple and dependency-free
- **Testing**: Vitest (run via npx, no global install required)
- **Version control**: Git

## Project Structure
```
project-HexaPawn/
├── index.html              # Main HTML shell
├── css/
│   └── custom.css          # Game-specific styles beyond Tailwind
├── js/
│   ├── main.js             # Entry point, app initialization
│   ├── game.js             # Game state, turn logic, win detection
│   ├── board.js            # Board rendering and click handling
│   ├── ai.js               # Matchbox learning AI
│   ├── ui.js               # UI updates, stats, messages, quips
│   └── constants.js        # Shared constants and configuration
├── tests/
│   ├── game.test.js        # Game logic tests
│   ├── ai.test.js          # AI learning tests
│   └── board.test.js       # Board state tests
├── assets/
│   └── pieces/             # SVG pawn assets
├── docs/
│   └── PRD.md              # Product Requirements Document
├── style-guide.md          # Visual style guide (shared across product family)
├── copy-guideline.md       # Copy guideline (shared across product family)
├── CLAUDE.md               # This file
└── plan.md                 # Implementation plan
```

## Branding & Colours
See [style-guide.md](./style-guide.md) 

## Game Design Decisions
- **Input**: Click-click (select piece, then click destination)
- **Board orientation**: Always rotated so player's pawns are at the bottom
- **First move**: Player chooses for game 1, then alternates automatically
- **Piece style**: 1970s chess book illustration — bold outline SVG pawns. Dark pieces are solid fill, light pieces are outline/light fill. Design reference image: `docs/ExampleChessPieces.jpg`
- **Board style**: Clean modern grid with alternating square colours from brand palette
- **Computer personality**: Subtle dry quips on wins, losses, and interesting game moments
- **Stats display**: Minimal counter below board — games played, your wins, computer wins

## AI / Learning Model
- **Start state**: Completely random — all legal moves equally weighted (true matchbox approach)
- **Learning**: On loss, penalize the computer's last 2 moves. On win, reinforce last 2 moves.
- **Weight system**: +/-3 experience before a move pattern is fully determined or ruled out
- **Memory**: In-memory only for MVP (resets on page reload)
- **Learns from**: Computer's own moves only (not the human's moves)

## Coding Standards
- **TDD approach**: Write a failing test first, then write the code to pass it
- **Naming**: Clear, readable variable and function names for both humans and AI
  - Use descriptive names: `findLegalMovesForPiece()` not `getMoves()`
  - Use consistent terminology: "piece", "square", "row", "column", "move"
  - Boolean variables start with `is`, `has`, `can`: `isGameOver`, `hasLegalMoves`
- **File organization**: Split by concern. Each file has a clear, single responsibility.
- **Function length**: Keep functions short and focused. If a function does more than one thing, split it.
- **Comments**: Only where the logic isn't self-evident. Code should be self-documenting through good naming.
- **No over-engineering**: Build what's needed for MVP. No premature abstractions.

## Game Rules (HexaPawn)
- 3x3 board, each player starts with 3 pawns on their home row
- Pawns move one step forward to an empty square
- Pawns capture diagonally forward (like chess pawns)
- A player must make a move on their turn
- **Win conditions**:
  1. A pawn reaches the opposite end of the board
  2. All opponent's pieces are captured
  3. The opponent has no legal moves

## Running the Project
- Open `index.html` in a browser (no server needed for basic development)
- Run tests: `npx vitest run` from project root
- Run tests in watch mode: `npx vitest` from project root

## Git Conventions
- Commit messages: `type: description` (feat, fix, refactor, test, docs, chore)
- Commit frequently at logical checkpoints
- Keep commits focused on a single concern
- **IMPORTANT: Before any commit, ALWAYS ask the user to manually test the changes in the browser first.** Do not commit until the user confirms it works. Automated tests passing is not enough — the user must verify visually and interactively.

## Style References
- `style-guide.md` — Visual style guide (colours, typography, buttons, spacing, animations)
- `copy-guideline.md` — Copy guideline (voice, tone, headings, button labels, quips, terminology)

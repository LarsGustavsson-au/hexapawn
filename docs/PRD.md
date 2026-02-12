# PRD for HexaPawn
Author: Lars

| Product Manager | Lars |
| Engineering Lead/Team Lead | Claude |
| Designer | Lars + Claude |
| Approvers/Sign-Off | Lars |

PM Epic: N/A
Status of PRD: Concepts

# One Pager
## Overview
HexaPawn should be a web based implementation of what I and Pa Soderstand tried to pull off in Highschool 1988 - an implementation of the rather basic game of hexapawn , where the computer learns from own games played, to eventually be very good. The original concept for training the "computer" was long before the advent of PC's. A set of trays were used, and a number of white and black balls were moved around  to basically encourage or discourage the "computer" to do certain moves.
We will start with an MVP where we let the program forget between sessions, and we keep the UI simple but functional.
## Problem
There are two problems here. We never handed in the assignment, and I need to get good at coding stuff, preferably with help of AI
## 
## Objectives
1. Ability to program a graphic user interface
2. Ability to program a game that plays against a human
3. Version handling and adding features successfully 

## Constraints
1. Lars coding skills are near zero
2. Limited Claude plan - be careful with tokens
3. Stay secure on the web server, if that's where we end up

## Persona
The game of HexaPawn as two distinct personas:
- The User. A human that would like a few minutes entertainment
- The computer. The opponent for the human user

| **Key Persona - User** | This is an computer literate person, that can read and understand English well enough for a computer. The person is believed to be 30-50 years old, but can be as young as 10. |
| **Persona 2 - Computer** | This is the opponent for the "User". It want's to win. It has a dry kind of humour. The computer is a medium fast learner, but does not repeat mistakes once they have been understood. |

## Use Cases
**Scenario 1**
1. The user starts the app.
2. The user determines if it or the computer should start the game
3. The user and the computer are taking turns making a move until there is a winner
4. The computer process the learnings from the current game
5. The user can start another game, or quit
6. If starting again, the computer is using the lessons from previous games to increase the chances that it will win.

# PRD

## Features In
These are the distinct, prioritized features along with a short explanation of why this feature is important. Briefly outline the scope, the goals, and use case.
### Game Board
There's no game without this...
- Show the game board (3*3 grid)
- Show game pieces according to their current location

### Move Pieces
The way for both user & computer to interact with the game pieces
- Let the user or computer  interact with the game board, capturing their next move
  - User moves:
    - 
- Don't allow movement of opponents pieces.
- Don't allow illegal moves
  - Valid Moves: A piece can go **one **step forward to an unoccupied tile on the grid. A piece can move one step diagonally forward only to take out an opponent. A player must make a move on their turn.
- Show the move
  - When applicable, eliminate a piece

### Detect Winner
Without this, the games would not end.
- Winning conditions:
    - A pawn reaches the opposite end of the board.
    - All opponent's pieces are captured.
    - The opponent has no legal moves.
- Proclaim who won.
- Add the learnings to the computer memory
### 
## Features Out
### Authorisation
Not part of MVP, as there is no database component.
- Log in, keep user specific memory of the computers training

### Sound
Not part of MVP
- Very minimal or none. Absolutely no music or other ambient sound.

### Show Progress of Learning
Not part of MVP
- Have some visual indication how far the training of the computer has come. This gives an indication  that something is going on.
  - Simple: How many games it has analysed
  - Advanced: Show some percentage of how deterministic the computer is about what moves to make

### Reset the Computer Learning
Not part of MVP
- Let the user reset the training of the computer, to make it easier to beat, e.g. when showing others.

### Suggest Next Move
This is common in computer games, but would defeat the purpose of this little game

## Design - (optional) 
### MVP
- Use relatively simple 2D board and pieces
- Determine user input on the grid on the board the user interact with.
- Let pieces have the following states:
  - Stationary: grounded on the board
  - Selected (for a move): The edge of the grid on the board is highlighted and the piece is floating slightly above
  - Beaten: A short transition to fade away or being moved outside the board
  - Transiting: A brief animation to indicate where the piece is moving.

### Later
Use the isometric perspective for the gameboard and pieces (making it resemble fake 3D in games from early 1990ies
- Make user control of what piece to move be determined of the pixel that represents the grid, not outline of the piece.

## Technical Considerations - (optional) 
T.B.D.
## Success Metrics
T.B.D

***Note:**** Link to Analytics requirements and approach document.*
## GTM Approach
Not applicable


## Open Issues
- How to track the actual training:
  - Based on every legal move?
  - Learn both from user and computer?
  - Can we make learning faster by considering "the left and the right "columns" of tiles simply as "outsides"?
  - How many times do we consider before a movement pattern is completely ruled out or always being used? I suggest +/-3 experience before fully determined

## Q&A
What are common questions about the product along with the answers you’ve decided? This is a good place to note key decisions.

| Asked by | Question | Answer |
| --- | --- | --- |
|  |  |  |
## Feature Timeline and Phasing

| Feature | Status | Dates |
|  | Backlog |  |
|  | In Development |  |
|  | In Review |  |
|  | Shipped |  |
|  | Blocked |  |
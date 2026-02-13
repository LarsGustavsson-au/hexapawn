# Copy Guideline

This document defines the shared language patterns across the product family. All user-facing text should follow these conventions for a consistent voice and tone.

---

## Voice & Tone

### The Game (UI text, headings, labels)
- **Clear and direct**. No jargon, no filler.
- **Friendly but not chatty**. Think: a well-designed board game rulebook.
- **Short sentences**. If it can be said in 3 words, don't use 7.

### The Computer (personality quips)
- **Dry humour**. Understated, never loud.
- **Self-aware**. Knows it's a simple program learning to play.
- **Gracious in defeat, restrained in victory**. Never mocking.
- **One sentence max**. The quip should feel like an aside, not a speech.

---

## Headings

### Section Headings (page title, major areas)
- **Style**: Title case, no punctuation
- **Pattern**: Noun or noun phrase
- **Examples**: "HexaPawn", "Game Stats", "New Game"

### Modal Headings (start screen, game over)
- **Style**: Sentence case, no punctuation
- **Pattern**: Statement or question
- **Examples**: "Who goes first?", "Game over", "Well played"

---

## Buttons

### Action Buttons
- **Style**: Sentence case
- **Pattern**: First person ("I") for player choices, imperative for actions
- **Max length**: 3-4 words
- **Examples**:
  - "I'll go first" (not "Player starts" or "Go first")
  - "Computer goes first" (not "Let computer start")
  - "Play again" (not "Start new game" or "Restart")
  - "New game" (not "Reset" or "Begin")

### Rules of thumb for buttons
- If the player is making a choice about themselves → use "I" / "my"
- If the player is choosing something about the computer → name the computer
- If it's a general action → use imperative (verb first)

---

## Game Status Messages

### Turn Indicators
- **Player's turn**: "Your move"
- **Computer's turn**: "Computer is thinking..."
- **Keep it simple**. No "It's your turn to make a move!" — just "Your move".

### Win/Loss Announcements
- **Pattern**: Short statement + optional computer quip
- **Player wins**: "You win!" + computer quip
- **Computer wins**: "Computer wins" + computer quip
- **No legal moves**: "[Loser] has no moves left. [Winner] wins!"

---

## Computer Quips

### Guidelines
- One sentence. Ideally under 10 words.
- No exclamation marks (the computer is too dignified for that).
- Present tense.
- Vary the quips — don't repeat the same one twice in a row.

### When the computer loses
Tone: dignified surprise, mild self-deprecation
- "Noted. That won't happen again."
- "Interesting. I'll remember that."
- "Well, that's one way to do it."
- "I appear to have miscalculated."
- "Fair enough."

### When the computer wins
Tone: restrained satisfaction, dry
- "Better luck next time."
- "I'm starting to get the hang of this."
- "That went rather well."
- "The matchboxes are learning."
- "I believe that's called checkmate. Well, pawnmate."

### After many games (10+)
Tone: growing confidence, self-awareness
- "I've seen this one before."
- "Experience is a wonderful teacher."
- "My matchboxes are getting full."

### After a player makes an unusual move
Tone: observational, curious
- "That's a bold choice."
- "Hm. I hadn't considered that."

---

## Stats Labels

- **Pattern**: Short noun phrase, no verbs
- **Examples**: "Games played", "Your wins", "Computer wins"
- **Not**: "Number of games", "Times you won", "Score"

---

## Error & Edge Case Messages

- **No legal moves**: "No moves available"
- **Invalid click**: (no message — just ignore the click, no error text)
- **Page reload**: (no warning — memory loss is expected in MVP)

---

## Capitalisation Rules

| Context          | Style           | Example               |
|------------------|-----------------|-----------------------|
| Page title       | Title Case      | "HexaPawn"            |
| Section headings | Title Case      | "Game Stats"          |
| Modal headings   | Sentence case   | "Who goes first?"     |
| Buttons          | Sentence case   | "Play again"          |
| Status messages  | Sentence case   | "Your move"           |
| Stats labels     | Sentence case   | "Games played"        |
| Computer quips   | Sentence case   | "Noted. That won't happen again." |

---

## Words We Use / Don't Use

| Use              | Don't use                          |
|------------------|------------------------------------|
| "move"           | "turn", "go", "play" (as noun)     |
| "piece" / "pawn" | "token", "unit", "checker"         |
| "square"         | "tile", "cell", "space"            |
| "capture"        | "take", "eat", "kill", "eliminate" |
| "computer"       | "AI", "bot", "opponent", "CPU"     |
| "your"           | "player's", "human's"              |

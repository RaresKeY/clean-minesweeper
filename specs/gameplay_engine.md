# Gameplay Engine

## Difficulties

| Difficulty | Width | Height | Mines |
|------------|-------|--------|-------|
| Beginner | 9 | 9 | 10 |
| Intermediate | 16 | 16 | 40 |
| Expert | 30 | 16 | 99 |

## Rules

- First reveal must never hit a mine.
- Mines are placed after the first reveal.
- The first revealed cell and its neighbors are excluded from mine placement when the board has enough safe space.
- Revealing a zero-adjacent cell flood-reveals connected zeroes and their numbered boundary cells.
- Flagging cycles closed cells through closed, flagged, question, and closed.
- Revealed cells cannot be flagged.
- Chording a revealed numbered cell reveals all closed neighbors when adjacent flags equal the number.
- Win state occurs when every non-mine cell is revealed.
- Loss state reveals all mines and marks incorrectly flagged cells.
- Timer starts on first reveal or chord that causes reveal, and stops on win/loss.

## Randomness

The browser app uses `Math.random`. Tests may inject a deterministic RNG into the engine.

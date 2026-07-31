# Input And Accessibility

## Mouse

- Primary click reveals a closed cell.
- Secondary click cycles flag state and suppresses the browser context menu on cells.
- Primary click on a revealed number attempts chording.

## Touch

- Tap reveals.
- Long-press cycles flag state.
- The game menu exposes a session-only flag mode; while enabled, a tap cycles flag state instead of revealing.
- Touch gestures must not require browser zoom or page scrolling inside the board.

## Keyboard

- Board cells are focusable as a grid.
- Arrow keys move focus.
- `Enter` or `Space` reveals or chords the focused cell.
- `F` cycles the focused cell flag state.
- `R` restarts the current difficulty.
- `M` or `O` opens or closes the game menu.
- `Escape` closes the game menu and returns focus to its trigger.
- The custom-board form supports normal form keyboard behavior; `Enter` submits valid settings.

## Accessibility

- The board uses grid semantics.
- Cells expose labels that include coordinates and current state.
- Status changes use a polite live region.
- Focus indicators must be visible on keyboard navigation.
- The menu uses native buttons, exposes its expanded state through `aria-expanded`, and returns focus to its trigger after a selection or keyboard dismissal.
- Custom-board controls use labeled native number inputs, announce validation errors, and move focus to the first invalid field through browser constraint validation.
- Counter outputs expose spoken mine and elapsed-time labels independently of their visual pixel glyphs.

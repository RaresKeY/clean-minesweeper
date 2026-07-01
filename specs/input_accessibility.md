# Input And Accessibility

## Mouse

- Primary click reveals a closed cell.
- Secondary click cycles flag state and suppresses the browser context menu on cells.
- Primary click on a revealed number attempts chording.

## Touch

- Tap reveals.
- Long-press cycles flag state.
- Touch gestures must not require browser zoom or page scrolling inside the board.

## Keyboard

- Board cells are focusable as a grid.
- Arrow keys move focus.
- `Enter` or `Space` reveals or chords the focused cell.
- `F` cycles the focused cell flag state.
- `R` restarts the current difficulty.

## Accessibility

- The board uses grid semantics.
- Cells expose labels that include coordinates and current state.
- Status changes use a polite live region.
- Focus indicators must be visible on keyboard navigation.

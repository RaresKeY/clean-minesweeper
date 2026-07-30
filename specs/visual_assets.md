# Visual Assets

## Asset Rules

- Tile and icon assets are 1:1 square PNG images generated locally.
- Assets must stay crisp at common tile sizes through `image-rendering: auto` and high-resolution source files.
- Cell numbers keep hidden text in the DOM and use explicit 3x5 pixel-grid elements for the visible native glyphs. Every lit source pixel maps to a real square so the glyph origin is never lost as it can be with zero-offset shadows.
- Favicon files live under `public/assets/` and are referenced from `index.html`.

## Native-Aligned Presentation

- The default theme matches the native game's dark presentation: `#161817` game background, `#1e2221` HUD, `#0d1212` counters, blue counter glyphs, and a gold focus indicator.
- A session-only light theme is available from the game menu and uses the native light palette.
- Tile images are multiplied by the active native tint in CSS. Icons remain untinted overlays so their red, white, blue, and black artwork is preserved.
- The board has no card, frame, or document chrome. It is centered in the space below the 58px HUD and uses native 32px cells when the viewport allows.
- Small viewports may reduce cells to 22px; larger boards remain scrollable so touch targets do not shrink below that floor.
- Number glyph pixels use integer 3px or 4px squares according to the responsive tile size so their edges remain crisp.
- The HUD contains two unlabeled visual pixel counters with accessible output labels and a top-right `MENU` button.
- Menu panels are square, compact, and use the native border, focus, selection, and dark/light colors.

## Required Assets

| Asset | Purpose |
|-------|---------|
| `tile-closed.png` | Closed square background. |
| `tile-open.png` | Revealed square background. |
| `tile-pressed.png` | Pressed/active square feedback. |
| `mine.png` | Mine symbol. |
| `mine-hit.png` | Mine symbol for the exploded cell. |
| `flag.png` | Flag marker. |
| `question.png` | Question marker. |
| `wrong-flag.png` | Incorrect flag marker shown after loss. |
| `favicon-64.png` | Browser favicon. |
| `apple-touch-icon.png` | Home-screen icon. |

## Regeneration Boundary

Generated files are committed because the deployed app must not generate assets at runtime. Asset-generation helpers are local-only and intentionally excluded from Git.

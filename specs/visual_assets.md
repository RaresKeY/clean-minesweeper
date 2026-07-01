# Visual Assets

## Asset Rules

- Tile and icon assets are 1:1 square PNG images generated locally.
- Assets must stay crisp at common tile sizes through `image-rendering: auto` and high-resolution source files.
- Numbers are rendered as text with CSS classes so they remain accessible and scalable.
- Favicon files live under `public/assets/` and are referenced from `index.html`.

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

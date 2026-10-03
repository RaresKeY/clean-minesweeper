# Playpad Icon

## H / User requirements

Create exactly one square root icon for this project, preserve existing art, do not overwrite an existing root icon, and avoid letters, initials, slogans, labels, placeholder logos, and stock branding. The icon is for the Playpad project listing. Keep the generated raster unchanged.

## Project sources

No dedicated art-direction, design prompt, or icon prompt directory was present. The recorded visual source is [Visual Assets](../specs/visual_assets.md). It specifies square PNG artwork, crisp simple presentation, the native dark palette, and untinted red, white, blue, and black icon artwork.

Reviewed from the read-only owning checkout:

- `public/assets/apple-touch-icon.png` and `public/assets/favicon-64.png`: existing framed icon treatment and mine/flag motif.
- `public/assets/mine.png` and `public/assets/flag.png`: symbol silhouettes and colors.
- `public/assets/tile-closed.png` and `public/assets/tile-open.png`: tile palette and square geometry.
- `public/styles.css` and `public/index.html`: native dark presentation and browser game context.
- `AGENTS.md` and `specs/_readme.md`: project and spec routing instructions.

The icon prompt used the home-screen icon, mine, and flag PNGs as image references. Other listed sources informed the written prompt and limited style inference.

## AI / inference

There is no separate formal icon direction. The inferred composition follows the existing home-screen icon: a warm ivory inset framed in muted evergreen teal, with a charcoal mine and a red flag. The mine-and-flag pairing comes directly from the project’s existing icon and sprites. The outer frame and warm field follow the existing home-screen icon rather than adding a new brand palette or material. The large simple silhouettes were chosen for reading at 96–120 px.

## OPEN

No unresolved icon requirements remain. No claim is made that the inferred composition is a project-authored art direction.

## Generation provenance

- Native built-in tool: `image_gen.imagegen`, invoked with `@image-gen` in the dedicated `gpt-6-luna` / `xhigh` session.
- Calls: one image generation.
- Transparency: disabled; the source icon style uses a deliberate opaque background.
- Generated source: `/home/cachyos-gaming/.codex/generated_images/01a0fefd-28a5-7322-ba6f-d45d4295522a/exec-eadf1fa4-9c69-48bf-a64a-0b036536df67.png`.
- Saved copy: [`icon.png`](../icon.png), copied byte-for-byte with no crop, resize, or edits.
- Validation: PNG, 1254 × 1254 px, RGB, square. The generator returned 1254 px despite the prompt’s 1024 px request; the square output was kept unchanged.
- SHA-256: `dd39cda9727244e56e85efaeef8a65c1c04534d681835f48c7efe2a78bd5f56c`.

## Exact prompt

```text
Use case: logo-brand
Asset type: Square project launcher icon for Clean Minesweeper
Primary request: Create one clean, immediately readable icon for a minimal browser Minesweeper game. It must read clearly at 96–120 px.
Input images: Image 1 (/home/cachyos-gaming/workspace/clean-minesweeper/public/assets/apple-touch-icon.png) is the strongest reference for the existing icon’s composition, palette, and shape language. Image 2 (/home/cachyos-gaming/workspace/clean-minesweeper/public/assets/mine.png) is a reference for the mine symbol. Image 3 (/home/cachyos-gaming/workspace/clean-minesweeper/public/assets/flag.png) is a reference for the flag symbol.
Scene/backdrop: Full square opaque background, warm pale tile field inset within a restrained deep evergreen-teal rounded-square frame, following the existing home-screen icon. Keep the outer corners clean and the design contained in the square.
Subject: One compact charcoal-black Minesweeper mine with a small warm-white center, paired with one vivid red triangular flag on a thin charcoal pole. Preserve the simple mine-and-flag motif and the recognizable silhouette of the references.
Style/medium: Crisp, flat, vector-like raster artwork with solid fills and hard clean edges; simple geometric shapes and restrained detail, matching the supplied icon and tile art.
Composition/framing: Square 1:1 composition, centered visual weight, generous clear separation between the mine, flag, and frame. Make the mine and red flag distinct at small icon sizes; avoid tiny details.
Lighting/mood: Even flat presentation, calm and clean.
Color palette: Use the supplied home-screen icon’s muted evergreen-teal and warm ivory/tile colors with charcoal-black symbols and a clear red flag. Preserve the game’s restrained dark palette; use no extra accent colors.
Materials/textures: Solid matte color fields, no texture.
Constraints: Opaque background; no letters, initials, numbers, slogans, labels, UI screenshot, watermark, or stock branding. No photorealism, gradients, shadows, bevels, or 3D gloss. Do not add unrelated objects. Generate exactly one 1024×1024 square PNG.
```

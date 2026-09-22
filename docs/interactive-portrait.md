# Interactive portrait

The portfolio hero uses an illustrated avatar based on Ritik's supplied portraits, wearing a dark navy shirt against an ivory and sage composition.

## How it works

This is a nine-view image animation, not a rigged 3D model. Pointer position selects a cell from a transparent 3 × 3 WebP atlas. Two layers crossfade between views; a small translation and rotation soften the movement. No camera, face tracking, or pointer data collection is used.

| Screen direction | Atlas cells |
| --- | --- |
| Up-left / up / up-right | 0 / 1 / 2 |
| Left / forward / right | 3 / 4 / 5 |
| Down-left / down / down-right | 6 / 7 / 8 |

The center image is a separate static poster. It remains available when JavaScript is disabled, reduced motion is enabled, or the atlas cannot load. Touch screens support taps and a slow idle sequence. Motion stops while the portrait is offscreen or the tab is hidden. The pause control stores only the visitor's motion preference in local storage; unavailable storage is harmless.

## Files

- `index.html` and `portfolio.html`: matching entry points.
- `assets/avatar-hero.css`: scoped responsive design and reduced-motion styles.
- `assets/avatar-hero.js`: gaze, crossfades, pause control and fallback handling.
- `assets/ritik-avatar-atlas.webp`: 1254 × 1254; nine 418 × 418 cells; 353,894 bytes.
- `assets/ritik-avatar-poster.webp`: neutral 418 × 418 portrait; 42,936 bytes.
- `tests/avatar-browser.cjs`: browser interaction and fallback checks.

All animation assets are served by GitHub Pages. No additional hosted service or paid runtime dependency is required. The existing page still uses its existing font, Tailwind and icon CDNs.

## Preview and test

Start the preview in one terminal:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173. For browser tests, use another terminal at the repository root:

```bash
npm install --no-save --package-lock=false --ignore-scripts playwright@1.62.1
npx playwright install --with-deps chromium
node tests/avatar-browser.cjs
```

The GitHub Actions workflow runs the same checks on pull requests and main, and keeps screenshots for five days. It checks all nine cursor directions, keyboard pause/resume and persistence, touch input, narrow/tablet/desktop layouts, reduced motion, missing artwork, JavaScript-disabled fallback, and the existing Linux project modal.

## Editing and troubleshooting

- Keep both HTML entry points identical when editing the hero.
- Colors live at the top of `avatar-hero.css` and in the `.avatar-arch` rules. The shirt color is part of the illustration.
- If the avatar is still, check the Pause/Play button and your operating system's reduced-motion preference. This is intentional accessibility behavior.
- If the poster appears but motion is unavailable, check that the atlas URL returns an image and that its dimensions are exactly 1254 × 1254.
- Refresh cached assets after deployment. Animation intentionally pauses when the portrait is outside the viewport.
- The views approximate head movement. For continuous 3D rotation, the artwork would need a separate rigged 3D model.

## Artwork provenance

Created on 2026-09-22 with the built-in image generation tool (`image_gen.imagegen`), using the two photos supplied by Ritik as identity references and his requested dark-blue clothing change. Source photos are not included in this repository. The generated transparent PNG was converted to WebP and the center cell extracted as the fallback poster; no creative retouching was performed by the conversion script.

Final generation prompt:

```text
Use case: stylized-concept.
Asset type: production animation sprite atlas for an interactive personal portfolio.
Input images: image 1 is the user's three-quarter identity reference; image 2 is the user's frontal identity reference. Both depict the same adult man, Ritik. Preserve his recognizable likeness.
Create ONE square image containing an EXACT, perfectly regular 3 by 3 grid of NINE separate head-and-upper-chest portraits of the SAME stylized character. Intended canvas 3072 x 3072. This is a functional sprite sheet, not a poster. No text, numbers, borders, cell outlines, logos, accessories, scenery, or extra characters.
Character: preserve the reference's warm medium-brown skin, voluminous tousled black curly hair, thin dark rectangular metal glasses, brown eyes, natural nose, subtle moustache and short beard. He should remain a recognizable young adult man. Tasteful polished 3D animated-film character design with soft sculpted detail and expressive eyes, slightly stylized proportions, professionally friendly tiny closed-mouth smile. Do not turn him into a child or change his ethnicity or skin tone.
Clothing: replace the white shirt with a DARK NAVY BLUE collared shirt, matte fabric, subtle texture, open top button. Identical shirt, face, hairstyle, glasses, lighting, camera, scale, shoulder position and crop in EVERY cell.
Composition: each of the nine cells is exactly one third of the full width and height. Each portrait is centered horizontally in its own cell. Keep the full hairstyle within its cell, ample consistent headroom, both shoulders and upper chest. The body faces forward and stays perfectly still. The head pivots gently at the neck. Portrait bottoms align identically, no body or hair overlaps another cell. Keep face size and neck anchor consistent.
Pose layout in VIEWER / SCREEN coordinates, left to right:
TOP ROW: head and eyes aimed gently up-left; straight up; up-right.
MIDDLE ROW: head and eyes aimed gently left; head straight forward looking at viewer; head and eyes aimed gently right.
BOTTOM ROW: head and eyes aimed gently down-left; straight down; down-right.
Horizontal turns approximately 22 degrees; vertical tilt approximately 12 degrees. Do not use full profile. Pupils follow each gaze direction naturally, visible through clear glasses without glare.
Lighting: identical gentle studio key light and soft fill for all nine portraits, neutral color balance, smooth dimensional modeling.
Background: actual transparent alpha across the entire background and all empty spacing, no checkerboard pattern drawn into image. Clean antialiased cutout edges. No floor shadows. This asset will be composited over warm ivory and muted sage.
Priority: consistent identity and precise equal cell registration for cursor-driven animation.
```


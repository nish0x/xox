# XOX by nishanth

A personalized version of [XOX](https://xox.makemepulse.com), the interactive tic-tac-toe experience originally built by makemepulse — same game, same engine, customized with a different team roster and branding.

## What this actually is

This isn't built from Vue/Vite source in this repo — `public/` is the site's **built, static output** (a bundled WebGL/Canvas app using Vue 3 + GSAP under the hood), served as-is by a small local server. Customization (the team roster, names, avatars) is done by editing that built output directly, since no separate source project exists here.

## Project Structure

```
xox/
├── public/                       # the static site — served byte-for-byte as-is
│   ├── index.html
│   ├── logo.svg, share-1.png
│   ├── favicon/
│   └── assets/
│       ├── js/                   # main.js (app bundle) + per-feature icon chunks
│       ├── css/                  # main.css
│       ├── fonts/                # woff2 fonts (Bangers, Poppins, aaksimosi)
│       ├── images/                # avatar-configurator art, UI sprites, backgrounds
│       ├── models/               # .glb 3D models (avatar, grid, lightning, shapes)
│       ├── audio/                # game sound effects
│       └── data/                 # font atlas manifests, audio sprite map
└── src/
    └── server/
        ├── index.mjs             # zero-dependency static HTTP server
        └── mime-types.mjs        # extension → Content-Type table
```

## Commands

```bash
npm start        # serve on http://127.0.0.1:3000
npm run dev      # same as start
npm run preview  # same as start
```

`PORT` and `HOST` env vars override the defaults, e.g. `PORT=5174 npm start`.

## Customizing the roster

The team roster lives in `public/assets/js/main.js` as a plain array of entries:

```js
{ id: 18, name: "Abishek", role: "ep", avatar: "F1:N1:ST3:E4::H4:B1:HT4::JT4:T2:HT2", opponentId: "abishek" }
```

- `name` — shown live (as real text) on the matchmaking reveal screen.
- `avatar` — a colon-separated code for face/eye/nose/hair/beard/jewelry/detail/hat parts, each referencing an image in `assets/images/` (e.g. `F1` → face option 1, `B0` → beard option 0).
- `opponentId` — links to that person's face-icon SVG (`icon-versus-<opponentId>.js` / `_b` variant) and their i18n "fun facts" entry used during matchmaking.

The in-game "YOU ⚡ [NAME]" banner is rendered dynamically from the `name` field (not a pre-drawn image), so adding a new person only requires a roster entry, an avatar code, and a face icon — no hand-drawn name artwork needed.

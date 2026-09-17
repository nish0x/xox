# XOX

A fast, interactive tic-tac-toe game where you get matched against a teammate, customize your 3D avatar, and battle it out on a WebGL-powered board.

## How to Play

1. **Get matched** — the game randomly pairs you against someone from the team roster
2. **Build your avatar** — customize your look with faces, hair, beards, hats, and accessories
3. **Play** — classic tic-tac-toe, first to get three in a row wins
4. **Rematch** — jump right back in for another round

## Get Running

```bash
npm start
```

Opens at [http://127.0.0.1:3000](http://127.0.0.1:3000). Override with `PORT` and `HOST` env vars.

## Tech

- Custom WebGL/Canvas engine with 3D scenes
- Mix-and-match 3D avatar system
- GSAP animations
- Zero-dependency static server

## Adding a New Player

Each player needs three things:

1. **A roster entry** in `public/assets/js/main.js`:
   ```js
   { id: 18, name: "Abishek", role: "ep", avatar: "F1:N1:ST3:E4::H4:B1:HT4::JT4:T2:HT2", opponentId: "abishek" }
   ```
2. **A face icon** — `icon-versus-<opponentId>.js` (+ `_b` variant) in `public/assets/js/`
3. **An avatar code** — colon-separated parts mapping to images in `public/assets/images/` (`F1` = face, `H4` = hair, `B1` = beard, etc.)

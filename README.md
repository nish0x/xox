# XOX by makemepulse

A faithful recreation of the [XOX](https://xox.makemepulse.com) interactive tic-tac-toe experience — where play meets digital craftsmanship.

## Tech Stack

- **Vue 3** (Composition API, `<script setup>`)
- **Vite** (build tool)
- **Tailwind CSS v4** (utility-first styling)
- **Canvas 2D** (animated background with floating X/O shapes)
- **Web Audio API** (procedural sound effects)

## Project Structure

```
xox/
├── index.html                  # Entry HTML with meta tags
├── vite.config.js              # Vite + Tailwind config
├── public/                     # Static assets (favicons, manifest)
│   └── favicon/
├── src/
│   ├── main.js                 # App bootstrap
│   ├── App.vue                 # Root component (screen router + state)
│   ├── style.css               # Global styles, theme variables, fonts
│   ├── assets/
│   │   └── fonts/              # woff2 fonts (downloaded from original)
│   ├── components/
│   │   ├── canvas/
│   │   │   └── BackgroundCanvas.vue   # Animated particle background
│   │   ├── layout/
│   │   │   ├── AppLayout.vue          # Layout shell with footer
│   │   │   ├── LogotypeMMP.vue        # makemepulse logo
│   │   │   └── CookieConsent.vue      # GDPR cookie banner
│   │   ├── screens/
│   │   │   ├── Loading.vue            # Loading screen with % counter
│   │   │   ├── Welcome.vue            # Hero / landing screen
│   │   │   ├── Avatar.vue             # Avatar customizer
│   │   │   ├── Matchmaking.vue        # Opponent search screen
│   │   │   ├── Versus.vue             # "YOU vs THEM" intro
│   │   │   ├── Game.vue               # Tic-tac-toe board + AI
│   │   │   ├── Result.vue             # Win / lose / draw screen
│   │   │   └── Grid.vue               # "Meet the Team" wall
│   │   └── ui/
│   │       ├── UIIcon.vue             # SVG icon component
│   │       ├── UIButton.vue           # Styled CTA button
│   │       ├── UIBubble.vue           # Speech bubble
│   │       ├── UISoundBtn.vue         # Animated sound toggle
│   │       └── UICursor.vue           # Custom cursor
│   ├── composables/
│   │   ├── useResponsive.js           # isMobile/isDesktop/portrait
│   │   └── useAudio.js                # Web Audio sound engine
│   ├── store/
│   │   ├── appState.js                # Screen flow state
│   │   ├── gameLogic.js               # Tic-tac-toe rules + AI
│   │   └── teamMembers.js             # 30 team member data + avatar part defs
│   └── i18n/
│       └── en.js                      # English copy / text
```

## Screen Flow

```
loading → welcome → avatar → matchmaking → versus → game → result
                                          └───────┘     └──────→ grid (meet team)
```

The state machine lives in `src/store/appState.js`; screens are rendered conditionally in `App.vue`.

## Game Logic

- Player is **X** (fushia), AI is **O** (cyan)
- AI strategy (`src/store/gameLogic.js`):
  1. Take an immediate winning move
  2. Block opponent's winning move (80% of the time)
  3. Take the center
  4. Take a random corner
  5. Take any random empty cell
- Winning lines are highlighted with an animated stroke on the board

## Commands

```bash
npm install      # install dependencies
npm run dev      # start dev server
npm run build    # production build → dist/
npm run preview  # preview the production build
```
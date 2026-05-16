# Runner Score Arcade

Historical JavaScript/Phaser arcade game built as a standalone browser game with an Express server and Kinvey-style leaderboard integration.

This is an early Phaser 3 endless dodger where the player controls an animated runner, avoids falling hazards, collects power-ups, tracks lives/score, and can submit high scores to a backend leaderboard. It is kept as a portfolio/archive project that shows Phaser scene work, sprite animation helpers, collision handling, touch controls, Webpack bundling, Express static hosting, and REST-backed score persistence.

## What It Demonstrates

- Phaser 3 scene architecture.
- Arcade physics, collision groups, hazards, power-ups, lives, score, and replay flow.
- Keyboard and touch controls for desktop/mobile-style input.
- Sprite-sheet/image/audio preload helpers.
- Animation and movement helper modules.
- Express server for serving the bundled game.
- Webpack build pipeline for browser and server bundles.
- Kinvey-style REST service layer for authentication and leaderboard scores.
- GitHub Pages deployment script for the built `dist/` output.

## Tech Stack

- JavaScript
- Phaser 3
- Express
- Webpack 4
- Babel
- jQuery AJAX
- Kinvey-style REST API integration
- HTML/CSS

## Main Code Areas

- `app/index.js` - Phaser game bootstrap and scene registration.
- `app/scenes/dodgeGame.js` - main game loop, scoring, hazards, power-ups, replay, and leaderboard flow.
- `app/help-scripts/` - movement, collision, image, sprite-sheet, animation, and power-up helpers.
- `app/services/` - auth and remote API wrappers.
- `app/server/server.js` - Express static server.
- `webpack.*.config.js` - client/server bundling.

## Run Locally

```bash
npm install
npm run build
npm start
```

Useful scripts:

```bash
npm run build
npm run publish-demo
```

## Demo run

```bash
npm install
npm run build
$env:PORT = "4107"
npm start
```

Open `http://127.0.0.1:4107/`. Without `PORT`, the Express server defaults to `5000`.

## Security / Backend Note

The original student project used a Kinvey backend. Historical app keys/secrets have been removed from the current source and replaced with placeholders. To run backend-backed score flows, provide your own Kinvey-compatible app key and secret in `app/services/kinvey-remote-service.js`.

Because this is an archived portfolio project, the original hosted backend may no longer exist.

## Status

Archived portfolio project. The goal of this repository is to show early Phaser/JavaScript game work, not to represent current production practices.

## Cloudflare Pages

- Pages project name: `runner-score-arcade`
- GitHub repository: `BorisThoris/runner-score-arcade`
- Production branch: `master`
- Root directory: `.`
- Build command: `npm run build`
- Build output directory: `dist`
- Environment variable: `NODE_VERSION=22.16.0`
- Public URL target: `https://runner-score-arcade.pages.dev/`

Do not enable Cloudflare Access for the demo deployment. Leave frame-blocking headers unset so the portfolio can iframe the public build.

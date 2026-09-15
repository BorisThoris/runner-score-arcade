// Metadata inputs for this repository - unique to runner-score-arcade.
//
// Everything here is curated by hand. Derived facts (stack, metrics, git,
// screenshots) are computed by scripts/generate-project-meta.mjs, which writes
// project.meta.json. Run it with:
//   npm run meta          regenerate project.meta.json
//   npm run meta:check    fail if project.meta.json is stale

import path from 'node:path';

// Screenshots are captured by the portfolio (npm run capture there). Point
// PORTFOLIO_ROOT elsewhere, or drop images in ./project-media, to override.
const portfolioRoot = process.env.PORTFOLIO_ROOT ?? String.raw`C:\Users\Gaming PC\Desktop\Repos\portfolio`;

export default {
  slug: "runner-score-arcade",
  classification: "web-app",

  curated: {
    "title": "Runner Score Arcade",
    "subtitle": "Dodg'Em Up Bro: an early Phaser runner",
    "description": "An early Phaser 3 runner: dodge the falling hazards, grab power-ups, keep your lives and push the score, on keyboard or touch. Served by a small Express app with a demo-safe local leaderboard in place of the original Kinvey backend.",
    "tags": [
      "Game",
      "Phaser",
      "Arcade",
      "Express"
    ],
    "accent": "#f97316",
    "deploymentUrl": "https://runner-score-arcade-git.pages.dev/",
    "localUrl": "http://127.0.0.1:4107/",
    "buildCommand": "npm run build",
    "buildOutput": "dist",
    "fallbackCommand": "npm start",
    "fallbackEnv": {
      "PORT": "4107"
    },
    "runCommand": "npm start",
    "devPort": 4107,
    "showcaseTier": "showcase",
    "showcaseOrder": 7
  },

  // How the portfolio screenshot pipeline photographs this project.
  capture: {
    "route": "/"
  },

  scores: {
    "priorityScore": 86,
    "demoabilityScore": 76,
    "depthScore": 66,
    "polishScore": 66,
    "uniquenessScore": 68,
    "maintenanceScore": 58
  },

  analysisNotes:
    "Historical Phaser runner with Express hosting and leaderboard flow; demoable but older stack and less polished than current games.",

  // Where the link-preview card lives: the page head that carries the Open
  // Graph tags, and the static directory the image is published from.
  social: {
    "htmlFile": "index.html",
    "pageTitle": "Dodg'Em Up Bro · Runner Score Arcade",
    "staticDir": "public",
    "imageName": "og-image.jpg",
    "imageUrlPath": "/og-image.jpg"
  },

  // The icon set is rendered from favicon.svg by scripts/generate-app-icons.mjs.
  icons: {
    "background": "#1c0a02",
    "themeColor": "#1c0a02",
    "shortName": "Runner Score"
  },

  media: {
    sourceDir: path.join(portfolioRoot, "public", "project-shots", "runner-score-arcade", "latest"),
    publicPathPrefix: "/project-shots/runner-score-arcade/latest",
    primaryProfile: "card"
  }
};

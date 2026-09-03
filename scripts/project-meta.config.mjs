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
    "subtitle": "Historical Phaser arcade game",
    "description": "An early Phaser 3 runner with hazards, power-ups, touch controls, Express hosting, and a demo-safe local leaderboard flow.",
    "tags": [
      "Phaser",
      "Express",
      "Webpack",
      "Archive"
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

  media: {
    sourceDir: path.join(portfolioRoot, "public", "project-shots", "runner-score-arcade", "latest"),
    publicPathPrefix: "/project-shots/runner-score-arcade/latest",
    primaryProfile: "card"
  }
};

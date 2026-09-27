// Metadata inputs for this repository - unique to runner-score-arcade.
//
// Everything here is curated by hand: identity, commands, the screenshot recipe
// (capture), the recorded trailer (trailers.items, kind: capture) and where the
// card, icons and trailers are published. scripts/generate-project-meta.mjs
// derives the rest into project.meta.json; scripts/project-media.test.mjs
// checks that everything here was actually produced.
//   npm run meta:refresh   trailers -> shots -> social -> icons -> meta
//   npm run test:media     the media contract

import path from 'node:path';

const portfolioRoot = process.env.PORTFOLIO_ROOT ?? String.raw`C:\Users\Gaming PC\Desktop\Repos\portfolio`;

export default {
  "slug": "runner-score-arcade",
  "classification": "web-app",
  "curated": {
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
  "capture": {
    "route": "/",
    "readySelector": "canvas",
    "readyState": "visible",
    "actions": [
      {
        "type": "wait",
        "ms": 2500,
        "label": "boot"
      },
      {
        "type": "click",
        "target": {
          "selector": "canvas"
        },
        "label": "focus the game",
        "optional": true
      },
      {
        "type": "key",
        "key": "ArrowRight",
        "holdMs": 1800,
        "label": "walk into the level"
      }
    ],
    "waitAfterReadyMs": 600,
    "quality": {
      "minStd": 6,
      "minColours": 2
    }
  },
  "scores": {
    "priorityScore": 86,
    "demoabilityScore": 76,
    "depthScore": 66,
    "polishScore": 66,
    "uniquenessScore": 68,
    "maintenanceScore": 58
  },
  "analysisNotes": "Historical Phaser runner with Express hosting and leaderboard flow; demoable but older stack and less polished than current games.",
  "social": {
    "htmlFile": "index.html",
    "pageTitle": "Dodg'Em Up Bro · Runner Score Arcade",
    "staticDir": "public",
    "imageName": "og-image.jpg",
    "imageUrlPath": "/og-image.jpg"
  },
  "icons": {
    "background": "#1c0a02",
    "themeColor": "#1c0a02",
    "shortName": "Runner Score"
  },
  "media": {
    "sourceDir": path.join(portfolioRoot, "public", "project-shots", "runner-score-arcade", "latest"),
    "publicPathPrefix": "/project-shots/runner-score-arcade/latest",
    "primaryProfile": "card"
  },
  "trailers": {
    "items": [
      {
        "id": "tour",
        "title": "Dodg'Em Up Bro: a run",
        "kind": "capture",
        "inputs": [
          "app",
          "index.html",
          "style.css"
        ],
        "source": "deployment",
        "music": "project-media/music/tour.m4a",
        "posterAt": 0.5,
        "recipe": {
          "route": "/",
          "viewport": {
            "width": 1280,
            "height": 720
          },
          "durationMs": 24000,
          "quality": {
            "minStd": 6,
            "minColours": 2
          },
          "setup": {
            "readySelector": "canvas",
            "readyState": "visible",
            "waitAfterReadyMs": 2500,
            "actions": [
              {
                "type": "click",
                "target": {
                  "selector": "canvas"
                },
                "label": "focus the game",
                "optional": true
              }
            ]
          },
          "timeline": [
            {
              "type": "wait",
              "ms": 1500
            },
            {
              "type": "key",
              "key": "ArrowRight",
              "holdMs": 1500,
              "label": "run right"
            },
            {
              "type": "key",
              "key": "ArrowLeft",
              "holdMs": 1500,
              "label": "run left"
            },
            {
              "type": "press",
              "key": "ArrowUp",
              "label": "jump"
            },
            {
              "type": "wait",
              "ms": 800
            },
            {
              "type": "key",
              "key": "ArrowLeft",
              "holdMs": 900,
              "label": "dodge"
            },
            {
              "type": "key",
              "key": "ArrowRight",
              "holdMs": 900,
              "label": "dodge"
            },
            {
              "type": "press",
              "key": "ArrowUp",
              "label": "jump"
            },
            {
              "type": "key",
              "key": "ArrowLeft",
              "holdMs": 1200,
              "label": "dodge"
            },
            {
              "type": "press",
              "key": "ArrowUp",
              "label": "jump"
            },
            {
              "type": "key",
              "key": "ArrowRight",
              "holdMs": 1500,
              "label": "dodge"
            }
          ]
        }
      }
    ]
  }
};

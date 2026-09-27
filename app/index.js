// const DodgeGame = require("/scenes/dodgeGame");
import Phaser from "./scripts/phaser.js";
import DodgeGame from "./scenes/dodgeGame";
import "./styles/sad.css";

var config = {
  type: Phaser.CANVAS,
  parent: "phaser-example",
  width: 1280,
  height: 720,
  backgroundColor: "#eadbc6",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 700 },
      debug: false
    }
  },
  scene: [DodgeGame]
};

//Creating game
var game = new Phaser.Game(config);

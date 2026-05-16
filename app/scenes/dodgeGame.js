import musicBack from "../assets/backMusic(2).mp3";
import gameOver from "../assets/gameOver.mp3";
import ooGnome from "../assets/oo.mp3";

/* Helper, Services */
import PlayerMover from "../help-scripts/playerMovement";
import CollisionsHelper from "../help-scripts/collisionsHelper";
import spriteSheethelper from "../help-scripts/loadSpriteSheets";
import imageHelper from "../help-scripts/loadImages";
import animationsHelper from "../help-scripts/animationsHelper";
import powerUpTextHelper from "../help-scripts/powerUpText";

const style2 = {
  font: "bold 40px Arial",
  fill: "#fff",
  boundsAlignH: "center",
  boundsAlignV: "middle"
};

const text0 = { x: 970, y: 16 };
const text1 = { x: 1010, y: 66 };
const text2 = { x: 1010, y: 116 };
const text3 = { x: 1010, y: 166 };
const text4 = { x: 1010, y: 216 };
const text5 = { x: 1010, y: 266 };
const text6 = { x: 1010, y: 316 };
const text7 = { x: 1010, y: 366 };
const text8 = { x: 1010, y: 416 };
const demoPlayerName = "Demo";
const demoScores = [
  { _id: "demo-1", name: "Alex", score: 980 },
  { _id: "demo-2", name: "Mira", score: 860 },
  { _id: "demo-3", name: "Noah", score: 740 },
  { _id: "demo-4", name: "Ivy", score: 680 },
  { _id: "demo-5", name: "Kai", score: 590 },
  { _id: "demo-6", name: "Lena", score: 520 },
  { _id: "demo-7", name: "Sam", score: 430 },
  { _id: "demo-8", name: "Bo", score: 360 }
];

export default class DodgeGame extends Phaser.Scene {
  constructor() {
    super({ key: "gameScene" });
    //Variables
    this.player = null;
    this.platforms = null;
    this.cursors = null;
    this.scoreText = null;
    this.spikes = null;
    this.powerUps = null;
    this.scoreText = null;
    this.gameOverText = null;
    this.replayButton = null;
    this.music = null;
    this.gameOverMusic = null;
    this.ooGnome = null;
    this.textEntry = null;
    this.scores = null;
    this.target;
    this.minScore;
    this.yourName;

    //Variables with default values
    this.score = 0;
    this.timer = 0;
    this.gameOver = false;
    this.jumped = false;
    this.crouched = false;
    this.spikeMax = 0.4;
    this.listener = 0;
    this.lives = 3;

    //this.player vars
    this.playerHeight = 225;

    //Change walking speed
    this.walkSpeed = 500;
    this.croutchSpeed = this.walkSpeed - 100;

    //Helpers
    this.playerMovementHelper = null;
    this.collisionHelper = null;
    this.spriteSheethelper = new spriteSheethelper();
    this.imageHelper = new imageHelper();
    this.animationsHelper = new animationsHelper();
  }

  preload() {
    this.spriteSheethelper.loadSpriteSheets(this.load);
    this.imageHelper.loadImages(this.load);

    //Audio
    this.load.audio("musicBack", musicBack);
    this.load.audio("gameOver", gameOver);
    this.load.audio("ooGnome", ooGnome);
    this.yourName = demoPlayerName;
  }

  addLive() {
    console.log("live func invoked");
    this.lives++;
  }

  enterName(tooLong) {
    let name;

    if (tooLong) {
      name = window.prompt(
        "Nickname was too long, please enter a new one",
        "Enter your name here"
      );
    } else if (!tooLong) {
      name = window.prompt("Name can't be empty");
    } else {
      name = window.prompt("Enter Your Nickname");
    }

    if (!name) {
      this.yourName = demoPlayerName;
    } else if (name.length > 8) {
      this.enterName(true);
    } else if (name.length === 0) {
      this.enterName(false);
    } else {
      this.yourName = name;
    }
  }

  spikeCollision(tempSpike) {
    //On Collision with enemy
    if (this.player.body.touching.up) {
      tempSpike.destroy();
      if (this.lives <= 0) {
        //Stop BG this.music and play game over this.music
        this.music.pause();
        this.gameOverMusic.play();

        let score = Math.floor(this.timer / 50);

        this.gameOverFunc();
        return;
      }
      this.powerUpTextHelper.powerUpText("spikeHit", "0");
      this.lives--;
      this.livesText.setText("Lives: " + this.lives);
    }
  }

  powerUpCollision(player, tempPowerUp) {
    let type = tempPowerUp.texture.key.split(" ")[0];
    let ammount = tempPowerUp.texture.key.split(" ")[1];
    let tempLives = this.collisionHelper.powerUpsCollision(
      tempPowerUp,
      type,
      ammount,
      this.lives
    );

    if (tempLives !== undefined) {
      this.lives = tempLives;
    }

    this.livesText.setText("Lives: " + this.lives);
    this.powerUpTextHelper.powerUpText(type, ammount);
  }

  initialAuth() {
    this.scores = demoScores.map(score => ({ ...score }));
    this.updateScoreText();
  }

  updateScores() {
    this.scores.sort((a, b) => Number(b.score) - Number(a.score));
    this.updateScoreText();
  }

  updateScoreText() {
    if (!this.score1 || !this.scores) return;
    this.score1.setText(`${this.scores[0].name}: ${this.scores[0].score}`);
    this.score2.setText(`${this.scores[1].name}: ${this.scores[1].score}`);
    this.score3.setText(`${this.scores[2].name}: ${this.scores[2].score}`);
    this.score4.setText(`${this.scores[3].name}: ${this.scores[3].score}`);
    this.score5.setText(`${this.scores[4].name}: ${this.scores[4].score}`);
    this.score6.setText(`${this.scores[5].name}: ${this.scores[5].score}`);
    this.score7.setText(`${this.scores[6].name}: ${this.scores[6].score}`);
    this.score8.setText(`${this.scores[7].name}: ${this.scores[7].score}`);
  }

  checkMin() {
    let score = Number(Math.floor(this.timer / 50));

    // let result = this.scores.map(Number(this.scores.score));
    // console.log(result);

    let tempArr = this.scores.map(score => {
      return parseInt(score.score, 10);
    });

    return {
      id: this.scores[this.scores.length - 1]._id,
      score: this.scores[this.scores.length - 1].score
    };
  }

  settupPhysics() {
    this.spikes = this.physics.add.group({});
    this.powerUps = this.physics.add.group({});

    this.spikes.children.iterate(function(child) {
      child.body.friction.x = 5;
    });

    this.physics.add.collider(this.spikes, this.powerUps);
    this.physics.add.collider(this.powerUps, this.powerUps);
    this.physics.add.collider(this.spikes, this.player, (player, tempSpike) =>
      this.spikeCollision(tempSpike)
    );
    this.physics.add.collider(
      this.powerUps,
      this.player,
      (player, tempPowerUp) => this.powerUpCollision(player, tempPowerUp)
    );

    this.physics.add.collider(this.player, this.platforms);
  }

  generateTexts() {
    this.scoreText = this.add.text(16, 16, "score: 0", {
      fontSize: "62px",
      fill: "#f6ff00"
    });

    this.livesText = this.add.text(16, 76, `Lives: ${this.lives}`, {
      fontSize: "62px",
      fill: "#fff"
    });

    this.score0 = this.add.text(text0.x, text0.y, "Highest Scores", style2);
    this.score1 = this.add.text(text1.x, text1.y, "Bobo: 1000", style2);
    this.score2 = this.add.text(text2.x, text2.y, "Bobo: 1000", style2);
    this.score3 = this.add.text(text3.x, text3.y, "Bobo: 1000", style2);
    this.score4 = this.add.text(text4.x, text4.y, "Bobo: 1000", style2);
    this.score5 = this.add.text(text5.x, text5.y, "Bobo: 1000", style2);
    this.score6 = this.add.text(text6.x, text6.y, "Bobo: 1000", style2);
    this.score7 = this.add.text(text7.x, text7.y, "Bobo: 1000", style2);
    this.score8 = this.add.text(text8.x, text8.y, "Bobo: 1000", style2);
  }

  create() {
    this.music = this.sound.add("musicBack");
    this.gameOverMusic = this.sound.add("gameOver");
    this.ooGnome = this.sound.add("ooGnome");

    this.music.play();
    this.animationsHelper.createAnimations(this.anims);

    //Background
    this.add.tileSprite(1280 / 2, 720 / 2, 1280, 720, "background");

    //Frame debug view
    this.frameView = this.add.graphics();

    //The platforms group contains the ground and the 2 ledges we can jump on
    this.platforms = this.physics.add.staticGroup();

    //Floor
    this.platforms
      .create(1280, 768, "ground")
      .setScale(2)
      .refreshBody();

    //Input Events
    this.cursors = this.input.keyboard.createCursorKeys();

    this.input.on(
      "gameobjectup",
      function(pointer, gameObject) {
        gameObject.emit("clicked", gameObject);
      },
      this
    );

    const alpha = 0.3;

    //Touch Arrows
    /*   Arrow Left   */
    //390
    //613
    this.left = this.add.image(320, 330, "baseTouchKey");
    this.left.setScale(1.25);
    this.left.alpha = alpha;
    this.left.angle -= 90;
    this.left.setInteractive();
    this.addTouchControls(this.left, this.cursors.left);

    /*   Arrow Rigth   */
    //570
    //613
    this.right = this.add.image(960, 330, "baseTouchKey");
    this.right.setScale(1.25);
    this.right.alpha = alpha;
    this.right.angle -= 270;
    this.right.setInteractive();

    this.addTouchControls(this.right, this.cursors.right);

    /*   Arrow Up   */
    //480
    //523
    this.arrowUp = this.add.image(640, 100, "baseTouchKey");
    this.arrowUp.setScale(0.4);
    this.arrowUp.alpha = alpha;
    this.arrowUp.setInteractive();
    this.addTouchControls(this.arrowUp, this.cursors.up);

    /*   Arrow Down   */
    this.down = this.add.image(640, 550, "baseTouchKey");
    this.down.setScale(0.4);
    this.down.alpha = alpha;
    this.down.angle -= 180;
    this.down.setInteractive();
    this.addTouchControls(this.down, this.cursors.down);

    this.generateTexts();
    this.initialAuth();

    //Creating this.player
    this.player = this.physics.add.sprite(
      600,
      +540,
      this.playerHeight,
      "mummy"
    );

    this.target = this.add.text(430, 290, "Text", {
      fontSize: "70px",
      fill: "#f6ff00"
    });

    this.target.alpha = 0;

    //Setting Up Helpers
    this.playerMovementHelper = new PlayerMover(this.player);
    this.powerUpTextHelper = new powerUpTextHelper(
      this.player,
      this.target,
      this.add
    );
    this.collisionHelper = new CollisionsHelper(
      this.player,
      this.playerMovementHelper,
      this.lives,
      this.addLive
    );

    //This.player physics properties
    this.player.setBounce(0.0);
    this.player.setCollideWorldBounds(true);

    //Collisions
    this.settupPhysics();
    this.player.setSize(600, this.playerHeight, true);

    this.replayButton = this.add.sprite(1280 / 2 - 200, 70, "replay");
    this.replayButton.setScale(0.125);
  }

  addTouchControls(object, cursor) {
    object.on(
      "pointerdown",
      () => {
        cursor.isDown = true;
        cursor.isUp = false;
      },
      () => {
        cursor.isDown = false;
        cursor.isUp = true;
      }
    );
    object.on("pointerup", () => {
      cursor.isDown = false;
      cursor.isUp = true;
    });
    object.on("pointerout", (pointer, event) => {
      cursor.isDown = false;
      cursor.isUp = true;
    });
  }

  updateFrameView() {}

  addSpike() {
    this.spikes
      .create(Math.random() * 1280, -100, "spike")
      .setScale(Math.random() * (1 - 0.4) + this.spikeMax);
  }

  addPowerUp() {
    let random = Math.floor(Math.random() * 9);
    let scaleNumb = Math.random() * 0.14 + 0.1;
    switch (random) {
      case 0:
        this.powerUps
          .create(Math.random() * 1280, -100, "reverse 500")
          .setScale(scaleNumb);
        break;

      case 1:
        this.powerUps
          .create(Math.random() * 1280, -100, "reverse 700")
          .setScale(scaleNumb);
        break;

      case 2:
        this.powerUps
          .create(Math.random() * 1280, -100, "reverse 1000")
          .setScale(scaleNumb);
        break;

      case 3:
        this.powerUps
          .create(Math.random() * 1280, -100, "powerUp 500")
          .setScale(scaleNumb);
        break;

      case 4:
        this.powerUps
          .create(Math.random() * 1280, -100, "powerUp 700")
          .setScale(scaleNumb);
        break;

      case 5:
        this.powerUps
          .create(Math.random() * 1280, -100, "reverse 1000")
          .setScale(scaleNumb);
        break;

      case 6:
        this.powerUps
          .create(Math.random() * 1280, -100, "powerUp 500")
          .setScale(scaleNumb);
        break;

      case 7:
        this.powerUps
          .create(Math.random() * 1280, -100, "powerUp 700")
          .setScale(scaleNumb);
        break;

      case 8:
        let numb = Math.floor(Math.random() * 3);
        if (numb === 2)
          this.powerUps
            .create(Math.random() * 1280, -100, "star 0")
            .setScale(0.12);
        break;
    }
  }

  gameOverFunc() {
    //

    this.name = this.add.text(390, 290, `${this.yourName} you scored:`, {
      fontSize: "50px",
      fill: "#f6ff00"
    });

    this.textEntry = this.add.text(
      500,
      340,
      `${Number(Math.floor(this.timer / 50))} points !`,
      {
        fontSize: "50px",
        fill: "#fff"
      }
    );

    this.gameOver = "Ended";

    this.replayButtonFunc();
  }

  clearMemo() {
    if (this.gameOver !== "Ended") {
      let spikes = this.spikes.children.entries;
      let spikesLength = this.spikes.children.entries.length - 1;
      let powerUps = this.powerUps.children.entries;
      let powerUpsLength = this.powerUps.children.entries.length - 1;

      if (spikes[0] !== undefined && spikes[0].y > 1000) {
        spikes[0].destroy();
      }

      if (powerUps[0] !== undefined && powerUps[0].y > 1000) {
        powerUps[0].destroy();
      }
    }
  }

  resetVars() {
    this.timer = 0;
    this.lives = 3;
    this.walkSpeed = 500;
    this.croutchSpeed = this.walkSpeed - 100;
    this.spikeMax = 0.4;
    this.gameOver = false;
    this.replayButton.destroy();
    this.music.play();
    this.playerMovementHelper.reset();

    this.livesText.setText("Lives: " + this.lives);
  }

  replayButtonFunc() {
    this.add.tween({
      targets: this.replayButton,
      ease: "Sine.easeInOut",
      y: 540,
      x: 640,
      duration: 2000,
      delay: 0,
      alpha: 0,
      onComplete: () => {
        this.replayButton.setScale(0.2);
        this.add.tween({
          targets: this.replayButton,
          ease: "Sine.easeInOut",
          duration: 2000,
          delay: 0,
          alpha: 1,
          yoyo: true,
          repeat: -1
        });
      }
    });

    this.replayButton.setInteractive();
    this.spikes.children.entries = [];

    this.replayButton.on("clicked", () => {
      //auth.createNewScore("bubu", 1000);

      let score = Number(Math.floor(this.timer / 50));
      let minScore = this.checkMin();

      if (score > minScore.score) {
        this.scores = this.scores.filter(item => item._id !== minScore.id);
        this.scores.push({ _id: `demo-${Date.now()}`, score: Number(score), name: this.yourName });
        this.updateScores();
      }

      this.name.destroy(), this.textEntry.destroy(), this.resetVars();
    });
  }

  //Movement
  update() {
    //Checking if game is over
    if (this.gameOver === false) {
      this.timer++;
      this.crouched = false;
      this.scoreText.setText("Score: " + Math.floor(this.timer / 50));

      let score = Math.floor(this.timer / 50);

      //Checking phase
      let randomNum = Math.floor(Math.random() * 10);
      if (score < 10) {
        if (this.timer % 20 === 0 || this.timer === 1) {
          if (randomNum >= 1 && randomNum <= 4) {
            this.addSpike();
          } else {
            this.addPowerUp();
          }
        }
      }

      //Checking phase
      else if (score >= 10) {
        if (this.timer % 10 === 0 || this.timer === 1) {
          if (randomNum >= 1 && randomNum <= 6) {
            this.addSpike();
          } else {
            this.addPowerUp();
          }
        }
      }

      //Preventing memory leaks

      this.crouched = false;

      this.playerMovementHelper.playerMovment(this.cursors);
    } else if (this.gameOver == "Ended") {
      this.player.setVelocityX(0);
      this.player.anims.play("flex", true);
    }

    this.clearMemo();
  }
}

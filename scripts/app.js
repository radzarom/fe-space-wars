//import { Loader } from '@pixi/loaders';

console.log(PIXI);

let app = new PIXI.Application({ width: 1400, height: 800 });

let soundtrack = new Howl({
  src: ["../sound/soundtrack.mp3"],
  html5: true,
});

//client player
//create player sprite
let player = PIXI.Sprite.from("../graphics/ship.png");
//track health
let playerHealth = 100;
//scale dimensions
player.width = 50;
player.height = 50;
//x, y velocity
player.dx = 0;
player.dy = 0;
//makes the position of sprite the center instead of upper left
player.anchor.set(0.5);
//for tracking ship angle and mouse cursor coords, used for vectors
let angle = 0;
let mousePosition;
//keep track of all bullets on screeen
let bullets = [];
let bulletsToSend = [];
let bulletSpeed = 7;
//keeps track of key presses
let keys = {};

//opponent
let opponent = PIXI.Sprite.from("../graphics/ship.png");
opponentHealth = 100;
opponent.width = 50;
opponent.height = 50;
opponent.anchor.set(0.5);
opponent.rotation = 0;
let opponentBullets = [];
let bulletsReceived = [];

function countdown() {
  let count = 5;
  const body = document.querySelector("body");
  const countDownContainer = document.createElement("div");
  countDownContainer.setAttribute("id", "countDownContainer");
  body.appendChild(countDownContainer);

  const countDownText = document.createElement("p");
  countDownContainer.appendChild(countDownText);
  countDownText.setAttribute("id", "countDownText");
  countDownText.innerText = "Get Ready\n" + count;

  let interval = setInterval(() => {
    count -= 1;
    countDownText.innerText = "Get Ready\n" + count;
    if (count <= 0) {
      countDownText.remove();
      countDownContainer.remove();
      clearInterval(interval);
      createGame();
    }
  }, 1000);
}

//Set up DOM for game, adds background, keyboard mouse interactivity in a gameloop
function createGame() {
  //set up game variables
  gameStarted = true;
  player.x = startPos[0];
  player.y = startPos[1];
  opponent.x = enemyStartPos[0];
  opponent.y = enemyStartPos[1];
  player.rotation = startAngle;
  opponent.rotation = enemyStartAngle;

  //create player health bar
  const playerHealthBar = document.createElement("div");
  playerHealthBar.setAttribute("id", "playerhealthbar");
  const currentPlayerHealth = document.createElement("div");
  currentPlayerHealth.setAttribute("id", "currentplayerhealth");
  const playerName = document.createElement("p");
  playerName.setAttribute("id", "playerName");
  playerName.innerText = username;

  //create opponent health bar
  const opponentHealthBar = document.createElement("div");
  opponentHealthBar.setAttribute("id", "opponenthealthbar");
  const currentOpponentHealth = document.createElement("div");
  currentOpponentHealth.setAttribute("id", "currentopponenthealth");
  const opponentName = document.createElement("p");
  opponentName.setAttribute("id", "playerName");
  opponentName.innerText = otherPlayer;

  //add them to DOM
  document.getElementById("body").appendChild(playerHealthBar);
  document.getElementById("body").appendChild(opponentHealthBar);
  document.getElementById("playerhealthbar").appendChild(currentPlayerHealth);
  document
    .getElementById("opponenthealthbar")
    .appendChild(currentOpponentHealth);
  document.getElementById("playerhealthbar").appendChild(playerName);
  document.getElementById("opponenthealthbar").appendChild(opponentName);

  //box for pixi app
  const gameDiv = document.createElement("div");
  gameDiv.setAttribute("id", "gameDiv");
  document.getElementById("body").appendChild(gameDiv);

  //append app to in the DOM
  document.querySelector("#gameDiv").appendChild(app.view);

  //renders 60 star shapes in background
  for (let i = 0; i < 150; i++) {
    const star = new PIXI.Graphics();
    //draws a star at random width and height, with random number of points between 4-8, random radius 5-15
    star
      .beginFill(0xadadad)
      .drawStar(
        Math.random() * app.screen.width,
        Math.random() * app.screen.height,
        Math.random() * 4 + 4,
        Math.random() * 5 + 1
      )
      .endFill();

    //add star to DOM
    app.stage.addChild(star);
  }

  app.stage.addChild(player);
  app.stage.addChild(opponent);

  //allows mousechange to trigger changes from anywhere on page
  app.stage.hitArea = app.screen;
  app.stage.interactive = true;
  //on mouse move, determine angle needed for ship
  app.stage.on("mousemove", movePlayer);

  //on click fire bullet
  app.stage.on("pointerdown", fireBullet);

  //adds gameLoop function to the ticker so it is updated with each frame
  app.ticker.add(gameLoop);

  //event listeners for key press
  window.addEventListener("keydown", keysDown);
  window.addEventListener("keyup", keysUp);

  soundtrack.play();
}

//anything inside of here gets ran on each tick, i think...
function gameLoop(delta, direction) {
  updateBullets(delta, direction);
  updatePosition();
  bulletsReceived = [];

  if (ws != 0) {
    const messageBody = {
      x: player.x,
      y: player.y,
      username,
      angle,
      bullets: bulletsToSend,
      playerHealth
    };

    bulletsToSend = [];

    ws.send(JSON.stringify(messageBody));
  }
}

function animateExplosion(thisPlayer) {
  const loader = PIXI.Loader.shared;
  loader.add("tileset", "../explosion/explosions2.json").load(setup);
  function setup(loader, resources) {
    const textures = [];
    for (let i = 0; i < 64; i++) {
      const texture = PIXI.Texture.from(`explosion2-${i}.png`);
      textures.push(texture);
    }
    thisPlayer = new PIXI.AnimatedSprite(textures);
    thisPlayer.position.set(400, 400);
    thisPlayer.scale.set(1, 1);
    app.stage.addChild(thisPlayer);
    thisPlayer.play();
   // drag.loop = false;
   thisPlayer.animationSpeed = 0.5;
  }
}

function endGameOnWin() {
  
  animateExplosion(player);
  
  
    // app.stop()

    // const winnerIs = document.createElement('p')
    // winnerIs.setAttribute('id', 'winnerIs')
    // winnerIs.innerText = `Winner is ${username}`

    // document.getElementById('body').innerHTML = ""
    // document.getElementById('body').appendChild(winnerIs)
    
}

function endGameOnLoss() {
  animateExplosion(opponent);
  // app.stop();

  // const loserIs = document.createElement("p");
  // loserIs.setAttribute("id", "loserIs");
  // loserIs.innerText = `Loser is ${otherPlayer}`;

  // document.getElementById("body").innerHTML = "";
  // document.getElementById("body").appendChild(loserIs);
}

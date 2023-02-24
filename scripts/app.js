
let app = new PIXI.Application({ width: 1400, height: 800});
const loader = PIXI.Loader.shared;
loader.add("tileset", "../explosion/explosions2.json").load(setupExplosion);

const backgroundTexture = PIXI.Texture.from('../graphics/spaceBackground.png');
  const backgroundSprite = new PIXI.TilingSprite(backgroundTexture, app.screen.width, app.screen.height);
  backgroundSprite.tileScale.set(1, 1.2);

const asteroid1 = new PIXI.Sprite.from('../graphics/asteroid1.png');
asteroid1.x = 300;
asteroid1.y = 500;
asteroid1.anchor.set(0.5);

const asteroid2 = new PIXI.Sprite.from('../graphics/asteroid2.png');
asteroid2.x = 1200;
asteroid2.y = 200;
asteroid2.anchor.set(0.5);
asteroid2.scale.set(0.4)

const asteroid3 = new PIXI.Sprite.from('../graphics/asteroid2.png');
asteroid3.x = 800;
asteroid3.y = 350;
asteroid3.anchor.set(0.5);

const asteroid4 = new PIXI.Sprite.from('../graphics/asteroid2.png');
asteroid4.x = 100;
asteroid4.y = 600;
asteroid4.anchor.set(0.5);
asteroid4.scale.set(0.3);


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
  const gameDiv = document.getElementById("gameDiv");
  gameDiv.style.height = "100%"
  const countDownContainer = document.createElement("div");
  countDownContainer.setAttribute("id", "countDownContainer");
  gameDiv.appendChild(countDownContainer);

  const countDownText = document.createElement("p");
  countDownContainer.appendChild(countDownText);
  countDownText.setAttribute("id", "countDownText");
  countDownText.innerHTML = "<span>Get Ready</span><br/>" + count;

  let interval = setInterval(() => {
    count -= 1;
    countDownText.innerHTML = "<span>Get Ready</span><br/>" + count;
    if (count <= 0) {
      countDownText.remove();
      countDownContainer.remove();
      clearInterval(interval);
      gameDiv.style.height = "auto"
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
  const playerHealthContainer = document.createElement("div");
  playerHealthContainer.setAttribute("id", "playerHealthContainer");
  const playerHealthBar = document.createElement("div");
  playerHealthBar.setAttribute("id", "playerhealthbar");
  const currentPlayerHealth = document.createElement("div");
  currentPlayerHealth.setAttribute("id", "currentplayerhealth");
  const playerName = document.createElement("p");
  playerName.setAttribute("id", "playerName");
  playerName.innerText = username;

  //create opponent health bar
  const opponentHealthContainer = document.createElement("div");
  opponentHealthContainer.setAttribute("id", "opponentHealthContainer");
  const opponentHealthBar = document.createElement("div");
  opponentHealthBar.setAttribute("id", "opponenthealthbar");
  const currentOpponentHealth = document.createElement("div");
  currentOpponentHealth.setAttribute("id", "currentopponenthealth");
  const opponentName = document.createElement("p");
  opponentName.setAttribute("id", "opponentName");
  opponentName.innerText = otherPlayer;

  currentPlayerHealth.style.backgroundColor = "green";
  currentOpponentHealth.style.backgroundColor = "green";

  //box for pixi app
  // const gameDiv = document.createElement("div");
  // gameDiv.setAttribute("id", "gameDiv");
  // document.getElementById("body").appendChild(gameDiv);

  //append app to in the DOM
  document.getElementById("gameDiv").appendChild(app.view);
  
  app.stage.addChild(backgroundSprite);
  app.stage.addChild(asteroid1);
  app.stage.addChild(asteroid2);
  app.stage.addChild(asteroid3);
  app.stage.addChild(asteroid4);

  //add them to DOM
  document.getElementById("gameDiv").appendChild(playerHealthContainer);
  document.getElementById("gameDiv").appendChild(opponentHealthContainer);
  document.getElementById("playerHealthContainer").appendChild(playerHealthBar);
  document.getElementById("opponentHealthContainer").appendChild(opponentName);
  document.getElementById("opponentHealthContainer").appendChild(opponentHealthBar);
  document.getElementById("playerhealthbar").appendChild(currentPlayerHealth);
  document.getElementById("opponenthealthbar").appendChild(currentOpponentHealth);
  document.getElementById("playerhealthbar").appendChild(playerName);

  // //renders 60 star shapes in background
  // for (let i = 0; i < 150; i++) {
  //   const star = new PIXI.Graphics();
  //   //draws a star at random width and height, with random number of points between 4-8, random radius 5-15
  //   star
  //     .beginFill(0xadadad)
  //     .drawStar(
  //       Math.random() * app.screen.width,
  //       Math.random() * app.screen.height,
  //       Math.random() * 4 + 4,
  //       Math.random() * 5 + 1
  //     )
  //     .endFill();

  //   //add star to DOM
  //   app.stage.addChild(star);
  // }

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
  backgroundSprite.tilePosition.x -= 3;

  asteroid1.x -= 1;
  asteroid1.rotation += 0.01
  if(asteroid1.x < -400) {
    asteroid1.x = app.view.width + 60;
    asteroid1.y = Math.random() * app.view.height + 1
  }

  asteroid2.x -= 2;
  asteroid2.rotation -= 0.02
  if(asteroid2.x < -400) {
    asteroid2.x = app.view.width + 40;
    asteroid2.y = Math.random() * app.view.height + 1
  }

  asteroid3.x -= 2;
  asteroid3.rotation -= 0.02
  if(asteroid3.x < -400) {
    asteroid3.x = app.view.width + 40;
    asteroid3.y = Math.random() * app.view.height + 1
  }

  asteroid4.x -= 2;
  asteroid4.rotation += 0.02
  if(asteroid4.x < -400) {
    asteroid4.x = app.view.width + 40;
    asteroid4.y = Math.random() * app.view.height + 1
  }

  if (!gameEnded) {
    const messageBody = {
      x: player.x,
      y: player.y,
      username,
      angle,
      bullets: bulletsToSend,
      playerHealth,
    };

    bulletsToSend = [];

    ws.send(JSON.stringify(messageBody));
  }
}

function setupExplosion(loader, resources) {
  textures = [];
  for (let i = 0; i < 64; i++) {
    const texture = PIXI.Texture.from(`explosion2-${i}.png`);
    textures.push(texture);
  }
}

function animateExplosion(thisPlayer) {
  
  const x = thisPlayer.x;
  const y = thisPlayer.y;
  app.stage.removeChild(thisPlayer);

  const explosion = new PIXI.AnimatedSprite(textures);
  explosion.anchor.set(0.5);
  explosion.position.set(x, y);
  explosion.scale.set(1, 1);
  app.stage.addChild(explosion);
  explosion.play();
  explosion.loop = false;
  explosion.animationSpeed = 0.5;
  explosion.onComplete = () => { 
    app.stage.removeChild(explosion)};
}

function makeWinLossScreen(message) {
  
  const gameDiv = document.getElementById("gameDiv");
  const winlossContainer = document.createElement("div");
  winlossContainer.setAttribute("id", "winlosscontainer");
  gameDiv.appendChild(winlossContainer);

  const winlossMsg = document.createElement("p");
  winlossContainer.appendChild(winlossMsg);
  winlossMsg.setAttribute("id", "winlossMsg");
  winlossMsg.innerHTML = message;

  const replay = document.createElement("button");
  replay.setAttribute("id", "replayButton");
  replay.setAttribute("class", "button-85")
  replay.setAttribute("onClick", "restart();startGame()");

  replay.innerText = "Start Again"
  winlossContainer.appendChild(replay);
}

function endGameOnWin() {
  animateExplosion(opponent);
  makeWinLossScreen(`<span>GAME OVER</span><br/>Player ${username}, you won!`);

  // app.stop()

  // const winnerIs = document.createElement('p')
  // winnerIs.setAttribute('id', 'winnerIs')
  // winnerIs.innerText = `Winner is ${username}`

  // document.getElementById('body').innerHTML = ""
  // document.getElementById('body').appendChild(winnerIs)
}

function endGameOnLoss() {
  animateExplosion(player);
  makeWinLossScreen(`<span>GAME OVER</span><br/>Player ${username}, you lost...`);
  // app.stop();

  // const loserIs = document.createElement("p");
  // loserIs.setAttribute("id", "loserIs");
  // loserIs.innerText = `Loser is ${otherPlayer}`;

  // document.getElementById("body").innerHTML = "";
  // document.getElementById("body").appendChild(loserIs);
}

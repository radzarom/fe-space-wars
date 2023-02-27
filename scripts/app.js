
//adds game countdown before start
function countdown() {
  let count = 5;
  const gameDiv = document.getElementById("gameDiv");
  gameDiv.style.height = "100%";
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
      gameDiv.style.height = "auto";
      createGame();
    }
  }, 1000);
}

const particleContainer = PIXI.ParticleContainer();


//Set up DOM for game, player start positions, adds background, keyboard mouse interactivity in a gameloop
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

  //resets health bar color for replay
  currentPlayerHealth.style.backgroundColor = "rgba(0,255,0,0.5)";
  currentOpponentHealth.style.backgroundColor = "rgba(0,255,0,0.5)";


  //append app to in the DOM
  document.getElementById("gameDiv").appendChild(app.view);

  //add asteroids to the game in correct position depending on server
  if(asteroidPos === 0){
    asteroidGame1.x = 400;
    asteroidGame1.y = 300;
    asteroidGame2.x = 900;
    asteroidGame2.y = 500;
  }
  else if(asteroidPos === 1){
    asteroidGame1.x = 200;
    asteroidGame1.y = 550;
    asteroidGame2.x = 900;
    asteroidGame2.y = 200;
  }
  else if(asteroidPos === 2){
    asteroidGame1.x = 200;
    asteroidGame1.y = 250;
    asteroidGame2.x = 1100;
    asteroidGame2.y = 500;
  }
  else if(asteroidPos === 3){
    asteroidGame1.x = 500;
    asteroidGame1.y = 450;
    asteroidGame2.x = 900;
    asteroidGame2.y = 350;
  }
  
  //add asteroids and background to stage
  app.stage.addChild(backgroundSprite);
  app.stage.addChild(asteroid1);
  app.stage.addChild(asteroid2);
  app.stage.addChild(asteroid3);
  app.stage.addChild(asteroid4);
  app.stage.addChild(asteroidGame1);
  app.stage.addChild(asteroidGame2);



  //add healthbars to DOM
  document.getElementById("gameDiv").appendChild(playerHealthContainer);
  document.getElementById("gameDiv").appendChild(opponentHealthContainer);
  document.getElementById("playerHealthContainer").appendChild(playerHealthBar);
  document.getElementById("opponentHealthContainer").appendChild(opponentName);
  document
    .getElementById("opponentHealthContainer")
    .appendChild(opponentHealthBar);
  document.getElementById("playerhealthbar").appendChild(currentPlayerHealth);
  document
    .getElementById("opponenthealthbar")
    .appendChild(currentOpponentHealth);
  document.getElementById("playerhealthbar").appendChild(playerName);


  //app.stage.addChild(particleContainer);
  //add player sprites to stage
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

  //play soundtrack
  soundtrack.play();
}

//anything inside of here gets ran on each tick, updates bullets, position, collision detection etc.
function gameLoop(delta, direction) {

  updateBullets(delta, direction);
  updatePosition();
  asteroidCollisionDetection(asteroidGame1,0);
  asteroidCollisionDetection(asteroidGame2,1);

  //scroll background
  backgroundSprite.tilePosition.x -= 3;


  //scroll and rotate asteroid
  asteroid1.x -= 1;
  asteroid1.rotation += 0.01;
  //when asteroid leaves screen set x coords to other side at random height
  if (asteroid1.x < -400) {
    asteroid1.x = app.view.width + 60;
    asteroid1.y = Math.random() * app.view.height + 1;
  }

  asteroid2.x -= 2;
  asteroid2.rotation -= 0.02;
  if (asteroid2.x < -400) {
    asteroid2.x = app.view.width + 40;
    asteroid2.y = Math.random() * app.view.height + 1;
  }

  asteroid3.x -= 2;
  asteroid3.rotation -= 0.02;
  if (asteroid3.x < -400) {
    asteroid3.x = app.view.width + 40;
    asteroid3.y = Math.random() * app.view.height + 1;
  }

  asteroid4.x -= 2;
  asteroid4.rotation += 0.02;
  if (asteroid4.x < -400) {
    asteroid4.x = app.view.width + 40;
    asteroid4.y = Math.random() * app.view.height + 1;
  }

  asteroidGame1.rotation += 0.02;
  asteroidGame2.rotation -= 0.013;

  //new bullets to create from opponent
  bulletsReceived = [];

  

  //if the game has not ended keep sending updates to server
  if (!gameEnded) {
    const messageBody = {
      x: player.x,
      y: player.y,
      username,
      angle,
      bullets: bulletsToSend,
      playerHealth,
    };
    //new bullets to send to opponent
    bulletsToSend = [];

    ws.send(JSON.stringify(messageBody));
  }
}

//creates DOM for win/loss screen and adds replay button
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
  replay.setAttribute("class", "button-85");
  replay.setAttribute("onClick", "restart();startGame()");

  replay.innerText = "Start Again";
  winlossContainer.appendChild(replay);
}

//end game on win, blow up opponent ship
function endGameOnWin() {
  animateExplosion(opponent);
  makeWinLossScreen(`<span>GAME OVER</span><br/>Player ${username}, you won!`);
}

//end on loss, blow up player ship
function endGameOnLoss() {
  animateExplosion(player);
  makeWinLossScreen(
    `<span>GAME OVER</span><br/>Player ${username}, you lost...`
  );
}

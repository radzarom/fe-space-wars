let teamName = "";
let username = "";
let otherPlayer = "";
let startPos = [];
let enemyStartPos = [];
let startAngle;
let enemyStartAngle;

let currentPosX;
let currentPosY;
let currentAngle;
let health = 100;
let currentBullets = [];

let otherPosX;
let otherPosY;
let otherAngle;
let otherHealth = 100;
let otherBullets = [];
const speed = 10;

let asteroidPos;

let gameStarted = false;
let gameEnded = false;

const site = "ws://spacewarserver.eu-4.evennode.com";

let ws = 0;

function restart() {

  ws = 0
  app.stop()
  app = new PIXI.Application({ width: 1400, height: 800 });
  loader.destroy()

  teamName = ""
  otherPlayer = "";
  playerHealth = 100
  opponentHealth = 100
  player.dx = 0;
  player.dy = 0;
  gameStarted = false;
  gameEnded = false;
  
  const gameDiv = document.getElementById("gameDiv");

  gameDiv.innerHTML = `
  <div id="instructions">
      <button onClick="showInstructions()" class="button-85">Instructions</button>
      <div id="showInstructions">
          <p>use WASD to move</p>
          <p>turn to shoot with mouse and click</p>
          <p>destroy your enemy and survive</p>
      </div>
  </div>
  <div id="outerDiv">
      <div id="mainContainer">
          <img id="logo" src="../graphics/logo.png"/>
          <div id="buttonContainer">
              <input id="playername-input" class="button-85" type="text" placeholder="enter your name here"
                  value=""></input>
              <span id="information"></span>
              <button onclick="startGame()" id="startButton" class="button-85" role="button">Start Game</button>
          </div>
          <span id="findingPlayer"></span>
          <div id="loadingContainer">
              <span class="loader"></span>
          </div>
      </div>
  </div>`

  loadingContainer.style.display = "none";

  if(username !== "") {
    document.getElementById("playername-input").value = username;
  }
}
restart()

async function startGame() {
  let usernameInput = document.getElementById("playername-input");

  username = usernameInput.value;

  if (username === "") {
    document.getElementById("information").innerText = "Please enter a name";
    return;
  }

  ws = new WebSocket(site + "/unmatched?username=" + username);

  ws.onopen = function (e) {
    const messageBody = { username };
    ws.send(JSON.stringify(messageBody));
  };

  function removeStarting() {
    document.getElementById("outerDiv").remove();
    document.getElementById("instructions").remove();
  }

  ws.onmessage = (webSocketMessage) => {
    const messageBody = JSON.parse(webSocketMessage.data);

    if (messageBody.message === "username") {
      document.getElementById("information").innerText = "User name taken";
    } else if (messageBody.message === "waiting") {
      document.getElementById("findingPlayer").innerText =
        "Waiting for another player...";
      loadingContainer.style.display = "block";
      document.getElementById("buttonContainer").remove();

      return;
    } else if (messageBody.message === "paired") {
      removeStarting();
      teamName = messageBody.teamName;
      otherPlayer = messageBody.otherPlayer;
      startPos = messageBody.startPos;
      enemyStartPos = messageBody.enemyStartPos;
      startAngle = messageBody.angle;
      enemyStartAngle = messageBody.enemyAngle;
      asteroidPos = messageBody.asteroidPos;
      playGame();
    }
  };
}

function declareEndGame() {
  const messageBody = {
    lost: true,
    username,
    otherPlayer
  };

  if (!gameEnded) {

    ws.send(JSON.stringify(messageBody));
  }
}

async function playGame() {
  ws = new WebSocket(site + "/matched?team=" + teamName);

  window.onbeforeunload = function () {
    declareEndGame();
  };

  ws.onopen = function (e) {
    //Selects div to append app to in the DOM
    //createGame();
    countdown();

    // player.x = startPos[0];
    // player.y = startPos[1];
    // opponent.x = enemyStartPos[0];
    // opponent.y = enemyStartPos[1];
    // player.rotation = startAngle;
    // opponent.rotation = enemyStartAngle;
  };

  ws.onmessage = (webSocketMessage) => {
    if (!gameStarted) {
      return;
    }

    if (gameEnded) {
      return;
    }

    const messageBody = JSON.parse(webSocketMessage.data);

    if (messageBody.lost) {
      if (username !== messageBody.username) {
        gameEnded = true;
        opponentHealth = 0;
        document.getElementById(
          "currentopponenthealth"
        ).style.width = `${opponentHealth}%`;
        endGameOnWin();
        return;
      } else {
        gameEnded = true;
        playerHealth = 0;
        document.getElementById(
          "currentplayerhealth"
        ).style.width = `${playerHealth}%`;
        endGameOnLoss();
        return;
      }
    }

    if (messageBody.username !== username) {
      opponent.x = messageBody.x;
      opponent.y = messageBody.y;
      opponent.rotation = messageBody.angle + Math.PI / 2;
      bulletsReceived = messageBody.bullets;
      opponentHealth = messageBody.playerHealth;

      document.getElementById(
        "currentopponenthealth"
      ).style.width = `${opponentHealth}%`;

      if (opponentHealth <= 30) {
        document.getElementById("currentopponenthealth").style.backgroundColor =
          "red";
      }

      for (let bullet of bulletsReceived) {
        opponentBullets.push(
          createBullet(
            bullet[0],
            bullet[1],
            bullet[2],
            opponent.rotation + Math.PI / 2
          )
        );
        laserSound.play();
      }
    }
  };
}

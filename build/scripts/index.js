
//tracks game start and end to stop communications at right time
let gameStarted = false;
let gameEnded = false;

const site = "ws://spacewarserver.eu-4.evennode.com";

let ws = 0;

//ran on game replay button click
function restart() {

  //stop pixi app
  app.stop()
  //make new one
  app = new PIXI.Application({ width: 1400, height: 800 });

  //reset loader for tileset
  loader.destroy()
  
  //stop soundtrack
  soundtrack.stop();

  //reset player variables
  teamName = ""
  otherPlayer = "";
  playerHealth = 100
  opponentHealth = 100
  player.dx = 0;
  player.dy = 0;
  gameStarted = false;
  gameEnded = false;
  
  //get container div and insert startpage again
  const gameDiv = document.getElementById("gameDiv");

  gameDiv.innerHTML = `
  <div id="instructions">
      <button onClick="showInstructions()" class="button-85">Instructions</button>
      <div id="showInstructions">
          <p>1. use WASD to move</p>
          <p>2. press space to decrease velocity</p>
          <p>3. use mouse and click to turn and shoot</p>
          <p>4. use asteroids to take cover</p>
          <p>5. fly over a power up to regain health and deal more damage on your next shot</p> 
          <p>6. survive</p>
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

  //set loading wheel to not visible
  loadingContainer.style.display = "none";

  //autofill playername
  if(username !== "") {
    document.getElementById("playername-input").value = username;
  }
}

restart()

//connects with server and finds match
async function startGame() {
  //take playername from input field
  let usernameInput = document.getElementById("playername-input");
  username = usernameInput.value;

  //if empty show message asking for name
  if (username === "") {
    document.getElementById("information").innerText = "Please enter a name";
    return;
  }

  //set websocket to tell server of unmatched player
  ws = new WebSocket(site + "/unmatched?username=" + username);

  //send players name
  ws.onopen = function (e) {
    const messageBody = { username };
    ws.send(JSON.stringify(messageBody));
  };

  //removes start screen
  function removeStarting() {
    document.getElementById("outerDiv").remove();
    document.getElementById("instructions").remove();
  }

  //deal with server message info on pairing status
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
    } 
    else if (messageBody.message === "paired") {

      //remove start screen and set initial player coors etc
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

//when player loses sends message to server with both usernames
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

//deal with communications with server during game
async function playGame() {
  ws = new WebSocket(site + "/matched?team=" + teamName);

  //on window exit declare your loss
  window.onbeforeunload = function () {
    declareEndGame();
  };

  //on player pairing run the game countdown
  ws.onopen = function (e) {
   
    countdown();
  };

  //deals with message from server
  ws.onmessage = (webSocketMessage) => {

    //stop running if game not yet started, or it has ended
    if (!gameStarted) {
      return;
    }

    if (gameEnded) {
      return;
    }

    const messageBody = JSON.parse(webSocketMessage.data);

    //if server send lost message
    if (messageBody.lost) {

      //decide who to display a loss or a win
      if (username !== messageBody.username) {

        gameEnded = true;
        opponentHealth = 0;
        //update health bar
        document.getElementById(
          "currentopponenthealth"
        ).style.width = `${opponentHealth}%`;
        endGameOnWin();
        return;
      } 
      else {

        gameEnded = true;
        playerHealth = 0;
        document.getElementById(
          "currentplayerhealth"
        ).style.width = `${playerHealth}%`;
        endGameOnLoss();
        return;
      }
    }


    //update opponent info
    if (messageBody.username !== username) {

      //set opponent coords, and health, receive new bullets
      opponent.x = messageBody.x;
      opponent.y = messageBody.y;
      opponent.rotation = messageBody.angle + Math.PI / 2;
      bulletsReceived = messageBody.bullets;
      opponentHealth = messageBody.playerHealth;
      const opponentPoweredUp = messageBody.poweredUp
      const powerUpCoords = messageBody.powerUpCoords
      if(messageBody.powerUpCoords !== undefined) {
        if(powerUpCoords[0] != powerUp.x) {
          
          powerUpVisible = false
          powerUp.x = powerUpCoords[0]
          powerUp.y = powerUpCoords[1]
          setTimeout(() => {
            powerUpVisible = true
          }, 7000)
        }
      }


      //set size of health bar
      document.getElementById(
        "currentopponenthealth"
      ).style.width = `${opponentHealth}%`;
      //set health bar to red on low health
      if (opponentHealth <= 30) {
        document.getElementById("currentopponenthealth").style.backgroundColor =
          "rgba(255,0,0,0.5)";
      }
      //create new opponent bullets
      for (let bullet of bulletsReceived) {


        // let bulletType = "opponent"

        // let height = 30;
        // let width = 5;

        // console.log(opponentPoweredUp, "2");
        // if(opponentPoweredUp) {
        //   bulletType = "extraPower";
        //   height = 100;
        //   width = 100;
        // }    

        const opponentBullet = createBullet(bullet[0], bullet[1], bullet[2], opponent.rotation + Math.PI / 2, bullet[3])

        opponentBullets.push(opponentBullet);
        //play laser sound for each bullet
        laserSound.play();
      }
    }
  };
}

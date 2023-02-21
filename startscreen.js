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
let health = 100
let currentBullets = [];


let otherPosX;
let otherPosY;
let otherAngle;
let otherHealth = 100
let otherBullets = [];
const speed = 10;

//const site = "ws://localhost:8080";
const site = "ws://spacewarserver.eu-4.evennode.com";
//const site = "ws://spacewarsbackend.onrender.com";

let ws = 0

async function startGame() {
   let usernameInput = document.getElementById("playername-input");
   username = usernameInput.value;
 
    ws = new WebSocket(site + "/unmatched?username=" + username);
 
   ws.onopen = function (e) {
     const messageBody = { username };
     ws.send(JSON.stringify(messageBody));
   };
 
   function removeStarting() {
   //   document.getElementById("startbutton")?.remove();
   //   usernameInput.innerHTML = "";
   //   usernameInput?.remove();
   //   document.getElementById("spanname")?.remove();
   document.getElementById("grid-container").remove();

   }
 
   ws.onmessage = (webSocketMessage) => {
     const messageBody = JSON.parse(webSocketMessage.data);
     
     if (messageBody.message === "username") {
       document.getElementById("connection-feedback").innerText =
       "User name taken";
     }
     else if (messageBody.message === "waiting") {
       document.getElementById("connection-feedback").innerText =
       "Waiting for another player...";
       //removeStarting();
       return;
     } else if (messageBody.message === "paired"){
       removeStarting();
       teamName = messageBody.teamName;
       otherPlayer = messageBody.otherPlayer;
       startPos = messageBody.startPos;
       enemyStartPos = messageBody.enemyStartPos;
       startAngle = messageBody.angle;
       enemyStartAngle = messageBody.enemyAngle;
 
      //  document.getElementById("players").innerText =
      //    username + " vs " + otherPlayer;
       //document.getElementById("connection-feedback").innerText = "";
       playGame();
     }
   };
 }

 function declareEndGame() {
    const messageBody = {
      lost: true,
      username,
    };
    
    ws.send(JSON.stringify(messageBody));
 }
 

 async function playGame() {
    ws = new WebSocket(site + "/matched?team=" + teamName);
 
   window.onbeforeunload = function () {
     declareEndGame()
   };
 
   ws.onopen = function (e) {

    //Selects div to append app to in the DOM
    createGame();
    
     player.x = startPos[0];
     player.y = startPos[1];
     opponent.x = enemyStartPos[0];
     opponent.y = enemyStartPos[1];
     player.rotation = startAngle;
     opponent.rotation = enemyStartAngle;
   };
 
   ws.onmessage = (webSocketMessage) => {
     const messageBody = JSON.parse(webSocketMessage.data);
 
     if (messageBody.lost) {
       if (username !== messageBody.username) {
        endGameOnWin()
         return;
       } else {
        endGameOnLoss()
         return;
       }
     }
 
     if (messageBody.username === username) {
      //  currentPosX = messageBody.x;
      //  currentPosY = messageBody.y;
     } else {
        opponent.x = messageBody.x;
        opponent.y = messageBody.y;
        opponent.rotation = messageBody.angle + Math.PI/2
        bulletsReceived = messageBody.bullets
        opponentHealth = messageBody.playerHealth

        console.log(opponentHealth);
        document.getElementById('currentopponenthealth').style.width = `${opponentHealth}%`

       for(let bullet of bulletsReceived) {
        
        opponentBullets.push(createBullet(bullet[0], bullet[1], bullet[2], opponent.rotation + Math.PI/2))
      }
     }
   };
 
 }

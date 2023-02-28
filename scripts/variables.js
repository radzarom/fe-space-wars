//starts pixi application
let app = new PIXI.Application({ width: 1400, height: 800 });

//adds tileset for ship explosion
const loader = PIXI.Loader.shared;
loader.add("tileset", "../explosion/explosions2.json").load(setupExplosion);

//adds background soundtrack
let soundtrack = new Howl({
    src: ["../sound/soundtrack.mp3"],
    html5: true,
    loop: true
  });

//adss moving background texture
const backgroundTexture = PIXI.Texture.from("../graphics/spaceBackground.png");
const backgroundSprite = new PIXI.TilingSprite(
  backgroundTexture,
  app.screen.width,
  app.screen.height
);
backgroundSprite.tileScale.set(1, 1.2);

//add background asteroid sprite
const asteroid1 = new PIXI.Sprite.from("../graphics/asteroid1.png");
asteroid1.x = 300;
asteroid1.y = 500;
asteroid1.anchor.set(0.5);

const asteroid2 = new PIXI.Sprite.from("../graphics/asteroid2.png");
asteroid2.x = 1200;
asteroid2.y = 200;
asteroid2.anchor.set(0.5);
asteroid2.scale.set(0.4);

const asteroid3 = new PIXI.Sprite.from("../graphics/asteroid2.png");
asteroid3.x = 800;
asteroid3.y = 350;
asteroid3.anchor.set(0.5);

const asteroid4 = new PIXI.Sprite.from("../graphics/asteroid2.png");
asteroid4.x = 100;
asteroid4.y = 600;
asteroid4.anchor.set(0.5);
asteroid4.scale.set(0.3);

//add game asteroids
const asteroidGame1 = new PIXI.Sprite.from("../graphics/gameAsteroid.png");
asteroidGame1.anchor.set(0.5);
asteroidGame1.scale.set(1.5);

const asteroidGame2= new PIXI.Sprite.from("../graphics/gameAsteroid.png");
asteroidGame2.anchor.set(0.5);
asteroidGame2.scale.set(1.5);

//add powerup 
const powerUp= new PIXI.Sprite.from("../graphics/ballBullet.png");
powerUp.anchor.set(0.5);
//powerUp.scale.set(1);

//client player
//create player sprite
let player = PIXI.Sprite.from("../graphics/playerShip.png");
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
let poweredUp = false;
const powerUpStatus = [powerUp.x, powerUp.y, true]
//keeps track of key presses
let keys = {};


//opponent
let opponent = PIXI.Sprite.from("../graphics/opponentShip.png");
opponentHealth = 100;
opponent.width = 50;
opponent.height = 50;
opponent.anchor.set(0.5);
opponent.rotation = 0;
let opponentBullets = [];
let bulletsReceived = [];


//server data
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
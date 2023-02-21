let app = new PIXI.Application({width: 1400, height: 800})

//create player sprite
let player = PIXI.Sprite.from('ship.png')
//scale dimensions
player.width = 50
player.height = 50

//player1 start coords
player.x = 0
player.y = 0

//x, y velocity
player.dx = 0
player.dy = 0
//makes the position of sprite the center instead of upper left
player.anchor.set(0.5)
//sets player sprite to the center of screen

//add player sprite to DOM

//for tracking ship angle and mouse cursor coords, used for vectors
let angle = 0
let mousePosition;
//keep track of all bullets on screeen
let bullets = []
let bulletsToSend = []
let bulletSpeed = 7
//keeps track of key presses
let keys = {}


//player y 
let opponent = PIXI.Sprite.from('ship.png')
opponent.x = 100
opponent.y = 100
opponent.width = 50
opponent.height = 50
opponent.anchor.set(0.5)
opponent.rotation = 0
let opponentBullets = []
let bulletsReceived = []

function createGame() {

    const gameDiv = document.createElement('div')
    gameDiv.setAttribute('id', 'gameDiv')
    document.getElementById('body').appendChild(gameDiv)
    //Creates Pixi application
    
    //Selects div to append app to in the DOM
    document.querySelector("#gameDiv").appendChild(app.view)


    //renders 60 star shapes in background
    for(let i = 0; i < 150; i++) {
    const star = new PIXI.Graphics();
    //draws a star at random width and height, with random number of points between 4-8, random radius 5-15
    star.beginFill(0xADADAD).drawStar(Math.random() * app.screen.width, Math.random() * app.screen.height, Math.random() * 4 + 4, Math.random() * 5 + 1)
    .endFill()

    //add star to DOM
    app.stage.addChild(star)
    }

    app.stage.addChild(player)
    app.stage.addChild(opponent)

    //allows mousechange to trigger changes from anywhere on page
    app.stage.hitArea = app.screen;
    app.stage.interactive = true;
    //on mouse move, determine angle needed for ship
    app.stage.on('mousemove', movePlayer);


    //on click fire bullet
    app.stage.on("pointerdown", fireBullet);

    //adds gameLoop function to the ticker so it is updated with each frame
    app.ticker.add(gameLoop);

    //event listeners for key press
    window.addEventListener("keydown", keysDown);
    window.addEventListener("keyup", keysUp);
}

function movePlayer(e) {
    //updates global variable for this
    mousePosition = e.data.global;

    let playerPosition = player.getGlobalPosition();

    //do math thing
    angle = Math.atan2(mousePosition.y - playerPosition.y, mousePosition.x - playerPosition.x)

    //calculate angle of rotation
    player.rotation = angle + Math.PI/2
}


// //Selects div to append app to in the DOM
// document.querySelector("#gameDiv").appendChild(app.view)


// //renders 60 star shapes in background
// for(let i = 0; i < 150; i++) {
//     const star = new PIXI.Graphics();
//     //draws a star at random width and height, with random number of points between 4-8, random radius 5-15
//     star.beginFill(0xADADAD).drawStar(Math.random() * app.screen.width, Math.random() * app.screen.height, Math.random() * 4 + 4, Math.random() * 5 + 1)
//     .endFill()

//     //add star to DOM
//     app.stage.addChild(star)
// }

//create player sprite
// let player = PIXI.Sprite.from('ship.png')
// //scale dimensions
// player.width = 50
// player.height = 50
// //x, y velocity
// player.dx = 0
// player.dy = 0
// //makes the position of sprite the center instead of upper left
// player.anchor.set(0.5)
// //sets player sprite to the center of screen
// player.position.set(app.screen.width/2, app.screen.height / 2)
// //add player sprite to DOM
// app.stage.addChild(player)
// //for tracking ship angle and mouse cursor coords, used for vectors
// let angle = 0
// let mousePosition;
// //keep track of all bullets on screeen
// let bullets = []
// let bulletSpeed = 7
// //keeps track of key presses
// let keys = {}

// //player y 
// let opponent = PIXI.Sprite.from('ship.png')
// opponent.x = 100
// opponent.y = 100
// opponent.width = 50
// opponent.height = 50
// opponent.anchor.set(0.5)
// opponent.rotation = 0
// app.stage.addChild(opponent)

// //allows mousechange to trigger changes from anywhere on page
// app.stage.hitArea = app.screen;
// app.stage.interactive = true;

// //on mouse move, determine angle needed for ship
// app.stage.on('mousemove', movePlayer);

//     function movePlayer(e) {
//         //updates global variable for this
//         mousePosition = e.data.global;

//         let playerPosition = player.getGlobalPosition();

//         //do math thing
//         angle = Math.atan2(mousePosition.y - playerPosition.y, mousePosition.x - playerPosition.x)

//         //calculate angle of rotation
//         player.rotation = angle + Math.PI/2
//     }

// //on click fire bullet
// app.stage.on("pointerdown", fireBullet);

//     //adds gameLoop function to the ticker so it is updated with each frame
//     app.ticker.add(gameLoop);

    //gets vector for bullet using cursor coords and center position
    function fireBullet(e) {

        //vector calc
        let direction = {}
        direction.x = mousePosition.x - player.x;
        direction.y = mousePosition.y - player.y;

        let length = Math.sqrt(direction.x*direction.x + direction.y*direction.y);
        direction.x /= length;
        direction.y /= length;

        //create bullet, passing vector
        let bullet = createBullet(player.x, player.y, direction);
        //add it to the array of existing bullets so it can be updated
        bullets.push(bullet);
        bulletsToSend.push([player.x, player.y, direction])
    }

    function createBullet(x, y, direction) {
        //makes new bullet sprite
        let bullet = PIXI.Sprite.from('bullet.png');

        bullet.height = 30
        bullet.width = 5
        //set direction with vector
        bullet.direction = direction
        //set position of bullet to middle of sprite
        bullet.anchor.set(0.5);

        //offsets start of bullet path to front of ship rather than center
        bullet.x = x + direction.x*40;
        bullet.y = y + direction.y*40;
        bullet.speed = bulletSpeed;

        //determine appropriate rotation for bullet from ship angle
        bullet.rotation = angle + Math.PI/2;
        //add to DOM
        app.stage.addChild(bullet);

        return bullet;
    }

    //iterates over bullets array to give new coords
    function updateBullets(delta, direction) {
        for(let i = 0; i < bullets.length; i++) {
            bullets[i].position.y += bullets[i].direction.y*bulletSpeed
            bullets[i].position.x += bullets[i].direction.x*bulletSpeed

            //conditions for determining if bullet is offscreen go here, set to dead
            if(bullets[i].position.y < 0) {
                bullets[i].dead = true;
            }
        }


        for(let i = 0; i < opponentBullets.length; i++) {
            
            opponentBullets[i].position.y += opponentBullets[i].direction.y*bulletSpeed
            opponentBullets[i].position.x += opponentBullets[i].direction.x*bulletSpeed
            //conditions for determining if bullet is offscreen go here, set to dead
            if(opponentBullets[i].y < 0) {
                opponentBullets[i].dead = true;
            }
        }

        //then remove bullets from DOM and bullets array
        for(let i = 0; i < bullets.length; i++) {
            if(bullets[i].dead) {
                app.stage.removeChild(bullets[i])
                bullets.splice(i, 1);
            }
        }

        //then remove bullets from DOM and bullets array
        for(let i = 0; i < opponentBullets.length; i++) {
            if(opponentBullets[i].dead) {
                app.stage.removeChild(opponentBullets[i])
                opponentBullets.splice(i, 1);
            }
        }
    }



    function keysDown(e) {

        keys[e.keyCode] = true;
    }

    function keysUp(e) {

        keys[e.keyCode] = false;
    }

    function updatePosition() {

        if(player.y >= 25 && player.y <= app.view.height -25) {

            player.y += player.dy
        }
            else if (player.y <= 25 && player.dy < 0) {
                player.dy = 0
                
            }
            else if(player.y >= app.view.height -25 && player.dy > 0) {
                player.dy = 0
            }
            else {
                player.y += player.dy
            }

        if(player.x >= 25 && player.x <= app.view.width -25) {

            player.x += player.dx
        }
            else if (player.x <= 25 && player.dx < 0) {
                player.dx = 0
                
            }
            else if(player.x >= app.view.width - 25 && player.dx > 0) {
                player.dx = 0
            }
            else {
                player.x += player.dx
            }


        if(player.x >= 0 && player.x <= app.view.width) {

            player.x += player.dx
        }

        // W
        if(keys["87"]) {
            
            player.dy -= 0.1    
        }
        // S
        if(keys["83"]) {
           
            player.dy += 0.1
        }
        // A
        if(keys["65"]) {
            
            player.dx -= 0.1
        }
        // D
        if(keys["68"]) {
            
            player.dx += 0.1
        }
        if(keys["32"]) {
            if(player.dy > 0) {

                player.dy -= 0.2
            }
            else if(player.dy < 0) {
                player.dy += 0.2
            }
            if(player.dx > 0) {

                player.dx -= 0.2
            }
            else if(player.dx < 0){
                player.dx += 0.2
            }
        }
    }

//anything inside of here gets ran on each tick, i think...
function gameLoop(delta, direction) {

    
    updateBullets(delta, direction);
    updatePosition();
    bulletsReceived = [];

    console.log(opponentBullets);

    if(ws != 0) {

        const messageBody = {
            x: player.x,
            y: player.y,
            username,
            angle,
            bullets: bulletsToSend
        };

        bulletsToSend = [];
        
        ws.send(JSON.stringify(messageBody))
    }
}

// //Counts seconds elapsed since start
// let elapsed = 0.0;

// //applications ticker runs a callback every frame, delta is the amount of time since last tick
// app.ticker.add((delta) => {
//   // Add the time to our total elapsed time
//   elapsed += delta;

//   //gives ship a hover effect
//   // Update sprite X position based on the cosine of our elapsed time.  
//   //elapsed/X changes speed of movement
// //   player.x = app.screen.width / 2 + Math.sin(elapsed/15.0) * 10.0;
// //   player.y = app.screen.height / 2 + Math.sin(elapsed/25.0) * 10.0;
// });


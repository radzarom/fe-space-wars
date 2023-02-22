

function movePlayer(e) {
    //updates global variable for this
    mousePosition = e.data.global;

    let playerPosition = player.getGlobalPosition();

    //do math thing
    angle = Math.atan2(mousePosition.y - playerPosition.y, mousePosition.x - playerPosition.x)

    //calculate angle of rotation
    player.rotation = angle + Math.PI/2
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
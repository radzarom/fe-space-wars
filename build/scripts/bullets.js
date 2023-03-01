

//gets vector for bullet using cursor coords and center position
function fireBullet(e) {

  let bulletType = "player";
  let height = 30
  let width = 5

  if(poweredUp) {
    bulletType = "extraPower";
    poweredUp = false;
    height = 100
    width = 100
  }


  //vector calc
  let direction = {};
  direction.x = mousePosition.x - player.x;
  direction.y = mousePosition.y - player.y;

  let length = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
  direction.x /= length;
  direction.y /= length;

  //create bullet, passing vector
  let bullet = createBullet(player.x, player.y, direction, angle, bulletType);
  //add it to the array of existing bullets so it can be updated
  
  bullets.push(bullet);

  
  //array of new bullets to send to player
  bulletsToSend.push([player.x, player.y, direction, bulletType]);

}

function createBullet(x, y, direction, angle, type) {
  //makes new bullet sprite
  let bullet = PIXI.Sprite.from(`../graphics/${type}Bullet.png`);
  bullet.bulletType = type;

  

  bullet.height = 30;
  bullet.width = 5;
  bullet.anchor.set(1, 0.5);
  if(type === "extraPower") {
    bullet.width = 50;
    bullet.height = 50;
    bullet.anchor.set(0.5);
    blastSound.play();
  } else laserSound.play();

  //set direction with vector
  bullet.direction = direction;
  //set position of bullet to middle of sprite
  

  //offsets start of bullet path to front of ship rather than center
  bullet.x = x + direction.x * 40;
  bullet.y = y + direction.y * 40;
  bullet.speed = bulletSpeed;

  //determine appropriate rotation for bullet from ship angle
  bullet.rotation = angle + Math.PI / 2;
  //add to DOM
  app.stage.addChild(bullet);

  return bullet;
}

//detects collison of bullet and player
function collisionDetection(player, bullet) {
  //amount to narrow hitbox
  let remove = 15;

  //get bound of bullet and player
  let playerBox = player.getBounds();
  let bulletBox = bullet.getBounds();

  return (
    playerBox.x + (playerBox.width - remove) > bulletBox.x &&
    playerBox.x < bulletBox.x + (bulletBox.width - remove) &&
    playerBox.y + (playerBox.height - remove) > bulletBox.y &&
    playerBox.y < bulletBox.y + (bulletBox.height + remove)
  );
}

//deetects collision of bullet and asteroid
function asteroidDetection(asteroid, bullet) {

  const asteroidX = asteroid.x;
  const asteroidY = asteroid.y;
  const asteroidRadius = 50;

  const bulletX = bullet.x;
  const bulletY = bullet.y;
  const bulletRadius = 23;

  //work out intersection
  const dx = bulletX - asteroidX;
  const dy = bulletY - asteroidY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < asteroidRadius + bulletRadius) {
    return true;
  } else {
    return false;
  }
}

//iterates over bullets array to give new coords
function updateBullets(delta, direction) {
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].position.y += bullets[i].direction.y * bulletSpeed;
    bullets[i].position.x += bullets[i].direction.x * bulletSpeed;

    
    if(bullets[i].bulletType === "extraPower") {
      bullets[i].rotation += 1.1
    }
    //if theres a collision set bullet to be removed
    if (
      collisionDetection(opponent, bullets[i]) ||
      asteroidDetection(asteroidGame1, bullets[i]) ||
      asteroidDetection(asteroidGame2, bullets[i])
    ) {

      bullets[i].dead = true;
    }

    //conditions for determining if bullet is offscreen go here, set for removal
    if (bullets[i].position.y < 0 || bullets[i].x < 0 ||
      bullets[i].y > app.view.height ||
      bullets[i].x > app.view.width) {

      bullets[i].dead = true;
    }

    //if bullets go offscreen set for removal
    if (
      bullets[i].y < 0 ||
      bullets[i].x < 0 ||
      bullets[i].y > app.view.height ||
      bullets[i].x > app.view.width
    ) {

      bullets[i].dead = true;
    }
  }

  //update opponent bullets
  for (let i = 0; i < opponentBullets.length; i++) {
    opponentBullets[i].position.y += opponentBullets[i].direction.y * bulletSpeed;
    opponentBullets[i].position.x += opponentBullets[i].direction.x * bulletSpeed;

    if(opponentBullets[i].bulletType === "extraPower") {
      opponentBullets[i].rotation += 1.1
    }
    //conditions for determining if bullet is offscreen go here, set to dead
    if (
      asteroidDetection(asteroidGame1, opponentBullets[i]) ||
      asteroidDetection(asteroidGame2, opponentBullets[i])
    ) {
      opponentBullets[i].dead = true;
    }

    //if opponent bullet hits player, drain health
    if (collisionDetection(player, opponentBullets[i])) {


      playerHealth -= 10;
     
      if(opponentBullets[i].bulletType === "extraPower") {
        
        playerHealth -= 10;
      }

      //if player health is less or equal to 0 declare loss
      if (playerHealth <= 0) {
        declareEndGame();
      }

      opponentBullets[i].dead = true;
      document.getElementById(
        "currentplayerhealth"
      ).style.width = `${playerHealth}%`;

      //if player health is less than or equal to 30 set health bar to red
      if (playerHealth <= 30) {
        document.getElementById("currentplayerhealth").style.backgroundColor =
          "rgba(255,0,0,0.5)";
      }
    }

    //if opponent bullets go offscreen set for removal
    if (
      opponentBullets[i].y < 0 ||
      opponentBullets[i].x < 0 ||
      opponentBullets[i].y > app.view.height ||
      opponentBullets[i].x > app.view.width
    ) {

      opponentBullets[i].dead = true;
    }
  }

  //then remove player bullets
  for (let i = 0; i < bullets.length; i++) {
    if (bullets[i].dead) {
      app.stage.removeChild(bullets[i]);
      bullets.splice(i, 1);
    }
  }

  //then remove opponent bullets
  for (let i = 0; i < opponentBullets.length; i++) {
    if (opponentBullets[i].dead) {
      app.stage.removeChild(opponentBullets[i]);
      opponentBullets.splice(i, 1);
    }
  }
}

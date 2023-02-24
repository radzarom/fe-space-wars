const laserSound = new Howl({
  src: ["../sound/laserSound.mp3"],
  volume: 0.3,
});

//gets vector for bullet using cursor coords and center position
function fireBullet(e) {
  //vector calc
  let direction = {};
  direction.x = mousePosition.x - player.x;
  direction.y = mousePosition.y - player.y;

  let length = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
  direction.x /= length;
  direction.y /= length;

  //create bullet, passing vector
  let bullet = createBullet(player.x, player.y, direction, angle);
  //add it to the array of existing bullets so it can be updated
  bullets.push(bullet);

  bulletsToSend.push([player.x, player.y, direction]);

  laserSound.play();
}

function createBullet(x, y, direction, angle) {
  //makes new bullet sprite
  let bullet = PIXI.Sprite.from("../graphics/bullet.png");

  bullet.height = 30;
  bullet.width = 5;
  //set direction with vector
  bullet.direction = direction;
  //set position of bullet to middle of sprite
  bullet.anchor.set(1, 0.5);

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

function collisionDetection(player, bullet) {
  let remove = 15;
  let playerBox = player.getBounds();
  let bulletBox = bullet.getBounds();

  return (
    playerBox.x + (playerBox.width - remove) > bulletBox.x &&
    playerBox.x < bulletBox.x + (bulletBox.width - remove) &&
    playerBox.y + (playerBox.height - remove) > bulletBox.y &&
    playerBox.y < bulletBox.y + (bulletBox.height + remove)
  );
}

function asteroidDetection(asteroid, bullet) {
  const asteroidX = asteroid.x;
  const asteroidY = asteroid.y;
  const asteroidRadius = 50;
  const bulletX = bullet.x;
  const bulletY = bullet.y;
  const bulletRadius = 23;
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
    if (
      collisionDetection(opponent, bullets[i]) ||
      asteroidDetection(asteroidGame1, bullets[i]) ||
      asteroidDetection(asteroidGame2, bullets[i])
    ) {
      bullets[i].dead = true;
    }

    //conditions for determining if bullet is offscreen go here, set to dead
    if (bullets[i].position.y < 0) {
      bullets[i].dead = true;
    }

    if (
      bullets[i].y < 0 ||
      bullets[i].x < 0 ||
      bullets[i].y > app.view.height ||
      bullets[i].x > app.view.width
    ) {
      bullets[i].dead = true;
    }
  }

  for (let i = 0; i < opponentBullets.length; i++) {
    opponentBullets[i].position.y +=
      opponentBullets[i].direction.y * bulletSpeed;
    opponentBullets[i].position.x +=
      opponentBullets[i].direction.x * bulletSpeed;
    //conditions for determining if bullet is offscreen go here, set to dead
    if (
      asteroidDetection(asteroidGame1, opponentBullets[i]) ||
      asteroidDetection(asteroidGame2, opponentBullets[i])
    ) {
      opponentBullets[i].dead = true;
    }

    if (collisionDetection(player, opponentBullets[i])) {
      playerHealth -= 10;

      if (playerHealth <= 0) {
        declareEndGame();
      }
      opponentBullets[i].dead = true;
      document.getElementById(
        "currentplayerhealth"
      ).style.width = `${playerHealth}%`;

      if (playerHealth <= 30) {
        document.getElementById("currentplayerhealth").style.backgroundColor =
          "rgba(255,0,0,0.5)";
      }
    }
    if (
      opponentBullets[i].y < 0 ||
      opponentBullets[i].x < 0 ||
      opponentBullets[i].y > app.view.height ||
      opponentBullets[i].x > app.view.width
    ) {
      opponentBullets[i].dead = true;
    }
  }

  //then remove bullets from DOM and bullets array
  for (let i = 0; i < bullets.length; i++) {
    if (bullets[i].dead) {
      app.stage.removeChild(bullets[i]);
      bullets.splice(i, 1);
    }
  }

  //then remove bullets from DOM and bullets array
  for (let i = 0; i < opponentBullets.length; i++) {
    if (opponentBullets[i].dead) {
      app.stage.removeChild(opponentBullets[i]);
      opponentBullets.splice(i, 1);
    }
  }
}

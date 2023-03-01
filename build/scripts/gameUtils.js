//determines ship collision with asteroid
let hitAsteroidArray = [false, false];
function asteroidCollisionDetection(asteroid, num) {
  const asteroidX = asteroid.x;
  const asteroidY = asteroid.y;
  const asteroidRadius = 50;
  const playerX = player.x;
  const playerY = player.y;
  const playerRadius = 23;
  const dx = asteroidX - playerX;
  const dy = asteroidY - playerY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < asteroidRadius + playerRadius) {
    if (!hitAsteroidArray[num]) {
      player.dx = -player.dx / 4;
      player.dy = -player.dy / 4;
      hitAsteroidArray[num] = true;
    }
  } else {
    hitAsteroidArray[num] = false;
  }
}

function powerUpCollision() {
  const powerUpX = powerUp.x;
  const powerUpY = powerUp.y;
  const powerUpRadius = 35;
  const playerX = player.x;
  const playerY = player.y;
  const playerRadius = 23;
  const dx = powerUpX - playerX;
  const dy = powerUpY - playerY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < powerUpRadius + playerRadius) {
    pickupSound.play();

    playerHealth += 10;
    if (playerHealth > 100) {
      playerHealth = 100;
    }

    document.getElementById(
      "currentplayerhealth"
    ).style.width = `${playerHealth}%`;

    //if player health is less than or equal to 30 set health bar to red
    if (playerHealth <= 30) {
      document.getElementById("currentplayerhealth").style.backgroundColor =
        "rgba(255,0,0,0.5)";
    }

    poweredUp = true;
    powerUpVisible = false;
    powerUp.x = Math.random() * (app.view.width - 100 + 1) + 50;
    powerUp.y = Math.random() * (app.view.height - 100 + 1) + 50;

    setTimeout(() => {
      powerUpVisible = true;
    }, 7000);

    return [powerUp.x, powerUp.y];
  }
}

//sets up textures for ship explosion
function setupAnimation(loader, resources) {
  explosionTextures = [];
  //load up each frame of explosion
  for (let i = 0; i < 64; i++) {
    const texture = PIXI.Texture.from(`explosion2-${i}.png`);
    explosionTextures.push(texture);
  }

  damageTextures = [];
  //load up each frame of explosion
  for (let i = 0; i < 14; i++) {
    const texture = PIXI.Texture.from(`damage-${i}.png`);
    damageTextures.push(texture);
  }
}

//sets up ship explosion sprite and plays animation at correct coords
function animateExplosion(thisPlayer) {
  const x = thisPlayer.x;
  const y = thisPlayer.y;
  app.stage.removeChild(thisPlayer);

  const explosion = new PIXI.AnimatedSprite(explosionTextures);
  explosion.anchor.set(0.5);
  explosion.position.set(x, y);
  explosion.scale.set(1, 1);
  app.stage.addChild(explosion);
  explosion.play();
  explosion.loop = false;
  explosion.animationSpeed = 0.5;
  explosion.onComplete = () => {
    app.stage.removeChild(explosion);
  };
}

function animateDamage(thisPlayer) {
  const damage = new PIXI.AnimatedSprite(damageTextures);
  damage.anchor.set(0.5);
  damage.position.set(thisPlayer.x, thisPlayer.y);
  damage.scale.set(1, 1);
  app.stage.addChild(damage);
  damage.play();
  damage.loop = false;
  damage.animationSpeed = 0.5;

  damage.onComplete = () => {
    app.stage.removeChild(damage);
  };

  damage.onFrameChange = () => {
    damage.position.set(thisPlayer.x, thisPlayer.y);
};
}

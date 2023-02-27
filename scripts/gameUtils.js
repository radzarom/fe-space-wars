
//determines ship collision with asteroid
let hitAsteroidArray = [false,false];
function asteroidCollisionDetection(asteroid,num) {
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
  }
  else{
    hitAsteroidArray[num] = false;
  }
}

//sets up textures for ship explosion
function setupExplosion(loader, resources) {
    textures = [];
    //load up each frame of explosion
    for (let i = 0; i < 64; i++) {
      const texture = PIXI.Texture.from(`explosion2-${i}.png`);
      textures.push(texture);
    }
  }
  
  //sets up ship explosion sprite and plays animation at correct coords
  function animateExplosion(thisPlayer) {
    const x = thisPlayer.x;
    const y = thisPlayer.y;
    app.stage.removeChild(thisPlayer);
  
    const explosion = new PIXI.AnimatedSprite(textures);
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
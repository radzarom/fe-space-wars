const container = new PIXI.Container();

// Create a new texture

let emitter = new PIXI.particles.Emitter(
    container,
    {
        "lifetime": {
            "min": 0.1,
            "max": 0.3
        },
        "frequency": 0.001,
        "emitterLifetime": 0,
        "maxParticles": 1000,
        "addAtBack": false,
        "pos": {
            "x": 0,
            "y": 0
        },
        "behaviors": [
            {
                "type": "alpha",
                "config": {
                    "alpha": {
                        "list": [
                            {
                                "time": 0,
                                "value": 0.62
                            },
                            {
                                "time": 1,
                                "value": 0
                            }
                        ]
                    }
                }
            },
            {
                "type": "moveSpeedStatic",
                "config": {
                    "min": 500,
                    "max": 500
                }
            },
            {
                "type": "scale",
                "config": {
                    "scale": {
                        "list": [
                            {
                                "time": 0,
                                "value": 0.25
                            },
                            {
                                "time": 1,
                                "value": 0.75
                            }
                        ]
                    },
                    "minMult": 1
                }
            },
            {
                "type": "color",
                "config": {
                    "color": {
                        "list": [
                            {
                                "time": 0,
                                "value": "cffffb"
                            },
                            {
                                "time": 1,
                                "value": "2d9e4ed"
                            }
                        ]
                    }
                }
            },
            {
                "type": "rotation",
                "config": {
                    "accel": 0,
                    "minSpeed": 50,
                    "maxSpeed": 50,
                    "minStart": 265,
                    "maxStart": 275
                }
            },
            {
                "type": "textureRandom",
                "config": {
                    "textures": [
                        "../graphics/particle.png",
                        "../graphics/Fire.png"
                    ]
                }
            },
            {
                "type": "spawnShape",
                "config": {
                    "type": "torus",
                    "data": {
                        "x": 0,
                        "y": -20,
                        "radius": 10,
                        "innerRadius": 0,
                        "affectRotation": false
                    }
                }
            }
        ]
    }

);

let emitter2 = new PIXI.particles.Emitter(
    container,
    {
        "lifetime": {
            "min": 0.1,
            "max": 0.3
        },
        "frequency": 0.001,
        "emitterLifetime": 0,
        "maxParticles": 1000,
        "addAtBack": false,
        "pos": {
            "x": 0,
            "y": 0
        },
        "behaviors": [
            {
                "type": "alpha",
                "config": {
                    "alpha": {
                        "list": [
                            {
                                "time": 0,
                                "value": 0.62
                            },
                            {
                                "time": 1,
                                "value": 0
                            }
                        ]
                    }
                }
            },
            {
                "type": "moveSpeedStatic",
                "config": {
                    "min": 500,
                    "max": 500
                }
            },
            {
                "type": "scale",
                "config": {
                    "scale": {
                        "list": [
                            {
                                "time": 0,
                                "value": 0.25
                            },
                            {
                                "time": 1,
                                "value": 0.75
                            }
                        ]
                    },
                    "minMult": 1
                }
            },
            {
                "type": "color",
                "config": {
                    "color": {
                        "list": [
                            {
                                "time": 0,
                                "value": "ed4609"
                            },
                            {
                                "time": 1,
                                "value": "fff957"
                            }
                        ]
                    }
                }
            },
            {
                "type": "rotation",
                "config": {
                    "accel": 0,
                    "minSpeed": 50,
                    "maxSpeed": 50,
                    "minStart": 265,
                    "maxStart": 275
                }
            },
            {
                "type": "textureRandom",
                "config": {
                    "textures": [
                        "../graphics/particle.png",
                        "../graphics/Fire.png"
                    ]
                }
            },
            {
                "type": "spawnShape",
                "config": {
                    "type": "torus",
                    "data": {
                        "x": 0,
                        "y": -20,
                        "radius": 10,
                        "innerRadius": 0,
                        "affectRotation": false
                    }
                }
            }
        ]
    }

);


// Calculate the current time
var elapsed = Date.now();

// Update function every frame
var update = function(){
	// Update the next frame
	requestAnimationFrame(update);
	var now = Date.now();

    emitter.ownerPos.x = player.x;
    emitter.ownerPos.y = player.y;
    emitter.rotation =player.rotation - Math.PI;
	emitter.update((now - elapsed) * 0.001);

    emitter2.ownerPos.x = opponent.x;
    emitter2.ownerPos.y = opponent.y;
    emitter2.rotation =opponent.rotation - Math.PI;
	emitter2.update((now - elapsed) * 0.001);

	elapsed = now;
};

// Start emitting
//emitter.emit = true;


// Start the update
update();
import Player from '../sprites/Player.js';
import levels from '../levels';

const flowerTiles = [10, 14, 16, 18, 20, 22, 24, 28];

class Level extends Phaser.Scene {

    constructor (config)
    {
        super((config) ? config : { key: 'level' });
        this.map = undefined;
        this.tiles = undefined;
        this.layer = undefined;
        this.startPoint = {x: 160, y: 120, facing: 'left'};
        this.player = undefined;
    }

    create()
    {
        this.cameras.main.setRoundPixels(true);

        // start controls
        this.controls.start();


        //let mapKey = levels[this.levelstats.currentLevel].map;
        let mapKey = 'map';
        this.map = this.make.tilemap({ key: mapKey });
        this.tiles = this.map.addTilesetImage('tiles', 'tiles', 8, 8, 1, 2);
        this.layer = this.map.createDynamicLayer(0, this.tiles, 0, 0);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        // only up collisions
        this.map.setCollision([39, 45, 47]);
        this.map.forEachTile(this.setCollisionOnlyUp, this, 0, 0, this.map.width, this.map.height);

        // all round collisions
        this.map.setCollision([64, 63, 62, 61, 56, 55, 54, 53, 43, 38, 33]);

        // score
        this.points = 0;
        this.maxPoints = 100;
        this.isRestarting = false;

        this.setObjectPositionsFromMap();

        // the player
        this.player = new Player(this, this.startPoint.x, this.startPoint.y, 'player', 0, this.startPoint.facing);
        this.cameras.main.startFollow(this.player, true, 0.5);
        this.physics.add.collider(this.player, this.layer);

        // stamina bar
        this.staminaBarOuter = this.add.image(this.scale.width / 2, this.scale.height - 8, 'staminabar-outer');
        this.staminaBarOuter.setScrollFactor(0);
        this.staminaBarOuter.setDepth(4);
        this.staminaBarCenter = this.add.image(this.scale.width / 2 - 78, this.scale.height - 8, 'staminabar-center');
        this.staminaBarCenter.setScrollFactor(0);
        this.staminaBarCenter.setDepth(4);
        this.staminaBarCenter.setOrigin(0, 0.5);
        this.staminaBarInner = this.add.image(this.scale.width / 2 - 78, this.scale.height - 8, 'staminabar-inner');
        this.staminaBarInner.setScrollFactor(0);
        this.staminaBarInner.setDepth(4);
        this.staminaBarInner.setOrigin(0, 0.5);

        this.flowerParticles = this.add.particles('particles');
        this.flowerParticles.setDepth(1);
        this.flowerParticlesEmitter = this.flowerParticles.createEmitter({
            frame: [0, 1, 2, 3],
            x: 200,
            y: 300,
            speed: { min: 32, max: 64},
            angle: { min: 270, max: 270 },
            scale: { start: 1, end: 1 },
            alpha: { start: 1, end: 0 },
            lifespan: 800,
            gravityY: 0,
            frequency: -1,
            rotate: { min: 0, max: 0 }
        });
        this.flowerParticlesTimer = 2000;

        this.groundParticles = this.add.particles('particles');
        this.groundParticlesEmitter = this.groundParticles.createEmitter({
            frame: [8, 9, 10, 11],
            x: 200,
            y: 300,
            speed: { min: 96, max: 160},
            angle: { min: 225, max: 315 },
            scale: { start: 2, end: 0 },
            lifespan: 1000,
            gravityY: 250,
            frequency: -1,
            rotate: { min: -540, max: 540 }
        });

        this.dust.addOnePixelDust({ count: 36, alpha: 1 , tint: 0xffffff });

        this.ambient.play();
        this.cameras.main.flash(300, fadeColor.r, fadeColor.g, fadeColor.b);
    }

    update(time, delta)
    {
        this.player.update(this.controls, time, delta);
        //console.log(this.player.body);
        this.playerTileCollision(this.map.getTilesWithinWorldXY(this.player.body.x, this.player.body.y, this.player.body.width, this.player.body.height));
        this.staminaBarCenter.displayWidth = Math.min(Math.ceil(this.player.stamina / this.player.maxStamina * 156), 156);
        this.staminaBarInner.displayWidth = Math.min(Math.ceil(this.player.restTimer / this.player.stamina * this.staminaBarCenter.displayWidth), this.staminaBarCenter.displayWidth);
        if (this.player.stamina >= this.player.maxStamina) {
            this.gameComplete();
        }

        if (this.player.body.velocity.y < 0) {
            if (this.ambient.sounds.buzz) {
                this.ambient.sounds.buzz.volume = Math.abs(this.player.body.velocity.y / this.player.maxFlyPower);
            }
        }
        this.flowerParticlesEmitter.setPosition(this.player.x - 4 + Math.floor(Math.random() * 9), this.player.y);
        if (this.flowerParticlesTimer > 1000) {
            this.flowerParticlesEmitter.stop();
        }
        this.flowerParticlesTimer += delta;
    }

    resizeField(w, h)
    {
        if (this.staminaBarOuter) {
            this.staminaBarOuter.x = Math.round(w / 2);
            this.staminaBarOuter.y = h - 8;
        }
        if (this.staminaBarCenter) {
            this.staminaBarCenter.x = Math.round(w / 2 - 78);
            this.staminaBarCenter.y = h - 8;
        }
        if (this.staminaBarInner) {
            this.staminaBarInner.x = Math.round( w / 2 - 78);
            this.staminaBarInner.y = h - 8;
        }
    }

    setCollisionOnlyUp(tile)
    {
        if (tile.collideUp) {
            tile.collideDown = false;
            tile.collideLeft = false;
            tile.collideRight = false;
        }
    }

    playerTileCollision(tiles)
    {
        if (!tiles || !tiles.length || !this.player.alive) {
            return;
        }
        tiles.forEach((tile) => {
            if (flowerTiles.indexOf(tile.index) > -1) {
                tile.index -= 1;
                this.points += 1;
                //this.cameras.main.shake(250, 0.03);
                this.flowerParticlesTimer = 0;
                this.flowerParticlesEmitter.flow(40, 1);
                this.sfx.playUp('ping', 8);
            }
        });
    }

    setObjectPositionsFromMap()
    {
        if (!this.map) {
            return;
        }
        this.maxPoints = 0;
        let layer = this.map.getLayer(0);
        layer.data.forEach((row) => {
            row.forEach((tile) => {
                if (tile.index > -1) {
                    if (tile.properties.player) {
                        this.startPoint = {x: tile.pixelX, y: tile.pixelY, facing: tile.properties.facing};
                    }
                }
                if (flowerTiles.indexOf(tile.index) > -1) {
                    this.maxPoints += 1;
                }
            });
        });
        console.log(this.maxPoints);
    }

    gameOver() {
        if (this.isRestarting) {
            return;
        }
        this.isRestarting = true;
        this.cameras.main.once('camerafadeoutcomplete', (camera) => {
            this.scene.start('gameover');
        }, this);
        this.cameras.main.fadeOut(750, fadeColor.r, fadeColor.g, fadeColor.b);
        this.cameras.main.shake(250, 0.03);
        this.sfx.play('hit');
    }

    gameComplete() {
        if (this.isRestarting) {
            return;
        }
        this.isRestarting = true;
        this.cameras.main.once('camerafadeoutcomplete', (camera) => {
            this.scene.start('win');
        }, this);
        this.cameras.main.fadeOut(750, fadeColor.r, fadeColor.g, fadeColor.b);
        this.ambient.stop();
        this.sfx.play('success');
    }
}

export default Level;

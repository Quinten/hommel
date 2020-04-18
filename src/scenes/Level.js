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
        //this.cameras.main.setRoundPixels(true);

        // start controls
        this.controls.start();

        //this.levelText = this.add.dynamicBitmapText(0, 0, 'napie-eight-font', 'There will be levels soon');

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

        this.setObjectPositionsFromMap();

        // the player
        this.player = new Player(this, this.startPoint.x, this.startPoint.y, 'player', 0, this.startPoint.facing);
        this.cameras.main.startFollow(this.player, false, 0.1);
        this.physics.add.collider(this.player, this.layer);

        // stamina bar
        this.staminaBarOuter = this.add.image(this.scale.width / 2, 8, 'staminabar-outer');
        this.staminaBarOuter.setScrollFactor(0);
        this.staminaBarOuter.setDepth(4);
        this.staminaBarCenter = this.add.image(this.scale.width / 2 - 78, 8, 'staminabar-center');
        this.staminaBarCenter.setScrollFactor(0);
        this.staminaBarCenter.setDepth(4);
        this.staminaBarCenter.setOrigin(0, 0.5);
        this.staminaBarInner = this.add.image(this.scale.width / 2 - 78, 8, 'staminabar-inner');
        this.staminaBarInner.setScrollFactor(0);
        this.staminaBarInner.setDepth(4);
        this.staminaBarInner.setOrigin(0, 0.5);

        // score
        this.points = 0;
        this.maxPoints = 100;
        this.isRestarting = false;
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
    }

    resizeField(w, h)
    {
        if (this.staminaBarOuter) {
            this.staminaBarOuter.x = Math.round(w / 2);
        }
        if (this.staminaBarCenter) {
            this.staminaBarCenter.x = Math.round(w / 2 - 78);
        }
        if (this.staminaBarInner) {
            this.staminaBarInner.x = Math.round( w / 2 - 78);
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
        if (!tiles || !tiles.length) {
            return;
        }
        tiles.forEach((tile) => {
            if (flowerTiles.indexOf(tile.index) > -1) {
                tile.index -= 1;
                this.points += 1;
                console.log('juice1');
            }
        });
    }

    setObjectPositionsFromMap()
    {
        if (!this.map) {
            return;
        }
        let layer = this.map.getLayer(0);
        layer.data.forEach((row) => {
            row.forEach((tile) => {
                if (tile.index > -1) {
                    if (tile.properties.player) {
                        this.startPoint = {x: tile.pixelX, y: tile.pixelY, facing: tile.properties.facing};
                    }
                }
            });
        });
    }

    gameOver() {
        if (this.isRestarting) {
            return;
        }
        this.isRestarting = true;
        this.cameras.main.once('camerafadeoutcomplete', (camera) => {
            this.scene.restart();
        }, this);
        this.cameras.main.fadeOut(750, fadeColor.r, fadeColor.g, fadeColor.b);
        this.cameras.main.shake(250, 0.03);
        //this.sfx.play('fail');
    }

    gameComplete() {
        if (this.isRestarting) {
            return;
        }
        this.isRestarting = true;
        this.cameras.main.once('camerafadeoutcomplete', (camera) => {
            this.scene.restart();
        }, this);
        this.cameras.main.fadeOut(750, fadeColor.r, fadeColor.g, fadeColor.b);
        //this.sfx.play('success');
    }
}

export default Level;

import Player from '../sprites/Player.js';
import levels from '../levels';

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

        // the player
        this.player = new Player(this, this.startPoint.x, this.startPoint.y, 'player', 0, this.startPoint.facing);
        this.cameras.main.startFollow(this.player, true);
        this.physics.add.collider(this.player, this.layer);
    }

    update(time, delta)
    {
        this.player.update(this.controls, time, delta);
    }

    resizeField(w, h)
    {

    }

    setCollisionOnlyUp(tile)
    {
        if (tile.collideUp) {
            tile.collideDown = false;
            tile.collideLeft = false;
            tile.collideRight = false;
        }
    }
}

export default Level;

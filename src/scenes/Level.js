import levels from '../levels';

class Level extends Phaser.Scene {

    constructor (config)
    {
        super((config) ? config : { key: 'level' });
        this.map = undefined;
        this.tiles = undefined;
        this.layer = undefined;
    }

    create()
    {
        this.cameras.main.setRoundPixels(true);
        //console.log('level create');
        //this.levelText = this.add.dynamicBitmapText(0, 0, 'napie-eight-font', 'There will be levels soon');

        //let mapKey = levels[this.levelstats.currentLevel].map;
        let mapKey = 'map';
        this.map = this.make.tilemap({ key: mapKey });
        this.tiles = this.map.addTilesetImage('tiles', 'tiles', 8, 8, 1, 2);
        this.layer = this.map.createDynamicLayer(0, this.tiles, 0, 0);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    }

    update(time, delta)
    {
    }

    resizeField(w, h)
    {

    }
}

export default Level;

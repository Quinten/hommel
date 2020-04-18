import levels from '../levels';

class Level extends Phaser.Scene {

    constructor (config)
    {
        super((config) ? config : { key: 'level' });
    }

    create()
    {
        this.cameras.main.setRoundPixels(true);
        console.log('level create');
        this.levelText = this.add.dynamicBitmapText(0, 0, 'napie-eight-font', 'There will be levels soon');
    }

    update(time, delta)
    {
    }

    resizeField(w, h)
    {

    }
}

export default Level;

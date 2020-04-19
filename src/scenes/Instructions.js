class Instructions extends Phaser.Scene {

    constructor (config)
    {
        super((config) ? config : { key: 'instructions' });
        this.nextScene = 'level';
        this.pancarte = undefined;
        this.nextStart = false;
    }

    create ()
    {
        this.nextStart = false;
        this.pancarte = this.add.dynamicBitmapText(0, 0, 'napie-eight-font', 'use arrow keys\nto move left and right\nhold space bar to fly\ngamepads also work\n\nspace bar or click\nto start');
        this.pancarte.setOrigin(0.5, 0.5);
        this.pancarte.setScrollFactor(0);

        this.resizeField(this.scale.width, this.scale.height);

        this.controls.start();
        this.controls.events.once('aup', this.tapUp, this);
        this.input.once('pointerdown', this.tapUp, this);

        this.cameras.main.flash(1500, fadeColor.r, fadeColor.g, fadeColor.b);
    }

    resizeField(w, h)
    {
        if (this.pancarte) {
            this.pancarte.x = w / 2;
            this.pancarte.y = h / 2;
        }
    }

    tapUp()
    {
        if (this.nextStart) {
            return;
        }
        this.nextStart = true;
        this.cameras.main.once('camerafadeoutcomplete', (camera) => {
            this.scene.start(this.nextScene);
        }, this);
        this.cameras.main.fadeOut(1000, fadeColor.r, fadeColor.g, fadeColor.b);
        this.sfx.play('ping', 8);
    }

}

export default Instructions;

class Title extends Phaser.Scene {

    constructor (config)
    {
        super((config) ? config : { key: 'title' });
        this.nextScene = 'instructions';
        this.pancarte = undefined;
        this.nextStart = false;
    }

    create ()
    {
        this.nextStart = false;
        this.pancarte = this.add.dynamicBitmapText(0, 0, 'napie-eight-font', 'hommel');
        this.pancarte.setOrigin(0.5, 0.5);
        this.pancarte.setScrollFactor(0);

        this.resizeField(this.scale.width, this.scale.height);

        this.cameras.main.once('cameraflashcomplete', (camera) => {
           this.tapUp();
        }, this);
        this.cameras.main.flash(3000, fadeColor.r, fadeColor.g, fadeColor.b);
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
        this.cameras.main.fadeOut(3000, fadeColor.r, fadeColor.g, fadeColor.b);
    }

}

export default Title;

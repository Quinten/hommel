class Preloader extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'preloader' });
    }

    preload ()
    {
        this.sys.canvas.style.display = 'block';

        // just a preload bar in graphics
        let progress = this.add.graphics();
        this.load.on('progress', (value) => {
            progress.clear();
            progress.lineStyle(2, window.fgColor.color, 1);
            progress.strokeRect((this.scale.width / 2) - 132, (this.scale.height / 2) - 20, 264, 40);
            progress.fillStyle(window.fgColor.color, 1);
            progress.fillRect((this.scale.width / 2) - 128, (this.scale.height / 2) - 16, 256 * value, 32);
        });
        this.load.on('complete', () => {
            progress.destroy();
        });

        // Load assets here
        // ...
        this.load.image('napie-eight-font', 'assets/napie-eight-font.png');
        this.load.tilemapTiledJSON('map', 'assets/map.json');
        //this.load.image('tiles', 'assets/tiles.png');
        this.load.image('tiles', 'assets/tiles-extruded.png');
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('staminabar-outer', 'assets/staminabar-outer.png');
        this.load.image('staminabar-center', 'assets/staminabar-center.png');
        this.load.image('staminabar-inner', 'assets/staminabar-inner.png');
        this.load.audio('buzz', 'assets/buzz.mp3');
        this.load.audio('eerie', 'assets/eerie.mp3');
        this.load.audioSprite('ping', 'assets/ping.json', 'assets/ping.mp3');
        /*
        this.load.audio('music', 'assets/music.mp3');
        this.load.audioSprite('jump', 'assets/jump.json', 'assets/jump.mp3');
        */
        /*
        */
    }

    create ()
    {
        let fontConfig = {
            image: 'napie-eight-font',
            width: 8,
            height: 8,
            chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ .,!?#abcdefghijklmnopqrstuvwxyz@:;^%&1234567890*\'"`[]/\\~+-=<>(){}_|$',
            charsPerRow: 16,
            spacing: { x: 0, y: 0 }
        };
        this.cache.bitmapFont.add('napie-eight-font', Phaser.GameObjects.RetroFont.Parse(this, fontConfig));

        /*
        this.load.on('complete', () => {
            this.load.off('complete');
            this.ambient.allMusicLoaded = true;
        }, this);
        this.load.audio('music2', 'assets/music2.mp3');
        this.load.audio('music3', 'assets/music3.mp3');
        this.load.start();
        */

        this.scene.start('level');
        //this.scene.start('startscreen');
        //this.scene.start('endscreen');
    }

}

export default Preloader;

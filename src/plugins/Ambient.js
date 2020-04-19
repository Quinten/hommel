import config from '../../package';

const musicKey = 'music-' + config.name;

let isOn = true;
let savedSetting = localStorage.getItem(musicKey);
if (savedSetting === 'off') {
    isOn = false;
}

const keys = ['buzz', 'eerie'];

class Ambient extends Phaser.Plugins.BasePlugin
{
    constructor (pluginManager)
    {
        super(pluginManager);
        this.sounds = {};
        this.allMusicLoaded = false;
        this.isPlaying = false;
    }

    play()
    {
        if (this.isPlaying) {
            return;
        }
        keys.forEach((key) => {
            this.loop(key);
        });
        this.isPlaying = true;
    }

    loop(key)
    {
        if (!this.sounds[key] && this.isOn) {
            if (!this.game.cache.audio.exists(key)) {
                return;
            }
            this.sounds[key] = this.game.sound.add(key);
            if (!this.sounds[key]) {
                return;
            }
            this.sounds[key].play({loop: true});
            if (key === 'buzz') {
                this.sounds[key].volume = 0;
            }
        }
    }

    stop(skip)
    {
        for (let oldKey in this.sounds) {
            if (oldKey !== skip && this.sounds[oldKey]) {
                this.sounds[oldKey].stop();
                this.sounds[oldKey] = undefined;
            }
        }
        this.isPlaying = false;
    }

    get isOn() {
        return isOn;
    }

    set isOn(value) {
        isOn = value;
        localStorage.setItem(musicKey, (value) ? 'on' : 'off');
        if (value) {
            this.play();
        } else {
            this.stop('opusmagnus');
        }
    }
}

export default Ambient;

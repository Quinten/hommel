import config from '../../package';

const sfxKey = 'sfx-' + config.name;

let isOn = true;
let savedSetting = localStorage.getItem(sfxKey);
if (savedSetting === 'off') {
    isOn = false;
}

let keys = {};

class Sfx extends Phaser.Plugins.BasePlugin {

    play(key, seed = 1)
    {
        if (this.isOn) {
            if (!this.game.cache.audio.exists(key)) {
                return;
            }
            this.game.sound.playAudioSprite(key, key + (Math.floor(Math.random() * seed)), {
                mute: false,
                volume: 1,
                rate: 1,
                //rate: 0.8 + (Math.random() * 0.4),
                detune: 0
            });
        }
    }

    playUp(key, max = 1)
    {
        if (this.isOn) {
            if (!this.game.cache.audio.exists(key)) {
                return;
            }
            if (!keys[key] && keys[key] !== 0 || keys[key] >= max - 1) {
                keys[key] = 0;
            } else {
                keys[key] += 1;
            }
            this.game.sound.playAudioSprite(key, key + keys[key], {
                mute: false,
                volume: 1,
                rate: 1,
                //rate: 0.8 + (Math.random() * 0.4),
                detune: 0
            });
        }
    }

    get isOn() {
        return isOn;
    }

    set isOn(value) {
        isOn = value;
        localStorage.setItem(sfxKey, (value) ? 'on' : 'off');
    }
}

export default Sfx;

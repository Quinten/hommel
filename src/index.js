import './styles.css';

import config from '../package';

import 'phaser';
import Sfx from './plugins/Sfx.js';
import Ambient from './plugins/Ambient.js';
import LevelStats from './plugins/LevelStats.js';
import SimplePlatformerControls from './plugins/SimplePlatformerControls.js';
import Boot from './scenes/Boot.js';
import Preloader from './scenes/Preloader.js';
import Level from './scenes/Level.js';
import GameOver from './scenes/GameOver.js';
import Win from './scenes/Win.js';
import Title from './scenes/Title.js';
import Instructions from './scenes/Instructions.js';

let prePreLoader = document.getElementById('loading');
if (prePreLoader && prePreLoader.parentNode) {
    prePreLoader.parentNode.removeChild(prePreLoader);
}

window.fadeColor = Phaser.Display.Color.HexStringToColor(config.bgColor);
window.bgColor = Phaser.Display.Color.HexStringToColor(config.bgColor);
window.fgColor = Phaser.Display.Color.HexStringToColor(config.fgColor);

window.maxWidth = 320;
window.maxHeight = 240;

let wZoom = Math.max(1, Math.floor(window.innerWidth / window.maxWidth));
let hZoom = Math.max(1, Math.floor(window.innerHeight / window.maxHeight));
let zoom = Math.min(wZoom, hZoom);

let gameConfig = {
    type: Phaser.WEBGL,
    audio: {
        disableWebAudio: !(window.AudioContext || window.webkitAudioContext)
    },
    backgroundColor: config.bgColor,
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.NONE,
        width: Math.ceil(window.innerWidth / zoom),
        height: Math.ceil(window.innerHeight / zoom),
        zoom: zoom
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 512 },
            debug: false
        }
    },
    plugins: {
        scene: [
            { key: 'simplePlatformerControls', plugin: SimplePlatformerControls, mapping: 'controls' },
        ],
        global: [
            { key: 'sfx', plugin: Sfx, mapping: 'sfx', start: true },
            { key: 'ambient', plugin: Ambient, mapping: 'ambient', start: true },
            { key: 'levelstats', plugin: LevelStats, mapping: 'levelstats', start: true }
        ]
    },
    input: {
        gamepad: true,
        queue: true
    },
    scene: [
        Boot,
        Preloader,
        Level,
        GameOver,
        Win,
        Title,
        Instructions
    ]
};

// start game
window.game = new Phaser.Game(gameConfig);

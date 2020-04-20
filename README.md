# Hommel

Ludum Dare 46: Keep it alive

Here are the color i used:

https://coolors.co/d3ab9e-eac9c1-ebd8d0-283044-fefeff

Generated the tiles with this and then edited them in Pyxel Edit:

https://quinten.github.io/random-tileset-generator/?selectedcheckeredbg=swirlcheckeredbg&selectedrandombg=squaresrandombg&selectedadvanced=acidadvanced&selectedeasy=basiceasy&selectedcheckeredfill=concretecheckeredfill&selectedrandomfill=trianglesrandomfill&selectedattributes=antennas&selectedtopping=notopping&bgColor=FEFEFF&solidColor=EAC9C1&randomColor=D3AB9E&topColor=D3AB9E&easyColor=D3AB9E&attrColor=D3AB9E

All other `.pyxel` files can off course also be edited with Pyxel Edit.

The `map.tmx` file needs to be edited with Tiled map editor.

All sounds and music were made with Garageband.

### Availabe npm commands

Node.js is needed to compile the code. After you have cloned this repo, run the following cli command:

```
npm install
```

To spin up the development server:

```
npm start
```

To make a production ready build:

```
npm run build
```

To deploy `/public` to github pages:

```
npm run deploy
```

To avoid bleeding issues in the map and extrude the `tiles.png` tileset. First install tile-extruder:

```
npm install -G tile-extruder
```

Each time you have edited the tileset (not the map) run:

```
npm run tiles
```

See `package.json` for the commands. There are also other config settings in the `package.json` that can save time.

### License

MIT





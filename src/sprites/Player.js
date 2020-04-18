class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, key, frame, facing) {
        super(scene, x, y, key, frame);
        scene.physics.world.enable(this);
        scene.add.existing(this);

        this.setDepth(2);
        this.setSize(16, 12, true);
        this.setOffset(8, 20, true);
        this.setCollideWorldBounds(true);
        this.body.allowGravity = true;

        // tweak stuff
        this.speedMax = 96;
        this.speedChange = 8;
        this.maxFlyPower = 192;
        this.flyChange = 8;
        this.stamina = 1500;

        // not tweakable
        this.facing = facing || 'right';
        this.idle = false;
        this.moveSpeed = 0;
        this.ani = 'idle-left';
        this.alive = true;
        this.flyPower = 0;
        this.flyTimer = 0;
        this.restTimer = this.stamina;

        var animations = [
            { key: 'idle-left', start: 0, end: 0 },
            { key: 'idle-right', start: 1, end: 1 },
            { key: 'run-left', start: 0, end: 0 },
            { key: 'run-right', start: 1, end: 1 },
            { key: 'fly-left', start: 0, end: 0 },
            { key: 'fly-right', start: 1, end: 1 }
        ];
        animations.forEach(this.addAnim.bind(this));
    }

    addAnim(anim)
    {
        let anims = this.anims.animationManager;
        if (!anims.get(anim.key)) {
            anims.create({
                key: anim.key,
                frames: anims.generateFrameNumbers('player', { start: anim.start, end: anim.end }),
                frameRate: 15,
                repeat: -1
            });
        }
    }

    update(controls, time, delta)
    {
        if (!this.alive) {
            return;
        }

        this.runAndFly(controls, time, delta);

        // don't forget to animate :)
        this.anims.play(this.ani, true);
    }

    runAndFly(controls, time, delta)
    {
        if (controls.left) {

            this.body.velocity.x -= this.speedChange;
            this.body.velocity.x = Math.max(this.body.velocity.x, -this.speedMax);

            this.facing = 'left';
            this.idle = false;

        } else if (controls.right) {

            this.body.velocity.x += this.speedChange;
            this.body.velocity.x = Math.min(this.body.velocity.x, this.speedMax);

            this.facing = 'right';
            this.idle = false;

        } else {

            this.body.velocity.x -= this.body.velocity.x / 2;

            this.idle = true;

        }

        if (controls.aDown && this.flyTimer < this.stamina) {
            this.flyPower += this.flyChange;
            if (this.flyPower > this.maxFlyPower) {
                this.flyPower = this.maxFlyPower;
            }
            this.body.setVelocityY(-this.flyPower);
        } else {
            this.flyPower = 0;
        }

        let onFloor = (this.body.onFloor() || this.body.touching.down);

        if (onFloor) {

            if (this.restTimer >= this.stamina) {
                this.restTimer = this.stamina;
                this.flyTimer = 0;
            } else {
                this.restTimer += delta;
                this.flyTimer -= delta;
            }

            if (this.idle) {

                if (this.facing === 'left') {
                    this.ani = 'idle-left';
                } else {
                    this.ani = 'idle-right';
                }

            } else {

                if (this.facing === 'left') {
                    this.ani = 'run-left';
                } else {
                    this.ani = 'run-right';
                }

            }

        } else {

            if (this.flyTimer >= this.stamina) {
                this.restTimer = 0;
                this.flyTimer = this.stamina;
            } else {
                this.restTimer -= delta;
                this.flyTimer += delta;
            }

            if (this.facing === 'left') {
                this.ani = 'fly-left';
            } else {
                this.ani = 'fly-right';
            }

        }
    }

    disappear()
    {
        this.alive = false;
        this.visible = false;
        this.body.enable = false;
    }
}

export default Player;
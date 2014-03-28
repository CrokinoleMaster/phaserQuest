PhaserQuest.Game = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;      //  a reference to the currently running game
    this.add;       //  used to add sprites, text, groups, etc
    this.camera;    //  a reference to the game camera
    this.cache;     //  the game cache
    this.input;     //  the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;      //  for preloading assets
    this.math;      //  lots of useful common math operations
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc
    this.stage;     //  the game stage
    this.time;      //  the clock
    this.tweens;    //  the tween manager
    this.state;     //  the state manager
    this.world;     //  the game world
    this.particles; //  the particle manager
    this.physics;   //  the physics manager
    this.rnd;       //  the repeatable random number generator

    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.
    this.player;
    this.cursors;
    this.map;
    this.layer;
    this.tiles;
};

PhaserQuest.Game.prototype = {

    create: function () {

        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
        console.log("game started");
        // setup physics
        this.physics.startSystem(Phaser.Physics.ARCADE);

        // bg color
        this.stage.backgroundColor = '#2d2d2d';

        // add player and cursor
        this.player = this.add.sprite(32, this.world.height - 500, 'player');
        this.physics.arcade.enable(this.player);


        this.player.body.bounce.y = 0.2;
        this.player.body.gravity.y = 800;
        this.player.body.collideWorldBounds = true;
        this.player.anchor.setTo(0.5);
        this.player.scale.x = 0.95;

        this.camera.follow(this.player);
        this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);
        this.player.animations.add('jump', [13], 10, true);

        cursors = this.input.keyboard.createCursorKeys();

        // add map
        this.map = this.add.tilemap('level1');
        this.map.addTilesetImage('base', 'baseTiles');
        this.map.setCollisionByExclusion([], true, 'base');

        this.layer = this.map.createLayer('base');

        this.layer.resizeWorld();



    },

    update: function () {
        this.physics.arcade.collide(this.player, this.layer);
        var player = this.player;
        // reset velocity
        player.body.velocity.x = 0;

        // input controls
        if (cursors.left.isDown )
        {
            //  Move to the left
            player.body.velocity.x = -300;
            if (!cursors.up.isDown && player.body.onFloor())
                player.animations.play('left');
            player.scale.x = -0.95;
        }
        else if (cursors.right.isDown )
        {
            //  Move to the right
            player.body.velocity.x = 300;
            if (!cursors.up.isDown && player.body.onFloor())
                player.animations.play('right');
            player.scale.x = 0.95;
        }
        else
        {
            //  Stand still
            player.animations.stop();

            player.frame = 4;
        }

        //  Allow the player to jump if they are touching the ground.
        if (cursors.up.isDown)
        {
            player.animations.play('jump');
            if (player.body.onFloor())
                player.body.velocity.y = -500;
        }


    },

    quitGame: function (pointer) {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        this.state.start('MainMenu');

    }

};
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
        this.stage.backgroundColor = '#d0f4f7';

        // add player and cursor
        this.player = this.add.sprite(32, this.world.height - 500, 'player', 2);
        this.physics.arcade.enable(this.player);


        this.player.body.bounce.set(0.5, 0.5);
        // this.player.body.gravity.y = 800;
        this.player.anchor.setTo(0.5, 0.5);
        this.player.scale.x = 0.9;
        this.player.scale.y = 0.9;

        this.camera.follow(this.player);
        this.player.animations.add('float', [2],1,false);
        this.player.animations.add('collide', [6,6,6,6,6,6,6,6,6,6,6,6,6,6], 15, false);
        this.player.animations.add('boost', [13], 15, true);
        this.player.animations.play('float');


        // add map
        this.map = this.add.tilemap('level1');
        this.map.addTilesetImage('base', 'baseTiles');
        this.map.setCollisionByExclusion([], true, 'base');

        this.layer = this.map.createLayer('base');

        this.layer.resizeWorld();


        this.player.animations.stop();

        this.input.onUp.add(this.stop, this);
        this.player.spinning = false;
    },

    update: function () {
        var game = this;
        this.physics.arcade.collide(this.player, this.layer, function(){
            if (game.player.body.blocked.up || game.player.body.blocked.down)
                game.player.body.acceleration.y*=-1;
            if (game.player.body.blocked.left || game.player.body.blocked.right)
                game.player.body.acceleration.x*=-1;
            game.player.animations.play('collide');
            game.player.spinning = true;
            game.player.body.angularVelocity = 100;
            game.time.events.add(Phaser.Timer.SECOND * 4, function(){
                game.player.spinning = false;
            }, game);
        });

        if (this.player.spinning == false){
            this.player.rotation = this.physics.arcade.angleToPointer(this.player);
        }

        if (this.input.mousePointer.isDown){
            this.move();
        }

    },

    move: function(){
        this.player.animations.play('boost');
        this.physics.arcade.accelerateToPointer(this.player, this.input.activePointer, 300, 600, 600);
    },

    stop: function(){
        this.player.animations.play('float');
        this.player.body.acceleration.x= 0;
        this.player.body.acceleration.y= 0;
    },

    quitGame: function (pointer) {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        this.state.start('MainMenu');

    }

};
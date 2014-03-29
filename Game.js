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
    this.obstacles;
};

PhaserQuest.Game.prototype = {

    create: function () {

        console.log("game started");
        // setup physics
        this.physics.startSystem(Phaser.Physics.ARCADE);

        // bg color
        this.stage.backgroundColor = '#d0f4f7';

        // add player and cursor
        this.player = this.add.sprite(32, this.world.height - 500, 'player', 2);
        this.physics.arcade.enable(this.player);


        this.player.body.bounce.set(0.8, 0.8);
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

        // add obstacles
        this.obstacles = this.game.add.group();
        this.obstacles.enableBody = true;
        this.obstacles.physicsBodyType = Phaser.Physics.ARCADE;
        this.addObstacle(400,500, 'obstacleBeam', 2);
        this.addObstacle(600, 200, 'obstacleBeam', 1);
        this.addObstacle(600, 400, 'obstacleBeam', 1);
        this.addObstacle(800,500, 'obstacleBeam', 1);
        this.addObstacle(900, 200, 'obstacleBeam', 2);
        this.addObstacle(1000, 400, 'obstacleBeam', 2);
    },

    update: function () {
        this.collidePlayer(this.layer);
        this.collidePlayer(this.obstacles);



        if (this.input.mousePointer.isDown){
            this.move();
        }

        // move obstacle
        this.moveObstacle(this.obstacles.getAt(0), 200, 200);
        this.moveObstacle(this.obstacles.getAt(1), -100, 200);
        this.moveObstacle(this.obstacles.getAt(2), -100, 200);
        this.moveObstacle(this.obstacles.getAt(3), 200, 200);
        this.moveObstacle(this.obstacles.getAt(4), 100, 200);
        this.moveObstacle(this.obstacles.getAt(5), -100, 200);
    },

    collidePlayer: function(target, callback){
        var game = this;
        this.physics.arcade.collide(this.player, target, function(){
            if (callback)
                callback();
            game.player.animations.play('collide');
            game.player.spinning = true;
            game.player.body.angularVelocity = 100;
            game.time.events.add(Phaser.Timer.SECOND * 4, function(){
                game.player.spinning = false;
            }, game);
        });

        if (this.player.spinning == false){
            this.player.rotation = this.physics.arcade.angleToPointer(this.player);
            this.player.animations.play('float');
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

    addObstacle: function(x, y, image, scale){
        var obstacle = this.add.sprite(x,y, image);
        this.obstacles.add(obstacle);
        obstacle.oX = obstacle.body.x;
        obstacle.oY = obstacle.body.y;
        obstacle.scale.y = scale;
        obstacle.body.immovable = true;
    },

    moveObstacle: function(obstacle, y, speed){
        var x = obstacle.body.x;

        if (obstacle.body.y>obstacle.oY-y){
            this.physics.arcade.accelerateToXY(obstacle, x, obstacle.body.y-100, speed, 500, 500);
        }
        else if (obstacle.body.y<=obstacle.oY-y){
            this.physics.arcade.accelerateToXY(obstacle, x, obstacle.body.y+100, speed, 500, 500);
        }

    },

    quitGame: function (pointer) {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        this.state.start('MainMenu');

    }

};
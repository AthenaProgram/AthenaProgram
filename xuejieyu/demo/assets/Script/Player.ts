var Global = require("Global");

cc.Class({
    extends: cc.Component,

    properties: {
        tileX: null,
        tileY: null,
        orientation: null, // cc.KEY.w/s/a/d
        maxMoveSpeed: 500,
        accel: 10000,

        sprite: {
            default: null,
            type: cc.Sprite,
        }
    },

    setInputControl: function() {
        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function(keyCode, event) {
                // only change direction.
                if (keyCode !== self.orientation) {
                    self.orientation = keyCode;
                    console.log(keyCode);
                    switch (keyCode) {
                        case cc.KEY.w:
                            self.node.scaleY = 1;
                            break;
                        case cc.KEY.s:
                            self.node.scaleY = -1;
                            break;
                        case cc.KEY.a:
                            self.node.scaleX = -1;
                            break;
                        case cc.KEY.d:
                            self.node.scaleX = 1;
                            break;
                    }
                    return;
                }
                self.MoveOneTile(keyCode);
                /*
                switch (keyCode) {
                    case cc.KEY.a:
                        console.log("key a input");
                        self.accLeft = true;
                        self.accRight = false;
                        break;
                    case cc.KEY.d:
                        console.log("key d input");
                        self.accLeft = false;
                        self.accRight = true;
                        break;
                    case cc.KEY.w:
                        console.log("key a input");
                        self.accUp = true;
                        self.accDown = false;
                        break;
                    case cc.KEY.s:
                        console.log("key d input");
                        self.accUp = false;
                        self.accDown = true;
                        break;
                }
                */
            },
            onKyeReleased: function(keyCode, event) {
                switch (keyCode) {
                    case cc.KEY.a:
                        self.accLeft = false;
                        break;
                    case cc.KEY.d:
                        self.accRight = false;
                        break;
                    case cc.KEY.w:
                        self.accDown = false;
                        break;
                    case cc.KEY.s:
                        self.accUp = false;
                        break;
                }
            }
        }, self.node);
    },

    MoveOneTile: function (key) {
        // move
        switch (key) {
            case cc.KEY.w:
                // if (collision)
                this.DoMove(this.tileX, this.tileY + 1);
                break;
            case cc.KEY.s:
                // if (collision)
                this.DoMove(this.tileX, this.tileY - 1);
                break;
            case cc.KEY.a:
                // if (collision)
                this.DoMove(this.tileX - 1, this.tileY);
                break;
            case cc.KEY.d:
                // if (collision)
                this.DoMove(this.tileX + 1, this.tileY);
                break;
        }
    },

    DoMove: function (dstTileX, dstTileY) {
    },

    onLoadPlayer: function (player_skin) {
        // /*
        // test async
        var asyncfunc = async function () {
            await promisefunc();
        }();

        function promisefunc() {
            return new Promise ((resolve, reject) => {
                setTimeout(function () {
                    console.log("after 1 second this run");
                    resolve();
                }, 3000);
            });
        }
        // */
        var self = this;
        self.sprite = self.node.getComponent(cc.Sprite);
        console.log(self.sprite);

        // load sprite async
        /*
        cc.loader.loadRes("texture/" + player_skin, function(err, texture){
            console.log(texture);
            //self.sprite.spriteFrame = texture; // failed...keng!
            self.sprite.spriteFrame = new cc.SpriteFrame(texture);
        });
        */

        // load sprite sync. both are OK.
        var texture_url = cc.url.raw('resources/texture/' + player_skin + '.png');
        var texture = cc.textureCache.addImage(texture_url);
        this.node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);


        // set pixel coordinate
        this.node.position = Global.player_reborn_location;

        // set tile coordinate
        this.tileX = parseInt(this.node.position.x / Global.tile_size);
        this.tileY = (-1) * parseInt(this.node.position.y / Global.tile_size);
        this.orientation = cc.KEY.d;
        
        this.accLeft = false;
        this.accRight = false;
        this.accUp = false;
        this.accDown = false;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.setInputControl();

        //console.log("player onload done!");
    },

    updatePlayer: function (dt) {
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
        } else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        }
        if (this.accUp) {
            this.ySpeed += this.accel * dt;
        } else if (this.accDown) {
            this.ySpeed -= this.accel * dt;
        }

        if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }
        if (Math.abs(this.ySpeed) > this.maxMoveSpeed) {
            this.ySpeed = this.maxMoveSpeed * this.ySpeed / Math.abs(this.ySpeed);
        }
        this.node.x += this.xSpeed * dt;
        this.node.y += this.ySpeed * dt;
    },
});

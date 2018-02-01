var Global = require("Global");

cc.Class({
    extends: cc.Component,

    // /*
    properties: {
        tileX: 0,
        tileY: 0,
        maxMoveSpeed: 500,
        accel: 10000,
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    setInputControl: function() {
        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function(keyCode, event) {
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

    // use this for initialization
    onLoadPlayer: function () {
        console.log(Global.player_reborn_location);
        this.node.setPosition(Global.player_reborn_location);
        this.accLeft = false;
        this.accRight = false;
        this.accUp = false;
        this.accDown = false;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.setInputControl();
        console.log("player onload done!");
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
    // */
});

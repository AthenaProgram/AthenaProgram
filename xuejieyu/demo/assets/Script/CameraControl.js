var Global = require("Global");
cc.Class({
    extends: cc.Component,

    properties: {
        target: {
            default: null,
            type: cc.Node
        },
        focus: {
            default: null,
            type: cc.Node
        },
        margin_left: 0,
        margin_right: 0,
        margin_up: 0,
        margin_down: 0,
    },

    // use this for initialization
    onLoadCamera: function () {
        this.camera = this.getComponent(cc.Camera);

        var canvas_width = this.node.parent.parent.width;
        var canvas_height = this.node.parent.parent.height;
        var scaleX = this.node.parent.scaleX;
        var scaleY = this.node.parent.scaleY;
        var map_pixel_width = Global.map_width * Global.tile_size;
        var map_pixel_height = Global.map_height * Global.tile_size;

        this.margin_left = canvas_width / 2 / scaleX;
        this.margin_right = map_pixel_width - canvas_width / 2 / scaleX;
        this.margin_up = (-1) * canvas_height / 2 / scaleY;
        this.margin_down = (-1) * (map_pixel_height - canvas_height / 2 / scaleY);

        //console.log("camera onload done!");
    },

     /*
    onEnable: function () {
        cc.director.getPhysicsManager().attachDebugDrawToCamera(this.camera);
    },
    onDisable: function () {
        cc.director.getPhysicsManager().detachDebugDrawFromCamera(this.camera);
    },
    // */

    // called every frame, uncomment this function to activate update callback
    updateCamera: function (dt) {
        // target is player node, focus is camera focus node.
        if (this.target.x < this.margin_left) {
            this.focus.x = this.margin_left;
        } else if (this.target.x > this.margin_right) {
            this.focus.x = this.margin_right;
        } else {
            this.focus.x = this.target.x;
        }
        if (this.target.y > this.margin_up) {
            this.focus.y = this.margin_up;
        } else if (this.target.y < this.margin_down) {
            this.focus.y = this.margin_down;
        } else {
            this.focus.y = this.target.y;
        }

        let targetPos = this.focus.convertToWorldSpaceAR(cc.Vec2.ZERO);
        //console.log("focus world pos is :" + targetPos);
        this.node.position = this.node.parent.convertToNodeSpaceAR(targetPos);
        //console.log("camera world pos is :" + this.node.position);
        
        //let ratio = targetPos.y / cc.winSize.height;
        //this.camera.zoomRatio = 1 + (0.5 - ratio) * 0.5;
        // */
    },
});
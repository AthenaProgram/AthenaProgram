// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        staticSquare: {
            default: null,
            type: cc.Node
        },
        dynamicSquare: {
            default: null,
            type: cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.initialize(null)
    },

    initialize: function(stage_id)
    {
        console.log('backGround.initialize');
        this.staticConfig = this.loadStaticConfig(stage_id);
        this.staticSquare.getComponent('staticSquare').initialize(this.staticConfig);
        this.dynamicConfig = this.loadDynamicConfig(stage_id);
        this.dynamicSquare.getComponent('dynamicSquare').initialize(this.dynamicConfig);
    },

    loadStaticConfig: function(stage_id)
    {
        var config = new Array();
        config.push([-10, -10, -1, -10]);
        config.push([-10, -1, 10, 10]);
        config.push([-8, -9, -7, -5]);
        config.push([-6,-5,-2,-1]);
        config.push([-4, -9, -4, -6]);
        return config;
    },
    
    loadDynamicConfig: function(stage_id)
    {
        var config = new Array();
        //itemId, position.x, position.y
        config.push([0, 0, 0]);
        config.push([1, -10, -1]);
        config.push([2, -8, -8]);
        config.push([2, -2, -1]);
        config.push([2, -4, -5]);
        config.push([1, -8, -9]);   
        config.push([1, -1, -1]);
        config.push([1, -8, -7]);
        config.push([1, -7, -7]);
        return config;
    }
    // update (dt) {},
});

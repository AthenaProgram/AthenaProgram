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
        block:{
            default:null,
            type:cc.Prefab,
        },        
    },

    // LIFE-CYCLE CALLBACKS:
    
    addBlocks: function(row1, col1, row2, col2) {
        for (var i = row1; i <= row2; i++) {
           for (var j = col1; j <= col2; j++) {
                // 使用给定的模板在场景中生成一个新节点
                var block = cc.instantiate(this.block);
                // 将新增的节点添加到 Canvas 节点下面
                this.node.addChild(block);
                // 为星星设置一个位置
                //var size = newStar.getContentSize();
                var x = i * 52;//size.width;
                var y = j * 52;//size.height;
                cc.availablePosMap[i + "+" + j] = true;
                block.setPosition(cc.p(x, y));
            }
        }
    },

    initialize: function(config)
    {
        cc.availablePosMap = {}
        for(var i = 0; i < config.length; i ++)
        {
            this.addBlocks(config[i][0],config[i][1],config[i][2],config[i][3])
        }
    },

    onLoad () {
        /*this.addBlocks(0,0,9,0); 
        this.addBlocks(0,9,9,9); 
        this.addBlocks(2,1,3,5); */
    },

    start () {

    },

    // update (dt) {},
});

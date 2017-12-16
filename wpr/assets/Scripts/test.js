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
        square:{
            default:null,
            type:cc.Prefab,
        },
        player: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.spawnNewStar(0,0,9,0); 
        this.spawnNewStar(0,9,9,9); 
        this.spawnNewStar(2,1,3,5); 

        this.spawnNewSquare(4,1,7,5);
    },

    spawnNewStar: function(row1, col1, row2, col2) {
        for (var i = row1; i <= row2; i++) {
           for (var j = col1; j <= col2; j++) {
                // 使用给定的模板在场景中生成一个新节点
                var newStar = cc.instantiate(this.block);
                // 将新增的节点添加到 Canvas 节点下面
                this.node.addChild(newStar);
                // 为星星设置一个位置
                //var size = newStar.getContentSize();
                var x = i * 52;//size.width;
                var y = j * 52;//size.height;
                newStar.setPosition(cc.p(x,y));
            }
        }
    },

    spawnNewSquare: function(row1, col1, row2, col2) {
        for (var i = row1; i <= row2; i++) {
           for (var j = col1; j <= col2; j++) {
                // 使用给定的模板在场景中生成一个新节点
                var newStar = cc.instantiate(this.square);
                // 将新增的节点添加到 Canvas 节点下面
                this.node.addChild(newStar);
                // 为星星设置一个位置
                var x = i * 52;
                var y = j * 52;
                newStar.setPosition(cc.p(x,y));
                // 将 Game 组件的实例传入星星组件
                newStar.getComponent('square').game = this;
            }
        }
    },

    start () {

    },

    // update (dt) {},
});

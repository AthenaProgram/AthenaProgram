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
        dynamicNode:{
            default:null,
            type:cc.Prefab,
        },
    },

    instantiateDynamicPrefab: function(configItem)
    {
        var go = cc.instantiate(this.dynamicNode);
        var spt = go.getComponent("dynamicNode");
        this.node.addChild(go)
        spt.x = configItem[1];
        spt.y = configItem[2];
        go.setPosition(cc.p(configItem[1] * 52, configItem[2] * 52));
        spt.initialize(configItem, this);
        console.log("instantiateDynamicPrefab");
        this.dynamicNodeList.push(go);
    },

    initialize: function(dynamicConfig)
    {
        this.dynamicNodeList = [];
        for(var i = 0; i < dynamicConfig.length; i ++)
        {
            this.instantiateDynamicPrefab(dynamicConfig[i])
        }
    },

    //onLoad () {},

    start () {
        console.log("dynamicSquare.start");
        
    },

    removeNodeFromList: function(dynamicNode)
    {
        for(var i = 0; i < this.dynamicNodeList.length; i ++)
        {
            var node = this.dynamicNodeList[i];
            if(node == dynamicNode)
            {
                this.dynamicNodeList.splice(i, 1);
                break;
            }
        }
    },
    // update (dt) {},
    lateUpdate(dt)
    {

    },

    cacheAllChildData: function()
    {
        this.cachedData = [];
        for(var i = 0; i < this.dynamicNodeList.length; i ++)
        {
            var node = this.dynamicNodeList[i];
            var d = node.getComponent("DynamicNode").getCacheData()
            this.cachedData.push(d);
        }
    },

    resetAllNodeFromCacheData: function()
    {
        if(this.cachedData)
        {

        }
        else
        {
            this.ShowToast("no cache data");
        }
    },

    ShowToast: function(msg)
    {
        //test
        console.log(msg);
    }
});

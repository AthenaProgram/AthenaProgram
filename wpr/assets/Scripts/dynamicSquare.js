cc.Class({
    extends: cc.Component,

    properties: {
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
        spt.initialize(configItem);
        spt.dynParentSpt = this;
        this.dynamicNodeList.push(go);
        this.dynamicSptList.push(spt);
    },

    loadDynamicPrefab: function(cacheData)
    {
        var position = cacheData.position;
        var d = cacheData.data;
        var dynamicType = cacheData.dynamicType;
        var go = cc.instantiate(this.dynamicNode);
        var spt = go.getComponent("dynamicNode");
        this.node.addChild(go)
        go.setPosition(position);
        spt.dynParentSpt = this;
        spt.setSprite(dynamicType);
        spt.dynamicType = dynamicType;
        this.dynamicNodeList.push(go);
        this.dynamicSptList.push(spt);
        spt.bindAll();
        spt.loadFromCacheData(d);
    },

    initialize: function(dynamicConfig)
    {
        this.dynamicNodeList = [];
        this.dynamicSptList = [];
        for(var i = 0; i < dynamicConfig.length; i ++)
        {
            this.instantiateDynamicPrefab(dynamicConfig[i])
        }
    },

    start () {
        cc.dump = function(v)
        {
            console.log(typeof(v) + ":" + JSON.stringify(v));
        }
    },

    removeNodeFromList: function(dynamicNode)
    {
        for(var i = 0; i < this.dynamicNodeList.length; i ++)
        {
            var node = this.dynamicNodeList[i];
            if(node == dynamicNode)
            {
                this.dynamicNodeList.splice(i, 1);
                this.dynamicSptList.splice(i, 1);
                break;
            }
        }
    },

    lateUpdate(dt)
    {
        this.checkInEndOfFrame();
    },

    cacheAllChildData: function()
    {
        this.cachedData = [];
        for(var i = 0; i < this.dynamicNodeList.length; i ++)
        {
            var node = this.dynamicNodeList[i];
            var d = this.dynamicSptList[i].getCacheData();
            var cache = {};
            cache.data = d;
            cc.dump(d)
            cache.dynamicType = this.dynamicSptList[i].dynamicType
            cache.position = node.position;
            this.cachedData.push(cache);
        }
        cc.dump("-----cachedData:-----");
        cc.dump(this.cachedData);
    },

    resetAllNodeFromCacheData: function()
    {
        this.clearAllNode();
        if(this.cachedData)
        {
            for(var i = 0; i < this.cachedData.length; i ++)
            {
                var cacheData = this.cachedData[i];
                this.loadDynamicPrefab(cacheData);
            }
        }
        else
        {
            this.alert("no cache data");
        }
    },

    alert: function(msg)
    {
        //test
        console.log(msg);
    },

    checkInEndOfFrame: function()
    {
        //low
        this.currPosMap = {};
        var sptList = this.dynamicSptList;
        for(var i = 0; i < sptList.length; i ++)
        {
            var spt = sptList[i];
            if(!this.currPosMap[spt.x + "+" + spt.y])
            {
                this.currPosMap[spt.x + "+" + spt.y] = [];
            }
            this.currPosMap[spt.x + "+" + spt.y].push(spt);
        }
        for(var p in this.currPosMap)
        {
            if(this.currPosMap[p].length > 1)
            {
                for(var i = 0; i < this.currPosMap[p].length; i ++)
                {
                    for(var j = 0; j < this.currPosMap[p].length; j ++)
                    {
                        if(i != j)
                        {
                            this.currPosMap[p][i].touchWith(this.currPosMap[p][j]);
                        }
                    }
                }
            }
        }
    },
    
    clearAllNode: function()
    {
        for(var i = 0; i < this.dynamicNodeList.length; i ++)
        {
            var node = this.dynamicNodeList[i];
            node.destroy();
        }
        this.dynamicNodeList = [];
        this.dynamicSptList = [];
    }
});

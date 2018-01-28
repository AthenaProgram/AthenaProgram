require("babel-polyfill");
var Global = require("Global");

cc.Class({
    extends: cc.Component,

    properties: {
        player: {
            default: null,
            type: cc.Prefab,
        },
    },

    init: function (stage_id) {
        var self = this;
        console.log("start to load tiledmap...");
        var DoLoadTiledMap = async function() {

            //console.log(Global.map_width, Global.map_height);

            // load tiledmap
            await self.LoadTiledMap(stage_id, self);

            //console.log(Global.map_width, Global.map_height);

            // init player

            console.log("tiledmap load done!");
        }();

    },

    LoadTiledMap: function (id, self) {
        return new Promise((resolve, reject) => {
            cc.loader.loadRes("tiledmap/stage" + id, function(err, map){
                if (err) {
                    reject(err);
                } else {
                    var tiledmap = self.node.getComponent(cc.TiledMap);
                    tiledmap.tmxAsset = map;
                    self.TranslateMap(tiledmap, self);
                    resolve();
                }
            });
        });
    },

    TranslateMap: function (TiledMap, self) { // this is tiledmap translator.
        // init map location
        //this.node.setPosition(cc.visibleRect.bottomLeft);

        console.log(TiledMap);

        // get map size
        var mapSize = TiledMap.getMapSize();
        Global.map_width = mapSize.width;
        Global.map_height = mapSize.height;

        // get tile size
        Global.tile_size = TiledMap.getTileSize().width;

        /* instantiate prefab */
        // entrance and exit
        var ee = TiledMap.getObjectGroup('entrance_exit');
        var begin = self.PixelToTile(ee.getObject('e0').offset);
        var exit = self.PixelToTile(ee.getObject('e1').offset);
        var secret_stage = self.PixelToTile(ee.getObject('e2').offset);
        console.log(begin);
        console.log(exit);
        console.log(secret_stage);
        if (Global.player_reborn_location === null) {
            Global.player_reborn_location = begin;
        }

        // instantiate player
        //this.playerNode = cc.find("/Canvas/TiledMap/player"); // failed
        this.playerNode = self.node.getChildByName("player");;
        this.playerNode.setContentSize(Global.map_width * Global.tile_size,
                                       Global.map_height * Global.tile_size);
        //console.log(this.playerNode);
        //console.log(self.node);
        var player = cc.instantiate(this.player);
        //var testCoor = cc.v2(0, 0);

        //console.log(this.playerNode);
        this.playerNode.addChild(player);
        console.log(this.node.parent);
        player.setPosition(0, 0);
        //player.parent = this.node.parent;
        console.log(player);
        //player.position = begin;
        //player.position

        /*
        // get tiledmap layer
        var battle = TiledMap.getObjectGroup('battle');
        console.log(battle);

        // read object
        var st = TiledMap.getObjectGroup('small_treasure');
        var st1 = st.getObject('st1');
        var e0 = ee.getObject('e0');
        console.log('//////////////////////////////////');
        console.log(st1, e0);
        console.log('//////////////////////////////////');
        */
    },

    PixelToTile: function (point) { // object offset in tiledmap is left-bottom coor.
        var res = new Object();
        res.x = parseInt((point.x + Global.tile_size / 2) / Global.tile_size);
        res.y = parseInt((point.y - Global.tile_size / 2) / Global.tile_size);
        return res;
    },
    TileToPixel: function (point) { // object offset in tiledmap is left-bottom coor.
        var res = new Object();
        res.x =  Global.tile_size * point.x;
        res.y =  Global.tile_size * point.y;
        return res;
    },

    start () {

    },

    // update (dt) {},
});

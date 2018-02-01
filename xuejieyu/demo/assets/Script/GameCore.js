var Global = require("Global");

cc.Class({
    extends: cc.Component,

    properties: {
        tiledmap: {
            default: null,
            type: cc.Node
        },
        player: {
            default: null,
            type: cc.Node
        },
        camera: {
            default: null,
            type: cc.Node
        },
        player_component: {
            default: null,
            type: cc.Component
        },
        camera_component: {
            default: null,
            type: cc.Component
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var self = this;
        var id = Global.map_id;
        this.player_component = this.player.getComponent("Player");
        this.camera_component = this.camera.getComponent("CameraControl");

        cc.loader.loadRes("tiledmap/stage" + id, function(err, map){
            if (err) {
                console.log("tiledmap load error!");
            } else {
                var tiledmap = self.tiledmap.getComponent(cc.TiledMap);
                tiledmap.tmxAsset = map;
                self.TranslateMap(tiledmap);

                /* tiledmap load done, then initialize other node */
                self.player_component.onLoadPlayer();
                self.camera_component.onLoadCamera();
                /* finish game core scene initialization */
            }
        });
    },

    start () {

    },

    update (dt) {
        this.player_component.updatePlayer(dt);
        this.camera_component.updateCamera(dt);
    },

    TranslateMap: function (TiledMap) { // this is tiledmap translator.
        // init map location
        //this.node.setPosition(cc.visibleRect.bottomLeft);

        //console.log(TiledMap);
        //console.log(this.node);

        // get map size
        var mapSize = TiledMap.getMapSize();
        Global.map_width = mapSize.width;
        Global.map_height = mapSize.height;

        // get tile size
        Global.tile_size = TiledMap.getTileSize().width;

        // entrance and exit
        var ee = TiledMap.getObjectGroup('entrance_exit');
        var begin = this.PixelToTile(ee.getObject('e0').offset);
        var exit = this.PixelToTile(ee.getObject('e1').offset);
        var secret_stage = this.PixelToTile(ee.getObject('e2').offset);
        Global.player_reborn_location = this.TileToPixel(begin);

        /* instantiate prefab */
        //this.playerNode = cc.find("/Canvas/TiledMap/player"); // failed
        //var player_layer = self.node.getChildByName("player");
        //var player = cc.instantiate(this.player);
        //this.player.parent = player_layer;
        //this.playerNode.addChild(player);

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
        console.log(Global);
    },

    PixelToTile: function (point) { // object offset in tiledmap is left-bottom coor.
        var res = new Object();
        res.x = parseInt((point.x + Global.tile_size / 2) / Global.tile_size);
        res.y = parseInt((point.y - Global.tile_size / 2) / Global.tile_size);
        return res;
    },
    TileToPixel: function (point) { // object offset in tiledmap is left-bottom coor.
        var res = new Object();
        res.x =  Global.tile_size * (point.x + 0.5);
        res.y =  Global.tile_size * -(point.y + 0.5);
        return res;
    },
});


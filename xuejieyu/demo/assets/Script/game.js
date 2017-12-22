cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad: function () {
        this.sexylady = this.node.getChildByName('sexylady');
        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function(keyCode, event) {
                var newTile = cc.p(self.sexyladyTile.x, self.sexyladyTile.y);
                switch(keyCode) {
                    case cc.KEY.up:
                        newTile.y -= 1;
                        break;
                    case cc.KEY.down:
                        newTile.y += 1;
                        break;
                    case cc.KEY.left:
                        newTile.x -= 1;
                        break;
                    case cc.KEY.right:
                        newTile.x += 1;
                        break;
                    default:
                        return;
                }

                self.tryMoveToNewTile(newTile);

            }
        },self);
        this.loadMap();
    },



    tryMoveToNewTile: function(newTile) {
        var mapSize = this.tiledMap.getMapSize();
        if (newTile.x < 0 || newTile.x >= mapSize.width) return;
        if (newTile.y < 0 || newTile.y >= mapSize.height) return;

        if (this.wall.getTileGIDAt(newTile)) {//GID=0,则该Tile为空
            cc.log('This way is blocked!');
            return false;
        }

        this.tryCatchStar(newTile);

        this.sexyladyTile = newTile;
        this.updatePlayerPos();

        if (cc.pointEqualToPoint(this.sexyladyTile, this.endTile)) {
            cc.log('succeed');
        }
    },

    tryCatchStar: function(newTile){
        var GID = this.grass.getTileGIDAt(newTile);
        var prop = this.tiledMap.getPropertiesForGID(GID);
        if(prop.isGrass)
        {
            this.grass.removeTileAt(newTile);
        }
    },

    //加载地图文件时调用
    loadMap: function () {
        //初始化地图位置
        this.node.setPosition(cc.visibleRect.bottomLeft);
        //地图
        this.tiledMap = this.node.getComponent(cc.TiledMap);
        //player对象层
        var player = this.tiledMap.getObjectGroup('player');
        //startPoint和endPoint对象
        var startPoint = player.getObject('startPoint');
        var endPoint = player.getObject('endPoint');
        //像素坐标
        var startPos = cc.p(startPoint.x, startPoint.y);
        var endPos = cc.p(endPoint.x, endPoint.y);
        //障碍物图层和星星图层
        this.wall = this.tiledMap.getLayer('wall');
        this.grass = this.tiledMap.getLayer('grass');
        //出生Tile和结束Tile
        this.sexyladyTile = this.startTile = this.getTilePos(startPos);
        this.endTile = this.getTilePos(endPos);
        //更新sexylady位置
        this.updatePlayerPos();

    },

    //将像素坐标转化为瓦片坐标
    getTilePos: function(posInPixel) {
        var mapSize = this.node.getContentSize();
        var tileSize = this.tiledMap.getTileSize();
        var x = Math.floor(posInPixel.x / tileSize.width);
        var y = Math.floor((mapSize.height - posInPixel.y) / tileSize.height);
        return cc.p(x, y);
    },


    updatePlayerPos: function() {
        var pos = this.grass.getPositionAt(this.sexyladyTile);
        this.sexylady.setPosition(pos);
    },

});
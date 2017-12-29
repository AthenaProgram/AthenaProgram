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
        spriteFrames: {
            default: [],
            type: cc.SpriteFrame,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.dynParentSpt = null;

        this.dynamicType = null;
        this.canMoveByPlayer = false;
        this.destroyOnPlayerTouch = false;
        this.autoFalling = false;
        this.moveTarget = null;
        this.playerMoving = false;
        this.creepsDirectionX = 0;
        this.creepsDirectionY = 0;
        this.cannotMove = false;

        this.x = 0;
        this.y = 0;
        this.blinkTime = 0;

        this.playerMoveSeconds = 0.1;
        this.leftMoveSeconds = 0;
        this.cachePropertyList = [];
    },
     
    setInputControl: function () {
        var self = this;
        // 添加键盘事件监听
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            // 有按键按下时，判断是否是我们指定的方向控制键，并设置向对应方向加速
            onKeyPressed: function(keyCode, event) {
                switch(keyCode) {
                    case cc.KEY.a:
                        self.tryMovePlayer(-1, 0);
                        break;
                    case cc.KEY.d:
                        self.tryMovePlayer(1, 0);
                        break;
                    case cc.KEY.w:
                        self.tryMovePlayer(0, 1);
                        break;
                    case cc.KEY.s:
                        self.tryMovePlayer(0, -1);
                        break;
                    case cc.KEY.i:
                        self.trySave();
                    case cc.KEY.l:
                        self.tryLoad();
                }
            },
            // 松开按键时，停止向该方向的加速
            onKeyReleased: function(keyCode, event) {
                switch(keyCode) {
                    case cc.KEY.a:
                        self.aceeptNewClick = true;
                        break;
                    case cc.KEY.d:
                        self.aceeptNewClick = true;
                        break;
                        case cc.KEY.w:
                        self.aceeptNewClick = true;
                        break;
                    case cc.KEY.s:
                        self.aceeptNewClick = true;
                        break;
                }
            }
        }, self.node);
    },

    start () {

    },

    update (dt) {
        if(this.dynamicType == 0)//player
        {
            if(this.playerMoving)
            {
                if(this.leftMoveSeconds > dt)
                {
                    this.leftMoveSeconds -= dt;
                    this.node.setPosition(cc.pLerp(this.moveEnd, this.moveStart, this.leftMoveSeconds / this.playerMoveSeconds));
                    this.node.parent.parent.setPosition(-this.node.position.x, -this.node.position.y);
                }
                else
                {
                    this.onPlayerMoveDone();                    
                }
            }
            if(this.blinkTime > 0)
            {
                if(this.blinkTime > dt)
                {
                    this.blinkTime -= dt;
                    this.node.opacity = 255 - this.node.opacity;
                }
                else
                {
                    this.blinkTime = 0
                    this.node.opacity = 255;                 
                }
            }
        }
        else
        {
            if(this.creepsSpeedPerSeconds)
            {
                if(!this.cannotMove)
                {
                    var px = this.node.position.x + this.creepsSpeedPerSeconds * dt * this.creepsDirectionX;
                    var py = this.node.position.y + this.creepsSpeedPerSeconds * dt * this.creepsDirectionY;

                    var target_px = (this.x + this.creepsDirectionX) * 52;
                    var target_py = (this.y + this.creepsDirectionY) * 52;

                    if((target_px - px) * this.creepsDirectionX < 0 || (target_py - py) * this.creepsDirectionY < 0)
                    {
                        this.x += this.creepsDirectionX;
                        this.y += this.creepsDirectionY;
                        this.node.setPosition(px, py);
                        if(!this.canMove(this.creepsDirectionX, this.creepsDirectionY))
                        {
                            this.creepsDirectionX *= -1;
                            this.creepsDirectionY *= -1;
                            this.node.setPosition(2 * target_px - px, 2 * target_py - py);
                        }
                    }
                    else
                    {
                        this.node.setPosition(px, py);
                    }
                }
            }
        }
    },

    tryMovePlayer: function(dx, dy)
    {
        if(this.playerMoving == false && this.aceeptNewClick)
        {
            if(this.canMove(dx, dy))
            {
                this.aceeptNewClick = false;
                this.playerMoving = true;
                this.moveStart = cc.p(this.x * 52, this.y * 52);
                this.playerEndX = this.x + dx;
                this.playerEndY = this.y + dy;
                this.moveEnd = cc.p(this.playerEndX * 52, this.playerEndY * 52);
                this.leftMoveSeconds = this.playerMoveSeconds;
            }
        }
    },

    initialize: function(config, dynParentSpt)
    {
        this.dynParentSpt = dynParentSpt;
        var type = config[0];
        this.node.getComponent(cc.Sprite).spriteFrame = this.spriteFrames[type];
        this.dynamicType = type;
        switch (type)
        {
            case 0:
                this.setAsPlayer();
                break;
            case 1:
                this.setAsWall();
                break;
            case 2:
                this.setAsGrass();
                break;
            case 3:
                this.setAsGreenSnake(config);
                break;
        }
    },

    setAsPlayer: function()
    {
        this.playerMoving = false;
        this.aceeptNewClick = true;
        this.canMove = function(dx, dy)
        {
            if(!cc.availablePosMap[(this.x + dx) + "+" + (this.y + dy)])
            {
                console.log("can't move!");
                return false;
            }
            var nodeList = this.dynParentSpt.dynamicNodeList;
            for(var i = 0; i < nodeList.length; i ++)
            {
                var node = nodeList[i];
                var spt = node.getComponent("dynamicNode");
                if(node != this.node)
                {
                    if(spt.x == this.x + dx)
                    {
                        if(spt.y == this.y + dy)
                        {
                            if(!spt.canMoveByPlayer && !spt.destroyOnPlayerTouch)
                            {
                                return false;
                            }
                        }
                    }
                }
            }

            return true;
        }

        this.touchWith = function(spt)
        {
            if(spt.dynamicType == 3 && this.blinkTime <= 0)
            {
                console.log("Holy Shit!");
                this.blinkTime = 1;
            }
        }
        this.setInputControl();
    },

    setAsWall: function()
    {
        this.canMoveByPlayer = false;
        this.destroyOnPlayerTouch = false;
        this.autoFalling = false;
        this.moveTarget = null;
        this.touchWith = function(spt)
        {
            if(spt.dynamicType == 0)
            {
                console.log("what happened?");
            }
        }
    },

    setAsGrass: function()
    {
        this.canMoveByPlayer = false;
        this.destroyOnPlayerTouch = true;
        this.autoFalling = false;
        this.moveTarget = null;
        this.touchWith = function(spt)
        {
            if(spt.dynamicType == 0)
            {
                
                console.log("A grass has been destroyed")
                this.dynParentSpt.removeNodeFromList(this.node);
                this.node.destroy();
            }
        }
    },

    setAsGreenSnake: function(config)
    {
        this.canMoveByPlayer = false;
        this.destroyOnPlayerTouch = true;
        this.autoFalling = false;
        this.moveTarget = null;
        this.creepsDirectionX = config[3];
        this.creepsDirectionY = config[4];
        this.creepsSpeedPerSeconds = 104;
        this.touchWith = function(spt)
        {
            
        },
        this.canMove = function(dx, dy)
        {
            if(!cc.availablePosMap[(this.x + dx) + "+" + (this.y + dy)])
            {
                return false;
            }
            var nodeList = this.dynParentSpt.dynamicNodeList;
            for(var i = 0; i < nodeList.length; i ++)
            {
                var node = nodeList[i];
                var spt = node.getComponent("dynamicNode");
                if(node != this.node)
                {
                    if(spt.x == this.x + dx)
                    {
                        if(spt.y == this.y + dy)
                        {
                            if(spt.dynamicType == 1 || spt.dynamicType == 2)
                            {
                                return false;
                            }
                        }
                    }
                }
            }

            return true;
        }
    },

    setAsSavePosition: function(config)
    {

    },

    onPlayerMoveDone: function()
    {
        this.node.setPosition(this.moveEnd);
        //this.node.parent.parent.setPosition(cc.p(-this.playerEndX * 52, -this.playerEndY * 52));
        this.playerMoving = false;
        this.x = this.playerEndX;
        this.y = this.playerEndY;
        this.playerEndX = null;
        this.playerEndY = null;
    },

    lateUpdate: function(dt)
    {
        this.checkInEndOfFrame();
    },

    checkInEndOfFrame: function()
    {
        //low
        var nodeList = this.dynParentSpt.dynamicNodeList;
        for(var i = 0; i < nodeList.length; i ++)
        {
            var node = nodeList[i];
            var spt = node.getComponent("dynamicNode");
            if(node != this.node)
            {
                if(spt.x == this.x)
                {
                    if(spt.y == this.y)
                    {
                        this.touchWith(spt);
                    }
                }
            }
        }
        if(this.autoFalling)
        {
            this.checkFloating();
        }
    },

    checkFloating: function()
    {

    },

    getCacheData: function() //without position
    {
        var data = [];
        for(var i = 0; i < this.cachePropertyList.length; i++)
        {
            data.push(this[this.cachePropertyList[i]]);
        }
    },

    loadFromCacheData: function(data)
    {
        for(var i = 0; i < data.length; i++)
        {
            this[this.cachePropertyList[i]] = data[i];
        }
    },

    trySave: function()
    {
        this.dynParentSpt.cacheAllChildData();
    }

    tryLoad: function()
    {
        this.dynParentSpt.resetAllNodeFromCacheData();
    }
});

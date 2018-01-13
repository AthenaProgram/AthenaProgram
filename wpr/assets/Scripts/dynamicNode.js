cc.Class({
    extends: cc.Component,

    properties: {
        spriteFrames: {
            default: [],
            type: cc.SpriteFrame,
        },
    },

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
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
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
                        break;
                    case cc.KEY.l:
                        self.tryLoad();
                        break;
                }
            },
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
        if(this.dynamicType == 0)
        {
            if(this.playerMoving)
            {
                if(this.leftMoveSeconds > dt)
                {
                    this.leftMoveSeconds -= dt;
                    this.node.setPosition(cc.pLerp(this.moveEnd, this.moveStart, this.leftMoveSeconds / this.playerMoveSeconds));
                    this.setBgPosition()
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

    setBgPosition: function()
    {
        this.node.parent.parent.setPosition(-this.node.position.x, -this.node.position.y);
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

    initialize: function(config)
    {
        var type = config[0];
        this.setSprite(type);
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
        this.bindAll();
    },

    setSprite: function(dynamicType)
    {
        this.node.getComponent(cc.Sprite).spriteFrame = this.spriteFrames[dynamicType];
    },

    bindAll: function()
    {
        switch (this.dynamicType)
        {
            case 0:
                this.cachePropertyList = ["x", "y", "playerMoving", "aceeptNewClick"];
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
                break;
            case 1:
                this.cachePropertyList = ["x", "y", "canMoveByPlayer", "destroyOnPlayerTouch"];
                this.touchWith = function(spt)
                {
                    if(spt.dynamicType == 0)
                    {
                        console.log("what happened?");
                    }
                }
                break;
            case 2:
                this.cachePropertyList = ["x", "y", "canMoveByPlayer", "destroyOnPlayerTouch"];
                this.touchWith = function(spt)
                {
                    if(spt.dynamicType == 0)
                    {
                        console.log("A grass has been destroyed")
                        this.dynParentSpt.removeNodeFromList(this.node);
                        this.node.destroy();
                    }
                }
                break;
            case 3:
                this.cachePropertyList = ["x", "y", "creepsDirectionX", "creepsDirectionY", "creepsSpeedPerSeconds", "destroyOnPlayerTouch"];
                this.touchWith = function(spt)
                {
                    
                }
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
                break;
        }
    },

    setAsPlayer: function()
    {
        this.playerMoving = false;
        this.aceeptNewClick = true;
        
        
    },

    setAsWall: function()
    {
        this.canMoveByPlayer = false;
        this.destroyOnPlayerTouch = false;               
    },

    setAsGrass: function()
    {
        this.canMoveByPlayer = false;
        this.destroyOnPlayerTouch = true;      
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
        
    },

    onPlayerMoveDone: function()
    {
        this.node.setPosition(this.moveEnd);
        this.playerMoving = false;
        this.x = this.playerEndX;
        this.y = this.playerEndY;
        this.playerEndX = null;
        this.playerEndY = null;
    },

    lateUpdate: function(dt)
    {

    },

    checkInEndOfFrame: function()
    {
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

    getCacheData: function()
    {
        var data = [];
        for(var i = 0; i < this.cachePropertyList.length; i++)
        {
            data.push(this[this.cachePropertyList[i]]);
        }
        return data;
    },

    loadFromCacheData: function(data)
    {
        for(var i = 0; i < this.cachePropertyList.length; i++)
        {
            this[this.cachePropertyList[i]] = data[i];
        }
        if(this.dynamicType == 0)
        {
            this.setBgPosition();
        }
    },

    trySave: function()
    {
        this.dynParentSpt.cacheAllChildData();
    },

    tryLoad: function()
    {
        this.dynParentSpt.resetAllNodeFromCacheData();
    }
});

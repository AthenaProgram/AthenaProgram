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
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    SwitchScene: function () {
        var cur_scene = cc.director.getScene().name;
        console.log("current scene name is" + cur_scene);
        switch (cur_scene) {
            case "StartScene":
                cc.director.loadScene("BigMapScene");
                break;
        
            case "BigMapScene":
                cc.director.loadScene("GameScene");
                break;
        
            case "GameScene":
                cc.director.loadScene("AchievementScene");
                break;
        
            case "AchievementScene":
                cc.director.loadScene("BigMapScene");
                break;
        
            default:
                break;
        }
    },

    // update (dt) {},
});

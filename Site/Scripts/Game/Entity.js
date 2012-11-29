var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Game;
(function (Game) {
    var Entity = (function () {
        function Entity(config) {
            this._worldX = config.worldX;
            this._worldY = config.worldY;
        }
        Entity.prototype.canMove = function () {
            return false;
        };
        Entity.prototype.getKineticGroup = function () {
            var group = new Kinetic.Group();
            return group;
        };
        Entity.prototype.setParentLayer = function (parentLayer) {
            this._parentLayer = parentLayer;
        };
        Entity.prototype.draw = function () {
            if(!this._parentLayer) {
                throw new Error("_parentLayer is null. Must call setParentLayer first.");
            }
            this._parentLayer.draw();
        };
        return Entity;
    })();
    Game.Entity = Entity;    
    var Soldier = (function (_super) {
        __extends(Soldier, _super);
        function Soldier(config) {
                _super.call(this, config);
        }
        Soldier.prototype.canMove = function () {
            return true;
        };
        Soldier.prototype.getKineticGroup = function () {
            var self = this;
            var group = _super.prototype.getKineticGroup.call(this);
            var imageObj = new Image();
            imageObj.onload = function () {
                var image = new Kinetic.Image({
                    image: imageObj,
                    width: 48,
                    height: 48,
                    x: self._worldX,
                    y: self._worldY
                });
                group.add(image);
                self.draw();
                console.log("Drawing soldier");
            };
            imageObj.src = "http://www.militaryimages.net/forums/images/smilies/desert_soldier.gif";
            return group;
        };
        Soldier.prototype.moveToClick = function () {
        };
        return Soldier;
    })(Entity);
    Game.Soldier = Soldier;    
})(Game || (Game = {}));

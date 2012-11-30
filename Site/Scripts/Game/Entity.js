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
            this._group = new Kinetic.Group({
                x: this._worldX,
                y: this._worldY
            });
            return this._group;
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
        Entity.prototype.move = function (x, y, options) {
            if(this._group == undefined) {
                throw new Error("moveTo() _group undefined. Did you forget to call 'super.getKineticGroup()' in the overloaded getKineticGroup() method?");
            }
            if(options.pixelsPerSecond) {
                var distanceX = Math.abs(this._group.getX() - x);
                var distanceY = Math.abs(this._group.getY() - y);
                var totalDistanceToTravel = Math.sqrt((distanceX * distanceX) + (distanceY * distanceY));
                var duration = totalDistanceToTravel / options.pixelsPerSecond;
                this._group.transitionTo({
                    x: distanceX,
                    y: distanceY,
                    duration: duration
                });
            } else {
                this._group.move(distanceX, distanceY);
                this.draw();
            }
        };
        return Entity;
    })();
    Game.Entity = Entity;    
    var Sniper = (function (_super) {
        __extends(Sniper, _super);
        function Sniper(config) {
                _super.call(this, config);
        }
        Sniper.prototype.canMove = function () {
            return true;
        };
        Sniper.prototype.getKineticGroup = function () {
            var self = this;
            var group = _super.prototype.getKineticGroup.call(this);
            var imageObj = new Image();
            imageObj.onload = function () {
                var image = new Kinetic.Image({
                    image: imageObj,
                    width: 48,
                    height: 48
                });
                image.on('click', function () {
                    self.move(self._group.getX() + 50, self._group.getY() + 50, {
                        pixelsPerSecond: 10
                    });
                });
                group.add(image);
                self.draw();
                console.log("Drawing soldier");
            };
            imageObj.src = "/Images/GameAssets/Soldiers/Sniper.png";
            return group;
        };
        return Sniper;
    })(Entity);
    Game.Sniper = Sniper;    
})(Game || (Game = {}));

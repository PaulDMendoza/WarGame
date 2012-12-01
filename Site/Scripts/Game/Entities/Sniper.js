var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Game;
(function (Game) {
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
    })(Game.Entity);
    Game.Sniper = Sniper;    
})(Game || (Game = {}));

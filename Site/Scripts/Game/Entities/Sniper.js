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
            var soldier = this.addImage({
                url: "/Images/GameAssets/Soldiers/Sniper.png",
                width: 48,
                height: 48,
                onLoadPostDraw: function () {
                }
            });
            soldier.KineticImage.on('click touchend', function () {
                self.move(self.getWorldX() + 50, self.getWorldY() + 50, {
                    pixelsPerSecond: 20
                });
            });
            return group;
        };
        return Sniper;
    })(Game.Entity);
    Game.Sniper = Sniper;    
})(Game || (Game = {}));

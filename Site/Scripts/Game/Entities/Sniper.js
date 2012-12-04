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
            this._soldier = this.addImage({
                url: "/Images/GameAssets/Soldiers/Sniper.png",
                width: 48,
                height: 48,
                onLoadPostDraw: function () {
                }
            });
            this._soldier.KineticImage.on('click touchend', function () {
                self.move(self.getWorldX() + 50, self.getWorldY() + 50, {
                    pixelsPerSecond: 20
                });
            });
            return group;
        };
        Sniper.prototype.tick = function () {
            if(this._soldier) {
                var entitiesWithinRange = this.findEntities(400);
                if(entitiesWithinRange.length > 0) {
                    var nearestEntity = Enumerable.From(entitiesWithinRange).Where(function (ed) {
                        return !(ed.entity instanceof Sniper);
                    }).OrderBy(function (ed) {
                        return ed.distance;
                    }).FirstOrDefault(undefined);
                    if(nearestEntity) {
                        _super.prototype.shoot.call(this, {
                            targetX: nearestEntity.entity.getWorldX(),
                            targetY: nearestEntity.entity.getWorldY(),
                            timeBetweenShots: 1.5
                        });
                    }
                } else {
                }
            }
        };
        return Sniper;
    })(Game.Entity);
    Game.Sniper = Sniper;    
})(Game || (Game = {}));

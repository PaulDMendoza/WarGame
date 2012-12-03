var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Game;
(function (Game) {
    var Turret = (function (_super) {
        __extends(Turret, _super);
        function Turret(config) {
                _super.call(this, config);
        }
        Turret.prototype.getKineticGroup = function () {
            var self = this;
            var group = _super.prototype.getKineticGroup.call(this);
            this.machineGunNest = self.addImage({
                width: 128,
                height: 128,
                url: "/Images/GameAssets/MachineGunNest-1.png",
                onLoadPostDraw: function () {
                    self.machineGunner = self.addImage({
                        x: 0,
                        y: 0,
                        width: 128,
                        height: 128,
                        offset: {
                            x: 64,
                            y: 64
                        },
                        url: "/Images/GameAssets/Soldiers/MachineGunner.png",
                        onLoadPostDraw: function () {
                        }
                    });
                }
            });
            return group;
        };
        Turret.prototype.tick = function () {
            var self = this;
            if(this.machineGunner) {
                var entitiesWithinRange = this.findEntities(400);
                if(entitiesWithinRange.length > 0) {
                    var nearestEntity = Enumerable.From(entitiesWithinRange).OrderBy(function (ed) {
                        return ed.distance;
                    }).First();
                    this.machineGunner.KineticImage.transitionTo({
                        rotation: nearestEntity.radiansToEntity,
                        duration: 0.25
                    });
                    _super.prototype.shoot.call(this, {
                        targetX: nearestEntity.entity.getWorldX(),
                        targetY: nearestEntity.entity.getWorldY()
                    });
                    if(this.machineGunner && this.machineGunner.KineticImage) {
                        var rotation = Game.Utilities.radiansBetweenPoints(self.getWorldX(), self.getWorldY(), nearestEntity.entity.getWorldX(), nearestEntity.entity.getWorldY());
                        var anim = new Kinetic.Animation(function (frame) {
                            var angleDiff = rotation + (Game.Utilities.randomInteger(25) / 100);
                            self.machineGunner.KineticImage.setRotation(angleDiff);
                        }, self._parentLayer);
                        anim.start();
                    }
                } else {
                }
            }
            _super.prototype.tick.call(this);
        };
        return Turret;
    })(Game.Entity);
    Game.Turret = Turret;    
})(Game || (Game = {}));

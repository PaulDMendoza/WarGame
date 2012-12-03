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
                    this.shoot(nearestEntity.entity.getWorldX(), nearestEntity.entity.getWorldY());
                }
            }
            _super.prototype.tick.call(this);
        };
        Turret.prototype.shoot = function (x, y) {
            var self = this;
            var rotation = Game.Utilities.radiansBetweenPoints(this.getWorldX(), this.getWorldY(), x, y);
            var bulletGroup = new Kinetic.Group();
            var gunTipX = this.getWorldX();
            var gunTipY = this.getWorldY();
            var line = new Kinetic.Circle({
                x: gunTipX - this._group.getX(),
                y: gunTipY - this._group.getY(),
                fill: 'black',
                radius: 1
            });
            bulletGroup.add(line);
            var randomHits = [
                -16, 
                -40, 
                -15, 
                -20, 
                -32, 
                80, 
                90, 
                8, 
                32, 
                16, 
                25, 
                4, 
                5, 
                6
            ];
            var randomOffsetX = randomHits[Game.Utilities.randomInteger(randomHits.length - 1)];
            var randomOffsetY = randomHits[Game.Utilities.randomInteger(randomHits.length - 1)];
            var hitX = x - this._group.getX() + randomOffsetX;
            var hitY = y - this._group.getY() + randomOffsetY;
            var bulletHit = self.addImage({
                url: "/Images/GameAssets/BulletImpact-1.png",
                x: hitX,
                y: hitY,
                width: 4,
                height: 4,
                group: bulletGroup
            });
            bulletHit.KineticImage.hide();
            this._group.add(bulletGroup);
            this.draw();
            var distance = Game.Utilities.distanceBetweenPoints(this.getWorldX(), this.getWorldY(), x, y);
            line.transitionTo({
                x: hitX,
                y: hitY,
                duration: distance / 200,
                callback: function () {
                    line.hide();
                    bulletHit.KineticImage.show();
                    bulletHit.KineticImage.transitionTo({
                        width: 32,
                        height: 32,
                        opacity: 0.9,
                        offset: {
                            x: 16,
                            y: 16
                        },
                        duration: 0.15,
                        callback: function () {
                            bulletGroup.hide();
                        }
                    });
                }
            });
        };
        return Turret;
    })(Game.Entity);
    Game.Turret = Turret;    
})(Game || (Game = {}));

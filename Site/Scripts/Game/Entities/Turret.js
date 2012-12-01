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
            var machineGunNest = self.addImage({
                width: 128,
                height: 128,
                url: "/Images/GameAssets/MachineGunNest-1.png"
            });
            var machineGunner = self.addImage({
                width: 128,
                height: 128,
                url: "/Images/GameAssets/Soldiers/MachineGunner.png",
                onLoadPostDraw: function () {
                    setTimeout(function () {
                        machineGunner.KineticImage.moveToTop();
                    }, 100);
                }
            });
            return group;
        };
        Turret.prototype.tick = function () {
            var entitiesWithinRange = this.findEntities(400).length;
            if(entitiesWithinRange > 0) {
                console.log("Found " + entitiesWithinRange + " within range.");
            }
            _super.prototype.tick.call(this);
        };
        return Turret;
    })(Game.Entity);
    Game.Turret = Turret;    
})(Game || (Game = {}));

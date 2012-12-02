var Game;
(function (Game) {
    var Turret = (function (_super) {
        __extends(Turret, _super);
        function Turret(config) {
            _super.prototype(config);
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
            _super.prototype.tick.call(this);
        };
        return Turret;
    })(Entity);
    Game.Turret = Turret;    
})(Game || (Game = {}));

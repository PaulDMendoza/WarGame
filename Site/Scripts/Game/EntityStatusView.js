var Game;
(function (Game) {
    var EntityStatusView = (function () {
        function EntityStatusView(maxHealth) {
            this._healthPoints = maxHealth;
        }
        EntityStatusView.prototype.updateHealth = function () {
        };
        return EntityStatusView;
    })();
    Game.EntityStatusView = EntityStatusView;    
})(Game || (Game = {}));

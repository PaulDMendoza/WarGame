var Game;
(function (Game) {
    var GameController = (function () {
        function GameController() {
        }
        GameController.prototype.start = function () {
            var gameBoard = new Game.GameBoard('gameBoard');
            gameBoard.init();
            gameBoard.renderMapZone(zone1);
            gameBoard.renderMapZone(zone2);
        };
        GameController.origin = new GameController();
        return GameController;
    })();
    Game.GameController = GameController;    
})(Game || (Game = {}));

$(function () {
    var p = new Game.GameController();
    var dist = p.start();
});
var zone1 = new Game.MapZone();
zone1.worldX = 0;
zone1.worldY = 0;
var zone2 = new Game.MapZone();
zone1.worldX = 512;
zone1.worldY = 0;

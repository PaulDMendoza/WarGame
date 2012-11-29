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
            gameBoard.addEntity(new Game.Soldier({
                worldX: 100,
                worldY: 200
            }));
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
var zone1 = {
    worldX: 0,
    worldY: 0
};
var zone2 = {
    worldX: 512,
    worldY: 512
};

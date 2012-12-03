var Game;
(function (Game) {
    var GameController = (function () {
        function GameController() {
        }
        GameController.prototype.start = function () {
            var gameBoard = new Game.GameBoard('gameBoard');
            gameBoard.init();
            gameBoard.renderMapZone({
                worldX: 0,
                worldY: 0
            });
            gameBoard.renderMapZone({
                worldX: 512,
                worldY: 512
            });
            gameBoard.renderMapZone({
                worldX: 0,
                worldY: 512
            });
            gameBoard.renderMapZone({
                worldX: 512,
                worldY: 0
            });
            gameBoard.addEntity(new Game.Sniper({
                worldX: 100,
                worldY: 200
            }));
            gameBoard.addEntity(new Game.Sniper({
                worldX: 160,
                worldY: 240
            }));
            gameBoard.addEntity(new Game.Sniper({
                worldX: 55,
                worldY: 80
            }));
            gameBoard.addEntity(new Game.Turret({
                worldX: 450,
                worldY: 300
            }));
        };
        GameController.origin = new GameController();
        return GameController;
    })();
    Game.GameController = GameController;    
})(Game || (Game = {}));
$(function () {
    var p = new Game.GameController();
    p.start();
});

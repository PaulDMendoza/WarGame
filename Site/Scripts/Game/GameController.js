var Game;
(function (Game) {
    var Utilities = (function () {
        function Utilities() { }
        Utilities.distanceBetweenPoints = function distanceBetweenPoints(x1, y1, x2, y2) {
            var distanceX = Math.abs(x1 - x2);
            var distanceY = Math.abs(y1 - y2);
            var tangent = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
            return tangent;
        }
        return Utilities;
    })();
    Game.Utilities = Utilities;    
    var GameController = (function () {
        function GameController() {
        }
        GameController.prototype.start = function () {
            var gameBoard = new Game.GameBoard('gameBoard');
            gameBoard.init();
            gameBoard.renderMapZone(zone1);
            gameBoard.renderMapZone(zone2);
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

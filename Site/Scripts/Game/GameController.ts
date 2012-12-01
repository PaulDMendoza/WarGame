/// <reference path="Entity.ts" />
/// <reference path="../tsReferences.ts" />
/// <reference path="GameBoard.ts" />

// Interface
interface IGameController {
    start();
}

// Module
module Game {

    
    export class Utilities {
        public static distanceBetweenPoints(x1: number, y1: number, x2: number, y2: number): number {
            var distanceX = Math.abs(x1 - x2);
            var distanceY = Math.abs(y1 - y2);
            var tangent = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
            return tangent;
        }

        public static radiansBetweenPoints(x1: number, y1: number, x2: number, y2: number): number {
            return Math.atan2(y2 - y1, x2 - x1);
        }
    }    

    // Class
    export class GameController implements IGameController {
        // Constructor
        constructor () { }

        // Instance member
        start() 
        {            
            var gameBoard = new Game.GameBoard('gameBoard');
            gameBoard.init();
            gameBoard.renderMapZone(zone1);
            gameBoard.renderMapZone(zone2);
            gameBoard.renderMapZone({worldX: 0, worldY: 512});
            gameBoard.renderMapZone({worldX: 512, worldY: 0});
            gameBoard.addEntity(new Game.Sniper({ worldX: 100, worldY: 200 }));
            gameBoard.addEntity(new Game.Sniper({ worldX: 160, worldY: 240 }));
            gameBoard.addEntity(new Game.Sniper({ worldX: 55, worldY: 80 }));
            gameBoard.addEntity(new Game.Turret({ worldX: 450, worldY: 300 }));
        }

        // Static member
        static origin = new GameController();
    }
}

$(function () {
    var p: IGameController = new Game.GameController();
    var dist = p.start();
});


var zone1 = <Game.IMapZone>{
        worldX: 0,
        worldY: 0
    };

var zone2 = <Game.IMapZone>{
    worldX: 512,
    worldY: 512
};

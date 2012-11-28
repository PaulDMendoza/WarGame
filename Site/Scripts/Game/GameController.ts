/// <reference path="../tsReferences.ts" />
/// <reference path="GameBoard.ts" />

// Interface
interface IGameController {
    start();
}

// Module
module Game {

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
        }

        // Static member
        static origin = new GameController();
    }
}

$(function () {
    var p: IGameController = new Game.GameController();
    var dist = p.start();
});

var zone1 = new Game.MapZone();
zone1.worldX = 0;
zone1.worldY = 0;

var zone2 = new Game.MapZone();
zone1.worldX = 512;
zone1.worldY = 0;


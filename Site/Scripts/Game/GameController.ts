/// <reference path="Entity.ts" />
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
            gameBoard.renderMapZone({worldX: 0, worldY: 512});
            gameBoard.renderMapZone({worldX: 512, worldY: 0});
            gameBoard.addEntity(new Game.Sniper({ worldX: 100, worldY: 200 }));
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

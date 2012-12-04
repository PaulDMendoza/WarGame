/// <reference path="Entity.ts" />
/// <reference path="../tsReferences.ts" />




module Game {

    export class MapZoneLayer {
        public KineticLayer: Kinetic.Layer;
        public ZoneData: IMapZone;
        getWorldX() {
            return this.ZoneData.worldX;
        }
        getWorldY() {
            return this.ZoneData.worldY;
        }

        getWidth() {
            return 512;
        }

        getHeight() {
            return 512;
        }

    }

    export interface IMapZone {
        worldX: number;
        worldY: number;
    }

    export class GameBoard {
        public gameBoardID: string;
        public stage: Kinetic.Stage;

        public movableEntitiesLayer: Kinetic.Layer;
        private self: GameBoard;

        public entities: Entity[];
        public mapZoneLayers: MapZoneLayer[];
        public _gameLoopInterval: any;
        
        constructor (gameBoardID?: string) {
            this.gameBoardID = gameBoardID;
            this.entities = [];
            this.mapZoneLayers = [];            
        }

        init() {
            var self = this;
            var $gameBoard = $('#' + this.gameBoardID);
            var width = $gameBoard.parent().width();
            var height = width;            

            this.stage = new Kinetic.Stage({
                container: this.gameBoardID,
                width: width,
                height: height,
                draggable: true
            });

            this.movableEntitiesLayer = new Kinetic.Layer();
            this.movableEntitiesLayer.beforeDraw(()=> { this.gameLoop(this); });
            this.stage.add(this.movableEntitiesLayer);     
            
            // This loop ensures that if the draw event isn't firing the game loop then this is at least trying to. 
            this._gameLoopInterval = setInterval(() => { this.stage.draw() }, 1000);
        }
        
        _lastTickTime: Date = new Date();
        gameLoop(self : GameBoard) {   
            if (self._lastTickTime === undefined) {
                self._lastTickTime = new Date();
            }
            if (new Date(self._lastTickTime.getTime() + 250) <= new Date()) {
                console.log("ticking");
                self._lastTickTime = new Date();
                var entitiesLen = self.entities.length;
                for (var i = 0; i < entitiesLen; i++) {
                    var entity = self.entities[i];
                    entity.tick();
                }
            }
        }

        dispose() {            
            clearInterval(this._gameLoopInterval);
            this.stage.remove();
        }

        renderMapZone(mapZoneData: IMapZone) {
            var self = this;
            var mapZoneLayer = new MapZoneLayer();
            mapZoneLayer.KineticLayer = new Kinetic.Layer();

            mapZoneLayer.ZoneData = mapZoneData;

            var relativeX = mapZoneData.worldX;
            var relativeY = mapZoneData.worldY;

            var box = new Kinetic.Rect({
                x: relativeX,
                y: relativeY,
                width: mapZoneLayer.getWidth(),
                height: mapZoneLayer.getHeight(),
                name: 'background',
                fill: 'white'
            });
            mapZoneLayer.KineticLayer.add(box);
            mapZoneLayer.KineticLayer.beforeDraw(()=> { this.gameLoop(this); });
            this.stage.add(mapZoneLayer.KineticLayer);
            this.mapZoneLayers.push(mapZoneLayer);
            mapZoneLayer.KineticLayer.moveToBottom();
        }

        getLayerUnderPoint(x: number, y: number): MapZoneLayer {
            var len = this.mapZoneLayers.length;
            for (var i = 0; i < len; i++) {
                var mapZoneLayer = this.mapZoneLayers[i];
                var zoneX = mapZoneLayer.getWorldX();
                var zoneY = mapZoneLayer.getWorldY();
                var zoneBoundryX = zoneX + mapZoneLayer.getWidth();
                var zoneBoundryY = zoneY + mapZoneLayer.getHeight();
                if (zoneX <= x && x <= zoneBoundryX) {
                    if (zoneY <= x && x <= zoneBoundryY) {
                        return mapZoneLayer;
                    }
                }
            }
            throw new Error("Unable to find a zone under point. There must have been a data loading error in the GameBoard.");
        }

        addEntity(entity: Entity) {
            this.entities.push(entity);
            entity.setGameBoard(this);

            var kineticGroup: Kinetic.Group;
            if (entity.canMove()) {
                entity.setParentLayer(this.movableEntitiesLayer, 0, 0);
                kineticGroup = entity.getKineticGroup();
                this.movableEntitiesLayer.add(kineticGroup);
            } else {
                var layerUnderPoint = this.getLayerUnderPoint(entity._x, entity._y);
                entity.setParentLayer(layerUnderPoint.KineticLayer, layerUnderPoint.getWorldX(), layerUnderPoint.getWorldY());
                kineticGroup = entity.getKineticGroup();
                layerUnderPoint.KineticLayer.add(kineticGroup);
            }
        }
    }
}


QUnit.module("GameBoard");
var testGameBoard : Game.GameBoard;
function destroyTestGameBoard() : void {
    if (testGameBoard) {
        testGameBoard.dispose();
    }
}
function setupTestGameBoard() : Game.GameBoard {
    testGameBoard = new Game.GameBoard('testGameBoard');
    testGameBoard.init();
    
    testGameBoard.renderMapZone({ worldX: 0, worldY: 0 });
    testGameBoard.renderMapZone({ worldX: 512, worldY: 0 });
    return testGameBoard;
}


QUnit.testDone(function (details) {
    destroyTestGameBoard();
});
QUnit.test("getLayerUnderPoint", function () {
    var gb = setupTestGameBoard();
    var z = {
        worldX: 1024, worldY: 1024
    };
    gb.renderMapZone(z);

    var layer = testGameBoard.getLayerUnderPoint(1026, 1026);
    QUnit.ok(layer.ZoneData == z, "checking zone is valid");    
});


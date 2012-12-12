var Game;
(function (Game) {
    var MapZoneLayer = (function () {
        function MapZoneLayer() { }
        MapZoneLayer.prototype.getWorldX = function () {
            return this.ZoneData.worldX;
        };
        MapZoneLayer.prototype.getWorldY = function () {
            return this.ZoneData.worldY;
        };
        MapZoneLayer.prototype.getWidth = function () {
            return 512;
        };
        MapZoneLayer.prototype.getHeight = function () {
            return 512;
        };
        return MapZoneLayer;
    })();
    Game.MapZoneLayer = MapZoneLayer;    
    var GameBoard = (function () {
        function GameBoard(gameBoardID) {
            this._lastTickTime = new Date();
            this.gameBoardID = gameBoardID;
            this.entities = [];
            this.mapZoneLayers = [];
        }
        GameBoard.prototype.init = function () {
            var _this = this;
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
            this.movableEntitiesLayer.beforeDraw(function () {
                _this.gameLoop(_this);
            });
            this.stage.add(this.movableEntitiesLayer);
            this._gameLoopInterval = setInterval(function () {
                for(var i = 0; i < _this.mapZoneLayers.length; i++) {
                    var layer = _this.mapZoneLayers[i];
                    layer.KineticLayer.draw();
                }
            }, 1000);
        };
        GameBoard.prototype.gameLoop = function (self) {
            if(self._lastTickTime === undefined) {
                self._lastTickTime = new Date();
            }
            if(new Date(self._lastTickTime.getTime() + 250) <= new Date()) {
                self._lastTickTime = new Date();
                console.log("ticking");
                var entitiesLen = self.entities.length;
                for(var i = 0; i < entitiesLen; i++) {
                    var entity = self.entities[i];
                    entity.tick();
                }
            }
        };
        GameBoard.prototype.dispose = function () {
            clearInterval(this._gameLoopInterval);
            this.stage.remove();
        };
        GameBoard.prototype.renderMapZone = function (mapZoneData) {
            var _this = this;
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
            mapZoneLayer.KineticLayer.beforeDraw(function () {
                _this.gameLoop(_this);
            });
            this.stage.add(mapZoneLayer.KineticLayer);
            this.mapZoneLayers.push(mapZoneLayer);
            mapZoneLayer.KineticLayer.moveToBottom();
        };
        GameBoard.prototype.getLayerUnderPoint = function (x, y) {
            var len = this.mapZoneLayers.length;
            for(var i = 0; i < len; i++) {
                var mapZoneLayer = this.mapZoneLayers[i];
                var zoneX = mapZoneLayer.getWorldX();
                var zoneY = mapZoneLayer.getWorldY();
                var zoneBoundryX = zoneX + mapZoneLayer.getWidth();
                var zoneBoundryY = zoneY + mapZoneLayer.getHeight();
                if(zoneX <= x && x <= zoneBoundryX) {
                    if(zoneY <= x && x <= zoneBoundryY) {
                        return mapZoneLayer;
                    }
                }
            }
            throw new Error("Unable to find a zone under point. There must have been a data loading error in the GameBoard.");
        };
        GameBoard.prototype.addEntity = function (entity) {
            this.entities.push(entity);
            entity.setGameBoard(this);
            var kineticGroup;
            if(entity.canMove()) {
                entity.setParentLayer(this.movableEntitiesLayer, 0, 0);
                kineticGroup = entity.getKineticGroup();
                this.movableEntitiesLayer.add(kineticGroup);
            } else {
                var layerUnderPoint = this.getLayerUnderPoint(entity._x, entity._y);
                entity.setParentLayer(layerUnderPoint.KineticLayer, layerUnderPoint.getWorldX(), layerUnderPoint.getWorldY());
                kineticGroup = entity.getKineticGroup();
                layerUnderPoint.KineticLayer.add(kineticGroup);
            }
        };
        return GameBoard;
    })();
    Game.GameBoard = GameBoard;    
})(Game || (Game = {}));
QUnit.module("GameBoard");
var testGameBoard;
function destroyTestGameBoard() {
    if(testGameBoard) {
        testGameBoard.dispose();
    }
}
function setupTestGameBoard() {
    testGameBoard = new Game.GameBoard('testGameBoard');
    testGameBoard.init();
    testGameBoard.renderMapZone({
        worldX: 0,
        worldY: 0
    });
    testGameBoard.renderMapZone({
        worldX: 512,
        worldY: 0
    });
    return testGameBoard;
}
QUnit.testDone(function (details) {
    destroyTestGameBoard();
});
QUnit.test("getLayerUnderPoint", function () {
    var gb = setupTestGameBoard();
    var z = {
        worldX: 1024,
        worldY: 1024
    };
    gb.renderMapZone(z);
    var layer = testGameBoard.getLayerUnderPoint(1026, 1026);
    QUnit.ok(layer.ZoneData == z, "checking zone is valid");
});

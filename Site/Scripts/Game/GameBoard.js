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
            this.gameBoardID = gameBoardID;
            this.entities = [];
            this.mapZoneLayers = [];
        }
        GameBoard.prototype.init = function () {
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
            this.stage.add(this.movableEntitiesLayer);
        };
        GameBoard.prototype.renderMapZone = function (mapZoneData) {
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
                fill: 'green'
            });
            mapZoneLayer.KineticLayer.add(box);
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
            var kineticGroup;
            if(entity.canMove()) {
                entity.setParentLayer(this.movableEntitiesLayer);
                kineticGroup = entity.getKineticGroup();
                this.movableEntitiesLayer.add(kineticGroup);
            } else {
                throw new Error("Not implemented, still need to set the parent layer");
                var layerUnderPoint = this.getLayerUnderPoint(entity._worldX, entity._worldY).KineticLayer;
                layerUnderPoint.add(kineticGroup);
            }
        };
        return GameBoard;
    })();
    Game.GameBoard = GameBoard;    
})(Game || (Game = {}));
QUnit.module("GameBoard");
QUnit.test("getLayerUnderPoint", function () {
    var gameBoard = new Game.GameBoard('testGameBoard');
    gameBoard.init();
    var zone1 = {
        worldX: 0,
        worldY: 0
    };
    var zone2 = {
        worldX: 512,
        worldY: 512
    };
    gameBoard.renderMapZone(zone1);
    gameBoard.renderMapZone(zone2);
    var layer = gameBoard.getLayerUnderPoint(600, 256);
    QUnit.ok(layer.ZoneData == zone2, "checking zone is valid");
});

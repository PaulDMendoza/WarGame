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
                height: height
            });
            this.worldGroup = new Kinetic.Group();
            this.worldGroup.setDraggable(true);
            this.worldLayer = new Kinetic.Layer();
            this.worldLayer.add(this.worldGroup);
            this.stage.add(this.worldLayer);
        };
        GameBoard.prototype.renderMapZone = function (mapZoneData) {
            var mapZoneLayer = new MapZoneLayer();
            mapZoneLayer.KineticGroup = new Kinetic.Group();
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
            mapZoneLayer.KineticGroup.add(box);
            this.worldGroup.add(mapZoneLayer.KineticGroup);
            this.worldLayer.draw();
            this.mapZoneLayers.push(mapZoneLayer);
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
            entity.setParentLayer(this.worldLayer);
            var kineticGroup = entity.getKineticGroup();
            if(entity.canMove()) {
                this.worldGroup.add(kineticGroup);
            } else {
                var group = this.getLayerUnderPoint(entity._worldX, entity._worldY).KineticGroup;
                group.add(entity.getKineticGroup());
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

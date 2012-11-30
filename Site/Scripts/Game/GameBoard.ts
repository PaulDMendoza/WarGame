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
        

        constructor (gameBoardID?: string) {
            this.gameBoardID = gameBoardID;  
            this.entities = [];
            this.mapZoneLayers = [];            
        }
        
        init() {            
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
        }

        renderMapZone(mapZoneData : IMapZone) {
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
        }

        getLayerUnderPoint(x : number , y: number) : MapZoneLayer {
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

        addEntity(entity : Entity) {
            this.entities.push(entity);
            
            var kineticGroup;
                        
            if (entity.canMove()) {                
                entity.setParentLayer(this.movableEntitiesLayer);
                kineticGroup = entity.getKineticGroup();
                this.movableEntitiesLayer.add(kineticGroup);
            } else {
                throw new Error("Not implemented, still need to set the parent layer");
                
                var layerUnderPoint = this.getLayerUnderPoint(entity._worldX, entity._worldY).KineticLayer;
                layerUnderPoint.add(kineticGroup);
            }
        }
    }    
}


QUnit.module("GameBoard");
QUnit.test("getLayerUnderPoint", function () {
    
    var gameBoard = new Game.GameBoard('testGameBoard');
    gameBoard.init();
    var zone1 = <Game.IMapZone>{
        worldX: 0,
        worldY: 0
    };

    var zone2 = <Game.IMapZone>{
        worldX: 512,
        worldY: 512
    };
    
    gameBoard.renderMapZone(zone1);
    gameBoard.renderMapZone(zone2);
    var layer = gameBoard.getLayerUnderPoint(600, 256);
    QUnit.ok(layer.ZoneData == zone2, "checking zone is valid");
    
});


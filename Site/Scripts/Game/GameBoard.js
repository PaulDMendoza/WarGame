var Game;
(function (Game) {
    var MapZone = (function () {
        function MapZone() { }
        return MapZone;
    })();
    Game.MapZone = MapZone;    
    var GameBoard = (function () {
        function GameBoard(gameBoardID) {
            this.gameBoardID = gameBoardID;
        }
        GameBoard.prototype.init = function () {
            var $gameBoard = $('#' + this.gameBoardID);
            var width = $gameBoard.parent().width();
            var height = width * 0.5;
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
            var relativeX = mapZoneData.worldX;
            var relativeY = mapZoneData.worldY;
            var zoneGroup = new Kinetic.Group();
            var box = new Kinetic.Rect({
                x: relativeX,
                y: relativeY,
                width: 512,
                height: 512,
                name: 'background',
                fill: 'green'
            });
            zoneGroup.add(box);
            var colors = [
                'red', 
                'orange', 
                'yellow'
            ];
            for(var n = 0; n < 3; n++) {
                (function () {
                    var i = n;
                    var box = new Kinetic.Rect({
                        x: relativeX + (i * 30),
                        y: relativeY + (i * 18),
                        width: 100,
                        height: 50,
                        name: colors[i],
                        fill: colors[i],
                        stroke: 'black',
                        strokeWidth: 4
                    });
                    zoneGroup.add(box);
                })();
            }
            this.worldGroup.add(zoneGroup);
            this.worldLayer.draw();
        };
        return GameBoard;
    })();
    Game.GameBoard = GameBoard;    
})(Game || (Game = {}));


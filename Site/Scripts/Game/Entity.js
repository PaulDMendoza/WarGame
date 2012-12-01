var Game;
(function (Game) {
    var Entity = (function () {
        function Entity(config) {
            this._worldX = config.worldX;
            this._worldY = config.worldY;
        }
        Entity.prototype.setGameBoard = function (gameBoard) {
            this._gameBoard = gameBoard;
        };
        Entity.prototype.canMove = function () {
            return false;
        };
        Entity.prototype.getKineticGroup = function () {
            this._group = new Kinetic.Group({
                x: this._worldX,
                y: this._worldY
            });
            return this._group;
        };
        Entity.prototype.setParentLayer = function (parentLayer) {
            this._parentLayer = parentLayer;
        };
        Entity.prototype.draw = function () {
            if(!this._parentLayer) {
                throw new Error("_parentLayer is null. Must call setParentLayer first.");
            }
            this._parentLayer.draw();
        };
        Entity.prototype.move = function (x, y, options) {
            if(this._group == undefined) {
                throw new Error("moveTo() _group undefined. Did you forget to call 'super.getKineticGroup()' in the overloaded getKineticGroup() method?");
            }
            if(options.pixelsPerSecond) {
                var distanceX = Math.abs(this._group.getX() - x);
                var distanceY = Math.abs(this._group.getY() - y);
                var totalDistanceToTravel = Math.sqrt((distanceX * distanceX) + (distanceY * distanceY));
                var duration = totalDistanceToTravel / options.pixelsPerSecond;
                this._group.transitionTo({
                    x: x,
                    y: y,
                    duration: duration
                });
            } else {
                this._group.move(distanceX, distanceY);
                this.draw();
            }
        };
        Entity.prototype.addImage = function (options) {
            if(!this._group) {
                throw new Error("_group must be defined before calling addImage.");
            }
            var self = this;
            var returnResult = {
            };
            returnResult.imageObj = new Image();
            returnResult.KineticImage = new Kinetic.Image({
                image: returnResult.imageObj,
                width: options.width,
                height: options.height
            });
            returnResult.imageObj.onload = function () {
                self._group.add(returnResult.KineticImage);
                self.draw();
                if(options.onLoadPostDraw) {
                    options.onLoadPostDraw();
                }
            };
            returnResult.imageObj.src = options.url;
            return returnResult;
        };
        Entity.prototype.tick = function () {
            this._worldX = this._group.getX();
            this._worldY = this._group.getY();
        };
        Entity.prototype.findEntities = function (withinPixelRange) {
            var entitiesWithinRange = [];
            var entitiesLen = this._gameBoard.entities.length;
            for(var i = 0; i < entitiesLen; i++) {
                var entity = this._gameBoard.entities[i];
                if(entity === this) {
                    continue;
                }
                var distance = Game.Utilities.distanceBetweenPoints(this._worldX, this._worldY, entity._worldX, entity._worldY);
                if(distance < withinPixelRange) {
                    entitiesWithinRange.push(entity);
                }
            }
            return entitiesWithinRange;
        };
        return Entity;
    })();
    Game.Entity = Entity;    
})(Game || (Game = {}));

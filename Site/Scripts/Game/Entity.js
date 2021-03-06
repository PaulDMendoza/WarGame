var Game;
(function (Game) {
    var Entity = (function () {
        function Entity(config) {
            this._health = 256;
            this._gunDamage = 16;
            this._x = config.worldX;
            this._y = config.worldY;
        }
        Entity.prototype.setGameBoard = function (gameBoard) {
            this._gameBoard = gameBoard;
        };
        Entity.prototype.canMove = function () {
            return false;
        };
        Entity.prototype.getWorldX = function () {
            return this._group.getX();
        };
        Entity.prototype.getWorldY = function () {
            return this._group.getY();
        };
        Entity.prototype.getKineticGroup = function () {
            this._group = new Kinetic.Group({
                x: this._x,
                y: this._y
            });
            return this._group;
        };
        Entity.prototype.setParentLayer = function (parentLayer, parentLayerOffsetX, parentLayerOffsetY) {
            this._parentLayer = parentLayer;
            this._parentLayerOffsetX = parentLayerOffsetX;
            this._parentLayerOffsetY = parentLayerOffsetY;
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
            var x = options.x;
            if(x === undefined) {
                x = (options.width / 2) * -1;
            }
            var y = options.y;
            if(y === undefined) {
                y = (options.height / 2) * -1;
            }
            returnResult.KineticImage = new Kinetic.Image({
                x: x,
                y: y,
                image: returnResult.imageObj,
                width: options.width,
                height: options.height
            });
            if(options.offset) {
                returnResult.KineticImage.setOffset(options.offset.x, options.offset.y);
            }
            returnResult.imageObj.onload = function () {
                if(options.group === undefined) {
                    self._group.add(returnResult.KineticImage);
                } else {
                    options.group.add(returnResult.KineticImage);
                }
                self.draw();
                if(options.onLoadPostDraw) {
                    options.onLoadPostDraw();
                }
            };
            returnResult.imageObj.src = options.url;
            return returnResult;
        };
        Entity.prototype.tick = function () {
            this._x = this._group.getX();
            this._y = this._group.getY();
        };
        Entity.prototype.findEntities = function (withinPixelRange, onlyLivingEntities) {
            var entitiesWithinRange = [];
            var entitiesLen = this._gameBoard.entities.length;
            for(var i = 0; i < entitiesLen; i++) {
                var entity = this._gameBoard.entities[i];
                if(entity === this) {
                    continue;
                }
                if(onlyLivingEntities && entity.isDead()) {
                    continue;
                }
                var distance = Game.Utilities.distanceBetweenPoints(this.getWorldX(), this.getWorldY(), entity.getWorldX(), entity.getWorldY());
                var radiansToEntity = Game.Utilities.radiansBetweenPoints(entity.getWorldX(), entity.getWorldY(), this.getWorldX(), this.getWorldY());
                if(distance < withinPixelRange) {
                    entitiesWithinRange.push({
                        distance: distance,
                        entity: entity,
                        radiansToEntity: radiansToEntity
                    });
                }
            }
            return entitiesWithinRange;
        };
        Entity.prototype.shoot = function (options) {
            var _this = this;
            var self = this;
            if(this._shoot_lastShotFired < new Date(Date.now() + (options.timeBetweenShots * 1000))) {
                return;
            }
            this._shoot_lastShotFired = new Date(Date.now());
            var rotation = Game.Utilities.radiansBetweenPoints(this.getWorldX(), this.getWorldY(), options.targetX, options.targetY);
            var bulletGroup = new Kinetic.Group();
            var gunTipX = this.getWorldX();
            var gunTipY = this.getWorldY();
            var line = new Kinetic.Circle({
                x: gunTipX - this._group.getX(),
                y: gunTipY - this._group.getY(),
                fill: 'black',
                radius: 1
            });
            bulletGroup.add(line);
            var randomOffsetX = Game.Utilities.randomInteger(80, true);
            var randomOffsetY = Game.Utilities.randomInteger(80, true);
            var hitX = options.targetX - this._group.getX() + randomOffsetX;
            var hitY = options.targetY - this._group.getY() + randomOffsetY;
            var bulletHit = self.addImage({
                url: "/Images/GameAssets/BulletImpact-1.png",
                x: hitX,
                y: hitY,
                width: 4,
                height: 4,
                group: bulletGroup
            });
            bulletHit.KineticImage.hide();
            this._group.add(bulletGroup);
            this.draw();
            var distance = Game.Utilities.distanceBetweenPoints(this.getWorldX(), this.getWorldY(), options.targetX, options.targetY);
            line.transitionTo({
                x: hitX,
                y: hitY,
                duration: distance / 250,
                callback: function () {
                    if(options.entityShootingAt) {
                        options.entityShootingAt.takeDamage(_this._gunDamage);
                    }
                    line.hide();
                    bulletHit.KineticImage.show();
                    bulletHit.KineticImage.transitionTo({
                        width: 32,
                        height: 32,
                        opacity: 0.9,
                        offset: {
                            x: 16,
                            y: 16
                        },
                        duration: 0.15,
                        callback: function () {
                            bulletGroup.remove();
                        }
                    });
                }
            });
        };
        Entity.prototype.takeDamage = function (damageTaken) {
            this._health -= damageTaken;
            if(this.isDead()) {
                this.entityKilled();
            }
        };
        Entity.prototype.entityKilled = function () {
            this._health = 0;
            this._group.removeChildren();
            this.draw();
        };
        Entity.prototype.isDead = function () {
            return this._health <= 0;
        };
        return Entity;
    })();
    Game.Entity = Entity;    
})(Game || (Game = {}));
QUnit.module("Entity");
QUnit.testDone(function () {
    destroyTestGameBoard();
});
QUnit.test("constructor", function () {
    var e = new Game.Entity({
        worldX: 400,
        worldY: 500
    });
    QUnit.strictEqual(400, e._x, "_x");
    QUnit.strictEqual(500, e._y, "_y");
});
QUnit.test("findEntities", function () {
    var gb = setupTestGameBoard();
    var e = new Game.Entity({
        worldX: 0,
        worldY: 0
    });
    var e2 = new Game.Entity({
        worldX: 0,
        worldY: 500
    });
    gb.addEntity(e);
    gb.addEntity(e2);
    var nearby100 = e.findEntities(100);
    QUnit.strictEqual(0, nearby100.length, "entities out of range");
    var nearby600 = e.findEntities(600);
    QUnit.strictEqual(1, nearby600.length, "one entity in range");
});
QUnit.test("getX and getY", function () {
    var gb = setupTestGameBoard();
    var e = new Game.Entity({
        worldX: 250,
        worldY: 60
    });
    gb.addEntity(e);
    QUnit.strictEqual(250, e.getWorldX(), "getWorldX");
    QUnit.strictEqual(60, e.getWorldY(), "getWorldY");
});

/// <reference path="GameController.ts" />
/// <reference path="GameBoard.ts" />
/// <reference path="Entities/Turret.ts" />
/// <reference path="Entities/Sniper.ts" />
/// <reference path="../tsReferences.ts" />

module Game {

    export class Entity {

        _x: number;
        _y: number;
        _parentLayerOffsetX: number;
        _parentLayerOffsetY: number;
        _parentLayer: Kinetic.Layer;
        _group: Kinetic.Group;
        _gameBoard: GameBoard;

        constructor (config: IEntityConfiguration) {
            this._x = config.worldX;
            this._y = config.worldY;
        }

        setGameBoard(gameBoard: GameBoard) {
            this._gameBoard = gameBoard;
        }

        // Indicates whether this object can move locations. Moveable entites go on a different layer 
        // than non-moving entities. This improves performance.
        canMove() {
            return false;
        }

        getWorldX() {
            return this._group.getX();
        }

        getWorldY() {
            return this._group.getY();
        }

        // Gets the Kinetic.Group used for all rendering type activies. Calling this 
        // method sets the this._group property and returns that group.
        getKineticGroup() {
            this._group = new Kinetic.Group({
                x: this._x,
                y: this._y
            });
            return this._group;
        }

        setParentLayer(parentLayer: Kinetic.Layer, parentLayerOffsetX: number, parentLayerOffsetY: number) {
            this._parentLayer = parentLayer;
            this._parentLayerOffsetX = parentLayerOffsetX;
            this._parentLayerOffsetY = parentLayerOffsetY;
        }
        // Redraw the parent layer.
        draw() {
            if (!this._parentLayer)
                throw new Error("_parentLayer is null. Must call setParentLayer first.");
            this._parentLayer.draw();
        }
        // Move the entity to this location.        
        move(x: number, y: number, options: IEntity_MoveTo_Options) {
            if (this._group == undefined)
                throw new Error("moveTo() _group undefined. Did you forget to call 'super.getKineticGroup()' in the overloaded getKineticGroup() method?");

            if (options.pixelsPerSecond) {

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
        }

        addImage(options: IEntity_AddImage_Options): IEntity_AddImage_Result {
            if (!this._group)
                throw new Error("_group must be defined before calling addImage.");
            var self = this;

            var returnResult = <IEntity_AddImage_Result>{};

            returnResult.imageObj = new Image();

            var x = options.x
            if (x === undefined)
                x = (options.width / 2) * -1;
            var y = options.y
            if (y === undefined)
                y = (options.height / 2) * -1;

            returnResult.KineticImage = new Kinetic.Image({
                x: x,
                y: y,
                image: returnResult.imageObj,
                width: options.width,
                height: options.height
            });

            if (options.offset) {
                returnResult.KineticImage.setOffset(options.offset.x, options.offset.y);
            }

            returnResult.imageObj.onload = function () {
                if (options.group === undefined) {
                    self._group.add(returnResult.KineticImage);
                } else {
                    options.group.add(returnResult.KineticImage);
                }
                self.draw();
                if (options.onLoadPostDraw) {
                    options.onLoadPostDraw();
                }
            };
            returnResult.imageObj.src = options.url;

            return returnResult;
        }

        // Gets called periodically. It returns a value for when to call this function next.
        tick() {
            this._x = this._group.getX();
            this._y = this._group.getY();
        }

        findEntities(withinPixelRange: number): IEntity_FindEntities_Result[] {
            var entitiesWithinRange: IEntity_FindEntities_Result[] = [];
            var entitiesLen = this._gameBoard.entities.length;
            for (var i = 0; i < entitiesLen; i++) {
                var entity = this._gameBoard.entities[i];
                if (entity === this)
                    continue;

                var distance = Game.Utilities.distanceBetweenPoints(this.getWorldX(), this.getWorldY(), entity.getWorldX(), entity.getWorldY());

                var radiansToEntity = Utilities.radiansBetweenPoints(entity.getWorldX(), entity.getWorldY(), this.getWorldX(), this.getWorldY());

                if (distance < withinPixelRange) {
                    entitiesWithinRange.push({
                        distance: distance,
                        entity: entity,
                        radiansToEntity: radiansToEntity
                    });
                }
            }
            return entitiesWithinRange;
        }


        _shoot_lastShotFired: Date;

        shoot(options: IEntity_Shoot_Options) {
            var self = this;
            
            if (this._shoot_lastShotFired < new Date(Date.now() + (options.timeBetweenShots * 1000))) {
                return;
            }            
            
            this._shoot_lastShotFired = new Date(Date.now());
                    
            var rotation = Utilities.radiansBetweenPoints(this.getWorldX(), this.getWorldY(), options.targetX, options.targetY);

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
                        
            var randomOffsetX = Utilities.randomInteger(80, true);
            var randomOffsetY = Utilities.randomInteger(80, true);

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

            var distance = Utilities.distanceBetweenPoints(this.getWorldX(), this.getWorldY(), options.targetX, options.targetY);

            line.transitionTo({
                x: hitX,
                y: hitY,
                duration: distance / 250,
                callback: function () {
                    line.hide();
                    bulletHit.KineticImage.show();
                    bulletHit.KineticImage.transitionTo({
                        width: 32,
                        height: 32,
                        opacity: .9,
                        offset: { x: 16, y: 16 },
                        duration: 0.15,
                        callback: function () {
                            bulletGroup.remove();
                        }
                    });
                }
            });            
        }
    }

    export interface IEntity_Shoot_Options {
        targetX: number;
        targetY: number;
        timeBetweenShots?: number; // Max value is whatever the tick amount is.
    }

    export interface IEntityConfiguration {
        worldX: number;
        worldY: number;
    }

    export interface IEntity_MoveTo_Options {
        // Number of pixels to move the entity over the specified distance.
        pixelsPerSecond?: number;
    }

    export interface IEntity_AddImage_Options {
        x?: number;
        y?: number;
        width: number;
        height: number;
        url: string;
        offset?: Kinetic.Vector2d;
        onLoadPostDraw?: () =>void;
        group?: Kinetic.Group;
        scale?: Kinetic.Vector2d;
    }

    export interface IEntity_AddImage_Result {
        imageObj: HTMLImageElement;
        KineticImage: Kinetic.Image;
    }

    export interface IEntity_FindEntities_Result {
        entity: Entity;
        distance: number;
        radiansToEntity: number;
    }
}

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
    var e = new Game.Entity({ worldX: 0, worldY: 0 });
    var e2 = new Game.Entity({ worldX: 0, worldY: 500 });
    gb.addEntity(e);
    gb.addEntity(e2);
    var nearby100 = e.findEntities(100);
    QUnit.strictEqual(0, nearby100.length, "entities out of range");
    var nearby600 = e.findEntities(600);
    QUnit.strictEqual(1, nearby600.length, "one entity in range");
});

QUnit.test("getX and getY", function () {
    var gb = setupTestGameBoard();
    var e = new Game.Entity({ worldX: 250, worldY: 60 });
    gb.addEntity(e);

    QUnit.strictEqual(250, e.getWorldX(), "getWorldX");
    QUnit.strictEqual(60, e.getWorldY(), "getWorldY");
});

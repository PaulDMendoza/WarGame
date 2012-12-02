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

        setParentLayer(parentLayer: Kinetic.Layer, parentLayerOffsetX : number, parentLayerOffsetY: number) {
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
            if(x === undefined)
                x = (options.width / 2) * -1;
            var y = options.y 
            if(y === undefined) 
                y = (options.height / 2) * -1;

            returnResult.KineticImage = new Kinetic.Image({
                x: x,
                y: y,
                image: returnResult.imageObj,
                width: options.width,
                height: options.height
            });

            if (options.offset) {
                returnResult.KineticImage.setOffset(options.offset[0], options.offset[1]);
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
        offset?: number[];
        onLoadPostDraw?: () =>void;
        group?: Kinetic.Group;
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

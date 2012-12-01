/// <reference path="GameController.ts" />
/// <reference path="GameBoard.ts" />
/// <reference path="Entities/Turret.ts" />
/// <reference path="Entities/Sniper.ts" />
/// <reference path="../tsReferences.ts" />

module Game {
    
    export class Entity {

        _worldX: number;
        _worldY: number;       
        _parentLayer: Kinetic.Layer;
        _group: Kinetic.Group;
        _gameBoard: GameBoard;

        constructor (config : IEntityConfiguration) {
            
            this._worldX = config.worldX;
            this._worldY = config.worldY;

        }
        
        setGameBoard(gameBoard : GameBoard) {
            this._gameBoard = gameBoard;
        }

        // Indicates whether this object can move locations. Moveable entites go on a different layer 
        // than non-moving entities. This improves performance.
        canMove() {
            return false;
        }
        
        // Gets the Kinetic.Group used for all rendering type activies. Calling this 
        // method sets the this._group property and returns that group.
        getKineticGroup() {
            this._group = new Kinetic.Group({
                x: this._worldX,
                y: this._worldY
            });
            return this._group;
        }

        setParentLayer(parentLayer: Kinetic.Layer) {
            this._parentLayer = parentLayer;
        }
        // Redraw the parent layer.
        draw() {
            if(!this._parentLayer)
                throw new Error("_parentLayer is null. Must call setParentLayer first.");
            this._parentLayer.draw();
        }
        // Move the entity to this location.        
        move(x: number, y: number, options : IEntity_MoveTo_Options) {
            if(this._group == undefined)
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

        addImage(options : IEntity_AddImage_Options) : IEntity_AddImage_Result {
            if(!this._group) 
                throw new Error("_group must be defined before calling addImage.");
            var self = this;
            
            var returnResult = <IEntity_AddImage_Result>{};

            returnResult.imageObj = new Image();

            returnResult.KineticImage = new Kinetic.Image({
                    image: returnResult.imageObj,
                    width: options.width,
                    height: options.height                    
                });

                returnResult.imageObj.onload = function () {
                self._group.add(returnResult.KineticImage);
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
            this._worldX = this._group.getX();
            this._worldY = this._group.getY();
        }

        findEntities(withinPixelRange: number) : Entity[] {
            var entitiesWithinRange : Entity[] = [] ;
            var entitiesLen = this._gameBoard.entities.length;
            for (var i = 0; i < entitiesLen; i++) {
                var entity = this._gameBoard.entities[i];
                if(entity === this)
                    continue;

                var distance = Game.Utilities.distanceBetweenPoints(this._worldX, this._worldY, entity._worldX, entity._worldY);
                if(distance < withinPixelRange)
                    entitiesWithinRange.push(entity);
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
        width: number;
        height: number;
        url: string;
        onLoadPostDraw?: ()=>void;
    }

    export interface IEntity_AddImage_Result {
        imageObj: HTMLImageElement;
        KineticImage: Kinetic.Image;
    }
    
                    
}

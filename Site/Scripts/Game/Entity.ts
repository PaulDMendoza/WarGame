/// <reference path="../tsReferences.ts" />

module Game {
    
    

    export class Entity {

        _worldX: number;
        _worldY: number;       
        _parentLayer: Kinetic.Layer;
        _group: Kinetic.Group;
        

        constructor (config : IEntityConfiguration) {
            
            this._worldX = config.worldX;
            this._worldY = config.worldY;

        }

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
    }
    
    export interface IEntityConfiguration {
        worldX: number;
        worldY: number;        
    }

    export interface IEntity_MoveTo_Options {
        // Number of pixels to move the entity over the specified distance.
        pixelsPerSecond?: number;
    }
    
    export class Sniper extends Entity {               
        
        constructor (config : IEntityConfiguration) {
            super(config); 
        }

        canMove() {
            return true;
        }
        
        getKineticGroup() {
            var self = this;
            var group = super.getKineticGroup();
            
            var imageObj = new Image();
            imageObj.onload = function () {
                var image = new Kinetic.Image({
                    image: imageObj,
                    width: 48,
                    height: 48                    
                });

                image.on('click', function () {
                    self.move(self._group.getX() + 50, self._group.getY() + 50, {
                        pixelsPerSecond: 10
                    });
                });

                group.add(image);
                self.draw();
                console.log("Drawing soldier");
            };
            imageObj.src = "/Images/GameAssets/Soldiers/Sniper.png";
            
            return group;
        }                                       
    }        
}

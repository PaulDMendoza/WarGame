/// <reference path="../tsReferences.ts" />

module Game {
    export class Entity {

        _worldX: number;
        _worldY: number;       
        _parentLayer: Kinetic.Layer;

        constructor (config : IEntityConfiguration) {
            this._worldX = config.worldX;
            this._worldY = config.worldY;
        }

        canMove() {
            return false;
        }
        
        getKineticGroup() {
            var group = new Kinetic.Group();
            return group;
        }

        setParentLayer(parentLayer: Kinetic.Layer) {
            this._parentLayer = parentLayer;
        }

        draw() {
            if(!this._parentLayer)
                throw new Error("_parentLayer is null. Must call setParentLayer first.");
            this._parentLayer.draw();
        }
    }

    export interface IEntityConfiguration {
        worldX: number;
        worldY: number;        
    }

    export class Soldier extends Entity {               
        
        

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
                    height: 48,
                    x: self._worldX,
                    y: self._worldY
                });
                group.add(image);
                self.draw();
                console.log("Drawing soldier");
            };
            imageObj.src = "http://www.militaryimages.net/forums/images/smilies/desert_soldier.gif";

            return group;
        }
        
        moveToClick() {

        }
                                                
    }        
}

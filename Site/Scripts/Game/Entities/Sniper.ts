/// <reference path="../Entity.ts" />

module Game {
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

/// <reference path="../Entity.ts" />
/// <reference path="../../tsReferences.ts" />

module Game {
    export class Turret extends Entity {
        constructor (config : IEntityConfiguration) {
            super(config); 
        }

        getKineticGroup() {
            var self = this;
            var group = super.getKineticGroup();
            
            var machineGunNest = self.addImage({
                width: 128,
                height: 128,
                url:"/Images/GameAssets/MachineGunNest-1.png"
            });

            var machineGunner = self.addImage({
                width: 128,
                height: 128,
                url:"/Images/GameAssets/Soldiers/MachineGunner.png",
                onLoadPostDraw: function () {
                    setTimeout(function () {
                        machineGunner.KineticImage.moveToTop();
                    }, 100);
                }
            });
            
            return group;
        }
        
        tick() {
            var entitiesWithinRange = this.findEntities(400).length;
            if (entitiesWithinRange > 0) {
                console.log("Found " + entitiesWithinRange + " within range.");
            }

            super.tick();
        }

    }
}

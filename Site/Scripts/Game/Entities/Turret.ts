/// <reference path="../Entity.ts" />
/// <reference path="../../tsReferences.ts" />

module Game {
    export class Turret extends Entity {
        machineGunner: IEntity_AddImage_Result;
        machineGunNest: IEntity_AddImage_Result;

        constructor (config: IEntityConfiguration) {
            super(config);
        }

        getKineticGroup() {
            var self = this;
            var group = super.getKineticGroup();

            this.machineGunNest = self.addImage({
                width: 128,
                height: 128,
                url: "/Images/GameAssets/MachineGunNest-1.png",
                onLoadPostDraw: function () {
                    self.machineGunner = self.addImage({
                        x: 0,
                        y: 0,
                        width: 128,
                        height: 128,
                        offset: { x: 64, y: 64 },
                        url: "/Images/GameAssets/Soldiers/MachineGunner.png",
                        onLoadPostDraw: function () {
                        }
                    });
                }
            });

            return group;
        }

        tick() {
            var self = this;
            if (this.machineGunner) {
                var entitiesWithinRange = this.findEntities(400);
                if (entitiesWithinRange.length > 0) {
                    var nearestEntity = <IEntity_FindEntities_Result>Enumerable.From(entitiesWithinRange)
                         .OrderBy(function (ed: IEntity_FindEntities_Result) { return ed.distance; })
                         .First();

                    this.machineGunner.KineticImage.transitionTo({
                        rotation: nearestEntity.radiansToEntity,
                        duration: 0.25,
                    });
                    super.shoot({
                        targetX: nearestEntity.entity.getWorldX(), 
                        targetY: nearestEntity.entity.getWorldY()
                    });
                    if (this.machineGunner && this.machineGunner.KineticImage) {
                        var rotation = Utilities.radiansBetweenPoints(self.getWorldX(), self.getWorldY(), nearestEntity.entity.getWorldX(), nearestEntity.entity.getWorldY());
                        var anim = new Kinetic.Animation(function (frame) {
                            var angleDiff = rotation + (Utilities.randomInteger(25) / 100);
                            self.machineGunner.KineticImage.setRotation(angleDiff);
                        }, self._parentLayer);
                        anim.start();
                    }
                } else {

                }
            }

            super.tick();
        }




    }
}



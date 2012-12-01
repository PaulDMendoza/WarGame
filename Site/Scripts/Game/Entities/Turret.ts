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
                        offset: [65, 64],
                        url: "/Images/GameAssets/Soldiers/MachineGunner.png",
                        onLoadPostDraw: function () {                            
                        }
                    });
                }
            });

            return group;
        }

        tick() {
            
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
                    this.shoot(nearestEntity.entity.getWorldX(), nearestEntity.entity.getWorldY());
                }
            }

            super.tick();
        }

        shoot(x: number, y: number) {
            var self = this;
            var rotation = Utilities.radiansBetweenPoints(this.getWorldX(), this.getWorldY(), x, y);
            
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
            this._group.add(bulletGroup);
            this.draw();

            var distance = Utilities.distanceBetweenPoints(this.getWorldX(), this.getWorldY(), x, y);

            line.transitionTo({
                x: x - this._group.getX(),
                y: y - this._group.getY(),
                duration: distance / 200,                
                callback: function () {
                    bulletGroup.hide(); 
                }
            });
            

        }

    }
}

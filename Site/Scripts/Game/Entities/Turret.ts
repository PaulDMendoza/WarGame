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

            var randomHits = [-16, -40, -15, -20, -15, 4, 0, 8, 32, 16, 25, 4, 5, 6];

            var randomOffsetX = randomHits[Utilities.randomInteger(randomHits.length - 1)];
            var randomOffsetY = randomHits[Utilities.randomInteger(randomHits.length - 1)];
            
            var hitX = x - this._group.getX() + randomOffsetX;
            var hitY = y - this._group.getY() + randomOffsetY;


            var bulletHit = self.addImage({
                        url: "/Images/GameAssets/BulletImpact-1.png",
                        x: hitX,
                        y: hitY,
                        width: 32,
                        height: 32,                
                        offset: [16, 16],
                        group: bulletGroup                
                    });
            bulletHit.KineticImage.setScale(0);
            this._group.add(bulletGroup);
            this.draw();

            var distance = Utilities.distanceBetweenPoints(this.getWorldX(), this.getWorldY(), x, y);
                        
            line.transitionTo({
                x: hitX,
                y: hitY,
                duration: distance / 200,                
                callback: function () {
                    line.hide();
                    
                    bulletHit.KineticImage.transitionTo({
                        scale: [1, 1],                        
                        duration: 0.5,                        
                        callback: function () {
                            bulletGroup.hide();
                        }
                    });                                    
                }
            });
        }
    }
}



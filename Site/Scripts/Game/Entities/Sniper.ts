/// <reference path="../Entity.ts" />

module Game {
    export class Sniper extends Entity {
        _soldier: IEntity_AddImage_Result;

        constructor (config: IEntityConfiguration) {
            super(config);
        }

        canMove() {
            return true;
        }

        getKineticGroup() {
            var self = this;
            var group = super.getKineticGroup();

            this._soldier = this.addImage({
                url: "/Images/GameAssets/Soldiers/Sniper.png",
                width: 48,
                height: 48,
                onLoadPostDraw: function () {

                }
            });

             this._soldier.KineticImage.on('click touchend', function () {
                self.move(self.getWorldX() + 50, self.getWorldY() + 50, {
                    pixelsPerSecond: 20
                });
            });
                        
            return group;
        }

        tick() {
            if (this._soldier) {
                var entitiesWithinRange = this.findEntities(400);
                if (entitiesWithinRange.length > 0) {
                    var nearestEntity = <IEntity_FindEntities_Result>Enumerable.From(entitiesWithinRange)
                         .Where(function (ed : IEntity_FindEntities_Result) { return !(ed.entity instanceof Sniper); })
                         .OrderBy(function (ed: IEntity_FindEntities_Result) { return ed.distance; })
                         .FirstOrDefault(undefined);
                    if (nearestEntity) {
                        super.shoot({
                            targetX: nearestEntity.entity.getWorldX(),
                            targetY: nearestEntity.entity.getWorldY(),
                            timeBetweenShots: 1.5
                        });
                    }                    
                } else {

                }
            }
        }
    }
}

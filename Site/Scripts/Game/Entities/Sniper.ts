/// <reference path="../Entity.ts" />

module Game {
    export class Sniper extends Entity {

        constructor (config: IEntityConfiguration) {
            super(config);
        }

        canMove() {
            return true;
        }

        getKineticGroup() {
            var self = this;
            var group = super.getKineticGroup();

            var soldier = this.addImage({
                url: "/Images/GameAssets/Soldiers/Sniper.png",
                width: 48,
                height: 48,
                onLoadPostDraw: function () {

                }
            });

            soldier.KineticImage.on('click touchend', function () {
                self.move(self.getWorldX() + 50, self.getWorldY() + 50, {
                    pixelsPerSecond: 20
                });
            });
                        
            return group;
        }
    }
}

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

            soldier.KineticImage.on('click', function () {
                self.move(self._group.getX() + 50, self._group.getY() + 50, {
                    pixelsPerSecond: 10
                });
            });
                        
            return group;
        }
    }
}

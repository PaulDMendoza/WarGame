/// <reference path="Entity.ts" />
/// <reference path="../tsReferences.ts" />


module Game {

    // Class
    export class EntityStatusView {
                
        _healthPoints: number;
        _maxHealth: number;

        constructor (maxHealth: number) 
        { 
            this._healthPoints = maxHealth;
        }

        updateHealth() {
            
        }
        
    }

}

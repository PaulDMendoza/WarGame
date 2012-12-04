var Game;
(function (Game) {
    var Utilities = (function () {
        function Utilities() { }
        Utilities.distanceBetweenPoints = function distanceBetweenPoints(x1, y1, x2, y2) {
            var distanceX = Math.abs(x1 - x2);
            var distanceY = Math.abs(y1 - y2);
            var tangent = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
            return tangent;
        }
        Utilities.radiansBetweenPoints = function radiansBetweenPoints(xOrigin, yOrigin, xDestination, yDestination) {
            return Math.atan2(yOrigin - yDestination, xOrigin - xDestination);
        }
        Utilities.randomInteger = function randomInteger(maxValue, allowNegative) {
            return Math.floor((Math.random() * maxValue) + 1) * ((allowNegative && Math.random() > 0.5) ? -1 : 1);
        }
        return Utilities;
    })();
    Game.Utilities = Utilities;    
})(Game || (Game = {}));
QUnit.module("Utilities");
QUnit.test("distanceBetweenPoints", function () {
    QUnit.strictEqual(Game.Utilities.distanceBetweenPoints(0, 0, 5, 0), 5, "x distance");
    QUnit.strictEqual(Game.Utilities.distanceBetweenPoints(0, 0, 0, 5), 5, "y distance");
    QUnit.strictEqual(Math.round(Game.Utilities.distanceBetweenPoints(0, 0, 5, 5)), 7, "sqrt usage");
});
QUnit.test("radiansBetweenPoints", function () {
    QUnit.strictEqual(Math.round(Game.Utilities.radiansBetweenPoints(0, 0, 5, 0)), 3, "horizontal right");
    QUnit.strictEqual(Math.round(Game.Utilities.radiansBetweenPoints(0, 0, -5, -5)), 1, "horizontal right");
});
QUnit.test("randomInteger", function () {
    for(var i = 0; i < 10; i++) {
        var rd = Game.Utilities.randomInteger(5);
        if(rd < 0) {
            QUnit.ok(false, "Random value less than zero: " + rd);
        }
    }
    QUnit.ok(true, "All random values good.");
});

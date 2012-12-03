/// <reference path="../tsReferences.ts" />

module Game {
    export class Utilities {
        public static distanceBetweenPoints(x1: number, y1: number, x2: number, y2: number): number {
            var distanceX = Math.abs(x1 - x2);
            var distanceY = Math.abs(y1 - y2);
            var tangent = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
            return tangent;
        }

        public static radiansBetweenPoints(x1: number, y1: number, x2: number, y2: number): number {
            return Math.atan2(y2 - y1, x2 - x1);
        }

        public static randomInteger(maxValue: number): number {
            return Math.floor((Math.random() * maxValue) + 1);
        }
    }
}

QUnit.module("Utilities");
QUnit.test("distanceBetweenPoints", function () {
    QUnit.strictEqual(Game.Utilities.distanceBetweenPoints(0, 0, 5, 0), 5, "x distance");
    QUnit.strictEqual(Game.Utilities.distanceBetweenPoints(0, 0, 0, 5), 5, "y distance");
    QUnit.strictEqual(Math.round(Game.Utilities.distanceBetweenPoints(0, 0, 5, 5)), 7, "sqrt usage");
});

QUnit.test("radiansBetweenPoints", function () {
    QUnit.strictEqual(Game.Utilities.radiansBetweenPoints(0, 0, 5, 0), 0, "horizontal right");
    QUnit.strictEqual(Math.round(Game.Utilities.radiansBetweenPoints(0, 0, -5, -5)), -2, "horizontal right");
});

QUnit.test("randomInteger", function () {
    for (var i = 0; i < 10; i++) {
        var rd = Game.Utilities.randomInteger(5);
        if (rd < 0) {
            QUnit.ok(false, "Random value less than zero: " + rd);
        }
    }
    QUnit.ok(true, "All random values good.");
});


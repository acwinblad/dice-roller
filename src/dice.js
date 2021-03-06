"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Math = require("mathjs");
var Dice = /** @class */ (function () {
    function Dice(diceExpr) {
        this._diceExpr = diceExpr;
        this.evalExpress();
        this.operate();
        this.evalFunction();
    }
    Object.defineProperty(Dice.prototype, "diceSpec", {
        get: function () {
            return this._diceExpr;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Dice.prototype, "rolls", {
        get: function () {
            return this._rolls;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Dice.prototype, "dieSize", {
        get: function () {
            return this._dieSize;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Dice.prototype, "multiplier", {
        get: function () {
            return this._multiplier;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Dice.prototype, "modifier", {
        get: function () {
            return this._modifier;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Dice.prototype, "rollResult", {
        get: function () {
            return this._rollResults;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Dice.prototype, "finalResult", {
        get: function () {
            return this._finalResult;
        },
        enumerable: false,
        configurable: true
    });
    Dice.prototype.evalExpress = function () {
        var match = this._diceExpr.match(/(\d+)?d(\d+)/);
        this._rolls = (typeof match[1] == 'undefined') ? 1 : parseInt(match[1]);
        this._dieSize = parseInt(match[2]);
        this.rollDice();
    };
    Dice.prototype.rollDice = function () {
        var i = 0;
        this._rollResults = [];
        for (i = 0; i < this._rolls; i++) {
            this._rollResults[i] = Math.randomInt(0, this._dieSize) + 1;
        }
    };
    Dice.prototype.operate = function () {
        /*
         * operations
         * k = keep
         * r = reroll
         * e = explode
         */
        this.keep();
        this.reroll();
        this.explode();
    };
    Dice.prototype.keep = function () {
        var match = this._diceExpr.match(/(\d+)?d(\d+)(kh|kl)(\d+)?/);
        if (!match) {
            //      console.log("Does not use keep operation.");
        }
        else {
            var keepValue = (typeof match[4] == 'undefined') ? 1 : parseInt(match[4]);
            //      console.log(match);
            if (match[3] == 'kh') /*keep highest */ {
                console.log('keep highest ' + keepValue);
                console.log(this._rolls);
                var i = 0;
                for (i = 0; i < this._rolls - keepValue; i++) {
                    this._rollResults = removeSmallest(this._rollResults);
                }
            }
            else /* keep lowest */ {
                console.log('keep lowest ' + keepValue);
                var i = 0;
                for (i = 0; i < this._rolls - keepValue; i++) {
                    this._rollResults = removeLargest(this._rollResults);
                }
            }
        }
    };
    Dice.prototype.reroll = function () {
        var match = this._diceExpr.match(/(\d+)?d(\d+)(r)(\d+)?/);
        if (!match) {
            //      console.log("Does not use reroll operation.");
        }
        else {
            var rerollValue = (typeof match[4] == 'undefined') ? 1 : parseInt(match[4]);
            // write function that checks if there is a matching roll and replace it with a new roll
            if (this._rollResults.includes(rerollValue)) {
                this._rollResults = doReroll(this._dieSize, rerollValue, this._rollResults);
            }
        }
    };
    Dice.prototype.explode = function () {
        var match = this._diceExpr.match(/(\d+)?d(\d+)(e)/);
        if (!match) {
            //      console.log("Does not use explode operation.");
        }
        if (match != null) {
            if (this._rollResults.includes(this._dieSize)) {
                console.log("CAUTION: Dice Exploding");
                var idx = getAllIndexes(this._rollResults, this._dieSize);
                var i = 0;
                for (i = 0; i < idx.length; i++) {
                    this._rollResults.push(Math.randomInt(0, this._dieSize) + 1);
                    while (this._rollResults[this._rollResults.length - 1] == this._dieSize) {
                        this._rollResults.push(Math.randomInt(0, this._dieSize) + 1);
                    }
                }
            }
        }
    };
    Dice.prototype.evalFunction = function () {
        var match = this._diceExpr.match(/^(\d+)?d(\d+)(kh|kl|r|e)?(\d+)?([*\/])?(\d+)?([+-])?(\d+)?$/);
        if (!match) {
            throw "Invalid dice notation: " + this._diceExpr;
        }
        var multdivide = (typeof match[5] == 'undefined') ? '*' : match[5];
        this._multiplier = (typeof match[6] == 'undefined') ? 1 : parseInt(match[6]);
        var addminus = (typeof match[7] == 'undefined') ? '+' : match[7];
        this._modifier = (typeof match[8] == 'undefined') ? 0 : parseInt(match[8]);
        this._finalResult = this._rollResults.reduce(function (a, b) { return a + b; }, 0);
        this._finalResult = eval(this._finalResult + multdivide + this._multiplier);
        this._finalResult = eval(this._finalResult + addminus + this._modifier);
    };
    return Dice;
}());
function removeLargest(arr) {
    var largest = Math.max.apply(Math, arr);
    var idx = arr.indexOf(largest);
    return arr.filter(function (_, i) { return i !== idx; });
}
function removeSmallest(arr) {
    var smallest = Math.min.apply(Math, arr);
    var idx = arr.indexOf(smallest);
    return arr.filter(function (_, i) { return i !== idx; });
}
function doReroll(dieSize, check, arr) {
    console.log("old rolls: ");
    console.log(arr);
    console.log("rerolling...");
    console.log("new roll results: ");
    var idx = arr.indexOf(check);
    var newRoll = Math.randomInt(0, dieSize) + 1;
    arr[idx] = newRoll;
    return arr;
}
function getAllIndexes(arr, val) {
    var indexes = [], i = -1;
    while ((i = arr.indexOf(val, i + 1)) != -1) {
        indexes.push(i);
    }
    return indexes;
}
var diceRolled = new Dice('4d6kh3');
console.log(diceRolled.rollResult);
console.log(diceRolled.finalResult);
console.log("");

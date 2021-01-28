"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Math = require("mathjs");
var Dice = /** @class */ (function () {
    function Dice(diceExpr) {
        this._diceExpr = diceExpr;
        this.evalExpress();
        this.operate();
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
        console.log(this.rolls);
        this._dieSize = parseInt(match[2]);
        this.rollDice();
    };
    Dice.prototype.rollDice = function () {
        var i = 0;
        this._rollResults = [];
        for (i = 0; i < this._rolls; i++) {
            this._rollResults[i] = Math.randomInt(1, this._dieSize);
        }
    };
    Dice.prototype.operate = function () {
        /*
         * operations
         * k = keep
         * rr = reroll
         * ro = reroll once
         * e = explode
         * eo = explode once
         * mi = min
         * ma = max
         *
         */
        this.keep();
    };
    //  evalFunction(dieSpec:string) {
    //    var match = /^(\d+)?d(\d+)(kh|kl)?(\d+)?([*\/]\d+)?(\d+)?([+-]\d+)?$/.exec    (dieSpec);
    //    if(!match) {
    //      throw "Invalid dice notation: " + dieSpec;
    //    }
    //    this._rolls = (typeof match[1] == 'undefined') ? 1 : parseInt(match[1]);
    //    console.log(this._rolls);
    //    this._dieSize = parseInt(match[2]);
    //    this._modifier = (typeof match[3] == 'undefined') ? 1 : parseInt(match[3]);
    //    this._multiplier = (typeof match[4] == 'undefined') ? 0 : parseInt(match[4]);
    //
    //  }
    Dice.prototype.keep = function () {
        var match = this._diceExpr.match(/(\d+)?d(\d+)(kh|kl)(\d+)/);
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
var diceRolled = new Dice('3d20kh2');
console.log(diceRolled.rollResult);

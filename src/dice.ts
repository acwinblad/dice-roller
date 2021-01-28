import * as Math from 'mathjs';

class Dice {

  private _diceExpr: string;
  private _rolls: number;
  private _dieSize: number;
  private _multiplier: number;
  private _modifier: number;
  private _rollResults: number[];
  private _finalResult: number;

  public get diceSpec() {
    return this._diceExpr;
  }

  public get rolls() {
    return this._rolls;
  }

  public get dieSize() {
    return this._dieSize;
  }

  public get multiplier() {
    return this._multiplier;
  }

  public get modifier() {
    return this._modifier;
  }

  public get rollResult() {
    return this._rollResults;
  }

  public get finalResult() {
    return this._finalResult;
  }

  constructor(diceExpr: string) {
    this._diceExpr = diceExpr;

    this.evalExpress();
    this.operate();
  }

  evalExpress() {
    var match = this._diceExpr.match(/(\d+)?d(\d+)/);
    this._rolls = (typeof match[1] == 'undefined') ? 1 : parseInt(match[1]);
    console.log(this.rolls);
    this._dieSize = parseInt(match[2]);
    this.rollDice()
  }

  rollDice() {
    var i:number = 0;
    this._rollResults = [];
    for( i=0; i<this._rolls; i++) {
      this._rollResults[i] = Math.randomInt(1,this._dieSize);
    }
  }
  operate() {
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
    this.keep()

  }

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

  keep() {
    var match = this._diceExpr.match(/(\d+)?d(\d+)(kh|kl)(\d+)/);
    if(!match){
//      console.log("Does not use keep operation.");
    }
    else{
      var keepValue = (typeof match[4] == 'undefined') ? 1 : parseInt(match[4]);
//      console.log(match);
      if(match[3] == 'kh') /*keep highest */ {
        console.log('keep highest ' + keepValue);
        console.log(this._rolls);
        var i:number = 0;
        for( i=0; i<this._rolls-keepValue; i++) {
          this._rollResults = removeSmallest(this._rollResults);

        }

      }
      else /* keep lowest */ {
        console.log('keep lowest ' + keepValue);
        var i:number = 0;
        for( i=0; i< this._rolls-keepValue; i++) {
          this._rollResults = removeLargest(this._rollResults);
        }

      }
    }
  }

}

function removeLargest(arr:number[]) {
  const largest: number = Math.max(...arr);
  const idx: number = arr.indexOf(largest);
  return arr.filter((_,i) => i !==idx);
}


function removeSmallest(arr:number[]) {
  const smallest: number = Math.min(...arr);
  const idx: number = arr.indexOf(smallest);
  return arr.filter((_,i) => i !==idx);
}

var diceRolled = new Dice('3d20kh2');
console.log(diceRolled.rollResult);

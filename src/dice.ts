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
    this.evalFunction();
  }

  evalExpress() {
    var match = this._diceExpr.match(/(\d+)?d(\d+)/);
    this._rolls = (typeof match[1] == 'undefined') ? 1 : parseInt(match[1]);
    this._dieSize = parseInt(match[2]);
    this.rollDice()
  }

  rollDice() {
    var i:number = 0;
    this._rollResults = [];
    for( i=0; i<this._rolls; i++) {
      this._rollResults[i] = Math.randomInt(0,this._dieSize)+1;
    }
  }
  operate() {
    /*
     * operations
     * k = keep
     * r = reroll
     * e = explode
     */
    this.keep()
    this.reroll()
    this.explode()
  }


  keep() {
    var match = this._diceExpr.match(/(\d+)?d(\d+)(kh|kl)(\d+)?/);
    if(!match){
//      console.log("Does not use keep operation.");
    }
    else{
      var keepValue:number = (typeof match[4] == 'undefined') ? 1 : parseInt(match[4]);
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

  reroll() {
    var match = this._diceExpr.match(/(\d+)?d(\d+)(r)(\d+)?/);
    if(!match){
//      console.log("Does not use reroll operation.");
    }
    else{
      var rerollValue:number = (typeof match[4] == 'undefined') ? 1 : parseInt(match[4]);
      // write function that checks if there is a matching roll and replace it with a new roll
      if(this._rollResults.includes(rerollValue)) {
        this._rollResults = doReroll(this._dieSize, rerollValue, this._rollResults);
      }
    }
  }

  explode() {
    var match = this._diceExpr.match(/(\d+)?d(\d+)(e)/);
    if(!match){
//      console.log("Does not use explode operation.");
    }
    if(match != null) {
      if(this._rollResults.includes(this._dieSize)) {
        console.log("CAUTION: Dice Exploding")
        var idx:number[] = getAllIndexes(this._rollResults, this._dieSize);
        var i:number = 0;
        for( i=0; i< idx.length; i++) {
          this._rollResults.push( Math.randomInt(0,this._dieSize)+1 );
          while(this._rollResults[this._rollResults.length-1] == this._dieSize) {
            this._rollResults.push( Math.randomInt(0,this._dieSize)+1 );
          }
        }
      }
    }
  }

  evalFunction() {
    var match = this._diceExpr.match(/^(\d+)?d(\d+)(kh|kl|r|e)?(\d+)?([*\/])?(\d+)?([+-])?(\d+)?$/)
    if(!match) {
      throw "Invalid dice notation: " + this._diceExpr;
    }
    var multdivide = (typeof match[5] == 'undefined') ? '*' : match[5];
    this._multiplier = (typeof match[6] == 'undefined') ? 1 : parseInt(match[6]);
    var addminus = (typeof match[7] == 'undefined') ? '+' : match[7];
    this._modifier = (typeof match[8] == 'undefined') ? 0 : parseInt(match[8]);
    this._finalResult = this._rollResults.reduce((a,b) => a+b, 0);
    this._finalResult = eval(this._finalResult + multdivide + this._multiplier);
    this._finalResult = eval(this._finalResult + addminus + this._modifier);
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

function doReroll(dieSize:number, check:number, arr:number[]) {
  console.log("old rolls: ");
  console.log(arr);
  console.log("rerolling...");
  console.log("new roll results: ");
  const idx:number = arr.indexOf(check);
  var newRoll:number = Math.randomInt(0, dieSize)+1;
  arr[idx] = newRoll;
  return arr;
}

function getAllIndexes(arr, val) {
    var indexes = [], i = -1;
    while ((i = arr.indexOf(val, i+1)) != -1){
        indexes.push(i);
    }
    return indexes;
}




var diceRolled = new Dice('4d6kh3');
console.log(diceRolled.rollResult);
console.log(diceRolled.finalResult);
console.log("");


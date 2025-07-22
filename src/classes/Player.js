import Gameboard from "./Gameboard.js";
import shipTypes from "../helpers/shipTypes.js";

class Player{
  constructor(name, intelligence){
    this.name = name;
    this.gameboard = new Gameboard();
    this.nextTargetCells = [];
    this.opponent = null;
    this.intelligence = intelligence;
  }

  getName(){
    return this.name;
  }
  setName(name){
    this.name = name;
  }
  getGameboard(){
    return this.gameboard;
  }
  getOpponent(){
    return this.opponent;
  }
  setOpponent(opponent){
    this.opponent = opponent;
  }
  getIntelligence(){
    return this.intelligence;
  }
  attack(xCoord = null, yCoord = null){
    let x = xCoord;
    let y = yCoord;
    if(this.gameboard.areAllShipsSunk() || this.opponent.gameboard.areAllShipsSunk()){
      return;
    }
    if(this.intelligence === "computer"){
      if(!xCoord && !yCoord){
        [x,y] = this.computerChooseCell()

      }
      //can be string or obj
      const attackResult = this.opponent.gameboard.takeHit(x,y);
      this.updateNextTargetCells(x,y,attackResult);
      return attackResult;
    }
    
    //can be string or obj
    const attackResult = this.opponent.gameboard.takeHit(x,y);
    return attackResult;
  }

  //computer functions
  addNextTargetCell(x,y){
    this.nextTargetCells.push([x,y]);
  }
  getNextTargetCell(){
    return this.nextTargetCells.shift();
  }
  clearNextTargetCells(){
    this.nextTargetCells = [];
  }

  computerChooseCell(xCoord = null, yCoord = null){
    let x;
    let y;
    
    if(xCoord && yCoord){
      x = xCoord;
      y = yCoord;
    } else if(this.nextTargetCells.length > 0){
      [x,y] = this.getNextTargetCell();
    } else {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
      while(this.opponent.gameboard.getCellBeenHit(x,y) === true){
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
      }
    }

    return [x,y];
  }

  updateNextTargetCells(x,y,attackResultObj){
    if(attackResultObj === "miss") return;
    if(attackResultObj.attackResult === "sunk"){
      this.clearNextTargetCells();
      return;
    }
    if(attackResultObj.attackResult === "hit"){
      if(x < 9 && this.opponent.gameboard.getOpponentView()[y][x+1].ship === null)
        this.addNextTargetCell(x+1, y);
      if(x > 0 && this.opponent.gameboard.getOpponentView()[y][x-1].ship === null)
        this.addNextTargetCell(x-1, y);
      if(y < 9 && this.opponent.gameboard.getOpponentView()[y+1][x].ship === null)
        this.addNextTargetCell(x, y+1);
      if(y > 0 && this.opponent.gameboard.getOpponentView()[y-1][x].ship === null)
        this.addNextTargetCell(x, y-1);
    }
  }

  computerPlaceShips(){
    let counter = 0;
    while(counter < this.gameboard.shipsYetToBePlaced.length){
      const shipName = this.gameboard.shipsYetToBePlaced[counter];

      const shipTemplate = shipTypes.find(ship => ship.name === shipName);
      const [x,y,axis] = this.getRandomSuitableLocation(shipTemplate.size);
      console.log("params: ",x,y,axis);

      this.gameboard.placeShip(shipName,[x,y],axis);
    }
  }

  getRandomSuitableLocation(shipSize){

    const axis = Math.random() > 0.5 ? "x" : "y";
    const positions = [];

    if(axis === "x"){
      for(let j = 0; j <= 9; j++){
        for(let i = 0; i <= 10 - shipSize; i++){
          if(this.gameboard.isGoodPosForPlacement(i,j,shipSize,axis)){
            positions.push([i,j]);
          }
        }
      }
    } else {
      for(let i = 0; i <= 9; i++){
        for(let j = 0; j <= 10 - shipSize; j++){
          if(this.gameboard.isGoodPosForPlacement(i,j,shipSize,axis)){
            positions.push([i,j]);
          }
        }
      }
    }
    const randIndex = Math.floor(Math.random() * positions.length);
    return [...positions[randIndex], axis];
  }
}

// const user = new Player("marcel", "human");
// const bot = new Player("botterino", "computer");

// user.setOpponent(bot);
// bot.setOpponent(user);

// user.gameboard.placeShip("frigate", [1,2]);
// user.gameboard.changeAxis(); //to y
// user.gameboard.placeShip("carrier", [5,0]);
// user.gameboard.placeShip("submarine", [2,5]);
// user.gameboard.changeAxis() //to x
// user.gameboard.placeShip("battleship", [5,7]);
// user.gameboard.placeShip("scout", [1,9]);
// // user.gameboard.printBoard();

// bot.computerPlaceShips();

// bot.attack(1,2);
// console.log(bot.nextTargetCells);
// bot.attack();
// console.log(bot.nextTargetCells);
// bot.attack();
// console.log(bot.nextTargetCells);
// bot.attack();
// console.log(bot.nextTargetCells);
// bot.attack();
// bot.attack();
// bot.attack();
// bot.attack();
// bot.attack();
// console.log(bot.nextTargetCells);

// // user.gameboard.printBoard();

// // bot.gameboard.printBoard();

export default Player;
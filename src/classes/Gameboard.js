import Ship from "./Ship.js";
import shipTypes from "../helpers/shipTypes.js";

class Gameboard{
  constructor(){
    this.board = new Array(10).fill(0).map(() => new Array(10).fill(0).map(() => ({ship: null, beenHit: false})));
    this.axis = "x";
    this.fleet = [];
    this.shipsYetToBePlaced = ["carrier","battleship","frigate","submarine","scout"];
    this.activeShipToBePlaced = "";
  }

  printBoard(){
    this.board.forEach(row => {
      console.log(row)
    });
  }

  getBoard(){
    return this.board;
  }

  getShip(name){
    return this.fleet.find(ship => ship.name === name);
  }

  getFleet(){
    return this.fleet;
  }

  getCellBeenHit(x,y){
    return this.board[y][x].beenHit;
  }

  getActiveShipToBePlaced(){
    return this.activeShipToBePlaced;
  }
  setActiveShipToBePlaced(shipName){
    const shipIndex = this.shipsYetToBePlaced.findIndex(item => item === shipName);
    if(shipIndex < 0) return;
    this.activeShipToBePlaced = shipName;
  }
  changeAxis(){
    this.axis = this.axis === "x" ? "y" : "x";
  }

  createShip(shipName){
    const shipIndex = this.shipsYetToBePlaced.findIndex(item => item === shipName);
    if(shipIndex < 0) return;

    const ship = new Ship(shipName);
    //de mai gandit aici. poate vreau sa fac this.shipsYetToBePlaced un array de objecte cu nume si count pt o flota mai flexibila?
    this.shipsYetToBePlaced.splice(shipIndex,1);
    this.fleet.push(ship);
    this.activeShipToBePlaced = "";

    return ship;
  }

  isGoodPosForPlacement(x,y,shipSize, axis = this.axis){

    if(x < 0 || x > 9 || y < 0 || y > 9){
      return false;
    }
    if(axis === "x" && x + shipSize - 1 > 9){
      return false;
    }
    if(axis === "y" && y + shipSize - 1 > 9){
      return false;
    }

    if(axis === "x"){
      for(let i = x; i < x + shipSize; i++ ){
        if(this.board[y][i].ship !== null){
          return false;
        }
      }
    } else if(axis === "y"){
      for(let i = y; i < y + shipSize; i++ ){
        if(this.board[i][x].ship !== null){
          return false;
        }
      }
    }
    return true;
  }

  placeShip(shipName, pos, axis = this.axis){
    const [x, y] = pos;
    const shipSize = shipTypes.find(item => item.name === shipName).size;

    if(!this.isGoodPosForPlacement(x,y,shipSize,axis)) return;
  
    const ship = this.createShip(shipName);
    if(!ship) return;

    if(axis === "x"){
      for(let i = x; i < x + shipSize; i++ ){
        this.board[y][i].ship = shipName;
      }
    } else if(axis === "y"){
      for(let i = y; i < y + shipSize; i++ ){
        this.board[i][x].ship = shipName;
      }
    }
    return 1;
  }

  handleHit(x,y){
    if(this.board[y][x].ship === null)
      return "miss";

    const attackedShip = this.getShip(this.board[y][x].ship);
    const attackResult = attackedShip.hit();
    return {name: attackedShip.getName(), attackResult};
  }

  takeHit(x,y){
    this.board[y][x].beenHit = true;

    return this.handleHit(x,y);
  }

  areAllShipsSunk(){
    return this.fleet.every(ship => ship.getIsSunk());
  }

  getOpponentView(){
    const board = this.board.map(row => {
      return row.map(cell => {
        const modifiedCell = {ship: null, beenHit: false};
        if(cell.ship !== null && cell.beenHit){
          modifiedCell.ship = "hit";
          modifiedCell.beenHit = true;
        } else if(cell.ship === null && cell.beenHit){
          modifiedCell.ship = "miss";
          modifiedCell.beenHit = true;
        } else {
          modifiedCell.ship = null;
          modifiedCell.beenHit = false;
        }
        return modifiedCell;
      });
    });
    return board;
  }
}

export default Gameboard;
import shipTypes from "../helpers/shipTypes.js";

class Ship{
  constructor(name){
    const shipTemplate = shipTypes.find(obj => obj.name === name);

    this.name = shipTemplate.name;
    this.size = shipTemplate.size;
    this.hits = 0;
    this.isSunk = false;
  }

  getName(){
    return this.name;
  }

  getIsSunk(){
    return this.isSunk;
  }

  hit(){
    if(!this.isSunk)
      this.hits += 1;
    this.checkIfSunk();
    if(this.getIsSunk())
      return "sunk";
    else
      return "hit";
  }
  checkIfSunk(){
    this.isSunk = this.hits >= this.size ? true : false;
  }
}

export default Ship;
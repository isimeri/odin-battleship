import Player from "./Player.js";

class Game{
  constructor(){
    this.player1 = null;
    this.player2 = null;
    this.winner = null;
    this.turn = "player1";
    this.battleReady = false;
    this.over = false;
  }

  init(p1Name,p2Name){
    this.player1 = new Player(p1Name, "human");
    this.player2 = new Player(p2Name, "computer");
    this.player1.setOpponent(this.player2);
    this.player2.setOpponent(this.player1);
  }

  getPlayer1(){
    return this.player1;
  }

  getPlayer2(){
    return this.player2;
  }

  getTurn(){
    return this.turn;
  }

  getWinner(){
    return this.winner;
  }

  changeTurn(){
    this.turn = this.turn === "player1" ? "player2" : "player1";
  }

  setBattleReady(){
    //practic inseamna ca toate navele au fost plasate si batalia poate sa inceapa
    this.battleReady = true;
  }

  getBattleReady(){
    return this.battleReady;
  }

  isOver(){
    return this.over;
  }

  checkForWin(){
    if(this.player1.gameboard.areAllShipsSunk()){
      this.over = true;
      this.winner = this.player2;
    }
      
    if(this.player2.gameboard.areAllShipsSunk()){
      this.over = true;
      this.winner = this.player1;
    }
  }
}

export default Game;
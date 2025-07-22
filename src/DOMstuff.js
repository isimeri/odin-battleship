import Game from "./classes/Game.js";
import shipTypes from "./helpers/shipTypes.js";

const shipPlaceContainer = document.querySelector(".ship-place-container")
const shipBtnArr = document.querySelectorAll(".ship-place-btn");
const playerGameboard = document.querySelector(".player1-gameboard > .gameboard");
const computerGameboard = document.querySelector(".player2-gameboard > .gameboard");
const axisBtn = document.querySelector(".change-axis-btn");
const startBattleBtn = document.querySelector(".start-battle-btn");
const buttonsContainer = document.querySelector(".buttons-container");
const gameContainer = document.querySelector(".game-container");
// const startGameBtn = document.querySelector(".start-game-btn");
const startGameForm = document.querySelector(".start-game-form");
const playerNameInput = document.getElementById("player-name-input");
const attackResultMsgElem = document.querySelector(".attack-result-msg");
const restartGameBtn = document.querySelector(".restart-btn");

let magame, user, bot;


//==================FUNCTIONS====================

function gameInit(){
  const botNameArr = ["Your strongest enemy", "Commander Salmon", "Admiral Chickennugget", "Mr. Escobar", "Lieutenant Ocean Man", "Admiral Mineralwasser", "Captain Anchorface", "Captain Sweetums", "Mildred the Mermaid"];
  const botName = botNameArr[Math.floor(Math.random() * botNameArr.length)];
  const userName = playerNameInput.value || "user";
  magame = new Game();
  magame.init(userName, botName);
  user = magame.getPlayer1();
  bot = magame.getPlayer2();
}

function DOMReset(){
  restartGameBtn.classList.add("hidden");
  computerGameboard.closest(".player2-gameboard").classList.add("hidden");
  gameContainer.classList.add("hidden");
  startGameForm.classList.remove("hidden");
  shipPlaceContainer.classList.remove("hidden");
  buttonsContainer.classList.remove("hidden");
  shipBtnArr.forEach(btn => {
    btn.disabled = false;
  });
}

function DOMInit(){
  document.querySelector(".player1-gameboard > h2").textContent = user.getName();
  document.querySelector(".player2-gameboard > h2").textContent = bot.getName();

  startGameForm.classList.add("hidden");
  drawBoard(user.gameboard.getBoard(), playerGameboard);
  attackResultMsgElem.textContent = `Place your ships, ${user.getName()}.`;
  gameContainer.classList.remove("hidden");
}

function drawBoard(gameboard, gameboardDiv){
  let html = ``;
  gameboard.forEach((row, rowIdx) => {
    row.forEach((cell, colIdx) => {
      let cellClass;
      if(cell.ship === "hit"){
        cellClass = "hit";
      } else if(cell.ship === "miss"){
        cellClass = "miss";
      } else if(!cell.beenHit && cell.ship !== null){
        cellClass = "ship"
      } else if(cell.beenHit && cell.ship !== null){
        cellClass = "ship hit";
      } else if(cell.beenHit){
        cellClass = "miss";
      } else {
        cellClass = "empty"
      }

      html += `<div class="cell ${cellClass}" data-x="${colIdx}" data-y="${rowIdx}"></div>`
    });
  });
  gameboardDiv.innerHTML = html;
}

function botGameRound(game, p1GameboardElem){
  if(!game.isOver()){
    if(game.getTurn() === "player2"){
      const result = game.getPlayer2().attack();
      displayAttackResult(game.getPlayer2(),result);
      drawBoard(game.getPlayer1().gameboard.getBoard(), p1GameboardElem);
      game.checkForWin();
      if(!game.isOver()){
        game.changeTurn();
      } else {
        gameOver();
      }
    }
  }
}

function displayAttackResult(player,result){
  const botName = player.getOpponent().getName();
  const missArrPlayer = ["You gloriously missed.", "You missed impressively.", "You missed beautifully.", "You missed with the full power of the ancestors.", "You missed a little bit.", "You missed with every fiber of your being."]
  const hitArrPlayer = [`You hit ${botName}'s ship with all your strength.`,`You slapped the sh...soul out of ${botName}'s ship.`, `What a glorious day, you hit ${botName}'s ship.`, `Very nice! ${botName}'s ship felt that hit.`, `You hit ${botName}'s ship. That's a lot of damage!`]
  const sunkArrPlayer = [`Who lives in a pineapple under the sea? ${botName}'s <b>${result.name}</b>`, `${botName}'s <b>${result.name}</b> gloriously sank.`, `${botName}'s <b>${result.name}</b> went to feed the fish.`, `${botName}'s <b>${result.name}</b> permanently relocated to the bottom of the sea.`, `${botName}'s <b>${result.name}</b> disappeared all of a sudden.`]
  let msg;
  if(player.getIntelligence() === "human"){
    if(result === "miss"){
      msg = missArrPlayer[Math.floor(Math.random() * missArrPlayer.length)];
    } else if(typeof result === "object" && result.attackResult === "sunk"){
      // msg = `You sunk ${player.getOpponent().getName()}'s ${result.name}`;
      msg = sunkArrPlayer[Math.floor(Math.random() * sunkArrPlayer.length)];
    } else if(typeof result === "object" && result.attackResult === "hit"){
      // msg = `You hit ${player.getOpponent().getName()}'s ship`;
      msg = hitArrPlayer[Math.floor(Math.random() * hitArrPlayer.length)];
    }
  } else {
    if(result === "miss"){
      msg = `${player.getName()} missed with all its might`;
    } else if(typeof result === "object"){
      msg = `${player.getName()} ${result.attackResult} your ${result.name}`;
    }
  }
  attackResultMsgElem.innerHTML = msg;
}

function gameOver(){
  setTimeout(() => {
    attackResultMsgElem.textContent = `The winner is ${magame.getWinner().getName()}!`;
    restartGameBtn.classList.remove("invisible");
  }, 1500);
}



//==================EVENT LISTENERS================

restartGameBtn.addEventListener("click", e => {
  DOMReset();
});

startGameForm.addEventListener("submit", e => {
  e.preventDefault();
  gameInit()
  DOMInit();
});


startBattleBtn.addEventListener("click", e => {
  if(user.gameboard.getFleet().length < 5) return;
  bot.computerPlaceShips();
  magame.setBattleReady();
  shipPlaceContainer.classList.add("hidden");
  buttonsContainer.classList.add("hidden");
  drawBoard(user.gameboard.getOpponentView(), computerGameboard);
  computerGameboard.closest(".player2-gameboard").classList.remove("hidden");
  attackResultMsgElem.textContent = `Very nice! Now, slap the enemy, Admiral ${user.getName()}!`;
});

axisBtn.addEventListener("click", e => {
  user.gameboard.changeAxis();
  axisBtn.textContent = `Axis: ${user.gameboard.axis}`;
});

shipBtnArr.forEach(btn => {
  btn.addEventListener("click", e => {
    const shipName = e.target.dataset.shipname;
    user.gameboard.setActiveShipToBePlaced(shipName);
  });
});

computerGameboard.addEventListener("click", e => {
  const x = parseInt(e.target.dataset.x);
  const y = parseInt(e.target.dataset.y);

  if(bot.gameboard.getCellBeenHit(x,y)) return;
  
  if(!magame.isOver() && magame.getBattleReady() && magame.getTurn() === "player1"){
    //attacking goes here
    const result = user.attack(x,y);
    displayAttackResult(user,result,attackResultMsgElem);
    drawBoard(bot.gameboard.getOpponentView(), computerGameboard);
    magame.checkForWin()
    if(!magame.isOver()){
      magame.changeTurn();
      setTimeout(() => {
        botGameRound(magame, playerGameboard);
      }, 1500);
    } else {
      gameOver();
    }
  }
});

playerGameboard.addEventListener("click", e => {
  const x = parseInt(e.target.dataset.x);
  const y = parseInt(e.target.dataset.y);
  const shipName = user.gameboard.getActiveShipToBePlaced();
  if(shipName !== "") {
    //ship placing goes here
    const placedSuccessfully = user.gameboard.placeShip(shipName, [x,y]);
    drawBoard(user.gameboard.getBoard(), playerGameboard);
    if(placedSuccessfully){
      document.querySelector(`.ship-place-btn[data-shipname="${shipName}"]`).disabled = true;
    }
  }
});

playerGameboard.addEventListener("mousemove", e => {
  const x = parseInt(e.target.dataset.x);
  const y = parseInt(e.target.dataset.y);
  const shipName = user.gameboard.getActiveShipToBePlaced();

  if(shipName === "") return;

  const shipSize = shipTypes.find(shipObj => shipObj.name === shipName).size;
  const axis = user.gameboard.axis;
  const cellArr = playerGameboard.querySelectorAll(".cell");


  cellArr.forEach(cell => {
      cell.classList.remove("hover");
    });
  if(user.gameboard.isGoodPosForPlacement(x,y,shipSize,axis)){
    playerGameboard.classList.remove("not-allowed");

    for(let i = 0; i < shipSize; i++){
      if(axis === "x"){
        document.querySelector(`.cell[data-x="${x+i}"][data-y="${y}"]`).classList.add("hover");
      } else if(axis === "y"){
        document.querySelector(`.cell[data-y="${y+i}"][data-x="${x}"]`).classList.add("hover");
      }
    }
  } else {
    playerGameboard.classList.add("not-allowed");
  }
});

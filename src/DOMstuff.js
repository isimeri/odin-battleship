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
  const playerName = player.getName();
  const opponentName = player.getOpponent().getName();
  const missArrUser = ["You gloriously missed.", "You missed impressively.", "You missed beautifully.", "You missed with the full power of the ancestors.", "You missed a little bit.", "You missed with every fiber of your being.", `You missed haha.`, `You missed by this much.`]
  const hitArrUser = [`You hit ${opponentName}'s ship with all your strength.`,`You slapped the sh...soul out of ${opponentName}'s ship.`, `What a glorious day, you hit ${opponentName}'s ship.`, `Very nice! ${opponentName}'s ship felt that hit.`, `You hit ${opponentName}'s ship. That's a lot of damage!`]
  const sunkArrUser = [`Who lives in a pineapple under the sea? ${opponentName}'s <b>${result.name}</b>`, `${opponentName}'s <b>${result.name}</b> gloriously sank.`, `${opponentName}'s <b>${result.name}</b> went to feed the fish.`, `${opponentName}'s <b>${result.name}</b> permanently relocated to the bottom of the sea.`, `${opponentName}'s <b>${result.name}</b> disappeared all of a sudden.`, `${opponentName}'s <b>${result.name}</b> go "blub blub".`]
  const missArrBot = [`${playerName} missed with all its might.`, `${playerName} missed with the power of a thousand suns.`, `${playerName} gloriously missed.`, `${playerName} missed impressively.`, `${playerName} missed a little bit.`, `${playerName} missed haha.`];
  const hitArrBot = [`${playerName} hit your <b>${result.name}</b>. That's a lot of damage!`, `${playerName} hit your <b>${result.name}</b>.`, `You had a bad day. ${playerName} hit your <b>${result.name}</b>.`, `${playerName} damaged your <b>${result.name}</b>. This is so sad.`, `O no, ${playerName} hit your <b>${result.name}</b>.`];
  const sunkArrBot = [`${playerName} sent your <b>${result.name}</b> to Bikini Bottom.`, `Your <b>${result.name}</b> copied the Titanic.`, `${playerName} sent your <b>${result.name}</b> to Davy Jones' locker.`, `${playerName} turned your <b>${result.name}</b> into a residential compound for fish.`, `Your <b>${result.name}</b> got yeeted and deleted.`, `$Your <b>${result.name}</b> go "blub blub".`, `$Your <b>${result.name}</b> disappeared. Where did it go?`]
  let msg;
  if(player.getIntelligence() === "human"){
    if(result === "miss"){
      msg = missArrUser[Math.floor(Math.random() * missArrUser.length)];
    } else if(typeof result === "object" && result.attackResult === "sunk"){
      msg = sunkArrUser[Math.floor(Math.random() * sunkArrUser.length)];
    } else if(typeof result === "object" && result.attackResult === "hit"){
      msg = hitArrUser[Math.floor(Math.random() * hitArrUser.length)];
    }
  } else {
    if(result === "miss"){
      msg = missArrBot[Math.floor(Math.random() * missArrBot.length)];
    } else if(typeof result === "object" && result.attackResult === "sunk"){
      msg = sunkArrBot[Math.floor(Math.random() * sunkArrBot.length)];
    } else if(typeof result === "object" && result.attackResult === "hit"){
      msg = hitArrBot[Math.floor(Math.random() * hitArrBot.length)];
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
    displayAttackResult(user,result);
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

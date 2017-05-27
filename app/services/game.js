
const POINTS_FOR_WIN = 3;
const POINTS_FOR_BYE = 3;
const POINTS_FOR_DRAW = 1;

gameFactory.$inject = ['playersFactory','roundRobinFactory','swissChessFactory'];

angular.module('compRunner').factory("gameFactory", gameFactory);

function gameFactory(players, roundRobin, swissChess){

  const gameFactory = {};
  gameFactory.rounds = {};
  
  // returns all properties to their empty defaults
  gameFactory.init = function init(){ 
    gameFactory.pairingName = "swiss";
    gameFactory.pairer = null;
    gameFactory.activeTab = "";
    gameFactory.isInitialised = false;
    gameFactory.numPlayers = null;
    gameFactory.numRounds = null;
    gameFactory.title = null;
    players.resetPlayers();
    gameFactory.currentRoundNumber = "0";
    gameFactory.rounds = {};
    gameFactory.finalOrder = [];
  }

  //initialises the game and the players, and sets the tab to the players screen
  gameFactory.getStarted = function getStarted(){
    gameFactory.isInitialised = true;
    players.initPlayers(gameFactory.numPlayers);
    gameFactory.activeTab = "players";      
  };

  // sets up the initial player order and the first round
  gameFactory.setupFirstRound = function setupFirstRound() {
    if(gameFactory.pairingName === "swiss"){
      gameFactory.pairer = swissChess;
    }else{
      gameFactory.pairer = roundRobin;
    }
    gameFactory.pairer.init(players.getAllPlayers());
    gameFactory.setupRound("1");
  }
  
  // sets up the games in a round
  // called when moving onto a new round
  gameFactory.setupRound = function setupRound(newRoundNumber){
    gameFactory.currentRoundNumber = newRoundNumber;
    gameFactory.rounds[newRoundNumber] = gameFactory.pairer.getNextRound(newRoundNumber);
    gameFactory.activeTab = newRoundNumber;
  }
      
  // completes a round
  // called when finishing that round
  gameFactory.completeRound = function completeRound() {
    const round = gameFactory.rounds[gameFactory.currentRoundNumber];

    for(let gameId in round.games){
      const game = round.games[gameId];
      const player1 =  players.getPlayerById(game.player1);
      const player2 =  players.getPlayerById(game.player2);
      switch (game.result) {
        case "Player 1 win":
        player1.score += POINTS_FOR_WIN;
        break;
        case "Player 2 win":
        player2.score += POINTS_FOR_WIN;
        break;
        case "Draw":
        player1.score += POINTS_FOR_DRAW;
        player2.score += POINTS_FOR_DRAW;
        break;
        default://a bye
        player1.score += POINTS_FOR_BYE;
      }
      player1.played.push(player2.id);
      player2.played.push(player1.id);
    }
    if(gameFactory.numRounds == gameFactory.currentRoundNumber) {
      completeComp();
      gameFactory.activeTab = "results";
    }else{
      const nextRoundNumber = parseInt(gameFactory.currentRoundNumber) + 1;
      gameFactory.setupRound(nextRoundNumber);
    }
  }

  //completes a competition and generates the results
  function completeComp() {
      generateCountBack();
      gameFactory.finalOrder = players.sortPlayers(Object.keys(players.getAllPlayers()), "countBack");
      gameFactory.finalOrder = players.sortPlayers(gameFactory.finalOrder, "score");
      gameFactory.currentRoundNumber = 0;
  }

  // generates the countback for each player by adding the scores of all the players they have beaten
  function generateCountBack() {    
    for(let roundNumber in gameFactory.rounds){
      const round = gameFactory.rounds[roundNumber];
      for(let gameNumber in round.games){
        const game = round.games[gameNumber];
        const player1 =  players.getPlayerById(game.player1);
        const player2 =  players.getPlayerById(game.player2);
        switch (game.result) {
        case "Player 1 win":
          player1.countBack += player2.score;
          break;
        case "Player 2 win":
          player2.countBack += player1.score;
          break;
        case "Draw":
          player1.countBack += player2.score/2;
          player2.countBack += player1.score/2;
          break;
        default:
        }
      }
    }
  }

  // takes the comp's  state and puts it into an object that can be saved
  gameFactory.getSaveObj = function getSaveObj() {      
    const saveObj = {};
    saveObj.finalOrder = gameFactory.finalOrder;
    saveObj.pairingName = gameFactory.pairingName;
    saveObj.isInitialised = gameFactory.isInitialised;
    saveObj.numPlayers = gameFactory.numPlayers;
    saveObj.numRounds = gameFactory.numRounds;
    saveObj.title = gameFactory.title;
    saveObj.rounds = gameFactory.rounds;
    saveObj.currentRoundNumber = gameFactory.currentRoundNumber;
    saveObj.players = players.getAllPlayers();
    saveObj.activeTab =  gameFactory.activeTab;
    saveObj.savedOn = formatAMPM();
    return saveObj;
  }

  // sets all the game details from a save object that is passed in
  gameFactory.setFromSaveObj = function setFromSaveObj(saveObj) {
    gameFactory.finalOrder = saveObj.finalOrder;
    gameFactory.pairingName = saveObj.pairingName;
    gameFactory.isInitialised= saveObj.isInitialised;
    gameFactory.numPlayers= saveObj.numPlayers;
    gameFactory.numRounds= saveObj.numRounds;
    gameFactory.title= saveObj.title;
    gameFactory.rounds= saveObj.rounds;
    gameFactory.currentRoundNumber= saveObj.currentRoundNumber;
    players.setAllPlayers( saveObj.players);
    gameFactory.activeTab= saveObj.activeTab;
  }

  function formatAMPM() {
    const d = new Date(),
      minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
      hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
      ampm = d.getHours() >= 12 ? 'pm' : 'am',
      months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    return days[d.getDay()]+' '+months[d.getMonth()]+' '+d.getDate()+' '+d.getFullYear()+' '+hours+':'+minutes+ampm;
  }

  return gameFactory;
}

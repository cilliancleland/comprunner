
const POINTS_FOR_WIN = 3;
const POINTS_FOR_BYE = 3;
const POINTS_FOR_DRAW = 1;

compFactory.$inject = ['playersFactory','roundRobinFactory','swissChessFactory'];

angular.module('compRunner').factory('compFactory', compFactory);

function compFactory(players, roundRobin, swissChess){

  const compFactory = {};
  compFactory.rounds = {};
  
  // returns all properties to their empty defaults
  compFactory.init = function init(){ 
    compFactory.pairingName = 'swiss';
    compFactory.pairer = null;
    compFactory.activeTab = '';
    compFactory.isInitialised = false;
    compFactory.numPlayers = null;
    compFactory.numRounds = null;
    compFactory.title = null;
    players.resetPlayers();
    compFactory.currentRoundNumber = '0';
    compFactory.rounds = {};
    compFactory.finalOrder = [];
  };

  //initialises the comp and the players, and sets the tab to the players screen
  compFactory.getStarted = function getStarted(){
    compFactory.isInitialised = true;
    players.initPlayers(compFactory.numPlayers);
    compFactory.activeTab = 'players';      
  };

  // sets up the initial player order and the first round
  compFactory.setupFirstRound = function setupFirstRound() {
    initPairer();
    compFactory.setupRound('1');
  };
  
  function initPairer() {
    if(compFactory.pairingName === 'swiss'){
      compFactory.pairer = swissChess;
    }else{
      compFactory.pairer = roundRobin;
    }
    compFactory.pairer.init(players.getAllPlayers());
  }

  compFactory.swapPlayers = function swapPlayers(round, changedGame) {
    doSwap(changedGame.tmpPlayer1, changedGame.player1, changedGame, round);
    changedGame.player1 = changedGame.tmpPlayer1;
    doSwap(changedGame.tmpPlayer2, changedGame.player2, changedGame, round);
    changedGame.player2 = changedGame.tmpPlayer2;
    changedGame.isBeingEdited = false;
  };

  function doSwap(newPlayer, oldPlayer, changedGame, round){
    if(oldPlayer !== newPlayer){
      for(let gameNo in round.games) {
        if(round.games[gameNo].player1 === newPlayer){
          round.games[gameNo].player1 = oldPlayer;
        }
        if(round.games[gameNo].player2 === newPlayer){
          round.games[gameNo].player2 = oldPlayer;
        }
      }
    }
  }


  // sets up the games in a round
  // called when moving onto a new round
  compFactory.setupRound = function setupRound(newRoundNumber){
    compFactory.currentRoundNumber = newRoundNumber;
    compFactory.rounds[newRoundNumber] = compFactory.pairer.getNextRound(newRoundNumber);
    compFactory.activeTab = newRoundNumber;
  };
      
  // completes a round
  // called when finishing that round
  compFactory.completeRound = function completeRound() {
    const round = compFactory.rounds[compFactory.currentRoundNumber];

    for(let gameId in round.games){
      const game = round.games[gameId];
      const player1 =  players.getPlayerById(game.player1);
      const player2 =  players.getPlayerById(game.player2);
      switch (game.result) {
        case 'Player 1 win':
        player1.score += POINTS_FOR_WIN;
        break;
        case 'Player 2 win':
        player2.score += POINTS_FOR_WIN;
        break;
        case 'Draw':
        player1.score += POINTS_FOR_DRAW;
        player2.score += POINTS_FOR_DRAW;
        break;
        default://a bye
        if(game.player1 === 'bye') {
          player2.score += POINTS_FOR_BYE;
        }else{
          player1.score += POINTS_FOR_BYE;
        }
      }
      player1.played.push(player2.id);
      player2.played.push(player1.id);
    }
    if(compFactory.numRounds === compFactory.currentRoundNumber) {
      completeComp();
      compFactory.activeTab = 'results';
    }else{
      const nextRoundNumber = parseInt(compFactory.currentRoundNumber) + 1;
      compFactory.setupRound(nextRoundNumber);
    }
  };

  //completes a competition and generates the results
  function completeComp() {
      generateCountBack();
      compFactory.finalOrder = players.sortPlayers(Object.keys(players.getAllPlayers()));
      compFactory.currentRoundNumber = 0;
  }

  // generates the countback for each player by adding the scores of all the players they have beaten
  function generateCountBack() {    
    for(let roundNumber in compFactory.rounds){
      const round = compFactory.rounds[roundNumber];
      for(let gameNumber in round.games){
        const game = round.games[gameNumber];
        const player1 =  players.getPlayerById(game.player1);
        const player2 =  players.getPlayerById(game.player2);
        switch (game.result) {
        case 'Player 1 win':
          player1.countBack += player2.score;
          break;
        case 'Player 2 win':
          player2.countBack += player1.score;
          break;
        case 'Draw':
          player1.countBack += player2.score/2;
          player2.countBack += player1.score/2;
          break;
        default:
        }
      }
    }
  }

  // takes the comp's  state and puts it into an object that can be saved
  compFactory.getSaveObj = function getSaveObj() {      
    const saveObj = {};
    saveObj.finalOrder = compFactory.finalOrder;
    saveObj.pairingName = compFactory.pairingName;
    saveObj.isInitialised = compFactory.isInitialised;
    saveObj.numPlayers = compFactory.numPlayers;
    saveObj.numRounds = compFactory.numRounds;
    saveObj.title = compFactory.title;
    saveObj.rounds = compFactory.rounds;
    saveObj.currentRoundNumber = compFactory.currentRoundNumber;
    saveObj.players = players.getAllPlayers();
    saveObj.activeTab =  compFactory.activeTab;
    saveObj.savedOn = formatAMPM();
    saveObj.pairingDetails = compFactory.pairer.getSaveObj();
    return saveObj;
  };

  // sets all the game details from a save object that is passed in
  compFactory.setFromSaveObj = function setFromSaveObj(saveObj) {
    compFactory.finalOrder = saveObj.finalOrder;
    compFactory.pairingName = saveObj.pairingName;
    compFactory.isInitialised= saveObj.isInitialised;
    compFactory.numPlayers= saveObj.numPlayers;
    compFactory.numRounds= saveObj.numRounds;
    compFactory.title= saveObj.title;
    compFactory.rounds= saveObj.rounds;
    compFactory.currentRoundNumber= saveObj.currentRoundNumber;
    players.setAllPlayers( saveObj.players);
    compFactory.activeTab= saveObj.activeTab;
    compFactory.pairer.loadSave(saveObj.pairingDetails, players.getAllPlayers());
  };

  function formatAMPM() {
    const d = new Date(),
      minutes = d.getMinutes().toString().length === 1 ? '0'+d.getMinutes() : d.getMinutes(),
      hours = d.getHours().toString().length === 1 ? '0'+d.getHours() : d.getHours(),
      ampm = d.getHours() >= 12 ? 'pm' : 'am',
      months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    return days[d.getDay()]+' '+months[d.getMonth()]+' '+d.getDate()+' '+d.getFullYear()+' '+hours+':'+minutes+ampm;
  }

  return compFactory;
}

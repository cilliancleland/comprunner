(function(){
  "use strict";
  const POINTS_FOR_WIN = 3;
  const POINTS_FOR_BYE = 3;
  const POINTS_FOR_DRAW = 1;

  swissChess.factory("gameFactory", ["playersFactory", function(players){
    let playerOrder = [];
    
    const gameFactory = {};
    gameFactory.rounds = {};

    gameFactory.isStarted = function isStarted() {
      return playerOrder.length != 0;
    };
    
    // returns all properties to their empty defaults
    gameFactory.init = function init(){      
      gameFactory.activeTab = "";
      gameFactory.isInitialised = false;
      gameFactory.numPlayers = null;
      gameFactory.numRounds = null;
      gameFactory.title = null;
      players.resetPlayers();
      gameFactory.currentRoundNumber = "0";
      gameFactory.rounds = {};
      playerOrder = [];
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
      playerOrder = Object.keys(players.getAllPlayers());
      gameFactory.setupRound("1");
    }
    
    // sets up the games in a round
    // called when moving onto a new round
    gameFactory.setupRound = function setupRound(newRoundNumber){
      gameFactory.currentRoundNumber = newRoundNumber;
      gameFactory.rounds[newRoundNumber] = {roundNumber:newRoundNumber,games:{}};
      let currentRound = gameFactory.rounds[gameFactory.currentRoundNumber];
      players.shufflePlayers(playerOrder);
      
      let numGames = playerOrder.length /2;
      for(let i=0;i<numGames;i++){
      currentRound.games[i+1] = {
          gameNumber:i+1,
          player1:playerOrder[i],
          player2:playerOrder[playerOrder.length - i - 1],
          result: i === playerOrder.length - i - 1 ? 'bye' : ''
      };
      }
      gameFactory.activeTab = newRoundNumber;
    }
        
    // completes a round
    // called when finishing that round
    gameFactory.completeRound = function completeRound() {
      let round = gameFactory.rounds[gameFactory.currentRoundNumber];

      for(let gameId in round.games){
        let game = round.games[gameId];
        let player1 =  players.getPlayerById(game.player1);
        let player2 =  players.getPlayerById(game.player2);
        switch (game.result) {
          case "Player 1 win":
          player1.score += POINTS_FOR_WIN;
          break;
          case "Player 2 win":
          player2.score += POINTS_FOR_WIN;
          break;
          case "bye":
          player1.score += POINTS_FOR_BYE;
          break;
          default://a draw
          player1.score += POINTS_FOR_DRAW;
          player2.score += POINTS_FOR_DRAW;
        }
      }
      if(gameFactory.numRounds == gameFactory.currentRoundNumber) {
        completeComp();
        gameFactory.activeTab = "results";
      }else{
        let nextRoundNumber = parseInt(gameFactory.currentRoundNumber) + 1;
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
        let round = gameFactory.rounds[roundNumber];
        for(let gameNumber in round.games){
          let game = round.games[gameNumber];
          let player1 =  players.getPlayerById(game.player1);
          let player2 =  players.getPlayerById(game.player2);
          switch (game.result) {
          case "Player 1 win":
            player1.countBack += player2.score;
            break;
          case "Player 2 win":
            player2.countBack += player1.score;
            break;
          case "bye":
            break;
          default:
            player1.countBack += player2.score/2;
            player2.countBack += player1.score/2;
          }
        }
      }
    }

    // takes the comp's  state and puts it into an object that can be saved
    gameFactory.getSaveObj = function getSaveObj() {      
      let saveObj = {};
      saveObj.isInitialised = gameFactory.isInitialised;
      saveObj.numPlayers = gameFactory.numPlayers;
      saveObj.numRounds = gameFactory.numRounds;
      saveObj.title = gameFactory.title;
      saveObj.rounds = gameFactory.rounds;
      saveObj.currentRoundNumber = gameFactory.currentRoundNumber;
      saveObj.players = players.getAllPlayers();
      saveObj.activeTab =  gameFactory.activeTab;
      saveObj.playerOrder = playerOrder;
      saveObj.savedOn = Date.now();
      return saveObj;
    }

    // sets all the game details from a save object that is passed in
    gameFactory.setFromSaveObj = function setFromSaveObj(saveObj) {      
      gameFactory.isInitialised= saveObj.isInitialised;
      gameFactory.numPlayers= saveObj.numPlayers;
      gameFactory.numRounds= saveObj.numRounds;
      gameFactory.title= saveObj.title;
      gameFactory.rounds= saveObj.rounds;
      gameFactory.currentRoundNumber= saveObj.currentRoundNumber;
      players.setAllPlayers( saveObj.players);
      gameFactory.activeTab= saveObj.activeTab;       
      playerOrder = saveObj.playerOrder;
    }
    return gameFactory;
  }]);

})();
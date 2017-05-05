"use strict";
let swissChess = angular.module('swissChess', []);

swissChess.factory("playersFactory", [function(){
  let players = {};
  const playersFactory = {};

  playersFactory.sortPlayers = function sortPlayers(currentOrder, sortBy){
    return currentOrder.sort((a,b) => {
      return players[b][sortBy] - players.getPlayerById[a][sortBy];
    });
  };

  playersFactory.shufflePlayers = function shufflePlayers(currentOrder) {
    let modifier = currentOrder.length % 2 ? 1 : 2;//if an odd number of players, we need to adjust our shuffle, else the last player never gets a bye
    currentOrder.unshift(currentOrder[currentOrder.length-modifier]);
    currentOrder.splice(currentOrder.length-modifier, 1)
  };

  playersFactory.initPlayers = function initPlayers(numPlayers) {
    for(let i=0;i<numPlayers;i++){
      players[i+1]={id:i+1,score:0,countBack:0};
    }
  };

  playersFactory.resetPlayers = function resetPlayers() {
    players = {};
  };

  playersFactory.setAllPlayers = function setAllPlayers(newPlayers) {
    players = Object.assign({},newPlayers);
  };
  
  playersFactory.getAllPlayers = function getAllPlayers() {
    return players;
  };

  playersFactory.getPlayerById = function getPlayer(id) {
    return players[id];
  }

  return playersFactory;
}]);

swissChess.controller("mainCtrl",["$scope", "playersFactory",
function($scope,players){
  const POINTS_FOR_WIN = 3;
  const POINTS_FOR_BYE = 3;
  const POINTS_FOR_DRAW = 1;
  const SAVE_PROMPT = "Are you sure, this will overwrite your saved competition.\n\nPress ok to continue.";
  const LOAD_PROMPT = "Are you sure, this will overwrite all details of your current competition.\n\nPress ok to continue.";
  const DELETE_PROMPT = "Are you sure, this will delete your saved competition.\n\nPress ok to continue.";
  const RESET_PROMPT = "Are you sure, this will clear your current competition.\n\nPress ok to continue.";
  const SAVED_GAME_NAME = "savedComp";
  
  $scope.init = function init() {
    $scope.initialised = false;
    $scope.completed = false;
    $scope.currentRoundNumber = "0";
    $scope.numPlayers = 0;
    $scope.numRounds = 0;
    $scope.title = '';
    $scope.rounds = {};
    players.resetPlayers();
    $scope.activeTab = "";
    $scope.playerOrder = [];
    let savedGame = localStorage.getItem(SAVED_GAME_NAME);
    if(savedGame){
      let savedObj = JSON.parse(savedGame);
      $scope.saved = getSavedDetails(savedObj);
    }
  }

  $scope.reset = function reset(){
    if(!confirm(RESET_PROMPT)){
      return;
    }
    $scope.init();
  };

  function getSavedDetails(savedObj) {
    return `Competition ${savedObj.title} (${savedObj.numRounds} rounds : ${savedObj.numPlayers} players) saved on ${savedObj.savedOn}`;
  }

  $scope.deleteSave = function deleteSave(){
    if(!confirm(DELETE_PROMPT)){
      return;
    }
    localStorage.removeItem(SAVED_GAME_NAME);
    $scope.saved = false;
  };

  $scope.save = function save(){
    if($scope.saved && $scope.initialised){
      if(!confirm(SAVE_PROMPT)){
        return;
      }      
    }
    let saveObj = {};
    saveObj.initialised = $scope.initialised;
    saveObj.numPlayers = $scope.numPlayers;
    saveObj.numRounds = $scope.numRounds;
    saveObj.title = $scope.title;
    saveObj.rounds = $scope.rounds;
    saveObj.currentRoundNumber = $scope.currentRoundNumber;
    saveObj.players = players.getAllPlayers();
    saveObj.activeTab =  $scope.activeTab;
    saveObj.completed = $scope.completed;
    saveObj.playerOrder = $scope.playerOrder;
    saveObj.savedOn = Date.now();
    localStorage.setItem(SAVED_GAME_NAME, JSON.stringify(saveObj));
    $scope.saved =getSavedDetails(saveObj);
  };

  $scope.load = function load(){
    if($scope.initialised && !confirm(LOAD_PROMPT)){
      return;
    }
    let saveStr = localStorage.getItem(SAVED_GAME_NAME);
    let saveObj = JSON.parse(saveStr);

    $scope.initialised= saveObj.initialised;
    $scope.numPlayers= saveObj.numPlayers;
    $scope.numRounds= saveObj.numRounds;
    $scope.title= saveObj.title;
    $scope.rounds= saveObj.rounds;
    $scope.currentRoundNumber= saveObj.currentRoundNumber;
    debugger;
    players.setAllPlayers( saveObj.players);
    $scope.activeTab= saveObj.activeTab;
    $scope.completed= saveObj.completed;
    $scope.playerOrder= saveObj.playerOrder;

  };

  $scope.getAllPlayers = function getAllPlayers() {
    return players.getAllPlayers();
  };

  $scope.getStarted = function getStarted(numPlayers,numRounds,title){
    $scope.numPlayers = numPlayers;
    $scope.numRounds = numRounds;
    $scope.title = title;
    $scope.initialised = true;
    players.initPlayers(numPlayers);
    $scope.activeTab = "players"
  }
  
  $scope.setupFirstRound = function setupFirstRound() {
    $scope.playerOrder = Object.keys(players.getAllPlayers());
    $scope.setupRound("1");
  }
  
  $scope.setupRound = function setupRound(newRoundNumber){
    $scope.currentRoundNumber = newRoundNumber;
    $scope.rounds[newRoundNumber] = {roundNumber:newRoundNumber,games:{}};
    let currentRound = $scope.rounds[$scope.currentRoundNumber];
    players.shufflePlayers($scope.playerOrder);
    
    let numGames = $scope.playerOrder.length /2;
    
    for(let i=0;i<numGames;i++){
      currentRound.games[i+1] = {
        gameNumber:i+1,
        player1:$scope.playerOrder[i],
        player2:$scope.playerOrder[$scope.playerOrder.length - i - 1],
        result: i === $scope.playerOrder.length - i - 1 ? 'bye' : ''
      };
    }
    $scope.activeTab = newRoundNumber;
  }
    
  $scope.completeRound = function completeRound() {
    let round = $scope.rounds[$scope.currentRoundNumber];

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
        default:
          player1.score += POINTS_FOR_DRAW;
          player2.score += POINTS_FOR_DRAW;
      }
    }
    
    if($scope.numRounds == $scope.currentRoundNumber) {
      completeComp();
      $scope.activeTab = "results";
    }else{
      let nextRoundNumber = parseInt($scope.currentRoundNumber) + 1;
      $scope.setupRound(nextRoundNumber);
    }
  }

  function completeComp() {
      generateCountBack();
      $scope.finalOrder = players.sortPlayers(Object.keys(players.getAllPlayers()), "countBack");
      $scope.finalOrder = players.sortPlayers($scope.finalOrder, "score");
      $scope.currentRoundNumber = 0;
      $scope.completed = true;
  }

  function generateCountBack() {    
    for(let roundNumber in $scope.rounds){
      let round = $scope.rounds[roundNumber];
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

  $scope.showTab = function showTab(tab) {
    $scope.activeTab = tab;
  }

  $scope.init();
}]);

swissChess.directive("scMenu", function() {
  return {
    type: "E",
    templateUrl: "menu.html"
  };
});

swissChess.directive("scSetup", function() {    
  return {
    type: "E",
    scope: {
        runSetup: "&setup"
    },
    templateUrl:"setup.html"
  };
});

swissChess.directive("scPlayerDetails", function() {  
  return {
    type: "E",
    scope: {
      players:"=",
      setupFirstRound: "&",
      isStarted: "@"
    },
    templateUrl:"player-details.html"
  };
});

swissChess.directive("scRound", function() {
  return {
    type: "E",
    scope: {
      players:"=",
      round:"=",
      completeRound: "&",
      isCurrentRound: "@"
    },
    link: function(scope, element, attr) {
      scope.submit = function(){
        scope.roundForm.$setPristine();
        scope.roundForm.$setUntouched();
        scope.completeRound()
      }

    },
    templateUrl: "round/round.html"
  };
});

swissChess.directive("scResults", function() {
  return {
    type: "E",
    scope: {
      players: "=",
      finalOrder: "="
    },
    templateUrl: "results.html"
  };
});

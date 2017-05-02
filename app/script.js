"use strict";
var swissChess = angular.module('swissChess', []);

swissChess.factory("competitionFactory", [function(){
  let comp = {};

  


}]);

swissChess.controller("mainCtrl",["$scope",
function($scope){
  const POINTS_FOR_WIN = 3;
  const POINTS_FOR_BYE = 3;
  const POINTS_FOR_DRAW = 1;
  const SAVE_PROMPT = "Are you sure, this will overwrite your saved game.\n\nPress ok to continue.";
  const LOAD_PROMPT = "Are you sure, this will overwrite all details of your current game.\n\nPress ok to continue.";
  const DELETE_PROMPT = "Are you sure, this will deltee your saved game.\n\nPress ok to continue.";
  const SAVED_GAME_NAME = "savedComp";
  
  $scope.reset = function reset(){
    $scope.initialised = false;
    $scope.numPlayers = 0;
    $scope.numRounds = 0;
    $scope.title = '';
    $scope.rounds = {};
    $scope.currentRoundNumber = "0";
    $scope.players={};
    $scope.activeTab = "";
    $scope.completed = false;
    $scope.playerOrder = [];
    let savedGame = localStorage.getItem(SAVED_GAME_NAME);
    if(savedGame){
      let savedObj = JSON.parse(savedGame);
      $scope.saved = `Competition ${savedObj.title} (${savedObj.numRounds} rounds : ${savedObj.numPlayers} players) saved on ${savedObj.savedOn}`;
    }
  };

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
    saveObj.players = $scope.players;
    saveObj.activeTab =  $scope.activeTab;
    saveObj.completed = $scope.completed;
    saveObj.playerOrder = $scope.playerOrder;
    saveObj.savedOn = Date.now();
    localStorage.setItem(SAVED_GAME_NAME, JSON.stringify(saveObj));
    $scope.saved = true;
  };

  $scope.load = function load(){
    if(!confirm(LOAD_PROMPT)){
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
    $scope.players= saveObj.players;
    $scope.activeTab= saveObj.activeTab;
    $scope.completed= saveObj.completed;
    $scope.playerOrder= saveObj.playerOrder;

  };


  $scope.getStarted = function getStarted(numPlayers,numRounds,title){
    $scope.numPlayers = numPlayers;
    $scope.numRounds = numRounds;
    $scope.title = title;
    $scope.initialised = true;
    for(let i=0;i<numPlayers;i++){
      $scope.players[i+1]={id:i+1,score:0,countBack:0};
    }
    $scope.activeTab = "players"
  }
  
  $scope.setupFirstRound = function setupFirstRound() {
    $scope.playerOrder = Object.keys($scope.players);
    $scope.setupRound("1");
  }
  
  $scope.setupRound = function setupRound(newRoundNumber){
    $scope.currentRoundNumber = newRoundNumber;
    $scope.rounds[newRoundNumber] = {roundNumber:newRoundNumber,games:{}};
    let currentRound = $scope.rounds[$scope.currentRoundNumber];
    shufflePlayers();
    
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
      let player1 =  $scope.players[game.player1];
      let player2 =  $scope.players[game.player2];
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
      generateCountBack();
      $scope.finalOrder = sortPlayers(Object.keys($scope.players), "countBack");
      $scope.finalOrder = sortPlayers($scope.finalOrder, "score");
      $scope.currentRoundNumber = 0;
      $scope.completed = true;
      $scope.activeTab = "results";
    }else{
      let nextRoundNumber = parseInt($scope.currentRoundNumber) + 1;
      $scope.setupRound(nextRoundNumber);
    }
  }

  function generateCountBack() {    
    for(let roundNumber in $scope.rounds){
      let round = $scope.rounds[roundNumber];
      for(let gameNumber in round.games){
        let game = round.games[gameNumber];
        let player1 =  $scope.players[game.player1];
        let player2 =  $scope.players[game.player2];
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

  function shufflePlayers() {
    let modifier = $scope.playerOrder.length % 2 ? 1 : 2;//if an odd number of players, we need to adjust our shuffle, else the last player never gets a bye
    $scope.playerOrder.unshift($scope.playerOrder[$scope.playerOrder.length-modifier]);
    $scope.playerOrder.splice($scope.playerOrder.length-modifier, 1)
  }
  
  function sortPlayers(playersArr, sortBy){
    return playersArr.sort((a,b) => {
      return $scope.players[b][sortBy] - $scope.players[a][sortBy];
    });
  }
  
  $scope.showTab = function showTab(tab) {
    $scope.activeTab = tab;
  }

  $scope.reset();
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

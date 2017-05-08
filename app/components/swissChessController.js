(function(){

"use strict";

  const SAVE_PROMPT = "Are you sure, this will overwrite your saved competition.\n\nPress ok to continue.";
  const LOAD_PROMPT = "Are you sure, this will overwrite all details of your current competition.\n\nPress ok to continue.";
  const DELETE_PROMPT = "Are you sure, this will delete your saved competition.\n\nPress ok to continue.";
  const RESET_PROMPT = "Are you sure, this will clear your current competition.\n\nPress ok to continue.";
  const SAVED_GAME_NAME = "savedComp";

  swissChess.controller("swissChessCtrl",["$scope", "playersFactory", "gameFactory",
  function($scope, players, game){

    $scope.saved = false;

    // initialises the game and checks if there is a saved game that can be loaded
    $scope.init = function init() {
      game.init();
      let savedGame = localStorage.getItem(SAVED_GAME_NAME);
      if(savedGame){
        let savedObj = JSON.parse(savedGame);
        $scope.saved = getSavedDetails(savedObj);
      }
    }

    //reset the competition
    $scope.reset = function reset(){
      if(!confirm(RESET_PROMPT)){
        return;
      }
      $scope.init();
    };

    // reads some details of any save game
    function getSavedDetails(savedObj) {
        return `Competition ${savedObj.title} (${savedObj.numRounds} rounds : ${savedObj.numPlayers} players) saved on ${savedObj.savedOn}`;
    }

    // deletes a saved game
    $scope.deleteSave = function deleteSave(){
      if(!confirm(DELETE_PROMPT)){
        return;
      }
      localStorage.removeItem(SAVED_GAME_NAME);
      $scope.saved = false;
    };

    // saves the game details to local storage
    $scope.save = function save(){
      if($scope.saved && game.initialised && !confirm(SAVE_PROMPT)){
        return;
      }
      let saveObj = game.getSaveObj();
      localStorage.setItem(SAVED_GAME_NAME, JSON.stringify(saveObj));
      $scope.saved =getSavedDetails(saveObj);
    };

    // loads the game details from local storage
    $scope.load = function load(){
      if(game.isInitialised && !confirm(LOAD_PROMPT)){
        return;
      }
      let saveStr = localStorage.getItem(SAVED_GAME_NAME);      
      let saveObj = JSON.parse(saveStr);
      game.setFromSaveObj(saveObj);
    };

    //bind player functions
    $scope.getAllPlayers = function getAllPlayers() {
        return players.getAllPlayers();
    };

    //bind game
    $scope.game = game;

    $scope.showTab = function showTab(tab) {
        game.activeTab = tab;
    }

    //initialise the comp
    $scope.init();
  }]);

})();
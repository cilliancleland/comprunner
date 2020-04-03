const SAVE_PROMPT = 'Are you sure, this will overwrite your saved competition?\n\nPress ok to continue.';
const LOAD_PROMPT = 'Are you sure, this will overwrite all details of your current competition?\n\nPress ok to continue.';
const DELETE_PROMPT = 'Are you sure, this will delete your saved competition?\n\nPress ok to continue.';
const RESET_PROMPT = 'Are you sure, this will clear your current competition?\n\nPress ok to continue.';
const SAVED_COMP_NAME = 'savedComp';
compRunnerCtrl.$inject = ['$scope','playersFactory','compFactory'];

angular.module('compRunner').controller('compRunnerCtrl', compRunnerCtrl);


function compRunnerCtrl($scope, players, comp){

  $scope.saved = false;
  $scope.showAbout = false;

  $scope.toggleAbout = function toggleAbout(){
    $scope.showAbout = !$scope.showAbout;
  };

  // initialises the comp and checks if there is a saved comp that can be loaded
  $scope.init = function init() {
    comp.init();
    const savedComp = localStorage.getItem(SAVED_COMP_NAME);
    if(savedComp){
      const savedObj = JSON.parse(savedComp);
      $scope.saved = getSavedDetails(savedObj);
    }
  };

  //reset the competition
  $scope.reset = function reset(){
    if(!confirm(RESET_PROMPT)){
      return;
    }
    $scope.init();
  };

  // reads some details of any save comp
  function getSavedDetails(savedObj) {
      return `Competition ${savedObj.title} (${savedObj.numRounds} rounds : ${savedObj.numPlayers} players) Saved on ${savedObj.savedOn}`;
  }

  // deletes a saved comp
  $scope.deleteSave = function deleteSave(){
    if(!confirm(DELETE_PROMPT)){
      return;
    }
    localStorage.removeItem(SAVED_COMP_NAME);
    $scope.saved = false;
  };

  // saves the comp details to local storage
  $scope.save = function save(){
    if($scope.saved && comp.initialised && !confirm(SAVE_PROMPT)){
      return;
    }
    const saveObj = comp.getSaveObj();
    localStorage.setItem(SAVED_COMP_NAME, JSON.stringify(saveObj));
    $scope.saved = getSavedDetails(saveObj);
  };

  // loads the comp details from local storage
  $scope.load = function load(){
    if(comp.isInitialised && !confirm(LOAD_PROMPT)){
      return;
    }
    const saveStr = localStorage.getItem(SAVED_COMP_NAME);      
    const saveObj = JSON.parse(saveStr);
    comp.setFromSaveObj(saveObj);
  };

  //bind player functions
  $scope.getAllPlayers = function getAllPlayers() {
      return players.getAllPlayers();
  };

  //bind comp
  $scope.comp = comp;

  $scope.showTab = function showTab(tab) {
      comp.activeTab = tab;
  };

  //initialise the comp
  $scope.init();
}

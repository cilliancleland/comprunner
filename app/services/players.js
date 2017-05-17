angular.module('swissChess').factory("playersFactory", [function(){
    let players = {};
    let playersFactory = {};

    playersFactory.sortPlayers = function sortPlayers(currentOrder, sortBy){
      return currentOrder.sort((a,b) => {
        return players[b][sortBy] - players[a][sortBy];
      });
    };

    playersFactory.shufflePlayers = function shufflePlayers(currentOrder) {
      const modifier = currentOrder.length % 2 ? 1 : 2;//if an odd number of players, we need to adjust our shuffle, else the last player never gets a bye
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

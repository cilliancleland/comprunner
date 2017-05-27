angular.module('compRunner').factory("playersFactory", [function(){
    let players = {};
    let playersFactory = {};

    playersFactory.sortPlayers = function sortPlayers(currentOrder, sortBy){
      return currentOrder.sort((a,b) => {
        return players[b][sortBy] - players[a][sortBy];
      });
    };

    playersFactory.initPlayers = function initPlayers(numPlayers) {
      for(let i=0;i<numPlayers;i++){
        players[i+1]={id:i+1,score:0,countBack:0,name:"aaa",army:"a",played:[]};
      }
      if(numPlayers % 2 ){
        players['bye']={id:'bye',score:0,countBack:0,played:[]};
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

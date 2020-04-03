angular.module('compRunner').factory('playersFactory', [function(){
    let players = {};
    let playersFactory = {};

    playersFactory.sortPlayers = function sortPlayers(currentOrder, sortBy = ['score', 'countback', 'id']){
      let curSort = sortBy.shift();
      return currentOrder.sort((a,b) => {
        return doSort(a,b,curSort,sortBy);
      });
    };

    function doSort(a,b,curSort,sortBy) {
        if(players[b][curSort] === players[a][curSort] && sortBy.length > 0){
          curSort = sortBy.shift();
          return doSort(a,b,curSort,sortBy);
        }else{
          return players[b][curSort] - players[a][curSort];
        }
    }

    playersFactory.initPlayers = function initPlayers(numPlayers) {
      for(let i=0;i<numPlayers;i++){
        players[i+1]={id:i+1,score:0,countBack:0,name:'',army:'',played:[]};
      }
      if(numPlayers % 2 ){
        players['bye']={id:'bye',score:0,countBack:0,name:'bye',played:[]};
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
    };

    return playersFactory;
  }]);

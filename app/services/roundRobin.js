
angular.module('compRunner').factory("roundRobinFactory", [function(){
  const roundRobinFactory = {};

  roundRobinFactory.init = function init(allPlayers) {
    roundRobinFactory.playerOrder = Object.keys(allPlayers);
  };

  roundRobinFactory.getNextRound = function getNextRound(newRoundNumber) {
    const newRound = {roundNumber:newRoundNumber,games:{}};
    
    shufflePlayers(roundRobinFactory.playerOrder);
    const numGames = roundRobinFactory.playerOrder.length /2;
    for(let i=0;i<numGames;i++){
      newRound.games[i+1] = {
        gameNumber:i+1,
        player1:roundRobinFactory.playerOrder[i * 2],
        player2:roundRobinFactory.playerOrder[i * 2 + 1]
      };
    }

    return newRound;
  };

  function shufflePlayers(currentOrder) {
    currentOrder.unshift(currentOrder[currentOrder.length-2]);
    currentOrder.splice(currentOrder.length-2, 1)
  };

  return roundRobinFactory;
}]);



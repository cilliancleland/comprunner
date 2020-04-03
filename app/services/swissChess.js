
swissChessFactory.$inject = ['playersFactory'];

angular.module('compRunner').factory('swissChessFactory', swissChessFactory);
  
function swissChessFactory (players){
  const swissChessFactory = {};

  swissChessFactory.init = function init(allPlayers) {
    let numPlayers = Object.keys(allPlayers).length;
    swissChessFactory.arrPlayers = [0,1,2,3,4,5,6,7].slice(0, numPlayers);
    swissChessFactory.arrMatchups = [];
    recurMatch(swissChessFactory.arrPlayers,swissChessFactory.arrMatchups,[]);
  };

  swissChessFactory.getNextRound = function getNextRound(newRoundNumber) {
    // if there are more than 8 players, we have to do a different pairing algo.
    // else the code takes too long or crashes the browser while it is generating all the possible combos.
    //8 players should still mean that this is close enough to swiss chess.

    const newRound = {roundNumber:newRoundNumber,games:{}};
    const playerList = players.getAllPlayers();
    let playerIdList = Object.keys(playerList);
    players.sortPlayers(playerIdList);
    while(playerIdList.length > 8) {
      playerIdList = trimTopTwo(playerIdList, newRound);
    }
    //generate weights for remaining players (no more than 8)
    const playerWeights = generateWeights(playerIdList);
    const bestMatchupNumber = weighAllMatchups(swissChessFactory.arrMatchups, playerWeights, playerIdList);
    const bestMatchup = swissChessFactory.arrMatchups[bestMatchupNumber];
    for(let key in bestMatchup){      
      const player1 = playerIdList[bestMatchup[key]['1']];
      const player2 = playerIdList[bestMatchup[key]['2']];
      addGameToRound(newRound, player1, player2);
    }
    return newRound;
  };

  swissChessFactory.getSaveObj = function getSaveObj() {
    return {};
  };

  swissChessFactory.loadSave = function loadSave(saveObj, allPlayers) {
    swissChessFactory.init(allPlayers);
  };

  return swissChessFactory;

  function generateWeights(playerIdList) {    
    let playerWeights = {};
    for(let i = 0; i < playerIdList.length; i++){
      const player1Id = playerIdList[i];
      const player1 = players.getPlayerById(player1Id);
      playerWeights[player1Id] = {};
      for(let j = 0;j < playerIdList.length; j++){
        const player2Id = playerIdList[j];
        const player2 = players.getPlayerById(player2Id);
        //difference in score
        playerWeights[player1Id][player2Id] = Math.pow(Math.abs(player1.score - player2.score),2);
        //plus heaps if self
        if(i===j){
          playerWeights[player1Id][player2Id] += 1000000000;
        }
        //plus 10000 if they/ve already played
        if(player1.played.indexOf(player2.id) > -1){
          playerWeights[player1Id][player2Id] += 10000;
        }
      }
    }
    return playerWeights;
  }


  function weighAllMatchups(arrMatchups, playerWeights, playerIdList) {
    let bestWeightSoFar = calcWeight(arrMatchups[0], playerWeights, playerIdList);
    let bestMatchupSoFar = 0;
    for(let i = 1;i < arrMatchups.length; i++) {
      let thisWeight = calcWeight(arrMatchups[i], playerWeights, playerIdList);
      if(thisWeight < bestWeightSoFar){
        bestMatchupSoFar = i;
        bestWeightSoFar = thisWeight;
      }
      if(thisWeight === 0){
        break;
      }
    }
    return bestMatchupSoFar;
  }

  function calcWeight(matchup, weights, ids) {
    let weight = 0;
    for(let i=0; i < matchup.length; i++){
      const player1 = ids[matchup[i][1]];
      const player2 = ids[matchup[i][2]];
      weight += weights[player1][player2];
      weight += weights[player2][player1];
    }
    return weight;
  }

  function recurMatch (arrPlayers,arrMatchups,root) {
    if(arrPlayers.length===2){
      const newRoot = root.slice();
      newRoot.push({'1':arrPlayers[0],'2':arrPlayers[1]});
      arrMatchups.push(newRoot);
    }else{
      for(let k = 1; k < arrPlayers.length;k++){
        const newRoot = root.slice();
        newRoot.push({'1':arrPlayers[0],'2':arrPlayers[k]});
        const rest = arrPlayers.slice(1,k).concat(arrPlayers.slice(k+1));
        recurMatch(rest,arrMatchups,newRoot);
      }
    }
  }

  function trimTopTwo(playerIdList, newRound) {
    const player1Id = playerIdList[0];
    const player1 = players.getPlayerById(player1Id);
    let count = 1;
    let player2Id = playerIdList[count];
    let hasPlayed = player1.played.indexOf(player2Id);
    while(hasPlayed > -1){
      if(count === playerIdList.length){
        //top player has played everyone, just pair him with his neighbour
        player2Id = playerIdList[1];
        break;
      }else{
        count++;
        player2Id = playerIdList[count];
        hasPlayed = player1.played.indexOf(player2Id);
      }
    }
    addGameToRound(newRound, player1Id, player2Id);
    return playerIdList.filter(function(val) {
      return val !== player1Id && val !== player2Id;
    });
    
  }

  function addGameToRound(round, player1Id, player2Id) {
    let numGames = Object.keys(round.games).length + 1;

    round.games[numGames] = {
      gameNumber:numGames,
      player1:player1Id,
      player2:player2Id
    };
  }
}

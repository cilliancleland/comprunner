
swissChessFactory.$inject = ['playersFactory'];

angular.module('compRunner').factory("swissChessFactory", swissChessFactory);
  
function swissChessFactory (players){
  const swissChessFactory = {};

  swissChessFactory.init = function init(allPlayers) {
    swissChessFactory.arrPlayers = Object.keys(allPlayers);
    swissChessFactory.arrMatchups = [];
    recurMatch(swissChessFactory.arrPlayers,swissChessFactory.arrMatchups,[]);

    // let arrPlayers = Object.keys(allPlayers).length < 12 
    //   ? new Array(12)
    //   : new Array(Object.keys(allPlayers).length);
    // swissChessFactory.arrMatchups = [];
    // recurMatch(swissChessFactory.arrPlayers,swissChessFactory.arrMatchups,[]);

  };

  swissChessFactory.getNextRound = function getNextRound(newRoundNumber) {
    // if there are more than 12 players, we have to do a different pairing algo.
    // else the code takes too long or crashes the browser while it is generating all the possible combos.
    //12 players should still mean that this is close enough to swiss chess.

    const newRound = {roundNumber:newRoundNumber,games:{}};
//     const playerList = players.getAllPlayers();
//     let playerIdList = Object.keys(playerList);
// debugger;
// console.log('trimming');
//     sortPlayers(playerIdList, "score");
//     while(playerIdList.length > 12) {
//       trimTopTwo(playerIdList, newRound);
//       console.log('trimming');
//     }

    const playerWeights = generateWeights();
    const bestMatchupNumber = weighAllMatchups(swissChessFactory.arrMatchups, playerWeights);
    const bestMatchup = swissChessFactory.arrMatchups[bestMatchupNumber];
    for(let key in bestMatchup){
      const matchNo = key + 1;
      newRound.games[matchNo] = {
        gameNumber:matchNo,
        player1:bestMatchup[matchNo]['1'],
        player2:bestMatchup[matchNo]['2']
      };
    }
    return newRound;
  };

  return swissChessFactory;

  function generateWeights() {
    // let playersArr = players.sortPlayers(Object.keys(players.getAllPlayers()), "score");
    let playersArr = Object.keys(players.getAllPlayers());
    let playerWeights = {};
    for(let i = 0; i < playersArr.length; i++){
      const player1Id = playersArr[i]
      const player1 = players.getPlayerById(player1Id);
      playerWeights[player1Id] = {};
      for(let j = 0;j < playersArr.length; j++){
        const player2Id = playersArr[j];
        const player2 = players.getPlayerById(player2Id);
        //difference in score
        playerWeights[player1Id][player2Id] = Math.abs(player1.score - player2.score);
        //plus 10k if self
        if(i===j){
          playerWeights[player1Id][player2Id] += 10000;
        }
        //plus 50 if they/ve already played
        if(player1.played.indexOf(player2.id) > -1){
          playerWeights[player1Id][player2Id] += 50;
        }
      }
    }
    return playerWeights;
  }


  function weighAllMatchups(arrMatchups, playerWeights) {
    let bestWeightSoFar = calcWeight(arrMatchups[0], playerWeights);
    let bestMatchupSoFar = 0;
    for(let i = 1;i < arrMatchups.length; i++) {
      let thisWeight = calcWeight(arrMatchups[i], playerWeights);
      if(thisWeight < bestWeightSoFar){
        console.log("--------" + i + '--' + thisWeight + '--' + bestWeightSoFar);
        bestMatchupSoFar = i;
        bestWeightSoFar = thisWeight;
      }
      if(thisWeight === 0){
        break;
      }
    }
    return bestMatchupSoFar;
  }

  function calcWeight(matchup, weights) {
    let weight = 0;
    for(let i=0; i < matchup.length; i++){
      const player1 = matchup[i][1];
      const player2 = matchup[i][2];
      weight += weights[player1][player2];
      weight += weights[player2][player1];
    }
    return weight;
  }

  function recurMatch (arrPlayers,arrMatchups,root) {
    if(arrPlayers.length===2){
      const newRoot = root.slice();
      newRoot.push({"1":arrPlayers[0],"2":arrPlayers[1]});
      arrMatchups.push(newRoot);
      // console.log(arrMatchups.length);
    }else{
      for(let k = 1; k < arrPlayers.length;k++){
        const newRoot = root.slice();
        newRoot.push({"1":arrPlayers[0],"2":arrPlayers[k]});
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
    while(hasPlayed < 0){
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
    playerIdList = playerIdList.filter(function(val) {
      return val != player1Id && val != player2Id;
    });
  }

  function addGameToRound(round, player1Id, player2Id) {
    let numGames = Object.keys(round.games).length;

    round.games[numGames] = {
      gameNumber:numGames,
      player1:player1Id,
      player2:player2Id
    };
  }


}
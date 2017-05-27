'use strict';

describe('game factory', function() {
  let playersFactory, gameFactory, game;

  const saveObj = JSON.parse(`{
    "isInitialised":true,
    "numPlayers":4,
    "numRounds":4,
    "title":"test",
    "rounds":{
      "1":{"roundNumber":"1","games":{"1":{"gameNumber":1,"player1":"3","player2":"4","result":"Player 1 win"},"2":{"gameNumber":2,"player1":"1","player2":"2","result":"Player 1 win"}}},
      "2":{"roundNumber":2,"games":{"1":{"gameNumber":1,"player1":"2","player2":"4","result":""},"2":{"gameNumber":2,"player1":"3","player2":"1","result":""}}}},
    "currentRoundNumber":2,
    "players":{
      "1":{"id":1,"score":3,"countBack":0,"name":"aaaa","army":"a"},
      "2":{"id":2,"score":0,"countBack":0,"name":"bbbb","army":"b"},
      "3":{"id":3,"score":3,"countBack":0,"name":"cccc","army":"c"},
      "4":{"id":4,"score":0,"countBack":0,"name":"dddd","army":"d"}
    },
    "activeTab":2,
    "playerOrder":["2","3","1","4"],
    "savedOn":1494048622028}`
  );

  beforeEach(angular.mock.module('compRunner'));

  beforeEach(inject(function(_gameFactory_,_playersFactory_) {
    gameFactory = _gameFactory_;
    playersFactory = _playersFactory_;

    spyOn(playersFactory, 'resetPlayers');
    spyOn(playersFactory, 'initPlayers');
    spyOn(playersFactory, 'setAllPlayers');
    spyOn(playersFactory, 'sortPlayers').and.callFake(function() {
      return [ '1', '2', '3', '4' ];
    });

    spyOn(playersFactory, 'getAllPlayers').and.callFake(function() {
      return { 
        1: { id:1, score: 4, countBack: 0 }, 
        2: { id:2, score: 2, countBack: 0 }, 
        3: { id:3, score: 1, countBack: 0 }, 
        4: { id:4, score: 3, countBack: 0 } 
      };
    });
    spyOn(playersFactory, 'getPlayerById').and.callFake(function() {
      return {"id":4,"score":0,"countBack":0,"name":"dddd","army":"d"};
    });
  }));

  it('should exist', function() {
    expect(gameFactory).toBeDefined();
  });

  it('should initialise correctly', function() {    
    gameFactory.init();
    expect(gameFactory.activeTab).toEqual("");
    expect(gameFactory.isInitialised).toEqual(false);
    expect(gameFactory.numPlayers).toEqual(null);
    expect(gameFactory.numRounds).toEqual(null);
    expect(gameFactory.title).toEqual(null);
    expect(playersFactory.resetPlayers).toHaveBeenCalled();
    expect(gameFactory.currentRoundNumber).toEqual("0");
    expect(gameFactory.rounds).toEqual({});
    expect(gameFactory.finalOrder).toEqual([]);
  });

  it('should getStarted correctly', function() {
    gameFactory.numPlayers = 4;
    gameFactory.getStarted();
    expect(gameFactory.isInitialised).toEqual(true);
    expect(playersFactory.initPlayers).toHaveBeenCalledWith(4);
    expect(gameFactory.activeTab).toEqual("players");
  });

  it('should setupFirstRound correctly', function() {
    spyOn(gameFactory, 'setupRound');
    gameFactory.setupFirstRound();
    expect(playersFactory.getAllPlayers).toHaveBeenCalled();
    expect(gameFactory.setupRound).toHaveBeenCalledWith("1");
  });

  it('should setupRound correctly', function() {
    gameFactory.setFromSaveObj(saveObj);
    gameFactory.setupRound(3);
    const newRound = gameFactory.rounds[3];
    expect(newRound.roundNumber).toEqual(3);
    expect(newRound.games["1"].player1).toEqual('1');
    expect(newRound.games["1"].player2).toEqual('4');
    expect(newRound.games["2"].player1).toEqual('2');
    expect(newRound.games["2"].player2).toEqual('3');    
    expect(newRound.games["3"]).toEqual(undefined);
  });

  it('should completeRound correctly for middle round', function() {
    gameFactory.setFromSaveObj(saveObj);
    gameFactory.completeRound();
    const round = gameFactory.rounds[3];
    expect(gameFactory.currentRoundNumber).toEqual(3);
    expect(gameFactory.activeTab).toEqual(3);
    expect(round.games['1'].player1).toEqual('3');
    expect(round.games['1'].player2).toEqual('4');
    expect(round.games['2'].player1).toEqual('1');
    expect(round.games['2'].player2).toEqual('2');
  });

  it('should completeRound correctly for last round', function() {
    const newSaveObj = Object.assign({}, saveObj, {numRounds:2});
    gameFactory.setFromSaveObj(newSaveObj);
    gameFactory.completeRound();

    expect(gameFactory.currentRoundNumber).toEqual(0);
    expect(gameFactory.activeTab).toEqual('results');
    expect(playersFactory.sortPlayers).toHaveBeenCalled();
  });


  it('should setFromSaveObj correctly', function() {
    gameFactory.setFromSaveObj(saveObj);
    expect(gameFactory.isInitialised).toEqual(true);
    expect(gameFactory.numPlayers).toEqual(4);
    expect(gameFactory.numRounds).toEqual(4);
    expect(gameFactory.title).toEqual("test");
    expect(gameFactory.rounds).toEqual(saveObj.rounds);
    expect(gameFactory.currentRoundNumber).toEqual(2);
    expect(gameFactory.activeTab).toEqual(2);
    expect(playersFactory.setAllPlayers).toHaveBeenCalled();
  });

  it('should getSaveObj correctly', function() {    
    gameFactory.setFromSaveObj(saveObj);
    const newSaveObj = gameFactory.getSaveObj();
    expect(saveObj.isInitialised).toEqual(gameFactory.isInitialised);
    expect(saveObj.numPlayers).toEqual(gameFactory.numPlayers);
    expect(saveObj.numRounds).toEqual(gameFactory.numRounds);
    expect(saveObj.title).toEqual(gameFactory.title);
    expect(saveObj.rounds).toEqual(gameFactory.rounds);
    expect(saveObj.currentRoundNumber).toEqual(gameFactory.currentRoundNumber);
    expect(saveObj.activeTab).toEqual(gameFactory.activeTab);
    expect(playersFactory.getAllPlayers).toHaveBeenCalled();
  });

  
});